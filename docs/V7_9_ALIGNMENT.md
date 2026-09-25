# Haute & Hazard v7.9 — Cross-Build Alignment

**v7.9 is the current synchronized rules/card/production target for physical, Print & Play, and Tabletop Simulator development.**

A build is synchronized only when the same rule/card target is represented across all media.

## Canonical alignment table

| System / component | v7.9 Physical / PnP | v7.9 TTS | Canonical source |
|---|---|---|---|
| Players | 2–5 | 2–5 | `docs/CURRENT_GAMEPLAY.md` |
| Tip economy | Play cards during Transformation to generate printed Tips | Same | `docs/CURRENT_GAMEPLAY.md` |
| Starter cards | 60 total / five 12-card decks | Same | `docs/STARTING_DECKS.md` |
| Starter mix | 7 Basic Beat / 3 Messy Lip Sync / 2 Chapstick | Same | `docs/STARTING_DECKS.md` |
| Starter Tips | 1 / 0 / 1 | Same | `docs/STARTING_DECKS.md` |
| Poker Deck | 240 | 240 | `data/v7_9_card_database.csv` |
| Wardrobe | 144 unique cards | Same | `data/v7_9_card_database.csv` |
| Fashion | 130 unique | Same | `data/v7_9_card_database.csv` |
| Wardrobe Actions | 14 unique | Same | `data/v7_9_card_database.csv` |
| Thrift | 16 | Same | `data/v7_9_card_database.csv` |
| Penalties | 20 | Same | `data/v7_9_card_database.csv` |
| Stages | 12 complete venue cards | Same | `data/v7_9_stage_database.csv` |
| Queens | 12 | Same | `data/v7_9_queen_database.csv` |
| Player Aids | 5 physical copies | same wording/object | current generated aid |
| Purchases | Backstage Archive | Same | `docs/CURRENT_GAMEPLAY.md` |
| Matching / Perfect Illusion / Fusion | Current v7.9 rules | Same | `docs/CURRENT_GAMEPLAY.md` |
| Dragdagulan† | 3 battle-drawn cards + legal modifiers | Same | `docs/CURRENT_GAMEPLAY.md` |
| Beginner Mode | Current five-field teaching layer | Same | `docs/BEGINNER_MODE.md` |

## Canonical source-data gate

The current machine-readable sources are:

- [Poker cards](../data/v7_9_card_database.csv) — complete 240-card base source.
- [Queens](../data/v7_9_queen_database.csv) — complete 12-Queen source.
- [Stages](../data/v7_9_stage_database.csv) — complete 12-Stage production source.
- [Stage registry](../data/v7_9_stage_registry.csv) — compact Stage identity/status registry.

The full Stage data was verified against the prior synchronized print assets before migration into v7.9. Current Stage renders are therefore deterministic from the committed v7.9 Stage database.

A Poker render is not synchronized if card text, Cost, printed Tips, Appeal, LS, slot, Tenet, or Brand differs from the canonical card CSV revision.

A Queen render is not synchronized if its ability or Special Appeal differs from the Queen CSV.

A Stage render is not synchronized if its venue name, Favored Tenet, Featured Brand, Slay Target, reward, Judge, Venue Effect, Spotlight Requirement, Judge's Favor, or Brand Ovation differs from `data/v7_9_stage_database.csv`.

## Non-negotiable Tip-generation checks

A synchronized v7.9 build must show all of the following:

1. Every Poker card visibly has a printed Tip value, including 0.
2. A card generates its printed Tips only when played during Transformation.
3. Unplayed cards generate no Tips.
4. A Master already equipped from an earlier turn does not regenerate printed Tips.
5. Fashion may be played for Tips without being equipped; it then archives at Cleanup.
6. Cards drawn during Transformation may be played later that Transformation and generate Tips normally.
7. Basic Beat uses clean no-additional-effect wording; Chapstick does not duplicate its printed Tip in its Equip effect.
8. Opulencia uses explicit per-play printed-Tip wording.

## Physical production

Current Game Crafter target:

- Rules: 4875 × 2475 px
- Poker: 240 × 825 × 1125 px
- Stages: 12 × 825 × 1125 px
- Queens: 12 × 1125 × 1725 px
- Player Aids: 5 × 1875 × 1275 px
- Box: 5850 × 5400 px

The current Game Crafter and Print & Play ZIPs are committed under `releases/v7.9/`.

See [v7.9 Upload Guide](../releases/v7.9/UPLOAD_GUIDE.md) and [Physical Preflight](../releases/v7.9/PRINT_PREFLIGHT_REPORT.txt).

## Tabletop Simulator

The v7.9 TTS package is committed under `releases/v7.9/`, with the unpacked save and texture sheets under `releases/v7.9/TTS/`.

Source/schema/path QA has passed. An actual in-app smoke test remains required before using the narrower label **runtime-verified**.

## Solo Circuit v0.2

Solo is **not** part of base-game component parity.

It is a separate 30-card module:

- 18 Automa
- 12 Personalities

Its current Print & Play and TTS ZIPs are committed under `releases/solo-circuit-v0.2/`.

Its rules align to the v7.9 base turn structure and use:

- four-round Stage Timer;
- House Base Appeal = `max(0, Slay Target - 6)`;
- explicit House Stage scoring.

## Synchronization gate

The current generated v7.9 physical and TTS source builds meet the cross-media synchronization gate for:

- rules text;
- Player Aid timing;
- all 240 Poker fronts;
- all 12 Queens;
- all 12 full Stage cards;
- component counts;
- version labels;
- generated physical dimensions;
- TTS asset paths and card mappings.

Remaining external/manual checks:

- open the base TTS save in Tabletop Simulator;
- Additive Load Solo Circuit v0.2 in Tabletop Simulator;
- verify remote clients resolve all GitHub-hosted textures.

Source/schema validation alone is not TTS runtime verification.

## Automated validation

GitHub Actions validates the canonical Poker, Queen, Stage-registry, and full Stage database files and rebuilds the physical/TTS artifacts from committed source data.

> **† Legal/IP review:** Dragdagulan is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review.
