# Haute & Hazard — v7.9 Wardrobe + Tip Economy

**Status: current v7.9 base-game rules and card-pool target.**

This document defines the v7.9 Wardrobe redesign and printed-Tip economy. The **canonical per-card data** is committed at [`../data/v7_9_card_database.csv`](../data/v7_9_card_database.csv), with validation notes in [`../data/V7_9_CARD_DATABASE.md`](../data/V7_9_CARD_DATABASE.md).

## Canonical data source

**Update the CSV first.** Physical card faces, Print & Play output, Game Crafter assets, TTS assets, balance sheets, and card lists should be regenerated from the same CSV revision.

Current database QA:

- 240 physical Poker-card rows;
- 130 unique Wardrobe Fashion names;
- 14 unique Wardrobe Actions;
- 144 distinct Wardrobe rules-text entries;
- explicit printed Tip values on all 240 rows.

## v7.9 card-pool rule

The 144-card Wardrobe contains:

- **130 unique Fashion cards**
- **14 unique Actions**
- **144 distinct rules-text entries**

There are no repeated Fashion cards in the v7.9 Wardrobe.

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

## Tips = Power-like deck-building currency

Every card in the 240-card Poker Deck displays a **printed Tip value**, including 0.

**Cost** and **printed Tips** are different:

- **Cost** is what you pay to buy a card.
- **Printed Tips** are the purchasing power generated when you **play that card from your hand**.

This is intentionally analogous to a Power-style shared-market deck-builder: cards must be played to generate buying power.

## Generating printed Tips

During **Transformation**:

1. Play a card from your hand.
2. Immediately add its printed Tip value to your Tip pool.
3. Resolve that card's legal Action/equip instructions.
4. Each physical card generates its printed Tips only once when played that turn.

Important consequences:

- Holding a card does not generate Tips.
- A printed 0 generates no Tips.
- A Master that was already equipped before this turn does not generate Tips again.
- If you draw a card during Transformation, you may later play it during that same Transformation and generate its printed Tips.
- If you draw a card after Transformation, it normally cannot generate printed Tips that turn unless an effect lets you play it.
- Explicit “gain Tips” effects add to the same pool and are separate from printed Tips.

### Actions

Playing an Action generates its printed Tips, then resolves its effect. Unless moved elsewhere, it is archived during Cleanup.

### Fashion

Playing Fashion generates its printed Tips, then you may:

- legally equip it as a Master and resolve its Equip effect; or
- play it for Tips only without equipping it.

Fashion played for Tips only contributes no Appeal, LS, Tenet, Brand, or Look status and is archived during Cleanup.

## Starter cards

- **Basic Beat:** printed Tip **1**; no additional effect.
- **Messy Lip Sync:** printed Tip **0**; its play effect supplies performance value instead.
- **Chapstick:** printed Tip **1**; after its printed Tip is generated, its Equip effect may filter the hand.
- **Penalty cards:** normally printed Tip **0**.

## Shopping and purchased cards

When you buy a card:

> **Put it into your Backstage Archive / personal discard pile. Do not put it into your hand and do not immediately play or equip it.**

The deck-building loop is:

**draw hand → play cards to generate Tips → resolve Look → Shop → purchases enter Archive → reshuffle later → draw upgraded cards**

## v7.9 turn timing

**1. Transformation → 2. Reveal → 3. Shopping → 4. Slay / Dragdagulan† / Pass → 5. Cleanup**

Printed Tips are generated during Transformation as cards are played.

## Main component accounting

The base-game Poker Deck remains **240 cards**:

- 60 Dressing Room Floor starter cards
- 144 Wardrobe Rack cards
- 16 Thrift Store Throwbacks
- 20 Penalty cards

Stages, Queens, Player Aids, rules, and the optional Solo Circuit module are separate components.

## Build synchronization rule

A v7.9 playtest should use the same Power-like Tip rule across card text, Player Aids, rules, Game Crafter, Print & Play, and TTS.

## Playtest questions

Record whether:

1. cards within the same Brand + slot create different purchase decisions;
2. Brand identities remain recognizable;
3. players understand that **only played cards generate printed Tips**;
4. players accidentally count unplayed hand cards;
5. players accidentally regenerate Tips from Masters already equipped from earlier turns;
6. playing Fashion for Tips without equipping is intuitive;
7. cards drawn during Transformation create satisfying combo turns;
8. Opulencia's per-card Tip bonus is clear and balanced;
9. 0-Tip cards remain attractive;
10. the Archive delay and Power-like economy create meaningful Shopping choices.

> **† Legal/IP review:** Dragdagulan is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review.
