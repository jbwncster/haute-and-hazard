# Haute & Hazard — Project Data Templates

The `/data` folder contains lightweight CSV templates that can be opened in Excel, Google Sheets, Numbers, or imported into a database.

## Templates and live sources

- [`playtest_sessions_template.csv`](../data/playtest_sessions_template.csv) — session-by-session playtest evidence, including v7.9 Tip timing and TTS runtime fields.
- [`card_database_template.csv`](../data/card_database_template.csv) — blank Poker-card/source-of-truth fields.
- [`v7_9_card_database.csv`](../data/v7_9_card_database.csv) — live 240-card Poker source.
- [`balance_tracker_template.csv`](../data/balance_tracker_template.csv) — balance watchlist and change history.
- [`ip_review_register_template.csv`](../data/ip_review_register_template.csv) — legal/IP review items.
- [`rules_clarifications_log_template.csv`](../data/rules_clarifications_log_template.csv) — FAQ/rules questions.
- [`v7_9_queen_database.csv`](../data/v7_9_queen_database.csv) — current machine-readable Queen source.
- [`v7_9_stage_database.csv`](../data/v7_9_stage_database.csv) — complete current Stage production source.
- [`v7_9_stage_registry.csv`](../data/v7_9_stage_registry.csv) — compact Stage roster/status registry.
- [`solo_circuit_playtest_log_template.csv`](../data/solo_circuit_playtest_log_template.csv) — Solo Circuit v0.2 evidence log.

## Recommended workflow

1. Record raw playtest data immediately after each game.
2. Record Tip-generation errors separately from old-Master errors, unplayed-card errors, Fashion-for-Tips confusion, Rack-refill timing, and hand-draw mistakes.
3. Transfer recurring balance concerns into the balance tracker.
4. Add repeated rules questions to the clarifications log.
5. Update canonical component databases only when a card/rule text change is intentional.
6. Add any term, art, name, or reference needing review to the IP register and mark it **†** in public-facing documents.
7. For TTS sessions, log runtime/load/image issues separately from gameplay balance issues.

## Version rule

Every row should include the tested or affected version.

For current testing:

- use **v7.9** for the 2–5 player base game;
- use **Solo Circuit v0.2** for one-player sessions;
- label v7.8 or earlier sessions as archived/legacy comparisons;
- label any mixed-version session explicitly.
