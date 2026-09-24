# Haute & Hazard v7.9 — Cross-Build Alignment

**v7.9 is the current rules/card/production target for physical, Print & Play, and Tabletop Simulator development.**

A build is synchronized only when the same rule/card target is represented across all media.

## Canonical alignment table

| System / component | v7.9 Physical / PnP | v7.9 TTS | Canonical source |
|---|---|---|---|
| Players | 2–5 | 2–5 | `CURRENT_GAMEPLAY.md` |
| Turn start | **Tip Count** before Transformation | Same | `CURRENT_GAMEPLAY.md` |
| Starter cards | 60 total / five 12-card decks | Same | `STARTING_DECKS.md` |
| Starter mix | 7 Basic Beat / 3 Messy Lip Sync / 2 Chapstick | Same | `STARTING_DECKS.md` |
| Starter Tips | 1 / 0 / 1 | Same | `STARTING_DECKS.md` |
| Poker Deck | 240 | 240 | `data/v7_9_card_database.csv` + `CARD_POOL.md` |
| Wardrobe | 144 unique cards | Same | `data/v7_9_card_database.csv` |
| Fashion | 130 unique | Same | `data/v7_9_card_database.csv` |
| Wardrobe Actions | 14 unique | Same | `data/v7_9_card_database.csv` |
| Thrift | 16 | Same | `CARD_POOL.md` |
| Penalties | 20 | Same | `CARD_POOL.md` |
| Stages | 12 verified venue identities | Same | `data/v7_9_stage_registry.csv` + `releases/v7.9/STAGE_VENUE_LIST.md` |
| Queens | 12 | Same | `data/v7_9_queen_database.csv` + `QUEEN_ROSTER.md` |
| Player Aids | 5 physical copies | same wording/object | current Player Aid |
| Purchases | Backstage Archive | Same | `CURRENT_GAMEPLAY.md` |
| Matching / Perfect Illusion / Fusion | Current v7.9 rules | Same | `CURRENT_GAMEPLAY.md` |
| Dragdagulan† | 3 battle-drawn cards + legal modifiers | Same | `CURRENT_GAMEPLAY.md` |
| Beginner Mode | Current five-field teaching layer | Same | `BEGINNER_MODE.md` |

## Canonical source-data gate

The current machine-readable sources are:

- [Poker cards](../data/v7_9_card_database.csv) — complete 240-card base source.
- [Queens](../data/v7_9_queen_database.csv) — complete 12-Queen wording source.
- [Stage registry](../data/v7_9_stage_registry.csv) — verified names, Favored Tenets, and Featured Brands only.

A Poker render is not synchronized if card text, Cost, printed Tips, Appeal, LS, slot, Tenet, or Brand differs from the canonical card CSV revision.

A Queen render is not synchronized if its ability or Special Appeal differs from the Queen CSV / Queen Roster.

### Current Stage-data blocker

The Stage registry is intentionally incomplete. The repository does **not yet have a verified machine-readable current source** for every Stage's:

- Slay Target;
- Reward;
- Venue Effect;
- Judge;
- Spotlight Requirement;
- Judge's Favor;
- Brand Ovation.

Do not guess or reconstruct those fields from memory. A v7.9 Stage-face regeneration cannot be called deterministic until exact current Stage text is migrated from a verified source.

## Non-negotiable Tip Count checks

A synchronized v7.9 build must show all of the following:

1. Tip Count occurs before Transformation.
2. Every Poker card visibly has a printed Tip value, including 0.
3. A card's printed Tips are counted once from hand.
4. Counting does not discard the card.
5. Playing/equipping the card does not pay its printed Tips again.
6. Basic Beat and Chapstick do not retain legacy double-pay wording.
7. Cards drawn or returned to hand after Tip Count do not contribute printed Tips retroactively.
8. Opulencia uses her explicit v7.9 Tip Count wording.

## Physical production

Game Crafter target:

- Rules: 4875 × 2475
- Poker: 240 × 825 × 1125
- Stages: 12 × 825 × 1125
- Queens: 12 × 1125 × 1725
- Player Aids: 5 × 1875 × 1275
- Box: 5850 × 5400

See [v7.9 Upload Guide](../releases/v7.9/UPLOAD_GUIDE.md).

## Solo Circuit v0.2

Solo is **not** part of base-game component parity.

It is a separate 30-card module:

- 18 Automa
- 12 Personalities

Its rules must align to the v7.9 base turn structure and use:

- four-round Stage Timer;
- House Base Appeal = `max(0, Slay Target - 6)`;
- explicit House Stage scoring.

See [Solo Circuit v0.2](../releases/solo-circuit-v0.2/README.md).

## Synchronization gate

Do not call a package “synchronized v7.9” until:

- rules text matches;
- Player Aid timing matches;
- all 240 Poker fronts match current card data;
- all 12 Queens match the Queen database;
- all 12 Stage identities match the Stage registry;
- the exact full Stage text has been migrated and verified before current Stage faces are regenerated;
- component counts match;
- version labels match;
- Print & Play output is visually checked;
- Game Crafter output is visually checked;
- TTS saves open and assets load in-app.

Source/schema validation alone is not TTS runtime verification.

## Automated validation

GitHub Actions runs `.github/workflows/validate-v7.9.yml` against the canonical Poker, Queen, and Stage-registry CSVs. The expanded source-validation workflow has completed successfully. This verifies source structure and counts; it does not replace visual, print, or TTS runtime QA.

> **† Legal/IP review:** Dragdagulan is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review.
