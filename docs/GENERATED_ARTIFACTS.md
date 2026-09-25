# Haute & Hazard — Generated Artifact Status

This page tracks the current v7.9 production deliverables and archived generated builds.

## Current canonical sources

- `data/v7_9_card_database.csv` — committed 240-row Poker-card source.
- `data/v7_9_queen_database.csv` — committed 12-Queen source.
- `data/v7_9_stage_database.csv` — committed 12-Stage venue source with verified production text.
- `data/v7_9_stage_registry.csv` — Stage identity/status registry.

New v7.9 production renders should come from these sources. Archived v7.8 image decks are provenance/comparison material, not the current card-data source.

## Current committed v7.9 artifacts

| Artifact | Purpose | Status |
|---|---|---|
| [`Haute_Hazard_v7.9_Game_Crafter_Print_Edition.zip`](../releases/v7.9/Haute_Hazard_v7.9_Game_Crafter_Print_Edition.zip) | Game Crafter upload package | **Committed; physical preflight passed** |
| [`Haute_Hazard_v7_9_Print_and_Play_Physical_Kit.zip`](../releases/v7.9/Haute_Hazard_v7_9_Print_and_Play_Physical_Kit.zip) | Home-print base-game kit | **Committed; PDF/render preflight passed** |
| [`Haute_Hazard_v7.9_TTS_Playtest.zip`](../releases/v7.9/Haute_Hazard_v7.9_TTS_Playtest.zip) | Multiplayer TTS package | **Committed; source/schema/path QA passed; in-app smoke test pending** |
| [`Haute_Hazard_Solo_Circuit_v0_2_Print_and_Play.zip`](../releases/solo-circuit-v0.2/Haute_Hazard_Solo_Circuit_v0_2_Print_and_Play.zip) | Solo v0.2 physical module | **Committed; PDFs generated and preflighted** |
| [`Haute_Hazard_Solo_Circuit_v0_2_TTS.zip`](../releases/solo-circuit-v0.2/Haute_Hazard_Solo_Circuit_v0_2_TTS.zip) | Solo v0.2 TTS add-on | **Committed; source/schema/path QA passed; in-app additive-load test pending** |

## v7.9 production counts

Base game:

- 240 Poker fronts
- 12 Stage fronts
- 12 Queen fronts
- 5 Player Aid fronts/backs
- Medium Folio rules
- Medium Prototype Box

Optional Solo v0.2:

- 18 Automa
- 12 Personalities
- **30 separate solo cards**

The Solo cards do not change the 240-card base Poker Deck count.

## TTS files

The base-game TTS save is committed at:

- [`releases/v7.9/TTS/Haute_Hazard_v7_9_TTS_Playtest.json`](../releases/v7.9/TTS/Haute_Hazard_v7_9_TTS_Playtest.json)

Its referenced assets are committed under:

- [`releases/v7.9/TTS/Assets/`](../releases/v7.9/TTS/Assets/)

The Solo v0.2 additive-load save and assets are committed under:

- [`releases/solo-circuit-v0.2/TTS/`](../releases/solo-circuit-v0.2/TTS/)

All generated TTS texture sheets are kept at or below 4096 px.

## Physical QA

See:

- [v7.9 physical preflight](../releases/v7.9/PRINT_PREFLIGHT_REPORT.txt)
- [v7.9 build manifest / SHA-256 hashes](../releases/v7.9/BUILD_MANIFEST.json)
- [Game Crafter upload guide](../releases/v7.9/UPLOAD_GUIDE.md)

The generated prototype art is functional and print-safe. Commercial art direction and legal/IP clearance are separate from production-file preflight.

## Automated builds

The committed release packages are reproducible from canonical source data through the v7.9 build workflows. The combined **Build v7.9 physical and TTS artifacts** workflow has completed successfully with the current generated package structure.

## Archived generated v7.8 artifacts

The following filenames/hashes document the earlier v7.8 workspace and are retained for provenance, not as the current rules target:

| Artifact | Historical status | SHA-256 |
|---|---|---|
| `Haute_Hazard_v7.8_Game_Crafter_Print_Edition.zip` | archived v7.8 physical package | `b067089ebd85ccf8d657272e44f8a1ee1d85f9ba5e0add5bd185a78557ef96dc` |
| `Haute_Hazard_v7_8_Print_and_Play_Physical_Kit.zip` | archived v7.8 home-print package | `cf98822211032e2b76d11fb4b7f081cabc8459648f6ca92e877fd3d670e6dabb` |
| `Haute_Hazard_v7.8_TTS_Playtest.zip` | archived v7.8 TTS package | `eb9c49515939d5c6b589a3baa16006fb490d23596de198cae39ee9b524ed5fc8` |
| `Haute_Hazard_v7.8_Fashion_Card_Visual_Refresh.zip` | archived/review candidate | `34456a92080078c3258a8876ec55e0867f240a1eb8abad6aff9767016650fe5d` |

## Archived Solo v0.1

The files under `releases/solo-circuit-v0.1/` remain historical v0.1 artifacts and should not be relabeled v0.2.

## Publisher/project artifacts

Earlier publisher/project working files labeled v7.8 should be regenerated/re-labeled before being presented as v7.9-specific publisher deliverables.

## Canonical rule

**v7.9 is the current rules/card/production target.**  
**Solo Circuit v0.2 is the current experimental one-player target.**

Physical binaries and TTS source assets are now committed. TTS runtime verification remains separate from source/schema/path QA.
