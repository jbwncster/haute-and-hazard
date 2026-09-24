# Haute & Hazard v7.9 — Tabletop Simulator

**Target package:** `Haute_Hazard_v7.9_TTS_Playtest.zip`

The v7.9 TTS build should match the v7.9 physical rules/card target, not the archived v7.8 timing.

## Required alignment

The TTS base must use:

- 240-card Poker Deck;
- 144 unique Wardrobe cards;
- printed Tip value on every Poker card;
- **Tip Count before Transformation**;
- 12 venue Stages;
- 12 Queens;
- v7.9 Player Aid wording;
- standard 2–5 player setup;
- two-player teaching setup.

## Tip Count

Players count printed Tips from all cards currently in hand before Transformation.

Do not use old starter scripting/text that grants the same printed Tip again when Basic Beat or Chapstick is played/equipped.

## Solo Circuit v0.2

Solo v0.2 is a separate add-on. Load the v7.9 base setup first, then additively load the Solo save.

See [Solo Circuit v0.2 TTS](../../solo-circuit-v0.2/TTS/README.md).

## Asset rule

Packaged saves should resolve bundled assets from the v7.9 package. Avoid stale absolute or older-version file paths.

For remote online play, the host may need to upload local assets through Tabletop Simulator Cloud Manager and resave the table before inviting remote players.

## Runtime verification checklist

Do not mark the TTS build fully verified until a real in-app test confirms:

- saves open without missing-object errors;
- all card/deck counts are correct;
- images load;
- teaching setup opens correctly;
- v7.9 Player Aid displays correctly;
- Solo v0.2 can Additive Load over the standard setup.
