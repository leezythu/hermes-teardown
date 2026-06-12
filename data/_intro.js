// ============================================================
//  首页 HTML（“核心思想”总览）
//  在 chapters.js 中赋值给 window.INTRO
// ============================================================
window.INTRO = `
<div class="hero">
  <h1>从一个 <span class="accent">ReAct 循环</span><br/>到生产级 Agent Harness</h1>
  <p class="hero-lede">
    每个能干活的编码 Agent，最初都是同样那二十行代码：调用模型、执行它请求的工具、
    把结果喂回去、再循环。这是对 <strong>Hermes</strong>（Nous Research 出品的自我改进 Agent）
    的一次逐层拆解——顺着这个循环，看它如何一个功能一个功能地生长，
    最终长成一个扛得住不稳定 API、记得住跨会话上下文、能自己排任务、还能自己写技能的系统。
  </p>
  <div class="hero-meta">
    <span>☤ 仅 <code>agent/</code> 一个目录就约 6.4 万行</span>
    <span>● 13 个子系统，逐行读源码</span>
    <span>● 每一步都有真实代码支撑</span>
  </div>
  <a class="cta" data-goto="#/ch/react-loop">从那个循环开始 →</a>
</div>

<h2>怎么读这份教程</h2>
<p>
  每一章都按顺序回答三个问题：在缺了这个功能的朴素循环里 <strong>会坏在哪</strong>、
  Hermes 做了 <strong>什么取舍</strong> 以及为什么、<strong>真实代码</strong> 又是怎么写的。
  你可以从头读到尾，把它当成一次循序渐进的搭建；也可以从侧边栏直接跳到任何一个子系统。
</p>
<p>
  整份拆解被两条原则贯穿始终——Hermes 的维护者在 <code>AGENTS.md</code> 开篇就点明了它们。
  几乎每一个设计选择，都是从这两条推导出来的：
</p>

<div class="principles">
  <div class="principle">
    <div class="pn">原则 01</div>
    <h3>单会话的 prompt 缓存神圣不可侵犯</h3>
    <p>一段长对话，每一轮都会复用缓存好的前缀。任何改动历史上下文、中途切换 toolset、
    或重建系统提示的动作，都会让缓存失效，把成本翻好几倍。所以 Hermes <em>从不</em> 这么做——
    唯一的例外是上下文压缩。</p>
  </div>
  <div class="principle">
    <div class="pn">原则 02</div>
    <h3>核心是一根“窄腰”</h3>
    <p>每个工具都会被塞进每一次 API 调用，所以新增一个 <em>核心</em> 工具的门槛极高。
    能力应该长在边缘——做成 CLI 命令 + 技能、按需启用的工具、插件，或 MCP 服务器——
    而不是把核心越堆越大。</p>
  </div>
</div>

<h2>窄腰阶梯</h2>
<p>
  每当有人提出一个新能力，Hermes 都会把它推到能解决问题的 <em>最高</em>（也就是占用最小）那一级。
  正是这一条决策规则，让核心循环始终小巧，整个系统却能做极多的事：
</p>
<div class="ladder">
  <div class="ladder-rung"><div class="ladder-num">1</div><div class="ladder-body"><div class="lt">扩展已有代码</div><div class="ld">这个能力只是已有东西的一个变体。零新增表面积。</div></div></div>
  <div class="ladder-rung"><div class="ladder-num">2</div><div class="ladder-body"><div class="lt">CLI 命令 + 技能</div><div class="ld">能用 shell 命令表达，由技能引导 Agent 去跑。零模型工具占用。</div></div></div>
  <div class="ladder-rung"><div class="ladder-num">3</div><div class="ladder-body"><div class="lt">按需启用的工具（服务门控）</div><div class="ld">需要结构化参数，且只有在某个前置条件就绪时才出现。否则零占用。</div></div></div>
  <div class="ladder-rung"><div class="ladder-num">4</div><div class="ladder-body"><div class="lt">插件</div><div class="ld">第三方或小众能力，运行时从 <code>~/.hermes/plugins/</code> 发现。</div></div></div>
  <div class="ladder-rung"><div class="ladder-num">5</div><div class="ladder-body"><div class="lt">MCP 服务器（进目录）</div><div class="ld">确实得做成工具、但又不属于核心基础设施。任何 MCP 宿主都能复用。</div></div></div>
  <div class="ladder-rung"><div class="ladder-num">6</div><div class="ladder-body"><div class="lt">新的核心工具</div><div class="ld">只有当它足够基础、几乎人人都用得上时才考虑。比如 terminal、read_file、web_search。</div></div></div>
</div>

<div class="callout">
  <div class="callout-title">☤ 核心论点</div>
  <p>一个优秀的 harness，不是一个聪明的循环，而是一个小而稳定的循环，外面包了几十层——
  每一层都对应“现实入侵”的一种形式：上下文超限、提供方抽风、被忘掉的事实、停不下来的迭代，
  以及那些活得比一轮对话更久的任务。我们会一层一层地把它们加上去。</p>
</div>

<a class="cta" data-goto="#/ch/react-loop">开始：核心 ReAct 循环 →</a>
`;
