# Haute & Hazard — Solo Circuit v0.2

**Experimental one-player module for the v7.9 base game.**

## Components

**30 separate solo cards:**

- 18 Automa cards
- 12 House Queen Personality cards

The Solo cards remain separate from the 240-card v7.9 base Poker Deck.

## Rules changes from v0.1

- base game updated from v7.8 timing to **v7.9 play-generated Tip** timing;
- Stage Timer expanded from 3 to **4 rounds**;
- House Base Appeal = `max(0, Stage Slay Target - 6)`;
- House Stage Appeal formula is explicit;
- House Stage scoring is explicit;
- House does not gain Judge's Favor or Brand Ovation by default;
- Automa round references are aligned to the four-round timer.

## Committed packages

- [Solo Circuit v0.2 Print & Play](Haute_Hazard_Solo_Circuit_v0_2_Print_and_Play.zip)
- [Solo Circuit v0.2 TTS](Haute_Hazard_Solo_Circuit_v0_2_TTS.zip)
- [Build manifest](BUILD_MANIFEST.json)
- [Checksums](CHECKSUMS.sha256)

The production folder contains all **18 Automa** and **12 Personality** card fronts plus the shared back.

The TTS folder contains:

- the v0.2 additive-load save;
- Automa, Personality, and back textures;
- build manifest;
- QA report.

Source-level TTS QA is complete. The remaining verification step is an actual in-app additive-load smoke test in Tabletop Simulator.

## Source of truth

- [Solo rules](../../docs/SOLO_CIRCUIT_AUTOMA_PLAYTEST.md)
- [Automa deck](../../docs/SOLO_CIRCUIT_AUTOMA_DECK.md)
- [Personalities](../../docs/SOLO_CIRCUIT_PERSONALITIES.md)
- [Quick Reference](../../docs/SOLO_CIRCUIT_QUICK_REFERENCE.md)
- [Print & Play guidance](../../docs/SOLO_CIRCUIT_PRINT_AND_PLAY.md)
- [TTS files](TTS/)
