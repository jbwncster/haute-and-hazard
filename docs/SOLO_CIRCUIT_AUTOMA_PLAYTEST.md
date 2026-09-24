# Haute & Hazard — Solo Circuit Automa Playtest v0.2

**Status: experimental one-player module for the v7.9 base game.**

Solo Circuit is intentionally separate from the 240-card multiplayer Poker Deck. The human player uses normal v7.9 rules while an automated rival, the **House Queen**, uses a streamlined behavior deck instead of a second full hand, deck, and Coordinate.

> **† Legal/IP review:** `Dragdagulan` is working prototype terminology credited to *Drag Den Philippines*. It remains subject to legal/IP, trademark, and publisher review.

## Components

Solo Circuit v0.2 uses **30 separate solo cards**:

- **18 House Queen Automa cards**
- **12 House Queen Personality cards**

Also use:

- 1 Solo Circuit quick reference
- Stage Timer marker
- House Gross SP tracker
- House Wardrobe area/marker
- optional Bargain / Match / reminder counters
- playtest log

Do **not** shuffle the 30 solo cards into the 240-card base-game Poker Deck.

## Base-game compatibility

Solo Circuit v0.2 assumes **v7.9** timing:

**0. Tip Count → 1. Transformation → 2. Reveal → 3. Shopping → 4. Slay / Dragdagulan† / Pass → 5. Cleanup**

The human player follows normal v7.9 rules, including printed Tips and the Archive delay for purchased cards.

## Setup

1. Set up one human player normally using v7.9.
2. Choose a player Queen.
3. Choose a different Queen for the House Queen, or use a generic House Queen.
4. Shuffle the **18-card Automa deck**.
5. Choose one optional Personality, or play generic.
6. Set House Gross SP to **0**.
7. Set the Stage Timer to **Round 1**.
8. Set up the normal Wardrobe Rack, Thrift Store, Penalties, and Stage deck.
9. Choose a difficulty.
10. For a first test, use **Working Queen + Beginner Mode**.

## Difficulty

| Difficulty | House modifier |
|---|---|
| **Local Girl** | −2 Appeal; −1 LS |
| **Working Queen** | printed values |
| **Headliner** | +1 Appeal |
| **Legend** | +2 Appeal; +1 LS |

House Appeal and House LS cannot be reduced below 0.

## House Base Appeal — v0.2 formula

The House Queen no longer needs a hidden Stage-by-Stage base-value table.

For every Stage:

> **House Base Appeal = max(0, Stage Slay Target − 6)**

Then calculate that round's House performance:

> **House Stage Appeal = House Base Appeal + revealed Automa Appeal + applicable Automa/Personality effects + difficulty Appeal modifier**

Calculate this fresh each round. House Appeal does **not** accumulate from previous rounds unless a card explicitly creates a carryover effect.

### Example

A Stage has **Slay Target 12**.

- House Base Appeal = 12 − 6 = **6**
- Revealed Automa Appeal = **4**
- Working Queen modifier = **0**

House Stage Appeal = **10** before any card/Personality bonus.

## Solo round sequence

### 1. Reveal one Automa card

Reveal the top Automa card.

Resolve its **Wardrobe** instruction first. A removed Market card goes face-up to **House Wardrobe**. Refill the Market immediately.

Keep the Automa card face-up for its Appeal, LS, and round effect.

### 2. Take the human player's normal v7.9 turn

Start with **Tip Count**, then play the normal turn.

### 3. Check for a player Slay

If the player legally Slays the Stage during Phase 4:

- the player claims the Stage trophy;
- the player gains the normal printed reward;
- resolve player-facing Slay effects normally;
- proceed to Curtain Call;
- the House Queen does not score that Stage.

### 4. Resolve House Appeal

If the player did not Slay, calculate House Stage Appeal using the v0.2 formula.

If House Appeal meets or exceeds the Slay Target, the House Queen claims the Stage.

### 5. Advance the Stage Timer

If neither side claims the Stage, advance the timer by one round.

The Stage can remain active for **four solo rounds**.

At the end of **Round 4**, if neither side has Slayed it, the House Queen claims the Stage by timeout and Curtain Call begins.

