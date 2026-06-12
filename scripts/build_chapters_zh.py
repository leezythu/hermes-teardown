#!/usr/bin/env python3
"""Build the Chinese chapters.js from the translation-workflow output.

Merges translated prose with Chinese phase labels + titles, and RE-COPIES the
verbatim code/file/lines from the English source (/tmp/chapters_en.json) so the
code blocks are guaranteed byte-identical regardless of what a translator agent
returned.
"""
import json, html, pathlib

# the translation workflow's task output file (set after it completes)
TRANS_SRC = '/tmp/claude-1000/-mnt-hdfs-lizhenyu/2c410a79-4d5f-49b3-a3bc-fdfdf8a1da3b/tasks/wmw0vjc81.output'
EN_SRC = '/tmp/chapters_en.json'
INTRO = '/mnt/hdfs/lizhenyu/hermes-tutorial-site/data/_intro.js'
OUT = '/mnt/hdfs/lizhenyu/hermes-tutorial-site/data/chapters.js'

# Chinese phase labels + short titles, in pedagogical order
ZH_META = {
    'react-loop':           ('核心 ReAct 循环',            '第一部分 · 地基'),
    'tools-registry':       ('工具与调度注册表',            '第一部分 · 地基'),
    'toolsets-narrowwaist': ('Toolset 与窄腰原则',          '第一部分 · 地基'),
    'budget-interrupt':     ('迭代预算与中断',              '第二部分 · 给循环加边界'),
    'prompt-caching':       'prompt 缓存:神圣的不变量',  # placeholder, replaced below
    'compression':          ('上下文压缩',                  '第二部分 · 给循环加边界'),
    'memory':               ('跨会话记忆',                  '第三部分 · 跨时间学习'),
    'skills-curator':       ('技能与自我改进循环',          '第三部分 · 跨时间学习'),
    'sessions-search':      ('会话存储与 FTS5 检索',        '第三部分 · 跨时间学习'),
    'delegation':           ('委派与子智能体',              '第四部分 · 横向扩展'),
    'errors-providers':     ('错误处理、重试与多提供方',    '第四部分 · 横向扩展'),
    'cron-kanban':          ('定时任务与 Agent 队列',       '第四部分 · 横向扩展'),
    'system-prompt-turn':   ('融会贯通:对话轮次的生命周期', '第五部分 · 完整的机器'),
}
ZH_META['prompt-caching'] = ('prompt 缓存:神圣的不变量', '第二部分 · 给循环加边界')

ORDER = ['react-loop','tools-registry','toolsets-narrowwaist','budget-interrupt',
         'prompt-caching','compression','memory','skills-curator','sessions-search',
         'delegation','errors-providers','cron-kanban','system-prompt-turn']

def unesc(s):
    if not isinstance(s, str):
        return s
    prev = None
    while prev != s:
        prev = s
        s = html.unescape(s)
    return s

# load English source (authoritative code) keyed by id
en = {c['id']: c for c in json.load(open(EN_SRC))}

# load translations
tdata = json.load(open(TRANS_SRC))
tdata = tdata['result'] if 'result' in tdata else tdata
trans = {t['id']: t for t in tdata['translated']}

missing = [i for i in ORDER if i not in trans]
if missing:
    raise SystemExit(f'MISSING translations for: {missing}')

chapters = []
for cid in ORDER:
    t = trans[cid]
    e = en[cid]
    title, phase = ZH_META[cid]
    # zip translated captions/explanations onto the AUTHORITATIVE English code
    snips = []
    for i, ecs in enumerate(e['code_snippets']):
        tcs = t['code_snippets'][i] if i < len(t['code_snippets']) else {}
        snips.append({
            'caption': unesc(tcs.get('caption') or ecs['caption']),
            'file': ecs['file'],          # authoritative
            'lines': ecs['lines'],        # authoritative
            'code': ecs['code'],          # authoritative — verbatim, never from translator
            'explanation': unesc(tcs.get('explanation') or ecs['explanation']),
        })
    chapters.append({
        'id': cid,
        'title': title,
        'phase': phase,
        'one_line': unesc(t.get('one_line', e['one_line'])),
        'problem': unesc(t.get('problem', e['problem'])),
        'design_decision': unesc(t.get('design_decision', e['design_decision'])),
        'code_snippets': snips,
        'gotchas': [unesc(g) for g in t.get('gotchas', e['gotchas'])],
        'connects_to': [unesc(c) for c in t.get('connects_to', e['connects_to'])],
    })

# Chinese capstone framing
capstone = chapters[-1]
capstone['sections'] = [{
    'h': '一段话回顾整段旅程',
    'body': (
        "我们从十几行代码起步:调用模型、执行它请求的工具、把结果追加回去、循环。"
        "然后每一章都加上一层,各自应对“现实入侵”的一种方式。**一个注册表**,让工具即插即用、不必撑大循环。"
        "**Toolset 与窄腰**,让每次调用发送的 schema 始终小巧。**预算与中断**,让循环总能终止、用户能随时改变方向。"
        "**prompt 缓存** —— 这个不变量随后约束了下游的一切。**压缩**,是唯一被许可的缓存破坏操作。"
        "**记忆、技能与会话存储**,让 Agent 能跨时间学习。**委派**把任务扇出,"
        "**错误分类与提供方故障转移**让它在 API 抽风时存活,**cron + kanban** 处理那些活得比一轮对话更久的任务。"
        "这最后一章,正是它们交汇之处:把这一切围绕同一个微小循环串起来的、每一轮对话的开场与收尾。"
    ),
}]
capstone['outro'] = (
    "要带走的模式是:**一个优秀的 harness 不是一个聪明的循环 —— 而是一个小而稳定的循环,"
    "外面包了一层层、每层吸收现实的一种失败模式。** 第一章那个循环至今还在里面,原封未动。其余的一切,都是边缘。"
)

intro_js = open(INTRO).read()
with open(OUT, 'w') as f:
    f.write('// ============================================================\n')
    f.write('//  自动生成(中文版)。请勿手改;改 data/_intro.js 后重跑\n')
    f.write('//  scripts/build_chapters_zh.py。代码片段逐字取自英文源。\n')
    f.write('// ============================================================\n\n')
    f.write(intro_js)
    f.write('\n\nwindow.CHAPTERS = ')
    f.write(json.dumps(chapters, ensure_ascii=False, indent=2))
    f.write(';\n')

print(f'Wrote {len(chapters)} ZH chapters to {OUT}')
total = sum(len(c['code_snippets']) for c in chapters)
# verify code integrity vs English source
mismatches = 0
for c in chapters:
    for i, s in enumerate(c['code_snippets']):
        if s['code'] != en[c['id']]['code_snippets'][i]['code']:
            mismatches += 1
print(f'total snippets: {total}, code mismatches vs EN source: {mismatches}')
