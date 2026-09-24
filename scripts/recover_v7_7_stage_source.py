#!/usr/bin/env python3
"""Recover text sources embedded in the committed v7.7 playtest ZIP.

This is a provenance/recovery utility only. It does not promote v7.7 rules to
v7.9 automatically; recovered files must be reviewed before migration.
"""
from pathlib import Path
import zipfile

ZIP_PATH = Path("releases/v7.7/Haute_Hazard_v7.7_Core_Playtest_Set.zip")
OUT_DIR = Path("archive/v7.7-extracted")

WANTED_SUFFIXES = (
    "Haute_Hazard_v7.7_Stage_Judges.csv",
    "Haute_Hazard_Core_Rulebook_v7.7_PLAYTEST.md",
    "Haute_Hazard_Playtest_Card_List_v7.7.csv",
    "PRINT_ME_FIRST.txt",
    "PLAYTEST_CHECKLIST.txt",
)

def main() -> int:
    if not ZIP_PATH.exists():
        raise SystemExit(f"Missing source ZIP: {ZIP_PATH}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    recovered = []

    with zipfile.ZipFile(ZIP_PATH) as zf:
        names = zf.namelist()
        for suffix in WANTED_SUFFIXES:
            matches = [n for n in names if n.endswith(suffix)]
            if not matches:
                print(f"NOT FOUND: {suffix}")
                continue
            src = matches[-1]
            data = zf.read(src)
            dest = OUT_DIR / suffix
            dest.write_bytes(data)
            recovered.append((src, dest, len(data)))
            print(f"RECOVERED: {src} -> {dest} ({len(data)} bytes)")

    manifest = OUT_DIR / "README.md"
    lines = [
        "# Recovered v7.7 text sources",
        "",
        "These files were extracted automatically from the committed",
        "`releases/v7.7/Haute_Hazard_v7.7_Core_Playtest_Set.zip`.",
        "",
        "**Important:** recovery does not make these files canonical v7.9 rules.",
        "They are provenance sources for verifying/migrating Stage and rules text.",
        "",
        "Recovered files:",
    ]
    for src, dest, size in recovered:
        lines.append(f"- `{dest.name}` - {size} bytes - source `{src}`")
    manifest.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
