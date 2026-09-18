"""Export PORTFOLIO to a flat JSON file the static build serves without a backend.

GitHub Pages cannot run FastAPI, so the production build reads this file instead of
calling GET /api/portfolio. `seed_data.py` stays the single source of truth: run this
whenever content changes (the frontend `yarn build` runs it automatically).

    python export_static.py [output_path]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from seed_data import PORTFOLIO

DEFAULT_OUTPUT = Path(__file__).parent.parent / "frontend" / "public" / "portfolio.json"


def export(output_path: Path) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as file:
        json.dump(PORTFOLIO, file, ensure_ascii=False, indent=2)
        file.write("\n")
    return output_path


if __name__ == "__main__":
    destination = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUTPUT
    written = export(destination)
    print(f"Wrote {written} ({written.stat().st_size:,} bytes)")
