/* Lab interaktif — dipanggil dari tab "Lab Interaktif" di tiap bab */
const el = id => document.getElementById(id);
const nv = id => parseFloat(el(id).value);
const fx = (v, d = 2) => Number.isFinite(v) ? (+v.toFixed(d)).toLocaleString('id-ID') : '—';
const G = {};
const alive = node => node && document.body.contains(node);

/* ===== mesin permainan: memilah & mengurutkan ===== */
function sortGame(id, cats, items, k, t) {
  return `<div class="game" id="${id}" data-init="sgInit" data-c="${esc(JSON.stringify(cats))}" data-i="${esc(JSON.stringify(items))}" data-k="${k}" data-t="${esc(t)}"></div>`;
}
function sgInit(e) { G[e.id] = {items: shuffle(JSON.parse(e.dataset.i)), i: 0, sc: 0}; sgDraw(e.id); }
function sgDraw(id) {
  const g = G[id], e = el(id), cats = JSON.parse(e.dataset.c);
  if (g.i >= g.items.length) {
    e.innerHTML = `<div class="gq">🎉 Skor kamu ${g.sc}/${g.items.length}</div><button class="btn sm" onclick="sgInit(el('${id}'))">Main lagi</button>`;
    labDone(e.dataset.k, e.dataset.t); return;
  }
  e.innerHTML = `<small>Item ${g.i + 1} dari ${g.items.length} · Benar ${g.sc}</small><div class="gq">${g.items[g.i][0]}</div>
  <div class="gbtn">${cats.map((c, j) => `<button onclick="sgPick('${id}',${j})">${c}</button>`).join('')}</div><div class="gs"></div>`;
}
function sgPick(id, j) {
  const g = G[id], e = el(id), it = g.items[g.i], cats = JSON.parse(e.dataset.c);
  if (g.lock) return; g.lock = 1; const ok = j === it[1]; if (ok) g.sc++;
  e.querySelector('.gs').innerHTML = (ok ? '✅ Benar! ' : `❌ Jawabannya <b>${cats[it[1]]}</b>. `) + (it[2] || '');
  setTimeout(() => { g.lock = 0; g.i++; sgDraw(id); }, ok ? 1100 : 2600);
}
function orderGame(id, items, k, t) {
  return `<div class="ord" id="${id}" data-init="ogInit" data-i="${esc(JSON.stringify(items))}" data-k="${k}" data-t="${esc(t)}"></div>`;
}
function ogInit(e) {
  const items = JSON.parse(e.dataset.i); G[e.id] = {n: items.length, pos: 0, err: 0};
  e.innerHTML = `<small>Ketuk kartu sesuai urutan yang benar</small><div class="ans"></div><div class="pool">${shuffle(items.map((x, i) => [x, i])).map(([x, i]) => `<button data-n="${i}" onclick="ogPick('${e.id}',this)">${x}</button>`).join('')}</div><div class="gs"></div>`;
}
function ogPick(id, b) {
  const g = G[id], e = el(id);
  if (+b.dataset.n === g.pos) {
    e.querySelector('.ans').insertAdjacentHTML('beforeend', `<span>${b.textContent}</span>`); b.remove(); g.pos++;
    if (g.pos === g.n) { e.querySelector('.gs').innerHTML = `🎉 Urutan benar! ${g.err ? `(${g.err} kali salah)` : 'Tanpa salah!'} <button class="btn sm" onclick="ogInit(el('${id}'))">Ulangi</button>`; labDone(e.dataset.k, e.dataset.t); }
  } else { g.err++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
}

/* ===== FISIKA ===== */
const UNIT = {
  p: {n: 'Panjang', u: [['km', 1000], ['hm', 100], ['dam', 10], ['m', 1], ['dm', .1], ['cm', .01], ['mm', .001]]},
  m: {n: 'Massa', u: [['ton', 1000], ['kg', 1], ['hg', .1], ['dag', .01], ['g', .001], ['mg', 1e-6]]},
  w: {n: 'Waktu', u: [['jam', 3600], ['menit', 60], ['detik', 1]]},
  v: {n: 'Kecepatan', u: [['km/jam', 1 / 3.6], ['m/s', 1], ['cm/s', .01]]},
};
function cvU() { const t = el('cvT').value; el('cvF').innerHTML = UNIT[t].u.map(([n]) => `<option>${n}</option>`).join(''); el('cvF').value = {p: 'km', m: 'kg', w: 'jam', v: 'km/jam'}[t]; cv(); }
function cv(u) {
  const t = el('cvT').value, U = UNIT[t].u, f = U.find(x => x[0] === el('cvF').value)[1], base = nv('cvN') * f;
  el('cvO').innerHTML = U.map(([n, k]) => `${fx(base / k, 6)} <b>${n}</b>`).join(' &nbsp;=&nbsp; ');
  if (u) labDone('satuan', 'Konversi Satuan');
}

const FLUIDA = [['Air', 1], ['Minyak goreng', .8], ['Air laut', 1.03], ['Gliserin', 1.26], ['Raksa', 13.6]];
function mj(u) {
  const m = nv('mjM'), V = nv('mjV'), rf = +el('mjF').value, r = m / V;
  let st, y, frac;
  if (Math.abs(r - rf) < .005) { st = 'MELAYANG (ρ benda = ρ zat cair)'; y = 78; }
  else if (r < rf) { frac = r / rf; st = `TERAPUNG (ρ benda &lt; ρ zat cair) — ${Math.round(frac * 100)}% volumenya tercelup`; y = 50 + 40 * frac - 40; }
  else { st = 'TENGGELAM (ρ benda &gt; ρ zat cair)'; y = 108; }
  el('mjS').innerHTML = `<rect x="70" y="20" width="180" height="130" rx="8" fill="none" stroke="#94a3b8" stroke-width="3"/>
   <rect x="72" y="50" width="176" height="98" fill="${rf > 5 ? '#cbd5e1' : rf < 1 ? '#fde68a' : '#bae6fd'}" opacity=".8"/>
   <rect x="140" y="${y}" width="40" height="40" rx="4" fill="#f97316" stroke="#9a3412" stroke-width="2"/><text x="160" y="${y + 25}" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">ρ=${fx(r)}</text>`;
  el('mjO').innerHTML = `ρ = m / V = ${fx(m)} / ${fx(V)} = <b>${fx(r, 3)} g/cm³</b> = ${fx(r * 1000, 1)} kg/m³ → ${st}`;
  if (u) labDone('massajenis', 'Terapung atau Tenggelam?');
}
function mjSet(m, V) { el('mjM').value = m; el('mjV').value = V; mj(1); }

function suhu(u) {
  const c = nv('shC'); const vals = [['Celcius', c, '°C', -40, 120], ['Reamur', c * 4 / 5, '°R', -32, 96], ['Fahrenheit', c * 9 / 5 + 32, '°F', -40, 248], ['Kelvin', c + 273, 'K', 233, 393]];
  const fr = (c + 40) / 160;
  el('shS').innerHTML = vals.map(([n, v, s], i) => { const x = 50 + i * 80; return `<rect x="${x - 8}" y="30" width="16" height="130" rx="8" fill="#fff" stroke="#94a3b8" stroke-width="2"/>
    <rect x="${x - 4}" y="${34 + 122 * (1 - fr)}" width="8" height="${122 * fr + 8}" fill="#ef4444"/><circle cx="${x}" cy="168" r="13" fill="#ef4444" stroke="#94a3b8" stroke-width="2"/>
    <text x="${x}" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#16323f">${fx(v, 1)}${s}</text><text x="${x}" y="198" text-anchor="middle" font-size="11" fill="#6b7f88">${n}</text>`; }).join('');
  el('shO').innerHTML = `${fx(c, 1)}°C → R = ⁴⁄₅ × ${fx(c, 1)} = ${fx(c * .8, 1)}°R · F = ⁹⁄₅ × ${fx(c, 1)} + 32 = ${fx(c * 1.8 + 32, 1)}°F · K = ${fx(c, 1)} + 273 = ${fx(c + 273, 1)} K`;
  if (u) labDone('suhu', 'Termometer Ajaib');
}

let glAnim = 0;
function glbb() {
  const v0 = nv('gV'), a = nv('gA'), T = Math.min(Math.max(nv('gT'), 1), 20);
  const s = t => v0 * t + .5 * a * t * t, sT = s(T);
  let rows = ''; for (let t = 0; t <= T; t++) rows += `<tr><td>${t}</td><td>${fx(v0 + a * t)}</td><td>${fx(s(t))}</td></tr>`;
  el('gTb').innerHTML = `<table><tr><th>t (s)</th><th>v (m/s)</th><th>s (m)</th></tr>${rows}</table>`;
  el('gO').innerHTML = `vₜ = v₀ + a·t = ${v0} + ${a}×${T} = <b>${fx(v0 + a * T)} m/s</b> · s = v₀·t + ½·a·t² = <b>${fx(sT)} m</b> · ${a === 0 ? 'GLB (a = 0)' : a > 0 ? 'GLBB dipercepat' : 'GLBB diperlambat'}`;
  const max = Math.max(...Array.from({length: T + 1}, (_, t) => Math.abs(s(t))), 1);
  const car = el('gCar'), t0 = performance.now(), id = ++glAnim, dur = Math.min(T, 6) * 1000;
  const stepF = now => { if (id !== glAnim || !alive(car)) return; const k = Math.min((now - t0) / dur, 1), t = k * T;
    car.setAttribute('x', 20 + 270 * Math.max(0, s(t)) / max); el('gClk').textContent = `t = ${fx(t, 1)} s · v = ${fx(v0 + a * t, 1)} m/s`; if (k < 1) requestAnimationFrame(stepF); };
  requestAnimationFrame(stepF); labDone('glbb', 'Balapan GLBB');
}

function tuas(u) {
  const w = nv('tW'), lb = nv('tB'), lk = nv('tK'), F = w * lb / lk, xf = 30 + 260 * lb / (lb + lk);
  el('tS').innerHTML = `<line x1="30" y1="90" x2="290" y2="90" stroke="#92400e" stroke-width="8" stroke-linecap="round"/>
   <polygon points="${xf},94 ${xf - 18},130 ${xf + 18},130" fill="#64748b"/><rect x="18" y="50" width="34" height="36" rx="4" fill="#f97316"/><text x="35" y="72" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${w} N</text>
   <line x1="285" y1="30" x2="285" y2="80" stroke="#16a34a" stroke-width="4" marker-end="url(#ah)"/><text x="285" y="22" text-anchor="middle" font-size="12" font-weight="700" fill="#16a34a">F = ${fx(F)} N</text>
   <text x="${(30 + xf) / 2}" y="150" text-anchor="middle" font-size="12" fill="#6b7f88">Lb = ${lb} cm</text><text x="${(xf + 290) / 2}" y="150" text-anchor="middle" font-size="12" fill="#6b7f88">Lk = ${lk} cm</text>
   <defs><marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#16a34a"/></marker></defs>`;
  el('tO').innerHTML = `w × Lb = F × Lk → F = ${w} × ${lb} / ${lk} = <b>${fx(F)} N</b> · Keuntungan mekanis KM = Lk / Lb = <b>${fx(lk / lb)}</b> ${lk > lb ? '(lebih ringan 👍)' : lk < lb ? '(malah lebih berat!)' : ''}`;
  if (u) labDone('tuas', 'Tuas Archimedes');
}

function gelInit(e) {
  const svg = el('wS'), t0 = performance.now();
  const loop = now => { if (!alive(svg)) return; const A = nv('wA'), L = nv('wL'), f = nv('wF'), t = (now - t0) / 1000 * .5;
    let d = ''; for (let x = 0; x <= 320; x += 3) d += (x ? 'L' : 'M') + x + ' ' + (90 - A * 14 * Math.sin(2 * Math.PI * (x / (L * 60) - f * t))).toFixed(1);
    svg.innerHTML = `<line x1="0" y1="90" x2="320" y2="90" stroke="#cbd5e1" stroke-dasharray="4"/><path d="${d}" fill="none" stroke="#2f7de1" stroke-width="3"/>
      <line x1="10" y1="160" x2="${10 + L * 60}" y2="160" stroke="#f59e0b" stroke-width="3"/><text x="${10 + L * 30}" y="175" text-anchor="middle" font-size="12" fill="#b45309">λ = ${L} m</text>`;
    el('wO').innerHTML = `v = λ × f = ${L} × ${f} = <b>${fx(L * f)} m/s</b> · T = 1/f = ${fx(1 / f, 3)} s · amplitudo ${A} satuan`;
    requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}

function lensa(u) {
  const j = el('lJ').value; let f = Math.abs(nv('lF')); const s = nv('lS');
  if (j === 'cembungC' || j === 'cekungL') f = -f;
  const cermin = j.endsWith('C'); const inv = 1 / f - 1 / s;
  if (Math.abs(inv) < 1e-9) { el('lO').innerHTML = 'Benda tepat di titik fokus → sinar pantul/bias sejajar, bayangan di jauh tak hingga.'; el('lS2').innerHTML = ''; return; }
  const sp = 1 / inv, M = -sp / s, nyata = sp > 0;
  const sifat = [nyata ? 'nyata' : 'maya', M < 0 ? 'terbalik' : 'tegak', Math.abs(M) > 1.001 ? 'diperbesar' : Math.abs(M) < .999 ? 'diperkecil' : 'sama besar'].join(', ');
  const x0 = 170, ax = 100, k = 140 / Math.max(s, Math.abs(sp), 2 * Math.abs(f));
  const xo = x0 - s * k, xi = cermin ? x0 - sp * k : x0 + sp * k, hi = Math.max(-80, Math.min(80, M * 40));
  const fp = cermin ? [x0 - f * k] : [x0 - f * k, x0 + f * k];
  const arrow = (x, h, c, dash) => `<line x1="${x}" y1="${ax}" x2="${x}" y2="${ax - h}" stroke="${c}" stroke-width="4" ${dash ? 'stroke-dasharray="5 4"' : ''}/><polygon points="${x - 6},${ax - h + (h > 0 ? 8 : -8)} ${x + 6},${ax - h + (h > 0 ? 8 : -8)} ${x},${ax - h}" fill="${c}"/>`;
  el('lS2').innerHTML = `<line x1="0" y1="${ax}" x2="340" y2="${ax}" stroke="#94a3b8"/>
    ${cermin ? `<path d="M${x0 + (f > 0 ? 8 : -8)} 30 Q${x0 + (f > 0 ? -8 : 8)} ${ax} ${x0 + (f > 0 ? 8 : -8)} 170" fill="none" stroke="#0b7d84" stroke-width="4"/>` : `<ellipse cx="${x0}" cy="${ax}" rx="${f > 0 ? 9 : 4}" ry="70" fill="#bae6fd" stroke="#0b7d84" stroke-width="2"/>`}
    ${fp.map(x => `<circle cx="${x}" cy="${ax}" r="4" fill="#ef4444"/><text x="${x}" y="${ax + 18}" text-anchor="middle" font-size="11" fill="#ef4444">F</text>`).join('')}
    ${arrow(xo, 40, '#f97316')}<text x="${xo}" y="${ax + 34}" text-anchor="middle" font-size="11">benda</text>
    ${Math.abs(xi) < 2000 ? arrow(xi, hi, '#2f7de1', !nyata) + `<text x="${xi}" y="${ax + (hi > 0 ? 34 : -hi + 14)}" text-anchor="middle" font-size="11" fill="#2f7de1">bayangan</text>` : ''}`;
  el('lO').innerHTML = `1/s' = 1/f − 1/s = 1/${fx(f)} − 1/${fx(s)} → <b>s' = ${fx(sp)} cm</b> · M = |s'/s| = <b>${fx(Math.abs(M))}×</b> · Sifat bayangan: <b>${sifat}</b>`;
  if (u) labDone('lensa', 'Meja Optik');
}

function listrik(u) {
  const V = nv('eV'), r1 = nv('eR1'), r2 = nv('eR2'), seri = el('eM').value === 's';
  let Rt, I, I1, I2, V1, V2;
  if (seri) { Rt = r1 + r2; I = V / Rt; I1 = I2 = I; V1 = I * r1; V2 = I * r2; } else { Rt = r1 * r2 / (r1 + r2); I = V / Rt; V1 = V2 = V; I1 = V / r1; I2 = V / r2; }
  const P1 = V1 * I1, P2 = V2 * I2, pm = Math.max(P1, P2, 1e-9), mx = V * V / Math.min(r1, r2);
  const bulb = (x, y, P, n) => `<circle cx="${x}" cy="${y}" r="26" fill="#fde047" opacity="${Math.min(.85, P / mx)}"/><circle cx="${x}" cy="${y}" r="14" fill="#fef9c3" stroke="#475569" stroke-width="2"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" font-weight="700">${n}</text>`;
  el('eS').innerHTML = (seri ? `<path d="M60 40H260V140H60Z" fill="none" stroke="#475569" stroke-width="3"/>${bulb(130, 40, P1, 'R₁')}${bulb(200, 40, P2, 'R₂')}`
    : `<path d="M60 40H260V140H60Z M180 40V140" fill="none" stroke="#475569" stroke-width="3"/>${bulb(180, 90, P1, 'R₁')}${bulb(260, 90, P2, 'R₂')}`)
    + `<rect x="48" y="78" width="24" height="24" fill="#eef5f6"/><line x1="44" y1="84" x2="76" y2="84" stroke="#16323f" stroke-width="4"/><line x1="52" y1="96" x2="68" y2="96" stroke="#16323f" stroke-width="4"/><text x="30" y="94" font-size="12" font-weight="700">${V}V</text>`;
  el('eO').innerHTML = `${seri ? 'Seri' : 'Paralel'}: R<sub>total</sub> = <b>${fx(Rt)} Ω</b> · I<sub>total</sub> = V/R = <b>${fx(I)} A</b><br>R₁: V = ${fx(V1)} V, I = ${fx(I1)} A, P = ${fx(P1)} W &nbsp;|&nbsp; R₂: V = ${fx(V2)} V, I = ${fx(I2)} A, P = ${fx(P2)} W<br>Daya total = ${fx(P1 + P2)} W ${seri ? '· Lampu dirangkai seri lebih redup karena tegangan terbagi.' : '· Paralel: tiap lampu mendapat tegangan penuh, jadi lebih terang.'}`;
  if (u) labDone('listrik', 'Rangkaian Lampu');
}

const PLANET = [
  ['☀️ Matahari', '#fbbf24', 0, '109× Bumi', '—', '—', 'Bintang pusat tata surya; menyimpan ±99,8% massa tata surya. Energinya dari fusi hidrogen menjadi helium.'],
  ['Merkurius', '#a8a29e', .39, '0,38× Bumi', '88 hari', '0', 'Planet terkecil & terdekat. Siang ±430°C, malam −180°C karena hampir tanpa atmosfer.'],
  ['Venus', '#f5d0a9', .72, '0,95× Bumi', '225 hari', '0', 'Planet terpanas (±465°C) karena efek rumah kaca CO₂ yang sangat tebal; berotasi berlawanan arah.'],
  ['Bumi', '#3b82f6', 1, '1× Bumi', '365¼ hari', '1', 'Satu-satunya planet yang diketahui memiliki kehidupan dan air cair di permukaan.'],
  ['Mars', '#ef4444', 1.52, '0,53× Bumi', '687 hari', '2', 'Planet merah karena karat (besi oksida). Gunung Olympus Mons ±2,5× tinggi Everest.'],
  ['Jupiter', '#d4a373', 5.2, '11,2× Bumi', '11,9 tahun', 'puluhan', 'Planet terbesar. Bintik Merah Besar adalah badai raksasa yang lebih lebar dari Bumi.'],
  ['Saturnus', '#e9c46a', 9.5, '9,4× Bumi', '29,5 tahun', 'sangat banyak', 'Cincinnya dari es & batu. Massa jenis rata-ratanya lebih kecil dari air.'],
  ['Uranus', '#67e8f9', 19.2, '4× Bumi', '84 tahun', 'puluhan', 'Sumbu rotasinya miring ±98° sehingga seolah “menggelinding” di orbitnya.'],
  ['Neptunus', '#6366f1', 30.1, '3,9× Bumi', '165 tahun', 'belasan', 'Planet terjauh; anginnya tercepat. Ditemukan 1846 lewat perhitungan matematika lebih dulu.'],
];
function tsInit() { tsPick(3, 0); }
function tsPick(i, u) {
  const p = PLANET[i];
  el('tsS').innerHTML = `<circle cx="20" cy="90" r="22" fill="#fbbf24"/>` + PLANET.slice(1).map((q, j) => { const r = 40 + j * 33; return `<circle cx="20" cy="90" r="${r}" fill="none" stroke="#e2e8f0"/><circle cx="${20 + r}" cy="90" r="${[4, 6, 6, 5, 11, 10, 8, 8][j]}" fill="${q[1]}" stroke="${j + 1 === i ? '#16323f' : 'none'}" stroke-width="2" style="cursor:pointer" onclick="tsPick(${j + 1},1)"/>`; }).join('');
  document.querySelectorAll('.planets button').forEach((b, j) => b.classList.toggle('on', j === i));
  el('tsO').innerHTML = `<b>${p[0]}</b>${p[2] ? ` · jarak ${String(p[2]).replace('.', ',')} SA dari Matahari` : ''} · ukuran ${p[3]} · revolusi ${p[4]} · satelit: ${p[5]}<br>${p[6]}`;
  if (u) labDone('tatasurya', 'Jelajah Tata Surya');
}

/* ===== KIMIA ===== */
const ELEM = [['H', 'Hidrogen', 1], ['He', 'Helium', 4], ['Li', 'Litium', 7], ['Be', 'Berilium', 9], ['B', 'Boron', 11], ['C', 'Karbon', 12], ['N', 'Nitrogen', 14], ['O', 'Oksigen', 16], ['F', 'Fluorin', 19], ['Ne', 'Neon', 20], ['Na', 'Natrium', 23], ['Mg', 'Magnesium', 24], ['Al', 'Aluminium', 27], ['Si', 'Silikon', 28], ['P', 'Fosfor', 31], ['S', 'Belerang', 32], ['Cl', 'Klorin', 35], ['Ar', 'Argon', 40], ['K', 'Kalium', 39], ['Ca', 'Kalsium', 40]];
function atom(u) {
  const z = +el('aZ').value, q = +el('aQ').value, [sym, nm, A] = ELEM[z - 1], e = z - q, n = A - z;
  const cap = [2, 8, 8, 2]; let left = e; const sh = cap.map(c => { const k = Math.max(0, Math.min(c, left)); left -= k; return k; }).filter((k, i) => k || i === 0);
  el('aS').innerHTML = `<circle cx="160" cy="105" r="20" fill="#f97316"/><text x="160" y="102" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">${z}p</text><text x="160" y="114" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">${n}n</text>`
    + sh.map((k, i) => { const r = 36 + i * 22; return `<circle cx="160" cy="105" r="${r}" fill="none" stroke="#c4b5fd" stroke-width="1.5"/>` + Array.from({length: k}, (_, j) => { const a = j / k * 2 * Math.PI - Math.PI / 2; return `<circle cx="${(160 + r * Math.cos(a)).toFixed(1)}" cy="${(105 + r * Math.sin(a)).toFixed(1)}" r="4.5" fill="#2f7de1"/>`; }).join(''); }).join('');
  const val = sh[sh.length - 1];
  el('aO').innerHTML = `<b>${nm} (${sym}${q ? `<sup>${Math.abs(q) > 1 ? Math.abs(q) : ''}${q > 0 ? '+' : '−'}</sup>` : ''})</b> · notasi <sup>${A}</sup><sub>${z}</sub>${sym}<br>Proton = ${z} · Neutron = ${A} − ${z} = ${n} · Elektron = ${e}<br>Konfigurasi kulit (K L M N) = <b>${sh.join(' ')}</b> · elektron valensi = ${val}${q ? (q > 0 ? ` · ion positif (kation): melepas ${q} elektron` : ` · ion negatif (anion): menerima ${-q} elektron`) : ''}`;
  if (u) labDone('atom', 'Perakit Atom');
}
const PHW = ['#b91c1c', '#dc2626', '#ef4444', '#f97316', '#fb923c', '#fbbf24', '#facc15', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#4f46e5', '#6d28d9', '#7e22ce'];
const PHC = {0: 'asam baterai', 1: 'asam lambung', 2: 'jeruk nipis', 3: 'cuka / soda', 4: 'tomat', 5: 'kopi hitam', 6: 'susu', 7: 'air murni', 8: 'air laut', 9: 'soda kue', 10: 'obat maag', 11: 'air amonia', 12: 'air sabun', 13: 'pemutih', 14: 'NaOH (soda api)'};
function ph(u) {
  const p = +el('pH').value;
  el('pS').innerHTML = `<div style="display:flex;height:16px;border-radius:8px;overflow:hidden;margin:6px 0">${PHW.map((c, i) => `<i style="flex:1;background:${c};outline:${i === p ? '3px solid #16323f' : 'none'};outline-offset:-3px"></i>`).join('')}</div>
   <svg viewBox="0 0 320 140" width="320"><path d="M120 20 V110 Q120 130 140 130 H180 Q200 130 200 110 V20" fill="none" stroke="#94a3b8" stroke-width="3"/><path d="M122 50 V110 Q122 128 140 128 H180 Q198 128 198 110 V50Z" fill="${PHW[p]}" opacity=".85"/><text x="160" y="95" text-anchor="middle" fill="#fff" font-size="22" font-weight="700">pH ${p}</text></svg>`;
  const sifat = p < 7 ? 'ASAM' : p > 7 ? 'BASA' : 'NETRAL';
  const kol = p < 3 ? 'merah' : p < 7 ? 'merah muda keunguan' : p === 7 ? 'ungu' : p <= 10 ? 'biru kehijauan' : 'hijau kekuningan';
  el('pO').innerHTML = `<b>${sifat}</b> · contoh: ${PHC[p]}<br>Lakmus merah → ${p > 7 ? '<b>biru</b>' : 'tetap merah'} · Lakmus biru → ${p < 7 ? '<b>merah</b>' : 'tetap biru'}<br>Fenolftalein → ${p >= 8.3 ? '<b>merah muda</b>' : 'tidak berwarna'} · Metil jingga → ${p < 3.1 ? 'merah' : p <= 4.4 ? 'jingga' : 'kuning'} · Kunyit → ${p > 8 ? '<b>merah kecokelatan</b>' : 'kuning'} · Kol ungu → ${kol}${p !== 7 ? `<br>Dibanding air murni, ${p < 7 ? 'konsentrasi H⁺' : 'konsentrasi OH⁻'} ${(10 ** Math.abs(7 - p)).toLocaleString('id-ID')}× lebih besar.` : ''}`;
  if (u) labDone('ph', 'Laboratorium pH');
}

/* ===== BIOLOGI ===== */
function rantai(u) {
  const E = nv('rE'), nm = ['Produsen (rumput)', 'Konsumen I (belalang)', 'Konsumen II (katak)', 'Konsumen III (ular)', 'Konsumen puncak (elang)'];
  el('rO').innerHTML = nm.map((n, i) => `<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><span style="width:${Math.max(4, 100 / 10 ** i * 2.6)}%;min-width:6px;height:16px;background:#16a34a;border-radius:4px;opacity:${1 - i * .15}"></span>${n}: <b>${fx(E / 10 ** i, 3)} kJ</b></div>`).join('') + '<small>Hanya ±10% energi diteruskan; sisanya dipakai untuk hidup & lepas sebagai panas.</small>';
  if (u) labDone('rantai', 'Ekosistem Mini');
}
let fsAnim = 0;
function fsInit() {
  const svg = el('fsS'), id = ++fsAnim, bub = [];
  const loop = () => { if (id !== fsAnim || !alive(svg)) return;
    const L = nv('fsL'), c = nv('fsC'), T = nv('fsT'), fT = Math.max(0, 1 - Math.abs(T - 30) / 20), rate = Math.min(L, c) * fT;
    if (Math.random() < rate / 100 * .22) bub.push({x: 150 + Math.random() * 40, y: 140, r: 2 + Math.random() * 3});
    bub.forEach(b => b.y -= 1.3); while (bub.length && bub[0].y < 40) bub.shift();
    svg.innerHTML = `<circle cx="40" cy="50" r="20" fill="#fde047" opacity="${.2 + L / 125}"/>${Array.from({length: 8}, (_, i) => { const a = i * Math.PI / 4; return `<line x1="${40 + 24 * Math.cos(a)}" y1="${50 + 24 * Math.sin(a)}" x2="${40 + 32 * Math.cos(a)}" y2="${50 + 32 * Math.sin(a)}" stroke="#facc15" stroke-width="3" opacity="${L / 100}"/>`; }).join('')}
      <rect x="110" y="30" width="130" height="135" rx="10" fill="#e0f2fe" stroke="#94a3b8" stroke-width="3"/><rect x="112" y="40" width="126" height="123" fill="#bae6fd"/>
      <path d="M170 160 Q160 120 172 90 Q182 70 168 50 M170 160 Q186 128 176 104 M170 130 Q150 116 154 96" fill="none" stroke="#15803d" stroke-width="4"/>
      ${[70, 90, 110, 130].map(y => `<ellipse cx="${163}" cy="${y}" rx="9" ry="3.5" fill="#22c55e"/><ellipse cx="${181}" cy="${y + 6}" rx="9" ry="3.5" fill="#22c55e"/>`).join('')}
      ${bub.map(b => `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#fff" stroke="#38bdf8"/>`).join('')}
      <text x="250" y="60" font-size="12" fill="#16323f">O₂ ↑</text><text x="250" y="150" font-size="12" fill="#16323f">CO₂ ${c}%</text><text x="250" y="170" font-size="12" fill="#16323f">${T}°C</text>`;
    const lim = rate === 0 ? '—' : fT < .6 ? 'suhu' : L <= c ? 'intensitas cahaya' : 'kadar CO₂';
    el('fsO').innerHTML = `Laju fotosintesis ≈ <b>${Math.round(rate * .6)} gelembung O₂/menit</b> · faktor pembatas: <b>${lim}</b>${T > 45 ? ' (enzim rusak karena terlalu panas)' : ''}`;
    requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}
function mendel(u) {
  const p1 = el('mP1').value.trim(), p2 = el('mP2').value.trim();
  const ok = s => (s.length === 2 || s.length === 4) && [...Array(s.length / 2)].every((_, i) => s[2 * i].toLowerCase() === s[2 * i + 1].toLowerCase());
  if (!ok(p1) || !ok(p2) || p1.length !== p2.length || p1.slice(0, 1).toLowerCase() !== p2.slice(0, 1).toLowerCase()) { el('mO').innerHTML = 'Tulis genotipe dengan pasangan huruf yang sama, misalnya <b>Tt</b> atau <b>BbKk</b> untuk kedua induk.'; el('mT').innerHTML = ''; return; }
  const gam = s => s.length === 2 ? [s[0], s[1]] : [s[0] + s[2], s[0] + s[3], s[1] + s[2], s[1] + s[3]];
  const g1 = gam(p1), g2 = gam(p2), norm = (a, b) => [...Array(a.length)].map((_, i) => [a[i], b[i]].sort().join('')).join('');
  const geno = {}, feno = {};
  const cells = g1.map(a => g2.map(b => { const g = norm(a, b); geno[g] = (geno[g] || 0) + 1; const f = [...Array(a.length)].map((_, i) => g[2 * i] === g[2 * i].toUpperCase() ? g[2 * i].toUpperCase() + '_' : g[2 * i] + g[2 * i]).join(''); feno[f] = (feno[f] || 0) + 1; return `<td style="text-align:center;font-weight:700;background:${/[a-z][a-z]/.test(f) ? '#fff7ed' : '#ecfdf5'}">${g}</td>`; }).join(''));
  const tot = g1.length * g2.length;
  el('mT').innerHTML = `<div class="tbl"><table style="width:auto;margin:auto"><tr><th>♀ \\ ♂</th>${g2.map(b => `<th>${b}</th>`).join('')}</tr>${g1.map((a, i) => `<tr><th>${a}</th>${cells[i]}</tr>`).join('')}</table></div>`;
  el('mO').innerHTML = `Gamet induk 1: ${[...new Set(g1)].join(', ')} · induk 2: ${[...new Set(g2)].join(', ')}<br>Genotipe: ${Object.entries(geno).sort().map(([g, n]) => `${g} = ${n}/${tot}`).join(' · ')}<br>Fenotipe: ${Object.entries(feno).sort((a, b) => b[1] - a[1]).map(([f, n]) => `<b>${f}</b> ${n}`).join(' : ')} <small>(huruf besar_ = sifat dominan tampak)</small>`;
  if (u) labDone('mendel', 'Papan Persilangan Mendel');
}

/* ===== MATEMATIKA ===== */
function akar(u) {
  const n = Math.round(nv('kN')); if (!(n > 0)) return; let a = 1;
  for (let i = Math.floor(Math.sqrt(n)); i > 1; i--) if (n % (i * i) === 0) { a = i; break; }
  const b = n / (a * a);
  el('kO').innerHTML = a === 1 ? `√${n} sudah paling sederhana${Number.isInteger(Math.sqrt(n)) ? ` (= ${Math.sqrt(n)})` : ''}` : `√${n} = √(${a * a} × ${b}) = √${a * a} × √${b} = <b>${b === 1 ? a : a + '√' + b}</b> ≈ ${fx(Math.sqrt(n), 3)}`;
  if (u) labDone('pangkat', 'Bengkel Pangkat & Akar');
}
function pkt(u) {
  const a = nv('pA'), m = nv('pM'), n = nv('pN'), op = el('pOp').value;
  const r = op === 'x' ? [m + n, `a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup> → ${a}<sup>${m}</sup> × ${a}<sup>${n}</sup> = ${a}<sup>${m + n}</sup>`] : op === ':' ? [m - n, `a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup> → ${a}<sup>${m}</sup> : ${a}<sup>${n}</sup> = ${a}<sup>${m - n}</sup>`] : [m * n, `(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup> → (${a}<sup>${m}</sup>)<sup>${n}</sup> = ${a}<sup>${m * n}</sup>`];
  el('pO').innerHTML = `${r[1]} = <b>${fx(a ** r[0], 6)}</b>`;
  if (u) labDone('pangkat', 'Bengkel Pangkat & Akar');
}
function ilmiah(u) {
  const x = nv('nI'); if (!x) { el('nO').textContent = '0 tidak punya notasi ilmiah.'; return; }
  const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e;
  el('nO').innerHTML = `${x.toLocaleString('id-ID', {maximumFractionDigits: 12})} = <b>${fx(m, 4)} × 10<sup>${e}</sup></b> <small>(koma digeser ${Math.abs(e)} langkah ke ${e >= 0 ? 'kiri' : 'kanan'})</small>`;
}
const grid = (cx, cy, s, n) => { let g = ''; for (let i = -n; i <= n; i++) g += `<line x1="${cx + i * s}" y1="${cy - n * s}" x2="${cx + i * s}" y2="${cy + n * s}" stroke="${i ? '#eef2f4' : '#94a3b8'}"/><line x1="${cx - n * s}" y1="${cy + i * s}" x2="${cx + n * s}" y2="${cy + i * s}" stroke="${i ? '#eef2f4' : '#94a3b8'}"/>`; return g; };
function spldv(u) {
  const [a1, b1, c1, a2, b2, c2] = ['s1', 's2', 's3', 's4', 's5', 's6'].map(nv), D = a1 * b2 - a2 * b1;
  const S = 14, cx = 160, cy = 150, n = 10, X = x => cx + x * S, Y = y => cy - y * S;
  const line = (a, b, c, col) => { let p; if (Math.abs(b) > 1e-9) p = [[-n, (c + a * n) / b], [n, (c - a * n) / b]]; else p = [[c / a, -n], [c / a, n]]; return `<line x1="${X(p[0][0])}" y1="${Y(p[0][1])}" x2="${X(p[1][0])}" y2="${Y(p[1][1])}" stroke="${col}" stroke-width="3"/>`; };
  let txt, pt = '';
  if (Math.abs(D) < 1e-9) txt = 'Kedua garis sejajar atau berimpit → tidak ada satu penyelesaian tunggal.';
  else { const y = (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1), x = (c1 - b1 * y) / a1 || (c2 - b2 * y) / a2;
    txt = `<b>Eliminasi x:</b> kalikan pers. (1) dengan ${a2} dan pers. (2) dengan ${a1}:<br>${a1 * a2}x + ${b1 * a2}y = ${c1 * a2}<br>${a1 * a2}x + ${b2 * a1}y = ${c2 * a1} &nbsp;(−)<br>${fx(b1 * a2 - b2 * a1)}y = ${fx(c1 * a2 - c2 * a1)} → <b>y = ${fx(y, 3)}</b><br><b>Substitusi</b> ke (1): ${a1}x + ${b1}(${fx(y, 3)}) = ${c1} → <b>x = ${fx(x, 3)}</b><br>Titik potong kedua garis: <b>(${fx(x, 3)}, ${fx(y, 3)})</b>`;
    pt = `<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="#ef4444" stroke="#fff" stroke-width="2"/>`; }
  el('sS').innerHTML = `<clipPath id="cp"><rect x="${cx - n * S}" y="${cy - n * S}" width="${2 * n * S}" height="${2 * n * S}"/></clipPath>${grid(cx, cy, S, n)}<g clip-path="url(#cp)">${line(a1, b1, c1, '#2f7de1')}${line(a2, b2, c2, '#e58a00')}</g>${pt}`;
  el('sO').innerHTML = txt;
  if (u) labDone('spldv', 'Pemecah SPLDV');
}
function grafik(u) {
  const mode = el('gM').value; el('gLin').style.display = mode === 'l' ? '' : 'none'; el('gKua').style.display = mode === 'k' ? '' : 'none';
  const S = 14, cx = 160, cy = 150, n = 10, X = x => cx + x * S, Y = y => cy - y * S;
  let f, info;
  if (mode === 'l') { const m = nv('gm'), c = nv('gc'); f = x => m * x + c; el('gmv').textContent = m; el('gcv').textContent = c;
    info = `y = ${m}x ${c < 0 ? '− ' + (-c) : '+ ' + c} · gradien m = <b>${m}</b> (${m > 0 ? 'naik ke kanan' : m < 0 ? 'turun ke kanan' : 'mendatar'}) · memotong sumbu-y di (0, ${c})${m ? ` · memotong sumbu-x di (${fx(-c / m)}, 0)` : ''}`; }
  else { const a = nv('ga') || .5, b = nv('gb'), c = nv('gc2'); f = x => a * x * x + b * x + c; ['ga', 'gb', 'gc2'].forEach(k => el(k + 'v').textContent = nv(k));
    const xp = -b / (2 * a), D = b * b - 4 * a * c;
    info = `y = ${a}x² ${b < 0 ? '− ' + (-b) : '+ ' + b}x ${c < 0 ? '− ' + (-c) : '+ ' + c} · terbuka ke <b>${a > 0 ? 'atas (titik minimum)' : 'bawah (titik maksimum)'}</b> · sumbu simetri x = −b/2a = <b>${fx(xp)}</b> · puncak (${fx(xp)}, ${fx(f(xp))}) · D = ${fx(D)} → ${D > 0 ? `memotong sumbu-x di x = ${fx((-b - Math.sqrt(D)) / (2 * a))} dan ${fx((-b + Math.sqrt(D)) / (2 * a))}` : D === 0 ? 'menyinggung sumbu-x' : 'tidak memotong sumbu-x'}`; }
  let d = ''; for (let x = -n; x <= n; x += .1) { const y = f(x); d += (d ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(Math.max(-30, Math.min(30, y))).toFixed(1); }
  el('gS').innerHTML = `<clipPath id="cg"><rect x="${cx - n * S}" y="${cy - n * S}" width="${2 * n * S}" height="${2 * n * S}"/></clipPath>${grid(cx, cy, S, n)}<path d="${d}" fill="none" stroke="#e58a00" stroke-width="3" clip-path="url(#cg)"/>`;
  el('gO').innerHTML = info;
  if (u) labDone('grafik', 'Studio Grafik');
}
function pyt(u) {
  const a = nv('ya'), b = nv('yb'), c = Math.hypot(a, b);
  const xs = [-b, a + b], ys = [-a, a + b], w = xs[1] - xs[0], h = ys[1] - ys[0], k = Math.min(300 / w, 240 / h);
  const P = (x, y) => `${(10 + (x - xs[0]) * k).toFixed(1)},${(250 - (y - ys[0]) * k).toFixed(1)}`;
  el('yS').innerHTML = `<polygon points="${P(0, 0)} ${P(a, 0)} ${P(a, -a)} ${P(0, -a)}" fill="#bfdbfe" stroke="#2f7de1"/><polygon points="${P(0, 0)} ${P(0, b)} ${P(-b, b)} ${P(-b, 0)}" fill="#fde68a" stroke="#e58a00"/>
   <polygon points="${P(a, 0)} ${P(0, b)} ${P(b, a + b)} ${P(a + b, a)}" fill="#bbf7d0" stroke="#16a34a"/><polygon points="${P(0, 0)} ${P(a, 0)} ${P(0, b)}" fill="#fff" stroke="#16323f" stroke-width="2"/>
   <text x="${P(a / 2, -a / 2).split(',')[0]}" y="${P(a / 2, -a / 2).split(',')[1]}" text-anchor="middle" font-size="12" font-weight="700">a² = ${fx(a * a)}</text>
   <text x="${P(-b / 2, b / 2).split(',')[0]}" y="${P(-b / 2, b / 2).split(',')[1]}" text-anchor="middle" font-size="12" font-weight="700">b² = ${fx(b * b)}</text>
   <text x="${P((a + b) / 2, (a + b) / 2).split(',')[0]}" y="${P((a + b) / 2, (a + b) / 2).split(',')[1]}" text-anchor="middle" font-size="12" font-weight="700">c² = ${fx(c * c)}</text>`;
  el('yO').innerHTML = `c² = a² + b² = ${fx(a * a)} + ${fx(b * b)} = ${fx(c * c)} → <b>c = ${fx(c, 3)}</b>${Number.isInteger(+c.toFixed(6)) ? ' 🎉 tripel Pythagoras!' : ''}<br><small>Luas persegi hijau sama dengan jumlah luas persegi biru dan kuning.</small>`;
  if (u) labDone('pythagoras', 'Pythagoras & Bangun Ruang');
}
function ruang(u) {
  const t = el('vB').value, r = nv('vR'), h = nv('vT'), pi = Math.PI;
  const R = {kubus: [`V = s³ = ${r}³`, r ** 3, `LP = 6s² = ${fx(6 * r * r)}`], tabung: [`V = πr²t = π × ${r}² × ${h}`, pi * r * r * h, `LP = 2πr(r + t) = ${fx(2 * pi * r * (r + h))}`],
    kerucut: [`V = ⅓πr²t = ⅓ × π × ${r}² × ${h}`, pi * r * r * h / 3, `s = √(r² + t²) = ${fx(Math.hypot(r, h))} · LP = πr(r + s) = ${fx(pi * r * (r + Math.hypot(r, h)))}`],
    bola: [`V = ⁴⁄₃πr³ = ⁴⁄₃ × π × ${r}³`, 4 / 3 * pi * r ** 3, `LP = 4πr² = ${fx(4 * pi * r * r)}`]}[t];
  el('vTw').style.display = t === 'kubus' || t === 'bola' ? 'none' : '';
  el('vO').innerHTML = `${R[0]} = <b>${fx(R[1])}</b> satuan³ · ${R[2]} satuan²`;
  if (u) labDone('pythagoras', 'Pythagoras & Bangun Ruang');
}
function stat(u) {
  const d = el('dD').value.split(/[,;\s]+/).map(Number).filter(x => !isNaN(x) && el('dD').value.trim() !== '').sort((a, b) => a - b); if (!d.length) return;
  const n = d.length, sum = d.reduce((a, b) => a + b, 0), med = a => a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2;
  const f = {}; d.forEach(x => f[x] = (f[x] || 0) + 1); const mx = Math.max(...Object.values(f)), mo = Object.keys(f).filter(x => f[x] === mx);
  const lo = d.slice(0, Math.floor(n / 2)), hi = d.slice(Math.ceil(n / 2));
  const keys = Object.keys(f).map(Number).sort((a, b) => a - b), bw = Math.min(40, 280 / keys.length);
  el('dS').innerHTML = keys.map((x, i) => `<rect x="${20 + i * (bw + 4)}" y="${150 - f[x] / mx * 120}" width="${bw}" height="${f[x] / mx * 120}" rx="4" fill="${mo.includes(String(x)) ? '#e58a00' : '#fcd9a8'}"/><text x="${20 + i * (bw + 4) + bw / 2}" y="168" text-anchor="middle" font-size="11">${x}</text><text x="${20 + i * (bw + 4) + bw / 2}" y="${145 - f[x] / mx * 120}" text-anchor="middle" font-size="11" font-weight="700">${f[x]}</text>`).join('');
  el('dO').innerHTML = `Data terurut: ${d.join(', ')} (n = ${n})<br>Mean = ${fx(sum)} / ${n} = <b>${fx(sum / n)}</b> · Median = <b>${fx(med(d))}</b> · Modus = <b>${mx > 1 ? mo.join(', ') : 'tidak ada'}</b><br>Jangkauan = ${d[n - 1]} − ${d[0]} = ${fx(d[n - 1] - d[0])} · Q1 = ${n > 1 ? fx(med(lo)) : '—'} · Q3 = ${n > 1 ? fx(med(hi)) : '—'}`;
  if (u) labDone('statistik', 'Statistik & Dadu');
}
function dadu() {
  const N = +el('dN').value, f = [0, 0, 0, 0, 0, 0]; for (let i = 0; i < N; i++) f[Math.floor(Math.random() * 6)]++;
  const mx = Math.max(...f, N / 6);
  el('dS2').innerHTML = f.map((v, i) => `<rect x="${30 + i * 46}" y="${140 - v / mx * 110}" width="34" height="${v / mx * 110}" rx="4" fill="#e58a00"/><text x="${47 + i * 46}" y="160" text-anchor="middle" font-size="16">${['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][i]}</text><text x="${47 + i * 46}" y="${135 - v / mx * 110}" text-anchor="middle" font-size="11" font-weight="700">${v}</text>`).join('')
    + `<line x1="20" y1="${140 - N / 6 / mx * 110}" x2="310" y2="${140 - N / 6 / mx * 110}" stroke="#16323f" stroke-dasharray="5 4"/><text x="310" y="${134 - N / 6 / mx * 110}" text-anchor="end" font-size="11">harapan ${fx(N / 6, 1)}</text>`;
  el('dO2').innerHTML = `Frekuensi relatif muncul ⚅ = ${f[5]}/${N} = <b>${fx(f[5] / N, 3)}</b> · peluang teoretis = 1/6 ≈ 0,167. Makin banyak lemparan, makin dekat (hukum bilangan besar).`;
  labDone('statistik', 'Statistik & Dadu');
}
function trans(u) {
  const pts = el('xP').value.trim().split(/\s+/).map(p => p.split(',').map(Number)).filter(p => p.length === 2 && p.every(Number.isFinite));
  const t = el('xT').value, a = nv('xa'), b = nv('xb'), k = nv('xk');
  el('xAB').style.display = t === 'tr' ? '' : 'none'; el('xK').style.display = t === 'di' ? '' : 'none';
  const F = {tr: ([x, y]) => [x + a, y + b], sx: ([x, y]) => [x, -y], sy: ([x, y]) => [-x, y], yx: ([x, y]) => [y, x], ymx: ([x, y]) => [-y, -x], r90: ([x, y]) => [-y, x], r180: ([x, y]) => [-x, -y], r270: ([x, y]) => [y, -x], di: ([x, y]) => [k * x, k * y]}[t];
  const img = pts.map(F), S = 16, c = 160, n = 9, P = ([x, y]) => `${c + x * S},${c - y * S}`, L = 'ABCDEF';
  el('xS').innerHTML = grid(c, c, S, n) + (t === 'yx' ? `<line x1="${c - n * S}" y1="${c + n * S}" x2="${c + n * S}" y2="${c - n * S}" stroke="#a78bfa" stroke-dasharray="5"/>` : t === 'ymx' ? `<line x1="${c - n * S}" y1="${c - n * S}" x2="${c + n * S}" y2="${c + n * S}" stroke="#a78bfa" stroke-dasharray="5"/>` : '')
    + `<polygon points="${pts.map(P).join(' ')}" fill="rgba(47,125,225,.25)" stroke="#2f7de1" stroke-width="2"/><polygon points="${img.map(P).join(' ')}" fill="rgba(229,138,0,.25)" stroke="#e58a00" stroke-width="2"/>`
    + pts.map((p, i) => `<text x="${c + p[0] * S + 4}" y="${c - p[1] * S - 4}" font-size="11" fill="#2f7de1" font-weight="700">${L[i]}</text>`).join('') + img.map((p, i) => `<text x="${c + p[0] * S + 4}" y="${c - p[1] * S - 4}" font-size="11" fill="#b45309" font-weight="700">${L[i]}'</text>`).join('');
  el('xO').innerHTML = pts.map((p, i) => `${L[i]}(${p.join(', ')}) → ${L[i]}'(${img[i].map(v => fx(v)).join(', ')})`).join(' · ');
  if (u) labDone('transformasi', 'Kanvas Transformasi');
}
let PB = null;
function pbStart() {
  const s = String(Math.trunc(Math.abs(nv('bA')))), d = Math.trunc(Math.abs(nv('bB')));
  if (!d) { el('bO').textContent = 'Pembagi tidak boleh 0'; return; }
  let sis = 0, q = '', steps = [], mulai = false;
  for (let i = 0; i < s.length; i++) { const cur = sis * 10 + +s[i], k = Math.floor(cur / d); sis = cur - k * d; if (k > 0) mulai = true; if (mulai || i === s.length - 1) { q += k; steps.push({i, cur, k, sub: k * d, sis}); } }
  PB = {s, d, steps, shown: 0, q}; el('bO').textContent = 'Tekan “Langkah berikutnya ▶”'; pbDraw();
}
function pbStep(k) { if (!PB) pbStart(); PB.shown = Math.min(PB.steps.length, PB.shown + k); pbDraw(); if (PB.shown === PB.steps.length) labDone('pistol', 'Simulator Pembagian Cara Pistol'); }
function pbDraw() {
  const {s, d, steps, shown} = PB, ds = String(d), pad = ds.length + 3, W = s.length * 2; const lines = [];
  const qs = Array(s.length).fill(' '); steps.slice(0, shown).forEach(t => qs[t.i] = String(t.k));
  lines.push(' '.repeat(pad) + qs.join(' ')); lines.push(' '.repeat(ds.length + 1) + '┌' + '─'.repeat(W + 1)); lines.push(' ' + ds + ' │ ' + s.split('').join(' '));
  steps.slice(0, shown).forEach((t, j) => { const cs = String(t.cur), ss = String(t.sub), end = pad + t.i * 2;
    if (j > 0) lines.push(' '.repeat(end - (cs.length - 1) * 2) + cs.split('').join(' ') + '   ← turunkan ' + s[t.i]);
    lines.push(' '.repeat(end - (ss.length - 1) * 2) + ss.split('').join(' ') + '   ← ' + d + ' × ' + t.k);
    lines.push(' '.repeat(end - (cs.length - 1) * 2) + '─'.repeat(cs.length * 2 - 1));
    if (j === steps.length - 1) lines.push(' '.repeat(end - (String(t.sis).length - 1) * 2) + String(t.sis).split('').join(' ') + '   ← sisa'); });
  el('bP').textContent = lines.join('\n');
  if (shown) { const t = steps[shown - 1]; el('bO').innerHTML = `Langkah ${shown}: <b>Bagi</b> ${t.cur} : ${d} = ${t.k} → <b>Kali</b> ${d} × ${t.k} = ${t.sub} → <b>Kurang</b> ${t.cur} − ${t.sub} = ${t.sis}` + (shown < steps.length ? ' → <b>Turunkan</b> angka berikutnya' : `<br>✅ Hasil = <b>${+PB.q}</b>${t.sis ? ' sisa ' + t.sis : ''} · Cek: ${+PB.q} × ${d}${t.sis ? ' + ' + t.sis : ''} = ${+PB.q * d + t.sis}`); }
}

/* ===== daftar lab ===== */
const rng_ = (id, lbl, min, max, val, step, fn) => `<label style="display:block">${lbl}: <b id="${id}v">${val}</b><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" oninput="el('${id}v').textContent=this.value;${fn}"></label>`;
const LABS = {
  satuan: {t: 'Konversi Satuan', h: () => `<p>Masukkan nilai, lalu lihat hasilnya di semua satuan. Turun satu anak tangga satuan berarti dikali 10.</p><div class="row"><label>Besaran<select id="cvT" onchange="cvU();cv(1)">${Object.entries(UNIT).map(([k, v]) => `<option value="${k}">${v.n}</option>`).join('')}</select></label><label>Nilai<input id="cvN" type="number" value="72" oninput="cv(1)"></label><label>Satuan<select id="cvF" onchange="cv(1)"></select></label></div><div class="out" id="cvO" data-init="cvU"></div>`},
  massajenis: {t: 'Terapung atau Tenggelam?', h: () => `<p>Atur massa & volume benda, pilih zat cairnya. Bandingkan massa jenis benda dengan zat cair.</p><div class="row"><label>Massa (g)<input id="mjM" type="number" value="60" oninput="mj(1)"></label><label>Volume (cm³)<input id="mjV" type="number" value="100" oninput="mj(1)"></label><label>Zat cair<select id="mjF" onchange="mj(1)">${FLUIDA.map(([n, r]) => `<option value="${r}">${n} (${String(r).replace('.', ',')} g/cm³)</option>`).join('')}</select></label></div>
    <div class="row"><button class="btn sm ghost" onclick="mjSet(60,100)">🪵 Kayu</button><button class="btn sm ghost" onclick="mjSet(92,100)">🧊 Es</button><button class="btn sm ghost" onclick="mjSet(79,10)">🔩 Besi</button><button class="btn sm ghost" onclick="mjSet(193,10)">🥇 Emas</button></div><svg id="mjS" viewBox="0 0 320 160" width="320" data-init="mj"></svg><div class="out" id="mjO"></div>`},
  suhu: {t: 'Termometer Ajaib', h: () => `<p>Geser suhu Celcius dan lihat keempat termometer ikut berubah.</p>${rng_('shC', 'Suhu (°C)', -40, 120, 37, 1, 'suhu(1)')}<svg id="shS" viewBox="0 0 320 205" width="320" data-init="suhu"></svg><div class="out" id="shO"></div>`},
  glbb: {t: 'Balapan GLBB', h: () => `<p>Isi kecepatan awal, percepatan (negatif = direm), dan waktu. Tekan jalankan!</p><div class="row"><label>v₀ (m/s)<input id="gV" type="number" value="0"></label><label>a (m/s²)<input id="gA" type="number" value="2"></label><label>t (s)<input id="gT" type="number" value="5"></label><button class="btn" onclick="glbb()">Jalankan ▶</button></div>
    <svg viewBox="0 0 320 80" width="320"><rect x="0" y="50" width="320" height="22" fill="#cbd5e1"/><line x1="0" y1="61" x2="320" y2="61" stroke="#fff" stroke-dasharray="12 10" stroke-width="2"/><text id="gCar" x="20" y="52" font-size="30">🏎️</text><text id="gClk" x="310" y="20" text-anchor="end" font-size="12" fill="#16323f">t = 0 s</text></svg><div class="out" id="gO"></div><div id="gTb" class="tbl"></div>`},
  tuas: {t: 'Tuas Archimedes', h: () => `<p>Ubah berat beban dan panjang lengan. Seberapa besar gaya yang kamu butuhkan?</p><div class="row"><label>Beban w (N)<input id="tW" type="number" value="600" oninput="tuas(1)"></label><label>Lengan beban Lb (cm)<input id="tB" type="number" value="20" oninput="tuas(1)"></label><label>Lengan kuasa Lk (cm)<input id="tK" type="number" value="120" oninput="tuas(1)"></label></div><svg id="tS" viewBox="0 0 320 160" width="320" data-init="tuas"></svg><div class="out" id="tO"></div>`},
  gelombang: {t: 'Kolam Gelombang', h: () => `<p>Geser amplitudo, panjang gelombang, dan frekuensi. Perhatikan cepat rambatnya.</p>${rng_('wA', 'Amplitudo', 1, 4, 2, .5, '')}${rng_('wL', 'Panjang gelombang λ (m)', 1, 5, 2, .5, '')}${rng_('wF', 'Frekuensi f (Hz)', .5, 3, 1, .5, "labDone('gelombang','Kolam Gelombang')")}<svg id="wS" viewBox="0 0 320 180" width="320" data-init="gelInit"></svg><div class="out" id="wO"></div>`},
  lensa: {t: 'Meja Optik', h: () => `<p>Pilih cermin atau lensa, atur jarak fokus dan jarak benda, lalu lihat letak & sifat bayangannya.</p><div class="row"><label>Alat optik<select id="lJ" onchange="lensa(1)"><option value="cekungC">Cermin cekung</option><option value="cembungC">Cermin cembung</option><option value="cembungL">Lensa cembung</option><option value="cekungL">Lensa cekung</option></select></label><label>Jarak fokus |f| (cm)<input id="lF" type="number" value="10" oninput="lensa(1)"></label><label>Jarak benda s (cm)<input id="lS" type="number" value="30" oninput="lensa(1)"></label></div><svg id="lS2" viewBox="0 0 340 200" width="340" data-init="lensa"></svg><div class="out" id="lO"></div>`},
  listrik: {t: 'Rangkaian Lampu', h: () => `<p>Bandingkan dua lampu (hambatan) yang dirangkai seri dan paralel. Lampu makin terang jika dayanya makin besar.</p><div class="row"><label>Rangkaian<select id="eM" onchange="listrik(1)"><option value="s">Seri</option><option value="p">Paralel</option></select></label><label>Baterai V (volt)<input id="eV" type="number" value="12" oninput="listrik(1)"></label><label>R₁ (Ω)<input id="eR1" type="number" value="2" oninput="listrik(1)"></label><label>R₂ (Ω)<input id="eR2" type="number" value="4" oninput="listrik(1)"></label></div><svg id="eS" viewBox="0 0 320 180" width="320" data-init="listrik"></svg><div class="out" id="eO"></div>`},
  tatasurya: {t: 'Jelajah Tata Surya', h: () => `<p>Ketuk planet untuk melihat faktanya. (Jarak pada gambar tidak sesuai skala.)</p><div class="planets">${PLANET.map((p, i) => `<button onclick="tsPick(${i},1)">${p[0]}</button>`).join('')}</div><svg id="tsS" viewBox="0 0 320 180" width="320" data-init="tsInit"></svg><div class="out" id="tsO"></div>`},
  materi: {t: 'Pilah Materi', h: () => `<p>Termasuk unsur, senyawa, atau campuran?</p>` + sortGame('gMat', ['Unsur', 'Senyawa', 'Campuran'], [['🥇 Emas (Au)', 0, 'Hanya satu jenis atom.'], ['💧 Air (H₂O)', 1, 'Gabungan H dan O dengan perbandingan tetap.'], ['🌬️ Udara', 2, 'Campuran N₂, O₂, CO₂, dll.'], ['🫧 Oksigen (O₂)', 0, 'Molekul unsur: atomnya sejenis.'], ['🧂 Garam dapur (NaCl)', 1, 'Natrium + klorin bereaksi kimia.'], ['🧃 Sirup', 2, 'Gula, air, perasa — bisa dipisahkan.'], ['🔩 Besi (Fe)', 0, 'Unsur logam.'], ['☁️ Karbon dioksida (CO₂)', 1, 'C dan O terikat kimia.'], ['🌊 Air laut', 2, 'Air + garam + mineral.'], ['🍬 Gula (C₁₂H₂₂O₁₁)', 1, 'Senyawa karbon, hidrogen, oksigen.'], ['🎺 Kuningan', 2, 'Campuran logam (aloi) tembaga dan seng.'], ['🟤 Tembaga (Cu)', 0, 'Unsur logam.']], 'materi', 'Pilah Materi')},
  perubahan: {t: 'Fisika atau Kimia?', h: () => `<p>Tentukan jenis perubahannya. Ingat: perubahan kimia menghasilkan zat baru.</p>` + sortGame('gPer', ['Perubahan Fisika', 'Perubahan Kimia'], [['🧊 Es mencair', 0, 'Hanya wujudnya berubah.'], ['🪵 Kayu terbakar', 1, 'Terbentuk abu, CO₂, dan uap air.'], ['🍬 Gula larut dalam teh', 0, 'Gula masih ada, bisa diperoleh lagi.'], ['🔩 Besi berkarat', 1, 'Terbentuk karat (besi oksida).'], ['🍚 Nasi menjadi basi', 1, 'Mikroba menghasilkan zat baru (bau asam).'], ['✂️ Kertas digunting', 0, 'Zatnya tetap kertas.'], ['🍠 Singkong jadi tape', 1, 'Fermentasi menghasilkan alkohol & gula.'], ['💨 Air menguap', 0, 'Tetap H₂O, hanya wujudnya.'], ['🍳 Telur digoreng', 1, 'Protein berubah dan tidak bisa kembali.'], ['🕯️ Lilin meleleh', 0, 'Lilin cair bisa membeku lagi.'], ['🎆 Kembang api menyala', 1, 'Reaksi pembakaran menghasilkan cahaya & gas.'], ['🥛 Susu menjadi yoghurt', 1, 'Bakteri mengubah laktosa menjadi asam laktat.']], 'perubahan', 'Fisika atau Kimia?')},
  atom: {t: 'Perakit Atom', h: () => `<p>Pilih unsur (nomor atom 1–20) dan muatannya, lalu lihat model atom Bohr-nya.</p><div class="row"><label>Unsur<select id="aZ" onchange="atom(1)">${ELEM.map((e, i) => `<option value="${i + 1}" ${i === 10 ? 'selected' : ''}>${i + 1}. ${e[1]} (${e[0]})</option>`).join('')}</select></label><label>Muatan ion<select id="aQ" onchange="atom(1)">${[-3, -2, -1, 0, 1, 2, 3].map(q => `<option value="${q}" ${q === 0 ? 'selected' : ''}>${q > 0 ? '+' + q : q}</option>`).join('')}</select></label></div><svg id="aS" viewBox="0 0 320 210" width="320" data-init="atom"></svg><div class="out" id="aO"></div>`},
  ph: {t: 'Laboratorium pH', h: () => `<p>Geser skala pH dan amati warna indikator.</p>${rng_('pH', 'pH', 0, 14, 7, 1, 'ph(1)')}<div id="pS" data-init="ph"></div><div class="out" id="pO"></div>`},
  aditif: {t: 'Detektif Label Makanan', h: () => `<p>Kelompokkan bahan berikut.</p>` + sortGame('gAdi', ['Alami', 'Sintetis (diizinkan)', 'Berbahaya (dilarang)'], [['Kunyit', 0, 'Pewarna kuning alami (kurkumin).'], ['Tartrazin', 1, 'Pewarna kuning sintetis yang diizinkan sesuai batas.'], ['Rhodamin B', 2, 'Pewarna tekstil, dilarang untuk makanan.'], ['Aspartam', 1, 'Pemanis buatan ±200× lebih manis dari gula.'], ['Gula aren', 0, 'Pemanis alami.'], ['Boraks', 2, 'Bahan pembersih/solder; merusak ginjal & hati.'], ['Natrium benzoat', 1, 'Pengawet sintetis untuk saus & kecap.'], ['Daun suji', 0, 'Pewarna hijau alami (klorofil).'], ['Formalin', 2, 'Pengawet mayat; sangat beracun.'], ['MSG', 1, 'Penyedap (mononatrium glutamat), aman dalam batas wajar.'], ['Garam', 0, 'Pengawet & penyedap alami.'], ['Methanyl yellow', 2, 'Pewarna tekstil kuning, dilarang.']], 'aditif', 'Detektif Label Makanan')},
  ilmiah: {t: 'Langkah Ilmuwan', h: () => `<p><b>1. Urutkan langkah metode ilmiah</b></p>` + orderGame('oIlm', ['Merumuskan masalah', 'Menyusun hipotesis', 'Melakukan eksperimen', 'Menganalisis data', 'Menarik kesimpulan', 'Mengomunikasikan hasil'], 'ilmiah', 'Langkah Ilmuwan') + `<p style="margin-top:18px"><b>2. Percobaan: “Pengaruh jenis pupuk terhadap tinggi tanaman”. Ini variabel apa?</b></p>` + sortGame('gVar', ['Bebas', 'Terikat', 'Kontrol'], [['Jenis pupuk', 0, 'Sengaja diubah-ubah oleh peneliti.'], ['Tinggi tanaman', 1, 'Yang diukur sebagai hasil.'], ['Jumlah air siraman', 2, 'Dibuat sama agar adil.'], ['Jenis tanah', 2, 'Dibuat sama.'], ['Ukuran pot', 2, 'Dibuat sama.'], ['Jumlah daun yang tumbuh', 1, 'Juga hasil yang diukur.']], 'ilmiah', 'Langkah Ilmuwan')},
  takson: {t: 'Tangga Kehidupan', h: () => `<p><b>1. Urutkan organisasi kehidupan dari yang terkecil</b></p>` + orderGame('oOrg', ['Sel', 'Jaringan', 'Organ', 'Sistem organ', 'Organisme'], 'takson', 'Tangga Kehidupan') + `<p style="margin-top:18px"><b>2. Urutkan takson dari yang paling luas</b></p>` + orderGame('oTak', ['Kingdom', 'Filum/Divisio', 'Kelas', 'Ordo', 'Famili', 'Genus', 'Spesies'], 'takson', 'Tangga Kehidupan')},
  rantai: {t: 'Ekosistem Mini', h: () => `<p><b>1. Susun rantai makanan sawah</b></p>` + orderGame('oRan', ['🌾 Padi', '🐀 Tikus', '🐍 Ular', '🦅 Elang'], 'rantai', 'Ekosistem Mini') + `<p style="margin-top:18px"><b>2. Hukum 10%: berapa energi yang sampai ke puncak?</b></p><div class="row"><label>Energi produsen (kJ)<input id="rE" type="number" value="10000" oninput="rantai(1)"></label></div><div class="out" id="rO" data-init="rantai"></div><p style="margin-top:18px"><b>3. Jenis simbiosis</b></p>` + sortGame('gSim', ['Mutualisme', 'Komensalisme', 'Parasitisme'], [['🐝 Lebah & bunga', 0, 'Lebah dapat nektar, bunga terbantu penyerbukan.'], ['🌸 Anggrek & pohon', 1, 'Anggrek dapat tempat, pohon tidak dirugikan.'], ['🌿 Benalu & pohon mangga', 2, 'Benalu mengambil air & mineral inang.'], ['🫘 Bakteri Rhizobium & akar kacang', 0, 'Bakteri dapat makanan, tanaman dapat nitrogen.'], ['🐟 Ikan remora & hiu', 1, 'Remora dapat sisa makanan, hiu tidak terganggu.'], ['🪱 Cacing pita & manusia', 2, 'Cacing menyerap sari makanan manusia.'], ['🐃 Kerbau & burung jalak', 0, 'Jalak makan kutu kerbau, kerbau bersih.'], ['🐈 Kutu & kucing', 2, 'Kutu mengisap darah kucing.']], 'rantai', 'Ekosistem Mini')},
  tubuh: {t: 'Tebak Sistem Organ', h: () => `<p>Organ atau bagian ini termasuk sistem apa?</p>` + sortGame('gTub', ['Pencernaan', 'Pernapasan', 'Peredaran darah', 'Ekskresi', 'Gerak', 'Saraf & indra'], [['Lambung', 0, 'Mencerna protein dengan pepsin & HCl.'], ['Alveolus', 1, 'Tempat pertukaran O₂ dan CO₂.'], ['Bilik kiri jantung', 2, 'Memompa darah ke seluruh tubuh.'], ['Nefron ginjal', 3, 'Satuan penyaring darah pembentuk urine.'], ['Tulang paha (femur)', 4, 'Tulang terpanjang, alat gerak pasif.'], ['Otak kecil', 5, 'Mengatur keseimbangan.'], ['Usus halus (vili)', 0, 'Menyerap sari makanan.'], ['Trakea', 1, 'Batang tenggorok, bercincin tulang rawan.'], ['Trombosit', 2, 'Keping darah untuk pembekuan.'], ['Kantong kemih', 3, 'Menampung urine sementara.'], ['Otot bisep', 4, 'Alat gerak aktif, antagonis dengan trisep.'], ['Retina', 5, 'Lapisan peka cahaya di mata.']], 'tubuh', 'Tebak Sistem Organ')},
  fotosintesis: {t: 'Percobaan Ingenhousz', h: () => `<p>Atur cahaya, kadar CO₂, dan suhu. Hitung gelembung oksigen yang keluar dari tanaman air <i>Hydrilla</i>.</p>${rng_('fsL', 'Intensitas cahaya (%)', 0, 100, 60, 5, "labDone('fotosintesis','Percobaan Ingenhousz')")}${rng_('fsC', 'Kadar CO₂ (%)', 0, 100, 80, 5, '')}${rng_('fsT', 'Suhu (°C)', 5, 50, 30, 1, '')}<svg id="fsS" viewBox="0 0 320 180" width="320" data-init="fsInit"></svg><div class="out" id="fsO"></div>`},
  mendel: {t: 'Papan Persilangan Mendel', h: () => `<p>Tulis genotipe kedua induk: monohibrid (mis. <b>Tt × Tt</b>) atau dihibrid (mis. <b>BbKk × BbKk</b>).</p><div class="row"><label>Induk 1<input id="mP1" type="text" value="Tt" oninput="mendel(1)"></label><label>Induk 2<input id="mP2" type="text" value="Tt" oninput="mendel(1)"></label><button class="btn sm ghost" onclick="el('mP1').value='TT';el('mP2').value='tt';mendel(1)">TT × tt</button><button class="btn sm ghost" onclick="el('mP1').value='BbKk';el('mP2').value='BbKk';mendel(1)">Dihibrid</button></div><div id="mT" data-init="mendel"></div><div class="out" id="mO"></div>`},
  pangkat: {t: 'Bengkel Pangkat & Akar', h: () => `<p><b>1. Sederhanakan bentuk akar</b></p><div class="row"><label>√n, n =<input id="kN" type="number" value="72" oninput="akar(1)"></label></div><div class="out" id="kO" data-init="akar"></div>
    <p style="margin-top:16px"><b>2. Sifat perpangkatan</b></p><div class="row"><label>a<input id="pA" type="number" value="2" oninput="pkt(1)"></label><label>m<input id="pM" type="number" value="3" oninput="pkt(1)"></label><label>Operasi<select id="pOp" onchange="pkt(1)"><option value="x">aᵐ × aⁿ</option><option value=":">aᵐ : aⁿ</option><option value="p">(aᵐ)ⁿ</option></select></label><label>n<input id="pN" type="number" value="4" oninput="pkt(1)"></label></div><div class="out" id="pO" data-init="pkt"></div>
    <p style="margin-top:16px"><b>3. Notasi ilmiah</b></p><div class="row"><label>Bilangan<input id="nI" type="number" value="0.00025" step="any" oninput="ilmiah(1)" style="width:160px"></label></div><div class="out" id="nO" data-init="ilmiah"></div>`},
  spldv: {t: 'Pemecah SPLDV', h: () => `<p>Masukkan koefisien dua persamaan <b>ax + by = c</b>. Lihat langkah eliminasi–substitusi dan titik potong grafiknya.</p><div class="row" style="color:#2f7de1"><b style="margin:0 6px 14px 0">(1)</b><label>a<input id="s1" type="number" value="2" oninput="spldv(1)"></label><label>b<input id="s2" type="number" value="3" oninput="spldv(1)"></label><label>c<input id="s3" type="number" value="19" oninput="spldv(1)"></label></div><div class="row" style="color:#e58a00"><b style="margin:0 6px 14px 0">(2)</b><label>a<input id="s4" type="number" value="1" oninput="spldv(1)"></label><label>b<input id="s5" type="number" value="2" oninput="spldv(1)"></label><label>c<input id="s6" type="number" value="11" oninput="spldv(1)"></label></div><svg id="sS" viewBox="0 0 320 300" width="320" data-init="spldv"></svg><div class="out" id="sO"></div>`},
  grafik: {t: 'Studio Grafik', h: () => `<div class="row"><label>Jenis fungsi<select id="gM" onchange="grafik(1)"><option value="l">Garis lurus y = mx + c</option><option value="k">Kuadrat y = ax² + bx + c</option></select></label></div><div id="gLin">${rng_('gm', 'Gradien m', -5, 5, 1, .5, 'grafik(1)')}${rng_('gc', 'Konstanta c', -8, 8, 2, 1, 'grafik(1)')}</div><div id="gKua">${rng_('ga', 'a', -3, 3, 1, .5, 'grafik(1)')}${rng_('gb', 'b', -8, 8, -4, 1, 'grafik(1)')}${rng_('gc2', 'c', -8, 8, 3, 1, 'grafik(1)')}</div><svg id="gS" viewBox="0 0 320 300" width="320" data-init="grafik"></svg><div class="out" id="gO"></div>`},
  pythagoras: {t: 'Pythagoras & Bangun Ruang', h: () => `<p><b>1. Bukti luas Pythagoras</b> — ubah sisi siku-siku a dan b.</p><div class="row"><label>a<input id="ya" type="number" value="3" oninput="pyt(1)"></label><label>b<input id="yb" type="number" value="4" oninput="pyt(1)"></label></div><svg id="yS" viewBox="0 0 320 260" width="320" data-init="pyt"></svg><div class="out" id="yO"></div>
    <p style="margin-top:16px"><b>2. Kalkulator bangun ruang</b></p><div class="row"><label>Bangun<select id="vB" onchange="ruang(1)"><option value="tabung">Tabung</option><option value="kerucut">Kerucut</option><option value="bola">Bola</option><option value="kubus">Kubus</option></select></label><label>r / sisi<input id="vR" type="number" value="7" oninput="ruang(1)"></label><label id="vTw">tinggi t<input id="vT" type="number" value="10" oninput="ruang(1)"></label></div><div class="out" id="vO" data-init="ruang"></div>`},
  statistik: {t: 'Statistik & Dadu', h: () => `<p><b>1. Olah datamu</b> (pisahkan dengan koma)</p><div class="row"><label>Data<input id="dD" type="text" value="7, 8, 6, 9, 8, 7, 8" oninput="stat(1)" style="width:240px"></label></div><svg id="dS" viewBox="0 0 320 175" width="320" data-init="stat"></svg><div class="out" id="dO"></div>
    <p style="margin-top:16px"><b>2. Percobaan peluang: lempar dadu</b></p><div class="row"><label>Banyak lemparan<select id="dN"><option>12</option><option>60</option><option selected>600</option><option>6000</option></select></label><button class="btn" onclick="dadu()">🎲 Lempar!</button></div><svg id="dS2" viewBox="0 0 320 165" width="320"></svg><div class="out" id="dO2"></div>`},
  transformasi: {t: 'Kanvas Transformasi', h: () => `<p>Tulis titik-titik bangun (x,y dipisah spasi), pilih transformasi, dan lihat bayangannya (oranye).</p><div class="row"><label>Titik<input id="xP" type="text" value="1,1 4,1 1,3" oninput="trans(1)"></label><label>Transformasi<select id="xT" onchange="trans(1)"><option value="tr">Translasi (a, b)</option><option value="sx">Refleksi sumbu-x</option><option value="sy">Refleksi sumbu-y</option><option value="yx">Refleksi y = x</option><option value="ymx">Refleksi y = −x</option><option value="r90">Rotasi 90° (pusat O)</option><option value="r180">Rotasi 180°</option><option value="r270">Rotasi 270° / −90°</option><option value="di">Dilatasi faktor k</option></select></label><span id="xAB" class="row"><label>a<input id="xa" type="number" value="-5" oninput="trans(1)"></label><label>b<input id="xb" type="number" value="2" oninput="trans(1)"></label></span><label id="xK">k<input id="xk" type="number" value="2" step="0.5" oninput="trans(1)"></label></div><svg id="xS" viewBox="0 0 320 320" width="320" data-init="trans"></svg><div class="out" id="xO"></div>`},
  pistol: {t: 'Simulator Pembagian Cara Pistol', h: () => `<p>Masukkan angka sendiri, lalu tekan “Langkah berikutnya” untuk melihat susunan porogapit terbentuk dengan pola <b>Ba–Ka–Ku–Tu</b>.</p><div class="row"><label>Yang dibagi<input id="bA" type="number" value="756"></label><label>Pembagi<input id="bB" type="number" value="6"></label><button class="btn sm" onclick="pbStart()">Mulai</button><button class="btn sm" onclick="pbStep(1)">Langkah berikutnya ▶</button><button class="btn sm ghost" onclick="pbStep(99)">Semua</button></div><pre id="bP" class="pg" data-init="pbStart"></pre><div class="out" id="bO"></div>`},
};
