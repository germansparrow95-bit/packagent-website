# PackAgent Website

PackAgent 官方产品站，采用 Next.js、React、TypeScript、React Three Fiber、
Drizzle ORM 和 libSQL 构建。

## 本地运行

```powershell
npm install
Copy-Item .env.example .env.local
npm run db:init
npm run dev
```

打开 `http://localhost:3000`。

## 构建

```powershell
npm run build
```

构建：

```powershell
npm run build
npm run start
```

官网包含动态版本、下载和反馈接口，需要 Node.js 运行时或 Vercel 等全栈部署环境。
数据库和接口说明见 [BACKEND.md](BACKEND.md)。

部署前设置正式站点地址，生成正确的社交分享元数据：

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://你的域名"
npm run build
```

如需重新生成社交分享图：

```powershell
npm run dev
npm run og
```

启动开发服务器后，运行 `npm run qa` 可检查桌面端、移动端横向溢出并生成
`qa/` 目录下的验收截图。

执行 API 冒烟测试：

```powershell
$env:ADMIN_TOKEN = "本地管理密钥"
npm run test:api
```

## 安装包

本地安装包位于 `public/downloads/PackAgent-Setup-0.1.4-win-x64.exe`，已登记并
发布到数据库，下载区会通过受控接口记录下载次数。

- 文件大小：338,491,349 bytes
- SHA256：`DCCB5C7087052FBFDACB7E60D58D1B4CB5F935F2496BDDF6495CFDD517B46B16`
- Authenticode：未签名

替换安装包后运行：

```powershell
npm run installer:publish-local -- "public/downloads/新的安装包.exe"
```

`public/downloads/*.exe` 已加入 `.gitignore`，部署时需要由构建或对象存储单独
上传二进制文件。

## 设计说明

- 首屏使用 Three.js 呈现包装盒折叠主视觉。
- 工作流演示覆盖需求、确认、生成和 Blender 检查四个阶段。
- 动效遵循 `prefers-reduced-motion`，用户关闭动画时自动降级。
- 当前站点不包含追踪脚本或外部字体请求。
