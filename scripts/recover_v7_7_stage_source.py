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

STAGE_PDF_SUFFIXES = (
    "Haute_Hazard_v7.7_Stage_Cards_FRONTS_Letter_9up.pdf",
    "Haute_Hazard_v7.7_Stage_Cards_DUPLEX_READY_Letter.pdf",
)

def extract_pdf_text(data: bytes, output: Path) -> bool:
    try:
        from pypdf import PdfReader
        from io import BytesIO
        reader = PdfReader(BytesIO(data))
        parts = []
        for i, page in enumerate(reader.pages, 1):
            txt = page.extract_text() or ""
            parts.append(f"--- PAGE {i} ---\n{txt.strip()}\n")
        output.write_text("\n".join(parts), encoding="utf-8")
        return True
    except Exception as exc:
        print(f"PDF TEXT EXTRACTION FAILED for {output.name}: {exc}")
        return False

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

        for suffix in STAGE_PDF_SUFFIXES:
            matches = [n for n in names if n.endswith(suffix)]
            if not matches:
                print(f"NOT FOUND: {suffix}")
                continue
            src = matches[-1]
            data = zf.read(src)
            out_name = Path(suffix).stem + "_TEXT.txt"
            dest = OUT_DIR / out_name
            if extract_pdf_text(data, dest):
                recovered.append((src, dest, dest.stat().st_size))
                print(f"RECOVERED TEXT: {src} -> {dest}")

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
