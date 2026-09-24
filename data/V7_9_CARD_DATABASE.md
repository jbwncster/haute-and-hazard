# Haute & Hazard v7.9 — Canonical Card Database

The canonical Poker-card source for the current v7.9 target is:

- [`v7_9_card_database.csv`](v7_9_card_database.csv)

## Validated component counts

- **240 Poker cards total**
- **60 Starter cards**
- **144 Wardrobe cards**
  - **130 unique Fashion cards**
  - **14 unique Actions**
- **16 Thrift Store Throwbacks**
- **20 Penalty cards**

## v7.9 data guarantees

The current CSV was validated so that:

- every Poker card has an explicit printed `tips` value, including 0;
- all 130 Wardrobe Fashion names are unique;
- all 144 Wardrobe rules-text entries are unique;
- the Brand counts match the current v7.9 distribution;
- Cost and printed Tips remain separate fields;
- Basic Beat, Messy Lip Sync, and Chapstick use the current Tip Count model;
- the physical card IDs remain `HH-001` through `HH-240`.

## Production rule

**Update this CSV first.** Then regenerate Poker-card faces, Print & Play output, Game Crafter files, and TTS assets from the same revision.

Do not rebuild a v7.9 package from the archived v7.8 repeated-garment Poker fronts.

The current data remains playtest material. Balance changes should be logged and synchronized across every medium before a build is called release-ready.

> **† Legal/IP review:** Dragdagulan is working prototype terminology credited to *Drag Den Philippines* and remains subject to legal/IP, trademark, and publisher review.
