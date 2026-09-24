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

## DC-style deck-building engine map

For v7.9, the core deck-building cadence intentionally follows the familiar DC Deck-Building Game / Cerberus-style structure:

| Haute & Hazard | Deck-building role |
|---|---|
| **Tips** | Power / buying power |
| **Wardrobe Rack** | five-card shared Line-Up |
| **Wardrobe deck** | shared Main Deck |
| **Personal Deck** | player draw pile |
| **Backstage Archive** | player discard pile |
| **5-card hand** | normal turn hand |
| **Penalty cards** | deck-clogging negative cards / Weakness-like role |
| **Queen** | asymmetric player power / Character role |

The systems that remain distinctly Haute & Hazard are the persistent **Coordinate**, **Appeal**, **Looks**, venue **Stages**, and **Dragdagulan†**.

This means the deck-building engine should not invent separate hand-counting, market-refill, or acquisition rules when the DC-style cadence already provides a clear default.

## Tips — the deck-building resource

**Tips are Haute & Hazard's equivalent of the Power resource in a traditional shared-market deck-builder.**

You do **not** gain a card's printed Tips simply because it is in your hand.

During **Transformation**, whenever you play a card from your hand:

1. add that card's printed Tip value to your Tip pool;
2. then resolve its legal play/equip instructions.

A printed **0** generates no Tips but is still a meaningful printed value for effects that check it.

Each physical card can generate its printed Tips **once when played that turn**.

- A card left unplayed in your hand generates **0 Tips**.
- A Master already equipped from an earlier turn does **not** generate its printed Tips again.
- A card drawn during Transformation may be played later in the same Transformation and then generates its printed Tips normally.
- A card drawn after Transformation normally cannot be played for Tips that turn unless an effect explicitly lets you play it.
- Explicit effects that say “gain Tips” add to the same Tip pool.

### Playing Actions

Play an Action from your hand, gain its printed Tips, resolve its Play/Vogue/other legal effect completely, then leave it face-up in your played area until Cleanup. Unless an effect moves it elsewhere, put it into your Backstage Archive during Cleanup.

### Playing Fashion

When you play Fashion from your hand, gain its printed Tips, then choose one legal option:

- **Equip it** as a Master in its slot and resolve its Equip effect, if any; or
- **Play it for Tips only** without equipping it. It contributes no Master Appeal, LS, Tenet, Brand, or Look status and is archived during Cleanup.

This keeps Fashion useful as deck-building currency even when its slot is already occupied.

If you equip a new Master into an occupied slot, archive the old Master unless a card effect says otherwise.

## v7.9 turn order

Haute & Hazard uses a DC-style shared-market deck-building cadence with its fashion/performance systems layered on top.

Every turn follows five phases:

1. **Transformation** — play cards from your hand **one at a time, in any order**. When a card is played, generate its printed Tips, then resolve its text. Equip Fashion, resolve Actions, and use eligible Queen abilities.
2. **The Reveal** — total printed Appeal and other Reveal-specific values, assign Wild Tenets, determine Look states, resolve relevant abilities, then apply the Appeal multiplier.
3. **Shopping** — spend the Tips generated this turn. You may buy multiple legal cards as long as you can pay their total costs.
4. **Slay / Dragdagulan† / Pass** — choose exactly one unless an effect says otherwise.
5. **Cleanup** — archive/discard every played non-Master card and every card still in hand, refill empty Wardrobe Rack spaces, draw a fresh hand of **5 cards**, then reset Tips and Appeal.

If you need to draw and your personal Deck does not contain enough cards, shuffle your Backstage Archive to make a new Deck, then continue drawing.

## Look states

- **Matching Look** — Complete Coordinate; all four visible Masters share the same non-Neutral Tenet. Appeal ×2.
- **Perfect Illusion** — Matching Look whose Tenet matches the Queen's Signature Tenet. Appeal ×3 and gain Untouchable until Curtain Call unless removed.
- **Fusion Look** — Complete Coordinate whose Fusion color pool contains exactly two distinct non-Neutral Tenets. Eligible Deep Storage cards can contribute Tenets to the Fusion pool.

Matching and Fusion may coexist when Deep Storage introduces the second Tenet.

## Shopping

Tips are the Shopping currency, functioning like Power in a shared-market deck-builder.

- The **Wardrobe Rack contains five face-up cards**.
- During Shopping, you may buy **any number** of legal cards you can afford.
- Put each purchased card into your **Backstage Archive / personal discard pile**.
- A purchased card does not enter your hand and cannot be played that turn unless an explicit effect says otherwise.
- **Do not refill an emptied Wardrobe Rack space immediately.** Refill empty spaces from the Wardrobe deck during Cleanup, after the active player has finished buying.
- Eligible Thrift Store cards remain available according to their own printed rules.

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

**Opulencia — More Is More** keys off the Power-like economy: whenever a card she plays generates one or more printed Tips, she gains 1 additional Tip; a separate effect-based Tip gain can also trigger her ability.

## Starter deck

Each player starts with:

- 7 × Basic Beat — printed Tip 1
- 3 × Messy Lip Sync — printed Tip 0
- 2 × Chapstick — printed Tip 1

Basic Beat and Chapstick generate their printed Tips only when they are actually played from hand. See [STARTING_DECKS.md](STARTING_DECKS.md).

## Solo Circuit

**Solo Circuit v0.2** is a separate experimental one-player module. Its 30 solo cards are **not** part of the 240-card base-game Poker Deck.

Use [SOLO_CIRCUIT_AUTOMA_PLAYTEST.md](SOLO_CIRCUIT_AUTOMA_PLAYTEST.md) for solo rules.

## Version guidance

- **v7.9** — current base-game rules/card target.
- **Solo Circuit v0.2** — current experimental solo target.
- **v7.8** — archived synchronized comparison build.
- **v7.7/v7.7.1** — legacy/archive material.

Do not mix old Tip-timing text, Player Aids, or starter wording into a normal v7.9 test.
