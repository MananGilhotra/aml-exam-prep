/* ============================================================
   AML Exam Prep — shared runtime
   Sidebar, theme, progress, MCQ engine, KaTeX, scrollspy
   ============================================================ */

/* ---------- Site map (single source of truth) ---------- */
const SITE = [
  { g: 'Start Here', items: [
    { id: 'index',  n: '⌂',  t: 'Home & Syllabus Map',        f: 'index.html' },
    { id: 'l00',    n: '0',  t: 'From Code to AI / ML / DL',   f: 'l00.html' },
  ]},
  { g: 'ML Project Lifecycle', items: [
    { id: 'l01', n: '1', t: 'Lifecycle Part 1 · Problem → Preprocessing', f: 'l01.html' },
    { id: 'l02', n: '2', t: 'Lifecycle Part 2 · Split → Deploy',          f: 'l02.html' },
  ]},
  { g: 'Regression Core', items: [
    { id: 'l03', n: '3', t: 'Simple Linear Regression (OLS)',   f: 'l03.html' },
    { id: 'l04', n: '4', t: 'Multiple Linear Regression (OLS)', f: 'l04.html' },
    { id: 'l05', n: '5', t: 'Batch Gradient Descent',           f: 'l05.html' },
    { id: 'l06', n: '6', t: 'Stochastic & Mini-Batch GD',       f: 'l06.html' },
  ]},
  { g: 'Evaluate & Improve', items: [
    { id: 'l07', n: '7',  t: 'Evaluation Metrics',                f: 'l07.html' },
    { id: 'l08', n: '8',  t: 'Polynomial Reg. & 5 Assumptions',   f: 'l08.html' },
    { id: 'l09', n: '9',  t: 'Bias–Variance Tradeoff',            f: 'l09.html' },
    { id: 'l10', n: '10', t: 'Feature Selection',                 f: 'l10.html' },
    { id: 'l11', n: '11', t: 'Dimensionality Reduction & PCA',    f: 'l11.html' },
  ]},
  { g: 'Revise & Test', items: [
    { id: 'formula',  n: '∑', t: 'Master Formula Sheet',  f: 'formula-sheet.html' },
    { id: 'revision', n: '⚡', t: 'Quick Revision Cards',  f: 'revision.html' },
    { id: 'mock',     n: '✓', t: 'Mock Test · 60 Qs',     f: 'mock-test.html' },
    { id: 'labs',     n: '{}',t: 'Lab Code Companion',    f: 'labs.html' },
  ]},
];

const FLAT = SITE.flatMap(s => s.items);

