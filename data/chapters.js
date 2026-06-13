// ============================================================
//  自动生成（中文版，已润色）。请勿手改；改 data/_intro.js 后重跑
//  scripts/build_chapters_zh.py。代码片段逐字取自英文源。
// ============================================================

window.INTRO = "\n<div class=\"hero\">\n  <h1>从一个 <span class=\"accent\">ReAct 循环</span><br/>到生产级 Agent Harness</h1>\n  <p class=\"hero-lede\">\n    每个能干活的编码 Agent，最初都是同样那二十行代码：调用模型、执行它请求的工具、\n    把结果喂回去、再循环。这是对 <strong>Hermes</strong>（Nous Research 出品的自我改进 Agent）\n    的一次逐层拆解——顺着这个循环，看它如何一个功能一个功能地生长，\n    最终长成一个扛得住不稳定 API、记得住跨会话上下文、能自己排任务、还能自己写技能的系统。\n  </p>\n  <div class=\"hero-meta\">\n    <span>☤ 仅 <code>agent/</code> 一个目录就约 6.4 万行</span>\n    <span>● 13 个子系统，逐行读源码</span>\n    <span>● 每一步都有真实代码支撑</span>\n  </div>\n  <a class=\"cta\" data-goto=\"#/ch/react-loop\">从那个循环开始 →</a>\n</div>\n\n<h2>怎么读这份教程</h2>\n<p>\n  每一章都按顺序回答三个问题：在缺了这个功能的朴素循环里 <strong>会坏在哪</strong>、\n  Hermes 做了 <strong>什么取舍</strong> 以及为什么、<strong>真实代码</strong> 又是怎么写的。\n  你可以从头读到尾，把它当成一次循序渐进的搭建；也可以从侧边栏直接跳到任何一个子系统。\n</p>\n<p>\n  整份拆解被两条原则贯穿始终——Hermes 的维护者在 <code>AGENTS.md</code> 开篇就点明了它们。\n  几乎每一个设计选择，都是从这两条推导出来的：\n</p>\n\n<div class=\"principles\">\n  <div class=\"principle\">\n    <div class=\"pn\">原则 01</div>\n    <h3>单会话的 prompt 缓存神圣不可侵犯</h3>\n    <p>一段长对话，每一轮都会复用缓存好的前缀。任何改动历史上下文、中途切换 toolset、\n    或重建系统提示的动作，都会让缓存失效，把成本翻好几倍。所以 Hermes <em>从不</em> 这么做——\n    唯一的例外是上下文压缩。</p>\n  </div>\n  <div class=\"principle\">\n    <div class=\"pn\">原则 02</div>\n    <h3>核心是一根“窄腰”</h3>\n    <p>每个工具都会被塞进每一次 API 调用，所以新增一个 <em>核心</em> 工具的门槛极高。\n    能力应该长在边缘——做成 CLI 命令 + 技能、按需启用的工具、插件，或 MCP 服务器——\n    而不是把核心越堆越大。</p>\n  </div>\n</div>\n\n<h2>窄腰阶梯</h2>\n<p>\n  每当有人提出一个新能力，Hermes 都会把它推到能解决问题的 <em>最高</em>（也就是占用最小）那一级。\n  正是这一条决策规则，让核心循环始终小巧，整个系统却能做极多的事：\n</p>\n<div class=\"ladder\">\n  <div class=\"ladder-rung\"><div class=\"ladder-num\">1</div><div class=\"ladder-body\"><div class=\"lt\">扩展已有代码</div><div class=\"ld\">这个能力只是已有东西的一个变体。零新增表面积。</div></div></div>\n  <div class=\"ladder-rung\"><div class=\"ladder-num\">2</div><div class=\"ladder-body\"><div class=\"lt\">CLI 命令 + 技能</div><div class=\"ld\">能用 shell 命令表达，由技能引导 Agent 去跑。零模型工具占用。</div></div></div>\n  <div class=\"ladder-rung\"><div class=\"ladder-num\">3</div><div class=\"ladder-body\"><div class=\"lt\">按需启用的工具（服务门控）</div><div class=\"ld\">需要结构化参数，且只有在某个前置条件就绪时才出现。否则零占用。</div></div></div>\n  <div class=\"ladder-rung\"><div class=\"ladder-num\">4</div><div class=\"ladder-body\"><div class=\"lt\">插件</div><div class=\"ld\">第三方或小众能力，运行时从 <code>~/.hermes/plugins/</code> 发现。</div></div></div>\n  <div class=\"ladder-rung\"><div class=\"ladder-num\">5</div><div class=\"ladder-body\"><div class=\"lt\">MCP 服务器（进目录）</div><div class=\"ld\">确实得做成工具、但又不属于核心基础设施。任何 MCP 宿主都能复用。</div></div></div>\n  <div class=\"ladder-rung\"><div class=\"ladder-num\">6</div><div class=\"ladder-body\"><div class=\"lt\">新的核心工具</div><div class=\"ld\">只有当它足够基础、几乎人人都用得上时才考虑。比如 terminal、read_file、web_search。</div></div></div>\n</div>\n\n<div class=\"callout\">\n  <div class=\"callout-title\">☤ 核心论点</div>\n  <p>一个优秀的 harness，不是一个聪明的循环，而是一个小而稳定的循环，外面包了几十层——\n  每一层都对应“现实入侵”的一种形式：上下文超限、提供方抽风、被忘掉的事实、停不下来的迭代，\n  以及那些活得比一轮对话更久的任务。我们会一层一层地把它们加上去。</p>\n</div>\n\n<a class=\"cta\" data-goto=\"#/ch/react-loop\">开始：核心 ReAct 循环 →</a>\n";

