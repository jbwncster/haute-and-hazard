# Haute & Hazard — Generated Artifact Status

This document records the newest generated working files for the **v7.8 prototype** so the repository documentation stays aligned with the current project workspace.

> **Binary attachment note:** This page records generated artifacts and integrity hashes. A listed file is not necessarily downloadable from GitHub unless the binary itself is visibly committed or attached to a GitHub Release.

## Current generated artifacts

| Artifact | Purpose | Status | SHA-256 |
|---|---|---|---|
| `Haute_Hazard_v7_8_Publisher_Pitch_Deck.pptx` | 10-slide publisher presentation | Current; layout-overlap pass completed | `3b8edc8c61289c41c437fd195668b274251be9bdaa44df2fcd0bb447670ed1b9` |
| `Haute_Hazard_v7_8_Project_Tracker.xlsx` | Playtest, balance, card, IP, rules, and project tracking workbook | Current working tracker | `3dec7db094a90b6f0c84c69ee5eae392c900d534ff7d2790b623a8adf622e191` |
| `Haute_Hazard_v7_8_Project_Bundle.zip` | Consolidated handoff bundle containing current publisher, branding, tracker, physical, and TTS materials | Current handoff bundle | `27d4720e30316f37fdcc590db40384cb715eb19d1cb90a2589925a5768ab326a` |
| `Haute_Hazard_Publisher_Sell_Sheet_Jake_Weiner.pdf` | Publisher-facing one-page overview | Current generated PDF | `698852909d694ed77c030b0e551a2276e49e7c3ffdce8c30b7081cfa55785687` |
| `Haute_Hazard_v7.8_Game_Crafter_Print_Edition.zip` | Current v7.8 physical-production package | Current physical playtest build | `b067089ebd85ccf8d657272e44f8a1ee1d85f9ba5e0add5bd185a78557ef96dc` |
| `Haute_Hazard_v7_8_Print_and_Play_Physical_Kit.zip` | Noob-friendly home-print physical playtest kit with 240-card deck, Stages, Queens, Player Aids, rules, optional backs, and Start Here sheet | Current PnP handoff | `cf98822211032e2b76d11fb4b7f081cabc8459648f6ca92e877fd3d670e6dabb` |
| `Haute_Hazard_v7.8_TTS_Playtest.zip` | Current v7.8 Tabletop Simulator multiplayer package | Current synchronized digital playtest build; in-app runtime verification still required | `eb9c49515939d5c6b589a3baa16006fb490d23596de198cae39ee9b524ed5fc8` |
| `Haute_Hazard_Solo_Circuit_v0_1_Print_and_Play.zip` | Experimental one-player physical Automa kit | **Committed to GitHub** under `releases/solo-circuit-v0.1/`; physical v0.1 playtest candidate | — |
| `Haute_Hazard_Solo_Circuit_v0_1_TTS.zip` | Experimental one-player Tabletop Simulator Automa add-on | **Committed to GitHub**; additive-load candidate over v7.8; in-app runtime verification still required | — |
| `Haute_Hazard_v7.8_Fashion_Card_Visual_Refresh.zip` | Working Game Crafter package with all 240 Poker-card fronts moved into the new copyright-safe fashion-card frame | **Review candidate; not yet canonical v7.8 print build** | `34456a92080078c3258a8876ec55e0867f240a1eb8abad6aff9767016650fe5d` |

## Fashion-card visual refresh status

The new visual-refresh candidate applies the design direction documented in [CARD_VISUAL_REFRESH.md](CARD_VISUAL_REFRESH.md).

The working package:

- refreshes **all 240 Poker-card fronts**;
- preserves the existing safe-content inset and therefore retains the current card name, Brand/status line, cost, slot/type, Tips, Appeal, LS, SP, rules text, flavor, card ID, and prototype notices;
- replaces the old blurred outer bleed/frame with an original Haute & Hazard collectible-fashion-card treatment;
- introduces original runway-light rails, geometric sparkle accents, and stronger Tenet/color framing;
- does **not** use Aikatsu! artwork, characters, logos, Brand marks, icons, QR treatments, fonts, exact card-frame geometry, or other copied trade dress;
- leaves Stages, Queens, Rules, Player Aids, Box, and Poker-card back unchanged for this review pass.

QA recorded **240 / 240 fronts at 825 × 1125 px with no dimension failures**.

This file is intentionally recorded as a **review candidate**, not a replacement for the canonical Game Crafter package, until the new frame has been visually approved and a final interior/art pass is complete.

## Pitch deck status

The current PowerPoint has completed an overlap/layout correction pass. The repository slide script remains [PITCH_DECK.md](PITCH_DECK.md); the generated PowerPoint is the presentation-ready implementation of that material.

The deck should continue to label **Dragdagulan†** as working prototype terminology subject to legal/IP, trademark, and publisher review.

## Project tracker status

The current workbook supports the project-management system represented by the repository CSV templates and guides. It is intended to centralize:

- playtest session records;
- balance observations and change history;
- card/source-of-truth tracking;
- legal/IP review items;
- rules clarifications;
- project status and publisher-readiness work.

Repository CSV templates remain useful as lightweight, version-controllable exports even when the workbook is the primary working tracker.

## Project bundle contents

The current consolidated bundle includes the most useful handoff files for the active prototype, including:

- publisher sell sheet;
- corrected publisher pitch deck;
- project tracker workbook;
- current branding/social assets;
- current v7.8 Game Crafter physical package;
- current v7.8 Tabletop Simulator package.

The bundle is a convenience handoff, not a replacement for the repository's canonical text documentation.

## Canonical version rule

**v7.8 remains the current synchronized multiplayer physical and digital playtest target.** **Solo Circuit v0.1** is tracked separately as an experimental one-player module with both physical and TTS builds. The original `Haute_Hazard_v7.8_Game_Crafter_Print_Edition.zip` remains canonical while the fashion-card refresh is under review. Rules, card pools, Queens, Stages, Beginner Mode, and legal/IP marker conventions should stay aligned across the physical and TTS builds.

Anything marked **†** remains subject to legal/IP, trademark, rights, and publisher review before commercial release. See [IP_REVIEW_REGISTER.md](IP_REVIEW_REGISTER.md) and [ATTRIBUTIONS.md](ATTRIBUTIONS.md).


## Solo Circuit v0.1 artifact status

The Solo Circuit development module is now available in both formats:

- **Physical:** [`Haute_Hazard_Solo_Circuit_v0_1_Print_and_Play.zip`](../releases/solo-circuit-v0.1/Haute_Hazard_Solo_Circuit_v0_1_Print_and_Play.zip)
- **Tabletop Simulator:** [`Haute_Hazard_Solo_Circuit_v0_1_TTS.zip`](../releases/solo-circuit-v0.1/Haute_Hazard_Solo_Circuit_v0_1_TTS.zip)
- **TTS source/status folder:** [`../releases/solo-circuit-v0.1/TTS/`](../releases/solo-circuit-v0.1/TTS/)

The TTS package contains a saved add-on JSON, 18-card Automa image sheet, 12-card Personality image sheet, shared card back, manifest, and QA report. It is intended for **Additive Load** over the v7.8 Standard Setup. Its JSON structure, card IDs, counts, image-grid dimensions, and public GitHub asset paths were checked, but an actual in-app Tabletop Simulator load remains outstanding.
