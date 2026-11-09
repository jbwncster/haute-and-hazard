# Haute & Hazard — Digital Playtest v0.1

A standalone browser-based vertical slice for experimenting with a digital version of **Haute & Hazard**.

## Design direction

This prototype combines three high-level digital-card-game ideas while keeping Haute & Hazard's presentation original:

- tactile, atmospheric card-table play;
- dramatic combo/multiplier feedback when a Look is revealed;
- a persistent tableau/engine built from Fashion Masters.

It does **not** copy another game's art, interface, cards, text, or assets.

## What is playable

- all 12 current v7.9 Queens;
- all 12 current v7.9 Stages;
- the canonical v7.9 starter cards and 144-card Wardrobe data;
- 5-card hands and play-generated printed Tips;
- persistent Face / Wig / Body / Shoes / Accessory Masters;
- Matching ×2 and Perfect Illusion ×3;
- five-card Wardrobe Rack and Archive-delay purchases;
- Solo Circuit House Base Appeal and the 18-card Automa;
- four-round Stage timer;
- simplified digital Dragdagulan†;
- local browser save/resume.

## Digital-only run structure

The default digital run is five random Stages for a faster videogame-style playtest. A 3-Stage quick test and 12-Stage full circuit are selectable at setup. This run length choice is a digital prototype layer, not a replacement for the tabletop end-game rules.

## Current automation limits

The app fully automates the core resource/Look/Stage loop, but it does not yet implement every unique v7.9 card ability, Queen ability, Personality, Judge's Favor, Brand Ovation, or advanced Stage exception. Those texts remain visible so the app can grow toward full rules coverage without inventing replacements.

## Run locally

This app has no build step or third-party runtime dependencies.

From the repository root:

```bash
python -m http.server 8080
```

Then open:

```
http://localhost:8080/digital-playtest/
```

## Files

- `index.html` — app shell
- `styles.css` — original visual system
- `app.js` — game state + interaction loop
- `data.js` — generated snapshot of canonical v7.9 data
