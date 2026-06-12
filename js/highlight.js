/* Lightweight Python syntax highlighter — no dependencies.
   Tokenizes a string and returns HTML with <span class="tok-*"> wrappers.
   Good enough for tutorial display of Python (and pseudo-Python) snippets. */

const PY_KEYWORDS = new Set([
  'def','class','return','if','elif','else','for','while','break','continue',
  'import','from','as','with','try','except','finally','raise','yield','lambda',
  'global','nonlocal','pass','del','assert','async','await','in','is','not','and',
  'or','from','match','case'
]);
const PY_BUILTIN_CONST = new Set(['True','False','None','self','cls']);

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function highlightPython(src) {
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];

    // Comments
    if (c === '#') {
      let j = i;
      while (j < n && src[j] !== '\n') j++;
      out += `<span class="tok-com">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // Triple-quoted strings
    if ((c === '"' || c === "'") && src.substr(i, 3) === c + c + c) {
      const q = c + c + c;
      let j = i + 3;
      while (j < n && src.substr(j, 3) !== q) j++;
      j = Math.min(j + 3, n);
      out += `<span class="tok-str">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // Single/double quoted strings (with escape handling)
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && src[j] !== c) {
        if (src[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, n);
      out += `<span class="tok-str">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // Decorators
    if (c === '@' && (i === 0 || src[i-1] === '\n' || /\s/.test(src[i-1]))) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_.]/.test(src[j])) j++;
      out += `<span class="tok-dec">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(c) && (i === 0 || !/[A-Za-z_]/.test(src[i-1]))) {
      let j = i;
      while (j < n && /[0-9._xXa-fA-F]/.test(src[j])) j++;
      out += `<span class="tok-num">${escapeHtml(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // Identifiers / keywords
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      // function/class name following def/class
      const before = src.slice(Math.max(0, i - 7), i);
      let cls = '';
      if (PY_KEYWORDS.has(word)) cls = 'tok-kw';
      else if (PY_BUILTIN_CONST.has(word)) cls = (word === 'self' || word === 'cls') ? 'tok-self' : 'tok-bool';
      else if (/\bdef\s+$/.test(before)) cls = 'tok-fn';
      else if (/\bclass\s+$/.test(before)) cls = 'tok-cls';
      else if (src[j] === '(') cls = 'tok-fn';
      else if (/^[A-Z]/.test(word)) cls = 'tok-cls';
      if (cls) out += `<span class="${cls}">${escapeHtml(word)}</span>`;
      else out += escapeHtml(word);
      i = j;
      continue;
    }

    out += escapeHtml(c);
    i++;
  }
  return out;
}

window.highlightPython = highlightPython;
window.escapeHtml = escapeHtml;
