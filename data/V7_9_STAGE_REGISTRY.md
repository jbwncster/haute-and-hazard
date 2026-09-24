# Haute & Hazard v7.9 — Stage Registry

The verified machine-readable Stage **roster** is:

- [`v7_9_stage_registry.csv`](v7_9_stage_registry.csv)

## What is verified

For all 12 Stages, the repository currently verifies:

- Stage name
- Favored Tenet
- Featured Brand
- 3 Pink / 3 Blue / 3 Purple / 3 Yellow distribution
- coverage of every Base Game Brand at least once

## What is not yet migrated

This registry intentionally does **not** invent or guess:

- Slay Target
- Reward
- Venue Effect
- Judge
- Spotlight Requirement
- Judge's Favor
- Brand Ovation

Every row is marked `needs_verified_full_text_migration`.

## Production blocker

Do not regenerate a supposedly canonical v7.9 Stage face from this registry alone.

Before deterministic Stage regeneration, migrate the exact full Stage text from a verified current source into a complete Stage database. Until then, the Stage roster is validated but the full Stage-card text remains a production-data gap.
