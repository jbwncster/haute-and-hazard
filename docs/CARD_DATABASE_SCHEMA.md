# Haute & Hazard — Canonical Card Database Schema

Use structured sources of truth so the physical build, TTS build, rules docs, player aids, and balance tracker do not drift.

## Current v7.9 sources

- **Poker cards:** [`data/v7_9_card_database.csv`](../data/v7_9_card_database.csv)
- **Queens:** [`data/v7_9_queen_database.csv`](../data/v7_9_queen_database.csv)
- **Stages:** [`data/v7_9_stage_database.csv`](../data/v7_9_stage_database.csv)
- **Stage registry:** [`data/v7_9_stage_registry.csv`](../data/v7_9_stage_registry.csv)
- **Poker validation/readme:** [`data/V7_9_CARD_DATABASE.md`](../data/V7_9_CARD_DATABASE.md)
- **Blank Poker template:** [`data/card_database_template.csv`](../data/card_database_template.csv)

## Poker fields

| Field | Purpose |
|---|---|
| card_id | Stable ID such as HH-001. Never reuse after deletion. |
| version_added | First version where this wording/card appeared. |
| current_status | active, watching, revise, retired, legacy. |
| card_name | Printed card name. |
| component | Starter, Wardrobe, Thrift, or Penalty. |
| card_type | Fashion, Action, Penalty, etc. |
| slot | Face, Wig, Body, Shoes, Accessory, none. |
| tenet | Pink, Blue, Purple, Yellow, Neutral, None. |
| brand | Named Brand or blank/None. |
| cost | Tip cost if purchasable. |
| tips | **Printed Tip value** generated when the card is played during Transformation. Use 0 explicitly when a card provides no printed purchasing power. |
| appeal | Printed or rules-referenced Appeal value. |
| ls | Printed LS if any. |
| sp | Printed SP modifier if applicable. |
| quantity | Number of copies in the current build. |
| rules_text | Current printed/official text. |
| notes | Internal notes or balancing concerns. |
| ip_marker | Blank or † for legal/IP review material. |
| source_doc | Where the canonical wording currently lives. |

## Stage fields

The complete v7.9 Stage database includes:

- stage ID and name;
- subtitle;
- Favored Tenet;
- Featured Brand;
- Slay Target;
- Gross SP reward;
- Judge;
- Venue Effect;
- Spotlight Requirement;
- Judge's Favor;
- Brand Ovation;
- provenance/source asset;
- verification status.

The Stage registry is a compact roster/status file; the **full Stage database** is the source for regenerated Stage faces.

## Visual-refresh preservation rule

The Aikatsu!-informed card refresh is a **visual and information-hierarchy project, not a mechanical rewrite**.

When migrating a current card to a new visual system, preserve every applicable canonical value. No field may be silently dropped because a new frame has less room; the frame must be redesigned to fit the canonical information.

See [CARD_VISUAL_REFRESH.md](CARD_VISUAL_REFRESH.md).

## v7.9 card-design rules

For the current v7.9 Wardrobe redesign:

- every Poker card has an explicit printed Tip value, including 0;
- Cost and printed Tips are separate fields and must never be conflated;
- printed Tips are generated when a card is played during Transformation;
- every one of the 144 Wardrobe cards has a distinct current rules-text entry;
- no two current Wardrobe rows share identical rules text;
- no Brand/slot combination is represented only by repeated copies of one garment;
- Brand defines a strategic family, while each garment must create its own purchase reason.

See [V7_9_WARDROBE_TIP_ECONOMY.md](V7_9_WARDROBE_TIP_ECONOMY.md).

## Rules

1. Update the canonical database before changing a generated physical/TTS card.
2. Do not independently rebalance the TTS and physical builds.
3. If a term or asset is subject to legal/IP review, mark it with **†** and log it in [IP_REVIEW_REGISTER.md](IP_REVIEW_REGISTER.md).
4. If a Poker card is removed, mark it `retired`; do not reuse its ID.
5. A visual refresh must not alter gameplay values or wording unless the same change is separately approved as a balance/rules revision.
6. Third-party design inspiration may guide high-level hierarchy only; never store or ship copied third-party art, logos, frames, or trade dress as card assets.

## Suggested statuses

- `active` — current and expected to remain.
- `watching` — playable but needs data.
- `revise` — change likely after testing.
- `retired` — removed from current build.
- `legacy` — retained only for version comparison.

## v7.9 multi-source production model

v7.9 deliberately separates component data instead of forcing unrelated formats into one table:

- **Poker cards:** `data/v7_9_card_database.csv`
- **Queens:** `data/v7_9_queen_database.csv`
- **Stages:** `data/v7_9_stage_database.csv`
- **Stage identity/status registry:** `data/v7_9_stage_registry.csv`

All four are committed and validated. Physical and TTS production files should be regenerated from them rather than manually editing rendered assets.
