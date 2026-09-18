from pathlib import Path

from storage import LocalStore


def test_local_store_persists_contacts_events_and_stats(tmp_path: Path):
    store = LocalStore(tmp_path / "portfolio-data.json")
    store.initialize()
    store.add_contact({"id": "older", "created_at": "2026-01-01T00:00:00+00:00"})
    store.add_contact({"id": "newer", "created_at": "2026-01-02T00:00:00+00:00"})
    store.add_event({"type": "resume_download"})
    store.add_event({"type": "resume_download"})
    store.add_event({"type": "project_link"})

    reloaded_store = LocalStore(tmp_path / "portfolio-data.json")
    assert [contact["id"] for contact in reloaded_store.list_contacts()] == ["newer", "older"]
    assert reloaded_store.stats() == {
        "events": {"resume_download": 2, "project_link": 1},
        "messages": 2,
    }
