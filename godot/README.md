# Haute & Hazard — Godot Edition

An original drag-fashion deck-building game. Build a Coordinate, shop the Rack, and try to Slay each Stage before The House does.

## Run the project

1. Install the Godot **4.7.2 stable** standard editor from [godotengine.org](https://godotengine.org/download/).
2. Import this folder by opening `project.godot`.
3. Press **F6** or **F5**.

This is a self-contained Godot project. All 240 canonical v7.9 cards, 12 Queens, 12 Stages, and 18 House automa cards are bundled in `data.json`.

## Modes

- **Solo vs The House:** choose a House difficulty. The House reveals an automa card, drafts a Wardrobe card, and scores against the Stage each time you pass. If it cannot claim earlier, it claims at the end of round four.
- **Pass and Play:** 2–5 people can play on one device. Each player builds a Look, shops, and can Slay the Stage. The digital edition closes a Stage after four full rounds and awards it to the highest eligible Appeal score.

## Turn flow

1. **Transformation:** play Actions and equip Fashion from your hand. Played cards give their printed Tips. Replacing a Master sends the old one to your Archive.
2. **The Reveal:** resolve the Coordinate's Appeal, Matching/Perfect multiplier, Stage modifiers, and Spotlight requirement.
3. **Shopping:** buy cards from the Wardrobe Rack or the current Thrift card. Bought cards go to your Archive.
4. **Slay / Pass:** claim the Stage when your score reaches its target and Spotlight requirement, or pass. Stages are worth their printed Gross SP plus eligible full-rules bonuses.
5. **Curtain Call:** the winner receives the next Stage. Masters go to the Archive, the Wardrobe Rack refills, and players draw five cards.

Final judging begins after the Stage deck runs out or a player reaches 30 Gross SP. Penalty cards subtract their printed penalty from final SP.

## Effect automation

Printed effects are shown on every card. This playtest edition automatically handles basic `Gain N Appeal`, `Gain N Tips`, and `Draw N cards` effects when they occur in a Play, Equip, or Vogue effect. Multi-step, conditional, opponent-targeting, and some named ability effects are shown in the action log for manual resolution. This makes the build suitable for digital playtesting, but it is not a fully automated implementation of every card's special text.

## itch.io upload

The source project is not itself an end-user desktop build. Export the `Windows Desktop` and/or `Linux Desktop` presets in the Godot editor, zip each platform's executable with its `.pck` and README, then upload those zips as **Downloadable** files. `export_presets.cfg` is included. Godot export templates must be installed in Godot before exporting.

Suggested page details are in [ITCH_PAGE_DRAFT.md](ITCH_PAGE_DRAFT.md). The cover asset is [cover.svg](cover.svg).

## Attribution and disclosure

Game design and canonical game data: Jake W. The Godot GDScript implementation and some documentation were created with generative-AI assistance and edited for this project; disclose this in itch.io's AI-generation field. No third-party game engine assets are included. Godot Engine is distributed under the MIT license; see [godotengine.org/license](https://godotengine.org/license).
