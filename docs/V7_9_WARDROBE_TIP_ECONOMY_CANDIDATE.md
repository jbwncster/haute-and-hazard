# Haute & Hazard — v7.9 Wardrobe + Tip Economy Candidate

**Status: active development candidate for the next playtest build.**

This document records the card-pool redesign requested after reviewing the v7.8 Wardrobe. It does **not** retroactively change the already-produced v7.8 Game Crafter or Tabletop Simulator binaries.

## Why this redesign exists

The v7.8 Wardrobe often represents multiple physical copies of the same garment. That makes a Brand easy to recognize, but it can make Shopping decisions too repetitive: once a player knows what a Brand's Wig or Shoes does, later copies can feel interchangeable.

The v7.9 candidate changes that philosophy:

> **Brand tells you the strategy. Slot tells you the job. The individual garment tells you why this specific card is worth buying.**

## Wardrobe diversity rule

The candidate Wardrobe contains **130 unique Fashion cards + 14 unique Actions = 144 unique Wardrobe cards**.

There are no repeated Fashion cards in the 144-card Wardrobe candidate.

Within a Brand:

- every Face is a different garment with different rules text;
- every Wig is a different garment with different rules text;
- every Body is a different garment with different rules text;
- every Shoes card is a different garment with different rules text;
- every Accessory is a different garment with different rules text.

No two cards in the candidate share identical ability text.

## Brand distribution

The existing Tenets and Brands are retained.

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

Total Fashion: **130**.

The remaining **14 Wardrobe cards are unique neutral/Vogue Actions**.

## Brand identity remains consistent

Cards in the same Brand should feel related without being copies.

- **Sugar Rush:** draw, cycling, quick setup, Pink Matching.
- **Hyper-Glitch:** deck/top-card manipulation, market manipulation, Fusion tricks.
- **Necropolis:** Archive recursion, trash/death value, battle setup.
- **Slasher:** aggression, hostile interaction, Dragdagulan† pressure.
- **Void:** sacrifice, denial, delayed value, Fusion and Deep Storage.
- **Velvet Trap:** control, reactions, opponent choices, elegant tempo.
- **Gilded Cage:** high-Cost luxury, Gross SP, premium-value payoffs.
- **Trash Can:** trashing, cheap-card value, salvage and reuse.
- **Big Top:** Wild effects, risk/reward, unpredictable tempo.
- **Swamp Witch:** Deep Storage, slow engines, recursion.

## Slot identity also matters

The slot should help explain what kind of decision the card creates.

- **Face:** setup, information, hand/top-deck manipulation.
- **Wig:** cycling, Reveal setup, Tenet/battle preparation.
- **Body:** larger Appeal and build-around effects.
- **Shoes:** tempo, Shopping, completion, movement, LS.
- **Accessory:** reactions, tactical tricks, unusual utility.

A Slasher Shoe and a Slasher Wig should both feel like Slasher cards, but they should solve different problems.

## Printed Tips on every card

Every Poker card must display a **printed Tip value**, including cards whose value is **0**.

Printed Tips are different from **Cost**:

- **Cost** is what you pay to buy the card.
- **Printed Tips** are purchasing power the card contributes when it is in your hand.

### Tip Count

At the **start of your turn, before playing or equipping any cards**, perform a **Tip Count**:

1. Look at the cards currently in your hand.
2. Add the printed Tip value of **every card in that hand** to your Tip pool.
3. A printed value of 0 contributes nothing, but is still explicitly shown.
4. Counting a card's Tips does **not** discard or spend that card.
5. You may later play/equip the same card normally during Transformation.

A card's printed Tip value is counted **once per turn**, during Tip Count. Moving that card to the tableau does not generate its printed Tips again.

Queen abilities and rules effects may still add or remove Tips after Tip Count.

## Shopping and purchased cards

Shopping remains the point where accumulated Tips are spent.

When you buy a card:

> **Put it into your Backstage Archive / personal discard pile. Do not put it into your hand and do not immediately play or equip it.**

The card becomes part of your deck-building engine only after your personal Deck cycles:

**buy → discard/Archive → reshuffle when needed → draw later → count its printed Tips → play/equip it**

This delay is intentional. Buying a strong garment improves future turns rather than immediately changing the current Coordinate.

## Candidate turn timing

The current candidate keeps the familiar five phases but adds a pre-phase resource step:

**0. Tip Count → 1. Transformation → 2. Reveal → 3. Shopping → 4. Slay / Dragdagulan† / Pass → 5. Cleanup**

This preserves the existing timing for Queen abilities, Reveal effects, and Shopping while ensuring printed Tips are banked **before** cards leave the player's hand for the tableau.

## Starter-deck treatment

For the next generated build, every starter card should explicitly show a Tip value.

Recommended candidate values:

- **Basic Beat:** 1 printed Tip.
- **Messy Lip Sync:** 0 printed Tips.
- **Chapstick:** 1 printed Tip.
- **Penalty cards:** normally 0 printed Tips.

The exact starter balance remains a playtest variable, but no card should have an omitted Tip field.

## Current candidate database

The generated working files are:

- `Haute_Hazard_v7_9_Wardrobe_Redesign_Candidate.xlsx`
- `Haute_Hazard_v7_9_Wardrobe_Redesign_Candidate.csv`

They contain **144 candidate Wardrobe cards with 144 distinct ability texts** and explicit printed Tip values from 0–2.

## Playtest questions

When testing this candidate, record:

1. When two cards share a Brand and slot, do they create genuinely different purchase decisions?
2. Does a Brand still feel coherent even though its cards have different abilities?
3. Does Tip Count make hands more interesting?
4. Is it clear that printed Tips are counted before cards are equipped?
5. Do players accidentally count equipped cards' printed Tips a second time?
6. Does putting purchases into the Archive/discard create a satisfying deck-building delay?
7. Are 0-Tip cards worth drawing because their other effects are strong enough?
8. Are high-Cost cards with low printed Tips interesting rather than frustrating?
9. Do players have enough reason to buy multiple cards from the same Brand?
10. Does the larger variety increase rules load too much?

## Build policy

Do not overwrite the v7.8 physical/TTS binaries with this candidate piecemeal.

Once the candidate is approved for a test build, regenerate together:

- Poker-card faces;
- Print & Play PDFs;
- Game Crafter upload package;
- TTS card assets/save;
- Player Aid;
- rules / Learn to Play;
- card database and manifests.

Until that synchronized regeneration happens, **v7.8 remains the last fully packaged physical/digital build and v7.9 remains the active redesign candidate.**
