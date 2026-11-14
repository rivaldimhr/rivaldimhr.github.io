/* Rangkuman SMP Interaktif — mesin aplikasi (tanpa framework) */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MAPEL = {
  fisika:     {n:'Fisika',     i:'⚡', c:'#2f7de1', bg:'#e6f0ff'},
  kimia:      {n:'Kimia',      i:'🧪', c:'#8b5cf6', bg:'#f1ebff'},
  biologi:    {n:'Biologi',    i:'🧬', c:'#16a34a', bg:'#e5f7eb'},
  matematika: {n:'Matematika', i:'📐', c:'#e58a00', bg:'#fff1db'},
};
const MK = Object.keys(MAPEL);
const byId = id => BAB.find(b => b.id === id);
const ofM = m => BAB.filter(b => b.mapel === m);
const mvars = m => `--mc:${MAPEL[m].c};--mbg:${MAPEL[m].bg}`;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- penyimpanan ---------- */
const KEY = 'rsmp-v2';
let S = (() => {
  const d = {nama:'', xp:0, koin:0, read:{}, quiz:{}, ex:{}, lab:{}, log:[], daily:'', tab:'fisika', quizN:0, quizBenar:0, quizSoal:0};
  try { return Object.assign(d, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return d; }
})();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const LV = 250;
const lvOf = x => Math.floor(x / LV) + 1;
const today = () => new Date().toLocaleDateString('sv-SE');
function gain(xp, koin, text, ic = '⭐') {
  const a = lvOf(S.xp);
  S.xp += xp; S.koin += koin;
  S.log.unshift({t: Date.now(), text, xp, ic}); S.log.length = Math.min(S.log.length, 400);
  save();
  if (xp || koin) toast(`+${xp} XP` + (koin ? `  ·  +${koin} 🪙` : ''));
  const b = lvOf(S.xp);
  if (b > a) setTimeout(() => levelUp(b), 600);
  refreshLv();
}
function refreshLv() {
  const bar = $('.xpbar i'); if (!bar) return;
  bar.style.width = (S.xp % LV) / LV * 100 + '%';
}
const readOf = id => S.read[id] || [];
const pct = b => Math.round(readOf(b.id).length / b.sesi.length * 100);
const done = b => readOf(b.id).length >= b.sesi.length;

/* ---------- elemen umum ---------- */
function toast(t) {
  const e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.append(e);
  requestAnimationFrame(() => e.classList.add('on'));
  setTimeout(() => { e.classList.remove('on'); setTimeout(() => e.remove(), 300); }, 1800);
}
function confetti(el, n = 40) {
  const c = document.createElement('div'); c.className = 'conf';
  c.innerHTML = Array.from({length:n}, (_, i) => `<i style="left:${Math.random()*100}%;animation-delay:${Math.random()*1.2}s;animation-duration:${2+Math.random()*2}s;background:${['#fde047','#f472b6','#60a5fa','#ffffff','#34d399','#fb923c'][i%6]}"></i>`).join('');
  el.append(c); return c;
}
function badgeSvg(n) {
  return `<svg class="badge" viewBox="0 0 120 130"><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>
  <polygon points="60,4 110,32 110,92 60,120 10,92 10,32" fill="url(#bg1)" stroke="#fff" stroke-width="5"/>
  <polygon points="60,20 96,40 96,84 60,104 24,84 24,40" fill="#3b82f6" stroke="#bfdbfe" stroke-width="3"/>
  <text x="60" y="78" text-anchor="middle" font-size="44" font-weight="700" fill="#fff" font-family="Poppins,sans-serif">${n}</text>
  <path d="M42 112l-8 16 14-4 6 12 6-14" fill="#ef4444"/><path d="M78 112l8 16-14-4-6 12-6-14" fill="#ef4444"/></svg>`;
}
function levelUp(l) {
  S.koin += 50; save();
  const o = document.createElement('div'); o.className = 'lvup';
  o.innerHTML = `${badgeSvg(l)}<h1>LEVEL UP</h1><p>Hebat, ${esc(S.nama || 'kamu')}! Kamu sekarang Level ${l} 🎉</p>
  <div class="bonus"><div>🪙<b>+50</b><small>Bonus Koin</small></div><div>⭐<b>${S.xp.toLocaleString('id-ID')}</b><small>Total XP</small></div></div>
  <div class="lvbtn"><button onclick="this.closest('.lvup').remove();location.hash='#/'">🏠<small>Beranda</small></button>
  <button class="o" onclick="bagikan(${l})">🔗<small>Bagikan</small></button>
  <button onclick="this.closest('.lvup').remove()">▶<small>Lanjut</small></button></div>`;
  document.body.append(o); confetti(o, 60);
}
function bagikan(l) {
  const url = location.href.split('#')[0];
  const t = `Aku baru naik ke Level ${l} di Rangkuman SMP Interaktif! 🎉`;
  if (navigator.share) navigator.share({text: t, url}).catch(() => {});
  else { try { navigator.clipboard.writeText(t + ' ' + url); toast('Teks disalin 📋'); } catch (e) { toast(t); } }
}
function askName() {
  const o = document.createElement('div'); o.className = 'ov';
  o.innerHTML = `<div class="box"><div style="font-size:46px">👋</div><h2>Halo! Siapa namamu?</h2>
  <p style="color:var(--mut);margin:6px 0 0">Namamu dipakai untuk menyapa dan tersimpan hanya di perangkat ini.</p>
  <input id="nm" maxlength="24" placeholder="Tulis nama panggilan" value="${esc(S.nama)}">
  <button class="btn" style="width:100%" onclick="setName()">Mulai Belajar 🚀</button></div>`;
  document.body.append(o); setTimeout(() => $('#nm').focus(), 50);
  $('#nm').onkeydown = e => { if (e.key === 'Enter') setName(); };
}
function setName() {
  const v = $('#nm').value.trim(); if (!v) { $('#nm').classList.add('shake'); return; }
  const first = !S.nama; S.nama = v; save(); $('.ov').remove(); render();
  if (first) gain(20, 10, 'Bergabung di Rangkuman SMP Interaktif', '👋');
}

/* ---------- router ---------- */
const routes = [
  [/^#?\/?$/, home],
  [/^#\/materi(?:\/(\w+))?$/, materi],
  [/^#\/bab\/(\w+)(?:\/(\w+))?$/, bab],
  [/^#\/kuis(?:\/(\w+))?$/, kuisList],
  [/^#\/main\/(\w+)\/(\w+)$/, (k, x) => mulaiKuis(k, x)],
  [/^#\/daily$/, () => mulaiKuis('daily', 'all')],
  [/^#\/laporan$/, laporan],
  [/^#\/rumus$/, rumusView],
  [/^#\/lab$/, labList],
  [/^#\/poster$/, posterView],
];
function render() {
  const h = location.hash || '#/';
  for (const [r, f] of routes) {
    const m = h.match(r);
    if (m) {
      const html = f(...m.slice(1));
      if (html === null) return;
      $('#app').innerHTML = html;
      window.scrollTo(0, 0);
      after();
      const sec = h.split('/')[1] || 'home';
      const key = {'': 'home', bab: 'materi', main: 'kuis', daily: 'kuis', rumus: 'materi', lab: 'materi', poster: 'home'}[sec] ?? sec;
      document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === key));
      return;
    }
  }
  location.hash = '#/';
}
function after() { document.querySelectorAll('[data-init]').forEach(el => { const n = el.dataset.init, f = window[n]; if (f) (n === 'sgInit' || n === 'ogInit') ? f(el) : f(); }); }
window.addEventListener('hashchange', render);

/* ---------- komponen ---------- */
function ring(p, c) {
  const r = 32, k = 2 * Math.PI * r;
  return `<svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="${r}" fill="none" stroke="#e8eef0" stroke-width="4"/><circle cx="35" cy="35" r="${r}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${k * p / 100} ${k}"/></svg>`;
}
const back = (href, t, s = '') => `<div class="bar"><a class="back" href="${href}">←</a><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div></div>`;
function segM(cur, hrefFn) {
  return `<div class="seg">${MK.map(m => `<a class="${m === cur ? 'on' : ''}" href="${hrefFn(m)}">${MAPEL[m].i} ${MAPEL[m].n}</a>`).join('')}</div>`;
}
function stars(best, n) {
  if (best == null) return '<span class="tag">Belum dikerjakan</span>';
  const p = best / n; const s = p === 1 ? 3 : p >= .6 ? 2 : p > 0 ? 1 : 0;
  return `<span class="stars">${'★'.repeat(s)}${'☆'.repeat(3 - s)}</span> <small>Terbaik ${best}/${n}</small>`;
}

/* ---------- kredit & tautan portofolio ---------- */
const PORTO = 'https://rivaldimhr.github.io/';
const credit = () => `<div class="credit"><div class="av">RM</div><div><small>Dibuat oleh</small><b>Rivaldi Mahari</b><small>Lulusan Sistem dan Teknologi Informasi ITB</small></div>
  <div class="cl"><a class="btn sm" href="${PORTO}#projects">Lihat portofolio ↗</a><a class="btn sm ghost" href="https://github.com/rivaldimhr/rivaldimhr.github.io/tree/main/rangkuman-smp" target="_blank" rel="noopener">Kode sumber</a></div></div>`;

/* ---------- BERANDA ---------- */
function home() {
  if (!S.nama) setTimeout(() => { if (!S.nama && !document.querySelector('.ov')) askName(); }, 300);
  const lv = lvOf(S.xp), xin = S.xp % LV;
  const cur = S.tab in MAPEL ? S.tab : 'fisika';
  const next = BAB.find(b => readOf(b.id).length && !done(b)) || BAB.find(b => !done(b));
  const dailyDone = S.daily === today();
  const quick = [['📚','Materi','#/materi'],['📝','Kuis & Tryout','#/kuis'],['🔬','Lab Interaktif','#/lab'],['📘','Kamus Rumus','#/rumus'],['📄','Poster A3','#/poster'],['📊','Laporan','#/laporan']];
  return `<div class="hero"><div class="top"><div><small>Selamat belajar 👋</small><h1>Hi, ${esc(S.nama || 'Pelajar')}</h1></div>
    <a class="porto" href="${PORTO}#projects" title="Portofolio pembuat">← Portofolio</a><button class="avatar" onclick="askName()" title="Ganti nama">${esc((S.nama || 'P')[0].toUpperCase())}</button></div></div>
  <div class="lvcard"><div class="lvrow"><div class="lvbadge">🏅</div><div><small>Peringkat Kamu</small><b>Level ${lv}</b></div>
    <div class="koin"><small>Koin</small><b>🪙 ${S.koin}</b></div></div>
    <div class="xpbar"><i style="width:${xin / LV * 100}%"></i></div>
    <div class="xptext"><span>${xin}/${LV} XP</span><span>${LV - xin} XP lagi ke Level ${lv + 1}</span></div></div>
  <div class="pad">
    <div class="search">🔍<input id="q" placeholder="Cari materi belajar di sini… (mis. Ohm, fotosintesis)" oninput="cari(this.value)"></div>
    <div id="hasil"></div>
    <div class="chips"><a class="chip red ${dailyDone ? 'done' : ''}" href="#/daily"><i>🔥</i><span>Daily Challenge${dailyDone ? ' ✓' : ''}<br><small>5 soal acak · +50 XP</small></span></a>
      <a class="chip orange" href="#/rumus"><i>📘</i><span>Kamus Rumus<br><small>Semua rumus 1 halaman</small></span></a></div>
    <h3 class="sec-t">Akses Cepat</h3>
    <div class="quick">${quick.map(([i, t, h]) => `<a href="${h}"><span>${i}</span>${t}</a>`).join('')}</div>
    ${next ? `<h3 class="sec-t">Lanjutkan Belajar</h3>
    <a class="cont" style="${mvars(next.mapel)}" href="#/bab/${next.id}"><div class="ic">${next.ikon}</div>
      <div style="flex:1"><small>${MAPEL[next.mapel].n} · Bab ${next.no}</small><b>${next.judul}</b><div class="mini"><i style="width:${pct(next)}%"></i></div></div><span class="go">▶</span></a>` : ''}
    <h3 class="sec-t">Paket Belajar <a href="#/materi/${cur}">Lihat semua</a></h3>
    <div class="seg">${MK.map(m => `<button class="${m === cur ? 'on' : ''}" onclick="S.tab='${m}';save();render()">${MAPEL[m].i} ${MAPEL[m].n}</button>`).join('')}</div>
    <div class="babgrid">${ofM(cur).map(b => `<a href="#/bab/${b.id}" style="${mvars(b.mapel)}"><div class="ic">${ring(pct(b), MAPEL[b.mapel].c)}${b.ikon}</div>${b.judul}</a>`).join('')}</div>
    ${credit()}
  </div>`;
}
function cari(q) {
  q = q.trim().toLowerCase(); const el = $('#hasil'); if (!q) { el.innerHTML = ''; return; }
  const hit = BAB.map(b => {
    const parts = [b.judul, b.ringkas, ...b.sesi.map(s => s.j), ...(b.rumus || []).map(r => r.join(' '))];
    const txt = parts.join(' | ').toLowerCase() + ' ' + b.sesi.map(s => s.h.replace(/<[^>]+>/g, ' ')).join(' ').toLowerCase();
    return txt.includes(q) ? b : null;
  }).filter(Boolean).slice(0, 8);
  el.innerHTML = `<div class="list" style="margin-top:12px">${hit.length ? hit.map(b => `<a class="lcard" style="${mvars(b.mapel)}" href="#/bab/${b.id}"><div class="ic">${b.ikon}</div><div><h4>${b.judul}</h4><p>${MAPEL[b.mapel].n} · Bab ${b.no}</p></div></a>`).join('') : '<div class="empty">Materi tidak ditemukan. Coba kata lain 🙂</div>'}</div>`;
}

/* ---------- MATERI ---------- */
function materi(m) {
  m = m in MAPEL ? m : (S.tab in MAPEL ? S.tab : 'fisika');
  const list = ofM(m); const sel = list.filter(done).length;
  return `<div class="pagehead"><small>Materi Belajar</small><h1>${MAPEL[m].i} ${MAPEL[m].n}</h1><small>${sel} dari ${list.length} bab selesai · materi kelas 7–9</small></div>
  <div class="pad">${segM(m, x => '#/materi/' + x)}
  <div class="list two" style="margin-top:14px">${list.map(b => `<a class="lcard" style="${mvars(m)}" href="#/bab/${b.id}"><div class="ic">${b.ikon}</div><div style="flex:1">
    <h4>Bab ${b.no}. ${b.judul}</h4><p>${b.ringkas}</p><div class="mini"><i style="width:${pct(b)}%"></i></div>
    <div class="meta"><span class="tag m">${b.sesi.length} pembahasan</span><span class="tag">${b.contoh.length} contoh soal</span>${b.lab ? '<span class="tag">🔬 lab</span>' : ''}${done(b) ? '<span class="tag ok">✓ selesai</span>' : ''}</div></div></a>`).join('')}</div></div>`;
}

/* ---------- BAB ---------- */
function bab(id, tab = 'materi') {
  const b = byId(id); if (!b) { location.hash = '#/materi'; return null; }
  const M = MAPEL[b.mapel], list = ofM(b.mapel), k = list.indexOf(b);
  const prev = list[k - 1], next = list[k + 1];
  const tabs = [['materi', 'Materi'], ['penemuan', 'Penemuan Rumus'], ['contoh', 'Contoh Soal'], ['lab', 'Lab Interaktif']];
  let body = '';
  if (tab === 'materi') {
    body = `<h3 class="sec-t">Pembahasan</h3>${b.sesi.map((s, i) => {
      const d = readOf(id).includes(i);
      return `<div class="sec ${d ? 'done' : ''} ${i === 0 && !d ? 'open' : ''}" id="s${i}"><div class="sechead" onclick="this.parentElement.classList.toggle('open')">
        <span class="num">${String(i + 1).padStart(2, '0')}</span><div><b>${s.j}</b><small>${d ? '✓ Sudah dipahami' : 'Ketuk untuk membaca'}</small></div><span class="st">${d ? '✓' : '▶'}</span></div>
        <div class="secbody">${s.h}<p style="margin-top:14px"><button class="btn sm" ${d ? 'disabled' : ''} onclick="paham('${id}',${i},this)">${d ? '✓ Sudah paham' : 'Saya sudah paham · +10 XP'}</button></p></div></div>`;
    }).join('')}`;
  } else if (tab === 'penemuan') {
    body = `<div class="story">${b.penemuan}</div><h3 class="sec-t">Rumus Penting</h3><div class="rumusbox">${(b.rumus || []).map(r => `<div class="rumus"><code>${r[0]}</code><span>${r[1]}</span></div>`).join('')}</div>`;
  } else if (tab === 'contoh') {
    body = `<p style="color:var(--mut)">Coba kerjakan sendiri dulu, lalu buka langkahnya satu per satu.</p>` + b.contoh.map((c, i) => `<div class="ex" id="ex${i}" data-n="${c.l.length}" data-k="0">
      <span class="tag m">Contoh ${i + 1}</span><p class="q">${c.s}</p><ol></ol><div class="exa"></div>
      <button class="btn sm" onclick="langkah('${id}',${i})">Lihat langkah 1 ▶</button></div>`).join('');
  } else if (tab === 'lab') {
    const L = b.lab && LABS[b.lab];
    body = L ? `<div class="lab"><h4>🔬 ${L.t}</h4>${L.h()}</div>` : '<div class="empty">Lab untuk bab ini segera hadir.</div>';
  }
  return `<div style="${mvars(b.mapel)}">${back('#/materi/' + b.mapel, M.n + ' · Bab ' + b.no, b.judul)}
  <div class="media">${b.svg}<span class="lbl">${M.i} ${M.n.toUpperCase()} · BAB ${b.no}</span><span class="pr">${pct(b)}% dipahami</span></div>
  <div class="tabs">${tabs.map(([t, n]) => `<a class="${t === tab ? 'on' : ''}" href="#/bab/${id}/${t}">${n}</a>`).join('')}</div>
  <div class="pad"><div class="intro"><span class="tag m">MATERI ${M.n.toUpperCase()}</span><h2>${b.ikon} ${b.judul}</h2><p>${b.ringkas}</p>
    <div class="facts"><span>📖 ${b.sesi.length} pembahasan</span><span>✏️ ${b.contoh.length} contoh soal</span><span>📝 ${b.kuis.soal.length} soal kuis</span></div></div>
  ${body}
  <a class="cta" href="#/main/bab/${id}"><span class="ic">📝</span><div><b>Kerjakan Kuis Bab ${b.no}</b><small>Membahas: ${b.kuis.bahas}</small></div><span class="go">▶</span></a>
  <div class="pn">${prev ? `<a href="#/bab/${prev.id}"><small>← Sebelumnya</small>${prev.judul}</a>` : '<span></span>'}${next ? `<a href="#/bab/${next.id}"><small>Berikutnya →</small>${next.judul}</a>` : ''}</div></div></div>`;
}
function paham(id, i, btn) {
  const r = S.read[id] = readOf(id); if (r.includes(i)) return;
  r.push(i); const b = byId(id);
  const sec = $('#s' + i); sec.classList.add('done'); sec.classList.remove('open');
  sec.querySelector('.st').textContent = '✓'; sec.querySelector('small').textContent = '✓ Sudah dipahami';
  btn.disabled = true; btn.textContent = '✓ Sudah paham';
  $('.media .pr').textContent = pct(b) + '% dipahami';
  gain(10, 1, `Memahami “${b.sesi[i].j}” (${b.judul})`, '📖');
  if (done(b)) { setTimeout(() => gain(40, 10, `Menyelesaikan bab ${b.judul}`, '🏆'), 900); confetti(document.body, 30); setTimeout(() => document.querySelector('body>.conf')?.remove(), 3500); }
  const nx = $('#s' + (i + 1)); if (nx && !nx.classList.contains('done')) { nx.classList.add('open'); nx.scrollIntoView({behavior: 'smooth', block: 'start'}); }
}
function langkah(id, i) {
  const b = byId(id), c = b.contoh[i], el = $('#ex' + i); let k = +el.dataset.k;
  const btn = el.querySelector('button');
  if (k < c.l.length) { el.querySelector('ol').insertAdjacentHTML('beforeend', `<li>${c.l[k]}</li>`); k++; el.dataset.k = k; }
  if (k < c.l.length) btn.textContent = `Lihat langkah ${k + 1} ▶`;
  else if (!el.querySelector('.ans')) {
    el.querySelector('.exa').innerHTML = `<div class="ans">✅ ${c.j}</div>`; btn.remove();
    const key = id + '-' + i; if (!S.ex[key]) { S.ex[key] = 1; gain(5, 1, `Mempelajari contoh soal ${b.judul}`, '✏️'); }
  }
}

/* ---------- KUIS ---------- */
function kuisList(m) {
  m = m in MAPEL ? m : (S.tab in MAPEL ? S.tab : 'fisika');
  const dd = S.daily === today();
  return `<div class="pagehead"><small>Tryout & Quiz</small><h1>📝 Latihan Soal</h1><small>Kuis dipisah dari materi. Setiap kuis menjelaskan apa saja yang dibahas, dan setiap soal punya pembahasan lengkap.</small></div>
  <div class="pad"><a class="banner" href="#/daily"><span class="ic">🔥</span><div><b>Daily Challenge ${dd ? '✓' : ''}</b><small>${dd ? 'Sudah selesai hari ini — boleh main lagi tanpa bonus.' : '5 soal acak dari semua mapel. Bonus +50 XP sekali sehari!'}</small></div><span class="btn sm">Main</span></a>
  <div style="margin-top:14px">${segM(m, x => '#/kuis/' + x)}</div>
  <a class="banner t" style="margin-top:14px" href="#/main/tryout/${m}"><span class="ic">🎯</span><div><b>Tryout ${MAPEL[m].n}</b><small>10 soal acak dari semua bab ${MAPEL[m].n} · ${stars(S.quiz['T-' + m], 10).replace(/<[^>]+>/g, '')}</small></div><span class="btn sm">Mulai</span></a>
  <h3 class="sec-t">Kuis per Bab</h3>
  <div class="list two">${ofM(m).map(b => `<div class="lcard" style="${mvars(m)}"><div class="ic">${b.ikon}</div><div style="flex:1">
    <h4>Kuis ${b.no} · ${b.judul}</h4><p>📌 <b>Membahas:</b> ${b.kuis.bahas}</p>
    <div class="meta"><span class="tag m">${b.kuis.soal.length} soal</span>${stars(S.quiz[b.id], b.kuis.soal.length)}</div>
    <p style="margin-top:10px"><a class="btn sm" href="#/main/bab/${b.id}">Mulai Kuis ▶</a> <a class="btn sm ghost" href="#/bab/${b.id}">Baca materi</a></p></div></div>`).join('')}</div></div>`;
}
let Q = null;
function rng(seed) { let a = 0; for (const ch of seed) a = (a * 31 + ch.charCodeAt(0)) | 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function mulaiKuis(kind, key) {
  let list, title, sub, bahas;
  const all = b => b.kuis.soal.map(s => ({...s, bab: b.id}));
  if (kind === 'bab') { const b = byId(key); if (!b) return location.hash = '#/kuis', null; list = all(b); title = `Kuis ${MAPEL[b.mapel].n} · Bab ${b.no}`; sub = b.judul; bahas = b.kuis.bahas; }
  else if (kind === 'tryout') { if (!MAPEL[key]) return location.hash = '#/kuis', null; list = shuffle(ofM(key).flatMap(all)).slice(0, 10); title = 'Tryout ' + MAPEL[key].n; sub = '10 soal acak'; bahas = 'campuran semua bab ' + MAPEL[key].n; }
  else { const r = rng(today()); const pool = BAB.flatMap(all); list = []; while (list.length < 5) { const s = pool[Math.floor(r() * pool.length)]; if (!list.includes(s)) list.push(s); } title = 'Daily Challenge'; sub = new Date().toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long'}); bahas = 'soal acak dari semua mapel (sama untuk semua orang hari ini)'; }
  list = list.map(s => { const idx = shuffle(s.o.map((_, i) => i)); return {...s, o: idx.map(i => s.o[i]), a: idx.indexOf(s.a)}; });
  Q = {kind, key, title, sub, bahas, list, i: 0, pick: [], score: 0};
  return quizIntro();
}
function quizIntro() {
  return `${back('#/kuis', 'Tryout & Quiz', Q.title)}<div class="pad"><div class="result"><div style="font-size:52px">📝</div><h2>${Q.title}</h2><p style="color:var(--mut);margin:4px 0">${Q.sub}</p>
  <div class="pemb" style="text-align:left"><b>📌 Kuis ini membahas</b><p>${Q.bahas}</p></div>
  <p style="font-size:14px;color:var(--mut)">${Q.list.length} soal pilihan ganda · setiap jawaban benar +10 XP · pembahasan muncul setelah kamu menjawab</p>
  <button class="btn" onclick="qShow()">Mulai sekarang ▶</button></div></div>`;
}
function qShow() {
  const s = Q.list[Q.i], b = byId(s.bab);
  $('#app').innerHTML = `${back('#/kuis', 'Tryout & Quiz', Q.title)}<div class="pad" style="${mvars(b.mapel)}">
  <div class="qhead"><div class="tt"><span>${Q.sub}</span><span>Benar: ${Q.score}</span></div><b>Soal ${Q.i + 1} dari ${Q.list.length}</b>
    <div class="qbar"><i style="width:${Q.i / Q.list.length * 100}%"></i></div></div>
  <div class="qcard"><span class="tag m">${MAPEL[b.mapel].i} ${b.judul}</span><p class="qtext">${s.q}</p>
    <div class="opts">${s.o.map((t, j) => `<button class="opt" onclick="jawab(${j})"><span>${'ABCD'[j]}</span>${t}</button>`).join('')}</div><div id="fb"></div></div></div>`;
  window.scrollTo(0, 0);
}
function jawab(j) {
  const s = Q.list[Q.i]; if (Q.pick[Q.i] != null) return;
  Q.pick[Q.i] = j; const ok = j === s.a; if (ok) Q.score++;
  const bs = document.querySelectorAll('.opt'); bs.forEach(b => b.disabled = true);
  bs[s.a].classList.add('ok'); if (!ok) bs[j].classList.add('no');
  const last = Q.i === Q.list.length - 1;
  $('#fb').innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}">${ok ? '✅ Benar! +10 XP' : `❌ Kurang tepat. Jawaban benar: ${'ABCD'[s.a]}`}</div>
    <div class="pemb"><b>💡 Pembahasan</b><p>${s.p}</p></div>
    <button class="btn" onclick="${last ? 'qEnd()' : 'Q.i++;qShow()'}">${last ? 'Lihat hasil 🏁' : 'Soal berikutnya →'}</button>`;
  $('.qbar i').style.width = (Q.i + 1) / Q.list.length * 100 + '%';
  $('#fb').scrollIntoView({behavior: 'smooth', block: 'nearest'});
}
function qEnd() {
  const n = Q.list.length, sc = Q.score, p = sc / n;
  const id = Q.kind === 'bab' ? Q.key : Q.kind === 'tryout' ? 'T-' + Q.key : null;
  if (id) S.quiz[id] = Math.max(S.quiz[id] ?? 0, sc);
  S.quizN++; S.quizBenar += sc; S.quizSoal += n;
  let xp = sc * 10, koin = sc + (p === 1 ? 10 : 0), extra = '';
  if (Q.kind === 'daily' && S.daily !== today()) { S.daily = today(); xp += 50; koin += 20; extra = '<p>🔥 Bonus Daily Challenge: +50 XP & +20 koin</p>'; }
  save();
  const msg = p === 1 ? 'Sempurna! Kamu menguasai materi ini 🏆' : p >= .8 ? 'Hebat! Tinggal sedikit lagi 💪' : p >= .6 ? 'Lumayan! Baca pembahasan yang salah ya 📖' : 'Jangan menyerah — pelajari lagi materinya lalu coba ulang 🌱';
  const r = 54, k = 2 * Math.PI * r;
  $('#app').innerHTML = `${back('#/kuis', 'Hasil Kuis', Q.title)}<div class="pad"><div class="result" id="res">
    <div class="ring"><svg viewBox="0 0 130 130"><circle cx="65" cy="65" r="${r}" fill="none" stroke="#e8eef0" stroke-width="12"/><circle cx="65" cy="65" r="${r}" fill="none" stroke="${p >= .6 ? '#16a34a' : '#f59e0b'}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${p ? k * p : 0} ${k}" opacity="${p ? 1 : 0}" transform="rotate(-90 65 65)"/></svg><b>${sc}/${n}</b></div>
    <div class="stars" style="font-size:26px">${'★'.repeat(p === 1 ? 3 : p >= .6 ? 2 : p > 0 ? 1 : 0)}${'☆'.repeat(3 - (p === 1 ? 3 : p >= .6 ? 2 : p > 0 ? 1 : 0))}</div>
    <h2>${msg}</h2><p>+${xp} XP · +${koin} 🪙</p>${extra}
    <p><button class="btn" onclick="ulangi()">🔄 Ulangi</button> <a class="btn ghost" href="#/kuis">Daftar kuis</a>
    ${Q.kind === 'bab' ? ` <a class="btn ghost" href="#/bab/${Q.key}">Pelajari materi</a>` : ''}</p></div>
  <h3 class="sec-t">Pembahasan Semua Soal</h3><div class="review">${Q.list.map((s, i) => { const ok = Q.pick[i] === s.a; return `<details ${ok ? '' : 'open'}><summary>${ok ? '✅' : '❌'} ${i + 1}. ${s.q}</summary>
    <p>Jawabanmu: <b>${s.o[Q.pick[i]]}</b>${ok ? '' : ` · Jawaban benar: <b>${s.o[s.a]}</b>`}</p><div class="pemb"><b>💡 Pembahasan</b><p>${s.p}</p></div></details>`; }).join('')}</div></div>`;
  window.scrollTo(0, 0);
  if (p >= .8) { const c = confetti($('#res').parentElement.parentElement, 40); setTimeout(() => c.remove(), 4000); }
  gain(xp, koin, `${Q.title}: ${sc}/${n} benar`, '📝');
}

function ulangi() { $('#app').innerHTML = mulaiKuis(Q.kind, Q.key); window.scrollTo(0, 0); }

/* ---------- LAPORAN ---------- */
let selDay = null;
function laporan() {
  const now = new Date(); const dow = (now.getDay() + 6) % 7; const mon = new Date(now); mon.setDate(now.getDate() - dow); mon.setHours(0, 0, 0, 0);
  const days = Array.from({length: 7}, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
  const key = d => d.toLocaleDateString('sv-SE');
  selDay = selDay || today();
  const logs = S.log.filter(l => key(new Date(l.t)) === selDay);
  const has = new Set(S.log.map(l => key(new Date(l.t))));
  const babDone = BAB.filter(done).length;
  const avg = S.quizSoal ? Math.round(S.quizBenar / S.quizSoal * 100) : 0;
  const nm = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  return `<div class="pagehead"><small>Laporan Belajar</small><h1>📊 ${esc(S.nama || 'Pelajar')}</h1><small>${now.toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}</small></div>
  <div class="pad"><div class="days">${days.map((d, i) => `<button class="${key(d) === selDay ? 'on' : ''} ${has.has(key(d)) ? 'has' : ''}" onclick="selDay='${key(d)}';render()">${nm[i]}<b>${String(d.getDate()).padStart(2, '0')}</b></button>`).join('')}</div>
  <div class="stats"><div><b>${lvOf(S.xp)}</b><small>Level</small></div><div><b>${S.xp}</b><small>Total XP</small></div><div><b>${S.koin}</b><small>Koin</small></div>
    <div><b>${babDone}/${BAB.length}</b><small>Bab selesai</small></div><div><b>${S.quizN}</b><small>Kuis dikerjakan</small></div><div><b>${avg}%</b><small>Rata-rata benar</small></div></div>
  <h3 class="sec-t">Progres per Mapel</h3>${MK.map(m => { const l = ofM(m); const r = l.reduce((a, b) => a + readOf(b.id).length, 0), t = l.reduce((a, b) => a + b.sesi.length, 0); const q = l.filter(b => S.quiz[b.id] != null).length; return `<div class="mprog" style="${mvars(m)}"><div class="row"><b>${MAPEL[m].i} ${MAPEL[m].n}</b><span>${Math.round(r / t * 100)}% materi · ${q}/${l.length} kuis</span></div><div class="mini"><i style="width:${r / t * 100}%"></i></div></div>`; }).join('')}
  <h3 class="sec-t">Aktivitas ${selDay === today() ? 'Hari Ini' : new Date(selDay).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'short'})}</h3>
  ${logs.length ? logs.map(l => `<div class="act"><span class="ic">${l.ic || '⭐'}</span><div>${esc(l.text)}<br><small>${new Date(l.t).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</small></div><span class="xp">+${l.xp} XP</span></div>`).join('') : '<div class="empty">Belum ada aktivitas di hari ini. Yuk mulai belajar! 🚀</div>'}
  <p style="text-align:center;margin-top:24px"><button class="btn sm ghost" onclick="resetAll()">Atur ulang semua progres</button></p>${credit()}</div>`;
}
function resetAll() { if (confirm('Hapus semua progres, XP, dan koin di perangkat ini?')) { const n = S.nama; localStorage.removeItem(KEY); S = {nama: n, xp: 0, koin: 0, read: {}, quiz: {}, ex: {}, lab: {}, log: [], daily: '', tab: 'fisika', quizN: 0, quizBenar: 0, quizSoal: 0}; save(); render(); toast('Progres diatur ulang'); } }

/* ---------- KAMUS RUMUS, LAB, POSTER ---------- */
function rumusView() {
  return `${back('#/', 'Kamus Rumus', 'Semua rumus dari 27 bab')}<div class="pad"><div class="search">🔍<input placeholder="Cari rumus, mis. massa jenis, gradien" oninput="filterRumus(this.value)"></div>
  ${MK.map(m => `<div style="${mvars(m)}"><h3 class="sec-t">${MAPEL[m].i} ${MAPEL[m].n}</h3>${ofM(m).filter(b => b.rumus?.length).map(b => `<div class="rgrp"><a href="#/bab/${b.id}/penemuan" style="font-weight:700;font-size:14px;color:var(--mc)">Bab ${b.no}. ${b.judul} →</a><div class="rumusbox" style="margin:8px 0 14px">${b.rumus.map(r => `<div class="rumus" data-s="${esc((r[0] + ' ' + r[1] + ' ' + b.judul).toLowerCase())}"><code>${r[0]}</code><span>${r[1]}</span></div>`).join('')}</div></div>`).join('')}</div>`).join('')}</div>`;
}
function filterRumus(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.rumus[data-s]').forEach(r => r.style.display = r.dataset.s.includes(q) ? '' : 'none');
  document.querySelectorAll('.rgrp').forEach(g => g.style.display = [...g.querySelectorAll('.rumus')].some(r => r.style.display !== 'none') ? '' : 'none');
}
function labList() {
  return `${back('#/', 'Lab Interaktif', 'Belajar sambil bereksperimen')}<div class="pad">${MK.map(m => `<h3 class="sec-t">${MAPEL[m].i} ${MAPEL[m].n}</h3><div class="list two">${ofM(m).filter(b => b.lab && LABS[b.lab]).map(b => `<a class="lcard" style="${mvars(m)}" href="#/bab/${b.id}/lab"><div class="ic">🔬</div><div><h4>${LABS[b.lab].t}</h4><p>Bab ${b.no} · ${b.judul}</p>${S.lab[b.lab] ? '<div class="meta"><span class="tag ok">✓ dicoba</span></div>' : ''}</div></a>`).join('')}</div>`).join('')}</div>`;
}
function posterView() {
  return `${back('#/', 'Poster A3', 'Rangkuman siap cetak')}<div class="pad"><p style="color:var(--mut)">Setiap poster berisi rangkuman satu mata pelajaran dalam satu halaman A3. Cetak dengan ukuran kertas A3 dan skala 100%.</p>
  <div class="list two">${MK.map(m => `<a class="lcard" style="${mvars(m)}" href="poster/Rangkuman_${MAPEL[m].n}_A3.pdf" target="_blank" rel="noopener"><div class="ic">📄</div><div><h4>Rangkuman ${MAPEL[m].n}</h4><p>PDF · A3 (297 × 420 mm) · 1 halaman</p><div class="meta"><span class="tag m">Unduh / buka ↗</span></div></div></a>`).join('')}</div></div>`;
}
function labDone(key, t) { if (!S.lab[key]) { S.lab[key] = 1; gain(15, 3, 'Lab: ' + t, '🔬'); } }

render();
