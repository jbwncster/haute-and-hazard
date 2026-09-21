# Haute & Hazard — Project Data Templates

The `/data` folder contains lightweight CSV templates that can be opened in Excel, Google Sheets, Numbers, or imported into a database.

## Templates

- [`playtest_sessions_template.csv`](../data/playtest_sessions_template.csv) — session-by-session playtest evidence.
- [`card_database_template.csv`](../data/card_database_template.csv) — canonical card/source-of-truth fields.
- [`balance_tracker_template.csv`](../data/balance_tracker_template.csv) — balance watchlist and change history.
- [`ip_review_register_template.csv`](../data/ip_review_register_template.csv) — legal/IP review items.
- [`rules_clarifications_log_template.csv`](../data/rules_clarifications_log_template.csv) — FAQ/rules questions.

## Recommended workflow

1. Record raw playtest data immediately after each game.
2. Transfer recurring balance concerns into the balance tracker.
3. Add repeated rules questions to the clarifications log.
4. Update the card database only when a card/rule text change is intentional.
5. Add any term, art, name, or reference needing review to the IP register and mark it **†** in public-facing documents.

## Version rule

Every row should include the tested or affected version. For current testing, use **v7.8** unless deliberately testing a legacy build.
