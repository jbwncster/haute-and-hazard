# Haute & Hazard — v7.8 Playtest Kit

Use this kit for structured physical or Tabletop Simulator testing of the current v7.8 prototype.

## Fastest path for a new tester

Send new testers to [`PLAYTEST_START_HERE.md`](PLAYTEST_START_HERE.md), not the repository root.

They will choose:

- **Physical:** [`PRINT_AND_PLAY.md`](PRINT_AND_PLAY.md), using `Haute_Hazard_v7_8_Print_and_Play_Physical_Kit.zip`.
- **Digital multiplayer:** [`TABLETOP_SIMULATOR.md`](TABLETOP_SIMULATOR.md), using `Haute_Hazard_v7.8_TTS_Playtest.zip`.
- **Solo:** [`SOLO_CIRCUIT_AUTOMA_PLAYTEST.md`](SOLO_CIRCUIT_AUTOMA_PLAYTEST.md), with either the physical `Haute_Hazard_Solo_Circuit_v0_1_Print_and_Play.zip` or the committed TTS add-on [`Haute_Hazard_Solo_Circuit_v0_1_TTS.zip`](../releases/solo-circuit-v0.1/Haute_Hazard_Solo_Circuit_v0_1_TTS.zip).

For either route, first-time players should read [`LEARN_TO_PLAY_5_MIN.md`](LEARN_TO_PLAY_5_MIN.md) and use Beginner Mode.

## Recommended folder contents

For a tester-facing ZIP or folder, include:

1. `README_START_HERE.md` or this file.
2. [`DESIGN_ORIGIN_AND_INSPIRATION.md`](DESIGN_ORIGIN_AND_INSPIRATION.md) — why the game exists and what inspired its major systems.
3. [`LEARN_TO_PLAY_5_MIN.md`](LEARN_TO_PLAY_5_MIN.md).
4. [`BEGINNER_MODE.md`](BEGINNER_MODE.md).
5. [`ALTERNATE_TWO_PLACEMENT_STAGE_RULES.md`](ALTERNATE_TWO_PLACEMENT_STAGE_RULES.md) when deliberately testing the experimental two-placement Stage module.
6. [`SOLO_CIRCUIT_AUTOMA_PLAYTEST.md`](SOLO_CIRCUIT_AUTOMA_PLAYTEST.md) when testing the experimental one-player House Queen automa.
7. [`CURRENT_GAMEPLAY.md`](CURRENT_GAMEPLAY.md).
8. [`STARTING_DECKS.md`](STARTING_DECKS.md).
9. [`QUEEN_ROSTER.md`](QUEEN_ROSTER.md).
10. [`FEEDBACK.md`](FEEDBACK.md).
11. [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md) and [`IP_REVIEW_REGISTER.md`](IP_REVIEW_REGISTER.md).
12. The current player aid files/images.
13. A direct feedback link: `https://github.com/jbwncster/haute-and-hazard/issues/new?template=playtest-report.yml`.

## Which build to use

- **Physical:** v7.8 Game Crafter prototype.
- **Digital:** v7.8 Tabletop Simulator build.
- **Do not use:** v7.7/v7.7.1 for current balance testing unless intentionally comparing legacy versions.

## First-session mode

Use **Beginner Mode** unless the group specifically wants to test the full Stage layer.

Beginner Mode uses:

- Favored Tenet
- Featured Brand
- Slay Target
- Reward
- Venue Effect

Ignore:

- Judge
- Spotlight Requirement
- Judge's Favor
- Brand Ovation

Everything else remains active, including Queen abilities, Special Appeals, Shopping, Matching, Perfect Illusion, Fusion, Slay, and **Dragdagulan†**.

## What to record every session

Minimum data:

- date;
- build/version;
- medium: physical or TTS;
- player count;
- mode: Beginner or Full Stage;
- game duration;
- Queens used;
- winner and final score;
- Stages Slayed;
- number of Dragdagulan† attempts;
- most confusing moment;
- most fun moment;
- whether the group would play again.

Use [`../data/playtest_sessions_template.csv`](../data/playtest_sessions_template.csv) or the GitHub issue form.

## Observer instructions

Do not over-teach. Let players reveal where the game is unclear.

Watch for:

- setup hesitation;
- questions about Tenet vs. Brand;
- whether players understand Tips vs. Appeal vs. Gross SP vs. LS;
- whether Shopping feels useful;
- whether a Coordinate feels satisfying to build;
- whether the Stage changes decisions;
- whether Dragdagulan† feels exciting or disruptive;
- whether Special Appeals are remembered and used.

## Streamer/playtester language

Suggested title:

> Haute & Hazard v7.8 — Prototype Playtest

Suggested disclaimer:

> This is an unpublished prototype. Components, wording, art, balance, terminology, and legal/IP-reviewed terms may change before commercial release.

Short † note:

> † Working prototype term; subject to legal/IP and publisher review.


## Experimental Stage module

For a deliberate A/B test, use [`ALTERNATE_TWO_PLACEMENT_STAGE_RULES.md`](ALTERNATE_TWO_PLACEMENT_STAGE_RULES.md).

This module changes only the Stage-closing structure:

**Stage Winner → finish current round → Runner-Up → optional Runner-Up Dragdagulan† → Curtain Call**

It does **not** replace the canonical v7.8 rules. Clearly mark any session using it as **Alternate Two-Placement Stage Test**.


## v7.9 development candidate

A new Wardrobe/Tip economy candidate is under active development. It is **not yet the default physical or TTS kit**.

The candidate uses 144 unique Wardrobe cards and a pre-Transformation **Tip Count** from the printed Tip values in hand. See [`V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md`](V7_9_WARDROBE_TIP_ECONOMY_CANDIDATE.md).

Only use it when the playtest organizer specifically asks for a v7.9 card-economy test. Otherwise use the synchronized v7.8 physical/TTS materials.


## Experimental Solo Circuit automa

For one-player development testing, use [`SOLO_CIRCUIT_AUTOMA_PLAYTEST.md`](SOLO_CIRCUIT_AUTOMA_PLAYTEST.md). For physical cards, see [`SOLO_CIRCUIT_PRINT_AND_PLAY.md`](SOLO_CIRCUIT_PRINT_AND_PLAY.md). For digital testing, use the [Solo Circuit TTS add-on](../releases/solo-circuit-v0.1/TTS/README.md), which is designed to be **Additive Loaded** over the normal v7.8 Standard Setup.

The human player uses normal Haute & Hazard rules while a streamlined **House Queen** is driven by an 18-card Automa deck. The module tests Market pressure, Stage pacing, solo Dragdagulan†, difficulty modifiers, and optional Queen Personality behaviors without requiring the tester to run a second full deck/tableau.

Record these sessions as **Solo Circuit — Experimental Playtest Module** and specify **Physical** or **TTS**. The Automa cards, House Base Appeal values, and Personality rules are development material and are not part of the synchronized v7.8 multiplayer Game Crafter/TTS component set. The Solo TTS save is generated/schema-checked but still needs an in-app runtime verification.
