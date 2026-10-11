// app.js: hash router, page rendering, lesson player. The 3D engine is loaded lazily so text works even if WebGL/CDN fails.
import { LESSONS, CHAPTERS } from './lessons/index.js';

const $ = (s, el = document) => el.querySelector(s);
const h = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); } if (html) e.innerHTML = html; return e; };
const store = {
  get(k, d) { try { const v = localStorage.getItem('shpt:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('shpt:' + k, JSON.stringify(v)); } catch { } },
};
const done = () => new Set(store.get('done', []));
const markDone = (id) => { const s = done(); s.add(id); store.set('done', [...s]); renderSidebar(); };

// ---------- theme / nav ----------
const theme = store.get('theme', null); if (theme) document.documentElement.dataset.theme = theme;
$('#themeBtn').onclick = () => {
  const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nx = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = nx; store.set('theme', nx);
};
$('#menuBtn').onclick = () => document.body.classList.toggle('nav-open');
$('#scrim').onclick = () => document.body.classList.remove('nav-open');

function renderSidebar() {
  const sb = $('#sidebar'), d = done(), cur = location.hash;
  let html = `<a href="#/" class="${cur === '#/' || !cur ? 'active' : ''}"><span class="num">🏠</span>Trang chủ & cách học</a>`;
  for (const ch of CHAPTERS) {
    html += `<h4>${ch.name}</h4>`;
    for (const L of LESSONS.filter(l => l.chapter === ch.id)) {
      const href = `#/l/${L.id}`;
      html += `<a href="${href}" class="${cur === href ? 'active' : ''}"><span class="num">${L.num}</span><span>${L.title}</span>${d.has(L.id) ? '<span class="done">✓</span>' : ''}</a>`;
    }
  }
  html += `<h4>Ôn tập</h4>
    <a href="#/traps" class="${cur === '#/traps' ? 'active' : ''}"><span class="num">⚠️</span>Tổng hợp bẫy dễ nhầm</a>
    <a href="#/exams" class="${cur.startsWith('#/exam') ? 'active' : ''}"><span class="num">📝</span>3 đề luyện (chấm điểm)</a>
    <a href="assets/Cheatsheet-SHPT-4mat-A4.pdf" target="_blank" rel="noopener"><span class="num">📄</span>Cheatsheet 4 mặt A4 (PDF)</a>
    <a href="assets/3-De-luyen-SHPT.pdf" target="_blank" rel="noopener"><span class="num">📄</span>3 đề luyện (PDF in)</a>`;
  sb.innerHTML = html;
}

// ---------- router ----------
let current = null; // {viewer, cleanup}
async function route() {
  document.body.classList.remove('nav-open');
  if (current?.cleanup) { try { current.cleanup(); } catch (e) { console.warn(e); } }
  current = null;
  const hash = location.hash || '#/';
  const main = $('#main'); main.innerHTML = '';
  renderSidebar();
  const m = hash.match(/^#\/l\/([\w-]+)/);
  if (m) await renderLesson(main, m[1]);
  else if (hash.startsWith('#/traps')) await renderTraps(main);
  else if (hash.match(/^#\/exam\/(\d)/)) await renderExam(main, +hash.match(/^#\/exam\/(\d)/)[1]);
  else if (hash.startsWith('#/exams')) renderExams(main);
  else renderHome(main);
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route);

// ---------- home ----------
function renderHome(main) {
  const d = done(), pct = Math.round(100 * d.size / LESSONS.length);
  main.innerHTML = `
  <section class="hero">
    <h1>Sinh học Phân tử & Di truyền: học bằng mô hình 3D</h1>
    <p>Mỗi bài có một mô hình 3D bạn xoay, phóng to và bấm từng bước để xem phân tử <b>chuyển động thật</b>. Mỗi bài trả lời đủ: <b>để làm gì</b> · <b>thiếu nó thì tế bào sao</b> · <b>nền tảng cần nhớ lại</b> · <b>cơ chế</b> · <b>ứng dụng</b> · <b>phân biệt</b> · <b>bẫy</b> · <b>tự kiểm tra</b>.</p>
    <div class="row">
      <a class="btn" href="#/l/${LESSONS[0].id}">▶ Bắt đầu bài 1</a>
      <a class="btn" href="#/traps">⚠️ Xem tất cả bẫy</a>
      <a class="btn" href="#/exams">📝 Làm đề</a>
    </div>
    <div class="progress" style="background:rgba(255,255,255,.25)"><i style="width:${pct}%;background:#fff"></i></div>
    <small>Tiến độ: ${d.size}/${LESSONS.length} bài (${pct}%)</small>
  </section>

  <div class="sec found">
    <h2>🧭 Cách học hiệu quả với trang này (4 bước)</h2>
    <div class="method">
      <div class="card"><b>1 · Đọc để hiểu "tại sao"</b>Đừng học thuộc tên. Mỗi bài bắt đầu bằng "để làm gì" và "thiếu thì sao". Hiểu lý do thì nhớ lâu.</div>
      <div class="card"><b>2 · Xem 3D từng bước</b>Bấm ▶ hoặc phím ← →. Xoay mô hình bằng chuột hay ngón tay. Bật tắt các công tắc để thấy "nếu… thì…".</div>
      <div class="card"><b>3 · Gấp lại, tự nhớ</b>Cuối bài có ô "Tự nhớ lại". Viết ra không nhìn, rồi mới mở đáp án. Đây là cách nhớ mạnh nhất.</div>
      <div class="card"><b>4 · Tự vẽ tay sơ đồ</b>Chạc ba sao chép, operon lac, miRNA, nhập ty thể, mTORC1: vẽ lại bằng tay đúng như 3D. Vẽ được thì hiểu thật.</div>
    </div>
  </div>

  <div class="box warn"><b>⚠️ Bẫy số 1 (bạn từng nhầm):</b> <b>Promoter nằm trên DNA</b>, là nơi RNA polymerase bám để bắt đầu <i>phiên mã</i>. <b>AUG nằm trên mRNA</b>, là nơi ribosome bắt đầu <i>dịch mã</i>. Hai thứ thuộc hai phân tử khác nhau, hai giai đoạn khác nhau, hai cỗ máy khác nhau. <a href="#/l/${LESSONS[0].id}">Xem 3D ngay →</a></div>
  ${CHAPTERS.map(ch => `
    <h2 class="chap-title">${ch.name}</h2>
    <div class="grid">${LESSONS.filter(l => l.chapter === ch.id).map(L => `
      <a class="card lesson-card" href="#/l/${L.id}">
        <div class="k">Bài ${L.num} ${d.has(L.id) ? '· <span style="color:var(--good)">✓ đã học</span>' : ''}</div>
        <h3>${L.title}</h3><p>${L.short || ''}</p>
      </a>`).join('')}</div>`).join('')}
  <p class="kbd" style="margin-top:30px">Nội dung soạn theo 3 file bài giảng Ch1–6 (bổ sung giải thích, có đánh dấu chỗ slide viết sai). Mô hình 3D là hình minh họa đơn giản hóa, không đúng tỉ lệ thật.</p>`;
}

// ---------- lesson ----------
const SECTION_DEFS = [
  ['why', '🎯 Để làm gì?'], ['without', '💥 Nếu không có thì tế bào sao?'], ['foundation', '🧱 Nền tảng cần nhớ lại'],
  ['steps', '⚙️ Cơ chế từng bước'], ['application', '🌍 Ứng dụng thực tế'], ['distinguish', '🔀 Phân biệt'],
  ['traps', '⚠️ Bẫy dễ nhầm'], ['quiz', '✅ Tự kiểm tra'], ['recall', '🧠 Gấp lại & tự nhớ'],
];
const SEC_CLASS = { why: 'why', without: 'without', foundation: 'found', steps: '', application: 'app', distinguish: 'dist', traps: 'trap', quiz: 'quiz', recall: 'found' };

async function renderLesson(main, id) {
  const idx = LESSONS.findIndex(l => l.id === id);
  if (idx < 0) { main.innerHTML = '<p>Không tìm thấy bài. <a href="#/">Về trang chủ</a></p>'; return; }
  const meta = LESSONS[idx];
  main.innerHTML = '<p class="kbd">Đang tải bài…</p>';
  let L;
  try { L = (await meta.load()).default; } catch (e) { main.innerHTML = `<div class="box bad">Lỗi tải bài: ${e.message}</div>`; console.error(e); return; }
  if (location.hash !== `#/l/${id}`) return;
  document.title = `${meta.num}. ${L.title} · SHPT 3D`;
  const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  main.innerHTML = `
  <div class="lesson-head"><div class="k">${CHAPTERS.find(c => c.id === meta.chapter)?.name || ''} · Bài ${meta.num}</div>
    <h1>${L.title}</h1>${L.sub ? `<p class="sub">${L.sub}</p>` : ''}</div>
  <div class="lesson-grid">
    <div class="stage-wrap">
      <div class="stage" id="stage"><button class="stage-fs" id="fsBtn" title="Toàn màn hình">⤢</button><div class="stage-hint">🖱 kéo để xoay · cuộn để phóng to · chuột phải để dời</div></div>
      <div class="player">
        <div class="bar">
          <button class="btn" id="prevBtn" aria-label="Bước trước">◀</button>
          <div class="dots" id="dots"></div>
          <button class="btn" id="playBtn" aria-label="Tự chạy">▶</button>
          <button class="btn primary" id="nextBtn" aria-label="Bước sau">▶▶</button>
        </div>
        <div class="cap" id="cap"></div>
        <div class="controls" id="controls"></div>
        ${L.legend ? `<div class="legend">${L.legend}</div>` : ''}
      </div>
    </div>
    <div id="secs">
      <div class="tabs" id="tabs"></div>
      <div id="secBody"></div>
      <div class="navline">
        ${prev ? `<a class="btn" href="#/l/${prev.id}">← ${prev.num}. ${prev.title}</a>` : '<span></span>'}
        <button class="btn" id="doneBtn">${done().has(id) ? '✓ Đã học xong' : '☐ Đánh dấu đã học xong'}</button>
        ${next ? `<a class="btn primary" href="#/l/${next.id}">${next.num}. ${next.title} →</a>` : '<a class="btn primary" href="#/exams">Làm đề →</a>'}
      </div>
    </div>
  </div>`;

  // sections
  const body = $('#secBody'), tabs = $('#tabs');
  const present = SECTION_DEFS.filter(([k]) => L[k] && (!Array.isArray(L[k]) || L[k].length));
  for (const [k, title] of present) {
    const sec = h('section', { class: 'sec ' + (SEC_CLASS[k] || ''), id: 'sec-' + k });
    sec.innerHTML = `<h2>${title}</h2>` + renderSection(k, L[k], L);
    body.appendChild(sec);
    tabs.appendChild(h('button', { onclick: () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, title.split(' ').slice(1).join(' ').replace('?', '')));
  }
  wireQuiz(body);
  $('#doneBtn').onclick = (e) => { markDone(id); e.target.textContent = '✓ Đã học xong'; };

  // player state
  const steps = L.steps || [];
  let step = 0, playing = false, timer = null, sceneCtl = null;
  const seen = new Set([0]);
  const dots = $('#dots');
  steps.forEach((s, i) => dots.appendChild(h('button', { title: s.title, onclick: () => go(i) }, String(i + 1))));
  function go(i, fromPlay) {
    step = Math.max(0, Math.min(steps.length - 1, i)); seen.add(step);
    [...dots.children].forEach((b, j) => { b.classList.toggle('on', j === step); b.classList.toggle('seen', seen.has(j)); });
    const s = steps[step];
    $('#cap').innerHTML = s ? `<h3>Bước ${step + 1}/${steps.length}: ${s.title}</h3><p>${s.text}</p>` : '';
    document.querySelectorAll('#sec-steps li').forEach((li, j) => li.classList.toggle('on', j === step));
    try { sceneCtl?.setStep?.(step); } catch (e) { console.error(e); }
    if (!fromPlay) stop();
  }
  function stop() { playing = false; clearTimeout(timer); $('#playBtn').textContent = '▶'; }
  function play() {
    playing = true; $('#playBtn').textContent = '⏸';
    const tick = () => { if (!playing) return; if (step >= steps.length - 1) { stop(); return; } go(step + 1, true); timer = setTimeout(tick, steps[step]?.dur || 6500); };
    timer = setTimeout(tick, steps[step]?.dur || 6500);
  }
  $('#prevBtn').onclick = () => go(step - 1);
  $('#nextBtn').onclick = () => go(step + 1);
  $('#playBtn').onclick = () => playing ? stop() : (step >= steps.length - 1 && go(0), play());
  document.querySelectorAll('#sec-steps li').forEach((li, j) => li.onclick = () => { go(j); $('#stage').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
  const onKey = (e) => { if (e.target.closest('input,textarea')) return; if (e.key === 'ArrowRight') go(step + 1); if (e.key === 'ArrowLeft') go(step - 1); };
  addEventListener('keydown', onKey);
  const stage = $('#stage');
  $('#fsBtn').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen?.(); };

  let viewer = null;
  current = { cleanup() { stop(); removeEventListener('keydown', onKey); try { sceneCtl?.dispose?.(); } catch { } viewer?.dispose(); } };
  go(0);
  // 3D
  try {
    const eng = await import('./engine.js');
    if (location.hash !== `#/l/${id}`) return;
    viewer = new eng.Viewer(stage);
    const api = eng.makeApi(viewer, makeUI($('#controls')));
    sceneCtl = L.scene ? L.scene(api) : null;
    if (sceneCtl?.update) api.onFrame(sceneCtl.update);
    go(step);
  } catch (e) {
    console.error(e);
    stage.insertAdjacentHTML('beforeend', `<div class="stage-err">Không chạy được 3D trên thiết bị này (${e.message}). Nội dung chữ bên cạnh vẫn đầy đủ.</div>`);
  }
}

function renderSection(k, v, L) {
  if (k === 'foundation') return v.map(x => `<details class="qa"><summary>${x.q}</summary><div class="ans">${x.a}</div></details>`).join('') + '<p class="kbd">Tự trả lời trong đầu trước khi bấm mở.</p>';
  if (k === 'steps') return `<ol class="steps-list">${v.map(s => `<li><b>${s.title}</b>${s.text}</li>`).join('')}</ol><p class="kbd">Bấm một bước để xem nó trong 3D (hoặc dùng phím ← →).</p>`;
  if (k === 'traps') return v.map(t => `<div class="trap-item"><div class="t">${t.trap}</div><div class="f">${t.truth}</div></div>`).join('');
  if (k === 'quiz') return v.map((q, i) => mcqHTML(q, i)).join('');
  if (k === 'recall') return `<div class="recall"><p><b>Đóng mắt hoặc cuộn lên che 3D lại.</b> Trả lời bằng cách viết ra (gõ vào ô hoặc viết giấy):</p><ol>${v.map(x => `<li>${x}</li>`).join('')}</ol>
    <textarea placeholder="Viết lại từ trí nhớ… (không lưu lên mạng, chỉ để bạn tự luyện)"></textarea>
    <p class="kbd">Xong rồi bấm ▶ xem lại 3D để so. Chỗ nào viết sai là chỗ cần ôn. ✍️ Vẽ tay lại mô hình 3D này lên giấy.</p></div>`;
  return typeof v === 'string' ? v : '';
}
const mcqHTML = (q, i, name = '') => `<div class="mcq" data-a="${q.a}"><div class="q">${name}${i + 1}. ${q.q}</div>${q.ops.map((o, j) => `<button class="op" data-j="${j}">${'ABCD'[j]}. ${o}</button>`).join('')}<div class="ex box info">${q.e || ''}</div></div>`;
function wireQuiz(root, onAnswer) {
  root.querySelectorAll('.mcq').forEach(m => m.querySelectorAll('button.op').forEach(b => b.onclick = () => {
    if (m.classList.contains('answered')) return;
    const a = +m.dataset.a, j = +b.dataset.j; m.classList.add('answered');
    m.querySelectorAll('button.op').forEach((x, k) => { x.disabled = true; if (k === a) x.classList.add('right'); });
    if (j !== a) b.classList.add('wrong');
    m.querySelector('.ex').insertAdjacentHTML('afterbegin', j === a ? '<b style="color:var(--good)">Đúng! </b>' : `<b style="color:var(--bad)">Chưa đúng. Đáp án ${'ABCD'[a]}. </b>`);
    onAnswer?.(j === a);
  }));
}

function makeUI(box) {
  return {
    toggle(label, init, onChange) {
      const el = h('label', { class: 'switch' + (init ? ' on' : '') }, `<span class="dot"></span>${label}`); let v = !!init;
      el.onclick = (e) => { e.preventDefault(); v = !v; el.classList.toggle('on', v); onChange(v); };
      box.appendChild(el); return { set(x) { v = !!x; el.classList.toggle('on', v); }, get: () => v, el };
    },
    slider(label, min, max, step, init, onChange, fmt = (x) => x) {
      const el = h('div', { class: 'ctl' }, `<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${init}"><b>${fmt(init)}</b>`);
      const inp = el.querySelector('input'), out = el.querySelector('b');
      inp.oninput = () => { out.textContent = fmt(+inp.value); onChange(+inp.value); };
      box.appendChild(el); return { set(x) { inp.value = x; out.textContent = fmt(x); }, get: () => +inp.value, el };
    },
    buttons(items) { const w = h('div', { class: 'ctl' }); items.forEach(([t, fn]) => w.appendChild(h('button', { class: 'btn', onclick: fn }, t))); box.appendChild(w); return w; },
    readout(html) { let el = box.querySelector('.readout'); if (!el) { el = h('div', { class: 'readout' }); box.appendChild(el); } el.innerHTML = html; return el; },
  };
}

// ---------- traps page ----------
async function renderTraps(main) {
  main.innerHTML = '<p class="kbd">Đang gom bẫy từ tất cả các bài…</p>';
  const mods = await Promise.all(LESSONS.map(l => l.load().then(m => [l, m.default]).catch(() => [l, null])));
  if (location.hash !== '#/traps') return;
  main.innerHTML = `<div class="lesson-head"><h1>⚠️ Tổng hợp bẫy dễ nhầm</h1><p class="sub">Đọc nhanh trước giờ thi. Che dòng xanh lại, tự nói "thật ra là…" rồi mới mở ra xem.</p></div>
  <div class="tabs"><button id="hideAll">🙈 Che hết đáp án</button><button id="showAll">👀 Hiện hết</button></div>
  ${mods.filter(([, L]) => L?.traps?.length).map(([meta, L]) => `<div class="sec trap"><h2><a href="#/l/${meta.id}">Bài ${meta.num}. ${L.title}</a></h2>${L.traps.map(t => `<div class="trap-item"><div class="t">${t.trap}</div><div class="f">${t.truth}</div></div>`).join('')}</div>`).join('')}`;
  const setHide = (on) => main.querySelectorAll('.trap-item .f').forEach(f => { f.style.filter = on ? 'blur(6px)' : ''; f.style.cursor = 'pointer'; f.onclick = () => f.style.filter = ''; });
  $('#hideAll').onclick = () => setHide(true); $('#showAll').onclick = () => setHide(false);
}

// ---------- exams ----------
function renderExams(main) {
  main.innerHTML = `<div class="lesson-head"><h1>📝 3 đề luyện</h1><p class="sub">Mỗi đề có 30 câu trắc nghiệm (chấm tự động, có giải thích) và 4 câu tự luận (có đáp án gợi ý). Làm như thi thật: 60 phút, không xem bài.</p></div>
  <div class="grid">
    <a class="card lesson-card" href="#/exam/1"><div class="k">Đề 1</div><h3>Cơ bản: nắm khái niệm</h3><p>Định nghĩa, cấu trúc, các thành phần chính.</p></a>
    <a class="card lesson-card" href="#/exam/2"><div class="k">Đề 2</div><h3>Vận dụng: hiểu cơ chế</h3><p>So sánh nhân sơ và nhân thực, điều hòa, liên kết các chương.</p></a>
    <a class="card lesson-card" href="#/exam/3"><div class="k">Đề 3</div><h3>Nâng cao: đột biến và tình huống</h3><p>"Nếu hỏng X thì sao?", phân tích thí nghiệm.</p></a>
  </div>
  <p style="margin-top:18px"><a class="btn" href="assets/3-De-luyen-SHPT.pdf" target="_blank" rel="noopener">📄 Bản PDF để in</a> <a class="btn" href="assets/Cheatsheet-SHPT-4mat-A4.pdf" target="_blank" rel="noopener">📄 Cheatsheet 4 mặt A4</a></p>`;
}
async function renderExam(main, n) {
  let data;
  try { data = await (await fetch('data/exams.json')).json(); } catch (e) { main.innerHTML = '<div class="box bad">Không tải được đề.</div>'; return; }
  const ex = data[n - 1]; if (!ex) { main.innerHTML = 'Không có đề này.'; return; }
  let right = 0, answered = 0;
  main.innerHTML = `<div class="lesson-head"><div class="k"><a href="#/exams">← 3 đề luyện</a></div><h1>${ex.title}</h1></div>
   <div class="exam-score" id="score">Điểm: 0/0 câu đã làm · còn ${ex.mc.length} câu</div>
   <div class="sec quiz"><h2>Phần I · Trắc nghiệm (${ex.mc.length} câu)</h2>${ex.mc.map((q, i) => mcqHTML(q, i)).join('')}</div>
   <div class="sec found"><h2>Phần II · Tự luận</h2>${ex.tl.map((t, i) => `<div class="mcq"><div class="q">Câu ${i + 1}. ${t.q}</div><textarea style="width:100%;min-height:110px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--text);padding:8px;font:inherit" placeholder="Viết dàn ý trả lời trước…"></textarea><details class="qa"><summary>Xem đáp án gợi ý</summary><div class="ans">${t.a}</div></details></div>`).join('')}</div>
   <div class="navline">${n > 1 ? `<a class="btn" href="#/exam/${n - 1}">← Đề ${n - 1}</a>` : '<span></span>'}${n < 3 ? `<a class="btn primary" href="#/exam/${n + 1}">Đề ${n + 1} →</a>` : '<a class="btn primary" href="#/traps">Ôn bẫy →</a>'}</div>`;
  wireQuiz(main, (ok) => {
    answered++; if (ok) right++;
    $('#score').innerHTML = `Điểm: <span style="color:var(--good)">${right}</span>/${answered} câu đã làm · còn ${ex.mc.length - answered} câu` + (answered === ex.mc.length ? ` · <b>Kết quả: ${(right / ex.mc.length * 10).toFixed(1)}/10</b>` : '');
  });
}

route();
