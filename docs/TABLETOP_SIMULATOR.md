# Haute & Hazard v7.9 — Tabletop Simulator Playtest

The current digital target is **v7.9**, aligned to the current v7.9 base-game rules/card target.

> **† Legal/IP review:** `Dragdagulan` is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review.

## Package target

`Haute_Hazard_v7.9_TTS_Playtest.zip`

If that ZIP is not visibly attached to GitHub, see [releases/v7.9/TTS](../releases/v7.9/TTS/README.md) for the current source/status record.

## v7.9 alignment

The TTS base should contain:

- 240-card Poker Deck
- 60 starter cards
- 144 unique Wardrobe cards
- 16 Thrift
- 20 Penalty
- 12 venue Stages
- 12 Queens
- current Player Aid
- standard 2–5 player setup
- two-player teaching setup

## Turn timing

The TTS rules/player aid must use:

**1. Transformation → 2. Reveal → 3. Shopping → 4. Slay / Dragdagulan† / Pass → 5. Cleanup**

Generate printed Tips when cards are actually played from hand during Transformation. Unplayed cards and already-equipped Masters generate no Tips.

Do not use old starter text/scripts that also grant the same printed Tip when Basic Beat or Chapstick is played.

## Solo Circuit v0.2

Solo is a separate **30-card** module:

- 18 Automa
- 12 Personalities

Load the v7.9 standard setup first, then Additive Load the Solo v0.2 save.

See [Solo Circuit v0.2 TTS](../releases/solo-circuit-v0.2/TTS/README.md).

The Solo rules use:

- four-round Stage Timer;
- House Base Appeal = `max(0, Slay Target - 6)`;
- explicit House Stage scoring.

## Runtime verification

A generated/schema-checked save is not the same as an in-app test.

Before calling v7.9 fully runtime-verified, confirm:

- standard setup opens;
- teaching setup opens;
- all images resolve;
- deck counts are correct;
- Player Aid shows play-generated Tip timing;
- Solo v0.2 Additive Load works;
- no stale v7.8/v0.1 asset paths remain.

## Online play

If packaged saves use local assets, the host should upload them through Tabletop Simulator Cloud Manager and resave before remote play.

## Legacy

v7.8 and v7.7 TTS packages remain comparison/archive builds only. Do not use them for a normal v7.9 balance report without labeling the session mixed-version.
