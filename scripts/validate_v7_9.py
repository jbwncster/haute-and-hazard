#!/usr/bin/env python3
"""Validate Haute & Hazard v7.9 canonical source data.

Standard-library only so it can run locally or in GitHub Actions.
"""

from __future__ import annotations

import csv
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CARD_CSV = ROOT / "data" / "v7_9_card_database.csv"
QUEEN_CSV = ROOT / "data" / "v7_9_queen_database.csv"
STAGE_REGISTRY_CSV = ROOT / "data" / "v7_9_stage_registry.csv"
STAGE_DATABASE_CSV = ROOT / "data" / "v7_9_stage_database.csv"

EXPECTED_COMPONENTS = {"Starter": 60, "Wardrobe": 144, "Thrift": 16, "Penalty": 20}
EXPECTED_BRANDS = {
    "Sugar Rush": 20, "Hyper-Glitch": 10, "Necropolis": 15, "Slasher": 10,
    "Void": 10, "Velvet Trap": 20, "Gilded Cage": 10, "Trash Can": 15,
    "Big Top": 10, "Swamp Witch": 10,
}
EXPECTED_STARTERS = {"Basic Beat": 35, "Messy Lip Sync": 15, "Chapstick": 10}
EXPECTED_STAGE_TENETS = {"Pink": 3, "Blue": 3, "Purple": 3, "Yellow": 3}
EXPECTED_STAGE_NAMES = {
    "Grand Ballroom", "Neon Nightclub", "Haunted Hotel", "Botanical Conservatory",
    "Thrift Superstore", "Gothic Cathedral", "Opera House", "Underground Leather Bar",
    "Candy Kingdom Pavilion", "Seaside Boardwalk Stage", "Couture House Runway",
    "Blacklight Arcade",
}
STAGE_REQUIRED_FIELDS = [
    "stage_id", "stage_name", "subtitle", "favored_tenet", "featured_brand",
    "slay_target", "reward_gross_sp", "judge", "venue_effect",
    "spotlight_requirement", "judge_favor", "brand_ovation", "source_version",
    "source_asset", "status",
]


REQUIRED_RELEASE_PATHS = [
    ROOT / "releases" / "v7.9" / "Haute_Hazard_v7.9_Game_Crafter_Print_Edition.zip",
    ROOT / "releases" / "v7.9" / "Haute_Hazard_v7_9_Print_and_Play_Physical_Kit.zip",
    ROOT / "releases" / "v7.9" / "Haute_Hazard_v7.9_TTS_Playtest.zip",
    ROOT / "releases" / "v7.9" / "TTS" / "Haute_Hazard_v7_9_TTS_Playtest.json",
    ROOT / "releases" / "solo-circuit-v0.2" / "Haute_Hazard_Solo_Circuit_v0_2_Print_and_Play.zip",
    ROOT / "releases" / "solo-circuit-v0.2" / "Haute_Hazard_Solo_Circuit_v0_2_TTS.zip",
    ROOT / "releases" / "solo-circuit-v0.2" / "TTS" / "Haute_Hazard_Solo_Circuit_v0_2_TTS_AddOn.json",
]

ACTIVE_STATUS_DOCS = [
    ROOT / "README.md",
    ROOT / "docs" / "V7_9_ALIGNMENT.md",
    ROOT / "docs" / "CARD_DATABASE_SCHEMA.md",
    ROOT / "docs" / "GENERATED_ARTIFACTS.md",
    ROOT / "docs" / "PRINT_AND_PLAY.md",
    ROOT / "docs" / "TABLETOP_SIMULATOR.md",
    ROOT / "docs" / "PLAYTEST_START_HERE.md",
    ROOT / "docs" / "SOLO_CIRCUIT_PRINT_AND_PLAY.md",
    ROOT / "docs" / "PUBLISHER_SELL_SHEET.md",
    ROOT / "docs" / "STREAMER_MEDIA_KIT.md",
    ROOT / "docs" / "GAMEPLAY_VIDEO_SCRIPT.md",
    ROOT / "docs" / "PROJECT_KIT_INDEX.md",
    ROOT / "docs" / "V7_9_WARDROBE_TIP_ECONOMY.md",
    ROOT / "data" / "V7_9_STAGE_REGISTRY.md",
    ROOT / "releases" / "v7.9" / "README.md",
    ROOT / "releases" / "v7.9" / "RELEASE_STATUS.md",
    ROOT / "releases" / "v7.9" / "QA_REPORT.txt",
    ROOT / "releases" / "solo-circuit-v0.2" / "README.md",
    ROOT / "releases" / "v7.9" / "TTS" / "README.md",
    ROOT / "releases" / "solo-circuit-v0.2" / "TTS" / "README.md",
]

