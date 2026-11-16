"use client";

import { useEffect, useState } from "react";

const links = [
  ["产品", "/#product"],
  ["工作流", "/#workflow"],
  ["能力", "/#capabilities"],
  ["安装", "/install"],
  ["下载", "/#download"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    setOpen(false);
    if (!href.startsWith("/#")) return;

    const target = document.querySelector(href.slice(1));
    if (!target || window.location.pathname !== "/") return;

    event.preventDefault();
    target.scrollIntoView({ block: "start", behavior: "auto" });
    window.history.replaceState(null, "", href.slice(1));
  }

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="brand" href="/" aria-label="PackAgent 首页">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>PackAgent</span>
      </a>

      <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="主导航">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={(event) => handleNavigation(event, href)}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <span className="version-pill">v0.1.4</span>
        <a
          className="button button-small"
          href="/#download"
          onClick={(event) => handleNavigation(event, "/#download")}
        >
          获取 PackAgent
        </a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
