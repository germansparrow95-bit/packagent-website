# Deploy PackAgent on Windows Server

These scripts target the Alibaba Cloud ECS Windows Server instance and run the
Next.js frontend, API routes and Turso-backed database through a Scheduled Task.

## 1. Open the network ports

In the Alibaba Cloud console:

1. Open the ECS instance.
2. Open the security group.
3. Add an inbound rule for TCP `80` with source `0.0.0.0/0`.
4. Keep RDP `3389` restricted to your own public IP where possible.

## 2. Connect through Remote Desktop

Use the console's `远程连接` or an RDP client with the server's public IP.
Run PowerShell as Administrator.

## 3. Download the source

```powershell
$root = "C:\Services"
New-Item -ItemType Directory -Path $root -Force | Out-Null

Invoke-WebRequest `
  -Uri "https://github.com/germansparrow95-bit/packagent-website/archive/refs/heads/main.zip" `
  -OutFile "$root\source.zip" `
  -UseBasicParsing

Expand-Archive "$root\source.zip" -DestinationPath "$root\source" -Force
Copy-Item "$root\source\packagent-website-main\*" `
  "C:\Services\PackAgentWebsite" `
  -Recurse -Force
```

## 4. Create production environment variables

Create `C:\Services\PackAgentWebsite\.env.production` with:

```dotenv
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
ADMIN_TOKEN=...
NEXT_PUBLIC_SITE_URL=http://47.99.126.157
```

Do not commit this file.

## 5. Install and start

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force

& "C:\Services\PackAgentWebsite\deploy\windows\install-packagent.ps1" `
  -InstallDir "C:\Services\PackAgentWebsite" `
  -Port 80
```

The script installs Node.js 24 if needed, runs `npm ci`, builds the site,
creates a Windows Firewall rule and registers a scheduled task named
`PackAgentWebsite`.

## 6. Verify

On the server:

```powershell
Invoke-RestMethod "http://127.0.0.1/api/health"
Get-ScheduledTask -TaskName "PackAgentWebsite"
Get-Content "C:\Services\PackAgentWebsite\logs\website.log" -Tail 50
```

From another computer:

```text
http://47.99.126.157/api/health
http://47.99.126.157/
```

The site is accessible only after the Alibaba Cloud security group allows TCP 80.

## Updating

Download the latest GitHub archive, copy it over `C:\Services\PackAgentWebsite`
without deleting `.env.production`, then repeat `npm ci`, `npm run build` and
restart the `PackAgentWebsite` scheduled task.
