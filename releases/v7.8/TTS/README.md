# Haute & Hazard v7.8 — Tabletop Simulator Source / Status

This folder records the **current v7.8 Tabletop Simulator conversion**, aligned to the current v7.8 Game Crafter physical prototype.

## Current package

`Haute_Hazard_v7.8_TTS_Playtest.zip`

The generated binary package contains the complete image assets, two TTS save files, installers, manifest, checksums, and QA notes. Large binary assets may require manual GitHub attachment; do not assume the ZIP is downloadable from GitHub unless it is visibly attached or committed.

## Alignment target

The TTS build mirrors the current physical prototype:

- 240-card Poker Deck: 60 starter / 144 Wardrobe / 16 Thrift / 20 Penalty
- 12 venue Stages
- 12 Queens with current Signature Abilities + once-per-game Special Appeals
- current Player Aid front/back
- current Beginner Mode and full Stage rules
- current Tenet/Brand, Shopping, Matching, Perfect Illusion, Fusion, Slay, Dragdagulan, Penalty, and Final Judging rules

## Included save configurations

### Standard Setup

- 2–5 players
- 144-card Wardrobe deck
- five Market Row spaces
- all 16 Thrift Throwbacks face up
- separate Wardrobe Malfunction / The Chop / Extermination supplies
- 12-card venue Stage deck
- all 12 Queens available for selection
- five identical 12-card starter decks
- current Player Aid for each player
- Tips / Appeal / Gross SP counters

### Two-Player Teaching

- Siren Diesel vs. Opal Dynasty
- Neon Nightclub as the opening Stage
- fixed five-card opening Wardrobe Market
- Beginner Mode guidance
- otherwise current v7.8 rules

## Local assets

The packaged TTS save templates use `__HH_ASSET_DIR__` as a placeholder. The included installer rewrites that placeholder to the user's local `file://` path and copies the image assets into the Tabletop Simulator data folder.

For online multiplayer, the host should use **TTS Cloud Manager** to upload the local assets and then resave the table before inviting remote players.

## Canonical rules

- [`../../../docs/CURRENT_GAMEPLAY.md`](../../../docs/CURRENT_GAMEPLAY.md)
- [`../../../docs/QUEEN_ROSTER.md`](../../../docs/QUEEN_ROSTER.md)
- [`../../../docs/BEGINNER_MODE.md`](../../../docs/BEGINNER_MODE.md)
- [`../../../docs/STARTING_DECKS.md`](../../../docs/STARTING_DECKS.md)
- [`../STAGE_VENUE_LIST.md`](../STAGE_VENUE_LIST.md)

## Legacy build

The v7.7 TTS ZIP remains under `releases/v7.7/` for historical comparison only. It is not the current balance-test target.
