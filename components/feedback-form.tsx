"use client";

import { useState } from "react";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function FeedbackForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState({ kind: "submitting" });

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          category: data.get("category"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "提交失败");

      form.reset();
      setState({
        kind: "success",
        message: "已收到。你的建议会进入下一轮产品评审。",
      });
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "提交失败，请稍后重试",
      });
    }
  }

  return (
    <section className="feedback-section" id="feedback">
      <div className="feedback-inner">
        <div className="feedback-copy">
          <span className="eyebrow">Feedback matters</span>
          <h2>有想法？<br />让它成为下一版。</h2>
          <p>
            遇到问题、需要新的箱型，或者对工作流有不同设想，都可以直接告诉我们。
            反馈会保存在项目数据库中，不会公开显示。
          </p>
          <div className="feedback-topics">
            <span>问题反馈</span>
            <span>功能建议</span>
            <span>合作咨询</span>
          </div>
        </div>

        <form className="feedback-form" onSubmit={submit}>
          <div className="feedback-fields">
            <label>
              <span>称呼</span>
              <input name="name" maxLength={60} autoComplete="name" placeholder="选填" />
            </label>
            <label>
              <span>邮箱</span>
              <input
                name="email"
                type="email"
                maxLength={254}
                autoComplete="email"
                placeholder="选填，便于回复"
              />
            </label>
          </div>
          <label>
            <span>反馈类型</span>
            <select name="category" defaultValue="suggestion">
              <option value="bug">问题反馈</option>
              <option value="suggestion">功能建议</option>
              <option value="question">使用咨询</option>
              <option value="other">其他</option>
            </select>
          </label>
          <label>
            <span>具体内容</span>
            <textarea
              name="message"
              minLength={5}
              maxLength={2000}
              rows={5}
              required
              placeholder="请描述你正在解决的问题，或希望 PackAgent 下一步支持什么…"
            />
          </label>
          <label className="feedback-honeypot" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <div className="feedback-actions">
            <button className="button button-primary" type="submit" disabled={state.kind === "submitting"}>
              {state.kind === "submitting" ? "正在提交…" : "发送反馈"}
            </button>
            <p className={`feedback-status ${state.kind}`} role="status">
              {state.kind === "success" || state.kind === "error" ? state.message : "单次最多提交 2,000 字"}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
