"""Backend API tests for Portfolio app."""
import os
from pathlib import Path
import re
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://127.0.0.1:8000').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Portfolio ----------
class TestPortfolio:
    def test_get_portfolio_200(self, session):
        r = session.get(f"{API}/portfolio", timeout=15)
        assert r.status_code == 200
        data = r.json()
        for k in ("profile", "education", "skills", "featured_projects", "more_projects", "certifications", "achievements"):
            assert k in data, f"Missing key: {k}"
        assert "_id" not in data

    def test_portfolio_shape(self, session):
        d = session.get(f"{API}/portfolio", timeout=15).json()
        assert len(d["skills"]) == 3
        skill_ids = {s["id"] for s in d["skills"]}
        assert {"ai", "languages", "tools"} <= skill_ids
        feat_ids = [p["id"] for p in d["featured_projects"]]
        assert feat_ids == ["multi-agent", "finpal", "tutor"]
        more_ids = [p["id"] for p in d["more_projects"]]
        assert more_ids == ["azure-foundry", "tracechain", "edutrack", "cloudsnip"]
        assert len(d["certifications"]) == 5
        assert "AI-900" in d["certifications"][0]["name"]
        assert len(d["achievements"]) == 1

    def test_no_vin_chat_anywhere(self, session):
        r = session.get(f"{API}/portfolio", timeout=15)
        assert not re.search(r"vin\s*chat", r.text, re.IGNORECASE), "Vin Chat found in portfolio!"

    def test_featured_projects_architecture(self, session):
        d = session.get(f"{API}/portfolio", timeout=15).json()
        expected_layers = {"multi-agent": 5, "finpal": 4, "tutor": 5}
        for p in d["featured_projects"]:
            assert "architecture" in p, f"Missing architecture in {p['id']}"
            arch = p["architecture"]
            assert "caption" in arch and isinstance(arch["caption"], str) and arch["caption"]
            assert "layers" in arch and len(arch["layers"]) == expected_layers[p["id"]]
            for layer in arch["layers"]:
                assert "label" in layer and "nodes" in layer
                for n in layer["nodes"]:
                    assert "name" in n
        # spot check hot nodes and layer labels
        ma = next(p for p in d["featured_projects"] if p["id"] == "multi-agent")
        labels = [l["label"] for l in ma["architecture"]["layers"]]
        assert labels == ["Client", "API", "Agent runtime", "Typed provider interfaces", "Vendor adapters (1 package)"]
        assert any(n.get("hot") and n["name"] == "Tool loop with call budgets" for l in ma["architecture"]["layers"] for n in l["nodes"])
        fp = next(p for p in d["featured_projects"] if p["id"] == "finpal")
        split = next(l for l in fp["architecture"]["layers"] if l["label"] == "Split")
        assert any(n.get("hot") and "Deterministic rules engine" in n["name"] for n in split["nodes"])
        tu = next(p for p in d["featured_projects"] if p["id"] == "tutor")
        assert any(n.get("hot") and n["name"] == "Life-sciences specialist — mandatory for biotech"
                   for l in tu["architecture"]["layers"] for n in l["nodes"])




# ---------- Contact ----------
class TestContact:
    def test_contact_invalid_422(self, session):
        r = session.post(f"{API}/contact", json={"name": "x", "email": "bad", "message": "short"})
        assert r.status_code == 422

    def test_contact_create_and_list(self, session):
        payload = {
            "name": "TEST_Playwright Bot",
            "email": "test_bot@example.com",
            "subject": "Hi from tests",
            "message": "This is an automated regression test message ensuring persistence."
        }
        r = session.post(f"{API}/contact", json=payload)
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["id"] and body["created_at"]
        assert body["read"] is False
        assert body["email"] == payload["email"]

        lst = session.get(f"{API}/contact", timeout=15)
        assert lst.status_code == 200
        items = lst.json()
        assert any(i["id"] == body["id"] for i in items)
        # newest first: our record should be at index 0 (immediately after create)
        assert items[0]["email"] == payload["email"]


# ---------- Events + Stats ----------
class TestEvents:
    def test_track_event(self, session):
        r = session.post(f"{API}/events", json={"type": "resume_download", "label": "nav"})
        assert r.status_code == 201

    def test_stats(self, session):
        r = session.get(f"{API}/stats", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "events" in d and "messages" in d
        assert isinstance(d["events"], dict)
        assert d["events"].get("resume_download", 0) >= 1
        assert d["messages"] >= 1


# ---------- Resume PDF ----------
# The resume is a frontend build artifact, not an API resource. Backend and frontend no
# longer share an origin (the static site has no backend at all), so this checks the file
# the build ships. Set FRONTEND_URL to additionally verify it over HTTP on a running site.
class TestStatic:
    def test_resume_pdf_present_in_frontend_assets(self):
        resume = Path(__file__).resolve().parents[2] / "frontend" / "public" / "assets" / "resume.pdf"
        assert resume.is_file(), f"Missing resume asset: {resume}"
        assert resume.stat().st_size > 1024, "resume.pdf looks empty"

    def test_resume_pdf_reachable_on_running_frontend(self, session):
        frontend_url = os.environ.get("FRONTEND_URL")
        if not frontend_url:
            pytest.skip("FRONTEND_URL not set; skipping live frontend asset check")
        r = session.get(f"{frontend_url.rstrip('/')}/assets/resume.pdf", timeout=15)
        assert r.status_code == 200
