# Hermes 拆解 · 教程站

> 一个最小的 ReAct 循环，是如何一层一层长成生产级 Agent Harness 的。

这是对 [Hermes Agent](https://github.com/NousResearch/hermes-agent)（Nous Research 出品）的逐层拆解。我们从那二十行的核心循环出发，每加一个功能，就回答三个问题：**不加它会坏在哪、Hermes 为什么这么设计、真实代码又是怎么写的。**

## 在线阅读

- **网站**：<https://leezythu.github.io/hermes-teardown/>
- **单文件版**：下载 `hermes-teardown.html` 双击即可打开，全部内联、不依赖网络。

## 每章三问

1. **会坏在哪** —— 朴素循环缺了这个功能，会出什么问题（动机）
2. **为什么这么设计** —— Hermes 的取舍，以及背后那两条原则：*单会话的 prompt 缓存神圣不可侵犯*、*核心是一根窄腰*
3. **代码怎么写** —— 逐字摘录的真实源码，附 `文件:行号` 出处

## 本地预览

纯静态站，**无需构建**。

- 最简单：直接双击 `hermes-teardown.html`。
- 或起一个本地服务器：

```bash
python3 -m http.server 8000 --directory .
# 浏览器打开 http://localhost:8000
```

## 13 章

| # | 部分 | 章节 |
|---|------|------|
| 01 | 地基 | 核心 ReAct 循环 |
| 02 | 地基 | 工具与调度注册表 |
| 03 | 地基 | 工具集与窄腰原则 |
| 04 | 给循环加边界 | 迭代预算与中断 |
| 05 | 给循环加边界 | prompt 缓存：不可触碰的不变量 |
| 06 | 给循环加边界 | 上下文压缩 |
| 07 | 跨时间学习 | 跨会话记忆 |
| 08 | 跨时间学习 | 技能与自我改进循环 |
| 09 | 跨时间学习 | 会话存储与 FTS5 检索 |
| 10 | 横向扩展 | 委派与子智能体 |
| 11 | 横向扩展 | 错误处理、重试与多提供方 |
| 12 | 横向扩展 | 定时任务与智能体队列 |
| 13 | 完整的机器 | 融会贯通：一个对话轮次的生命周期 |

## 内容从哪来

正文由通读 Hermes 真实源码后写成（`agent/`、`run_agent.py`、`hermes_state.py`、`cron/`、`AGENTS.md`）—— 13 个子系统并行分析，各自提取逐字代码、`文件:行号` 出处，以及每个功能背后的设计动机。中文版在此基础上逐章成稿，**代码片段一律保持英文原样**。

## 目录结构

```
index.html              # 多文件版外壳：侧边栏导航、阅读进度、移动端菜单
hermes-teardown.html    # 单文件版（全部内联，双击即开）
css/style.css           # 暗色 + 金色 Hermes 主题
js/highlight.js         # 零依赖的 Python 语法高亮
js/app.js               # 基于 hash 路由的渲染器（读取 window.CHAPTERS）
data/chapters.js        # 自动生成的章节数据 + 首页 intro
data/_intro.js          # 首页“核心思想”HTML（手写）
scripts/build_chapters_zh.py   # 由翻译稿重新生成中文版 chapters.js
scripts/bundle_single_file.py  # 把多文件站打包成单文件 HTML
```

> 改完 `data/_intro.js` 或 `data/chapters.js` 后，跑一次 `python3 scripts/bundle_single_file.py` 即可重新生成 `hermes-teardown.html`。

## 致谢与许可

本项目是对 Nous Research [Hermes Agent](https://github.com/NousResearch/hermes-agent)（MIT 协议）的教学性拆解；文中逐字引用的源码版权归原作者所有。教程站本身（文字、版式、工具脚本）以 MIT 协议开源，详见 [LICENSE](LICENSE)。
