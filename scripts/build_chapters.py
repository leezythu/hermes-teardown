#!/usr/bin/env python3
"""Transform the workflow's JSON briefs into the site's chapters.js data file."""
import json, html, re

SRC = '/tmp/claude-1000/-mnt-hdfs-lizhenyu/2c410a79-4d5f-49b3-a3bc-fdfdf8a1da3b/tasks/wh5ta9o09.output'
INTRO = '/mnt/hdfs/lizhenyu/hermes-tutorial-site/data/_intro.js'
OUT = '/mnt/hdfs/lizhenyu/hermes-tutorial-site/data/chapters.js'

data = json.load(open(SRC))['result']
briefs = {b['key']: b for b in data['briefs']}

# Pedagogical arc — honoring the user's "simplest react loop -> add features" spine.
# Each entry: (key, short_title, phase_label)
ORDER = [
    ('react-loop',           'The core ReAct loop',                  'Part I · The foundation'),
    ('tools-registry',       'Tools & the dispatch registry',        'Part I · The foundation'),
    ('toolsets-narrowwaist', 'Toolsets & the narrow waist',          'Part I · The foundation'),
    ('budget-interrupt',     'Iteration budget & interrupt',         'Part II · Bounding the loop'),
    ('prompt-caching',       'Prompt caching: the sacred invariant', 'Part II · Bounding the loop'),
    ('compression',          'Context compression',                  'Part II · Bounding the loop'),
    ('memory',              'Cross-session memory',                  'Part III · Learning across time'),
    ('skills-curator',       'Skills & the self-improvement loop',   'Part III · Learning across time'),
    ('sessions-search',      'Session store & FTS5 recall',          'Part III · Learning across time'),
    ('delegation',           'Delegation & subagents',               'Part IV · Scaling out'),
    ('errors-providers',     'Errors, retries & multi-provider',     'Part IV · Scaling out'),
    ('cron-kanban',          'Scheduled jobs & the agent queue',     'Part IV · Scaling out'),
    ('system-prompt-turn',   'Putting it together: the turn lifecycle', 'Part V · The whole machine'),
]

def clean(s):
    """Decode HTML entities some agents emitted (&lt; &gt; &amp; &quot; &#39;)."""
    if not isinstance(s, str):
        return s
    # unescape repeatedly in case of double-encoding
    prev = None
    while prev != s:
        prev = s
        s = html.unescape(s)
    return s

def clean_deep(obj):
    if isinstance(obj, str):
        return clean(obj)
    if isinstance(obj, list):
        return [clean_deep(x) for x in obj]
    if isinstance(obj, dict):
        return {k: clean_deep(v) for k, v in obj.items()}
    return obj

chapters = []
for key, short_title, phase in ORDER:
    b = clean_deep(briefs[key])
    ch = {
        'id': key,
        'title': short_title,
        'phase': phase,
        'one_line': b.get('one_line', ''),
        'problem': b.get('problem', ''),
        'design_decision': b.get('design_decision', ''),
        'code_snippets': [
            {
                'caption': c.get('caption', ''),
                'file': c.get('file', ''),
                'lines': c.get('lines', ''),
                'code': c.get('code', ''),
                'explanation': c.get('explanation', ''),
            } for c in b.get('code_snippets', [])
        ],
        'gotchas': b.get('gotchas', []),
        'connects_to': b.get('connects_to', []),
    }
    chapters.append(ch)

# --- Framing touches on the capstone chapter ---
capstone = chapters[-1]
capstone['sections'] = [{
    'h': 'The journey, in one paragraph',
    'body': (
        "We started with twelve lines: call the model, run the tools it asks for, append "
        "the results, repeat. Then every chapter added one layer that handles a way reality "
        "intrudes. **A registry** so tools plug in without growing the loop. **Toolsets and the "
        "narrow waist** so the schema sent every call stays small. **A budget and interrupt** so "
        "the loop always terminates and the user can redirect it. **Prompt caching** — the "
        "invariant that then constrains everything downstream. **Compression** as the one "
        "sanctioned cache break. **Memory, skills, and a session store** so the agent learns "
        "across time. **Delegation** to fan work out, **error classification and provider "
        "failover** to survive flaky APIs, and **cron + kanban** for work that outlives a turn. "
        "This final chapter is where they meet: the per-turn prologue and epilogue that wire "
        "all of it around the same tiny loop."
    ),
}]

# A closing recap callout, appended as a final pseudo-section
capstone['outro'] = (
    "The pattern to take away: **a great harness is not a clever loop — it's a small, stable "
    "loop wrapped in layers that each absorb one failure mode of reality.** The loop in "
    "Chapter 1 is still in there, unchanged. Everything else is edges."
)

# read intro
intro_js = open(INTRO).read()

# emit chapters.js  (intro first, then CHAPTERS as JSON)
with open(OUT, 'w') as f:
    f.write('// ============================================================\n')
    f.write('//  AUTO-GENERATED from Hermes source analysis. Do not hand-edit;\n')
    f.write('//  edit data/_intro.js + rerun scripts/build_chapters.py.\n')
    f.write('// ============================================================\n\n')
    f.write(intro_js)
    f.write('\n\nwindow.CHAPTERS = ')
    f.write(json.dumps(chapters, ensure_ascii=False, indent=2))
    f.write(';\n')

print(f'Wrote {len(chapters)} chapters to {OUT}')
# sanity: count total snippets, check no stray entities remain in code
total_snips = sum(len(c['code_snippets']) for c in chapters)
stray = 0
for c in chapters:
    for s in c['code_snippets']:
        if '&lt;' in s['code'] or '&gt;' in s['code'] or '&amp;' in s['code']:
            stray += 1
print(f'total snippets: {total_snips}, snippets with stray entities: {stray}')
