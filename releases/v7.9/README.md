# Haute & Hazard v7.9 — Release Index

**Status:** current base-game rules/card target with committed physical-print and Tabletop Simulator playtest packages.

v7.9 promotes the Wardrobe/Tip redesign into the current source-of-truth rules and production build.

## Base-game components

- **240 Poker cards**
  - 60 starter cards
  - 144 Wardrobe cards
    - 130 unique Fashion
    - 14 unique Actions
  - 16 Thrift Store Throwbacks
  - 20 Penalty cards
- **12 venue Stages**
- **12 Jumbo Queens**
- **5 Player Aids**
- **Medium Folio rules**
- **Medium Prototype Box**

The optional **Solo Circuit v0.2** module is separate and adds 30 solo cards.

## Major v7.9 changes

- every Poker card has an explicit printed Tip value, including 0;
- playing cards during **Transformation** generates their printed Tips;
- unplayed cards generate no Tips and old Masters do not regenerate them;
- Fashion may be played for Tips without being equipped;
- purchases go to the Backstage Archive and enter play only after a later draw;
- the five-card Wardrobe Rack refills during Cleanup;
- Cleanup draws a fresh five-card hand;
- the 144-card Wardrobe is fully unique: 130 Fashion + 14 Actions;
- starter wording is corrected so Basic Beat and Chapstick do not double-pay their printed Tips;
- Solo Circuit v0.2 uses a four-round Stage timer and explicit House Appeal/scoring rules.

## Canonical data

- [240-card Poker database](../../data/v7_9_card_database.csv)
- [12-Queen database](../../data/v7_9_queen_database.csv)
- [12-Stage database](../../data/v7_9_stage_database.csv)

All new production renders should be generated from those v7.9 sources rather than archived v7.8 card images.

## Downloadable packages in this folder

- [Game Crafter Print Edition](Haute_Hazard_v7.9_Game_Crafter_Print_Edition.zip)
- [Print & Play Physical Kit](Haute_Hazard_v7_9_Print_and_Play_Physical_Kit.zip)
- [Tabletop Simulator Playtest](Haute_Hazard_v7.9_TTS_Playtest.zip)

Supporting QA:

- [Physical preflight report](PRINT_PREFLIGHT_REPORT.txt)
- [Build manifest and SHA-256 hashes](BUILD_MANIFEST.json)
- [TTS save and assets](TTS/)
- [Release status](RELEASE_STATUS.md)

The TTS files have passed source/schema/path QA. Opening the save inside Tabletop Simulator remains the final runtime smoke-test step.

## Start here

- [Current Gameplay](../../docs/CURRENT_GAMEPLAY.md)
- [Learn to Play in 5 Minutes](../../docs/LEARN_TO_PLAY_5_MIN.md)
- [Beginner Mode](../../docs/BEGINNER_MODE.md)
- [Starting Decks](../../docs/STARTING_DECKS.md)
- [Card Pool](../../docs/CARD_POOL.md)
- [v7.9 Wardrobe + Tip Economy](../../docs/V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md)
- [Game Crafter Upload Guide](UPLOAD_GUIDE.md)
- [TTS](TTS/README.md)
- [Stage Venue List](STAGE_VENUE_LIST.md)

## Solo

Use [Solo Circuit v0.2](../solo-circuit-v0.2/README.md) for one-player testing. Its physical and TTS packages are committed separately.

> **† Legal/IP review:** Dragdagulan is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review.
