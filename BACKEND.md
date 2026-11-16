# PackAgent Website Backend

官网后端使用 Next.js Route Handlers、Drizzle ORM 和 libSQL。开发环境默认使用
`data/packagent.db`，无需安装数据库服务；生产环境建议连接 Turso 或其他兼容
libSQL 的托管数据库。

## 初始化

```powershell
Copy-Item .env.example .env.local
npm run db:init
npm run dev
```

修改 `.env.local`：

```dotenv
DATABASE_URL=file:data/packagent.db
DATABASE_AUTH_TOKEN=
ADMIN_TOKEN=至少16位的随机管理密钥
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`ADMIN_TOKEN` 只能存在于服务端环境，不要添加 `NEXT_PUBLIC_` 前缀。

## 数据表

| 表 | 用途 |
|---|---|
| `releases` | 安装包版本、平台、文件名、存储地址、校验值和发布状态 |
| `download_events` | 每次受控下载的来源与时间 |
| `feedback` | 用户反馈、处理状态和可选联系方式 |

初始化脚本会创建版本 `0.1.4` 的未发布草稿，但不会生成虚构安装包。管理员补全
真实文件地址后，官网下载区才会显示下载按钮。

## 公共接口

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/health` | 服务与数据库健康检查 |
| GET | `/api/releases/latest?platform=win-x64&channel=stable` | 获取最新已发布版本 |
| GET | `/api/download/:releaseId?source=website` | 记录下载并跳转到受控文件地址 |
| POST | `/api/feedback` | 提交用户反馈 |

反馈接口限制请求体大小为 20 KB、内容最多 2,000 字，并启用蜜罐字段和实例内限流。

## 管理接口

所有管理接口都需要：

```http
Authorization: Bearer <ADMIN_TOKEN>
```

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/admin/releases` | 查看全部版本 |
| POST | `/api/admin/releases` | 创建版本 |
| PATCH | `/api/admin/releases/:id` | 修改或发布版本 |
| DELETE | `/api/admin/releases/:id` | 删除未发布版本 |
| GET | `/api/admin/feedback?limit=100` | 查看反馈 |
| PATCH | `/api/admin/feedback/:id` | 变更反馈状态 |
| DELETE | `/api/admin/feedback/:id` | 删除反馈 |

### 创建已发布版本

```powershell
$headers = @{
  Authorization = "Bearer $env:ADMIN_TOKEN"
  "Content-Type" = "application/json"
}

$body = @{
  version = "0.1.4"
  channel = "stable"
  platform = "win-x64"
  fileName = "PackAgent-Setup-0.1.4-win-x64.exe"
  fileUrl = "https://download.example.com/PackAgent-Setup-0.1.4-win-x64.exe"
  fileSize = 338690048
  sha256 = "替换为真实SHA256"
  releaseNotes = "首个 Windows 发布版本。"
  isPublished = $true
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/admin/releases" `
  -Headers $headers `
  -Body $body
```

已有初始化草稿时，应使用其 ID 调用 `PATCH`，补全 `fileUrl`、`fileSize` 和
`sha256`，再将 `isPublished` 设置为 `true`。

## 生产部署

1. 在 Turso 创建数据库并生成访问令牌。
2. 将 `DATABASE_URL` 和 `DATABASE_AUTH_TOKEN` 配置到 Vercel 等运行环境。
3. 配置长度足够的 `ADMIN_TOKEN` 和正式站点 `NEXT_PUBLIC_SITE_URL`。
4. 执行一次 `npm run db:init` 创建表。
5. 将安装包放到 HTTPS 对象存储，通过管理接口登记文件地址。

当前限流存储在单个 Node.js 实例内。需要多实例高并发时，应将限流迁移到 Redis、
Upstash 或托管平台的边缘限流服务。

本地数据库文件不应提交到 Git。正式环境使用托管的 libSQL 数据库，并建立备份与
密钥轮换流程。
