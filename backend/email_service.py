import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                                 headers={"X-Email-Key": EMAIL_KEY}, json=payload)
    resp.raise_for_status()
    return resp.json().get("id")


def contact_alert_html(msg: dict) -> str:
    name, email = escape(msg["name"]), escape(msg["email"])
    subject = escape(msg.get("subject") or "(no subject)")
    body = escape(msg["message"]).replace("\n", "<br>")
    return (
        '<table role="presentation" width="100%" style="background:#090a0f;padding:24px 0">'
        '<tr><td align="center"><table role="presentation" width="560" style="background:#12141f;'
        'border:1px solid #22273a;border-radius:16px;font-family:Arial,sans-serif;color:#f3f4f6">'
        '<tr><td style="padding:28px 32px">'
        '<p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;color:#00e5ff">NEW PORTFOLIO MESSAGE</p>'
        f'<h1 style="margin:0 0 20px;font-size:22px">{subject}</h1>'
        f'<p style="margin:0 0 4px;color:#9ca3af;font-size:13px">From</p>'
        f'<p style="margin:0 0 16px;font-size:15px"><strong>{name}</strong> &lt;'
        f'<a href="mailto:{email}" style="color:#00e5ff">{email}</a>&gt;</p>'
        f'<p style="margin:0 0 4px;color:#9ca3af;font-size:13px">Message</p>'
        f'<p style="margin:0 0 24px;font-size:15px;line-height:1.6;background:#0b0d15;padding:16px;'
        f'border-radius:10px;border:1px solid #22273a">{body}</p>'
        f'<p style="margin:0;font-size:12px;color:#6b7280">Received {escape(msg["created_at"][:19].replace("T", " "))} UTC · '
        f'Reply directly to the sender using the address above.</p>'
        f'<p style="margin:16px 0 0;font-size:11px;color:#6b7280">Sent by {escape(EMAIL_FROM_NAME)}.</p>'
        '</td></tr></table></td></tr></table>'
    )


async def notify_owner_of_contact(msg: dict) -> None:
    try:
        email_id = await send_email(
            to=OWNER_EMAIL,
            subject=f"New portfolio message from {msg['name']}",
            html=contact_alert_html(msg),
        )
        logger.info("Contact alert emailed to owner (id=%s)", email_id)
    except Exception as e:
        logger.error("Contact alert email failed: %s", e)
