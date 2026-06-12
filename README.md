# Hermes 拆解 — 教程网站

对 [Hermes Agent](https://github.com/NousResearch/hermes-agent)(Nous Research 出品)
的一次逐层拆解:**一个最简单的 ReAct 循环,如何一个功能一个功能地成长为生产级的 Agent Harness。**

每一章都按顺序回答三个问题:

1. **会坏在哪** —— 朴素循环里没有这个功能会出什么问题(动机)
2. **做了什么决策** —— Hermes 怎么设计、为什么(对应它的两条原则:*prompt 缓存神圣不可侵犯*、*核心是窄腰*)
3. **真实代码怎么实现** —— 逐字代码片段,附 `file:line` 引用

## 打开方式

这是个纯静态站,**不需要构建步骤**。

- **最简单**:打开单文件版 `hermes-teardown.html`,双击即可,无需服务器。
- 或者本地起个服务器:

```bash
python3 -m http.server 8000 --directory .
# 浏览器打开 http://localhost:8000
```

## 13 章

| # | 部分 | 章节 |
|---|------|------|
| 01 | 地基 | 核心 ReAct 循环 |
| 02 | 地基 | 工具与调度注册表 |
| 03 | 地基 | Toolset 与窄腰原则 |
| 04 | 给循环加边界 | 迭代预算与中断 |
| 05 | 给循环加边界 | prompt 缓存:神圣的不变量 |
| 06 | 给循环加边界 | 上下文压缩 |
| 07 | 跨时间学习 | 跨会话记忆 |
| 08 | 跨时间学习 | 技能与自我改进循环 |
| 09 | 跨时间学习 | 会话存储与 FTS5 检索 |
| 10 | 横向扩展 | 委派与子智能体 |
| 11 | 横向扩展 | 错误处理、重试与多提供方 |
| 12 | 横向扩展 | 定时任务与 Agent 队列 |
| 13 | 完整的机器 | 融会贯通:对话轮次的生命周期 |

## 内容是怎么生产的

章节内容由对 Hermes 真实源码的阅读生成(`agent/`、`run_agent.py`、`hermes_state.py`、
`cron/`、`AGENTS.md`)—— 13 个子系统并行分析,各自提取逐字代码、`file:line` 引用,
以及每个功能背后的设计动机。中文版在此基础上逐章翻译,**代码片段保持逐字原样**。

## 目录结构

```
index.html              # SPA 外壳 —— 侧边栏导航、阅读进度、移动端菜单
hermes-teardown.html    # 单文件版(全部内联,双击即开)
css/style.css           # 暗色 + 金色 Hermes 主题
js/highlight.js         # 零依赖 Python 语法高亮器
js/app.js               # hash 路由渲染器(读取 window.CHAPTERS)
data/chapters.js        # 自动生成的章节数据 + 首页 intro
data/_intro.js          # 首页“核心思想”HTML(手写)
scripts/build_chapters_zh.py   # 由翻译结果重新生成中文 chapters.js
scripts/bundle_single_file.py  # 把多文件站打包成单文件 HTML
```
