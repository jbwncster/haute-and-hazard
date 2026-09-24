# Haute & Hazard — Canonical Card Database Schema

Use a single structured source of truth for cards so the physical build, TTS build, rules docs, player aids, and balance tracker do not drift.

**Current v7.9 database:** [`../data/v7_9_card_database.csv`](../data/v7_9_card_database.csv)  
**Validation/readme:** [`../data/V7_9_CARD_DATABASE.md`](../data/V7_9_CARD_DATABASE.md)  
**Blank template:** [`../data/card_database_template.csv`](../data/card_database_template.csv)

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
| tips | **Printed Tip value** contributed from hand during Tip Count. Use 0 explicitly when a card provides no printed purchasing power. |
| appeal | Appeal generated or modified. |
| ls | Printed LS if any. |
| sp | Gross SP or printed Stage reward if applicable. |
| quantity | Number of copies in the current build. |
| rules_text | Current printed/official text. |
| notes | Internal notes or balancing concerns. |
| ip_marker | Blank or † for legal/IP review material. |
| source_doc | Where the canonical wording currently lives. |

## Visual-refresh preservation rule

The Aikatsu!-informed card refresh is a **visual and information-hierarchy project, not a mechanical rewrite**.

When migrating a current card to the new visual system, preserve every applicable database value:

- card name;
- component;
- card type;
- slot;
- Tenet;
- Brand;
- cost;
- Tips;
- Appeal;
- LS;
- SP;
- quantity;
- rules text;
- current status;
- IP marker.

No field may be silently dropped because a new frame has less room. The frame must be redesigned to fit the canonical information.

See [CARD_VISUAL_REFRESH.md](CARD_VISUAL_REFRESH.md).

## v7.9 card-design rules

For the current v7.9 Wardrobe redesign:

- every Poker card has an explicit printed Tip value, including 0;
- Cost and printed Tips are separate fields and must never be conflated;
- printed Tips are counted from the player's hand at the start of the turn before cards are played/equipped;
- every one of the 144 Wardrobe cards has a distinct current rules-text entry in the v7.9 database;
- no two current Wardrobe rows share identical rules text;
- no Brand/slot combination is represented only by repeated copies of one garment;
- Brand defines a strategic family, while each garment must create its own purchase reason.

See [V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md](V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md).

## Rules

1. Update the card database before changing a physical card, TTS card, player aid, or rules document.
2. Do not independently rebalance the TTS and physical builds.
3. If a term or asset is subject to legal/IP review, mark it with **†** and log it in [IP_REVIEW_REGISTER.md](IP_REVIEW_REGISTER.md).
4. If a card is removed, mark it `retired`; do not delete the row.
5. A visual refresh must not alter gameplay values or rules wording unless the same change is separately approved as a balance/rules revision.
6. Third-party design inspiration may guide high-level hierarchy only; never store or ship copied third-party art, logos, frames, or trade dress as card assets.

## Suggested statuses

- `active` — current and expected to remain.
- `watching` — playable but needs data.
- `revise` — change likely after testing.
- `retired` — removed from current build.
- `legacy` — retained only for version comparison.
