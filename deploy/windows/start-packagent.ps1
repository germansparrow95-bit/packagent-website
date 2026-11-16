param(
  [int]$Port = 80
)

$ErrorActionPreference = "Stop"
$installDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$logDir = Join-Path $installDir "logs"
$logFile = Join-Path $logDir "website.log"
$nodeExe = "C:\Program Files\nodejs\node.exe"
$nextCli = Join-Path $installDir "node_modules\next\dist\bin\next"

New-Item -ItemType Directory -Path $logDir -Force | Out-Null
Set-Location $installDir

"[$(Get-Date -Format o)] Starting PackAgent on port $Port" | Out-File -FilePath $logFile -Append -Encoding utf8
& $nodeExe $nextCli start -H 0.0.0.0 -p $Port *>> $logFile
