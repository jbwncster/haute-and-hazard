> **ARCHIVED DEVELOPMENT SNAPSHOT:** Solo Circuit v0.1 is superseded by **Solo Circuit v0.2** for the current v7.9 base game. This file is retained for historical package documentation.\n\n# Haute & Hazard — Solo Circuit v0.1 for Tabletop Simulator

**Experimental one-player add-on.** This adds the House Queen Automa to the current v7.8 Tabletop Simulator prototype without changing normal multiplayer.

## Fast start

1. Load the normal **Haute & Hazard v7.8 Standard Setup**.
2. Download `Haute_Hazard_Solo_Circuit_v0_1_TTS_AddOn.json`.
3. Put it in your Tabletop Simulator Saves folder or import it with your normal TTS save workflow.
4. Open the v7.8 Standard Setup.
5. Use **Additive Load** on the Solo Circuit save.
6. Shuffle the 18-card House Queen Automa deck.
7. Choose one optional House Queen Personality, or play generic.
8. First test: **Working Queen** difficulty + **Beginner Mode**.

## Included
18-card Automa deck; 12 selectable Personality cards; House SP, Appeal, Stage Timer and Bargain counters; House Wardrobe marker; difficulty and Dragdagulan† reminders.

Solo card graphics load directly from this public GitHub repository, so the add-on does not need a separate image installer.

## Runtime status
Save JSON, IDs, counts, image grids and remote asset paths were generated/schema-checked. **Tabletop Simulator itself was not available in the build environment**, so an in-app additive-load test is still required before calling this runtime-verified.

## Legal/IP
Dragdagulan† is working prototype terminology credited to Drag Den Philippines and remains subject to legal/IP, trademark, and publisher review before commercial release.


## GitHub upload verification

Verified on the current `main` branch:

- add-on save: `TTS/Haute_Hazard_Solo_Circuit_v0_1_TTS_AddOn.json`;
- 18-card Automa sheet: `TTS/Assets/solo_automa_18.png`;
- shared card back: `TTS/Assets/solo_back.png`;
- 12-card Personality sheet: `TTS/Assets/solo_personalities_12.png`;
- packaged download: `../Haute_Hazard_Solo_Circuit_v0_1_TTS.zip`.

The committed add-on JSON references those same public raw GitHub assets. The repository upload is therefore complete at the file/schema level.

**Remaining QA:** Tabletop Simulator itself was not available in the build environment, so a real in-app load plus Additive Load over the v7.8 Standard Setup is still required before marking the build runtime-verified.
