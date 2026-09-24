# Haute & Hazard — Current Gameplay Reference

This page summarizes the **current v7.9 base-game rules**. It is a quick repository reference, not a replacement for the printed rulebook or card text.

> **† Legal/IP review:** `Dragdagulan` is working prototype terminology credited to *Drag Den Philippines*. It is subject to legal/IP, trademark, and publisher review before commercial release and may be renamed. See [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

## Goal

Haute & Hazard is a competitive drag fashion deck-building game for **2–5 players**. Each player controls a Queen, builds a fashion Coordinate, generates Tips to Shop, builds Appeal to Slay venue Stages, and may challenge rivals to **Dragdagulan†**.

The standard end trigger is **30 Gross Style Points (SP)** at the end of Phase 4 / Curtain Call, or an empty Stage Deck after a Stage is Slayed. Final Score is Gross SP plus explicit end-game bonuses minus Penalty values.

## Coordinate

The four core Fashion slots are:

1. Face
2. Wig
3. Body
4. Shoes

A Coordinate is **Complete** when all four core slots have a Master. Accessory is optional unless a card says otherwise.

## Tenets and Brands

- **Pink** — Sugar Rush, Hyper-Glitch
- **Blue** — Necropolis, Slasher, Void
- **Purple** — Velvet Trap, Gilded Cage
- **Yellow** — Trash Can, Big Top, Swamp Witch
- **Neutral** — colorless; not a Tenet for Matching or Perfect Illusion

A **Tenet** is a gameplay color/faction. A **Brand** is a named fashion line within a Tenet.

## v7.9 turn order

Every turn begins with a resource step, followed by five phases:

0. **Tip Count** — add the printed Tip value of every card currently in your hand to your Tip pool. Count each card once. Do not discard it.
1. **Transformation** — equip Fashion, play Actions, and use eligible Queen abilities.
2. **The Reveal** — add printed Fashion resources, assign Wild Tenets, determine Look states, resolve relevant abilities, then apply the Appeal multiplier.
3. **Shopping** — spend Tips on the Wardrobe Rack and eligible Thrift Store cards.
4. **Slay / Dragdagulan† / Pass** — choose exactly one unless an effect says otherwise.
5. **Cleanup** — archive temporary cards/hand as required, draw a new hand, and reset Tips and Appeal.

A card counted during Tip Count can still be played or equipped later that turn. Its printed Tip value is **not counted a second time** when it leaves the hand.

## Look states

- **Matching Look** — Complete Coordinate; all four visible Masters share the same non-Neutral Tenet. Appeal ×2.
- **Perfect Illusion** — Matching Look whose Tenet matches the Queen's Signature Tenet. Appeal ×3 and gain Untouchable until Curtain Call unless removed.
- **Fusion Look** — Complete Coordinate whose Fusion color pool contains exactly two distinct non-Neutral Tenets. Eligible Deep Storage cards can contribute Tenets to the Fusion pool.

Matching and Fusion may coexist when Deep Storage introduces the second Tenet.

## Shopping

Tips are the Shopping currency. During Shopping, a player may buy any number of affordable cards from the five-card Wardrobe Rack and any eligible Thrift Store cards.

Purchased cards go to the player's **Backstage Archive / personal discard pile**. They do not enter the current hand and cannot be immediately played or equipped.

Unspent Tips remain available until Cleanup for effects that care about Tips, then reset to 0.

## v7.9 Wardrobe

The 144-card Wardrobe is now **fully unique**:

- 130 unique Fashion cards
- 14 unique Actions

Every Poker card has an explicit printed Tip value, including 0. See [V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md](V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md) for the detailed distribution and economy rules.

## Stages

The base Stage deck contains **12 venue-style Stages**, balanced at 3 Pink / 3 Blue / 3 Purple / 3 Yellow and covering every Base Game Brand.

Current Stage fields can include:

- Favored Tenet
- Featured Brand
- Slay Target
- Reward
- Venue Effect
- Judge
- Spotlight Requirement
- Judge's Favor
- Brand Ovation

### Beginner Mode

For a first game, use only:

- Favored Tenet
- Featured Brand
- Slay Target
- Reward
- Venue Effect

Ignore Judge, Spotlight Requirement, Judge's Favor, and Brand Ovation for the entire Beginner Mode game.

## Slay

A player may Slay the active Stage in Phase 4 if their current Appeal meets or exceeds the Stage's target and all prerequisites/costs are satisfied. A successful Slay claims the Stage trophy, grants its printed reward once, resolves Slay effects, and triggers Curtain Call.

## Dragdagulan†

1. Choose an opponent who is not Untouchable.
2. Challenger and defender each draw **3 battle cards** from their personal Deck.
3. Each Battle Score is the sum of printed **LS** on those battle-drawn cards plus explicit active battle modifiers.
4. Equipped Masters and Deep Storage do **not** automatically add their printed LS.
5. Higher Battle Score wins.

The loser receives **The Chop** if available. The winner normally chooses either to steal 1 Gross SP or give the loser a Wardrobe Malfunction. A tie gives both players The Chop and no winner reward.

## Queens

The base game contains **12 Queens**, each with:

- Signature Tenet
- Favorite Brand
- Signature Ability
- **Special Appeal — Once Per Game**

See [QUEEN_ROSTER.md](QUEEN_ROSTER.md).

## Starter deck

Each player starts with:

- 7 × Basic Beat — printed Tip 1
- 3 × Messy Lip Sync — printed Tip 0
- 2 × Chapstick — printed Tip 1

The printed Tip values are collected during **Tip Count**, not again when the card is played/equipped. See [STARTING_DECKS.md](STARTING_DECKS.md).

## Solo Circuit

**Solo Circuit v0.2** is a separate experimental one-player module. Its 30 solo cards are **not** part of the 240-card base-game Poker Deck.

Use [SOLO_CIRCUIT_AUTOMA_PLAYTEST.md](SOLO_CIRCUIT_AUTOMA_PLAYTEST.md) for solo rules.

## Version guidance

- **v7.9** — current base-game rules/card target.
- **Solo Circuit v0.2** — current experimental solo target.
- **v7.8** — archived synchronized comparison build.
- **v7.7/v7.7.1** — legacy/archive material.

Do not mix v7.8 starter text, Player Aids, or turn timing into a normal v7.9 test.