window.CHAPTERS = [
  {
    "id": "react-loop",
    "title": "核心 ReAct 循环",
    "phase": "第一部分 · 地基",
    "one_line": "一个单线程的同步 while 循环：调用模型，执行它请求的全部工具调用，把结果追加进消息列表，再继续下一轮——直到模型的回复里不再有工具调用（或某道护栏被触发）才退出。",
    "problem": "没有循环，智能体就只是一次性的对话补全：模型能请求调用某个工具，却没有谁去真正执行它、把结果回传，再让模型据此决定下一步。单次调用要么直接给答案，要么请求一个工具，两者无法在同一条序列里先后发生；于是任何多步任务——读文件、改文件、再跑测试——都无从完成。你也没法叫停一个失控的模型：它可能无止境地请求工具、烧掉没有上限的 API 开销，或者无视一个想在中途打断它的用户。",
    "design_decision": "Hermes 刻意把控制流做到极简——`run_conversation`（agent/conversation_loop.py:461）里就一个 `while` 循环，循环体只做一件事：调用模型；若有 tool_calls，就执行并把结果追加进去，然后 `continue`；否则这就是最终回复，`break`。这正是原则 2（窄腰）的体现：循环本身不会为每项新能力增加分支——工具、记忆、技能、插件全都接在边缘（由模型决定调哪个工具，`agent._execute_tool_calls` 再把调用分派给 agent/tool_executor.py 里的处理器），所以加一项能力永远不必改动这个循环。它同时守护着原则 1（prompt 缓存神圣不可侵犯）：系统提示只构建一次，每一轮都逐字节原样重放（661-666 行的注释把这称作 Hermes 的不变量），而每轮的临时上下文（记忆召回、插件提示）只注入到供 API 调用的那份副本 `api_messages` 的用户消息里，绝不写进被持久化的 `messages`，因此被缓存的前缀始终不被扰动。退出由一个显式的合取条件把关——迭代计数对比 `max_iterations`（默认 90）且线程安全的 `IterationBudget` 仍有余量——再加上一次性的 `_budget_grace_call` 逃生口，所以哪怕模型永不停手地请求工具，智能体也总能终止。",
    "code_snippets": [
      {
        "caption": "循环头：真正的退出条件都在这一行",
        "file": "agent/conversation_loop.py",
        "lines": "461-486",
        "code": "while (api_call_count < agent.max_iterations and agent.iteration_budget.remaining > 0) or agent._budget_grace_call:\n        # Reset per-turn checkpoint dedup so each iteration can take one snapshot\n        agent._checkpoint_mgr.new_turn()\n\n        # Check for interrupt request (e.g., user sent new message)\n        if agent._interrupt_requested:\n            interrupted = True\n            _turn_exit_reason = \"interrupted_by_user\"\n            if not agent.quiet_mode:\n                agent._safe_print(\"\\n⚡ Breaking out of tool loop due to interrupt...\")\n            break\n        \n        api_call_count += 1\n        agent._api_call_count = api_call_count\n        agent._touch_activity(f\"starting API call #{api_call_count}\")\n\n        # Grace call: the budget is exhausted but we gave the model one\n        # more chance.  Consume the grace flag so the loop exits after\n        # this iteration regardless of outcome.\n        if agent._budget_grace_call:\n            agent._budget_grace_call = False\n        elif not agent.iteration_budget.consume():\n            _turn_exit_reason = \"budget_exhausted\"\n            ...\n            break",
        "explanation": "只要迭代计数和预算两道上限都还有余量，循环就继续——除非已经备好一次性的 grace call。每轮开头第一件事就是响应中断（用户发来新消息），随后才递增调用计数、扣掉一个预算单位。max_iterations、iteration_budget、`_interrupt_requested` 这三道检查，才是真正的终止保证，而不只是顺利路径上那个“无工具调用即退出”。"
      },
      {
        "caption": "有工具调用时：先追加本轮 assistant 消息，执行工具，结果落进 messages",
        "file": "agent/conversation_loop.py",
        "lines": "3499-3501,3716-3731,3827-3828",
        "code": "            # Check for tool calls\n            if assistant_message.tool_calls:\n                if not agent.quiet_mode:\n                    agent._vprint(f\"{agent.log_prefix}🔧 Processing {len(assistant_message.tool_calls)} tool call(s)...\")\n                ...\n                messages.append(assistant_msg)\n                agent._emit_interim_assistant_message(assistant_msg)\n                ...\n                agent._execute_tool_calls(assistant_message, messages, effective_task_id, api_call_count)\n                ...\n                # Continue loop for next response\n                continue",
        "explanation": "这是 ReAct 里“行动（act）”的那一半。模型返回 tool_calls 时，先追加 assistant 消息，再由 `_execute_tool_calls` 逐个执行工具，并把一条 `{\"role\": \"tool\", ...}` 结果追加进同一个 `messages`，随后 `continue` 让循环带着新结果回到模型面前。模型要到下一次 API 调用才看得到工具输出——这趟往返正是整个循环存在的意义。"
      },
      {
        "caption": "没有工具调用：这就是最终回复——跳出循环",
        "file": "agent/conversation_loop.py",
        "lines": "3830-3832,4140-4164",
        "code": "            else:\n                # No tool calls - this is the final response\n                final_response = assistant_message.content or \"\"\n                ...\n                final_response = agent._strip_think_blocks(final_response).strip()\n                \n                final_msg = agent._build_assistant_message(assistant_message, finish_reason)\n                ...\n                messages.append(final_msg)\n                \n                _turn_exit_reason = f\"text_response(finish_reason={finish_reason})\"\n                if not agent.quiet_mode:\n                    agent._safe_print(f\"🎉 Conversation completed after {api_call_count} OpenAI-compatible API call(s)\")\n                break",
        "explanation": "这是“推理（reason）”的那一半，也是自然的终点：当模型只回内容、没有 tool_calls 时，这段内容就成为 `final_response`，assistant 消息被追加进持久对话记录，循环随即 `break`。这是顺利路径上唯一的出口——其余出口（预算耗尽、中断、报错、护栏停机）都属于安全退出。"
      },
      {
        "caption": "为循环守卫兜底的迭代预算",
        "file": "agent/iteration_budget.py",
        "lines": "37-43,56-59",
        "code": "    def consume(self) -> bool:\n        \"\"\"Try to consume one iteration.  Returns True if allowed.\"\"\"\n        with self._lock:\n            if self._used >= self.max_total:\n                return False\n            self._used += 1\n            return True\n\n    @property\n    def remaining(self) -> int:\n        with self._lock:\n            return max(0, self.max_total - self._used)",
        "explanation": "循环头里的 `iteration_budget.remaining > 0` 和循环体内的 `iteration_budget.consume()`，背后都是这个线程安全的计数器（父智能体默认上限 90）。它之所以独立于 `api_call_count`，是因为迭代可以被退还——例如 `execute_code` 这类程序化工具调用就会退还、不占预算——所以预算才是权威的开销上限，`max_iterations` 则是一道硬天花板。"
      }
    ],
    "gotchas": [
      "这个循环的退出口不止一个。AGENTS.md 伪代码里写的“无工具调用 → 返回”只是顺利路径。真实的出口还有：`_interrupt_requested`（用户发来新消息）、`iteration_budget.consume()` 返回 False（budget_exhausted）、api_call_count 触顶 max_iterations、某个工具护栏停机（line 3733）、临近最大迭代时报错（line 4215），以及空响应耗尽（line 4098）。每一处都会写入 `_turn_exit_reason` 以便诊断。",
      "`api_call_count` 和 `iteration_budget` 是两个不同的计数器。前者只增不减，是硬天花板；后者可以退还（例如 line 3773-3774，仅含 execute_code 的轮次会调用 iteration_budget.refund()），所以一个会话实际能做的有用步骤，往往比原始计数看上去更多。",
      "`_budget_grace_call` 允许循环在预算耗尽后恰好再多跑一轮，随后这个标志立即被消耗（lines 480-481），保证循环不会沿 grace 路径无限跑下去。",
      "prompt 缓存的安全性是结构性的：每轮循环都新建一份 `api_messages` 副本，临时上下文（记忆召回、插件提示）只注入到这份副本的用户消息里——绝不写进被持久化的 `messages`，也绝不写进系统提示（lines 651-670）。中途改动系统提示会让缓存前缀失效，AGENTS.md 明确把这列为禁止项。",
      "工具结果会被追加进模型下一轮看到的**同一个** `messages`；`_execute_tool_calls`（经 agent/tool_executor.py 分派）负责为每个 tool_call_id 追加一条 role:'tool' 消息。一旦某个 tool_call_id 没有对应结果，API 会拒掉下一次请求——外层的 except 处理器（lines 4184-4206）会为所有未回应的 tool_call_id 回填错误结果，以维持角色交替的合法性。",
      "在这份检出代码里，循环用 `agent._execute_tool_calls` 引用执行器方法（line 3731），但它在 run_agent.py 和 agent/tool_executor.py 里似乎被改名成了 `ln` / `ln_sequential` / `ln_concurrent`（像是做过源码匿名化）。其分派行为——执行工具、追加 role:'tool' 结果——并无变化。",
      "模型调用和“有无工具调用”分支之间那段代码很长（输入清洗、截断/长度恢复、空响应重试、回退到备用 provider），但没有一行属于最小 ReAct 骨架——它们全是叠加在上面的加固层。教学用的骨架就这么点：调用 → 有 tool_calls？执行 + 追加 + continue；否则 break。"
    ],
    "connects_to": [
      "工具分派与执行（agent/tool_executor.py — _execute_tool_calls / ln_sequential / ln_concurrent）：每个 tool_call 如何变成一条追加进 messages 的 role:'tool' 结果",
      "IterationBudget 与子智能体委派（agent/iteration_budget.py）：每个智能体各自的预算、对 execute_code 的退还，以及子智能体独立的上限",
      "prompt 缓存（apply_anthropic_cache_control，系统提示每会话只构建一次的不变量）：为什么临时上下文要进入每次调用的 api_messages 副本，而不是 messages",
      "中断与 /steer 处理（_interrupt_requested、_drain_pending_steer，lines 466、534）：让用户在循环中途重新引导智能体",
      "上下文压缩（context_compressor.should_compress，line 3812）：“绝不改动历史上下文”这条规则唯一被认可的例外",
      "对话轮次收尾（agent/turn_finalizer.finalize_turn，line 4226）：循环 break 之后，组装并返回结果字典"
    ]
  },
  {
    "id": "tools-registry",
    "title": "工具与调度注册表",
    "phase": "第一部分 · 地基",
    "one_line": "Hermes 用一个能自注册的工具注册表，取代了朴素 ReAct 循环里手写的 if/elif 工具分派——注册表在导入时自动发现工具、收集它们的 schema，并让每一次调用都走同一道窄接缝来分发，统一返回一个 JSON 字符串。",
    "problem": "在极简的 ReAct 循环里，每个工具都得手工接线：维护一份 schema 列表，还要让它和 `if name == \"web_search\": ... elif name == \"read_file\": ...` 这样的分派器保持同步。每加一个工具，都要改两处会逐渐走样的地方；中央分派器会膨胀成上千行的瓶颈，还会急切地把每个工具的依赖一并导入；而且没有一个统一的地方做参数强转、错误包装、可用性检查或挂接 hook。更糟的是，模型还会看到那些其实根本跑不起来的工具（缺 API key、toolset 被禁），于是幻觉式地去调用它们。",
    "design_decision": "Hermes 把控制权反转了过来：每个工具文件在导入时调用 `registry.register(name, toolset, schema, handler, check_fn, ...)`，而 `model_tools.py` 除了触发发现（`discover_builtin_tools()` 会导入每一个 `tools/*.py`，导入的副作用就完成了注册）并暴露一层薄薄的公共 API 之外，什么也不做。这正是原则 2——核心是一根窄腰。`model_tools.get_tool_definitions()` 和 `handle_function_call()` 是每个调用方（run_agent、cli、batch_runner、RL 环境）都要穿过的两道接缝；所有能力都住在边缘的工具文件和注册表里。注册表之所以胜过巨大的 if/elif：schema 和 handler 并置在同一个文件里，分派是 O(1) 的字典查找而非越来越长的分支阶梯，且新增一个工具不必动任何中央分派器。这个设计同样守护原则 1（prompt 缓存神圣不可侵犯）：`get_tool_definitions(quiet_mode=True)` 被记忆化，只在注册表的 `_generation` 计数器变动时才失效，因此预置在 prompt 最前面的那段工具 schema 在多轮之间是字节级稳定的，每个会话的缓存前缀绝不会被悄悄扰动。而“返回 JSON 字符串”这条契约（每个 handler 都返回字符串，任何错误都被包进 `json.dumps({\"error\": ...})`）让对话消息的形状保持统一，于是循环永远不必为某个抛了异常的工具做特殊处理。",
    "code_snippets": [
      {
        "caption": "发现即导入副作用：工具模块一被导入，registry.register() 就运行了",
        "file": "model_tools.py",
        "lines": "32,176-181",
        "code": "from tools.registry import discover_builtin_tools, registry\n\n# =============================================================================\n# Tool Discovery  (importing each module triggers its registry.register calls)\n# =============================================================================\n\ndiscover_builtin_tools()",
        "explanation": "model_tools.py 在自己的 docstring 里被称为“工具注册表之上的一层薄编排”。调用 discover_builtin_tools() 会导入每一个 tools/*.py；每个文件顶层那句 registry.register(...) 就是填充注册表的副作用。这里没有需要手工维护的 import 列表——新建一个文件，它就被注册进来了。"
      },
      {
        "caption": "收集 schema：向注册表索取定义，并按 check_fn 的可用性过滤",
        "file": "model_tools.py",
        "lines": "413-420",
        "code": "    # Ask the registry for schemas (only returns tools whose check_fn passes)\n    filtered_tools = registry.get_definitions(tools_to_include, quiet=quiet_mode)\n\n    # The set of tool names that actually passed check_fn filtering.\n    # Use this (not tools_to_include) for any downstream schema that references\n    # other tools by name — otherwise the model sees tools mentioned in\n    # descriptions that don't actually exist, and hallucinates calls to them.\n    available_tool_names = {t[\"function\"][\"name\"] for t in filtered_tools}",
        "explanation": "get_tool_definitions 先把请求的若干 toolset 解析成一组工具名，再向注册表索取 OpenAI 格式的 schema——但只返回那些 check_fn 通过的工具（API key 在、daemon 可达，等等）。这正是模型永远看不到一个它其实调不动的工具的原因，否则就会引发幻觉式调用。"
      },
      {
        "caption": "唯一的分派接缝：每次调用都路由到 registry.dispatch，并由中间件包裹",
        "file": "model_tools.py",
        "lines": "1120-1126",
        "code": "            else:\n                def _dispatch(next_args: Dict[str, Any]) -> Any:\n                    return registry.dispatch(\n                        function_name, next_args,\n                        task_id=task_id,\n                        user_task=user_task,\n                    )",
        "explanation": "handle_function_call 不为每个工具分一个支路，而是只做一次 registry.dispatch(function_name, args, ...)——对已注册 handler 的一次 O(1) 查找。这次 dispatch 被包进 _dispatch，于是工具执行中间件（护栏、插件、延迟计时）能统一地环绕每一个工具运行。"
      },
      {
        "caption": "返回 JSON 字符串的契约：handler 抛出的异常被转成包装好的 JSON 错误",
        "file": "model_tools.py",
        "lines": "1195-1200",
        "code": "        return result\n\n    except Exception as e:\n        error_msg = f\"Error executing {function_name}: {str(e)}\"\n        logger.exception(error_msg)\n        return json.dumps({\"error\": _sanitize_tool_error(error_msg)}, ensure_ascii=False)",
        "explanation": "handle_function_call 始终返回字符串。抛异常的 handler 会被捕获并转成 json.dumps({\"error\": ...})，而不是把异常往外抛，这样无论结果如何，agent 循环都能追加一条格式良好的工具结果消息。AGENTS.md 把这条规则写得很直白：“All handlers MUST return a JSON string.”"
      }
    ],
    "gotchas": [
      "自动发现会注册一个工具的 schema，但在它的名字出现在某个 toolset（toolsets.py / _HERMES_CORE_TOOLS）之前，这个工具并不会暴露给 agent。写好 tools/foo.py 只完成了一半；把它接进某个 toolset 是一个刻意、独立的手工步骤（AGENTS.md “Adding New Tools”，第 534-536 行）。",
      "get_tool_definitions 的记忆化只在 quiet_mode=True 时生效，因为 quiet_mode=False 带有 stdout 副作用（那些 “✅ Enabled toolset” 的打印）。每轮的热点调用方总是传 quiet_mode=True，好让那段被缓存、字节级稳定的 schema 去保护 prompt 缓存。",
      "缓存失效是隐式的：缓存键里含 registry._generation，它会在 register()/deregister()/register_toolset_alias() 时自增。check_fn 的结果在更下一层做了 TTL 缓存（30s），这样环境漂移（Docker 起停、环境变量变化）无需显式的失效 hook 就能被感知到。",
      "有些 schema 是动态的、要在过滤之后才重建——execute_code 的 schema 会被重新生成，只列出那些真正通过了 check_fn 的 sandbox 工具（model_tools.py 426-433）；discord 的 schema 则按 bot 的 privileged intents 重建。必须使用过滤后的名字集合，而不是最初请求的那一份。",
      "并发是按批决定的，由 _should_parallelize_tool_batch（tool_dispatch_helpers.py:103）裁定：批量为 1 的保持顺序执行；批次里只要有任何一个工具属于 _NEVER_PARALLEL_TOOLS（{'clarify'}）就强制顺序执行；只有都在 _PARALLEL_SAFE_TOOLS（只读）里、或都在 _PATH_SCOPED_TOOLS 里且路径互不重叠的工具，才可以共享线程池。其余一切默认顺序执行——也就是更安全的那条路。",
      "并发调度要求每个 worker 线程都有一个长期存活的事件循环（model_tools.py 里的 _get_worker_loop）。每次调用都用朴素的 asyncio.run() 会关掉事件循环，被缓存的 httpx/AsyncOpenAI 客户端随后会在 GC 时抛出 'Event loop is closed'。这是工具 handler 里 sync→async 桥接的唯一权威来源。",
      "tool_search/tool_call 这道桥接在分派之前（model_tools.py 961-995 以及 tool_executor.py 281-314）就会被解包成真正的底层工具，于是每一个 pre/post hook、护栏以及 transcript 看到的都是真实工具名，而不是这道桥接——并且带一道 session 作用域闸门，让一个受限 session 无法借这道桥触到作用域之外的工具。",
      "tools/registry.py 和 toolsets.py 在本次 checkout 中不存在（被单独打包）。注册表的内部实现（register、get_definitions、dispatch、_generation、check_fn 的 TTL 缓存）从 model_tools.py 被引用，并在 AGENTS.md 的 “File Dependency Chain”（第 289 行）和 “Adding New Tools”（第 498 行）里有记载，但在这里读不到。"
    ],
    "connects_to": [
      "run_agent.py 里的 agent 循环（run_conversation）：它调用 _execute_tool_calls，并通过 _should_parallelize_tool_batch 决定并发还是顺序",
      "prompt 缓存 / 系统提示组装——get_tool_definitions(quiet_mode=True) 是被记忆化、字节级稳定、预置在每个请求最前面的那段工具块",
      "插件系统（hermes_cli/plugins 的 discover_plugins）和 MCP 工具发现：它们都走同一条注册表路径来注册工具",
      "工具执行中间件与护栏（hermes_cli.middleware.run_tool_execution_middleware），以及环绕每一次分派的 pre/post_tool_call + transform_tool_result hook",
      "Toolset / session 作用域——enabled_toolsets / disabled_toolsets 按 session 过滤注册表里的工具集合，并界定 Tool Search 桥接目录的作用域",
      "子智能体委派（delegate_task）与 Tool Search 桥接（tool_search/tool_describe/tool_call）：二者都会重新经由 handle_function_call 路由"
    ]
  },
  {
    "id": "toolsets-narrowwaist",
    "title": "Toolset 与窄腰原则",
    "phase": "第一部分 · 地基",
    "one_line": "Toolset 决定每个平台或 agent 能看到哪些工具，于是即便产品在边缘不断长出数十种能力，模型每次调用携带的工具 schema 依然精简。",
    "problem": "在朴素的 ReAct 循环里，你写的每一个工具都会在每一次 API 调用时原封不动地交给模型。加一个 Discord 管理工具、一个 Spotify 工具、一个 Home Assistant 工具，再加二十个 MCP 服务器，那么一次简单的 CLI 聊天，现在每轮都要携带上百个它永远用不到的工具 schema——为它们全部支付输入 token，还让模型淹没在一堆它可能误触的无关选项里。更糟的是，如果你想靠在对话中途替换工具列表来解决，又会让 prompt 缓存失效，把用户成本成倍放大。没有一个门控层，“产品变大”和“每次对话都变得更贵更笨”就成了同一件事。",
    "design_decision": "Hermes 把模型的工具 schema 当作一根窄腰（原则 2）：每个核心工具都要在每一次 API 调用上付费，所以往核心面里加东西的门槛被刻意设得很高，能力则被推向边缘。Toolset 就是那个门控机制——每个平台适配器或 agent 选定一组启用/禁用集合，get_tool_definitions 只把这些工具名解析成 schema，于是一次 Telegram 聊天永远不会携带 Discord 管理工具的 schema。窄腰阶梯把这套理念落成一套决策流程：选能解决问题的最高（占用最小）那一级——扩展现有代码 > CLI 命令 + 技能 > 由服务门控的工具（check_fn）> 插件 > 目录里的 MCP 服务器 > 新增核心工具。关键在于，一次对话的 toolset 集合在其整个生命周期里是固定的：AGENTS.md 把“在对话中途更改 toolset”列为禁止的破缓存行为，因为解析出的工具列表是被缓存请求前缀的一部分（原则 1：每会话的 prompt 缓存神圣不可侵犯）。所以 toolset 在 agent 构造时静态门控，而不是每轮动态调整——能力住在边缘，但对任何一次具体对话而言，窄腰只决定一次、并保持恒定。",
    "code_snippets": [
      {
        "caption": "把启用的 toolset 解析成要暴露的具体工具名集合",
        "file": "model_tools.py",
        "lines": "360-386",
        "code": "    if enabled_toolsets is not None:\n        effective_enabled_toolsets = list(enabled_toolsets)\n        if os.environ.get(\"HERMES_KANBAN_TASK\") and \"kanban\" not in effective_enabled_toolsets:\n            # Dispatcher-spawned workers are scoped by HERMES_KANBAN_TASK and\n            # must always receive the lifecycle handoff tools. ...\n            effective_enabled_toolsets.append(\"kanban\")\n        for toolset_name in effective_enabled_toolsets:\n            if validate_toolset(toolset_name):\n                resolved = resolve_toolset(toolset_name)\n                tools_to_include.update(resolved)\n                ...\n            elif toolset_name in _LEGACY_TOOLSET_MAP:\n                legacy_tools = _LEGACY_TOOLSET_MAP[toolset_name]\n                tools_to_include.update(legacy_tools)\n                ...\n    else:\n        # Default: start with everything\n        from toolsets import get_all_toolsets\n        for ts_name in get_all_toolsets():\n            tools_to_include.update(resolve_toolset(ts_name))",
        "explanation": "这就是门控的核心：调用方传入 enabled_toolsets，每个名字都被校验并展开（resolve_toolset）成它包含的具体工具名，只有这些名字会累积进 tools_to_include。一个只请求 'messaging' 的平台，永远不会累积 Discord 管理或 Spotify 的 schema，因此在该平台的调用上，它们的 token 开销为零。"
      },
      {
        "caption": "禁用的 toolset 在最后做减法，所以哪怕组合 bundle 里的工具也会被剔除",
        "file": "model_tools.py",
        "lines": "388-403",
        "code": "    # Always apply disabled toolsets as a subtraction step at the end.\n    # This ensures that even if a composite toolset (like hermes-cli)\n    # is enabled, any tools belonging to a disabled toolset are strictly\n    # stripped out. See issue #17309.\n    if disabled_toolsets:\n        for toolset_name in disabled_toolsets:\n            if validate_toolset(toolset_name):\n                resolved = resolve_toolset(toolset_name)\n                tools_to_include.difference_update(resolved)\n                ...\n            elif toolset_name in _LEGACY_TOOLSET_MAP:\n                legacy_tools = _LEGACY_TOOLSET_MAP[toolset_name]\n                tools_to_include.difference_update(legacy_tools)",
        "explanation": "启用做加法，禁用做减法，而减法在最后无条件执行。这种顺序意味着：用户可以启用一个宽泛的组合 toolset，却仍然硬性排除某个工具（例如禁用 'terminal'）；禁用永远胜出——这正是门控所需的那种可预测的安全性。"
      },
      {
        "caption": "解析出的工具列表被记忆化，且核心工具永不被推迟",
        "file": "model_tools.py",
        "lines": "506-511",
        "code": "    # ── Tool Search (progressive disclosure) ────────────────────\n    # Conditionally replace MCP + plugin (non-core) tools with three bridge\n    # tools (tool_search / tool_describe / tool_call) when the deferrable\n    # surface exceeds the configured threshold (default 10% of context\n    # window). Core Hermes tools (toolsets._HERMES_CORE_TOOLS) are NEVER\n    # deferred. See tools/tool_search.py for full design notes.",
        "explanation": "即便经过门控，如果剩下的 MCP/插件面仍然很大，Hermes 也会把它们折叠到三个桥接工具之后，而不是把所有 schema 都发出去——这是对窄腰的第二次收窄。“核心工具永不被推迟”这条不变量直接编码了该原则：窄腰（核心）始终在场，只有边缘能力才按需变得可被发现。"
      },
      {
        "caption": "Legacy toolset 别名把旧名字映射到当前的工具名列表",
        "file": "model_tools.py",
        "lines": "220-236",
        "code": "_LEGACY_TOOLSET_MAP = {\n    \"web_tools\": [\"web_search\", \"web_extract\"],\n    \"terminal_tools\": [\"terminal\"],\n    \"vision_tools\": [\"vision_analyze\"],\n    \"moa_tools\": [\"mixture_of_agents\"],\n    \"image_tools\": [\"image_generate\"],\n    \"skills_tools\": [\"skills_list\", \"skill_view\", \"skill_manage\"],\n    \"browser_tools\": [\n        \"browser_navigate\", \"browser_snapshot\", \"browser_click\",\n        \"browser_type\", \"browser_scroll\", \"browser_back\",\n        \"browser_press\", \"browser_get_images\",\n        \"browser_vision\", \"browser_console\"\n    ],\n    \"cronjob_tools\": [\"cronjob\"],\n    \"file_tools\": [\"read_file\", \"write_file\", \"patch\", \"search_files\"],\n    \"tts_tools\": [\"tts\"],\n}",
        "explanation": "Toolset 是架在工具名之上的一层寻址，而这张映射表在规范的 toolset 键不断演进时，让旧的配置名字仍然可用。它说明了一个 'toolset' 不过是一组工具名的具名 bundle——门控层解析的是名字，从不直接碰工具实现。"
      }
    ],
    "gotchas": [
      "toolsets.py 在整个文件里被反复引用（model_tools.py 第 33 行：`from toolsets import resolve_toolset, validate_toolset`，外加 get_all_toolsets 和 _HERMES_CORE_TOOLS），但该文件在本次 checkout 中缺失。TOOLSETS 字典、_HERMES_CORE_TOOLS、resolve_toolset、validate_toolset、get_all_toolsets 都读不到逐字源码；它们的行为是据 AGENTS.md（第 222-223、534-536、935-950 行）以及 model_tools.py 调用它们的方式推断的。",
      "在对话中途更改 toolset 是被禁止的破缓存行为。AGENTS.md（第 1102-1107 行）把“对话中途改 toolset”与改写过去的上下文、重建系统提示并列，都列为会让每次对话的缓存失效、成倍放大开销的行为。toolset 的选择在 agent 构造时一次性敲定（run_agent.py 把 enabled_toolsets/disabled_toolsets 传给 AIAgent），而不是每轮决定。",
      "自动发现会注册一个工具的 schema，但并不暴露它。AGENTS.md（第 534-536 行）：任何带顶层 registry.register() 的 tools/*.py 都会被自动导入，但只有当工具名出现在某个 toolset 里时，agent 才触达得到。接进某个 toolset 是一个刻意为之的手工步骤——_HERMES_CORE_TOOLS 是默认 bundle，不是死代码。",
      "工具 schema 的描述不得提及其他 toolset 里的工具（AGENTS.md 第 1204-1205 行）。一段写“优先使用 web_search”的描述，会在 web_search 被门控排除时失效——模型会幻觉式地调用一个并不存在的工具。交叉引用是在 get_tool_definitions 里动态加上的（见 model_tools.py 第 426-482 行对 browser_navigate 和 execute_code 的后处理），依据是真正通过过滤的工具。",
      "记忆化缓存（_tool_defs_cache，上限 8 项，model_tools.py 第 254-262 行）命中时返回一个浅拷贝（第 328 行），这样下游在向 self.tools 追加 memory/LCM schema 时不会污染共享缓存——这一点很重要，因为某些提供方（DeepSeek、小米 MiMo、Moonshot Kimi）会以 HTTP 400 拒绝重复的工具名（issue #17335）。",
      "dispatcher 会为 worker agent 强制加上 'kanban' toolset（第 362-368 行），即便某个 assignee 的配置限制了它的聊天 toolset——生命周期交接（complete/block/heartbeat）这一面必须在由成本驱动的 toolset 收窄中幸存下来。"
    ],
    "connects_to": [
      "prompt 缓存不变量（原则 1）——toolset 是被缓存请求前缀的一部分，因此在一次对话的生命周期内固定不变",
      "委派 / 子智能体——delegate_task 接受一个 toolsets 参数，叶子角色会被剥掉 delegate_task/clarify/memory/send_message/execute_code，从而逐个子节点门控能力",
      "Tool Search 渐进式披露（tools/tool_search.py）——第二次收窄，在永不推迟核心工具的前提下，把 MCP/插件工具推到桥接工具之后",
      "插件与 MCP 目录——窄腰阶梯上的那些级别，大多数新能力都落在这里，而不是落进核心 toolset",
      "由服务通过 check_fn 门控的工具（registry.get_definitions）——只有在某个前置条件已配置时才出现的工具，例如以 token 门控的 Home Assistant",
      "gateway/platforms/ 下的平台适配器——各自挑一个基础 toolset（例如 Telegram 用 'messaging'）"
    ]
  },
  {
    "id": "budget-interrupt",
    "title": "迭代预算与中断",
    "phase": "第二部分 · 给循环加边界",
    "one_line": "一个线程安全的迭代预算，限制一次运行（及其子智能体）最多能用多少轮 LLM 对话；与此同时，一个中断标志让用户能介入正在干活的循环、把它重新引导——两者都不触碰被缓存的 prompt 前缀。",
    "problem": "朴素的 ReAct 循环就是一个 `while True:`——调用模型、跑工具、不断重复。没有任何上界，一个在失败工具上反复打转、或追逐一个根本达不成的目标的模型，就会一直烧 token、烧钱，直到外部因素把它杀掉。一个裸的 `for i in range(max_iterations)` 整型计数器虽然能挡住失控，却很脆弱：它没法在并发跑子智能体的多个线程间安全共享，没有“这一轮很廉价、别计费”的概念，也不会给模型任何预警——循环只是在某个思考过程中途戛然而止，连最终答案都没给。\n\n另外，一旦循环跑起来，用户就没办法说“停，改做这个”，除非杀掉整个进程、丢掉整段对话。",
    "design_decision": "Hermes 出于三个原因，把“能跑多少轮”拆成了一个独立对象（`IterationBudget`），而不是循环里的一个内联计数器。（1）线程安全：子智能体委派会在 ThreadPoolExecutor 的工作线程上跑子智能体，所以这个计数器由一个 `threading.Lock` 保护，并暴露原子的 `consume()`/`refund()`。（2）可退还：`execute_code` 轮次是廉价的、RPC 风格的程序化工具调用，所以它们会被退还、不消耗预算——预算计量的是昂贵的模型推理轮次，而非这类记账性开销。（3）宽限调用（grace call）：当预算耗尽时，循环被允许恰好再多跑一个 API 轮次（`_budget_grace_call`），好让模型给出一个最终文本答案，而不是在工具调用中途被切断。\n\n预算和中断都被刻意设计成循环控制状态，而绝非 prompt 状态：停止或重新引导循环，永远不会改写过去的消息、也不会替换 toolset，因此每段对话的 prompt 缓存（原则 1，神圣不可侵犯）始终完好——一次中断的处理方式是跳出循环并持久化 session，而不是去动被缓存的前缀。这也正是原则 2：预算/中断机制是核心循环里一个薄薄的窄腰控制面；真正的能力（子智能体、execute_code、遵守中断的 terminal 命令）都住在边缘，只需遵守这套契约即可。",
    "code_snippets": [
      {
        "caption": "整个预算：一个带锁保护、支持 consume/refund 的计数器",
        "file": "agent/iteration_budget.py",
        "lines": "32-49",
        "code": "    def __init__(self, max_total: int):\n        self.max_total = max_total\n        self._used = 0\n        self._lock = threading.Lock()\n\n    def consume(self) -> bool:\n        \"\"\"Try to consume one iteration.  Returns True if allowed.\"\"\"\n        with self._lock:\n            if self._used >= self.max_total:\n                return False\n            self._used += 1\n            return True\n\n    def refund(self) -> None:\n        \"\"\"Give back one iteration (e.g. for execute_code turns).\"\"\"\n        with self._lock:\n            if self._used > 0:\n                self._used -= 1",
        "explanation": "整个抽象就这么点东西：一个 `max_total` 上限、一个 `_used` 计数，外加一个 `threading.Lock`，让并发的子智能体线程没法把它弄坏。`consume()` 是闸门（耗尽时返回 False），`refund()` 是它的逆操作。把它做成一个对象、而不是循环里的一个 `int`，正是让这个计数能在父子智能体间共享、被子智能体继承、并为廉价轮次退还的关键。"
      },
      {
        "caption": "循环条件：预算 AND max_iterations，OR 宽限调用",
        "file": "agent/conversation_loop.py",
        "lines": "461-486",
        "code": "    while (api_call_count < agent.max_iterations and agent.iteration_budget.remaining > 0) or agent._budget_grace_call:\n        # Reset per-turn checkpoint dedup so each iteration can take one snapshot\n        agent._checkpoint_mgr.new_turn()\n\n        # Check for interrupt request (e.g., user sent new message)\n        if agent._interrupt_requested:\n            interrupted = True\n            _turn_exit_reason = \"interrupted_by_user\"\n            if not agent.quiet_mode:\n                agent._safe_print(\"\\n⚡ Breaking out of tool loop due to interrupt...\")\n            break\n        \n        api_call_count += 1\n        agent._api_call_count = api_call_count\n        agent._touch_activity(f\"starting API call #{api_call_count}\")\n\n        # Grace call: the budget is exhausted but we gave the model one\n        # more chance.  Consume the grace flag so the loop exits after\n        # this iteration regardless of outcome.\n        if agent._budget_grace_call:\n            agent._budget_grace_call = False\n        elif not agent.iteration_budget.consume():\n            _turn_exit_reason = \"budget_exhausted\"\n            if not agent.quiet_mode:\n                agent._safe_print(f\"\\n⚠️  Iteration budget exhausted ({agent.iteration_budget.used}/{agent.iteration_budget.max_total} iterations used)\")\n            break",
        "explanation": "只要预算还有余量，或者还有一个宽限调用待执行，循环就继续。每一轮先查 `_interrupt_requested`，若用户做了重新引导就干净利落地跳出。然后，如果 `_budget_grace_call` 被置位，它消耗掉这个标志（一次免费的最终轮），而不是扣预算；否则就调用 `consume()`，返回 False 即预算花光，循环以 `budget_exhausted` 退出。"
      },
      {
        "caption": "当本轮唯一调用的工具是 execute_code 时，退还该轮",
        "file": "agent/conversation_loop.py",
        "lines": "3769-3774",
        "code": "                # Refund the iteration if the ONLY tool(s) called were\n                # execute_code (programmatic tool calling).  These are\n                # cheap RPC-style calls that shouldn't eat the budget.\n                _tc_names = {tc.function.name for tc in assistant_message.tool_calls}\n                if _tc_names == {\"execute_code\"}:\n                    agent.iteration_budget.refund()",
        "explanation": "当某一轮的工具调用恰好只有 `{execute_code}`、别无其他时，这一迭代会被退还。`execute_code` 让模型可以在一次程序化调用里批量执行许多操作，所以向它收一整轮推理的“费”，对这条高效路径并不公平。这里的集合比较是严格的——把 execute_code 和别的工具混在一起的那一轮不会被退还。"
      },
      {
        "caption": "interrupt()：置位标志，再向工具和子智能体扇出",
        "file": "run_agent.py",
        "lines": "2302-2308",
        "code": "        self._interrupt_requested = True\n        self._interrupt_message = message\n        # Signal all tools to abort any in-flight operations immediately.\n        # Scope the interrupt to this agent's execution thread so other\n        # agents running in the same process (gateway) are not affected.\n        if self._execution_thread_id is not None:\n            _set_interrupt(True, self._execution_thread_id)\n            self._interrupt_thread_signal_pending = False",
        "explanation": "`interrupt()` 是在循环运行期间、由另一个线程（输入处理器、收到的消息）调用的。它置位 `_interrupt_requested`（循环每轮开头都会查）和 `_interrupt_message`（重新引导的文本），再通过一个线程级作用域的 `_set_interrupt` 向正在执行的工具发中止信号。这种作用域限定在 gateway 场景里很关键——那里许多智能体共享一个进程：中断只针对当前这个智能体的执行线程，并会进一步传播到并发的工具 worker 和子智能体（见 2325-2342 行）。"
      }
    ],
    "gotchas": [
      "预算对象是每个顶层对话轮次重新创建的：agent/turn_context.py:164 在每个用户轮次开始时执行 `agent.iteration_budget = IterationBudget(agent.max_iterations)`，而 agent/agent_init.py:280 只在构造时建一次。所以这个上限会随每条用户消息重置——预算限定的是单个轮次的工具循环，而不是整段对话的全生命周期。",
      "子智能体拿到的是各自独立的预算，而不是共享池。iteration_budget.py 的 docstring（20-26 行）指出：父智能体被限制在 max_iterations（默认 90），每个子智能体被限制在 delegation.max_iterations（默认 50），所以父智能体 + 子智能体的总迭代数，按设计是可以超过父智能体上限的。别假设存在一个全局天花板。",
      "循环同时检查 `api_call_count < agent.max_iterations` AND `iteration_budget.remaining > 0`（461 行）。这是两道不同的上限——按轮计的 api_call_count 和预算对象——任意一道都能让循环停下。宽限调用那个 `or` 子句，是两者都耗尽后还能再跑一轮的唯一途径。",
      "宽限标志是一次性、自我消耗的：把 `_budget_grace_call = True` 置位只买到恰好多一轮，因为 481 行会立刻把它翻回 False。它被初始化为 False（agent_init.py:521）并被重置为 False；它绝不会跨轮保持 True。",
      "退还必须与正确的计数器配对。有若干路径会同时调用 `iteration_budget.refund()` AND 扣减 `api_call_count`（例如 conversation_loop.py:763-766 处理 Ollama 上下文错误、3271-3272 处理压缩重启）。只退预算却不修正 api_call_count，或反过来，都会让这两道上限失去同步。",
      "退避期间的中断处理是轮询式、而非抢占式的：重试等待循环（conversation_loop.py:1255 和 3243）以 0.2 秒为步长睡眠，每一拍都查 `_interrupt_requested`，随后调用 `clear_interrupt()` 并返回 `interrupted: True`。如果用一个长长的 `time.sleep(wait_time)`，智能体在整个退避期间都会对中断毫无反应。",
      "clear_interrupt()（run_agent.py:2346）必须同时清掉每线程的工具信号 AND 并发 worker 线程的标志位，否则一个残留的中断可能跨过轮次边界活下来，并在一个被复用 worker tid 上、毫不相干的工具调用上触发（见 2353-2357 行的注释）。"
    ],
    "connects_to": [
      "子智能体委派——每个子智能体都会收到自己的、由 delegation.max_iterations 设上限的 IterationBudget，并且 interrupt() 会传播到活跃的子智能体（run_agent.py:2335-2342）",
      "execute_code / 程序化工具调用——正是这种轮次会被退还，从而让批量的 RPC 风格调用不耗预算",
      "上下文压缩——一次压缩重启会退还该迭代并扣减 api_call_count（conversation_loop.py:3270-3278），让用压缩后的历史重试是免费的；压缩也是 prompt 缓存不可变性唯一获许的例外",
      "并发工具执行——interrupt() 会把中止信号扇出到 ThreadPoolExecutor 的 worker tid，让一个挂起的、执行中的工具能察觉到中断，而不是一直跑到它自己的超时",
      "Session 持久化——中断路径会在返回 interrupted:True 之前调用 _persist_session，所以一次重新引导不会丢失对话状态",
      "Steer（/steer）——clear_interrupt 会丢弃一个待处理的 steer，因为一次硬中断会取代下一轮的注入（run_agent.py:2370-2373）"
    ]
  },
  {
    "id": "prompt-caching",
    "title": "prompt 缓存:神圣的不变量",
    "phase": "第二部分 · 给循环加边界",
    "one_line": "Hermes 在 API 调用时注入至多 4 个 Anthropic cache_control 断点（系统提示 + 最后 3 条消息），并把由此得到的每会话缓存视为不可侵犯——绝不改历史上下文、绝不切 toolset、绝不在对话中途重建系统提示——从而把多轮对话的输入成本削减约 75%。",
    "problem": "朴素的 ReAct 循环会在每一次 API 调用时，把整个不断增长的对话记录——系统提示、工具 schema、之前每一轮——都作为全新的输入 token 重发一遍。到第 20 轮时，你每一步都在为数千个原封不动的上下文 token 重复付费，成本随对话长度呈二次增长。Anthropic 的 prompt 缓存能用约 10% 的输入价格服务那段不变的前缀，但这个缓存是按前缀做键的：只有当某个缓存断点之前的每一个字节都与上次请求逐字节一致时，才会命中。一旦循环改了某条旧消息、重排了工具、或把记忆重新加载进系统提示，前缀就变了，整个缓存随之失效——后续每一轮又得按全价付费。",
    "design_decision": "Hermes 把“每会话 prompt 缓存神圣不可侵犯”定为 AGENTS.md 的第 1 号政策，因为真正主导实际成本的是缓存命中率，而不是 token 数量。它的策略刻意采用一种固定布局——system_and_3——精确放置 4 个 cache_control 断点（这是 API 的上限）：一个放在系统提示上（那段庞大而稳定的前缀），其余三个各放在最后 3 条非系统消息上（这样随着对话推进，最近几轮也能被缓存）。这一切以一个纯函数的形式、只在 API 调用时作用于消息列表的深拷贝（agent/conversation_loop.py），所以存储的历史从不被改动，实时对话记录也始终缓存稳定。由此直接得出那条硬规则：绝不改历史上下文、绝不切 toolset、绝不在对话中途重建系统提示——唯一获许的例外是上下文压缩，它有意承担那一次性的缓存失效代价。这也体现原则 2（窄腰核心，能力在边缘）：缓存契约只存在于一个极小的纯模块里，每一个边缘特性——斜杠命令、技能、记忆——都必须遵从它，而不是伸手进去把它打破。于是有了缓存感知的斜杠命令模式：那些会改变系统提示状态的命令默认采用延迟失效（下个 session 生效），并提供一个可选的 --now 标志，用来显式清空缓存、并承担其成本。",
    "code_snippets": [
      {
        "caption": "system_and_3：在深拷贝上放置至多 4 个断点——系统提示 + 最后 3 条非系统消息",
        "file": "agent/prompt_caching.py",
        "lines": "49-79",
        "code": "def apply_anthropic_cache_control(\n    api_messages: List[Dict[str, Any]],\n    cache_ttl: str = \"5m\",\n    native_anthropic: bool = False,\n) -> List[Dict[str, Any]]:\n    \"\"\"Apply system_and_3 caching strategy to messages for Anthropic models.\n\n    Places up to 4 cache_control breakpoints: system prompt + last 3 non-system\n    messages, all at the same TTL.\n\n    Returns:\n        Deep copy of messages with cache_control breakpoints injected.\n    \"\"\"\n    messages = copy.deepcopy(api_messages)\n    if not messages:\n        return messages\n\n    marker = _build_marker(cache_ttl)\n\n    breakpoints_used = 0\n\n    if messages[0].get(\"role\") == \"system\":\n        _apply_cache_marker(messages[0], marker, native_anthropic=native_anthropic)\n        breakpoints_used += 1\n\n    remaining = 4 - breakpoints_used\n    non_sys = [i for i in range(len(messages)) if messages[i].get(\"role\") != \"system\"]\n    for idx in non_sys[-remaining:]:\n        _apply_cache_marker(messages[idx], marker, native_anthropic=native_anthropic)\n\n    return messages",
        "explanation": "整个策略就是一个作用于 deepcopy 的纯函数——它从不碰存储的历史，因此“施加缓存”这个动作本身就不会破坏缓存。它先占用系统提示这个断点，再把剩余预算花在尾部的非系统消息上，这样随着对话增长，最近几轮也会被缓存。4 个断点的上限是 Anthropic 的硬限制。"
      },
      {
        "caption": "缓存在 API 调用时、系统提示组装之后，作用于每次调用的消息列表",
        "file": "agent/conversation_loop.py",
        "lines": "685-690",
        "code": "        if agent._use_prompt_caching:\n            api_messages = apply_anthropic_cache_control(\n                api_messages,\n                cache_ttl=agent._cache_ttl,\n                native_anthropic=agent._use_native_cache_layout,\n            )",
        "explanation": "这是唯一的接入点：缓存是在请求发出前的那一刻、叠加到即将发出的 api_messages 上的，而不是烘焙进对话状态里。因为它作用于每次调用的副本，存储的对话记录在各轮之间保持完全一致——而这正是让 Anthropic 前缀缓存持续命中的关键。"
      },
      {
        "caption": "缓存感知的斜杠命令：--now 选择立即失效；默认推迟到下个 session",
        "file": "hermes_cli/skills_hub.py",
        "lines": "1725-1735",
        "code": "        # --now invalidates prompt cache immediately (costs more money).\n        # Default: defer to next session to preserve cache.\n        invalidate_cache = \"--now\" in args\n        for i, a in enumerate(args):\n            if a == \"--category\" and i + 1 < len(args):\n                category = args[i + 1]\n            elif a == \"--name\" and i + 1 < len(args):\n                name_override = args[i + 1]\n        do_install(identifier, category=category, force=force,\n                   skip_confirm=skip_confirm, invalidate_cache=invalidate_cache,\n                   name_override=name_override, console=c)",
        "explanation": "安装一个技能会改变系统提示，正常情况下这会在对话中途把缓存击碎。这套规范做法让安全选项成为默认：变更在下个 session 生效，当前缓存得以保留，除非用户传入 --now 强制一次立即（付费）的重建。coding_context.py 把这称作“与 /skills install vs --now 相同的契约”。"
      },
      {
        "caption": "do_install 中的延迟失效与立即失效——只有 --now 才会清空技能的 prompt 缓存",
        "file": "hermes_cli/skills_hub.py",
        "lines": "694-703",
        "code": "    if invalidate_cache:\n        # Invalidate the skills prompt cache so the new skill appears immediately\n        try:\n            from agent.prompt_builder import clear_skills_system_prompt_cache\n            clear_skills_system_prompt_cache(clear_snapshot=True)\n        except Exception:\n            pass\n    else:\n        c.print(\"[dim]Skill will be available in your next session.[/]\")\n        c.print(\"[dim]Use /reset to start a new session now, or --now to activate immediately (invalidates prompt cache).[/]\")",
        "explanation": "这具体展示了两个分支：--now 调用 clear_skills_system_prompt_cache 立即重建系统提示（缓存未命中、成本更高），而默认分支让已缓存的提示保持原样，并告诉用户该变更将在下个 session 生效。打破这条不变量的代价，被明明白白写进了 UI 文案里。"
      }
    ],
    "gotchas": [
      "这 4 个断点是 Anthropic API 的硬上限，不是可调参数。system_and_3 把其中 1 个花在系统提示上、3 个花在最近的非系统消息上；如果没有系统消息，它就把全部 4 个都花在尾部消息上（remaining = 4 - breakpoints_used）。",
      "它作用于 copy.deepcopy(api_messages)，绝不作用于存储的对话。这正是关键：那个启用缓存的函数本身绝不能改动实时状态，否则就会击垮它正要建立的那个缓存。",
      "唯一获许的对话中途上下文修改，是上下文压缩。其余所有特性都必须避免在对话中途改历史上下文、切 toolset，或重载记忆 / 重建系统提示（AGENTS.md 的 “Prompt Caching Must Not Break”）。",
      "native_anthropic 在两种 marker 布局之间做选择。在原生 / 第三方的 Anthropic 线协议端点上（native_anthropic=True），一条工具消息会拿到一个顶层 cache_control；而在 OpenRouter/Nous/Qwen 的 'envelope' 传输上（False），marker 则放在最后一个内层 content 部分上。_anthropic_prompt_cache_policy()（转发给 agent_runtime_helpers.anthropic_prompt_cache_policy）会按 provider/model/base_url 返回 (use_caching, use_native_layout)。",
      "布局标志设错会悄无声息地导致 0% 缓存命中，每一轮都按完整 prompt 重新计费——代码注释对 Nous Portal Qwen 以及 opencode/alibaba 路由明确点了名。",
      "TTL 由配置驱动（prompt_caching.cache_ttl），只接受 '5m' 或 '1h'，默认 '5m'；未知取值回退到 '5m'。1h 档的写入成本是 2 倍、5m 是 1.25 倍，但在那些轮次间停顿超过 5 分钟的长 session 里，它能把成本摊薄。",
      "缓存感知的斜杠命令必须默认采用延迟（下个 session）失效，并提供一个可选的 --now 标志——对任何会改变系统提示状态的命令（技能、工具、记忆）而言，这是一项必需的约定，而非一项优化。",
      "_build_marker 只在 '1h' 时才加 'ttl' 键；5m 的 marker 就是裸的 {'type': 'ephemeral'} 默认值，所以别画蛇添足地加一个显式 '5m' ttl 字段还指望它原样往返。"
    ],
    "connects_to": [
      "上下文压缩——唯一获许改动历史上下文、从而使缓存失效的例外",
      "系统提示组装 / prompt_builder（clear_skills_system_prompt_cache）——什么会被当作稳定前缀缓存，以及技能/记忆的变更如何被推迟以保护它",
      "技能的 install/uninstall/reset 斜杠命令——规范的缓存感知 --now vs 延迟失效模式",
      "Provider 路由与 api_mode 检测（_anthropic_prompt_cache_policy / anthropic_prompt_cache_policy）——决定是否开缓存，以及用哪种 marker 布局（native 还是 envelope）",
      "对话循环——在 API 调用时把 cache_control 叠加到即将发出的消息副本上的那个唯一接入点",
      "窄腰核心原则——缓存契约只存在于一个极小的纯模块里，每一个边缘特性都必须遵从它"
    ]
  },
  {
    "id": "compression",
    "title": "上下文压缩",
    "phase": "第二部分 · 给循环加边界",
    "one_line": "当一段会话的真实 token 数越过“占上下文窗口百分比”的阈值时，Hermes 用一个廉价的辅助模型对中间的若干轮做摘要，同时保护头部和尾部——这是它对自己“prompt 缓存神圣不可侵犯”那条规则唯一一处刻意的例外。",
    "problem": "朴素的 ReAct 循环会把每条用户消息、每次助手轮次、每次工具调用、每份工具结果都追加进同一个不断增长的列表，并在每次迭代时重发整份列表。在足够多次工具密集的轮次之后，这份消息列表就会超出模型的上下文窗口：提供方返回一个 context-length / 413 错误，循环随即卡死——它没法推进，因为每次重试都在重发同一份过大的历史。即便还没撞上硬上限，成本和延迟也会随会话长度线性攀升。总得有某种机制，在不丢掉“用户究竟在做什么”这条主线的前提下，把陈旧的上下文扔掉。",
    "design_decision": "压缩是 Hermes 唯一被允许改写历史上下文的地方。AGENTS.md 说了两遍：“每会话的 prompt 缓存神圣不可侵犯……唯一的例外是上下文压缩”（第 19-23 行），以及“我们唯一一次改动上下文，就是在上下文压缩时”（第 1107 行）。其他任何对话中途的改动（切工具、重载记忆、重建系统提示）都被禁止，因为它们会让缓存前缀失效、令用户成本翻倍。因此压缩被设计得稀少而审慎：只在提供方真实报告的 prompt_tokens 越过阈值时（默认上下文的 50%，并以 MINIMUM_CONTEXT_LENGTH 作为下限兜底）才触发；它会保护一段不可变的头部（系统提示 + 第一轮交互）和一段按 token 预算划定的尾部；并带一个防抖动保护，在两次无效压缩之后退避，从而绝不进入“每轮都压缩”的循环。摘要工作本身被推到窄腰的边缘——交给一个廉价的辅助模型（auxiliary.compression），而不是主模型——这样昂贵的核心调用永远只看到压实之后的结果。压实之后，session 被轮转、系统提示恰好重建一次，把缓存被打断的代价集中在一个事件里一次性付清，而不是分摊到每一轮里慢慢流血。",
    "code_snippets": [
      {
        "caption": "阈值与触发闸门，由真实上下文长度算出",
        "file": "agent/context_compressor.py",
        "lines": "600-644, 744-764",
        "code": "def __init__(\n    self,\n    model: str,\n    threshold_percent: float = 0.50,\n    protect_first_n: int = 3,\n    protect_last_n: int = 20,\n    ...\n):\n    ...\n    # Floor: never compress below MINIMUM_CONTEXT_LENGTH tokens even if\n    # the percentage would suggest a lower value.\n    self.threshold_tokens = max(\n        int(self.context_length * threshold_percent),\n        MINIMUM_CONTEXT_LENGTH,\n    )\n\ndef should_compress(self, prompt_tokens: int = None) -> bool:\n    tokens = prompt_tokens if prompt_tokens is not None else self.last_prompt_tokens\n    if tokens < self.threshold_tokens:\n        return False\n    # Anti-thrashing: back off if recent compressions were ineffective\n    if self._ineffective_compression_count >= 2:\n        ...\n        return False\n    return True",
        "explanation": "触发完全是一次 token 比较：`prompt_tokens` 对比 `threshold_tokens`（模型上下文的 50%，并以 64K 下限兜底）。防抖动计数器才是让压缩保持稀少的关键——在两次各自节省不到 10% 的压缩之后，`should_compress` 返回 False，于是循环无法每轮都触发无意义的空压实。"
      },
      {
        "caption": "对话循环把真实的 prompt_tokens（而非估算值）喂给触发器",
        "file": "agent/conversation_loop.py",
        "lines": "3790-3818",
        "code": "_compressor = agent.context_compressor\nif _compressor.last_prompt_tokens > 0:\n    # Only use prompt_tokens — completion/reasoning\n    # tokens don't consume context window space.\n    _real_tokens = _compressor.last_prompt_tokens\nelif _compressor.last_prompt_tokens == -1:\n    # Compression just ran and no API-reported prompt count\n    # has arrived yet.\n    _real_tokens = 0\nelse:\n    _real_tokens = estimate_request_tokens_rough(\n        messages, tools=agent.tools or None\n    )\n\nif agent.compression_enabled and _compressor.should_compress(_real_tokens):\n    agent._safe_print(\"  ⟳ compacting context…\")\n    messages, active_system_prompt = agent._compress_context(\n        messages, system_message,\n        approx_tokens=agent.context_compressor.last_prompt_tokens,\n        task_id=effective_task_id,\n    )",
        "explanation": "每次助手轮次之后，循环读取提供方权威的 `prompt_tokens` 来决定是否压缩，优先采用真实用量而非粗略估算，这样既不会过早压缩、也不会错过时机。哨兵值 -1 表示“压缩刚跑过、真实计数还没到”，于是它刻意避免在压缩后那个带噪声的估算上重复触发。"
      },
      {
        "caption": "头部与按 token 预算划定的尾部受到保护，只有中间部分被摘要",
        "file": "agent/context_compressor.py",
        "lines": "1966-1991",
        "code": "# Phase 2: Determine boundaries\ncompress_start = self._protect_head_size(messages)\ncompress_start = self._align_boundary_forward(messages, compress_start)\n\n# Use token-budget tail protection instead of fixed message count\ncompress_end = self._find_tail_cut_by_tokens(messages, compress_start)\n\nif compress_start >= compress_end:\n    # No compressable window — the entire transcript fits within\n    # the tail budget (soft_ceiling).\n    self._ineffective_compression_count += 1\n    self._last_compression_savings_pct = 0.0\n    ...\n    return messages\n\nturns_to_summarize = messages[compress_start:compress_end]",
        "explanation": "压缩会保留头部（系统提示 + 前 `protect_first_n` 轮交互——这些是承重的关键上下文）以及一段按 token 预算划定的尾部（最近约 `tail_token_budget` 个 token），只把两者之间那一段切片换成一条摘要消息。关键在于，`_ensure_last_user_message_in_tail`（在 `_find_tail_cut_by_tokens` 内部被调用）保证用户最新的请求绝不会落入被摘要的中间部分——否则当前任务就会凭空消失。"
      },
      {
        "caption": "摘要在廉价的辅助模型上生成，绝不动用主模型",
        "file": "agent/context_compressor.py",
        "lines": "1426-1455",
        "code": "call_kwargs = {\n    \"task\": \"compression\",\n    \"main_runtime\": {\n        \"model\": self.model,\n        \"provider\": self.provider,\n        ...\n    },\n    \"messages\": [{\"role\": \"user\", \"content\": prompt}],\n    \"max_tokens\": int(summary_budget * 1.3),\n}\nif self.summary_model:\n    call_kwargs[\"model\"] = self.summary_model\nresponse = call_llm(**call_kwargs)\ncontent = response.choices[0].message.content\n...\nsummary = redact_sensitive_text(content.strip())\n# Store for iterative updates on next compaction\nself._previous_summary = summary",
        "explanation": "摘要通过 `call_llm`、以 `task='compression'` 分派出去，因此它可以跑在一个独立、更廉价的辅助模型上，而不是主模型——把能力推到边缘，让代价高昂的核心调用保持精简。结果被存进 `_previous_summary`，这样下一次压实就是对既有摘要做一次迭代式的 UPDATE，而不是从头重摘，从而在多次压实之间保住信息。"
      }
    ],
    "gotchas": [
      "压缩是唯一获许、会让缓存失效的操作。`compress_context()` 会轮转 session_id、结束旧的 SQLite session、创建一个子 session，并重建 + 重新缓存系统提示。这次缓存被打断代价很高，这恰恰是为什么触发要被一个高阈值（默认 50%）外加“两次即退避”的防抖动保护双重把关——你刻意地、只付一次这个代价，而不是每轮都付。",
      "触发用的是提供方的真实 prompt_tokens，而非本地估算。只有 prompt_tokens 计入（不含 completion/reasoning token），因为思考型模型（DeepSeek R1、QwQ）会让 completion_tokens 虚高、从而导致过早压实（#12026）。哨兵值 last_prompt_tokens == -1 标记“刚压完、等待真实用量”，并强制把 _real_tokens 置 0，以免在压缩后那个带噪声的估算上重复触发。",
      "最近那条用户消息必须留在受保护的尾部里。`_ensure_last_user_message_in_tail` 会在必要时把切分边界往回挪——否则 LLM 会把当前任务写进 'Pending User Asks'，但 SUMMARY_PREFIX 又告诉下一个模型只回应摘要之后的消息，于是这条实时请求就悄无声息地消失了（#10896）。",
      "压缩绝不能切断一个 tool_call / tool_result 组。`_align_boundary_backward` 和 `_align_boundary_forward` 会移动切分点以保持这些组完整，而 `_sanitize_tool_pairs` 会移除孤立的结果 / 插入占位结果，确保提供方永远不会收到一个没有匹配 tool result 的 tool_call（那会触发硬性的 400/拒绝）。",
      "摘要并不属于被缓存的前缀——它是作为一条对话中途的消息被插入的（角色经过挑选以保持 user/assistant 交替，或合并进尾部的第一条消息）。SUMMARY_PREFIX 明确把它框定为 'REFERENCE ONLY'（仅供参考）的背景信息，以免某个弱模型把 '## Active Task' 里逐字引用的任务又重新执行一遍（#11475、#14521）。",
      "如果辅助摘要调用失败，行为取决于 compression.abort_on_summary_failure：默认 False 会插入一份本地构建的确定性兜底摘要并丢弃中间窗口；True 则彻底中止压缩、原样返回 messages（_last_compress_aborted=True），让会话冻结，而不是悄悄丢失上下文。",
      "在任何 LLM 调用之前，会先跑一遍廉价的预处理（`_prune_old_tool_results`）：它会对完全相同的工具输出去重、剥掉旧截图，并把体量大的工具结果换成一行摘要。这往往能回收足够多的 token，让有损的 LLM 摘要阶段需要压缩的内容更少。",
      "辅助压缩模型自身也需要一个足够大的上下文窗口。`check_compression_model_feasibility` 会硬性拒绝低于 MINIMUM_CONTEXT_LENGTH 的辅助模型，并在辅助模型容不下主模型那个按阈值大小的窗口时，自动调低本次 session 的阈值。"
    ],
    "connects_to": [
      "prompt 缓存（压缩是这条不变量唯一的例外）",
      "会话管理 / SQLite session 轮转（压缩会结束一个 session 并派生一个子 session）",
      "辅助客户端路由（call_llm 以 task='compression' 把摘要分派给一个廉价模型）",
      "系统提示组装（压实后恰好重建并重新缓存一次）",
      "敏感信息脱敏（redact_sensitive_text 会清洗摘要器的输入与输出）",
      "跨 API 边界强制执行的 tool_call/tool_result 配对不变量",
      "记忆提供方 / context-engine 插件会在压缩触发的 session 切换时收到通知",
      "错误恢复循环（413 / context-length-exceeded 处理会触发强制压缩 + 重试）"
    ],
    "sections": [
      {
        "h": "图解与示例：一次压缩到底发生了什么",
        "html": "<div class=\"figure\"><div class=\"cx-stacks\"><div class=\"cx-col\"><div class=\"cx-col-label\">压缩前 · 消息列表撑到约 128K token</div><div class=\"cx-stack\"><div class=\"cx-seg head\"><div class=\"seg-top\"><span class=\"t\">系统提示 + 前 3 轮</span><span class=\"n\">~8K</span></div><div class=\"d\">不可变头部，承重的关键上下文</div></div><div class=\"cx-seg mid\"><div class=\"seg-top\"><span class=\"t\">中间几十轮</span><span class=\"n\">~80K</span></div><div class=\"d\">旧的工具调用 / 结果 / 讨论 —— 将被摘要替换</div></div><div class=\"cx-seg tail\"><div class=\"seg-top\"><span class=\"t\">最近若干轮</span><span class=\"n\">~40K</span></div><div class=\"d\">按 token 预算保护的尾部，含最新用户请求</div></div></div></div><div class=\"cx-arrow\">➜</div><div class=\"cx-col\"><div class=\"cx-col-label\">压缩后 · 回落到约 51K token</div><div class=\"cx-stack\"><div class=\"cx-seg head\"><div class=\"seg-top\"><span class=\"t\">系统提示 + 前 3 轮</span><span class=\"n\">~8K</span></div><div class=\"d\">逐字保留</div></div><div class=\"cx-seg summary\"><div class=\"seg-top\"><span class=\"t\">📝 一条摘要消息</span><span class=\"n\">~3K</span></div><div class=\"d\">辅助模型把中间段压成“仅供参考”的背景</div></div><div class=\"cx-seg tail\"><div class=\"seg-top\"><span class=\"t\">最近若干轮</span><span class=\"n\">~40K</span></div><div class=\"d\">逐字保留</div></div></div></div></div><div class=\"figure-cap\">头部和尾部逐字保留，只有中间段被换成一条摘要——“当前任务”（最新的用户消息）始终落在受保护的尾部里，绝不会被摘要掉。</div></div><h3>触发与执行的判定流程</h3><div class=\"cx-flow\"><div class=\"cx-node\" data-n=\"1\"><div class=\"nt\">每轮结束，读取真实 prompt_tokens</div><div class=\"nd\">用提供方回报的真实用量，而不是本地估算；且只计 prompt token，不计 completion / reasoning。</div></div><div class=\"cx-node bang\" data-n=\"2\"><div class=\"nt\">越过阈值了吗？</div><div class=\"nd\">阈值 = 上下文窗口 × 50%，并以 MINIMUM_CONTEXT_LENGTH（64K）兜底。没越过就什么都不做。</div></div><div class=\"cx-node skip\" data-n=\"3\"><div class=\"nt\">防抖动：最近两次压缩都没省下 ≥10%？</div><div class=\"nd\">若是 → 退避，本轮不压，避免陷入“每轮都白压一次”的死循环。</div></div><div class=\"cx-node\" data-n=\"4\"><div class=\"nt\">划边界并对齐</div><div class=\"nd\">保护头部（系统提示 + 前 protect_first_n 轮）与按 token 预算的尾部；移动切分点，绝不切断任何 tool_call / tool_result 组。</div></div><div class=\"cx-node\" data-n=\"5\"><div class=\"nt\">辅助模型摘要中间段</div><div class=\"nd\">以 task='compression' 路由到一个更廉价的辅助模型；对已有摘要做迭代式 UPDATE，而不是每次从头重写。</div></div><div class=\"cx-node\" data-n=\"6\"><div class=\"nt\">轮转 session + 重建系统提示</div><div class=\"nd\">结束旧的 SQLite session、派生子 session，并重建 + 重新缓存系统提示——这是 prompt 缓存被允许失效的唯一一次。</div></div></div><h3>一个带数字的例子</h3><div class=\"cx-ex\"><div class=\"cx-ex-head\">设定：200K 上下文窗口，阈值 50% = 100K；第 18 轮后提供方把 prompt_tokens 报告为 128K → 越过阈值，触发压缩</div><div class=\"cx-row\"><span class=\"k\">系统提示 + 前 3 轮（头部）</span><span class=\"v keep\">~8K · 保留</span></div><div class=\"cx-row\"><span class=\"k\">中间几十轮（工具调用 / 结果 / 旧讨论）</span><span class=\"v cut\">~80K → 摘要为 ~3K</span></div><div class=\"cx-row\"><span class=\"k\">最近若干轮（尾部，含最新请求）</span><span class=\"v keep\">~40K · 保留</span></div><div class=\"cx-row total\"><span class=\"k\">压缩后总量</span><span class=\"v\">~51K · 省下约 60%</span></div></div><p>省下约 60% 远高于 10% 的防抖动阈值，所以这次压缩被判为“有效”，不会触发退避。下一轮模型只看到：<strong>头部 + 那条摘要 + 最近几轮</strong>——既回到了上下文窗口的安全区，又没丢掉“用户当前在做什么”。要点是：这一切只在越过阈值时<strong>偶尔</strong>发生一次，每次都把昂贵的“缓存失效”代价一次性付清，而不是每轮慢慢流血。</p>"
      },
      {
        "h": "对比：前身 OpenClaw 为什么压缩次数远少于 Hermes",
        "html": "<p>这是<strong>同一支 Agent 家族两代</strong>对上下文管理的两种取法（Hermes 是 OpenClaw 的后继，见 <code>hermes claw migrate</code>）。两代都会截断单条超大工具输出，但<strong>“压缩”被放在了完全不同的环节</strong>，于是触发频率天差地别。</p><div class=\"figure\"><div class=\"cx-stacks\"><div class=\"cx-col\"><div class=\"cx-col-label\">OpenClaw（前身）· 源头截断 + 历史只增不减</div><div class=\"cx-stack\"><div class=\"cx-seg mid\"><div class=\"seg-top\"><span class=\"t\">工具输出在产生时就截断</span><span class=\"n\">就地 · 无 LLM</span></div><div class=\"d\">超大的 tool_result 进上下文前先截到上限，用一行占位顶掉大段内容（如 <code>...[truncated 122023 chars of tool_result]...</code>）。廉价但粗暴。</div></div><div class=\"cx-seg tail\"><div class=\"seg-top\"><span class=\"t\">历史只增不减</span><span class=\"n\">n_msgs 0→88</span></div><div class=\"d\">消息列表单调增长，中间段几乎从不被摘要成一条消息。</div></div><div class=\"cx-seg head\"><div class=\"seg-top\"><span class=\"t\">整段摘要极少触发</span><span class=\"n\">≈0 次</span></div><div class=\"d\">源头截断已把上下文压得很低，整段历史压缩的阈值（接近硬上限）大多数任务根本碰不到。</div></div></div></div><div class=\"cx-arrow\">vs</div><div class=\"cx-col\"><div class=\"cx-col-label\">Hermes · 较完整输出 + 周期性中段摘要</div><div class=\"cx-stack\"><div class=\"cx-seg tail\"><div class=\"seg-top\"><span class=\"t\">让较完整的输出进来</span><span class=\"n\">仅轻量预处理</span></div><div class=\"d\">工具结果基本原样进上下文，只做去重 / 清理旧截图等廉价预处理。</div></div><div class=\"cx-seg summary\"><div class=\"seg-top\"><span class=\"t\">到 50% / 64K 就摘要中段</span><span class=\"n\">可反复触发</span></div><div class=\"d\">真实 prompt_tokens 一越过阈值就触发一次整段摘要，长会话里会反复触发。</div></div><div class=\"cx-seg mid\"><div class=\"seg-top\"><span class=\"t\">每次压缩都轮转 session</span><span class=\"n\">代价一次付清</span></div><div class=\"d\">结束旧 session、派生子 session、重建系统提示——把缓存失效的代价集中付清。</div></div></div></div></div><div class=\"figure-cap\">两代 Agent 都会截断单条大输出；区别在于 OpenClaw 把“控制增长”放在入口截断，Hermes 放在“累积到阈值后摘要整段历史”。</div></div><h3>同一段长任务里的两种曲线</h3><div class=\"cx-ex\"><div class=\"cx-ex-head\">一段约 48 轮、峰值约 100K token 的真实长任务轨迹（OpenClaw 运行）</div><div class=\"cx-row\"><span class=\"k\">每轮起始消息数 n_msgs</span><span class=\"v keep\">0 → 88，单调递增、从不回落</span></div><div class=\"cx-row\"><span class=\"k\">输入 token</span><span class=\"v\">18K → 102K 持续增长</span></div><div class=\"cx-row\"><span class=\"k\">第 19 轮一个 122K 字符的 tool_result</span><span class=\"v cut\">就地截断，token 短暂冲高后回落</span></div><div class=\"cx-row total\"><span class=\"k\">整段历史摘要（compaction）</span><span class=\"v\">全程 0 次</span></div></div><p>把同一条曲线交给 Hermes：阈值 = max(窗口 × 50%, 64K)。上面这条曲线在中段就越过了 64K 兜底线，于是 Hermes 会触发<strong>至少一次</strong>整段摘要——同样的任务，Hermes 压缩 1–N 次，OpenClaw 0 次。这正是“OpenClaw 压缩次数远少于 Hermes”的直接来源。</p><h3>为什么次数差这么多</h3><div class=\"cx-flow\"><div class=\"cx-node\" data-n=\"1\"><div class=\"nt\">压缩的“单位”不同：源头截断 vs 整段摘要</div><div class=\"nd\">OpenClaw 在每条工具输出产生时就截断（无 LLM、就地、廉价），上下文增长平缓；Hermes 用辅助模型对中间几十轮做语义摘要，这才是被计为“一次压缩”的事件。</div></div><div class=\"cx-node bang\" data-n=\"2\"><div class=\"nt\">触发点不同：接近硬上限 vs 窗口的 50% / 64K</div><div class=\"nd\">源头截断已把上下文压得很低，OpenClaw 的整段压缩近似“撞限才做”、多数任务到不了；Hermes 在 50%（且 64K 兜底）就主动压，门槛低得多且会反复触发。</div></div><div class=\"cx-node\" data-n=\"3\"><div class=\"nt\">任务长度与峰值</div><div class=\"nd\">这类任务多在 50 轮内、峰值 ~100–150K：被源头截断压着，OpenClaw 很少越线；而 Hermes 的 64K 兜底会被不少长轨迹越过。</div></div><div class=\"cx-node skip\" data-n=\"4\"><div class=\"nt\">取舍不同</div><div class=\"nd\">OpenClaw 截断更便宜但更“粗暴”（直接砍掉大输出的中段）；Hermes 摘要更贵（多一次辅助模型调用）但更“聪明”：保留语义、保护头尾、最新请求绝不丢。</div></div></div><p><strong>结论</strong>：不是 Hermes 压得过勤、也不是 OpenClaw 不压，而是两者把“控制上下文增长”放在了不同环节。OpenClaw 在入口处截断单条输出、把工作量前移到工具层，于是很少触发整段摘要；Hermes 在累积到阈值时摘要整段历史，因此“压缩事件”更频繁、但每次都更可控。</p>"
      }
    ]
  },
  {
    "id": "memory",
    "title": "跨会话记忆",
    "phase": "第三部分 · 跨时间学习",
    "one_line": "Hermes 把智能体自行整理的知识持久化下来、跨越会话、按需召回；它把内建记忆注入系统提示的易变层，把外部提供方的召回内容注入实时的用户消息——绝不改动已缓存的前缀。",
    "problem": "裸的 ReAct 循环是健忘的：每个 session 都从零开始。用户在每一次对话里都要重新解释自己的偏好、技术栈，以及上次定下来的结论。\n\n最朴素的修法——每轮都把记住的事实塞进对话里——有两种失败模式：(1) 如果你在 session 中途把召回的文本追加进系统提示，就会让上游的 prompt 缓存失效，把用户每轮的成本成倍抬高；(2) 如果你把召回内容当纯文本内联进去，模型就分不清哪些是记住的上下文、哪些是新的用户指令，而一个慢吞吞或卡死的记忆后端会拖住整轮，让智能体在用户早已拿到答案之后仍显示“运行中”长达数分钟。",
    "design_decision": "Hermes 把记忆拆成两条注入路径，这一拆分正是为守护原则 1（每会话 prompt 缓存神圣不可侵犯）而精确设计的。内建的、由智能体整理的记忆（MEMORY.md / USER.md）在 session 内是稳定的，所以它存放在系统提示的“易变层”——系统提示每个 session 只构建一次、逐字节原样重放，只在压缩时才重建（system_prompt.py 的 build_system_prompt_parts/build_system_prompt）。外部提供方的召回内容每轮都会变，所以它绝不进系统提示；它只在 API 调用时注入到当前轮的用户消息里（conversation_loop.py 约 615-626 行），让缓存的前缀保持不变，也绝不泄漏进 session 持久化数据。\n\n召回内容被包进一个 `<memory-context>` 块里，并附一条“这不是新的用户输入”的系统说明（build_memory_context_block），让模型把它当参考数据而非命令。原则 2（窄腰；能力在边缘）塑造了提供方的设计：核心只暴露一个 MemoryProvider ABC 和一个 MemoryManager，后者只允许恰好一个外部 provider（honcho、mem0、hindsight、supermemory 等）——各后端都是 plugins/memory/ 下的插件，而非核心工具，而“只允许一个 provider”这一限制，避免了每次 API 调用都让工具 schema 膨胀。最后，同步与预取都跑在一个单独的后台 worker 上，因此一个阻塞的后端永远拖不住对话轮次。",
    "code_snippets": [
      {
        "caption": "系统提示中的两层记忆：内建记忆 + USER 档案放进易变层；外部 provider 追加一个静态块",
        "file": "agent/system_prompt.py",
        "lines": "338-359",
        "code": "    # ── Volatile tier (changes per session/turn — never cached) ───\n    volatile_parts: List[str] = []\n\n    if agent._memory_store:\n        if agent._memory_enabled:\n            mem_block = agent._memory_store.format_for_system_prompt(\"memory\")\n            if mem_block:\n                volatile_parts.append(mem_block)\n        # USER.md is always included when enabled.\n        if agent._user_profile_enabled:\n            user_block = agent._memory_store.format_for_system_prompt(\"user\")\n            if user_block:\n                volatile_parts.append(user_block)\n\n    # External memory provider system prompt block (additive to built-in)\n    if agent._memory_manager:\n        try:\n            _ext_mem_block = agent._memory_manager.build_system_prompt()\n            if _ext_mem_block:\n                volatile_parts.append(_ext_mem_block)\n        except Exception:\n            pass",
        "explanation": "内建的、由智能体整理的记忆（MEMORY.md）和 USER 档案被渲染进系统提示的易变层，而易变层是每个 session 只构建一次的已缓存提示的一部分（仅在压缩时重建）。外部 provider 在这里贡献的是**静态**的指令文本——它们每轮的召回内容在别处注入，从而让缓存前缀保持逐字节稳定。"
      },
      {
        "caption": "每轮的外部召回在 API 调用时注入用户消息，而不是系统提示",
        "file": "agent/conversation_loop.py",
        "lines": "610-626",
        "code": "            # Inject ephemeral context into the current turn's user message.\n            # Sources: memory manager prefetch + plugin pre_llm_call hooks\n            # with target=\"user_message\" (the default).  Both are\n            # API-call-time only — the original message in `messages` is\n            # never mutated, so nothing leaks into session persistence.\n            if idx == current_turn_user_idx and msg.get(\"role\") == \"user\":\n                _injections = []\n                if _ext_prefetch_cache:\n                    _fenced = build_memory_context_block(_ext_prefetch_cache)\n                    if _fenced:\n                        _injections.append(_fenced)\n                if _plugin_user_context:\n                    _injections.append(_plugin_user_context)\n                if _injections:\n                    _base = api_msg.get(\"content\", \"\")\n                    if isinstance(_base, str):\n                        api_msg[\"content\"] = _base + \"\\n\\n\" + \"\\n\\n\".join(_injections)",
        "explanation": "预取到的召回内容（在上一轮的后台预取中缓存进 _ext_prefetch_cache）只会被追加到当前用户消息的一份**拷贝**上——即 `api_msg`，而不是 `messages`。这让缓存的系统提示前缀在各轮之间保持不变，也确保易变的召回内容永远不会被持久化进 session 的对话记录。"
      },
      {
        "caption": "召回内容被包裹并标注为权威参考数据，而非新的用户输入",
        "file": "agent/memory_manager.py",
        "lines": "235-249",
        "code": "def build_memory_context_block(raw_context: str) -> str:\n    \"\"\"Wrap prefetched memory in a fenced block with system note.\"\"\"\n    if not raw_context or not raw_context.strip():\n        return \"\"\n    clean = sanitize_context(raw_context)\n    if clean != raw_context:\n        logger.warning(\"memory provider returned pre-wrapped context; stripped\")\n    return (\n        \"<memory-context>\\n\"\n        \"[System note: The following is recalled memory context, \"\n        \"NOT new user input. Treat as authoritative reference data — \"\n        \"this is the agent's persistent memory and should inform all responses.]\\n\\n\"\n        f\"{clean}\\n\"\n        \"</memory-context>\"\n    )",
        "explanation": "这个包裹块加上系统说明，让记住的上下文与一条新指令区分开来。sanitize_context() 会先剥掉 provider 可能已经自行输出的任何包裹标签/说明，从而防止某个 provider 伪造它自己的权威框架、或嵌套这些块。"
      },
      {
        "caption": "周期性的记忆提醒：每 N 个用户轮次，把该轮标记为需要后台记忆复盘",
        "file": "agent/turn_context.py",
        "lines": "209-217",
        "code": "    # Track memory nudge trigger (turn-based, checked here).\n    should_review_memory = False\n    if (agent._memory_nudge_interval > 0\n            and \"memory\" in agent.valid_tool_names\n            and agent._memory_store):\n        agent._turns_since_memory += 1\n        if agent._turns_since_memory >= agent._memory_nudge_interval:\n            should_review_memory = True\n            agent._turns_since_memory = 0",
        "explanation": "默认间隔是 10 个用户轮次（agent_init.py 设置 agent._memory_nudge_interval = 10）。当它触发时，turn_finalizer.py 会在响应**送达之后**才派生一个后台复盘，因此持久化知识这件事，永远不会与用户的任务争夺模型的注意力或延迟。"
      },
      {
        "caption": "同步在独立线程上运行，因此缓慢的记忆后端永远拖不住对话轮次",
        "file": "agent/memory_manager.py",
        "lines": "438-453",
        "code": "        Runs on a background worker thread, NOT inline on the\n        turn-completion path. A provider's ``sync_turn`` may make a\n        blocking network/daemon call (a misconfigured Hindsight daemon\n        was observed blocking ~298s before failing); doing that inline\n        held ``run_conversation`` open long after the user saw their\n        response, so every interface (CLI, TUI, gateway) kept the agent\n        marked \"running\" for minutes and any follow-up message triggered\n        an aggressive interrupt. Dispatching off-thread means a slow or\n        broken provider can never stall the turn — the sync simply\n        completes (or fails, logged) in the background.\n\n        Writes are serialized through a single worker so turn N lands\n        before turn N+1; provider implementations don't need their own\n        ordering guarantees.",
        "explanation": "sync_all/queue_prefetch_all 把 provider 的工作派给一个惰性创建的后台 worker（ThreadPoolExecutor max_workers=1）。单个 worker 既串行化了写入（轮次 N 早于 N+1），又保证任何后端延迟都波及不到面向用户的对话轮次循环。"
      }
    ],
    "gotchas": [
      "内建记忆存放在系统提示的**易变层**里，而该层仍是每个 session 只构建一次的已缓存提示的一部分——它**不会**每轮重新注入。它只在提示被重建（压缩）时才变化，而 invalidate_system_prompt() 会在那次重建时从磁盘重新加载记忆（system_prompt.py:404-412），从而捕获本 session 内做出的写入。",
      "外部 provider 的召回必须放进**用户**消息，绝不能放进系统提示。把每轮的召回放进系统提示，会让缓存前缀每轮都失效——conversation_loop.py:651-660 处的明确注释正是把这一点作为原因点出。同一条规则也约束着技能的斜杠命令（AGENTS.md:370）。",
      "召回注入改动的是一份**拷贝**（api_msg），绝不动 `messages` 里的原始消息，因此易变的召回内容永远不会泄漏进 session 持久化数据，也不会进入下一轮的已缓存历史。",
      "同一时间只允许**一个**外部 provider（MemoryManager.add_provider 会拒绝第二个非内建 provider 并给出警告），以防工具 schema 膨胀——每个 provider 的工具都会在每次 API 调用时被发送（原则 2）。",
      "如果某个记忆 provider 的工具占用了一个保留的核心工具名（clarify、delegate_task 等），它会在注册时被拒；内建工具永远优先（#40466）。",
      "流式响应需要 StreamingContextScrubber，而不是一次性的 sanitize_context 正则：一个被拆到多个增量里的 `<memory-context>` 区段，否则会把它的载荷泄漏到 UI。该 scrubber 会在每轮开头 reset()（turn_context.py:197-200）。",
      "记忆提醒基于轮次计数，并且要求 memory 是一个有效工具**且**存在记忆存储才会启用；它统计的是**用户**轮次，在恢复时从持久化历史中重新装填它的计数器（turn_context.py:184-192），触发后归零。",
      "后台复盘和轮次后同步都在响应**送达之后**才运行，且只在未被中断时运行（turn_finalizer.py:393）——尽力而为、包在 try/except 里，因此一次失败的复盘绝不会破坏该对话轮次。",
      "shutdown_all() 以一个 5 秒上限的超时来排空后台 executor（_SYNC_DRAIN_TIMEOUT_S）；一个卡死的 provider 会随解释器一起死掉（daemon 线程），而不会让拆解过程挂起。"
    ],
    "connects_to": [
      "Prompt 缓存（agent/prompt_caching.py、system_prompt.py）：整个两层注入设计存在的意义，就是让已缓存的前缀在各轮之间保持逐字节稳定。",
      "上下文压缩：唯一获许的系统提示重建；invalidate_system_prompt() 会从磁盘重新加载记忆，使压缩后的提示能捕获本 session 的写入，而 provider 还能拿到 on_pre_compress() 以便从被丢弃的消息中保留洞见。",
      "后台自我改进 / 技能复盘（agent/background_review.py、curator.py）：记忆提醒与技能复盘共用同一套 fork-the-agent 机制（两者同时触发时使用合并的 prompt）。",
      "插件系统（plugins/memory/<name>/）：外部 provider 是通过 config.yaml 里的 memory.provider 激活的插件——记忆能力真正所在的那个窄腰边缘。",
      "子智能体委派：on_delegation() 让父智能体的 provider 能观察一个子智能体做了什么；子智能体自身则以 skip_memory=True 运行。",
      "Session 生命周期（/resume、/branch、/reset、/new）：on_session_switch() 在不拆掉 provider 的前提下，轮换 provider 的每会话状态。"
    ]
  },
  {
    "id": "skills-curator",
    "title": "技能与自我改进循环",
    "phase": "第三部分 · 跨时间学习",
    "one_line": "Hermes 闭合了一个学习循环：每轮对话结束后，一个 fork 出来的智能体会把经验提炼成技能（SKILL.md + 脚本组成的文件夹），而一个后台 curator 会周期性地整合并自动归档陈旧技能——整个过程从不碰主会话的 prompt 缓存，也从不删除任何技能。",
    "problem": "裸的 ReAct 循环在*流程*层面是健忘的：它每个 session 都从零开始解决同一类任务，重复用户早就纠正过的错误，也不积累任何可复用的经验。如果你硬塞一句“让模型自己写可复用的指令”，又会冒出两个新的失败模式。第一，每轮都把一个不断增长的技能库重新注入系统提示，这会摧毁每会话的 prompt 缓存（原则 #1）——每改一次技能都让缓存前缀失效，又得花全额输入 token 重新计费。第二，一个能随意建技能的智能体会产出成百上千条狭窄的“一个 session 一个技能”的条目，把可发现性彻底淹没，而且永远没人清理——于是技能库就退化成了噪声。",
    "design_decision": "这个循环被拆成两个 fork 出来的智能体 pass，两者都把 prompt 缓存视为神圣不可侵犯（原则 #1），并把能力保留在边缘（原则 #2）。WRITE 一半：一轮对话结束后，`turn_finalizer` 检查一个迭代计数器，并 spawn 出一个守护线程 fork（`background_review.py`），它会重放整段对话并发问“我该保存/更新什么技能？”。这个 fork 原样继承父智能体的运行时*以及*它已缓存的系统提示（`review_agent._cached_system_prompt = agent._cached_system_prompt`，外加固定的 `session_start`/`session_id` 和一份逐字节相同的 `tools[]` toolset），这样它发出的请求就能命中父智能体已预热的同一份前缀缓存——实测可降低约 26% 的成本。技能根本不在系统提示里：它们按名字加载，并以 USER 消息的形式注入（`skill_commands.py` 的 `_build_skill_message`），而 `reload_skills()` 明确不会让 prompt 缓存失效。CURATE 一半：一个由不活跃触发的 curator fork（`curator.py`）执行纯粹基于时间的状态转移（active→stale→archived），再加上一个由 LLM 完成的“搭伞式”整合 pass，它使用辅助 client，因此从不碰主会话的缓存。这个窄腰由若干硬性不变量来强制：curator 只动 `created_by:agent` 的技能，永不删除（归档是最大的破坏性动作，而且可恢复），并完全跳过已固定（pinned）的技能。",
    "code_snippets": [
      {
        "caption": "技能以 USER 消息注入，而非系统提示——所以编辑技能库永远不会让前缀缓存失效",
        "file": "agent/skill_commands.py",
        "lines": "348-360",
        "code": "def reload_skills() -> Dict[str, Any]:\n    \"\"\"Re-scan the skills directory and return a diff of what changed.\n\n    This does NOT invalidate the skills system-prompt cache. Skills are\n    called by name via ``/skill-name``, ``skills_list``, or ``skill_view``\n    — they don't need to be in the system prompt for the model to use them.\n    Keeping the prompt cache intact preserves prefix caching across the\n    reload, so a user invoking ``/reload-skills`` pays no cache-reset cost.\n    \"\"\"",
        "explanation": "技能以 SKILL.md + 脚本组成的文件夹形式存在，按名字按需拉取，再由 `_build_skill_message` 格式化成一条 user 角色的消息。正因为它们从不进系统提示，所以添加/编辑/重新加载技能都让缓存前缀保持逐字节相同——这直接遵循原则 #1（prompt 缓存神圣不可侵犯）。"
      },
      {
        "caption": "WRITE 一半：一个守护线程 fork 把这一轮提炼成技能，同时继承父智能体已预热的前缀缓存",
        "file": "agent/background_review.py",
        "lines": "432-462",
        "code": "            # Inherit the parent's cached system prompt verbatim so\n            # the review fork's outbound HTTP request hits the same\n            # Anthropic/OpenRouter prefix cache the parent warmed.\n            # Without this, the fork rebuilds the system prompt from\n            # scratch (fresh _hermes_now() timestamp, fresh\n            # session_id, narrower toolset → different skills_prompt)\n            # and the byte-exact prefix-cache key misses. See\n            # issue #25322 and PR #17276 for the full analysis +\n            # measured impact (~26% end-to-end cost reduction on\n            # Sonnet 4.5).\n            review_agent._cached_system_prompt = agent._cached_system_prompt\n            review_agent.session_start = agent.session_start\n            review_agent.session_id = agent.session_id\n            review_agent.compression_enabled = False",
        "explanation": "后台 review fork 本可以天真地重建自己的系统提示，但那样会缓存未命中、花掉全额输入 token。把已缓存的提示、session 字段以及 toolset 都固定下来（让 `tools[]` 逐字节相同），就能让这个 fork 搭上父智能体的前缀缓存——缓存命中时，整个自我改进循环基本上是免费的。compression 被禁用，这样 fork 就不会在 gateway 眼皮底下把父智能体的 session 轮换掉。"
      },
      {
        "caption": "CURATE 一半：纯粹、无 LLM 的生命周期状态转移，永不删除、永不碰已固定的技能",
        "file": "agent/curator.py",
        "lines": "296-310",
        "code": "        current = row.get(\"state\", _u.STATE_ACTIVE)\n\n        if anchor <= archive_cutoff and current != _u.STATE_ARCHIVED:\n            ok, _msg = _u.archive_skill(name)\n            if ok:\n                counts[\"archived\"] += 1\n        elif anchor <= stale_cutoff and current == _u.STATE_ACTIVE:\n            _u.set_state(name, _u.STATE_STALE)\n            counts[\"marked_stale\"] += 1\n        elif anchor > stale_cutoff and current == _u.STATE_STALE:\n            # Skill got used again after being marked stale — reactivate.\n            _u.set_state(name, _u.STATE_ACTIVE)\n            counts[\"reactivated\"] += 1",
        "explanation": "`apply_automatic_transitions` 遍历每个 agent 创建的技能的最近活跃时间戳，把它从 active→stale（默认 30 天）→archived（默认 90 天）迁移，并把任何重新被用到的技能重新激活。最大的破坏性动作就是 `archive_skill`（移入 `~/.hermes/skills/.archive/`，可恢复）——它永不删除——而已固定的技能在循环更早处就被 `continue` 跳过了，所以用户永远不会悄无声息地丢掉一个技能。"
      },
      {
        "caption": "模块顶部记录的严格 curator 不变量——窄腰契约",
        "file": "agent/curator.py",
        "lines": "15-20",
        "code": "Strict invariants:\n  - Only touches agent-created skills (see tools/skill_usage.is_agent_created)\n  - Never auto-deletes — only archives. Archive is recoverable.\n  - Pinned skills bypass all auto-transitions\n  - Uses the auxiliary client; never touches the main session's prompt cache",
        "explanation": "这四条不变量构成了让一个自我改进系统得以无人值守运行的安全契约：来源门控（`created_by:agent`）把内置/hub 技能挡在门外，归档而非删除让每个动作都可逆，固定（pinning）给了用户一个硬性豁免，而辅助 client 让整理工作远离主会话的缓存（原则 #1）。"
      }
    ],
    "gotchas": [
      "`created_by:agent` 这条来源不变量意味着 curator 和后台 review 的 write pass 都会拒绝修改内置或 hub 安装的技能——只有智能体自己撰写的技能才在作用域内。（一个例外：当 `curator.prune_builtins` 开启时（默认 true），内置自带技能在经过同样的不活跃窗口后，也会经一条显式的 prompt 覆盖成为归档候选；而 hub 安装的技能无论如何都永远不可被修剪。）",
      "`tools/skill_usage.py` 和 `tools/skills_tool.py`（遥测旁路文件 `~/.hermes/skills/.usage.json` 以及 `is_agent_created` 来源检查）在 `curator.py`/`skill_commands.py` 中被多处引用，但整个 `tools/` 目录在本次 checkout 中缺失——需到别处核实。据 AGENTS.md 第 998-1011 行，skill_usage 负责每个技能的 use_count/view_count/patch_count/last_activity_at/state/pinned。",
      "固定（pinned）是不对称的：`skill_manage(action=delete)` 会拒绝已固定的技能，但 patch/edit/write_file/remove_file 仍可通过——智能体可以继续改进一个已固定的技能，只是不能归档它（AGENTS.md 第 1009-1011 行）。",
      "两个 review fork 都把 `_memory_nudge_interval = 0` 和 `_skill_nudge_interval = 0`（curator.py:1762-1763、background_review.py:422-423），这样一个 review fork 就永远不会递归地 spawn 出它自己的 review——没有这个设置，你会陷入无界的 fork 递归。",
      "技能 nudge 是一个计数器，而不是计时器：`conversation_loop` 只在 `skill_manage` 是有效工具的那些轮次上递增 `_iters_since_skill`，并在它触发时重置为 0（默认每 10 个迭代一次，`agent._skill_nudge_interval`，可通过 `skills.creation_nudge_interval` 配置）。真正的 review 只在响应被交付*之后*才 spawn（turn_finalizer.py:393），因此它永远不会和用户的任务抢模型的注意力。",
      "curator 的首次运行是被延后的：`should_run_now()` 在第一次见到时把 `last_run_at=now` 写入种子，然后等待整整一个间隔（默认 7 天），而不是在 `hermes update` 之后立刻运行——可以用 `hermes curator run --dry-run` 提前预览。",
      "已归档技能的分类（整合进伞 vs 因陈旧被修剪）是按优先级从三个信号里调和得出的：模型在删除调用处给出的 `absorbed_into=<umbrella>` 声明（权威），结构化的 YAML 摘要块，最后是一个子串式的工具调用启发式判断——一个声明了不存在的伞的模型，会被降级到启发式判断或归为 'pruned'。",
      "当 curator 把技能 X 整合进伞 Y 时，任何引用 X 的 cron 任务都会被原地自动重写（`cron.jobs.rewrite_skill_refs`），这样在多次整合 pass 之后，已排期的任务仍能加载到正确的指令。"
    ],
    "connects_to": [
      "Prompt 缓存 / 已缓存的系统提示（原则 #1）——review 和 curator fork 的设计就是为了保留父智能体的前缀缓存；reload_skills() 被明确设计为对缓存无影响",
      "辅助 client / 辅助任务槽（auxiliary.curator.{provider,model}）——curator 跑在一个被路由的辅助模型上，永不走主聊天路径",
      "后台 review / 记忆子系统——同一套 fork 智能体机制（background_review.py）同时处理记忆写入和技能写入，共享守护线程 + 工具白名单的底层管道",
      "Cron（已排期任务）——当技能被整合/修剪时，curator 会自动重写 cron 任务中的技能引用（cron.jobs.rewrite_skill_refs）",
      "工具分派 / toolset——review fork 通过 set_thread_tool_whitelist 被锁定在 memory+skills toolset 上，这是一种运行时的窄腰强制",
      "skill_usage 遥测（tools/skill_usage.py，本次 checkout 中缺失）——记录使用/查看/patch 次数并驱动生命周期状态机的旁路文件 .usage.json"
    ]
  },
  {
    "id": "sessions-search",
    "title": "会话存储与 FTS5 检索",
    "phase": "第三部分 · 跨时间学习",
    "one_line": "每一轮对话都会持久化到 SQLite 并由 FTS5 建立索引，从而让 Hermes 拥有一个抗崩溃的对话记录存储，以及一个 session_search 工具，让智能体能搜索自己过往的对话。",
    "problem": "一个最简化的 ReAct 循环只把对话存在一个 Python 列表里。一旦进程退出——崩溃、被 OOM 杀掉、Ctrl-C，或者在某个工具循环深处发生提供方超时——整份对话记录就此蒸发；既没有 /resume，也没有任何审计线索。更糟的是，这个循环跨 session 时是失忆的：用户昨天做的某个决定，或者智能体上周琢磨出的某个修复，全都无从触及，因为内存里的列表在每次新运行时都被重置为空。最终智能体只能让用户重复一遍，或者把自己早就做过的工作重新推一遍。",
    "design_decision": "Hermes 把 SQLite 当作权威存储，并在每一条循环退出路径上都做增量持久化，而不只在结束时写一次（参见 conversation_loop.py 中约 9 处 `agent._persist_session(...)` 的调用点）。`_flush_messages_to_session_db` 会追踪 `_last_flushed_db_idx`，因此重复的持久化调用只写入真正新增的行——做到每轮都持久化，又不重复写入（#860）。召回则分成两张由触发器驱动的 FTS5 虚拟表：一张 `unicode61` 表（`messages_fts`）用于普通文本，一张 `trigram` 表（`messages_fts_trigram`）用于 CJK 子串搜索，两张表都被喂入 `content || tool_name || tool_calls`，因此智能体不仅能找到过往的文字，还能找到过往用过的工具。这里的关键设计张力在于窄腰原则（AGENTS.md）：`session_search` 是仅有的四个 agent-loop 工具之一（`_AGENT_LOOP_TOOLS = {\"todo\", \"memory\", \"session_search\", \"delegate_task\"}`）——召回之所以能在每一次 API 调用里都占一个名额，是因为它能直接降低用户的引导成本。而持久化的设计刻意不违反原则 #1（prompt 缓存神圣不可侵犯）：SQLite 存储是一个按需通过工具调用读取的旁路通道；召回结果被注入用户消息中，绝不会在对话进行时被拼进被缓存的系统提示前缀。这个存储在边缘处扩展产品（历史记录、/resume、各种看板），而面向模型的核心保持最小。",
    "code_snippets": [
      {
        "caption": "权威的 messages 表，以及镜像它的 FTS5 虚拟表和触发器",
        "file": "hermes_state.py",
        "lines": "477-550",
        "code": "CREATE TABLE IF NOT EXISTS messages (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    session_id TEXT NOT NULL REFERENCES sessions(id),\n    role TEXT NOT NULL,\n    content TEXT,\n    tool_call_id TEXT,\n    tool_calls TEXT,\n    tool_name TEXT,\n    timestamp REAL NOT NULL,\n    ...\n    active INTEGER NOT NULL DEFAULT 1\n);\n\nFTS_SQL = \"\"\"\nCREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(\n    content\n);\n\nCREATE TRIGGER IF NOT EXISTS messages_fts_insert AFTER INSERT ON messages BEGIN\n    INSERT INTO messages_fts(rowid, content) VALUES (\n        new.id,\n        COALESCE(new.content, '') || ' ' || COALESCE(new.tool_name, '') || ' ' || COALESCE(new.tool_calls, '')\n    );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS messages_fts_delete AFTER DELETE ON messages BEGIN\n    DELETE FROM messages_fts WHERE rowid = old.id;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS messages_fts_update AFTER UPDATE ON messages BEGIN\n    DELETE FROM messages_fts WHERE rowid = old.id;\n    INSERT INTO messages_fts(rowid, content) VALUES (\n        new.id,\n        COALESCE(new.content, '') || ' ' || COALESCE(new.tool_name, '') || ' ' || COALESCE(new.tool_calls, '')\n    );\nEND;\n\"\"\"",
        "explanation": "`messages` 表是唯一的真相来源；FTS5 表则是一个由 AFTER INSERT/DELETE/UPDATE 触发器保持同步的派生索引。对 `content || tool_name || tool_calls` 建索引，意味着一次搜索命中既覆盖智能体说过的话，也覆盖它调用过的工具，因此“我什么时候跑过那次迁移”这样的问题是可召回的。由于索引是从 `messages` 重建的（见 `_rebuild_fts_indexes`），即便 FTS 层损坏，也能在不丢失对话记录的前提下恢复。"
      },
      {
        "caption": "每一轮通过 BEGIN IMMEDIATE + 抖动重试来持久化，并返回新行的 id",
        "file": "hermes_state.py",
        "lines": "2319-2361",
        "code": "        def _do(conn):\n            cursor = conn.execute(\n                \"\"\"INSERT INTO messages (session_id, role, content, tool_call_id,\n                   tool_calls, tool_name, timestamp, token_count, finish_reason,\n                   reasoning, reasoning_content, reasoning_details, codex_reasoning_items,\n                   codex_message_items, platform_message_id, observed)\n                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\"\"\",\n                (\n                    session_id, role, stored_content, tool_call_id,\n                    tool_calls_json, tool_name, time.time(), token_count,\n                    finish_reason, reasoning, reasoning_content,\n                    reasoning_details_json, codex_items_json,\n                    codex_message_items_json, platform_message_id,\n                    1 if observed else 0,\n                ),\n            )\n            msg_id = cursor.lastrowid\n\n            # Update counters\n            if num_tool_calls > 0:\n                conn.execute(\n                    \"\"\"UPDATE sessions SET message_count = message_count + 1,\n                       tool_call_count = tool_call_count + ? WHERE id = ?\"\"\",\n                    (num_tool_calls, session_id),\n                )\n            else:\n                conn.execute(\n                    \"UPDATE sessions SET message_count = message_count + 1 WHERE id = ?\",\n                    (session_id,),\n                )\n            return msg_id\n\n        return self._execute_write(_do)",
        "explanation": "`append_message` 在单个事务里写入一行并递增该 session 的消息/工具调用计数器，该事务经由 `_execute_write` 路由（BEGIN IMMEDIATE + 在锁竞争时进行 20-150ms 随机抖动重试）。触发器会自动触发，因此 FTS 索引在同一次提交里被更新——持久化与可搜索性永远不会脱节。"
      },
      {
        "caption": "在每一条循环退出路径上做增量 flush——每轮持久化，且不重复写入",
        "file": "run_agent.py",
        "lines": "1548-1605",
        "code": "    def _flush_messages_to_session_db(self, messages: List[Dict], conversation_history: List[Dict] = None):\n        \"\"\"Persist any un-flushed messages to the SQLite session store.\n\n        Uses _last_flushed_db_idx to track which messages have already been\n        written, so repeated calls (from multiple exit paths) only write\n        truly new messages — preventing the duplicate-write bug (#860).\n        \"\"\"\n        if not self._session_db:\n            return\n        ...\n        start_idx = len(conversation_history) if conversation_history else 0\n        flush_from = max(start_idx, self._last_flushed_db_idx)\n        for msg in messages[flush_from:]:\n            ...\n            self._session_db.append_message(\n                session_id=self.session_id,\n                role=role,\n                content=content,\n                tool_name=msg.get(\"tool_name\"),\n                tool_calls=tool_calls_data,\n                ...\n            )\n        self._last_flushed_db_idx = len(messages)",
        "explanation": "`conversation_loop.py` 在约 9 个不同位置调用 `agent._persist_session(...)`（正常完成、出错、提前返回、工具循环中途）。这个 flush 只写入 `_last_flushed_db_idx` 之后的行，使每次调用都既廉价又幂等——因此即便在某轮中途崩溃，磁盘上仍留有一份完整的对话记录，而重新进入持久化路径也绝不会重复写入。"
      },
      {
        "caption": "search_messages：session_search 工具背后的 FTS5 MATCH 查询",
        "file": "hermes_state.py",
        "lines": "3198-3239",
        "code": "        where_clauses = [\"messages_fts MATCH ?\"]\n        params: list = [query]\n        if not include_inactive:\n            where_clauses.append(\"m.active = 1\")\n        ...\n        sql = f\"\"\"\n            SELECT\n                m.id,\n                m.session_id,\n                m.role,\n                snippet(messages_fts, 0, '>>>', '<<<', '...', 40) AS snippet,\n                m.content,\n                m.timestamp,\n                m.tool_name,\n                s.source,\n                s.model,\n                s.started_at AS session_started\n            FROM messages_fts\n            JOIN messages m ON m.id = messages_fts.rowid\n            JOIN sessions s ON s.id = m.session_id\n            WHERE {where_sql}\n            {order_by_sql}\n            LIMIT ? OFFSET ?\n        \"\"\"",
        "explanation": "搜索会把 FTS 索引重新 join 回 `messages` 和 `sessions`，返回一个按 BM25 排序、带 `>>>`/`<<<` 高亮标记的片段，外加 session 元数据——这样智能体既拿到了可引用的摘录，又知道它来自哪一次过往 session。被回退（`active=0`）的行默认会被排除，从而让召回与实时对话记录保持一致。用户输入会先经过 `_sanitize_fts5_query`，剥除那些会引发 OperationalError 的 FTS5 运算符字符。"
      }
    ],
    "gotchas": [
      "session_search 这个 MODEL TOOL 的实现位于 tools/session_search_tool.py，它被 agent/tool_executor.py:989 引用，但在当前 checkout 中缺失（不存在 tools/ 目录）。dispatch 接线（tool_executor.py:983-1011）以及底层的 SessionDB.search_messages（hermes_state.py:3133+）都在；这里唯独缺那层薄薄的工具包装。",
      "是两张 FTS 表，而不是一张：默认的 unicode61 分词器会把每个 CJK 字符切成单独的 token，因此 'docker' 这类搜索走 messages_fts，而 CJK 查询则路由到 messages_fts_trigram。Trigram 要求每个 token 内有 >=3 个 CJK 字符（>=9 个 UTF-8 字节）；1-2 个字符的 CJK 查询（以及像 '广西 OR 桂林' 这种单 token 过短的情形）会回退到 LIKE 扫描（#20494）。",
      "FTS 触发器索引的是 content || tool_name || tool_calls。如果你新增或重命名这些列，就必须同时更新 FTS_SQL、FTS_TRIGRAM_SQL 以及 _rebuild_fts_indexes，否则回填的行和触发器写入的行会索引到不同的文本。schema v11 不得不 drop+recreate 这两张表并做回填，因为 IF NOT EXISTS 不会覆盖一张旧 schema 的 FTS 表（#16751）。",
      "召回绝不能破坏 prompt 缓存（AGENTS.md 原则 #1）：搜索结果被注入用户消息中（conversation_loop.py:653 / prompt_builder SESSION_SEARCH_GUIDANCE），绝不会在对话进行时被拼进被缓存的系统提示前缀。",
      "运行时的 SQLite 中 FTS5 可能不可用。_init_schema 会用一张临时虚拟表来探测；若不可用，search_messages 返回 []（self._fts_enabled 为 False），并且代码会丢掉 FTS 触发器，让普通的消息 INSERT 仍能正常工作——持久化优雅降级，只是没有搜索功能。",
      "WAL 模式是面向并发 gateway 读取方的默认设置，但在 NFS/SMB/FUSE 上它会抛出 'locking protocol' 错误；apply_wal_with_fallback 会静默降级为 journal_mode=DELETE。一个损坏的 sqlite_master（重复的 messages_fts 定义）会在第一条语句上就失败，并被自动修复（先备份，再重建 FTS），因此 Desktop 会自愈，而不是显示“没有 session”。",
      "写入使用 SQLite timeout=1.0，配合应用层的 BEGIN IMMEDIATE + 20-150ms 随机抖动重试（最多 15 次尝试），而不是 SQLite 那个确定性的 busy handler，以避免在 gateway + CLI + worktree 智能体共用一个 state.db 时出现护航式停顿（convoy stall）。在 _execute_write 内部的调用方绝不能自己调用 commit()。"
    ],
    "connects_to": [
      "压缩与 session 拆分：parent_session_id 链和 compression_locks（try_acquire_compression_lock）让一段被压缩的对话能作为子 session 继续，同时在 list_sessions_rich 中仍是一个逻辑上的线程",
      "/resume、/history、/branch、/title 这些斜杠命令都读这个存储；当数据库打不开时，format_session_db_unavailable 会说明原因",
      "memory 工具（agent/memory_provider.py）：持久的用户偏好事实被单独存储，而 session_search 召回的是按任务的、会过时的对话记录细节——prompt_builder 明确告诉模型别把这类细节放进 memory",
      "回退/撤销：messages.active 软删除标志——search_messages 默认排除 active=0 的行，使召回与实时对话记录保持一致",
      "窄腰的工具门控：session_search 是 model_tools.py 中那四个 _AGENT_LOOP_TOOLS 之一，会在每一次 API 调用时都被发送",
      "Gateway 的多平台 session：source 列（'cli'、'telegram'、'discord' 等）为每个 session 打标签，用于跨平台过滤与聚合"
    ]
  },
  {
    "id": "delegation",
    "title": "委派与子智能体",
    "phase": "第四部分 · 横向扩展",
    "one_line": "智能体可以派生出相互隔离的子智能体——每个都有自己独立的上下文窗口、terminal 会话、toolset 和迭代预算——去完成聚焦或并行的工作，并把结果以摘要形式汇报回来，而不是把每个子任务都塞进一个不断膨胀的会话里。",
    "problem": "在扁平的 ReAct 循环里，所有子任务共享同一份消息历史和同一份迭代预算。一个要打开 30 个网页的研究任务，或者三个本可以并行的独立作业，全都把原始的工具输出倾倒进同一个会话——撑爆上下文窗口、污染 prompt 缓存，还把本来没有数据依赖的工作硬生生串行化了。此外也没有办法给某个子任务配一个更窄、更安全的 toolset 或一个独立的 terminal：一个失控的循环就会耗尽整轮的迭代预算，而一个工具的临时草稿状态也会泄漏到其他所有东西里。",
    "design_decision": "Hermes 加了单独一个 `delegate_task` 工具，用来派生子 `AIAgent` 实例，每个实例都有隔离的上下文 + terminal 会话，父智能体则阻塞等待，直到子智能体返回一份紧凑的摘要（按设计是同步的——父智能体若被中断，子智能体会被取消）。这让核心保持为一根窄腰（原则 2）：会话循环只需学会一个新动词 `delegate_task`，并把它路由经过唯一的咽喉点 `_dispatch_delegate_task`，于是新的 schema 字段无需改动循环就能抵达并发/串行/内联各条路径。所有真正的能力——基于角色的工具裁剪（leaf 与 orchestrator）、并发上限、深度限制、MCP 继承、模型覆盖——都住在边缘的 `tools/delegate_tool.py` 里，而不在循环里。隔离同样守护原则 1（prompt 缓存神圣不可侵犯）：子智能体那些嘈杂的中间工具调用只会累积在它自己的缓存和预算上，因此父智能体已缓存的前缀和消息角色交替保持干净——只有提炼出的摘要才会重新进入父智能体。每个子智能体都拿到自己的 `IterationBudget`（由 `delegation.max_iterations` 设上限，默认 50，与父智能体的 90 相互独立），正是为了让一个深度工作的子智能体无法耗尽父智能体的轮次，也让以委派为目的时总工作量能扩展到超过父智能体的上限。",
    "code_snippets": [
      {
        "caption": "唯一的分发咽喉点——每条委派路径都从这里经过",
        "file": "run_agent.py",
        "lines": "5034-5051",
        "code": "def _dispatch_delegate_task(self, function_args: dict) -> str:\n    \"\"\"Single call site for delegate_task dispatch.\n\n    New DELEGATE_TASK_SCHEMA fields only need to be added here to reach all\n    invocation paths (concurrent, sequential, inline).\n    \"\"\"\n    from tools.delegate_tool import delegate_task as _delegate_task\n    return _delegate_task(\n        goal=function_args.get(\"goal\"),\n        context=function_args.get(\"context\"),\n        toolsets=function_args.get(\"toolsets\"),\n        tasks=function_args.get(\"tasks\"),\n        max_iterations=function_args.get(\"max_iterations\"),\n        acp_command=function_args.get(\"acp_command\"),\n        acp_args=function_args.get(\"acp_args\"),\n        role=function_args.get(\"role\"),\n        parent_agent=self,\n    )",
        "explanation": "这就是委派的窄腰：会话循环从不自己构造子智能体，它只是把模型的 `delegate_task` 参数（包括 `role`、`tasks`、`toolsets`）连同对 `self` 的引用作为 `parent_agent` 一起，转发给边缘模块 `tools/delegate_tool.py`。注意该文件在当前 checkout 中缺失，因此它实现的实际子智能体构造、角色门禁和并发逻辑是据 AGENTS.md / cli-config.yaml.example 记录的，而非在此直接读到。"
      },
      {
        "caption": "在循环边界处给并发子智能体设上限",
        "file": "run_agent.py",
        "lines": "3274-3302",
        "code": "@staticmethod\ndef _cap_delegate_task_calls(tool_calls: list) -> list:\n    \"\"\"Truncate excess delegate_task calls to max_concurrent_children.\n\n    The delegate_tool caps the task list inside a single call, but the\n    model can emit multiple separate delegate_task tool_calls in one\n    turn.  This truncates the excess, preserving all non-delegate calls.\n\n    Returns the original list if no truncation was needed.\n    \"\"\"\n    from tools.delegate_tool import _get_max_concurrent_children\n    max_children = _get_max_concurrent_children()\n    delegate_count = sum(1 for tc in tool_calls if tc.function.name == \"delegate_task\")\n    if delegate_count <= max_children:\n        return tool_calls\n    kept_delegates = 0\n    truncated = []\n    for tc in tool_calls:\n        if tc.function.name == \"delegate_task\":\n            if kept_delegates < max_children:\n                truncated.append(tc)\n                kept_delegates += 1\n        else:\n            truncated.append(tc)\n    logger.warning(\n        \"Truncated %d excess delegate_task call(s) to enforce \"\n        \"max_concurrent_children=%d limit\",\n        delegate_count - max_children, max_children,\n    )\n    return truncated",
        "explanation": "并发保护有两层：`delegate_tool` 会给一次调用内部的 `tasks: [...]` 列表设上限，而这道护栏则堵住另一条逃生口——模型在单个 assistant 轮次里发出 N 个独立的 `delegate_task` tool_calls。它作为一个调用后护栏被应用在会话循环里（conversation_loop.py:3654），从而让扇出永远无法超过 `delegation.max_concurrent_children`（默认 3），把 API 成本控制在有界范围内。"
      },
      {
        "caption": "每个子智能体都拿到自己的迭代预算",
        "file": "agent/iteration_budget.py",
        "lines": "17-29",
        "code": "class IterationBudget:\n    \"\"\"Thread-safe iteration counter for an agent.\n\n    Each agent (parent or subagent) gets its own ``IterationBudget``.\n    The parent's budget is capped at ``max_iterations`` (default 90).\n    Each subagent gets an independent budget capped at\n    ``delegation.max_iterations`` (default 50) — this means total\n    iterations across parent + subagents can exceed the parent's cap.\n    Users control the per-subagent limit via ``delegation.max_iterations``\n    in config.yaml.\n\n    ``execute_code`` (programmatic tool calling) iterations are refunded via\n    :meth:`refund` so they don't eat into the budget.\n    \"\"\"",
        "explanation": "给每个子智能体配一个属于它自己的线程安全计数器（而不是共享父智能体的），正是委派之所以值得做的原因：一个 40 步的研究子智能体消耗的是它自己那 50 步的预算，没法把父智能体的 90 步饿死。这也是为什么整棵委派树上的总工作量可以正当地超过父智能体的上限——每个隔离的上下文都自带一份预算。"
      },
      {
        "caption": "同步取消：中断父智能体会传播到正在运行的子智能体",
        "file": "run_agent.py",
        "lines": "2335-2342",
        "code": "        # Propagate interrupt to any running child agents (subagent delegation)\n        with self._active_children_lock:\n            children_copy = list(self._active_children)\n        for child in children_copy:\n            try:\n                child.interrupt(message)\n            except Exception as e:\n                logger.debug(\"Failed to propagate interrupt to child agent: %s\", e)",
        "explanation": "因为委派是同步的（父智能体阻塞等待子智能体的摘要），所以对父智能体的一次中断或关闭，必须拆掉它正在进行中的子智能体——这些子智能体被记录在 `self._active_children`（一个由锁保护的列表，在 agent_init.py:466-467 初始化），并且在 `close()` 中也会被清理。这正是为什么持久 / 长时间运行的工作绝不能用 delegate_task：一个本应活得比当前轮次更久的子智能体，会在父智能体的轮次结束时被杀掉。AGENTS.md 指引把这类工作改用 `cronjob` 或 `terminal(background=True, notify_on_complete=True)`。"
      }
    ],
    "gotchas": [
      "tools/delegate_tool.py 在本次 checkout 中缺失。角色裁剪（leaf 不能调用 delegate_task/clarify/memory/send_message/execute_code）、带隔离上下文 + terminal 的子智能体构造、MCP toolset 继承、模型/provider 覆盖，以及子智能体的自动拒绝/批准逻辑全都住在那里，并且是据 AGENTS.md + cli-config.yaml.example 记录的，而非从读到的源码得来。",
      "默认值存在出入：AGENTS.md 说 delegation.max_spawn_depth 默认为 2，但 cli-config.yaml.example（第 920 行）说默认是 1（扁平、无嵌套委派），范围 1-3。应把随发行附带的配置示例当作运行时默认值的权威；把它提到 2 还要求中间层的智能体带上 role=\"orchestrator\" 且 orchestrator_enabled=true。",
      "leaf 是默认角色，并且被刻意剥掉了 delegate_task、clarify、memory、send_message 和 execute_code——一个 leaf 无法进一步扇出，也无法改动共享状态。只有 role=\"orchestrator\" 才保留 delegate_task，而且它同时受 delegation.orchestrator_enabled 和 delegation.max_spawn_depth 的门禁约束。",
      "delegate_task 不是持久的。父智能体阻塞等待子智能体的摘要，而一次中断会取消子智能体（run_agent.py:2335）。对于必须活得比当前轮次更久的工作，应使用 cronjob 或 terminal(background=True, notify_on_complete=True)——用 delegate_task 会在父智能体轮次结束时悄无声息地杀掉这项工作。",
      "存在两个相互独立的并发保护，二者都重要：delegate_tool 给一次调用内部的 tasks:[...] 批次设上限，而 AIAgent._cap_delegate_task_calls（应用在 conversation_loop.py:3654）则给单个 assistant 轮次里独立的 delegate_task tool_calls 数量设上限。只移除其中一个，就会留下一条扇出逃生口。",
      "每个子智能体的预算是独立的（delegation.max_iterations，默认 50），因此整棵树上的总迭代数可以超过父智能体的 max_iterations（90）。agent_init.py:280 只有在没有传入预算对象时才退回到一个共享的 IterationBudget(max_iterations)；真正的逐子智能体隔离，依赖 delegate_tool.py 为每个子智能体传入一份全新的预算——读真实文件时要核实这一点。",
      "子智能体的推理只有在 _delegate_depth > 0 时才会被转送到父智能体的显示（conversation_loop.py:3395），而且只转送第一行的前 80 个字符——子智能体不会把完整的对话记录流式传回，它们返回的是一份提炼过的摘要，这正是让父智能体的上下文和 prompt 缓存保持干净的关键。",
      "subagent_auto_approve 之所以存在，是因为父智能体的 TUI 占着 stdin：一个碰到危险命令批准提示的子智能体，无法在 stdin 上阻塞而不让父智能体死锁，所以它必须以非交互方式解决（默认自动拒绝，若为 true 则自动批准一次）。只在 cron/批处理流水线中才把它打开为 true。"
    ],
    "connects_to": [
      "迭代预算（agent/iteration_budget.py）：每个子智能体都被分到属于它自己的线程安全预算，这正是防止子智能体饿死父智能体轮次的机制。",
      "Toolset / 工具门禁（model_tools.py、toolsets.py）：可以给子智能体一个收窄过的 `toolsets` 列表，而 leaf 角色的子智能体还会在其之上叠加一份固定的拒绝清单。",
      "Prompt 缓存（agent/prompt_caching.py，原则 1）：隔离子智能体上下文，使得只有摘要进入父智能体的前缀，从而保住父智能体的缓存。",
      "中断与生命周期（AIAgent.interrupt / close，run_agent.py）：记录并拆除 _active_children，强制执行同步取消的契约。",
      "Cron（cron/jobs.py）与后台 terminal：对于必须活得比一个轮次更久的工作，这是委派的持久替代方案。",
      "MCP toolset（delegation.inherit_mcp_toolsets）：控制一个带收窄 toolset 的子智能体，是否仍保留父智能体的 MCP 工具。"
    ]
  },
  {
    "id": "errors-providers",
    "title": "错误处理、重试与多提供方",
    "phase": "第四部分 · 横向扩展",
    "one_line": "一个集中式的错误分类器，把每一个 API 异常转化为结构化的恢复决策（带抖动退避的重试、轮换凭据、故障转移到另一个模型/provider、压缩，或直接上报），而一个传输层的“窄腰”让这同一个循环无需按 provider 分支，就能驱动 Anthropic、OpenAI、Gemini、Bedrock 和 Codex。",
    "problem": "朴素的 ReAct 循环只调一次模型 SDK，并假定它会成功。但在生产环境里，每一次 API 调用都可能以十几种不同方式失败——429 限流、402 计费耗尽、401 鉴权失败、500/503 服务过载、TCP 连接被重置、流传输中途的 SSL 警报、上下文溢出、内容策略拒绝，以及被 max_tokens 截断的响应——而它们全都以晦涩的异常形式抛出来。没有分类，循环要么对所有错误盲目重试（对一个会被确定性拒绝的请求反复轰炸，把付费尝试浪费在已耗尽的余额上），要么对所有错误一律中止（杀掉一个本可以靠 5 秒退避或一个 fallback provider 救回来的轮次）。而一个硬编码到某个 SDK 请求/响应结构的循环，永远只能和一个 provider 对话，因此根本做不了故障转移。",
    "design_decision": "Hermes 把韧性拆成两层，每一层都对应项目所宣称的一条原则。(1) 决策与机制分离：`classify_api_error` 是一条按优先级排序的单一流水线（provider 特定模式 → HTTP 状态码 → 错误码 → 消息模式 → SSL → 大会话上的断连 → 传输层启发式 → 未知），它返回一个带纯恢复提示的 `ClassifiedError`——`retryable`、`should_compress`、`should_rotate_credential`、`should_fallback`。`conversation_loop.py` 里的重试循环从不重新解析错误；它只读这些标志。这把过去散落各处的内联字符串匹配集中了起来，因此某个新 provider 古怪的错误措辞只需在一个文件里修。(2) 窄腰（原则 2）：循环调用 `self._get_transport()` 拿到一个 `ProviderTransport`，它唯一的职责就是数据通路——`convert_messages` → `convert_tools` → `build_kwargs` → `normalize_response`，外加 `validate_response`。它明确**不**负责客户端构造、流传输、凭据刷新、prompt 缓存、中断处理或重试逻辑；这些都留在 agent 核心上。这样一来，同一个重试/故障转移循环就能驱动每一个 provider，而新增 Anthropic/OpenAI/Gemini/Bedrock/Codex 成了一件边缘的事（加一个 transport、配一个 adapter），而不是去改核心循环。关键的一点是，故障转移是按轮次划范围的——`restore_primary_runtime` 会在每轮开始时重置回主 provider——所以一次瞬时的故障转移不会永久换掉模型、并悄悄使该会话的 prompt 缓存失效（原则 1：缓存神圣不可侵犯）。退避带抖动（去相关），而不是固定的指数退避，这样命中同一个被限速 provider 的并发会话不会全在同一刻一起重试。",
    "code_snippets": [
      {
        "caption": "分类返回的是恢复提示，而不只是一个标签——循环读这些标志，而不重新解析错误",
        "file": "agent/error_classifier.py",
        "lines": "69-90",
        "code": "@dataclass\nclass ClassifiedError:\n    \"\"\"Structured classification of an API error with recovery hints.\"\"\"\n\n    reason: FailoverReason\n    status_code: Optional[int] = None\n    provider: Optional[str] = None\n    model: Optional[str] = None\n    message: str = \"\"\n    error_context: Dict[str, Any] = field(default_factory=dict)\n\n    # Recovery action hints — the retry loop checks these instead of\n    # re-classifying the error itself.\n    retryable: bool = True\n    should_compress: bool = False\n    should_rotate_credential: bool = False\n    should_fallback: bool = False",
        "explanation": "分类器的输出是一份恢复建议，而不只是一个错误名字：429 返回 `retryable`+`should_rotate_credential`+`should_fallback`，402 计费耗尽返回不可重试+`should_rotate`+`should_fallback`，内容策略拦截返回不可重试+`should_fallback`。把决策（这里）与机制（循环）分开，正是让一个循环不靠一堆缠绕的内联 if 语句，就能处理几十种失败模式的关键。"
      },
      {
        "caption": "402 的消歧：并非每一个“付款”错误都是终态——一个会重置的瞬时配额必须重试，而非中止",
        "file": "agent/error_classifier.py",
        "lines": "902-928",
        "code": "def _classify_402(error_msg: str, result_fn) -> ClassifiedError:\n    \"\"\"Disambiguate 402: billing exhaustion vs transient usage limit.\n\n    The key insight from OpenClaw: some 402s are transient rate limits\n    disguised as payment errors.  \"Usage limit, try again in 5 minutes\"\n    is NOT a billing problem — it's a periodic quota that resets.\n    \"\"\"\n    # Check for transient usage-limit signals first\n    has_usage_limit = any(p in error_msg for p in _USAGE_LIMIT_PATTERNS)\n    has_transient_signal = any(p in error_msg for p in _USAGE_LIMIT_TRANSIENT_SIGNALS)\n\n    if has_usage_limit and has_transient_signal:\n        # Transient quota — treat as rate limit, not billing\n        return result_fn(\n            FailoverReason.rate_limit,\n            retryable=True,\n            should_rotate_credential=True,\n            should_fallback=True,\n        )\n\n    # Confirmed billing exhaustion\n    return result_fn(\n        FailoverReason.billing,\n        retryable=False,\n        should_rotate_credential=True,\n        should_fallback=True,\n    )",
        "explanation": "这正是集中式分类器存在意义所在的那种 provider 特定微妙差别：同一个 HTTP 402，对某个 provider 意味着“5 分钟后重试”，对另一个则意味着“你的余额为零，停下”，二者仅凭消息措辞来区分。把瞬时情况误判为计费，会中止一个本可恢复的轮次；把终态情况误判为可重试，则会把付费请求浪费在一个已经死掉的余额上。"
      },
      {
        "caption": "带抖动的退避把并发重试去相关，这样多个会话不会一起冲击同一个被限速的 provider",
        "file": "agent/retry_utils.py",
        "lines": "41-57",
        "code": "    global _jitter_counter\n    with _jitter_lock:\n        _jitter_counter += 1\n        tick = _jitter_counter\n\n    exponent = max(0, attempt - 1)\n    if exponent >= 63 or base_delay <= 0:\n        delay = max_delay\n    else:\n        delay = min(base_delay * (2 ** exponent), max_delay)\n\n    # Seed from time + counter for decorrelation even with coarse clocks.\n    seed = (time.time_ns() ^ (tick * 0x9E3779B9)) & 0xFFFFFFFF\n    rng = random.Random(seed)\n    jitter = rng.uniform(0, jitter_ratio * delay)\n\n    return delay + jitter",
        "explanation": "退避是指数式的（`base * 2^(attempt-1)`，上限 `max_delay`）再加上一个随机抖动项。进程级的单调计数器被混入 RNG 种子，保证两个在同一纳秒触发的重试仍能拿到不同的延迟——这样一大批同时被限速的网关会话会把各自的重试错开，而不是同步成一群“惊群”再次触发限制。"
      },
      {
        "caption": "重试循环读取分类的标志，并在重试、故障转移、上报之间做路由",
        "file": "agent/conversation_loop.py",
        "lines": "3102-3120",
        "code": "                if retry_count >= max_retries:\n                    # Before falling back, try rebuilding the primary\n                    # client once for transient transport errors (stale\n                    # connection pool, TCP reset).  Only attempted once\n                    # per API call block.\n                    if not _retry.primary_recovery_attempted and agent._try_recover_primary_transport(\n                        api_error, retry_count=retry_count, max_retries=max_retries,\n                    ):\n                        _retry.primary_recovery_attempted = True\n                        retry_count = 0\n                        continue\n                    # Try fallback before giving up entirely\n                    if agent._has_pending_fallback():\n                        agent._buffer_status(f\"⚠️ Max retries ({max_retries}) exhausted — trying fallback...\")\n                    if agent._try_activate_fallback():\n                        retry_count = 0\n                        compression_attempts = 0\n                        _retry.primary_recovery_attempted = False\n                        continue",
        "explanation": "当重试次数耗尽时，循环并不会立刻放弃：它会先把主客户端重建一次（应对连接池失效/TCP 重置），然后沿 fallback 链走下去。`_try_activate_fallback` 原地换掉客户端/模型/provider 并重置 `retry_count`，于是同一个循环就接着对下一个后端继续跑——故障转移的机制，对该轮的其余部分是不可见的。"
      },
      {
        "caption": "窄腰：一个 transport 只负责数据通路，从不负责重试/缓存/凭据",
        "file": "agent/transports/base.py",
        "lines": "1-32",
        "code": "\"\"\"Abstract base for provider transports.\n\nA transport owns the data path for one api_mode:\n  convert_messages → convert_tools → build_kwargs → normalize_response\n\nIt does NOT own: client construction, streaming, credential refresh,\nprompt caching, interrupt handling, or retry logic.  Those stay on AIAgent.\n\"\"\"\n\nfrom abc import ABC, abstractmethod\nfrom typing import Any, Dict, List, Optional\n\nfrom agent.transports.types import NormalizedResponse\n\n\nclass ProviderTransport(ABC):\n    \"\"\"Base class for provider-specific format conversion and normalization.\"\"\"\n\n    @property\n    @abstractmethod\n    def api_mode(self) -> str:\n        \"\"\"The api_mode string this transport handles (e.g. 'anthropic_messages').\"\"\"\n        ...\n\n    @abstractmethod\n    def convert_messages(self, messages: List[Dict[str, Any]], **kwargs) -> Any:\n        \"\"\"Convert OpenAI-format messages to provider-native format.",
        "explanation": "这段 docstring 就是原则 2 的字面陈述。每个 provider 都被收敛成四个转换方法外加 normalize/validate，全都返回共享的 `NormalizedResponse` 类型。因为重试、故障转移、prompt 缓存和凭据轮换都住在核心里（而不在 transport 里），所以新增一个 provider 永远不会意外破坏这些横切行为——而那唯一的重试循环对它们所有人都一模一样地工作。"
      },
      {
        "caption": "被截断/受长度限制的响应会被救回来，而不是判定失败：要么续写该轮，要么提高 max_tokens",
        "file": "agent/conversation_loop.py",
        "lines": "1477-1508",
        "code": "                            if truncated_tool_call_retries < 3:\n                                truncated_tool_call_retries += 1\n                                if _is_stub_stall:\n                                    # The stream broke mid tool-call (network /\n                                    # peer-closed connection), not a real output\n                                    # cap — say so instead of \"max output tokens\".\n                                    agent._buffer_vprint(\n                                        f\"⚠️  Stream interrupted mid tool-call — \"\n                                        f\"retrying ({truncated_tool_call_retries}/3)...\"\n                                    )\n                                else:\n                                    agent._buffer_vprint(\n                                        f\"⚠️  Truncated tool call detected — \"\n                                        f\"retrying API call \"\n                                        f\"({truncated_tool_call_retries}/3)...\"\n                                    )\n                                # Boost max_tokens on each retry so the model has\n                                # more room to complete the tool-call JSON. A\n                                # network stall doesn't need a bigger budget, but\n                                # a genuine output-cap truncation does, and the\n                                # boost is harmless for the stall case.\n                                _tc_boost_base = agent.max_tokens if agent.max_tokens else 4096\n                                _tc_boost = _tc_boost_base * (truncated_tool_call_retries + 1)\n                                _tc_requested_cap = agent._requested_output_cap_from_api_kwargs(api_kwargs)\n                                if _tc_requested_cap is not None:\n                                    _tc_boost = max(_tc_boost, _tc_requested_cap)\n                                _tc_boost_cap = max(32768, _tc_requested_cap or 0)\n                                agent._ephemeral_max_output_tokens = min(_tc_boost, _tc_boost_cap)\n                                # Don't append the broken response to messages;\n                                # just re-run the same API call from the current\n                                # message state, giving the model another chance.\n                                continue",
        "explanation": "一个被输出 token 上限截断（`finish_reason=length`）、并带着一个只写到一半的 tool call 的响应，根本不是异常——它是一个结构上残缺的“成功”。Hermes 在 3 次尝试内处理两个子情况：纯文本截断会被追加一个续写提示（`length_continue_retries`，第 1413-1457 行），而被截断的 tool call 则会重跑同一个调用，每次重试都把 max_tokens 提高，好让模型有空间把那段 JSON 写完。残缺的响应在重试前被刻意**不**追加进历史。"
      }
    ],
    "gotchas": [
      "`classify_api_error` 里的顺序是承重的。内容策略拦截和 Anthropic 的 thinking-signature 错误会在状态码分类**之前**被检查，这样一个 400 安全拦截才不会被降级成一个通用的 `format_error`；多模态-tool-content 和图片过大的 400 会在 `context_overflow` **之前**被检查，因为它们共用子串（'exceeds'、'image'）但需要更便宜的恢复方式；一个 'Unsupported parameter: max_tokens' 的 400 必须先被当成不可重试的 `format_error` 捕获，否则字面子串 'max_tokens' 会触发上下文溢出的路径。",
      "有些确定性的请求校验错误会带着 5xx 状态码到来（例如 codex.nekos.me 对未知参数返回 502）。通用的 '5xx → 可重试 server_error' 规则会把一个坏请求变成重试洪流，所以 `_classify_by_status` 对 500/502 响应体里的 `_REQUEST_VALIDATION_PATTERNS` 做特判，让它作为不可重试的 `format_error` 快速失败。",
      "在一个**大**会话上，一次裸的服务器断连会被当成上下文溢出（压缩），但在一个小会话上则被当成瞬时超时（重试）。SSL/TLS 警报模式会在断连路径**之前**被检查，正是为了让一个大会话上的不稳定 TLS 抖动不会错误地触发昂贵的上下文压缩。",
      "故障转移是按轮次划范围的，不是永久的。`restore_primary_runtime()` 在每轮开头运行，把 `agent.provider`/`model`/`client` 重置回主 provider——否则一次瞬时的故障转移会把整个会话钉死在 fallback provider 上，在对话中途换掉模型、并使该会话的 prompt 缓存失效（违反原则 1）。即使没激活过任何 fallback，它也会重置 `_fallback_index`，否则一个搁浅的 index 会悄悄阻塞掉后续所有故障转移（issue #20465）。",
      "`try_activate_fallback` 会对那些解析到当前 (provider, model) 的链条条目去重——甚至对不同 `custom_providers` 条目却有相同 `base_url` 的情况也去重——因为故障转移到那个刚刚失败的后端，只会把失败循环一遍（issue #22548）。",
      "402 计费被刻意**不**放进“恢复后可重试”的排除集合里：当循环走到 client-error 分支时，凭据池轮换和积极的故障转移都已触发过并放弃了，所以从那里再把 402 当成可重试，只会把更多付费请求浪费在一个已耗尽的余额上（issue #31273）。",
      "403 被各 provider 滥用得很厉害：OpenRouter 的 '403 key limit exceeded' 以及好几家 provider 的套餐/额度耗尽实际上属于计费，所以 `_classify_by_status` 会在 403 分支里先检查计费模式，再默认归为鉴权。",
      "`_get_transport` 会在 agent 上按 api_mode 缓存一个 transport 实例，而这个缓存必须在每一次 provider/api_mode 切换时（激活 fallback、恢复主 provider、切换模型）被清空（`_transport_cache.clear()`），否则 agent 会拿着上一个 provider 的数据通路转换去对付新的客户端。"
    ],
    "connects_to": [
      "凭据池轮换（credential_pool.py / _recover_with_credential_pool）：should_rotate_credential 驱动多 key 轮换，作为一个在故障转移之前运行的恢复步骤",
      "上下文压缩引擎（context_compressor.py / context_engine.py）：should_compress 把 context_overflow / payload_too_large / long_context_tier 错误路由进压实，而不是故障转移（这是“缓存神圣不可侵犯”这条原则唯一获许的例外）",
      "prompt 缓存（prompt_caching.py）：按轮次划范围的故障转移 + restore_primary_runtime 的存在，正是为了保护被缓存的会话前缀不被一次瞬时的 provider 切换所失效",
      "provider 路由（hermes_cli/providers.py determine_api_mode + TRANSPORT_TO_API_MODE）：把一个 provider/base_url 映射到 transport 窄腰据以分发的某个已注册 api_mode",
      "流传输 + 响应归一化（agent/transports/*.py、*adapter*.py）：这些 adapter（anthropic_adapter、bedrock_adapter、codex_responses_adapter、gemini_cloudcode_adapter、gemini_native_adapter、azure_identity_adapter）提供 transport 所封装的各 provider 转换",
      "fallback 链配置（agent_init.py）：从 fallback_model 配置（单个 dict 或一个 list）构建 agent._fallback_chain，try_activate_fallback 会在耗尽时沿着它走"
    ]
  },
  {
    "id": "cron-kanban",
    "title": "定时任务与 Agent 队列",
    "phase": "第四部分 · 横向扩展",
    "one_line": "Hermes 加了一个持久化的、带文件锁的 cron 调度器，能按计时器运行临时智能体（具备投递、去重和安全防护），外加一个由 SQLite 支撑的 kanban 看板，多个 worker 可以在看板/租户隔离下原子地认领并执行任务。",
    "problem": "裸 ReAct 循环只在用户处于某个对话轮次内时才干活——轮次一结束，智能体就消失了。它没办法表达“每天早上 9 点检查一下这个”“盯着磁盘，有情况就提醒我”或“把这个 200 个任务的迁移分摊到一队 worker 上跑”。委派（delegate_task）解决不了这个问题：AGENTS.md 指出委派**不是**持久的——被委派的子任务仍然存活并消亡于父级的轮次之内。没有定时任务，任何必须比当前轮次活得更久的工作就根本无法存在；没有共享队列，你就没法把长时间运行的工作扇出到多个智能体上，否则两个 worker 会抢到同一个任务、互相破坏彼此的状态。",
    "design_decision": "cron 被构建成一根窄腰（原则 2）：唯一持久化的状态是 jobs.json 加上每个任务的输出目录，而所有更丰富的能力——多平台投递、技能、运行前脚本、no_agent 看门狗、工作目录上下文——都作为可选的任务字段住在边缘，并且是在触发时（而非创建时）才解析，因此一个在 Telegram 接通之前写好的任务，之后也能把它用上。gateway 每 60 秒调一次 tick()；tick() 从不阻塞 ticker 线程（用即发即忘的线程池），所以一个 15 分钟的任务不会饿死整个调度计划。两条不变量保护正确性：一个文件锁（通过 fcntl/msvcrt 实现的 ~/.hermes/cron/.tick.lock）保证即使一个独立守护进程和 gateway 内置的 ticker 同时存在，也只有一次 tick 在运行；并且 advance_next_run() 是在该锁下、在任何任务执行**之前**就被调用——这把循环任务从“至少一次”转换成“至多一次”，从而在运行中途崩溃后，重启时不会重放几十次触发。对原则 1（每会话的 prompt 缓存神圣不可侵犯）至关重要的是：cron 运行在它**自己的**隔离 session 里，带着 skip_memory=True，并且永远不会被镜像进用户的 gateway session，因为把 cron 的系统提示 / 投递内容注入到活跃对话里，会破坏 memory 表征，并打断 prompt 缓存所依赖的消息角色交替。kanban 把同样的窄腰理念扩展到多智能体工作上：持久状态是每个看板一个 SQLite DB，而原子性在单一一点上强制保证——一个 compare-and-swap 式的 UPDATE ... WHERE status='ready' AND claim_lock IS NULL——因此并发安全并不依赖 worker 之间的相互配合。",
    "code_snippets": [
      {
        "caption": "tick 文件锁：同一时刻只有一次调度器 tick 在运行，跨进程也是如此",
        "file": "cron/scheduler.py",
        "lines": "1984-2018",
        "code": "    lock_dir, lock_file = _get_lock_paths()\n    lock_dir.mkdir(parents=True, exist_ok=True)\n\n    # Cross-platform file locking: fcntl on Unix, msvcrt on Windows\n    lock_fd = None\n    try:\n        lock_fd = open(lock_file, \"w\", encoding=\"utf-8\")\n        if fcntl:\n            fcntl.flock(lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)\n        elif msvcrt:\n            msvcrt.locking(lock_fd.fileno(), msvcrt.LK_NBLCK, 1)\n    except (OSError, IOError):\n        logger.debug(\"Tick skipped — another instance holds the lock\")\n        if lock_fd is not None:\n            lock_fd.close()\n        return 0\n\n    try:\n        due_jobs = get_due_jobs()\n...\n        # Advance next_run_at for all recurring jobs FIRST, under the file lock,\n        # before any execution begins.  This preserves at-most-once semantics.\n        for job in due_jobs:\n            advance_next_run(job[\"id\"])",
        "explanation": "一个非阻塞的排他 flock 守护整个 tick；如果第二个进程拿不到它，这次 tick 会被跳过，而不是去跑重复的任务。每个到期的循环任务的 next_run_at 都在同一把锁下、在任何执行**之前**就被推进，所以一次运行中途的崩溃不会在重启时重放该任务。"
      },
      {
        "caption": "在途去重防护：上一次 tick 留下的、仍在运行的任务永远不会被重新入队",
        "file": "cron/scheduler.py",
        "lines": "2100-2122",
        "code": "        def _submit_with_guard(job: dict, pool: concurrent.futures.ThreadPoolExecutor):\n            \"\"\"Submit a job fire-and-forget with the in-flight dedup guard.\"\"\"\n            job_id = job[\"id\"]\n            with _running_lock:\n                if job_id in _running_job_ids:\n                    logger.info(\"Job '%s' already running — skipping\", job.get(\"name\", job_id))\n                    return None\n                _running_job_ids.add(job_id)\n            _ctx = contextvars.copy_context()\n\n            def _run_and_release(j=job, ctx=_ctx):\n                try:\n                    return ctx.run(_process_job, j)\n                finally:\n                    with _running_lock:\n                        _running_job_ids.discard(j[\"id\"])\n\n            return pool.submit(_run_and_release)",
        "explanation": "文件锁对并发的多次 tick 去重；而这个内存里的 _running_job_ids 集合，在一个进程内跨多次 tick 去重，因此一个跨越多个 60 秒 tick 的长任务在它完成之前会被跳过（而不是被重复运行）。派发是即发即忘地丢进一个常驻线程池，所以 ticker 线程永远不会被阻塞。"
      },
      {
        "caption": "cron 智能体以 skip_memory=True 隔离运行，永不碰用户的 session",
        "file": "cron/scheduler.py",
        "lines": "1743-1756",
        "code": "            enabled_toolsets=_resolve_cron_enabled_toolsets(job, _cfg),\n            disabled_toolsets=_resolve_cron_disabled_toolsets(_cfg),\n            quiet_mode=True,\n            # Cron jobs should always inherit the user's SOUL.md identity from\n            # HERMES_HOME. When a workdir is configured, also inject project\n            # context files (AGENTS.md / CLAUDE.md / .cursorrules) from there.\n            skip_context_files=not bool(_job_workdir),\n            load_soul_identity=True,\n            skip_memory=True,  # Cron system prompts would corrupt user representations\n            platform=\"cron\",\n            session_id=_cron_session_id,\n            session_db=_session_db,",
        "explanation": "每次 cron 运行都会在它自己的 cron_<id>_<ts> session 里构建一个全新的 AIAgent，并带上 skip_memory=True，因此这个无人值守的调度器不会污染用户的 memory 画像，也不会污染活跃对话的 prompt 缓存。_resolve_cron_disabled_toolsets 总是剥掉 cronjob/messaging/clarify，这样一个 cron 智能体既不能去调度更多 cron 任务，也不能阻塞着等待交互式输入。"
      },
      {
        "caption": "补跑宽限窗口：取周期的一半、夹在 120 秒到 2 小时之间，决定补跑还是快进",
        "file": "cron/jobs.py",
        "lines": "341-356",
        "code": "def _compute_grace_seconds(schedule: dict) -> int:\n    \"\"\"Compute how late a job can be and still catch up instead of fast-forwarding.\n\n    Uses half the schedule period, clamped between 120 seconds and 2 hours.\n    This ensures daily jobs can catch up if missed by up to 2 hours,\n    while frequent jobs (every 5-10 min) still fast-forward quickly.\n    \"\"\"\n    MIN_GRACE = 120\n    MAX_GRACE = 7200  # 2 hours\n\n    kind = schedule.get(\"kind\")\n\n    if kind == \"interval\":\n        period_seconds = schedule.get(\"minutes\", 1) * 60\n        grace = period_seconds // 2\n        return max(MIN_GRACE, min(grace, MAX_GRACE))",
        "explanation": "当 gateway 曾经宕机、错过了某个触发时刻时，get_due_jobs() 会把迟到的时长和这个宽限窗口对比：在宽限范围内的话，任务就补跑、现在执行；超过宽限的话，就被快进到下一次发生时刻，这样重启不会触发一连串过时的运行。一次性任务拿到的是固定的 120 秒宽限（ONESHOT_GRACE_SECONDS），所以一个刚创建就晚了几秒的任务仍然会触发。"
      },
      {
        "caption": "kanban 原子认领：一个 compare-and-swap 是唯一的并发安全点",
        "file": "hermes_cli/kanban_db.py",
        "lines": "3033-3047",
        "code": "        cur = conn.execute(\n            \"\"\"\n            UPDATE tasks\n               SET status        = 'running',\n                   claim_lock    = ?,\n                   claim_expires = ?,\n                   started_at    = COALESCE(started_at, ?)\n             WHERE id = ?\n               AND status = 'ready'\n               AND claim_lock IS NULL\n            \"\"\",\n            (lock, expires, now, task_id),\n        )\n        if cur.rowcount != 1:\n            return None",
        "explanation": "两个 worker 抢着认领同一个任务时都会跑这条 UPDATE，但 SQLite 会把写事务串行化：恰好有一个看到 rowcount==1 并获胜；另一个拿到 0 行并返回 None。这让队列在不依赖任何超出 DB 本身的跨进程协调下就能保持安全——这就是窄腰。"
      },
      {
        "caption": "worker 启动时把看板（和租户）钉进子进程的环境变量，作为一道硬边界",
        "file": "hermes_cli/kanban_db.py",
        "lines": "6725-6766",
        "code": "    if task.tenant:\n        env[\"HERMES_TENANT\"] = task.tenant\n    env[\"HERMES_KANBAN_TASK\"] = task.id\n    env[\"HERMES_KANBAN_WORKSPACE\"] = workspace\n...\n    env[\"HERMES_KANBAN_DB\"] = str(kanban_db_path(board=board))\n    env[\"HERMES_KANBAN_WORKSPACES_ROOT\"] = str(workspaces_root(board=board))\n    # Board slug — the final defense-in-depth pin. If the worker ever\n    # resolves kanban paths without the DB / workspaces env vars, the\n    # board slug still forces it to the right directory.\n    resolved_board = _normalize_board_slug(board) or get_current_board()\n    env[\"HERMES_KANBAN_BOARD\"] = resolved_board",
        "explanation": "调度器在启动每个 worker 时钉死了 HERMES_KANBAN_BOARD/DB/WORKSPACES_ROOT，因此一个 worker 在物理上就不可能去解析或改动另一个看板——看板是那道硬隔离边界。租户则是看板内部一个更软的命名空间（对工作区路径 + memory key 做作用域限定），这样一支 worker 队伍可以服务多个业务。"
      }
    ],
    "gotchas": [
      "AGENTS.md（第 1042 行）宣称 cron session 上有一个“3 分钟硬中断”，但 scheduler.py 的实际实现是一个**不活跃**超时，默认 600 秒（10 分钟），可通过 HERMES_CRON_TIMEOUT 覆盖，设为 0 表示无限制（cron/scheduler.py:1762-1778）。该超时只在连续 N 秒没有任何工具调用 / API 调用 / 流式增量（agent.get_activity_summary()）之后才触发，然后调用 agent.interrupt()；一个正在积极工作的任务可以跑上几个小时。把 AGENTS.md 的“3 分钟”当作所声明的意图，而不是这份代码里的字面默认值。",
      "advance_next_run() 只推进 cron/interval 任务；一次性任务被刻意保持不变，这样它们在重启后仍能重试（cron/jobs.py:946-947）。这就是“循环任务至多一次 / 一次性任务至少一次”的切分。",
      "skip_memory=True 对 cron 来说没得商量：注释“Cron system prompts would corrupt user representations”就是原因。memory 提供方在 cron 期间被有意地不运行，并且 cron 的投递永远不会被镜像进活跃的 gateway session——它们活在自己的 session 里，带一个头/尾框架以保持消息角色交替（以及 prompt 缓存）完好。",
      "cron 为每个任务强制禁用 cronjob、messaging 和 clarify 这几个 toolset（cron/scheduler.py:_resolve_cron_disabled_toolsets），无论任务自己的 enabled_toolsets 是什么——一个 cron 智能体绝不能去调度更多 cron 任务，也不能阻塞在交互式输入上。用户 config.yaml 里的 disabled_toolsets 会叠加在其上，因此单个任务的覆盖配置无法放宽这条策略。",
      "设了 workdir 的任务会改动进程全局的 os.environ['TERMINAL_CWD']，所以 tick() 把它们划进一个单线程的顺序池，而没有 workdir 的任务在并行池里运行——并行跑 workdir 任务会破坏彼此的 cwd。",
      "kanban 的 max_spawn 是一个**实时**并发上限（统计已经处于 status='running' 的任务加上本次 tick 要启动的任务数），**不是**每次 tick 的预算——在 60 秒的 tick 上按“每次 tick”来解读，会让并发无界增长，因为 'running' 的任务不会仅凭完成就被释放，只有 kanban_complete/kanban_block 或一次 TTL 回收才会释放它。",
      "release_stale_claims 并不会盲目地回收每一个过期的 TTL：如果 worker 的本机 PID 还活着，它会**延长**认领（缓慢的、不调工具的 LLM 调用不会发心跳），除非 last_heartbeat_at 已经陈旧到超过约 1 小时——这标志着一个卡死的逻辑循环，于是无论如何都回收。",
      "组装好的 cron prompt（用户 prompt + 运行时加载的技能 markdown + 注入的脚本/上游任务数据）会在触发时被重新扫描注入风险，因为 cron 会自动批准工具调用；创建时的扫描只覆盖了用户提供的 prompt 字段，给一个在运行时加载的恶意技能留下了缺口。"
    ],
    "connects_to": [
      "技能（skills_tool / skill_bundles）：cron 任务可以在触发时通过 _build_job_prompt 按名称或 bundle 加载技能，并且 curator 在合并/修剪技能时会重写 cron 的技能引用（rewrite_skill_refs）。",
      "委派 / 子智能体：这是明确的反例对照——delegate_task 不是持久的、会随轮次消亡，因此持久的工作必须改用 cronjob 或 terminal(background=True, notify_on_complete=True)。",
      "多平台投递（send_message_tool、gateway 适配器）：cron 在触发时解析投递目标（来源 / 平台主频道 / 显式的 platform:chat:thread / 'all' 路由 token），并且对 E2EE 房间优先使用一个活跃的 gateway 适配器，否则回退到独立的 HTTP 发送。",
      "memory 子系统：cron 的 skip_memory=True 是反向契约——定时运行被刻意排除在外，因此它们不会破坏用户的 memory 表征。",
      "gateway ticker 循环：gateway 每 60 秒调一次 tick()，并且在进程内承载 kanban 调度器（kanban.dispatch_in_gateway），使这两个子系统都随 gateway 守护进程一起启动。",
      "会话持久化（hermes_state.SessionDB）：cron 运行会被记录为它们自己的、可搜索的 session，并带有有意义的标题，可通过 session_search 发现。"
    ]
  },
  {
    "id": "system-prompt-turn",
    "title": "融会贯通:对话轮次的生命周期",
    "phase": "第五部分 · 完整的机器",
    "one_line": "Hermes 在每个 session 中只组装一次系统提示，由分层的部分（身份、工具指引、技能、上下文文件、记忆）拼成，逐字缓存以复用前缀缓存，并用固定的序章/尾声包裹每一轮，分别处理初始化和轮次结束后的复盘钩子。",
    "problem": "朴素的 ReAct 循环在每轮都重建它的系统提示——重读 SOUL.md、重扫技能目录、重打精确到分钟的时间戳——并把每轮当作一整块不加区分的代码来跑。这会带来两个问题。第一，任何在轮次之间变化的字节（一个新鲜的时间戳、一份重排过的技能列表）都会让上游的 KV 前缀缓存失效，于是提供方在每一轮都对整个数千 token 的提示重新计费，而不是从缓存里读它。第二，由于没有明确的轮次边界，就没有一个固定的地方来一致地放置每轮一次的初始化工作（计数器重置、压缩、消息清洗）或轮次结束后的工作（轨迹保存、记忆复盘），于是这些逻辑就散落在整个循环里，触发得也不一致。",
    "design_decision": "Hermes 把系统提示当作一个不可变的整块（blob），每个 session 只构建一次，从不在对话进行中重新渲染——这直接落实原则 1（“每会话的 prompt 缓存神圣不可侵犯”）。为了让“只构建一次”足够安全，提示被组合成三个按缓存顺序排列的层级（stable → context → volatile），让最稳定的字节排在最前面；即便是 volatile 这一层也被设计得字节稳定：时间戳只精确到日期、而非分钟（PR #20451），因为按分钟变化会让每一条重建路径都使 KV 前缀失效。在续接轮次上，会从 session 数据库里逐字恢复之前那个提示，而不是重建它，因此即便一个每轮都新建 AIAgent 的 gateway 也仍能命中缓存。唯一获许的重建是上下文压缩，它会显式地让缓存失效。轮次本身被赋予了硬性的序章/尾声结构：build_turn_context 产出循环的输入，finalize_turn 组装结果并触发轮次结束后的钩子。这让核心保持为一根窄腰（原则 2）——昂贵的每轮一次的工作和能力钩子都落在有命名的接缝处，而不是穿插进工具调用循环里，新增能力（记忆复盘、技能提示、插件）插入到尾声中，而非让核心循环膨胀。",
    "code_snippets": [
      {
        "caption": "三个按缓存顺序排列的层级，只拼接一次并在整个 session 生命周期内缓存",
        "file": "agent/system_prompt.py",
        "lines": "385-401",
        "code": "def build_system_prompt(agent: Any, system_message: Optional[str] = None) -> str:\n    \"\"\"Assemble the full system prompt from all layers.\n\n    Called once per session (cached on ``agent._cached_system_prompt``) and\n    only rebuilt after context compression events. This ensures the system\n    prompt is stable across all turns in a session, maximizing prefix cache\n    hits.\n\n    Layers are ordered cache-friendly: stable identity/guidance first,\n    then session-stable context files, then per-call volatile content\n    (memory, USER profile, timestamp).  The whole string is treated as\n    one cached block — Hermes never rebuilds or reinjects parts of it\n    mid-session, which is the only way to keep upstream prompt caches\n    warm across turns.\n    \"\"\"\n    parts = build_system_prompt_parts(agent, system_message=system_message)\n    return \"\\n\\n\".join(p for p in (parts[\"stable\"], parts[\"context\"], parts[\"volatile\"]) if p)",
        "explanation": "build_system_prompt 是唯一的组合点：它取得三个有命名的层级，并以最利于缓存的顺序把它们拼起来。docstring 直接道出了这条不变量——只构建一次，仅在压缩之后才重建——所以整个字符串就是一个缓存块，绝不会在 session 进行中被部分重新渲染。"
      },
      {
        "caption": "连 volatile 层也保持字节稳定：时间戳只精确到日期，而非分钟",
        "file": "agent/system_prompt.py",
        "lines": "361-376",
        "code": "    from hermes_time import now as _hermes_now\n    now = _hermes_now()\n    # Date-only (not minute-precision) so the system prompt is byte-stable\n    # for the full day.  Minute-precision changes invalidate prefix-cache KV\n    # on every rebuild path (compression boundary, fresh-agent gateway turns,\n    # session resume without a stored prompt).  The model can still query the\n    # exact wall-clock time via tools when it actually needs it.\n    # Credit: @iamfoz (PR #20451).\n    timestamp_line = f\"Conversation started: {now.strftime('%A, %B %d, %Y')}\"\n    if agent.pass_session_id and agent.session_id:\n        timestamp_line += f\"\\nSession ID: {agent.session_id}\"\n    if agent.model:\n        timestamp_line += f\"\\nModel: {agent.model}\"\n    if agent.provider:\n        timestamp_line += f\"\\nProvider: {agent.provider}\"\n    volatile_parts.append(timestamp_line)",
        "explanation": "这是在单独一行的层面上捍卫缓存不变量。时间戳被渲染到天的粒度，这样一天之内的每一条重建路径都会产出完全相同的字节；这里若用精确到分钟，就会悄无声息地把前缀缓存击穿。它是原则 1 塑造一行决策的最清晰例子。"
      },
      {
        "caption": "续接轮次逐字复用已存储的提示，使提供方的缓存前缀得以匹配",
        "file": "agent/conversation_loop.py",
        "lines": "274-295",
        "code": "    if stored_prompt:\n        # Continuing session — reuse the exact system prompt from the\n        # previous turn so the Anthropic cache prefix matches.\n        agent._cached_system_prompt = stored_prompt\n        return\n\n    if conversation_history and stored_state in (\"null\", \"empty\"):\n        # Continuing session whose stored prompt is unusable.  The\n        # previous turn's write either never happened or wrote an empty\n        # string — either way every turn now rebuilds and the prefix\n        # cache misses every time.\n        logger.warning(\n            \"Stored system prompt for session %s is %s; rebuilding \"\n            \"from scratch this turn. Prefix cache will miss until \"\n            \"the rebuild persists. Investigate the previous turn's \"\n            \"update_system_prompt write path.\",\n            agent.session_id, stored_state,\n        )\n\n    # First turn of a new session (or recovering from a broken stored\n    # prompt) — build from scratch.\n    agent._cached_system_prompt = agent._build_system_prompt(system_message)",
        "explanation": "通过把提示持久化到 session 数据库、并逐字恢复，“只构建一次”得以跨进程边界强制执行。gateway 每轮都新建一个 AIAgent，所以如果没有这趟数据库往返，缓存就会每轮都未命中——因此一个缺失/为空的已存储提示会以 WARNING 级别记录日志，把一次悄无声息的缓存未命中当作 bug 来对待。"
      },
      {
        "caption": "轮次序章：系统提示的恢复或构建只发生一次，并以缓存为门控",
        "file": "agent/turn_context.py",
        "lines": "232-246",
        "code": "    # ── System prompt (cached per session for prefix caching) ──\n    if agent._cached_system_prompt is None:\n        restore_or_build_system_prompt(agent, system_message, conversation_history)\n\n    active_system_prompt = agent._cached_system_prompt\n\n    # Crash-resilience: persist the inbound user turn as soon as the session row exists.\n    try:\n        agent._persist_session(messages, conversation_history)\n    except Exception:\n        logger.warning(\n            \"Early turn-start session persistence failed for session=%s\",\n            agent.session_id or \"none\",\n            exc_info=True,\n        )",
        "explanation": "build_turn_context 是每轮的序章；这段摘录显示，提示只在缓存槽为空时才（重新）构建，然后被冻结成 active_system_prompt 供本轮使用。序章还会重置重试计数器、清洗输入、跑预检压缩，并触发 pre_llm_call 这个插件钩子——这些都是每轮一次的初始化工作，否则它们会被散布在循环的内联代码里。"
      },
      {
        "caption": "轮次尾声：在响应交付之后保存轨迹，并触发后台的记忆/技能复盘",
        "file": "agent/turn_finalizer.py",
        "lines": "375-401",
        "code": "    # Check skill trigger NOW — based on how many tool iterations THIS turn used.\n    _should_review_skills = False\n    if (agent._skill_nudge_interval > 0\n            and agent._iters_since_skill >= agent._skill_nudge_interval\n            and \"skill_manage\" in agent.valid_tool_names):\n        _should_review_skills = True\n        agent._iters_since_skill = 0\n\n    # External memory provider: sync the completed turn + queue next prefetch.\n    agent._sync_external_memory_for_turn(\n        original_user_message=original_user_message,\n        final_response=final_response,\n        interrupted=interrupted,\n        messages=messages,\n    )\n\n    # Background memory/skill review — runs AFTER the response is delivered\n    # so it never competes with the user's task for model attention.\n    if final_response and not interrupted and (_should_review_memory or _should_review_skills):\n        try:\n            agent._spawn_background_review(\n                messages_snapshot=list(messages),\n                review_memory=_should_review_memory,\n                review_skills=_should_review_skills,\n            )\n        except Exception:\n            pass  # Background review is best-effort",
        "explanation": "finalize_turn 就是尾声。记忆复盘的触发条件在序章中按轮次计算（should_review_memory），而技能复盘的触发条件在这里根据本轮的 iteration 计数计算，二者都会扇出到一个后台复盘，该复盘仅在用户的响应交付之后才运行。轨迹保存和 session 持久化（第 133/143 行）也位于此处，让每一轮都有一致的收尾。"
      }
    ],
    "gotchas": [
      "这三个层级并不是为了模块化而模块化——它们按 stable→context→volatile 排序，好让最不可能变化的字节坐在前缀的最前端，从而最大化能存活下来的、被缓存的 KV 前缀。重排这些部分（例如把记忆放在身份之前）不会改变语义，却会缩小可缓存的前缀。",
      "volatile 层仍然处在那个单一的缓存块内部，而非每次调用时注入。唯一一处真正按调用注入的内容（ephemeral_system_prompt）被刻意排除在 build_system_prompt_parts 之外（第 323-324 行），只在 API 调用时才加入，正是为了让它留在被缓存/被存储的字符串之外。",
      "invalidate_system_prompt（system_prompt.py:404）是唯一获许的缓存击穿者——它会把 _cached_system_prompt 置空，并从磁盘重新加载记忆。它在上下文压缩之后被调用，这是对“不重建”规则唯一被记录在案的例外。",
      "技能的斜杠命令以及对话进行中的 /steer 会作为 USER 消息 / 工具结果附录注入，而绝不注入到系统提示里，以避免让缓存失效（AGENTS.md 第 370 行；STEER_CHANNEL_NOTE）。STEER_CHANNEL_NOTE 这段静态文本本身位于 stable 层，因此它保持字节稳定。",
      "一个续接轮次，若其已存储的 system_prompt 字段为 NULL 或空字符串，就会悄无声息地重建并在每轮都未命中前缀缓存——代码把这当作 bug 来对待并以 WARNING 级别记录日志，区分“缺失”（合法的首轮）与 “null”/“empty”（上一轮写入出了问题）。",
      "build_turn_context 大量地修改 agent（计数器、turn_id、缓存的提示、session 数据库），且只返回循环会回读的那些局部变量——它是把约 470 行内联序章做了一次“搬移并命名”的重构，而非一个纯函数。finalize_turn 同理，它是从 run_conversation 的尾部逐字提取出来的。",
      "_turns_since_memory 和 _iters_since_skill 明确地不在序章中重置（turn_context.py:163）——它们跨轮累加，好让周期性的提示按间隔触发；若每轮都重置它们，就会打乱这个节奏。",
      "技能索引本身被双重缓存（进程内 LRU 加上一份由 mtime/size manifest 校验的磁盘快照），这样 build_skills_system_prompt 在冷启动时就能省掉一次完整的文件系统扫描——但那份缓存与系统提示缓存是分开的；组装好的提示仍然每个 session 冻结一次。",
      "后台的记忆/技能复盘仅在 final_response 存在且本轮未被中断时才运行，并且是尽力而为的（吞掉异常），所以一次复盘失败绝不会破坏面向用户的那一轮。"
    ],
    "connects_to": [
      "上下文压缩——它是 invalidate_system_prompt 以及在 session 进行中重建系统提示的唯一获许触发器（预检压缩在 build_turn_context 内部运行）",
      "Session 持久化 / SQLite session 数据库——存储系统提示以便在续接轮次上逐字恢复，并持久化收到的用户轮次以增强崩溃韧性",
      "记忆子系统——volatile 层注入记忆快照 + USER.md，尾声触发按轮次计算的记忆复盘提示",
      "技能子系统——build_skills_system_prompt 为 stable 层提供技能索引，尾声触发按 iteration 计算的技能复盘提示",
      "插件钩子——pre_llm_call 在序章中触发（注入到用户消息里，而非系统提示），transform_llm_output / post_llm_call / on_session_end 在尾声中触发",
      "轨迹保存——finalize_turn 每轮调一次 _save_trajectory 并附上完成状态",
      "prompt 缓存不变量（AGENTS.md 原则 1）——整章都是捍卫被缓存前缀的一个实例；关联到只精确到日期的时间戳，以及不在 session 进行中重建的规则"
    ],
    "sections": [
      {
        "h": "一段话回顾整段旅程",
        "body": "我们从十几行代码起步：调用模型、执行它请求的工具、把结果追加回去、循环。然后每一章都加上一层，各自应对“现实入侵”的一种方式。**一个注册表**，让工具即插即用、不必撑大循环。**Toolset 与窄腰**，让每次调用发送的 schema 始终小巧。**预算与中断**，让循环总能终止、用户能随时改变方向。**prompt 缓存**——这个不变量随后约束了下游的一切。**压缩**，是唯一获许的破缓存操作。**记忆、技能与会话存储**，让 Agent 能跨时间学习。**委派**把任务扇出，**错误分类与提供方故障转移**让它在 API 抽风时存活，**cron + kanban** 处理那些活得比一轮对话更久的任务。这最后一章，正是它们交汇之处：把这一切围绕同一个微小循环串起来的、每一轮对话的开场与收尾。"
      }
    ],
    "outro": "要带走的模式是：**一个优秀的 harness 不是一个聪明的循环——而是一个小而稳定的循环，外面包了一层层、每层吸收现实的一种失败模式。** 第一章那个循环至今还在里面，原封未动。其余的一切，都是边缘。"
  }
];
