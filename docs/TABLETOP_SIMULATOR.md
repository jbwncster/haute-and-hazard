# Haute & Hazard — Tabletop Simulator Playtest

The **current Tabletop Simulator playtest build is v7.8**, aligned to the current v7.8 Game Crafter physical prototype.

## Current TTS build

**Package name:** `Haute_Hazard_v7.8_TTS_Playtest.zip`

The v7.8 TTS build contains:

- a 2–5 player standard setup;
- a two-player teaching setup featuring **Siren Diesel vs. Opal Dynasty**;
- the current 240-card Poker Deck structure: 60 starter / 144 Wardrobe / 16 Thrift / 20 Penalty;
- all 12 current venue Stages;
- all 12 current Queens with Signature Abilities and once-per-game Special Appeals;
- the current v7.8 Player Aid front and back;
- local TTS assets and installer support;
- a physical-card-to-TTS asset manifest and QA report.

The TTS source/status files live under [`../releases/v7.8/TTS/`](../releases/v7.8/TTS/). The complete binary ZIP includes the image assets; if the ZIP has not yet been attached to GitHub, use the source/status folder as the build record and attach the packaged ZIP separately.

## Rules alignment

The digital and physical v7.8 builds use the same current rules for:

- Tenets and Brands;
- Tips and Shopping;
- Face / Wig / Body / Shoes core Coordinates and optional Accessory;
- Matching Looks;
- Perfect Illusion;
- Fusion;
- Slay;
- Dragdagulan using printed LS on the three battle-drawn cards plus explicit battle modifiers;
- Penalty values and Final Judging;
- current Queen abilities and Special Appeals;
- current venue Stage fields and Beginner Mode.

For authoritative wording, use:

- [`CURRENT_GAMEPLAY.md`](CURRENT_GAMEPLAY.md)
- [`QUEEN_ROSTER.md`](QUEEN_ROSTER.md)
- [`BEGINNER_MODE.md`](BEGINNER_MODE.md)
- [`STARTING_DECKS.md`](STARTING_DECKS.md)
- [`../releases/v7.8/STAGE_VENUE_LIST.md`](../releases/v7.8/STAGE_VENUE_LIST.md)

## Teaching setup

The v7.8 teaching save uses **Siren Diesel vs. Opal Dynasty**, opens at **Neon Nightclub**, and uses a fixed opening Wardrobe Market. Beginner Mode is recommended for a first session: use Favored Tenet, Featured Brand, Slay Target, Reward, and Venue Effect, while ignoring Judge, Spotlight Requirement, Judge's Favor, and Brand Ovation for that game.

## Local assets and online play

The packaged saves use bundled local assets. Run the included installer so the save templates point to the correct local `file://` asset directory.

For online multiplayer, the host should use Tabletop Simulator's **Cloud Manager** to upload the local assets and then resave the table before inviting remote players.

## Legacy v7.7 package

The old [`../releases/v7.7/Haute_Hazard_v7.7_TTS_Playtest.zip`](../releases/v7.7/Haute_Hazard_v7.7_TTS_Playtest.zip) is retained **only as a legacy comparison build**. It is no longer the current digital playtest version and should not be used for current balance testing when v7.8 is available.
