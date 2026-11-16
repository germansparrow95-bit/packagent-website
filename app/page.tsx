import Link from "next/link";
import { DownloadPanel } from "@/components/download-panel";
import { FeedbackForm } from "@/components/feedback-form";
import { HeroScene } from "@/components/hero-scene";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { WorkflowDemo } from "@/components/workflow-demo";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 9h10M10 5l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function FeatureGrid() {
  return (
    <section className="section capabilities-section" id="capabilities">
      <div className="section-inner">
        <Reveal className="section-heading">
          <span className="eyebrow">Built for the whole path</span>
          <h2>设计之外，<br />每一处也恰到好处。</h2>
          <p>从需求到文件，从屏幕到 Blender。不是堆叠功能，而是让每一步自然接上下一步。</p>
        </Reveal>

        <div className="feature-grid">
          <Reveal className="feature-card feature-card-dark feature-card-blender" delay={40}>
            <div className="feature-copy">
              <span className="feature-label">BLENDER NATIVE</span>
              <h3>让盒子，<br />真的在眼前折起来。</h3>
              <p>本机 Blender 生成带关键帧的 .blend、GLB 与四张渲染图。</p>
            </div>
            <div className="blender-visual" aria-hidden="true">
              <div className="blender-halo" />
              <svg className="blender-box" viewBox="0 0 430 330">
                <defs>
                  <linearGradient id="blender-lid" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f4eddf" />
                    <stop offset="1" stopColor="#d9ceba" />
                  </linearGradient>
                  <linearGradient id="blender-front" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#d8cdb9" />
                    <stop offset="1" stopColor="#a79b88" />
                  </linearGradient>
                  <linearGradient id="blender-right" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#b9ad99" />
                    <stop offset="1" stopColor="#7f7567" />
                  </linearGradient>
                  <linearGradient id="blender-left" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#c9beaa" />
                    <stop offset="1" stopColor="#918675" />
                  </linearGradient>
                </defs>
                <path
                  d="M65 150 225 105 175 45 15 90Z"
                  fill="url(#blender-lid)"
                  stroke="#d9cfbd"
                  strokeWidth="1.5"
                />
                <path
                  d="M65 150 200 215 360 170 225 105Z"
                  fill="#282a2d"
                  stroke="#d9cfbd"
                  strokeWidth="1.5"
                />
                <path
                  d="M65 150 200 215 200 295 65 230Z"
                  fill="url(#blender-left)"
                  stroke="#d9cfbd"
                  strokeWidth="1.5"
                />
                <path
                  d="M225 105 360 170 360 250 225 185Z"
                  fill="url(#blender-right)"
                  stroke="#d9cfbd"
                  strokeWidth="1.5"
                />
                <path
                  d="M200 215 360 170 360 250 200 295Z"
                  fill="url(#blender-front)"
                  stroke="#d9cfbd"
                  strokeWidth="1.5"
                />
                <path
                  d="M91 159 203 201M258 123v62M245 244v51"
                  fill="none"
                  stroke="#f3eddf"
                  strokeWidth="0.8"
                  opacity=".4"
                />
                <path
                  d="M247 235 304 218 304 243 247 260Z"
                  fill="#161719"
                  opacity=".8"
                />
                <path
                  d="M259 241h31M259 248h22"
                  stroke="#d9cfbd"
                  strokeWidth="0.9"
                  opacity=".8"
                />
              </svg>
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <div className="timeline">
                <i />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </Reveal>

          <Reveal className="feature-card feature-card-light feature-card-export" delay={100}>
            <span className="feature-label">ONE REVISION</span>
            <h3>一次生成，<br />贯穿所有视图。</h3>
            <p>SVG、PDF、DXF、网页 3D 与 Blender 文件都来自同一个已确认版本。</p>
            <div className="format-orbit" aria-label="支持导出的文件格式">
              <span>SVG</span>
              <span>PDF</span>
              <span>DXF</span>
              <span>GLB</span>
              <i>REV.06</i>
            </div>
          </Reveal>

          <Reveal className="feature-card feature-card-warm feature-card-local" delay={40}>
            <span className="feature-label">LOCAL FIRST</span>
            <h3>你的项目，<br />留在你的电脑。</h3>
            <p>项目、贴图和渲染文件保存在本机。API Key 由服务端读取，不返回浏览器。</p>
            <div className="local-visual" aria-hidden="true">
              <div className="device-ring ring-a" />
              <div className="device-ring ring-b" />
              <div className="device-core">
                <i />
                <span>LOCAL</span>
              </div>
              <span className="local-chip chip-a">127.0.0.1</span>
              <span className="local-chip chip-b">OFFLINE READY</span>
            </div>
          </Reveal>

          <Reveal className="feature-card feature-card-blue feature-card-artwork" delay={100}>
            <span className="feature-label">ARTWORK</span>
            <h3>图案落在面板，<br />也落在模型上。</h3>
            <p>先选目标面板，再定位 PNG、JPG、SVG 或 PDF。预览与 Blender 使用同一张贴图。</p>
            <div className="artwork-visual" aria-hidden="true">
              <div className="artwork-card card-back" />
              <div className="artwork-card card-mid" />
              <div className="artwork-card card-front">
                <span className="art-sun" />
                <span className="art-hill hill-a" />
                <span className="art-hill hill-b" />
                <span className="art-word">FORM</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PrecisionSection() {
  return (
    <section className="precision-section" id="product">
      <div className="precision-inner">
        <Reveal className="precision-copy">
          <span className="eyebrow">Deterministic geometry</span>
          <h2>灵感可以自由。<br />尺寸必须确定。</h2>
          <p>
            AI 帮助理解需求，几何程序负责生成刀模。缺少参数、材质不兼容或轮廓异常，
            都会在你确认之前被清楚指出。
          </p>
          <div className="precision-points">
            <div>
              <strong>0.02 mm</strong>
              <span>DXF 曲线最大弦高误差</span>
            </div>
            <div>
              <strong>5</strong>
              <span>当前受支持箱型</span>
            </div>
            <div>
              <strong>1:1</strong>
              <span>二维、三维与文件同版</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="dieline-board" delay={100}>
          <div className="board-top">
            <span>dieline_0421.svg</span>
            <span className="board-status"><i /> 300 × 200 × 50 mm</span>
          </div>
          <svg viewBox="0 0 760 540" role="img" aria-label="0421 包装刀模结构图">
            <defs>
              <linearGradient id="cutGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1d1e1d" />
                <stop offset="1" stopColor="#545550" />
              </linearGradient>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g className="dieline-main" fill="none" strokeLinejoin="round" strokeLinecap="round">
              <path
                className="dieline-cut"
                d="M134 184h492v154H134zM134 184 76 140v222l58 30M626 184l60-44v222l-60 30M134 338l-58 54v102l58-36M626 338l60 54v102l-60-36M76 494h550v-66"
              />
              <path
                className="dieline-fold"
                d="M230 184v154M326 184v154M434 184v154M530 184v154M134 338h492M76 392h550M76 494h550M196 140h22v44h-22zM292 140h22v44h-22zM400 140h22v44h-22zM496 140h22v44h-22z"
              />
              <path
                className="dieline-cut faint"
                d="M310 430h140v64H310zM310 455h140"
              />
            </g>
            <g className="dieline-guides">
              <path d="M134 119h492M134 110v18M626 110v18" />
              <text x="380" y="99" textAnchor="middle">300 mm</text>
              <path d="M690 184v154M681 184h18M681 338h18" />
              <text x="718" y="265">50 mm</text>
              <path d="M76 550v-56M68 550h16M68 494h16" />
              <text x="45" y="527">200 mm</text>
            </g>
            <circle className="marker marker-a" cx="134" cy="184" r="4" />
            <circle className="marker marker-b" cx="626" cy="338" r="4" />
            <circle className="marker marker-c" cx="76" cy="494" r="4" />
          </svg>
          <div className="board-bottom">
            <span><i className="solid" /> CUT</span>
            <span><i className="dash" /> CREASE</span>
            <span><i className="dot" /> PANEL</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              PackAgent 0.1.4
              <span>为包装设计而生</span>
            </div>
            <h1>
              从一句需求，
              <br />
              <span>到一个盒子。</span>
            </h1>
            <p className="hero-lead">
              让 AI 理解需求，让几何保持确定。
              从规格草稿到刀模、折叠预览与 Blender，每一步都在同一个版本里。
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#workflow">
                探索工作流
                <ArrowIcon />
              </a>
              <Link className="text-link" href="/install">
                查看系统要求
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <HeroScene />

          <div className="hero-foot">
            <span>需求理解</span>
            <i />
            <span>参数化几何</span>
            <i />
            <span>二维刀模</span>
            <i />
            <span>折叠动画</span>
            <i />
            <span>Blender</span>
          </div>
        </section>

        <section className="manifesto-section">
          <Reveal>
            <span className="manifesto-kicker">PACKAGING, REIMAGINED.</span>
            <p className="manifesto">
              复杂的留给我们。
              <br />
              <span>你只需要做决定。</span>
            </p>
          </Reveal>
          <div className="manifesto-orbit" aria-hidden="true">
            <span />
            <i />
          </div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="section-inner">
            <Reveal className="section-heading centered">
              <span className="eyebrow">A calmer way to design</span>
              <h2>一次流畅的创造，<br />从第一个问题开始。</h2>
              <p>任何规格变化都会形成新版本，旧确认和旧文件不会悄悄混进新结果。</p>
            </Reveal>
            <WorkflowDemo />
          </div>
        </section>

        <PrecisionSection />
        <FeatureGrid />

        <section className="privacy-section" id="privacy">
          <div className="privacy-shell">
            <Reveal className="privacy-copy">
              <span className="eyebrow eyebrow-light">Private by architecture</span>
              <h2>默认在本机。<br />联网由你决定。</h2>
              <p>
                PackAgent 只监听 127.0.0.1。项目、贴图和 Blender 文件留在你的电脑；
                只有当你发起 AI 对话或视觉检查时，相关材料才会发送到 DeepSeek。
              </p>
              <a className="button button-light" href="#capabilities">
                了解数据边界
                <ArrowIcon />
              </a>
            </Reveal>
            <Reveal className="privacy-visual" delay={100}>
              <div className="privacy-window">
                <div className="privacy-top">
                  <span className="status-dot" />
                  Local connection
                  <strong>127.0.0.1</strong>
                </div>
                <div className="privacy-center">
                  <div className="privacy-node node-user">
                    <span>YOU</span>
                    <i />
                  </div>
                  <div className="privacy-path path-a" />
                  <div className="privacy-path path-b" />
                  <div className="privacy-node node-app">
                    <span>PA</span>
                    <small>PackAgent</small>
                  </div>
                  <div className="privacy-node node-data">
                    <span>DATA</span>
                    <small>本机数据目录</small>
                  </div>
                  <div className="privacy-node node-ai">
                    <span>AI</span>
                    <small>可选 · 需授权</small>
                  </div>
                </div>
                <div className="privacy-bottom">
                  <span>API Key</span>
                  <i />
                  <strong>仅服务端读取</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <FeedbackForm />

        <section className="download-section" id="download">
          <div className="download-glow" />
          <Reveal className="download-inner">
            <span className="eyebrow">Ready when you are</span>
            <h2>下一步，<br />开始做第一个盒子。</h2>
            <p>在 Windows 电脑上运行。可使用内置 Blender，也可以在安装时选择已有版本。</p>
            <DownloadPanel />
            <div className="download-notes">
              <span>Windows 10 / 11 · 64 位</span>
              <span>Node.js 24 + Blender 5.2.2</span>
              <span>本机运行 · 设计辅助</span>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand brand-footer" href="#top">
              <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
              <span>PackAgent</span>
            </a>
            <p>把包装设计的复杂，收进一条清晰的路径。</p>
          </div>
          <div className="footer-links">
            <div>
              <strong>产品</strong>
              <a href="#product">精度</a>
              <a href="#workflow">工作流</a>
              <a href="#capabilities">能力</a>
            </div>
            <div>
              <strong>支持</strong>
              <Link href="/install">安装说明</Link>
              <a href="#privacy">数据与隐私</a>
              <a href="#download">版本下载</a>
            </div>
            <div>
              <strong>关于</strong>
              <span>设计辅助软件</span>
              <span>MIT License</span>
              <span>Made for Windows</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PackAgent</span>
          <span>软件结果用于设计辅助，正式投产前须由纸盒厂审核并制作实物样品。</span>
        </div>
      </footer>
    </>
  );
}
