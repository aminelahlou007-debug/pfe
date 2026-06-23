param(
  [string]$OutputDir = "portable-demo"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$buildDir = Join-Path $repoRoot ".next\standalone"
$staticDir = Join-Path $repoRoot ".next\static"
$publicDir = Join-Path $repoRoot "public"
$outputPath = Join-Path $repoRoot $OutputDir

if (-not (Test-Path $buildDir)) {
  throw "Standalone build not found. Run pnpm build first."
}

if (Test-Path $outputPath) {
  Remove-Item $outputPath -Recurse -Force
}

New-Item -ItemType Directory -Path $outputPath | Out-Null

Get-ChildItem -Path $buildDir -Force | Where-Object { $_.Name -ne "node_modules" } | ForEach-Object {
  Copy-Item -Path $_.FullName -Destination $outputPath -Recurse -Force
}

$portableStatic = Join-Path $outputPath ".next\static"
New-Item -ItemType Directory -Path $portableStatic -Force | Out-Null
Copy-Item -Path (Join-Path $staticDir "*") -Destination $portableStatic -Recurse -Force

if (Test-Path $publicDir) {
  Copy-Item -Path (Join-Path $publicDir "*") -Destination (Join-Path $outputPath "public") -Recurse -Force
}

Copy-Item -Path (Join-Path $repoRoot "package.json") -Destination (Join-Path $outputPath "package.json") -Force
Copy-Item -Path (Join-Path $repoRoot "pnpm-lock.yaml") -Destination (Join-Path $outputPath "pnpm-lock.yaml") -Force

Push-Location $outputPath
try {
  pnpm install --prod --frozen-lockfile --ignore-scripts
} finally {
  Pop-Location
}

$launcher = @'
@echo off
setlocal
set PORT=3000
set HOSTNAME=127.0.0.1
start "Wildflower Demo" http://127.0.0.1:3000
node server.js
'@

Set-Content -Path (Join-Path $outputPath "Start Wildflower Demo.bat") -Value $launcher -Encoding ASCII

$notes = @'
Wildflower Portable Demo

1. Double-click "Start Wildflower Demo.bat".
2. Your browser opens to http://127.0.0.1:3000.
3. Keep this folder on the USB drive.

Requirements:
- Windows
- Node.js installed on the target PC

This demo uses the built-in fallback data if MongoDB or OpenAI are not available.
'@

Set-Content -Path (Join-Path $outputPath "README.txt") -Value $notes -Encoding ASCII

Write-Host "Portable demo created at $outputPath"