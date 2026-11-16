import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404</span>
      <h1>这一页，<br />还没有折叠进来。</h1>
      <p>你访问的页面不存在，或链接已经被新的版本替代。</p>
      <Link className="button button-primary" href="/">返回 PackAgent 首页</Link>
    </main>
  );
}
