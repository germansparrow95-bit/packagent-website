import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "安装与系统要求 — PackAgent",
  description: "PackAgent Windows 安装要求、Blender 选择和本机数据说明。",
};

export default function InstallPage() {
  return (
    <>
      <SiteHeader />
      <main className="install-page">
        <div className="install-hero">
          <span className="eyebrow">Install PackAgent</span>
          <h1>准备一台 Windows，<br />其余的交给安装向导。</h1>
          <p>PackAgent 在本机运行，安装时可以选择已有 Blender，或使用安装包内置的 Blender 5.2.2 LTS。</p>
          <Link className="button button-primary" href="/">返回官网</Link>
        </div>

        <section className="install-grid">
          <article>
            <span className="install-number">01</span>
            <h2>系统要求</h2>
            <p>64 位 Windows 10 或 Windows 11。建议为 Blender、项目文件、贴图和渲染结果预留充足磁盘空间。</p>
          </article>
          <article>
            <span className="install-number">02</span>
            <h2>选择 Blender</h2>
            <p>安装向导可以识别已有 blender.exe，也可以安装内置的 Blender 5.2.2 LTS。所选路径会保存在本机用户目录。</p>
          </article>
          <article>
            <span className="install-number">03</span>
            <h2>配置 AI</h2>
            <p>首次打开可配置 DeepSeek API Key。没有密钥时，仍然可以手工填写规格、生成刀模并导出文件。</p>
          </article>
          <article>
            <span className="install-number">04</span>
            <h2>本机数据</h2>
            <p>项目、Artwork、模型和渲染文件保存在当前 Windows 用户的数据目录。卸载默认保留用户数据。</p>
          </article>
        </section>

        <section className="install-notice">
          <strong>Windows 0.1.4 已可下载。</strong>
          <p>
            返回首页下载区即可获取安装包和 SHA256 校验信息。当前安装包未进行
            Authenticode 代码签名，Windows 可能提示“未知发布者”；安装前请核对
            文件哈希，并仅使用本站提供的文件。
          </p>
          <Link className="button button-light install-download-link" href="/#download">
            前往下载
          </Link>
        </section>
      </main>
    </>
  );
}
