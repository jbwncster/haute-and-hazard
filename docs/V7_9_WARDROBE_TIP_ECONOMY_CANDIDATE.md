# Haute & Hazard — v7.9 Wardrobe + Tip Economy

**Status: current v7.9 base-game rules and card-pool target.**

This document is the source of truth for the v7.9 Wardrobe redesign and printed-Tip economy. It supersedes the v7.8 repeated-garment Wardrobe model.

## v7.9 card-pool rule

The 144-card Wardrobe contains:

- **130 unique Fashion cards**
- **14 unique Actions**
- **144 distinct rules-text entries**

There are no repeated Fashion cards in the v7.9 Wardrobe.

Within a Brand, different cards should share a strategic identity without becoming copies of one another. Slot identity also matters: Face, Wig, Body, Shoes, and Accessory should create different tactical jobs even when they belong to the same Brand.

### Brand distribution

| Brand | Tenet | Fashion cards | Unique cards per slot |
|---|---|---:|---:|
| Sugar Rush | Pink | 20 | 4 |
| Hyper-Glitch | Pink | 10 | 2 |
| Necropolis | Blue | 15 | 3 |
| Slasher | Blue | 10 | 2 |
| Void | Blue | 10 | 2 |
| Velvet Trap | Purple | 20 | 4 |
| Gilded Cage | Purple | 10 | 2 |
| Trash Can | Yellow | 15 | 3 |
| Big Top | Yellow | 10 | 2 |
| Swamp Witch | Yellow | 10 | 2 |

Total Fashion: **130**. The remaining **14 Wardrobe cards are unique neutral/Vogue Actions**.

## Brand identity

- **Sugar Rush:** draw, cycling, quick setup, Pink Matching.
- **Hyper-Glitch:** top-deck and Market manipulation, Fusion tricks.
- **Necropolis:** Archive recursion, trash/death value, battle setup.
- **Slasher:** aggression, hostile interaction, Dragdagulan† pressure.
- **Void:** sacrifice, denial, delayed value, Fusion and Deep Storage.
- **Velvet Trap:** control, reactions, opponent choices, tempo.
- **Gilded Cage:** high-Cost luxury, Gross SP, premium-value payoffs.
- **Trash Can:** trashing, cheap-card value, salvage and reuse.
- **Big Top:** Wild effects, risk/reward, unpredictable tempo.
- **Swamp Witch:** Deep Storage, slow engines, recursion.

## Printed Tips on every Poker card

Every card in the 240-card Poker Deck displays a **printed Tip value**, including cards whose value is **0**.

**Cost** and **printed Tips** are different:

- **Cost** is what you pay to buy a card.
- **Printed Tips** are purchasing power contributed by a card in your hand during Tip Count.

## Tip Count

At the **start of your turn, before Transformation**, perform Tip Count:

1. Look at every card currently in your hand.
2. Add the printed Tip values of those cards to your Tip pool.
3. A printed 0 contributes nothing but is still shown.
4. Counting a card does not discard, play, or equip it.
5. A card's printed Tip value is counted **once per turn**.
6. Moving the card to the Coordinate or playing it later does not generate its printed Tips again.

Queen abilities and card effects may still add or remove Tips after Tip Count.

### Starter-card correction

To prevent double counting under v7.9:

- **Basic Beat:** printed Tip **1**; it does not also say “gain 1 Tip when played.”
- **Messy Lip Sync:** printed Tip **0**.
- **Chapstick:** printed Tip **1**; it does not also generate that printed Tip again when equipped/played.
- **Penalty cards:** normally printed Tip **0**.

Any older starter wording that grants the same Tip again when played is legacy v7.8 wording and should not be used in a v7.9 test.

## Shopping and purchased cards

When you buy a card:

> **Put it into your Backstage Archive / personal discard pile. Do not put it into your hand and do not immediately play or equip it.**

The deck-building loop is:

**buy → Archive → reshuffle when needed → draw later → count printed Tips → play/equip**

## v7.9 turn timing

**0. Tip Count → 1. Transformation → 2. Reveal → 3. Shopping → 4. Slay / Dragdagulan† / Pass → 5. Cleanup**

Tip Count happens before any card can leave the hand for the Coordinate.

## Main component accounting

The base-game Poker Deck remains **240 cards**:

- 60 Dressing Room Floor starter cards
- 144 Wardrobe Rack cards
- 16 Thrift Store Throwbacks
- 20 Penalty cards

Stages, Queens, Player Aids, rules, and the optional Solo Circuit module are separate components.

## Build synchronization rule

A v7.9 playtest should use v7.9 wording across the same session. Do not mix a v7.9 Tip Count deck with v7.8 starter text, Player Aids, or rules.

The synchronized v7.9 production target includes:

- Poker-card faces;
- Print & Play PDFs;
- Game Crafter upload package;
- Tabletop Simulator assets/save;
- Player Aids;
- rules / Learn to Play;
- card database and manifests.

Binary availability on GitHub is tracked separately from rules status. If a binary ZIP is not visibly attached, do not substitute an older v7.8 package and call it v7.9.

## Playtest questions

Record whether:

1. cards within the same Brand + slot create different purchase decisions;
2. Brand identities remain recognizable;
3. Tip Count is remembered before Transformation;
4. players accidentally count an equipped/played card's printed Tips twice;
5. 0-Tip cards remain attractive;
6. the Archive delay makes purchases feel like deck-building;
7. the larger unique Wardrobe creates too much reading;
8. the revised economy produces enough meaningful Shopping choices.

> **† Legal/IP review:** Dragdagulan is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review before commercial release.
