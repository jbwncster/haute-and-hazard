# Haute & Hazard — Canonical Card Database Schema

Use a single structured source of truth for cards so the physical build, TTS build, rules docs, player aids, and balance tracker do not drift.

Template file: [`../data/card_database_template.csv`](../data/card_database_template.csv)

## Required fields

| Field | Purpose |
|---|---|
| card_id | Stable ID such as HH-001. Never reuse after deletion. |
| version_added | First version where this wording/card appeared. |
| current_status | active, watching, revise, retired, legacy. |
| card_name | Printed card name. |
| component | Starter, Wardrobe, Thrift, Penalty, Stage, Queen, Player Aid. |
| card_type | Fashion, Action, Penalty, Stage, Queen, Aid, etc. |
| slot | Face, Wig, Body, Shoes, Accessory, none. |
| tenet | Pink, Blue, Purple, Yellow, Neutral, None. |
| brand | Named Brand or None. |
| cost | Tip cost if purchasable. |
| tips | Tips generated or modified. |
| appeal | Appeal generated or modified. |
| ls | Printed LS if any. |
| sp | Gross SP or printed Stage reward if applicable. |
| quantity | Number of copies in the current build. |
| rules_text | Current printed/official text. |
| notes | Internal notes or balancing concerns. |
| ip_marker | Blank or † for legal/IP review material. |
| source_doc | Where the canonical wording currently lives. |

## Rules

1. Update the card database before changing a physical card, TTS card, player aid, or rules document.
2. Do not independently rebalance the TTS and physical builds.
3. If a term or asset is subject to legal/IP review, mark it with **†** and log it in [`IP_REVIEW_REGISTER.md`](IP_REVIEW_REGISTER.md).
4. If a card is removed, mark it `retired`; do not delete the row.

## Suggested statuses

- `active` — current and expected to remain.
- `watching` — playable but needs data.
- `revise` — change likely after testing.
- `retired` — removed from current build.
- `legacy` — retained only for version comparison.
