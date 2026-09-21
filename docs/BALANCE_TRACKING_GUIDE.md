# Haute & Hazard — Balance Tracking Guide

Use this guide with [`../data/balance_tracker_template.csv`](../data/balance_tracker_template.csv).

## Purpose

The balance tracker is not a place to redesign from theory. It records what happened in play, how often it happened, and why a change was or was not made.

## What to track

Track separate rows for:

- Queens
- Special Appeals
- Stages
- Brands
- Tenets
- key Wardrobe cards
- Penalty effects
- Dragdagulan† outcomes
- rules systems such as Shopping or Fusion

## Status labels

- `untested` — exists but has not appeared in enough games.
- `watching` — possible issue, needs more evidence.
- `stable` — no current concern.
- `revise` — change likely.
- `changed` — modified; needs retest.
- `retired` — removed from current build.

## How to log an issue

A useful balance note has four parts:

1. **Observed pattern:** what actually happened.
2. **Frequency:** how many games/sessions showed it.
3. **Impact:** how it affected fun, clarity, duration, score, or player choice.
4. **Decision:** keep, watch, revise, or retire.

Example:

> Opulencia gained 3+ extra Tips in each of three games and bought high-cost cards earlier than other Queens. Watching: may need trigger cap or cost comparison after 5+ plays.

## Change rule

Do not change a card or Queen after one dramatic game unless the issue is rules-breaking or clearly unreadable. Mark it `watching` first.

## Legal/IP marker

If an item includes terminology, image direction, or naming that is subject to legal/IP review, mark the row with **†** and add/update the item in [`IP_REVIEW_REGISTER.md`](IP_REVIEW_REGISTER.md).
