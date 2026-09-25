# Haute & Hazard v7.9 — Stage Data

The v7.9 Stage system now has two machine-readable files:

- [`v7_9_stage_database.csv`](v7_9_stage_database.csv) — complete 12-Stage production data.
- [`v7_9_stage_registry.csv`](v7_9_stage_registry.csv) — compact roster/status registry.

## Verified for all 12 Stages

The committed full Stage database includes:

- Stage name and subtitle
- Favored Tenet
- Featured Brand
- Slay Target
- Gross SP Reward
- Judge
- Venue Effect
- Spotlight Requirement
- Judge's Favor
- Brand Ovation
- source/version provenance

The roster remains balanced at:

- 3 Pink
- 3 Blue
- 3 Purple
- 3 Yellow

Every Base Game Brand is featured at least once.

## Provenance

The complete Stage text was migrated from the synchronized v7.8 production assets recovered during the v7.9 preflight pass. The registry rows are marked as verified from those print assets.

## Production rule

Use **`v7_9_stage_database.csv`** when regenerating Stage faces.

Use **`v7_9_stage_registry.csv`** when you only need the Stage identity, Favored Tenet, Featured Brand, and verification status.

Do not manually edit generated Stage faces without making the same change in the canonical Stage database.
