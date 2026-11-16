"use client";

import { useState } from "react";

const stages = [
  {
    number: "01",
    label: "理解",
    title: "需求先成为草稿",
    detail: "AI 只整理包装相关字段，缺失参数继续追问。",
  },
  {
    number: "02",
    label: "确认",
    title: "由你锁定规格",
    detail: "箱型、盒内尺寸与实测纸厚，确认后才进入生成。",
  },
  {
    number: "03",
    label: "生成",
    title: "二维与三维同源",
    detail: "刀模、网页预览与导出文件使用同一份几何结果。",
  },
  {
    number: "04",
    label: "检查",
    title: "交给 Blender",
    detail: "动画、渲染图和检查摘要回到同一个项目版本。",
  },
] as const;

function Dieline() {
  return (
    <svg className="mini-dieline" viewBox="0 0 560 300" role="img" aria-label="包装刀模示意图">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path className="cut-line" d="M96 76h368v74H96zM96 76 60 48v98l36 4M464 76l36-28v98l-36 4M96 150l-36 34v70l36-20M464 150l36 34v70l-36-20M60 254h404v-20" />
        <path className="fold-line" d="M166 76v74M250 76v74M334 76v74M418 76v74M96 150h368M60 184h404M60 254h404" />
        <path className="cut-line" d="M157 50h18v26h-18zM243 50h18v26h-18zM329 50h18v26h-18z" />
      </g>
      <g className="dimension-lines">
        <path d="M96 36h368M96 29v14M464 29v14" />
        <text x="280" y="24" textAnchor="middle">300 mm</text>
        <path d="M514 76v74M507 76h14M507 150h14" />
        <text x="530" y="117">50 mm</text>
      </g>
    </svg>
  );
}

function ChatStage() {
  return (
    <div className="demo-workspace chat-workspace">
      <div className="workspace-sidebar">
        <div className="workspace-brand">PA</div>
        <span className="sidebar-line active" />
        <span className="sidebar-line" />
        <span className="sidebar-line short" />
        <span className="sidebar-line" />
      </div>
      <div className="chat-column">
        <div className="workspace-kicker">需求对话</div>
        <div className="bubble user">给一副耳机做快递包装。大约 15 × 8 × 4 厘米，希望开箱利落一些。</div>
        <div className="bubble assistant">
          产品尺寸已换算为 150 × 80 × 40 mm。还需要确认纸板实测厚度；如果首版打样，我可以给出待确认的盒内尺寸和内托余量。
        </div>
      </div>
      <div className="spec-column">
        <div className="workspace-kicker">规格草稿</div>
        <div className="spec-row"><span>箱型</span><strong>E005C</strong></div>
        <div className="spec-row"><span>盒内尺寸</span><strong>待确认</strong></div>
        <div className="spec-row"><span>纸板厚度</span><strong className="warning">待输入</strong></div>
        <div className="revision-note">草稿会持续更新，但不会自动确认。</div>
      </div>
    </div>
  );
}

function ConfirmStage() {
  return (
    <div className="demo-workspace confirm-workspace">
      <div className="confirm-head">
        <div>
          <div className="workspace-kicker">工程规格</div>
          <h4>耳机快递包装</h4>
        </div>
        <span className="revision-badge">REV. 06</span>
      </div>
      <div className="confirm-grid">
        <div className="confirm-field wide"><span>箱型</span><strong>E005C · 飞机盒</strong></div>
        <div className="confirm-field wide"><span>材料</span><strong>瓦楞纸板 · 3.0 mm</strong></div>
        <div className="confirm-field"><span>盒内长</span><strong>180 mm</strong></div>
        <div className="confirm-field"><span>盒内宽</span><strong>110 mm</strong></div>
        <div className="confirm-field"><span>盒内高</span><strong>70 mm</strong></div>
        <div className="confirm-field"><span>每侧缓冲</span><strong>15 mm</strong></div>
      </div>
      <div className="confirm-bar">
        <div><span className="status-dot" />兼容性检查通过</div>
        <button type="button">确认当前规格</button>
      </div>
    </div>
  );
}

function GenerateStage() {
  return (
    <div className="demo-workspace generate-workspace">
      <div className="result-sheet">
        <div className="result-sheet-head">
          <span>刀模预览</span>
          <strong>REV. 06 · 已生成</strong>
        </div>
        <Dieline />
      </div>
      <div className="result-meta">
        <div className="workspace-kicker">同一次几何结果</div>
        <h4>SVG / PDF / DXF / GLB</h4>
        <p>每一个文件都绑定当前已确认版本。</p>
        <div className="format-list">
          <span>2D 刀模</span>
          <span>3D 预览</span>
          <span>Blender 动画</span>
        </div>
      </div>
    </div>
  );
}

function CheckStage() {
  return (
    <div className="demo-workspace check-workspace">
      <div className="model-window">
        <div className="model-grid" />
        <div className="model-cube">
          <span className="cube-face top" />
          <span className="cube-face front" />
          <span className="cube-face side" />
        </div>
        <div className="model-label top-label">TOP</div>
        <div className="model-label hero-label">HERO</div>
      </div>
      <div className="review-panel">
        <span className="review-status"><i /> Geometrically checked</span>
        <h4>模型检查完成</h4>
        <p>已确认面板边界与折叠关系。视觉检查作为辅助，不替代实物打样。</p>
        <div className="review-file"><span>package.blend</span><strong>14.8 MB</strong></div>
        <div className="review-file"><span>package.glb</span><strong>3.2 MB</strong></div>
        <div className="review-file"><span>render_top.png</span><strong>768 px</strong></div>
      </div>
    </div>
  );
}

const content = [<ChatStage key="chat" />, <ConfirmStage key="confirm" />, <GenerateStage key="generate" />, <CheckStage key="check" />];

export function WorkflowDemo() {
  const [active, setActive] = useState(0);

  return (
    <div className="workflow-demo">
      <div className="workflow-tabs" role="tablist" aria-label="PackAgent 工作流">
        {stages.map((stage, index) => (
          <button
            key={stage.number}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={active === index ? "is-active" : ""}
            onClick={() => setActive(index)}
          >
            <span>{stage.number}</span>
            <strong>{stage.label}</strong>
          </button>
        ))}
      </div>
      <div className="workflow-copy" aria-live="polite">
        <h3>{stages[active].title}</h3>
        <p>{stages[active].detail}</p>
      </div>
      <div className="workflow-canvas" key={active}>
        {content[active]}
      </div>
    </div>
  );
}
