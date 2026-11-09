# Haute & Hazard — Complete Digital Rules Compatibility Notes

The Complete Rules app is grounded first in the current v7.9 sources:

- `docs/CURRENT_GAMEPLAY.md`
- `docs/QUEEN_ROSTER.md`
- `docs/BEGINNER_MODE.md`
- `docs/STARTING_DECKS.md`
- `docs/V7_9_WARDROBE_TIP_ECONOMY.md`
- `data/v7_9_card_database.csv`
- `data/v7_9_stage_database.csv`
- `docs/SOLO_CIRCUIT_AUTOMA_PLAYTEST.md`
- `docs/SOLO_CIRCUIT_AUTOMA_DECK.md`
- `docs/SOLO_CIRCUIT_PERSONALITIES.md`

## Explicit compatibility assumptions

The current v7.9 quick-reference set mentions the systems below but does not fully restate every procedural detail. The digital implementation therefore exposes these assumptions instead of silently presenting them as newly verified v7.9 text.

### Curtain Call cleanup

Current v7.9 says a successful Slay triggers Curtain Call, but the current quick reference does not spell out what happens to all equipped Coordinates at that moment.

The Complete Rules app defaults to the most recent explicit supporting rule found in the v7.7 playtest rulebook:

> A successful Stage Slay ends the Round with a Curtain Call, clearing every player's equipped Coordinate before the next Stage begins.

The app labels this behavior **carry-forward Curtain Call cleanup**.

### Thrift Store availability

Current v7.9 says to set out the Thrift Store and that eligible Throwbacks remain available according to their own rules, but it does not fully restate the marketplace procedure.

The Complete Rules app uses the supporting v7.7/v6.7 procedure:

- Throwbacks are a separate, finite permanent marketplace option;
- during Shopping, a player may buy any available Throwback they can afford;
- purchased Throwbacks go to the player's Backstage Archive.

The v7.9 card database remains authoritative for each Throwback's current Cost, Tips, Appeal, LS, slot, and Reveal text.

### Advanced Stage rewards

The v7.9 Stage database provides Spotlight Requirement, Judge's Favor, and Brand Ovation as separate fields. The app resolves Judge's Favor and Brand Ovation when the player successfully Slays the Stage and satisfies their printed condition. This is the direct mechanical reading of those production fields, but the timing is labeled in the rules inspector so it is easy to revise if the printed rulebook later gives a more specific sequence.

## Digital rule

When a source-supported card instruction requires a physical choice that cannot be inferred, the app asks the player. It does not silently choose a target, Tenet, card order, archive target, or optional cost on the player's behalf.

Where an interaction is recognized but not safely automatable from the current source text, the app opens a **Guided Manual Resolution** prompt containing the exact card text and then allows the player to continue after making the physical-equivalent choice.
