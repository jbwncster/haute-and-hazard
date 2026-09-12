# Haute & Hazard v7.8 Tabletop Simulator installer
# Copies bundled assets and named Workshop JSONs into the current user's TTS folders
# and rewrites __HH_ASSET_DIR__ placeholders to absolute file:// URLs.
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$tts = Join-Path $env:USERPROFILE "Documents\My Games\Tabletop Simulator"
if (-not (Test-Path $tts)) {
    $tts = Join-Path $env:USERPROFILE "OneDrive\Documents\My Games\Tabletop Simulator"
}
if (-not (Test-Path $tts)) {
    throw "Tabletop Simulator user folder not found under Documents or OneDrive Documents. Start TTS once, then rerun this installer."
}
$assetDest = Join-Path $tts "Mods\Images\Haute_Hazard_v7.8"
$workshopDest = Join-Path $tts "Mods\Workshop"
New-Item -ItemType Directory -Force -Path $assetDest | Out-Null
New-Item -ItemType Directory -Force -Path $workshopDest | Out-Null
Copy-Item (Join-Path $here "Assets\*") $assetDest -Force
$uri = ([System.Uri]$assetDest).AbsoluteUri.TrimEnd('/')
Get-ChildItem (Join-Path $here "Saves\*.json") | ForEach-Object {
    $text = Get-Content $_.FullName -Raw
    $text = $text.Replace("__HH_ASSET_DIR__", $uri)
    $target = Join-Path $workshopDest $_.Name
    Set-Content -Path $target -Value $text -Encoding UTF8
    Write-Host "Installed Workshop JSON: $target"
}
Write-Host "Installed v7.8 assets to: $assetDest"
Write-Host "Done. Open Tabletop Simulator -> Games -> Workshop and load a Haute_Hazard_v7.8 setup."
Write-Host "For online multiplayer, use TTS Cloud Manager to upload local assets and resave before inviting remote players."
