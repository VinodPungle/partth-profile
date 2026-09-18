import { useState } from "react";
import { Github, Linkedin, Loader2, Mail, MapPin, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { Section, Reveal } from "./Section";
import { sendContact, trackEvent } from "@/lib/api";

const EMPTY = { name: "", email: "", subject: "", message: "" };

const validate = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Please enter a valid email.";
  if (f.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  return e;
};

const Field = ({ label, id, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-[#ff8a65]" data-testid={`contact-${id}-error`}>{error}</p>}
  </div>
);

const inputCls = "w-full rounded-xl border border-border bg-black/30 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--cyan)]/60 focus:ring-2 focus:ring-[var(--cyan)]/20";

export const Contact = ({ profile }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    try {
      await sendContact(form);
      toast.success("Message sent — I'll get back to you soon.");
      setForm(EMPTY);
      setSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || "Couldn't send message. Please email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="contact" index="06" title="Contact" lede="For internships, collaborations, or a conversation about agentic systems — send a note or email directly.">
      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="card-glow rounded-2xl p-6 sm:p-8 lg:col-span-3">
          <form onSubmit={submit} noValidate className="space-y-5" data-testid="contact-form">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" id="name" error={errors.name}>
                <input id="name" value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} data-testid="contact-name-input" />
              </Field>
              <Field label="Email" id="email" error={errors.email}>
                <input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" className={inputCls} data-testid="contact-email-input" />
              </Field>
            </div>
            <Field label="Subject (optional)" id="subject">
              <input id="subject" value={form.subject} onChange={set("subject")} placeholder="Summer 2027 internship" className={inputCls} data-testid="contact-subject-input" />
            </Field>
            <Field label="Message" id="message" error={errors.message}>
              <textarea id="message" rows={5} value={form.message} onChange={set("message")} placeholder="Tell me about the role or the problem you're solving…" className={`${inputCls} resize-none`} data-testid="contact-message-input" />
            </Field>
            <button type="submit" disabled={sending} data-testid="contact-submit-btn" className="inline-flex items-center gap-2 rounded-full bg-[var(--ember)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60">
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} {sending ? "Sending…" : "Send message"}
            </button>
            {sent && <p className="text-xs text-[#6ee7b7]" data-testid="contact-success-note">Thanks — your message is saved. I reply within a day or two.</p>}
          </form>
        </Reveal>

        <Reveal delay={0.1} className="card-glow flex flex-col justify-between rounded-2xl p-6 sm:p-8 lg:col-span-2">
          <div>
            <p className="eyebrow mb-4">Direct</p>
            <a href={`mailto:${profile.email}`} data-testid="contact-email-link" className="font-display text-xl font-bold text-white underline-offset-4 hover:underline sm:text-2xl break-all">{profile.email}</a>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-testid="contact-linkedin-link" className="inline-flex items-center gap-3 hover:text-white"><Linkedin size={16} /> linkedin.com/in/parth-pungle</a></li>
              <li><a href={profile.github} target="_blank" rel="noopener noreferrer" data-testid="contact-github-link" className="inline-flex items-center gap-3 hover:text-white"><Github size={16} /> github.com/parthpungle</a></li>
              <li className="inline-flex items-center gap-3"><MapPin size={16} /> {profile.location}</li>
              <li className="inline-flex items-center gap-3"><Mail size={16} /> {profile.availability_detail}</li>
            </ul>
          </div>
          <a href={profile.resume_url} download onClick={() => trackEvent("resume_download", "contact")} data-testid="contact-resume-link" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[var(--cyan)]/50">
            <Download size={15} /> Download resume (PDF)
          </a>
        </Reveal>
      </div>
    </Section>
  );
};
