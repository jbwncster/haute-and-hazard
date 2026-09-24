# Haute & Hazard — Tabletop Simulator Playtest

The **current synchronized multiplayer Tabletop Simulator playtest build is v7.8**, aligned to the current v7.8 Game Crafter physical prototype. An experimental **Solo Circuit v0.1** one-player add-on is also available and is loaded additively over the v7.8 Standard Setup.

> **† Legal/IP review:** `Dragdagulan` is working prototype terminology credited to *Drag Den Philippines*. It is subject to legal/IP, trademark, and publisher review before commercial release and may be renamed. See [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md).

## New player quick start

If you just want to play digitally:

1. Download **`Haute_Hazard_v7.8_TTS_Playtest.zip`**.
2. Extract the ZIP.
3. On Windows, run **`INSTALL_WINDOWS.ps1`**. On macOS/Linux, use **`INSTALL_UNIX.sh`**.
4. Launch Tabletop Simulator and open the installed v7.8 save.
5. For your first game, use the **two-player teaching setup** or the standard setup with **Beginner Mode**.
6. Read [Learn to Play in 5 Minutes](LEARN_TO_PLAY_5_MIN.md) before opening the full rules reference.

**Playing solo?** Use the normal v7.8 Standard Setup as the base, then download [`Haute_Hazard_Solo_Circuit_v0_1_TTS.zip`](../releases/solo-circuit-v0.1/Haute_Hazard_Solo_Circuit_v0_1_TTS.zip) and follow the [Solo Circuit TTS README](../releases/solo-circuit-v0.1/TTS/README.md).

If the complete ZIP is not visibly attached on GitHub, the [`../releases/v7.8/TTS/`](../releases/v7.8/TTS/) folder is the authoritative source/status record; the binary package must be distributed separately.

For a physical game instead, use [Print & Play Physical Kit](PRINT_AND_PLAY.md).

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

## Experimental Solo Circuit v0.1 add-on

Solo Circuit is the current one-player development module. The human player uses normal Haute & Hazard rules while a streamlined **House Queen** is driven by an 18-card Automa deck.

**Committed package:** [`Haute_Hazard_Solo_Circuit_v0_1_TTS.zip`](../releases/solo-circuit-v0.1/Haute_Hazard_Solo_Circuit_v0_1_TTS.zip)

The package contains:

- `Haute_Hazard_Solo_Circuit_v0_1_TTS_AddOn.json`;
- an 18-card custom Automa deck;
- 12 selectable House Queen Personality cards;
- House Gross SP, Appeal, Stage Timer, and Bargain counters;
- House Wardrobe, difficulty, and Dragdagulan† reference objects;
- GitHub-hosted image assets for the Solo cards;
- build manifest and TTS QA report.

Recommended use:

1. Load the normal **v7.8 Standard Setup**.
2. Additively load the Solo Circuit save.
3. Shuffle the Automa deck.
4. Choose a Personality or use the generic House Queen.
5. Start at **Working Queen** difficulty and use **Beginner Mode** for the cleanest first baseline.

Because the Solo card graphics are loaded from public raw GitHub URLs, the Solo module itself does not require a separate local image installer and is suitable for remote TTS testing once the base v7.8 table is available.

See [Solo Circuit rules](SOLO_CIRCUIT_AUTOMA_PLAYTEST.md), [Automa deck](SOLO_CIRCUIT_AUTOMA_DECK.md), [House Queen Personalities](SOLO_CIRCUIT_PERSONALITIES.md), and [physical Solo PnP](SOLO_CIRCUIT_PRINT_AND_PLAY.md).

**Runtime caveat:** the Solo save JSON, card/deck IDs, image grids, counts, and remote asset paths were generated/schema-checked, but Tabletop Simulator itself was not available in the build environment. An actual in-app additive-load check is still required before calling this build fully runtime-verified.

## Rules alignment

The digital and physical v7.8 builds use the same current rules for:

- Tenets and Brands;
- Tips and Shopping;
- Face / Wig / Body / Shoes core Coordinates and optional Accessory;
- Matching Looks;
- Perfect Illusion;
- Fusion;
- Slay;
- **Dragdagulan†** using printed LS on the three battle-drawn cards plus explicit battle modifiers;
- Penalty values and Final Judging;
- current Queen abilities and Special Appeals;
- current venue Stage fields and Beginner Mode.

For authoritative wording, use:

- [`CURRENT_GAMEPLAY.md`](CURRENT_GAMEPLAY.md)
- [`QUEEN_ROSTER.md`](QUEEN_ROSTER.md)
- [`BEGINNER_MODE.md`](BEGINNER_MODE.md)
- [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md)
- [`STARTING_DECKS.md`](STARTING_DECKS.md)
- [`../releases/v7.8/STAGE_VENUE_LIST.md`](../releases/v7.8/STAGE_VENUE_LIST.md)

## Teaching setup

The v7.8 teaching save uses **Siren Diesel vs. Opal Dynasty**, opens at **Neon Nightclub**, and uses a fixed opening Wardrobe Market. Beginner Mode is recommended for a first session: use Favored Tenet, Featured Brand, Slay Target, Reward, and Venue Effect, while ignoring Judge, Spotlight Requirement, Judge's Favor, and Brand Ovation for that game.

## Local assets and online play

The packaged saves use bundled local assets. Run the included installer so the save templates point to the correct local `file://` asset directory.

For online multiplayer, the host should use Tabletop Simulator's **Cloud Manager** to upload the local assets and then resave the table before inviting remote players.

## Legacy v7.7 package

The old [`../releases/v7.7/Haute_Hazard_v7.7_TTS_Playtest.zip`](../releases/v7.7/Haute_Hazard_v7.7_TTS_Playtest.zip) is retained **only as a legacy comparison build**. It is no longer the current digital playtest version and should not be used for current balance testing when v7.8 is available.
