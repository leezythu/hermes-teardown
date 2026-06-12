/* ============================================================
   Hermes Teardown — SPA renderer
   Reads window.CHAPTERS (array) + window.INTRO.
   Hash routing: #/  (landing), #/ch/<id>
   ============================================================ */

const app = {
  el: {},
  init() {
    this.el.sidebar = document.getElementById('sidebar');
    this.el.content = document.getElementById('content-inner');
    this.el.progress = document.getElementById('progress-fill');
    this.el.scrim = document.getElementById('scrim');
    this.buildNav();
    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('scroll', () => this.updateProgress());
    document.getElementById('menu-toggle').addEventListener('click', () => this.toggleMenu());
    this.el.scrim.addEventListener('click', () => this.toggleMenu(false));
    this.route();
  },

  toggleMenu(force) {
    const open = force === undefined ? !this.el.sidebar.classList.contains('open') : force;
    this.el.sidebar.classList.toggle('open', open);
    this.el.scrim.classList.toggle('open', open);
  },

  buildNav() {
    const nav = document.getElementById('nav');
    let html = `<div class="nav-section-label">从这里开始</div>
      <ul class="nav-list">
        <li class="nav-item" data-route="#/"><span class="nav-num">○</span><span class="nav-title">总览与核心思想</span></li>
      </ul>`;
    // group chapters by phase, preserving order
    let lastPhase = null;
    CHAPTERS.forEach((ch, i) => {
      if (ch.phase !== lastPhase) {
        if (lastPhase !== null) html += `</ul>`;
        html += `<div class="nav-section-label">${escapeHtml(ch.phase || 'Chapters')}</div><ul class="nav-list">`;
        lastPhase = ch.phase;
      }
      html += `<li class="nav-item" data-route="#/ch/${ch.id}">
        <span class="nav-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="nav-title">${escapeHtml(ch.title)}</span>
      </li>`;
    });
    html += `</ul>`;
    nav.innerHTML = html;
    nav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        location.hash = item.dataset.route;
        this.toggleMenu(false);
      });
    });
  },

  setActiveNav(route) {
    this.el.sidebar.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === route);
    });
  },

  route() {
    const hash = location.hash || '#/';
    window.scrollTo(0, 0);
    if (hash.startsWith('#/ch/')) {
      const id = hash.slice(5);
      const idx = CHAPTERS.findIndex(c => c.id === id);
      if (idx >= 0) { this.renderChapter(idx); this.setActiveNav(hash); return; }
    }
    this.renderLanding();
    this.setActiveNav('#/');
  },

  updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    this.el.progress.style.width = pct + '%';
  },

  // ---------- Renderers ----------
  renderLanding() {
    this.el.content.innerHTML = INTRO;
    this.el.content.classList.remove('fade-in'); void this.el.content.offsetWidth;
    this.el.content.classList.add('fade-in');
    // wire ladder rungs + CTA that link to chapters
    this.el.content.querySelectorAll('[data-goto]').forEach(elm => {
      elm.addEventListener('click', () => { location.hash = elm.dataset.goto; });
    });
    this.updateProgress();
  },

  renderChapter(idx) {
    const ch = CHAPTERS[idx];
    let h = '';

    h += `<div class="chapter-eyebrow">
      <span class="step-badge">第 ${String(idx + 1).padStart(2, '0')} 步 / 共 ${CHAPTERS.length} 步</span>
      <span>${escapeHtml(ch.phase || '搭建这个 harness')}</span>
    </div>`;
    h += `<h1>${escapeHtml(ch.title)}</h1>`;
    if (ch.one_line) h += `<div class="chapter-oneline">${escapeHtml(ch.one_line)}</div>`;

    if (ch.problem) {
      h += `<div class="block problem">
        <div class="block-head"><span class="block-icon">✕</span> 问题所在 —— 没有它会坏在哪</div>
        <div class="block-body">${this.mdToP(ch.problem)}</div>
      </div>`;
    }

    if (ch.design_decision) {
      h += `<div class="block design">
        <div class="block-head"><span class="block-icon">✓</span> Hermes 的设计决策</div>
        <div class="block-body">${this.mdToP(ch.design_decision)}</div>
      </div>`;
    }

    // extra prose sections (optional, for hand-authored richness).
    // `html` is injected raw (for diagrams/figures); `body` goes through markdown + escaping.
    if (ch.sections) {
      ch.sections.forEach(s => {
        if (s.h) h += `<h2>${escapeHtml(s.h)}</h2>`;
        if (s.html) h += s.html;
        if (s.body) h += this.mdToP(s.body);
      });
    }

    if (ch.code_snippets && ch.code_snippets.length) {
      h += `<h2>代码里是怎么做的</h2>`;
      ch.code_snippets.forEach((cs, ci) => { h += this.renderCode(cs, idx, ci); });
    }

    if (ch.gotchas && ch.gotchas.length) {
      h += `<h2>注意事项与不变量</h2><ul class="gotcha-list">`;
      ch.gotchas.forEach(g => { h += `<li>${this.inlineMd(g)}</li>`; });
      h += `</ul>`;
    }

    if (ch.connects_to && ch.connects_to.length) {
      h += `<h2>关联到</h2><div class="pill-list">`;
      ch.connects_to.forEach(c => { h += `<span class="pill">${escapeHtml(c)}</span>`; });
      h += `</div>`;
    }

    if (ch.outro) {
      h += `<div class="callout"><div class="callout-title">☤ 要点带走</div>${this.mdToP(ch.outro)}</div>`;
    }

    // prev / next
    const prev = CHAPTERS[idx - 1];
    const next = CHAPTERS[idx + 1];
    h += `<div class="chapter-nav">
      ${prev
        ? `<a href="#/ch/${prev.id}"><div class="cn-label">← 上一章</div><div class="cn-title">${escapeHtml(prev.title)}</div></a>`
        : `<a href="#/" ><div class="cn-label">← 返回</div><div class="cn-title">总览</div></a>`}
      ${next
        ? `<a class="next" href="#/ch/${next.id}"><div class="cn-label">下一章 →</div><div class="cn-title">${escapeHtml(next.title)}</div></a>`
        : `<a class="next" href="#/"><div class="cn-label">读完了 →</div><div class="cn-title">回到总览</div></a>`}
    </div>`;

    this.el.content.innerHTML = h;
    this.el.content.classList.remove('fade-in'); void this.el.content.offsetWidth;
    this.el.content.classList.add('fade-in');
    this.wireCopyButtons();
    this.updateProgress();
  },

  renderCode(cs, chIdx, ci) {
    const id = `code-${chIdx}-${ci}`;
    const hl = highlightPython(cs.code.replace(/\s+$/, ''));
    return `<div class="code-card">
      ${cs.caption ? `<div class="code-caption">${escapeHtml(cs.caption)}</div>` : ''}
      <div class="code-filebar">
        <span class="file-path">${escapeHtml(cs.file)}${cs.lines ? ':' + escapeHtml(cs.lines) : ''}</span>
        <button class="copy-btn" data-copy="${id}">copy</button>
      </div>
      <pre><code id="${id}">${hl}</code></pre>
      ${cs.explanation ? `<div class="code-explain">${this.inlineMd(cs.explanation)}</div>` : ''}
    </div>`;
  },

  wireCopyButtons() {
    this.el.content.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = document.getElementById(btn.dataset.copy);
        navigator.clipboard.writeText(code.innerText).then(() => {
          const t = btn.textContent; btn.textContent = 'copied ✓';
          setTimeout(() => btn.textContent = t, 1200);
        });
      });
    });
  },

  // ---------- tiny markdown ----------
  inlineMd(s) {
    return escapeHtml(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  },
  mdToP(s) {
    return s.split(/\n\n+/).map(para => `<p>${this.inlineMd(para.trim()).replace(/\n/g, '<br>')}</p>`).join('');
  },
};

document.addEventListener('DOMContentLoaded', () => app.init());
