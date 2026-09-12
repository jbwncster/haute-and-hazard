# Haute & Hazard — Current Gameplay Reference

This page summarizes the current Base Game systems used by the **v7.8 physical and Tabletop Simulator playtest editions**. It is a quick repository reference, not a replacement for the printed rulebook or card text.

> **† Legal/IP review:** `Dragdagulan` is working prototype terminology credited to *Drag Den Philippines*. It is subject to legal/IP, trademark, and publisher review before commercial release and may be renamed. See [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md).

## Game goal

Haute & Hazard is a competitive drag deck-building game for **2–5 players**. Each player controls a Queen, builds a four-piece fashion Coordinate, generates Tips for Shopping, builds Appeal to Slay the active Stage, and may challenge rivals to **Dragdagulan†**.

The standard end trigger is **30 Gross Style Points (SP)** at the end of Phase 4 or Curtain Call, or an empty Stage Deck after a Stage is Slayed. Final Score is Gross SP plus explicit end-game bonuses minus Penalty values.

## Coordinate

The four core Fashion slots are:

1. Face
2. Wig
3. Body
4. Shoes

A Coordinate is **Complete** when all four core slots have a Master. Accessory is optional and is not a core slot unless a card explicitly says otherwise.

## Tenets and Brands

A **Tenet** is the gameplay color/faction. A **Brand** is a named fashion line within a Tenet.

- **Pink** — Sugar Rush, Hyper-Glitch
- **Blue** — Necropolis, Slasher, Void
- **Purple** — Velvet Trap, Gilded Cage
- **Yellow** — Trash Can, Big Top, Swamp Witch
- **Neutral** — colorless; not a Tenet for Matching or Perfect Illusion

If a rule says **Tenet**, compare colors. If a rule or Stage names a **Brand**, the card must actually belong to that named Brand.

## Turn order

Every turn uses five phases:

1. **Transformation** — equip Fashion, play Actions, use eligible Queen abilities.
2. **The Reveal** — add printed Fashion resources, assign Wild Tenets, determine Look states, resolve Fusion/Matching abilities, then apply the Appeal multiplier.
3. **Shopping** — spend Tips on the Wardrobe Rack and eligible Thrift Store cards.
4. **Slay / Dragdagulan† / Pass** — choose exactly one unless an effect says otherwise.
5. **Cleanup** — archive temporary cards/hand as required, draw a new hand, reset Tips and Appeal.

## Look states

- **Matching Look** — Complete Coordinate; all four visible Masters share the same non-Neutral Tenet. Appeal ×2.
- **Perfect Illusion** — Matching Look whose Tenet matches the Queen's Signature Tenet. Appeal ×3 and gain Untouchable until Curtain Call unless removed.
- **Fusion Look** — Complete Coordinate whose Fusion color pool contains exactly two distinct non-Neutral Tenets. Eligible Deep Storage cards can contribute Tenets to the Fusion pool.

Matching and Fusion may coexist when Deep Storage introduces the second Tenet.

## Shopping economy

Tips are the game's Shopping currency. During Shopping, a player may buy any number of affordable cards from the five-card Wardrobe Rack Market Row and any affordable available Thrift Store Throwbacks. Purchases go to the player's Backstage Archive.

Unspent Tips remain available until Cleanup for effects that care about Tips, then reset to 0.

## Stages in v7.8

The v7.8 Stage deck contains **12 venue-style Stages**. Stages are places where the performance happens rather than challenge-name cards.

Each current Stage can use:

- Favored Tenet
- Featured Brand
- Slay Target
- Reward
- Venue Effect
- Judge
- Spotlight Requirement
- Judge's Favor
- Brand Ovation

The 12-card deck is balanced at 3 Pink / 3 Blue / 3 Purple / 3 Yellow and includes every Base Game Brand at least once.

### Beginner Mode

For a first game, use **Beginner Mode**. The Stage cards do not change; players simply use only:

- Favored Tenet
- Featured Brand
- Slay Target
- Reward
- Venue Effect

Ignore **Judge, Spotlight Requirement, Judge's Favor, and Brand Ovation** for the entire Beginner Mode game. All other game systems remain active, including Tenets/Brands, Shopping, Look states, Queen abilities, Special Appeals, Slay, and **Dragdagulan†**.

See [`BEGINNER_MODE.md`](BEGINNER_MODE.md) for the complete teaching rules.

## Slay

A player may Slay the active Stage in Phase 4 if their current Appeal meets or exceeds the Stage's target and all prerequisites/costs are satisfied. A successful Slay claims the Stage trophy, grants its printed SP once, resolves Slay effects, and triggers Curtain Call.

In Beginner Mode, do not check Spotlight Requirement and do not award Judge's Favor or Brand Ovation.

## Dragdagulan†

**Dragdagulan†** is the head-to-head Lip Sync battle system.

1. Choose an opponent who is not Untouchable.
2. Challenger and defender each draw **3 battle cards** from their personal Deck.
3. Each player's Battle Score is the sum of printed **LS** on those battle-drawn cards plus explicit active `+LS in battle` modifiers.
4. Equipped Masters and Deep Storage do **not** automatically add their printed LS.
5. Higher Battle Score wins.

The loser receives **The Chop** if available. The winner normally chooses either to steal 1 Gross SP or give the loser a Wardrobe Malfunction. A tie gives both players The Chop and no winner reward.

## Queens

The v7.8 Jumbo Queen set contains **12 Queens**. Each Queen has:

- Signature Tenet
- Favorite Brand
- Signature Ability
- **Special Appeal — Once Per Game**

See [QUEEN_ROSTER.md](QUEEN_ROSTER.md) for the current roster and playtest wording.

## Version guidance

- **v7.8** is the current physical Game Crafter and Tabletop Simulator playtest target.
- **v7.7.1** is archived as a legacy Game Crafter reference.
- **v7.7** Core/TTS/Promotional packages are retained for historical comparison only.

Current v7.8 TTS setup/status information is in [`TABLETOP_SIMULATOR.md`](TABLETOP_SIMULATOR.md). Do not mix older Stage, Queen, Player Aid, or rulebook files into current v7.8 testing unless deliberately comparing builds.
