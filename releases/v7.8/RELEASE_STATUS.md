# v7.8 Release Status

**Status:** Current physical + Tabletop Simulator playtest target / unpublished prototype.

> **† Legal/IP review:** `Dragdagulan` is working prototype terminology credited to *Drag Den Philippines*. It is subject to legal/IP, trademark, and publisher review before commercial release and may be renamed. See [`../../docs/ATTRIBUTIONS.md`](../../docs/ATTRIBUTIONS.md). Any future element identified for legal/IP review should use the same † marker until cleared or replaced.

## Physical production QA

The generated v7.8 Game Crafter package passed the documented count and image-dimension checks for:

- 240 Poker card fronts
- 12 Stage fronts
- 12 Queen fronts
- 5 Player Aid fronts
- 5 Player Aid backs
- Poker, Stage, and Queen shared backs
- Medium Folio front and back
- Medium Prototype Box art

See `QA_REPORT.txt` for the exact checks.

## Current Game Crafter build

| Game Crafter component | Quantity | Upload size |
|---|---:|---:|
| Rules — Medium Folio Set | 1 | 4875 × 2475 px |
| Haute & Hazard — Poker Deck | 240 cards | 825 × 1125 px |
| Stages — Holographic Foil Euro Poker Deck | 12 cards | 825 × 1125 px |
| The Queens — Jumbo Deck | 12 cards | 1125 × 1725 px |
| Player Aid — Postcard Mat Set | 5 | 1875 × 1275 px |
| Box — Medium Prototype Box | 1 | 5850 × 5400 px |

The physical prototype is in Game Crafter production testing.

## Stage orientation

The Stage cards are **venue cards** and are designed to read as wide/landscape play pieces. The physical foil Euro card is uploaded using the required 825 × 1125 image file and is turned sideways at the table.

## Current Tabletop Simulator build

The current digital build is **v7.8**, aligned to the current physical prototype.

Validated TTS content target:

- 60 starter cards
- 144 Wardrobe cards
- 16 Thrift Store Throwbacks
- 20 Penalty cards
- 12 venue Stages
- 12 Queens with current Signature Abilities and Special Appeals
- current Player Aid front/back
- standard 2–5 player setup
- Siren Diesel vs. Opal Dynasty two-player teaching setup
- Neon Nightclub opening teaching Stage
- Beginner Mode guidance

The package is named:

`Haute_Hazard_v7.8_TTS_Playtest.zip`

The generated package includes local image assets, standard/teaching TTS save templates, Windows and Unix install scripts, an asset manifest, checksums, and TTS QA notes. The package's save templates use a local asset placeholder that the installer rewrites to the user's Tabletop Simulator `file://` path. Online hosts should upload the assets through TTS Cloud Manager and resave before inviting remote players.

TTS source/status files are kept in [`TTS/`](TTS/).

## Legal/IP status

Any current physical or digital asset containing **Dragdagulan†** is prototype-only terminology pending legal/IP and publisher review. Regenerated rulebooks, player aids, cards, TTS images, save files, and publisher materials must retain the **†** marker/status until the term is cleared or replaced.

## Binary package status

Two generated binary archives correspond to the v7.8 target:

- `Haute_Hazard_v7.8_Game_Crafter_Print_Edition.zip`
- `Haute_Hazard_v7.8_TTS_Playtest.zip`

Large binary ZIP/JPG packages may still require manual GitHub attachment because the connected repository tooling can update text/source files but may not transfer the complete generated binary archive. Do not claim a GitHub binary attachment exists until it is actually visible in the repository or a GitHub Release.

## Version status

- **v7.8** — current physical and TTS playtest target.
- **v7.7.1** — archived legacy Game Crafter prototype; reference only.
- **v7.7** — archived Core/TTS/Promotional packages retained for historical comparison.

Do not combine older Stage, Queen, Player Aid, or rule assets with current v7.8 testing unless deliberately comparing versions. Older archived binaries may predate the current † labeling convention and must not be interpreted as evidence that a marked term has been commercially cleared.
