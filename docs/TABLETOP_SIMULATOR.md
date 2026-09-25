# Haute & Hazard v7.9 — Tabletop Simulator Playtest

The current digital playtest target is **v7.9**, aligned to the current base-game rules and card data.

> **† Legal/IP review:** `Dragdagulan` is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review.

## Download

The current TTS package is committed at:

[`Haute_Hazard_v7.9_TTS_Playtest.zip`](../releases/v7.9/Haute_Hazard_v7.9_TTS_Playtest.zip)

The unpacked save is also committed at:

[`releases/v7.9/TTS/Haute_Hazard_v7_9_TTS_Playtest.json`](../releases/v7.9/TTS/Haute_Hazard_v7_9_TTS_Playtest.json)

All image sheets referenced by the save are committed under [`releases/v7.9/TTS/Assets/`](../releases/v7.9/TTS/Assets/).

## Included base-game objects

The generated save contains:

- 144-card Wardrobe deck
- 16-card Thrift Store supply
- 20-card Penalty supply
- 12 venue Stages
- 12 Queens
- five exact 12-card starter decks
- five current Player Aids

The 60 Starter + 144 Wardrobe + 16 Thrift + 20 Penalty cards account for the full **240-card Poker pool**.

## Setup after load

1. Shuffle the Wardrobe deck and deal **5 face-up cards** as the Wardrobe Rack.
2. Shuffle the Stage deck and reveal one active Stage.
3. Choose or randomize Queens.
4. Each participating player shuffles one 12-card starter deck and draws **5**.
5. Use the current Player Aid for the v7.9 turn sequence.

## Turn timing

The TTS save/player aid uses:

**1. Transformation → 2. Reveal → 3. Shopping → 4. Slay / Dragdagulan† / Pass → 5. Cleanup**

Generate printed Tips when cards are actually played during Transformation. Unplayed cards and already-equipped Masters generate no printed Tips.

Purchases go to Backstage Archive. Refill the five-card Wardrobe Rack during Cleanup, then draw a fresh hand of 5.

## TTS source QA

The committed package has passed automated/source-level checks for:

- valid JSON;
- 240 Poker-card mapping across 8 custom-deck sheets;
- expected Wardrobe, Starter, Thrift, and Penalty counts;
- 12 Stages and 12 Queens;
- five Player Aids;
- five exact starter decks;
- unique GUIDs;
- valid CardID/DeckID → CustomDeck mappings;
- all image textures at or below 4096 px;
- asset URLs pointing to the committed v7.9 GitHub paths;
- no legacy Tip Count wording in the current TTS package.

See [TTS_QA_REPORT.txt](../releases/v7.9/TTS/TTS_QA_REPORT.txt).

## Solo Circuit v0.2

Solo is a separate **30-card** module:

- 18 Automa
- 12 Personalities

The current additive-load package is committed at:

[`Haute_Hazard_Solo_Circuit_v0_2_TTS.zip`](../releases/solo-circuit-v0.2/Haute_Hazard_Solo_Circuit_v0_2_TTS.zip)

Its unpacked save/assets are under [`releases/solo-circuit-v0.2/TTS/`](../releases/solo-circuit-v0.2/TTS/).

Load the v7.9 base save first, then Additive Load the Solo v0.2 save.

## Runtime verification

Automated source/schema/path QA is complete, but it cannot replace actually opening the save inside Tabletop Simulator.

Before calling the build fully **runtime-verified**, smoke-test:

- base save opens;
- all card images resolve;
- decks can be shuffled/dealt normally;
- Player Aid displays correctly;
- Solo v0.2 Additive Load works;
- Solo textures display correctly;
- remote clients resolve the GitHub-hosted textures.

This is the only remaining TTS-specific verification caveat.

## Legacy

v7.8 and v7.7 TTS packages remain comparison/archive builds only. Do not use them for a normal v7.9 balance report without labeling the session mixed-version.