## Solo Stage scoring table

| Result | Player | House Queen |
|---|---|---|
| Player Slays | Claims trophy; gains normal printed Stage reward and legal player effects | 0 from that Stage |
| House reaches Slay Target | No Stage reward | Claims Stage record/trophy; gains the Stage's printed Gross SP reward |
| Round 4 timeout | No Stage reward | Claims Stage record/trophy; gains the Stage's printed Gross SP reward |
| House-specific Automa/Personality SP | — | Resolve exactly as printed |

For House scoring:

- use only the Stage's printed **Gross SP** reward;
- ignore player-only draw, Tip, Shopping, Coordinate, Judge, or card-manipulation reward text unless a Solo rule specifically converts it;
- House does **not** earn Judge's Favor or Brand Ovation by default;
- the human player may still use the normal advanced Stage layer when Full Stage Rules are selected.

This keeps Solo scoring deterministic and prevents the House Queen from needing a simulated Coordinate.

## Solo Dragdagulan†

When the player challenges the House Queen:

1. Player draws **3 battle cards** from their personal Deck.
2. Reveal **3 Automa cards** for the House Queen.
3. Player Battle Score = normal printed LS + legal battle modifiers.
4. House Battle Score = printed LS on the three revealed Automa cards + explicit House battle effects + the difficulty LS modifier **once**.
5. Ignore the three battle Automa cards' Wardrobe and normal round effects.
6. Higher score wins.
7. Discard/archive battle cards normally; put the three battle Automa cards in the Automa discard pile.

### Player wins

Use the normal winner choice where possible:

- steal **1 Gross SP** from the House Queen; or
- give the House Queen a **Wardrobe Malfunction**.

For solo bookkeeping, a House Wardrobe Malfunction is worth **−1 House Final Score** unless a later card removes it.

### House wins

If the current House effect specifies a consequence, use it.

Otherwise:

- House steals **1 Gross SP** if the player has at least 1; otherwise
- player takes **Wardrobe Malfunction** if available.

### Tie

Use the normal tie consequence as closely as possible: both sides receive **The Chop** if available and neither gets a winner reward.

For House bookkeeping, The Chop is worth **−1 House Final Score**.

## Automa deck

The 18-card deck contains five behavior families:

- Fashion Hunter
- Spotlight Hog
- Tip Snatcher
- Lip Sync Assassin
- Drama Queen

When the Automa deck empties, shuffle the discard pile to make a new draw pile.

If fewer than three cards remain during Dragdagulan†, reveal the remaining cards, reshuffle, then reveal enough to reach three.

## House Queen Personalities

Use at most **one** Personality.

The Personality is a light identity rule layered over the generic Automa. It should make the House feel like a specific Queen without creating a second full tableau.

For baseline balance, test Personalities first on **Working Queen**.

## Final Judging

The human player scores normally.

House Final Score is:

> **House Gross SP + explicit House end-game bonuses − House Penalty values**

A Stage's printed Gross SP is scored when the House claims it and is **not scored again** just because the Stage is in the House trophy area.

Highest Final Score wins. Record any normal tiebreak that cannot be cleanly resolved for the House.

## What v0.2 is testing

Record:

- House Stage win rate;
- average rounds per Stage;
- how often Round 4 timeout decides a Stage;
- player and House Appeal when a Stage resolves;
- Market card removed each round;
- player purchase count;
- Dragdagulan† attempts and Battle Scores;
- whether the House Base Appeal formula scales across low/high Slay Targets;
- whether Personality effects add identity without bookkeeping overload;
- whether Working Queen feels like the correct baseline.

## Development gates

Do not call Solo Circuit a finished 1-player mode until:

1. the 18-card Automa distribution has been tested across all four difficulties;
2. all 12 Personalities have baseline Working Queen data;
3. the House Base Appeal formula has been tested across all 12 Stages;
4. the four-round timer has enough data to judge pacing;
5. Dragdagulan† results have been logged across multiple Queens;
6. physical and TTS versions have both been runtime-tested;
7. the rules can be taught without designer interpretation.

Until then, label all materials:

> **SOLO CIRCUIT v0.2 — EXPERIMENTAL PLAYTEST MODULE**
