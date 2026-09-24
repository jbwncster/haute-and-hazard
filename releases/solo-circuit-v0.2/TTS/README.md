# Haute & Hazard — Solo Circuit v0.2 for Tabletop Simulator

**Experimental add-on for the v7.9 TTS base.**

## Fast start target

1. Load **Haute & Hazard v7.9 Standard Setup**.
2. Additively load the Solo Circuit v0.2 save.
3. Shuffle the 18-card Automa deck.
4. Choose a Personality or use generic House Queen.
5. Start with **Working Queen + Beginner Mode**.

## Expected package

`Haute_Hazard_Solo_Circuit_v0_2_TTS.zip`

Expected add-on save:

`Haute_Hazard_Solo_Circuit_v0_2_TTS_AddOn.json`

## Included solo content

- 18-card Automa deck
- 12 Personality cards
- House Gross SP tracker
- House Appeal reference
- four-round Stage Timer
- House Wardrobe area/marker
- difficulty reference
- Dragdagulan† reminder

## v0.2 rules alignment

House Base Appeal:

`max(0, Stage Slay Target - 6)`

House Stage Appeal:

`Base + revealed Automa Appeal + effects + difficulty`

After Round 4, if neither side has Slayed the Stage, House claims it by timeout and gains the printed Gross SP reward.

## Asset-path rule

The add-on should reference assets bundled with the current Solo v0.2 package or stable hosted assets that actually exist. Do not leave stale v0.1 or local-machine-only paths in the save.

## Runtime status

Schema/path validation is not enough. A real Tabletop Simulator test must confirm:

- additive load over v7.9 works;
- all 18 Automa cards display;
- all 12 Personality cards display;
- Stage Timer and counters work;
- no broken textures;
- Dragdagulan† reminders are readable;
- save remains usable for remote play after appropriate cloud hosting/resave.
