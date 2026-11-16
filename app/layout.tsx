import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PackAgent — 从一句需求，到一个盒子",
  description:
    "PackAgent 将自然语言需求、工程规格、二维刀模、折叠预览与 Blender 模型连接为一条可检查的本地包装设计流程。",
  keywords: ["PackAgent", "包装设计", "刀模", "Blender", "包装盒"],
  openGraph: {
    title: "PackAgent — 从一句需求，到一个盒子",
    description:
      "让 AI 理解需求，让几何保持确定，让每一个文件来自同一个规格版本。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PackAgent 包装设计工作台" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PackAgent — 从一句需求，到一个盒子",
    description: "让 AI 理解需求，让几何保持确定。",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