/* ---------- Boot ---------- */
(function boot() {
  const saved = localStorage.getItem('aml-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {
  buildChrome();
  renderMCQs();
  enhanceCode();
  scrollSpy();
  renderMath();
});

/* ---------- Chrome: sidebar + topbar ---------- */
function buildChrome() {
  const page = document.body.dataset.page || 'index';
  const cur = FLAT.find(i => i.id === page);

  const nav = SITE.map(sec => `
    <div class="nav-group">${sec.g}</div>
    <nav class="nav">${sec.items.map(i => `
      <a href="${i.f}" class="${i.id === page ? 'active' : ''}">
        <span class="lnum">${i.n}</span><span>${i.t}</span>
      </a>`).join('')}</nav>`).join('');

  const side = document.createElement('aside');
  side.className = 'sidebar';
  side.id = 'sidebar';
  side.innerHTML = `
    <a class="brand" href="index.html" style="text-decoration:none;color:inherit">
      <span class="brand-mark">AML</span>
      <span class="brand-txt"><b>Advanced ML</b><span>CSA 333 · Exam Prep</span></span>
    </a>${nav}
    <div style="margin-top:1.6rem;padding:0 .65rem;font-size:.7rem;color:var(--text-3);line-height:1.6">
      Built from Worksheets 0–11.<br>Hinglish · Basic → Advanced.
    </div>`;

  const shell = document.querySelector('.shell');
  shell.insertBefore(side, shell.firstChild);

  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  document.body.appendChild(scrim);

  const bar = document.createElement('div');
  bar.className = 'topbar';
  bar.innerHTML = `
    <button class="iconbtn" id="menuBtn" aria-label="Menu">☰</button>
    <div class="crumb">Advanced Machine Learning &nbsp;›&nbsp; <b>${cur ? cur.t : ''}</b></div>
    <button class="iconbtn" id="themeBtn" aria-label="Toggle theme" title="Light / Dark">◐</button>
    <button class="iconbtn" id="printBtn" aria-label="Print" title="Print / Save PDF">⎙</button>
    <div class="progressbar" id="pbar"></div>`;
  document.querySelector('.main').prepend(bar);

  const up = document.createElement('button');
  up.className = 'up'; up.id = 'upBtn'; up.textContent = '↑';
  up.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(up);

  // prev / next
  const idx = FLAT.findIndex(i => i.id === page);
  const wrap = document.querySelector('.wrap');
  if (idx > -1 && wrap && !document.querySelector('.pagenav')) {
    const p = FLAT[idx - 1], n = FLAT[idx + 1];
    const pn = document.createElement('div');
    pn.className = 'pagenav';
    pn.innerHTML =
      (p ? `<a href="${p.f}"><div class="dir">← Previous</div><div class="ttl">${p.t}</div></a>`
         : `<a class="ph" href="#"></a>`) +
      (n ? `<a class="nx" href="${n.f}"><div class="dir">Next →</div><div class="ttl">${n.t}</div></a>`
         : `<a class="ph nx" href="#"></a>`);
    wrap.appendChild(pn);
  }

  // events
  const sb = document.getElementById('sidebar');
  const close = () => { sb.classList.remove('open'); scrim.classList.remove('on'); };
  document.getElementById('menuBtn').onclick = () => {
    sb.classList.toggle('open'); scrim.classList.toggle('on');
  };
  scrim.onclick = close;
  sb.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.getElementById('themeBtn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('aml-theme', cur);
  };
  document.getElementById('printBtn').onclick = () => window.print();
  up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const pbar = document.getElementById('pbar');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    pbar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    up.classList.toggle('show', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- MCQ engine ----------
   Expects a global `MCQS` array and a container #mcq-root.
   Item: { q, o:[4 strings], a:0..3, e:'explanation', d:'easy|med|hard' }
------------------------------------------------------------ */
function renderMCQs() {
  const root = document.getElementById('mcq-root');
  if (!root || typeof MCQS === 'undefined') return;

  const total = MCQS.length;
  let answered = 0, correct = 0;

  const head = document.createElement('div');
  head.className = 'mcq-head';
  head.innerHTML = `
    <div style="font-size:.88rem;color:var(--text-2)">
      Click an option to lock your answer. Explanation appears instantly.
    </div>
    <div class="mcq-score" id="mcqScore">0 / ${total} attempted · 0 correct</div>`;
  root.appendChild(head);

  const D = { easy: 'Easy', med: 'Medium', hard: 'Hard' };
  const K = ['A', 'B', 'C', 'D'];

  MCQS.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'mcq';
    el.innerHTML = `
      <div class="q"><span class="qn">${i + 1}</span>
        <span>${m.q}<span class="diff ${m.d || 'med'}">${D[m.d || 'med']}</span></span></div>
      <ul class="opts">${m.o.map((t, j) =>
        `<li class="opt" data-j="${j}"><span class="k">${K[j]}</span><span>${t}</span></li>`).join('')}</ul>
      <div class="expl"><span class="why">Why — and why not the others</span>${m.e}</div>`;
    root.appendChild(el);

    el.querySelectorAll('.opt').forEach(opt => {
      opt.addEventListener('click', () => {
        if (el.classList.contains('done')) return;
        const j = +opt.dataset.j;
        el.classList.add('done');
        answered++;
        if (j === m.a) correct++;
        el.querySelectorAll('.opt').forEach(o => {
          const oj = +o.dataset.j;
          o.classList.add('locked');
          if (oj === m.a) o.classList.add('correct');
          else if (oj === j) o.classList.add('wrong');
          else o.classList.add('dim');
        });
        document.getElementById('mcqScore').textContent =
          `${answered} / ${total} attempted · ${correct} correct`;
        if (answered === total) {
          const pct = Math.round((correct / total) * 100);
          document.getElementById('mcqScore').textContent =
            `Done — ${correct}/${total} (${pct}%) ${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚 revise once more'}`;
        }
      });
    });
  });

  const reset = document.createElement('button');
  reset.className = 'btn sm';
  reset.style.marginTop = '1.2rem';
  reset.textContent = '↺ Reset quiz';
  reset.onclick = () => { root.innerHTML = ''; renderMCQs(); renderMath(root); };
  root.appendChild(reset);
}

/* ---------- Naive Python highlighter ---------- */
function enhanceCode() {
  const KW = /\b(def|return|import|from|for|in|if|elif|else|while|class|None|True|False|and|or|not|as|with|lambda|yield|break|continue|pass|raise|try|except|finally|global|assert|print)\b/g;
  document.querySelectorAll('pre.py').forEach(pre => {
    let h = pre.textContent
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/(#[^\n]*)/g, '<span class="tok-com">$1</span>')
      .replace(/('[^'\n]*'|"[^"\n]*")/g, '<span class="tok-str">$1</span>')
      .replace(KW, '<span class="tok-kw">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
    pre.innerHTML = h;
  });
}

/* ---------- Scrollspy for right-hand TOC ---------- */
function scrollSpy() {
  const links = [...document.querySelectorAll('.toc a')];
  if (!links.length) return;
  const map = links.map(a => ({ a, el: document.querySelector(a.getAttribute('href')) }))
                   .filter(x => x.el);
  const tick = () => {
    let cur = map[0];
    for (const m of map) if (m.el.getBoundingClientRect().top < 140) cur = m;
    links.forEach(a => a.classList.remove('on'));
    if (cur) cur.a.classList.add('on');
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ---------- KaTeX ---------- */
function renderMath(scope) {
  const run = () => {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(scope || document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$',  right: '$',  display: false },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
      ignoredClasses: ['nokatex'],
      // KaTeX renders into HTML spans, which SVG cannot host — anything left
      // inside <svg> would silently vanish. Diagram labels use Unicode instead.
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code',
                    'option', 'svg'],
    });
  };
  if (window.renderMathInElement) run();
  else window.addEventListener('katex-ready', run, { once: true });
}