STALE_ACTIVE_DOC_PHRASES = [
    "needs_verified_full_text_migration",
    "full Stage text migration is still pending",
    "current Stage-data blocker",
    "synchronization in progress",
    "binary attachment/distribution must be verified separately",
    "If the v7.9 binary is not visibly committed",
    "If the v0.2 ZIP is not visibly committed",
    "physical and Tabletop Simulator production targets",
    "V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as fh:
        return list(csv.DictReader(fh))


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def validate_cards(errors: list[str]) -> None:
    rows = read_csv(CARD_CSV)
    if len(rows) != 240:
        fail(errors, f"Expected 240 Poker cards, found {len(rows)}")

    components = Counter(row["component"] for row in rows)
    for component, expected in EXPECTED_COMPONENTS.items():
        if components[component] != expected:
            fail(errors, f"{component}: expected {expected}, found {components[component]}")

    ids = [row["card_id"] for row in rows]
    if len(set(ids)) != 240:
        fail(errors, "Card IDs are not unique")
    if ids != [f"HH-{i:03d}" for i in range(1, 241)]:
        fail(errors, "Card IDs must be sequential HH-001 through HH-240")

    for row in rows:
        raw = row["tips"].strip()
        if raw == "":
            fail(errors, f"{row['card_id']} {row['card_name']}: missing printed Tips")
            continue
        try:
            tips = int(raw)
        except ValueError:
            fail(errors, f"{row['card_id']} {row['card_name']}: non-integer Tips {raw!r}")
            continue
        if tips < 0:
            fail(errors, f"{row['card_id']} {row['card_name']}: negative printed Tips")

    wardrobe = [row for row in rows if row["component"] == "Wardrobe"]
    wardrobe_fashion = [row for row in wardrobe if row["card_type"] == "Fashion"]
    wardrobe_actions = [row for row in wardrobe if row["card_type"].startswith("Action")]
    if len(wardrobe_fashion) != 130:
        fail(errors, f"Expected 130 Wardrobe Fashion cards, found {len(wardrobe_fashion)}")
    if len(wardrobe_actions) != 14:
        fail(errors, f"Expected 14 Wardrobe Actions, found {len(wardrobe_actions)}")

    fashion_names = [row["card_name"] for row in wardrobe_fashion]
    if len(set(fashion_names)) != 130:
        duplicates = [name for name, n in Counter(fashion_names).items() if n > 1]
        fail(errors, "Duplicate v7.9 Wardrobe Fashion names: " + ", ".join(duplicates))

    wardrobe_rules = [row["rules_text"].strip() for row in wardrobe]
    if "" in wardrobe_rules:
        fail(errors, "Every Wardrobe card must have rules_text")
    if len(set(wardrobe_rules)) != 144:
        duplicates = [text for text, n in Counter(wardrobe_rules).items() if n > 1]
        fail(errors, f"Wardrobe rules_text must be unique; duplicates: {duplicates}")

    brand_counts = Counter(row["brand"] for row in wardrobe_fashion)
    for brand, expected in EXPECTED_BRANDS.items():
        if brand_counts[brand] != expected:
            fail(errors, f"{brand}: expected {expected} Fashion cards, found {brand_counts[brand]}")

    starter_counts = Counter(row["card_name"] for row in rows if row["component"] == "Starter")
    if dict(starter_counts) != EXPECTED_STARTERS:
        fail(errors, f"Starter counts wrong: {dict(starter_counts)}")

    basic = [r for r in rows if r["card_name"] == "Basic Beat"]
    if any(r["tips"] != "1" for r in basic):
        fail(errors, "Every Basic Beat must have printed Tips 1")
    if any(r["rules_text"].strip() != "No additional effect." for r in basic):
        fail(errors, "Basic Beat must use the clean no-additional-effect starter wording")

    messy = [r for r in rows if r["card_name"] == "Messy Lip Sync"]
    if any(r["tips"] != "0" for r in messy):
        fail(errors, "Every Messy Lip Sync must have printed Tips 0")

    chapstick = [r for r in rows if r["card_name"] == "Chapstick"]
    if any(r["tips"] != "1" for r in chapstick):
        fail(errors, "Every Chapstick must have printed Tips 1")
    if any("Gain 1 Tip" in r["rules_text"] for r in chapstick):
        fail(errors, "Chapstick must not duplicate its printed Tip in its Equip effect")

    stale_tip_count = [
        r["card_id"] for r in rows if "Tip Count" in (r["rules_text"] + " " + r["notes"])
    ]
    if stale_tip_count:
        fail(errors, "Stale Tip Count wording remains in card data: " + ", ".join(stale_tip_count))

    cherry = next((r for r in rows if r["card_id"] == "HH-075"), None)
    if cherry and "played a card with printed Tips 0" not in cherry["rules_text"]:
        fail(errors, "Cherry Gloss must check a played 0-Tip card, not old Tip Count timing")

    foil = next((r for r in rows if r["card_id"] == "HH-166"), None)
    if foil and "played at least two cards with printed Tips 0" not in foil["rules_text"]:
        fail(errors, "Foil-Lid Shadow must check played 0-Tip cards, not old Tip Count timing")

    if any("Automa" in r["component"] or "Personality" in r["component"] for r in rows):
        fail(errors, "Solo Circuit cards must not be part of the 240-card base CSV")


def validate_queens(errors: list[str]) -> None:
    rows = read_csv(QUEEN_CSV)
    if len(rows) != 12:
        fail(errors, f"Expected 12 Queens, found {len(rows)}")

    ids = [row["queen_id"] for row in rows]
    if ids != [f"Q-{i:02d}" for i in range(1, 13)]:
        fail(errors, "Queen IDs must be sequential Q-01 through Q-12")
    if len({row["name"] for row in rows}) != 12:
        fail(errors, "Queen names must be unique")

    required = [
        "signature_tenet", "favorite_brand", "signature_ability_name",
        "signature_ability_text", "special_appeal_name", "special_appeal_text",
    ]
    for row in rows:
        for field in required:
            if not row[field].strip():
                fail(errors, f"{row['queen_id']} {row['name']}: missing {field}")

    opulencia = next((row for row in rows if row["name"] == "Opulencia"), None)
    if not opulencia:
        fail(errors, "Opulencia missing from Queen database")
    else:
        txt = opulencia["signature_ability_text"]
        if "card you play" not in txt or "printed Tips" not in txt or "additional Tip" not in txt:
            fail(errors, "Opulencia must use play-generated printed-Tip wording")
        if "Tip Count" in (txt + " " + opulencia["special_appeal_text"]):
            fail(errors, "Opulencia still contains stale Tip Count wording")

    for name in ("Gore-Jess", "Siren Diesel"):
        row = next((r for r in rows if r["name"] == name), None)
        if row and row["ip_marker"] != "†":
            fail(errors, f"{name} row must retain † marker for Dragdagulan wording")


def validate_stages(errors: list[str]) -> None:
    registry = read_csv(STAGE_REGISTRY_CSV)
    stages = read_csv(STAGE_DATABASE_CSV)

    if len(registry) != 12:
        fail(errors, f"Expected 12 Stage registry rows, found {len(registry)}")
    if len(stages) != 12:
        fail(errors, f"Expected 12 full Stage rows, found {len(stages)}")

    expected_ids = [f"STG-{i:02d}" for i in range(1, 13)]
    if [r["stage_id"] for r in registry] != expected_ids:
        fail(errors, "Stage registry IDs must be sequential STG-01 through STG-12")
    if [r["stage_id"] for r in stages] != expected_ids:
        fail(errors, "Full Stage IDs must be sequential STG-01 through STG-12")

    names = {row["stage_name"] for row in registry}
    if names != EXPECTED_STAGE_NAMES:
        fail(errors, f"Stage registry roster mismatch; missing={sorted(EXPECTED_STAGE_NAMES - names)}, extra={sorted(names - EXPECTED_STAGE_NAMES)}")
    full_names = {row["stage_name"] for row in stages}
    if full_names != EXPECTED_STAGE_NAMES:
        fail(errors, f"Full Stage roster mismatch; missing={sorted(EXPECTED_STAGE_NAMES - full_names)}, extra={sorted(full_names - EXPECTED_STAGE_NAMES)}")

    tenets = Counter(row["favored_tenet"] for row in stages)
    if dict(tenets) != EXPECTED_STAGE_TENETS:
        fail(errors, f"Stage Tenet distribution wrong: {dict(tenets)}")

    brands = {row["featured_brand"] for row in stages}
    missing_brands = set(EXPECTED_BRANDS) - brands
    if missing_brands:
        fail(errors, "Stage roster does not cover Brands: " + ", ".join(sorted(missing_brands)))

    reg_by_id = {r["stage_id"]: r for r in registry}
    for row in stages:
        sid = row["stage_id"]
        for field in STAGE_REQUIRED_FIELDS:
            if not row.get(field, "").strip():
                fail(errors, f"{sid}: missing Stage field {field}")
        try:
            target = int(row["slay_target"])
            reward = int(row["reward_gross_sp"])
            if target <= 0:
                fail(errors, f"{sid}: Slay Target must be positive")
            if reward <= 0:
                fail(errors, f"{sid}: Gross SP reward must be positive")
        except ValueError:
            fail(errors, f"{sid}: Slay Target and reward must be integers")

        if row["status"] != "verified_for_v7.9":
            fail(errors, f"{sid}: unexpected Stage status {row['status']!r}")

        reg = reg_by_id.get(sid)
        if not reg:
            fail(errors, f"{sid}: missing registry row")
            continue
        if reg["stage_name"] != row["stage_name"] or reg["favored_tenet"] != row["favored_tenet"] or reg["featured_brand"] != row["featured_brand"]:
            fail(errors, f"{sid}: registry/full Stage identity mismatch")
        if reg["exact_text_status"] != "verified_from_v7.8_print_asset":
            fail(errors, f"{sid}: registry must mark text verified from v7.8 print asset")
        if reg["source_doc"] != "data/v7_9_stage_database.csv":
            fail(errors, f"{sid}: registry must point to data/v7_9_stage_database.csv")


def validate_release_state(errors: list[str]) -> None:
    for path in REQUIRED_RELEASE_PATHS:
        if not path.is_file() or path.stat().st_size <= 0:
            fail(errors, f"Missing committed release artifact: {path.relative_to(ROOT)}")

    for path in ACTIVE_STATUS_DOCS:
        if not path.is_file():
            fail(errors, f"Missing active status document: {path.relative_to(ROOT)}")
            continue
        text = path.read_text(encoding="utf-8")
        for phrase in STALE_ACTIVE_DOC_PHRASES:
            if phrase in text:
                fail(errors, f"{path.relative_to(ROOT)} contains stale active-status phrase: {phrase!r}")


def main() -> int:
    errors: list[str] = []
    validate_cards(errors)
    validate_queens(errors)
    validate_stages(errors)
    validate_release_state(errors)

    if errors:
        print("v7.9 QA FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print("v7.9 QA PASSED")
    print("Poker cards: 240")
    print("Starter / Wardrobe / Thrift / Penalty: 60 / 144 / 16 / 20")
    print("Wardrobe: 130 unique Fashion + 14 unique Actions")
    print("Wardrobe rules: 144 unique")
    print("Printed Tips: present on all 240 cards")
    print("Play-generated Tip checks: passed")
    print("Stale Tip Count card wording: 0")
    print("Queens: 12 machine-readable rows")
    print("Stages: 12 full verified rows, 3 per Tenet, all base Brands covered")
    print("Stage full-text migration: complete")
    print("Committed base/Solo release artifacts: present")
    print("Active status docs: no known stale blocker language")
    print("Solo cards in base CSV: 0")
    return 0


if __name__ == "__main__":
    sys.exit(main())
