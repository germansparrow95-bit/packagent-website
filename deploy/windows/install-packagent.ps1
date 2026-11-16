[CmdletBinding()]
param(
  [string]$InstallDir = "C:\Services\PackAgentWebsite",
  [int]$Port = 80,
  [string]$NodeVersion = "24.19.0",
  [string]$RepoZipUrl = "https://github.com/germansparrow95-bit/packagent-website/archive/refs/heads/main.zip"
)

$ErrorActionPreference = "Stop"
$taskName = "PackAgentWebsite"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw "Run this script from an elevated PowerShell window."
}

$nodeExe = "C:\Program Files\nodejs\node.exe"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"

if (-not (Test-Path -LiteralPath $nodeExe)) {
  $nodeMsi = Join-Path $env:TEMP "node-v$NodeVersion-x64.msi"
  $nodeUrl = "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-x64.msi"
  Write-Host "Downloading Node.js $NodeVersion..."
  Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi -UseBasicParsing
  $install = Start-Process -FilePath "msiexec.exe" `
    -ArgumentList @("/i", $nodeMsi, "/qn", "/norestart") `
    -Wait -PassThru
  if ($install.ExitCode -notin @(0, 3010)) {
    throw "Node.js installation failed with exit code $($install.ExitCode)"
  }
  Remove-Item -LiteralPath $nodeMsi -Force
}

$env:Path = "C:\Program Files\nodejs;$env:Path"
if (-not (Test-Path -LiteralPath $npmCmd)) {
  throw "npm was not found after installing Node.js."
}

$tempRoot = Join-Path $env:TEMP ("packagent-deploy-" + [guid]::NewGuid().ToString("N"))
$download = Join-Path $tempRoot "source.zip"
$expanded = Join-Path $tempRoot "source"
New-Item -ItemType Directory -Path $expanded -Force | Out-Null

try {
  Write-Host "Downloading PackAgent source..."
  Invoke-WebRequest -Uri $RepoZipUrl -OutFile $download -UseBasicParsing
  Expand-Archive -LiteralPath $download -DestinationPath $expanded -Force
  $sourceRoot = Get-ChildItem -LiteralPath $expanded -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName "package.json") } |
    Select-Object -First 1
  if (-not $sourceRoot) {
    throw "The downloaded archive does not contain package.json."
  }

  New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
  Copy-Item -Path (Join-Path $sourceRoot.FullName "*") -Destination $InstallDir -Recurse -Force
} finally {
  if (Test-Path -LiteralPath $tempRoot) {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force
  }
}

$envFile = Join-Path $InstallDir ".env.production"
if (-not (Test-Path -LiteralPath $envFile)) {
  throw @"
Create $envFile before running the build.
Copy .env.example to .env.production and set:
DATABASE_URL, DATABASE_AUTH_TOKEN, ADMIN_TOKEN and NEXT_PUBLIC_SITE_URL.
"@
}

Push-Location $InstallDir
try {
  Write-Host "Installing dependencies..."
  & $npmCmd ci
  if ($LASTEXITCODE -ne 0) { throw "npm ci failed." }

  Write-Host "Building the website..."
  & $npmCmd run build
  if ($LASTEXITCODE -ne 0) { throw "npm run build failed." }
} finally {
  Pop-Location
}

$existingListener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
if ($existingListener) {
  $owners = $existingListener | Select-Object -ExpandProperty OwningProcess -Unique
  throw "Port $Port is already in use by process(es): $($owners -join ', ')"
}

$firewallRuleName = "PackAgent Website HTTP $Port"
if (-not (Get-NetFirewallRule -DisplayName $firewallRuleName -ErrorAction SilentlyContinue)) {
  New-NetFirewallRule `
    -DisplayName $firewallRuleName `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort $Port | Out-Null
}

$startScript = Join-Path $InstallDir "deploy\windows\start-packagent.ps1"
if (-not (Test-Path -LiteralPath $startScript)) {
  throw "Missing start script: $startScript"
}

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
  Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$startScript`" -Port $Port" `
  -WorkingDirectory $InstallDir
$trigger = New-ScheduledTaskTrigger -AtStartup
$runAs = New-ScheduledTaskPrincipal `
  -UserId "SYSTEM" `
  -LogonType ServiceAccount `
  -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -RestartCount 10 `
  -RestartInterval (New-TimeSpan -Minutes 1) `
  -ExecutionTimeLimit ([TimeSpan]::Zero)

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Principal $runAs `
  -Settings $settings | Out-Null
Start-ScheduledTask -TaskName $taskName

$healthy = $false
foreach ($attempt in 1..30) {
  Start-Sleep -Seconds 2
  try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 3
    if ($health.status -eq "ok") {
      $healthy = $true
      break
    }
  } catch {}
}

if (-not $healthy) {
  $log = Join-Path $InstallDir "logs\website.log"
  throw "The website did not become healthy. Check $log"
}

Write-Host ""
Write-Host "PackAgent is running on port $Port."
Write-Host "Local health check: http://127.0.0.1:$Port/api/health"
Write-Host "Scheduled task: $taskName"
