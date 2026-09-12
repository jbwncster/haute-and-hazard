#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
TTS_DIR="${TTS_DIR:-$HOME/.local/share/Tabletop Simulator}"
if [ ! -d "$TTS_DIR" ]; then
  echo "Tabletop Simulator folder not found: $TTS_DIR"
  echo "Set TTS_DIR to your Tabletop Simulator user-data folder and rerun."
  exit 1
fi
ASSET_DEST="$TTS_DIR/Mods/Images/Haute_Hazard_v7.8"
WORKSHOP_DEST="$TTS_DIR/Mods/Workshop"
mkdir -p "$ASSET_DEST" "$WORKSHOP_DEST"
cp "$HERE"/Assets/* "$ASSET_DEST"/
ASSET_URI="file://$ASSET_DEST"
for f in "$HERE"/Saves/*.json; do
  out="$WORKSHOP_DEST/$(basename "$f")"
  sed "s|__HH_ASSET_DIR__|$ASSET_URI|g" "$f" > "$out"
  echo "Installed Workshop JSON: $out"
done
echo "Installed v7.8 assets to: $ASSET_DEST"
echo "Open Tabletop Simulator -> Games -> Workshop and load a Haute_Hazard_v7.8 setup."
echo "For online multiplayer, use TTS Cloud Manager to upload local assets and resave before inviting remote players."
