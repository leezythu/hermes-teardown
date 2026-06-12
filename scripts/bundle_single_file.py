#!/usr/bin/env python3
"""Bundle the multi-file site into ONE standalone hermes-teardown.html.

Inlines css/style.css into <style>, and js/highlight.js + data/chapters.js +
js/app.js into <script> blocks. The favicon SVG is inlined as a data URI.
Result: double-click to open, no server, no relative paths, no proxy.
"""
import base64, pathlib, re

ROOT = pathlib.Path('/mnt/hdfs/lizhenyu/hermes-tutorial-site')
OUT = ROOT / 'hermes-teardown.html'

css = (ROOT / 'css/style.css').read_text(encoding='utf-8')
js_highlight = (ROOT / 'js/highlight.js').read_text(encoding='utf-8')
js_chapters = (ROOT / 'data/chapters.js').read_text(encoding='utf-8')
js_app = (ROOT / 'js/app.js').read_text(encoding='utf-8')
favicon = (ROOT / 'assets/favicon.svg').read_text(encoding='utf-8')

# Safety: neutralize any literal </script> that could prematurely close a block.
def safe_js(s):
    return s.replace('</script>', '<\\/script>')

favicon_b64 = base64.b64encode(favicon.encode('utf-8')).decode('ascii')

html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hermes 拆解 — 从 ReAct 循环到生产级 Agent Harness</title>
  <meta name="description" content="对 Hermes Agent 的逐层拆解:一个最简单的 ReAct 循环,如何一个功能一个功能地成长为生产级的 Agent Harness。每一步都配有真实代码讲解。" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,{favicon_b64}" />
  <style>
{css}
  </style>
</head>
<body>
  <button id="menu-toggle" class="menu-toggle" aria-label="Toggle menu">☰</button>
  <div id="scrim" class="scrim"></div>

  <div class="progress-bar"><div id="progress-fill" class="progress-bar-fill"></div></div>

  <div class="layout">
    <aside id="sidebar" class="sidebar">
      <div class="brand">
        <div class="brand-title" onclick="location.hash='#/'">
          <span class="brand-caduceus">☤</span> Hermes 拆解
        </div>
        <div class="brand-sub">react 循环 → agent harness</div>
      </div>
      <nav id="nav"></nav>
    </aside>

    <main class="content">
      <div id="content-inner" class="content-inner"></div>
    </main>
  </div>

  <script>
{safe_js(js_highlight)}
  </script>
  <script>
{safe_js(js_chapters)}
  </script>
  <script>
{safe_js(js_app)}
  </script>
</body>
</html>
"""

OUT.write_text(html, encoding='utf-8')
print(f"Wrote {OUT}  ({len(html.encode('utf-8'))/1024:.0f} KB)")
