"""Small, dependency-free JSON persistence for portfolio form data and analytics."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from threading import Lock
from typing import Any


class LocalStore:
    def __init__(self, path: Path):
        self.path = path
        self._lock = Lock()

    def initialize(self) -> None:
        with self._lock:
            if not self.path.exists():
                self._write({"contacts": [], "events": []})

    def add_contact(self, contact: dict[str, Any]) -> None:
        with self._lock:
            data = self._read()
            data["contacts"].append(contact)
            self._write(data)

    def list_contacts(self) -> list[dict[str, Any]]:
        with self._lock:
            return sorted(self._read()["contacts"], key=lambda item: item["created_at"], reverse=True)[:500]

    def add_event(self, event: dict[str, Any]) -> None:
        with self._lock:
            data = self._read()
            data["events"].append(event)
            self._write(data)

    def stats(self) -> dict[str, Any]:
        with self._lock:
            data = self._read()
            return {
                "events": dict(Counter(event["type"] for event in data["events"])),
                "messages": len(data["contacts"]),
            }

    def _read(self) -> dict[str, list[dict[str, Any]]]:
        if not self.path.exists():
            return {"contacts": [], "events": []}
        with self.path.open(encoding="utf-8") as file:
            return json.load(file)

    def _write(self, data: dict[str, list[dict[str, Any]]]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = self.path.with_suffix(".tmp")
        with temporary_path.open("w", encoding="utf-8") as file:
            json.dump(data, file, ensure_ascii=False, indent=2)
        temporary_path.replace(self.path)
