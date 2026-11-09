# Haute & Hazard Android v0.1

Android shell for the canonical **Haute & Hazard v7.9** digital playtest and **Solo Circuit v0.2**.

## What it does

- Packages the existing `digital-playtest/` vertical slice as an offline Android game.
- Keeps the canonical v7.9 cards, Queens, Stages, Solo Automa, Tips, persistent Coordinate, Shopping, and local save/resume behavior.
- Uses no account, analytics, ads, network permission, or cloud dependency in v0.1.
- Targets Android 16 / API 36 for current Google Play submission requirements.
- Minimum Android version: Android 8.0 / API 26.

## Package ID

`com.jbwncster.hauteandhazard`

Google Play package IDs are permanent once used. Change this before the first Play Console app is created if a different ID is desired.

## Build

With JDK 17 and Gradle 8.13 installed:

```bash
gradle -p android-app :app:assembleDebug :app:bundleDebug
```

Outputs:

- APK: `android-app/app/build/outputs/apk/debug/app-debug.apk`
- AAB: `android-app/app/build/outputs/bundle/debug/app-debug.aab`

The repository GitHub Action builds and uploads both on pull requests and manual runs.

## Production signing

The CI artifacts are debug-signed for testing. Before a production Google Play release, create an upload key and build a signed release AAB. Keep the upload key private and out of this public repository.

## Canonical data

The Android app reuses `../digital-playtest/` as its packaged assets so it stays synchronized with the existing v7.9 digital prototype.
