import { SILA, TIMELINE, USULAN, PIAGAM, GARUDA, SITUASI, SOAL } from "./content.js";

/* ---------------------------------------------------------------- utilitas */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ikon = (n, cls = "") => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#lambang-${n}"/></svg>`;
const KATA = ["", "pertama", "kedua", "ketiga", "keempat", "kelima"];
const HURUF = ["A", "B", "C", "D"];
const acak = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
function toast(teks) {
  const el = $("#toast");
  el.textContent = teks;
  el.classList.add("tampil");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("tampil"), 2600);
}

/* ---------------------------------------------------------------- progres (localStorage) */
const KUNCI = "virsila-progres-v1";
const AWAL = { sila: [], linimasa: [], garuda: false, praktikTerbaik: null, kuis: { latihan: null, ujian: null }, nama: "" };
function muat() {
  try {
    const s = JSON.parse(localStorage.getItem(KUNCI));
    return s ? { ...structuredClone(AWAL), ...s, kuis: { ...AWAL.kuis, ...(s.kuis || {}) } } : structuredClone(AWAL);
  } catch (e) {
    return structuredClone(AWAL);
  }
}
let P = muat();
function simpan() {
  try { localStorage.setItem(KUNCI, JSON.stringify(P)); } catch (e) { /* mode privat: progres hanya untuk sesi ini */ }
  renderProgres();
}

/* ---------------------------------------------------------------- hero */
function renderStrip() {
  $(".sila-strip").innerHTML = SILA.map((s) => `
    <li><button type="button" data-ke-sila="${s.no}" aria-label="Sila ${s.no}: ${esc(s.bunyi)}">
      <span class="koin">${ikon(s.no)}</span>
      <span class="no">Sila ${s.no}</span>
      <span class="nama">${esc(s.pendek)}</span>
      ${P.sila.includes(s.no) ? '<span class="selesai">✓ dipelajari</span>' : ""}
    </button></li>`).join("");
  $$("[data-ke-sila]").forEach((b) => b.addEventListener("click", () => {
    pilihSila(+b.dataset.keSila);
    $("#lima-sila").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }));
}

/* ---------------------------------------------------------------- lima sila */
let silaAktif = 1;
function renderSilaTabs() {
  $("#sila-tabs").innerHTML = SILA.map((s) => `
    <button type="button" role="tab" id="tab-sila-${s.no}" aria-controls="sila-panel" aria-selected="${s.no === silaAktif}" tabindex="${s.no === silaAktif ? 0 : -1}" data-sila="${s.no}">
      ${ikon(s.no)} Sila ${s.no}${P.sila.includes(s.no) ? ' <span class="ok" aria-label="sudah dipelajari">✓</span>' : ""}
    </button>`).join("");
  $$("#sila-tabs button").forEach((b) => {
    b.addEventListener("click", () => pilihSila(+b.dataset.sila));
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const n = ((silaAktif - 1 + (e.key === "ArrowRight" ? 1 : -1) + 5) % 5) + 1;
        pilihSila(n);
        $(`#tab-sila-${n}`).focus();
      }
    });
  });
}
function pilihSila(n) {
  silaAktif = n;
  renderSilaTabs();
  const s = SILA[n - 1];
  const sudah = P.sila.includes(n);
  const panel = $("#sila-panel");
  panel.setAttribute("aria-labelledby", `tab-sila-${n}`);
  panel.innerHTML = `
    <div>
      ${ikon(n, "sila-besar")}
      <div>
        <p class="sila-angka">${n}</p>
        <p class="sila-lambang-nama">${esc(s.lambang)}</p>
        <p class="sila-lambang-arti">${esc(s.arti_lambang)}</p>
      </div>
    </div>
    <div>
      <h3 class="sila-bunyi">${esc(s.bunyi)}</h3>
      <p class="sila-makna">${esc(s.makna)}</p>
      <div class="sila-contoh">
        <h3>Contoh dalam keseharian</h3>
        <ul>${s.contoh.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      </div>
      <div class="sila-aksi">
        <button class="tombol" type="button" id="tandai-sila" aria-pressed="${sudah}">${sudah ? "✓ Sudah dipelajari" : "Tandai sudah dipelajari"}</button>
        ${n < 5 ? `<button class="tombol tombol-garis" type="button" id="sila-lanjut">Sila ${KATA[n + 1]} →</button>` : `<a class="tombol tombol-garis" href="#sejarah" style="text-decoration:none">Lanjut ke sejarah →</a>`}
      </div>
    </div>`;
  $("#tandai-sila").addEventListener("click", () => {
    if (P.sila.includes(n)) P.sila = P.sila.filter((x) => x !== n);
    else { P.sila.push(n); toast(`Sila ${KATA[n]} ditandai sudah dipelajari.`); }
    simpan();
    pilihSila(n);
    renderStrip();
  });
  const lanjut = $("#sila-lanjut");
  if (lanjut) lanjut.addEventListener("click", () => pilihSila(n + 1));
}

/* ---------------------------------------------------------------- sejarah */
function renderLinimasa() {
  $("#linimasa").innerHTML = TIMELINE.map((t, i) => `
    <li class="${P.linimasa.includes(i) ? "dibuka" : ""}" data-i="${i}">
      <button type="button" aria-expanded="false" aria-controls="isi-${i}">
        <span class="tgl">${esc(t.tanggal)}</span>
        <span class="jdl">${esc(t.judul)}</span>
        <span class="panah" aria-hidden="true">›</span>
      </button>
      <p class="isi" id="isi-${i}" hidden>${esc(t.isi)}</p>
    </li>`).join("");
  $$("#linimasa li").forEach((li) => {
    const i = +li.dataset.i;
    const btn = $("button", li);
    btn.addEventListener("click", () => {
      const buka = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", buka);
      $(".isi", li).hidden = !buka;
      if (buka && !P.linimasa.includes(i)) {
        P.linimasa.push(i);
        li.classList.add("dibuka");
        simpan();
      }
    });
  });
}

function renderUsulan(aktif = Object.keys(USULAN)[2]) {
  const nama = Object.keys(USULAN);
  $("#usulan-tabs").innerHTML = nama.map((k) =>
    `<button type="button" role="tab" aria-selected="${k === aktif}" data-k="${esc(k)}">${esc(k)}</button>`).join("");
  $("#usulan-list").innerHTML = USULAN[aktif].map((x) => `<li>${esc(x)}</li>`).join("");
  $$("#usulan-tabs button").forEach((b) => b.addEventListener("click", () => renderUsulan(b.dataset.k)));
}

function renderPiagam(aktif = 0) {
  const versi = Object.keys(PIAGAM);
  $("#piagam-tombol").innerHTML = versi.map((v, i) =>
    `<button type="button" aria-pressed="${i === aktif}" data-i="${i}">${esc(v)}</button>`).join("");
  const teks = aktif === 0
    ? `Ketuhanan, <del>dengan kewajiban menjalankan syari'at Islam bagi pemeluk-pemeluknya</del>`
    : `Ketuhanan <ins>Yang Maha Esa</ins>`;
  $("#piagam-teks").innerHTML = teks;
  $$("#piagam-tombol button").forEach((b) => b.addEventListener("click", () => renderPiagam(+b.dataset.i)));
}

function renderGaruda() {
  const buka = new Set(P.garuda ? GARUDA.map((_, i) => i) : []);
  const grid = $("#garuda-grid");
  const gambar = () => {
    grid.innerHTML = GARUDA.map((g, i) => buka.has(i)
      ? `<button type="button" class="buka" data-i="${i}" aria-label="${esc(g.bagian)}: ${g.angka}"><span class="tanya">${g.angka}</span>${esc(g.bagian)}<small>${esc(g.arti)}</small></button>`
      : `<button type="button" data-i="${i}" aria-label="Buka kartu: ${esc(g.bagian)}"><span class="tanya">?</span>${esc(g.bagian)}</button>`).join("");
    $$("button", grid).forEach((b) => b.addEventListener("click", () => {
      buka.add(+b.dataset.i);
      gambar();
      $(`[data-i="${b.dataset.i}"]`, grid).focus();
    }));
    const hasil = $("#garuda-hasil");
    if (buka.size === GARUDA.length) {
      hasil.hidden = false;
      hasil.textContent = "17 – 8 – 19 45: 17 Agustus 1945, hari Proklamasi Kemerdekaan.";
      if (!P.garuda) { P.garuda = true; simpan(); toast("Kamu menemukan rahasia angka Garuda."); }
    }
  };
  gambar();
}

/* ---------------------------------------------------------------- praktik: sila yang mana? */
const praktik = { urutan: [], i: 0, skor: 0, jawab: null };
function mulaiPraktik() {
  Object.assign(praktik, { urutan: acak(SITUASI), i: 0, skor: 0, jawab: null });
  renderPraktik();
}
function renderPraktik() {
  const area = $("#praktik-area");
  const n = praktik.urutan.length;
  if (praktik.i >= n) {
    const best = Math.max(P.praktikTerbaik ?? 0, praktik.skor);
    const rekor = praktik.skor > (P.praktikTerbaik ?? -1);
    P.praktikTerbaik = best;
    simpan();
    area.innerHTML = `
      <p class="skor-akhir">${praktik.skor}/${n}</p>
      <p>${praktik.skor === n ? "Sempurna! Kamu sudah bisa mengenali pengamalan tiap sila." : praktik.skor >= 7 ? "Bagus! Baca lagi bagian Lima Sila untuk yang masih keliru." : "Coba pelajari lagi contoh-contoh di bagian Lima Sila, lalu ulangi."}
      ${rekor ? " <b>Rekor baru.</b>" : ` Skor terbaikmu: ${best}/${n}.`}</p>
      <button class="tombol" type="button" id="praktik-ulang">Main lagi</button>`;
    $("#praktik-ulang").addEventListener("click", mulaiPraktik);
    return;
  }
  const s = praktik.urutan[praktik.i];
  const sudah = praktik.jawab !== null;
  area.innerHTML = `
    <div class="praktik-atas"><span>Kejadian ${praktik.i + 1} dari ${n}</span><span>Benar: ${praktik.skor}</span></div>
    <div class="praktik-bar" aria-hidden="true"><span style="width:${(praktik.i / n) * 100}%"></span></div>
    <p class="situasi">${esc(s.teks)}</p>
    <div class="pilih-sila" role="group" aria-label="Pilih sila">
      ${SILA.map((x) => {
        let cls = "";
        if (sudah && x.no === s.sila) cls = "benar";
        else if (sudah && x.no === praktik.jawab) cls = "salah";
        return `<button type="button" class="${cls}" data-sila="${x.no}" ${sudah ? "disabled" : ""} aria-label="Sila ${x.no}: ${esc(x.bunyi)}">${ikon(x.no)}Sila ${x.no}</button>`;
      }).join("")}
    </div>
    ${sudah ? `<div class="umpan ${praktik.jawab === s.sila ? "benar" : "salah"}" role="status">
      <p><b>${praktik.jawab === s.sila ? "Tepat." : `Belum tepat. Jawabannya sila ${KATA[s.sila]}.`}</b> ${esc(s.alasan)}</p>
      <button class="tombol" type="button" id="praktik-lanjut">${praktik.i + 1 < n ? "Kejadian berikutnya" : "Lihat hasil"}</button>
    </div>` : ""}`;
  if (sudah) {
    $("#praktik-lanjut").addEventListener("click", () => { praktik.i++; praktik.jawab = null; renderPraktik(); });
    $("#praktik-lanjut").focus();
  } else {
    $$(".pilih-sila button", area).forEach((b) => b.addEventListener("click", () => {
      praktik.jawab = +b.dataset.sila;
      if (praktik.jawab === s.sila) praktik.skor++;
      renderPraktik();
    }));
  }
}

/* ---------------------------------------------------------------- kuis */
const UJIAN_JUMLAH = 10;
const UJIAN_DETIK = 10 * 60;
const kuis = { mode: null, soal: [], i: 0, jawab: [], sisa: 0, timer: null };

function layarMode() {
  clearInterval(kuis.timer);
  kuis.mode = null;
  const fmt = (v, total) => (v == null ? "" : `<p class="terbaik">Skor terbaik: ${v}${total ? `/${total}` : "%"}</p>`);
  $("#kuis-area").innerHTML = `
    <div class="mode-grid">
      <div class="mode">
        <h3>Latihan</h3>
        <p>Semua ${SOAL.length} soal dalam urutan acak. Jawaban dan pembahasan muncul setelah kamu menjawab.</p>
        ${fmt(P.kuis.latihan)}
        <button class="tombol tombol-putih" type="button" data-mode="latihan">Mulai latihan</button>
      </div>
      <div class="mode">
        <h3>Ujian</h3>
        <p>${UJIAN_JUMLAH} soal acak, waktu ${UJIAN_DETIK / 60} menit. Hasil dan pembahasan ditampilkan di akhir.</p>
        ${fmt(P.kuis.ujian)}
        <button class="tombol" type="button" data-mode="ujian">Mulai ujian</button>
      </div>
    </div>`;
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => mulaiKuis(b.dataset.mode)));
}

function mulaiKuis(mode, daftar = null) {
  clearInterval(kuis.timer);
  const pool = daftar || (mode === "ujian" ? acak(SOAL).slice(0, UJIAN_JUMLAH) : acak(SOAL));
  // acak urutan pilihan jawaban juga, sambil mengingat mana yang benar
  kuis.soal = pool.map((q) => {
    const urut = acak([0, 1, 2, 3]);
    return { ...q, pilihan: urut.map((k) => q.pilihan[k]), jawaban: urut.indexOf(q.jawaban), asal: q };
  });
  Object.assign(kuis, { mode, i: 0, jawab: new Array(kuis.soal.length).fill(null), sisa: UJIAN_DETIK });
  if (mode === "ujian") {
    kuis.timer = setInterval(() => {
      kuis.sisa--;
      const w = $("#waktu");
      if (w) {
        w.textContent = fmtWaktu(kuis.sisa);
        w.classList.toggle("mepet", kuis.sisa <= 60);
      }
      if (kuis.sisa <= 0) { toast("Waktu habis."); selesaiKuis(); }
    }, 1000);
  }
  renderSoal();
  $("#kuis").scrollIntoView({ block: "start" });
}

const fmtWaktu = (s) => `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, "0")}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

function renderSoal() {
  const q = kuis.soal[kuis.i];
  const n = kuis.soal.length;
  const jawab = kuis.jawab[kuis.i];
  const latihan = kuis.mode === "latihan";
  const tampilkan = latihan && jawab !== null;
  $("#kuis-area").innerHTML = `
    <div class="kuis-atas">
      <span>${latihan ? "Latihan" : "Ujian"} · Soal ${kuis.i + 1} dari ${n}</span>
      ${latihan ? `<span>Benar: ${kuis.jawab.filter((j, k) => j !== null && j === kuis.soal[k].jawaban).length}</span>`
                : `<span class="waktu" id="waktu" aria-label="Sisa waktu">${fmtWaktu(kuis.sisa)}</span>`}
    </div>
    <div class="kuis-bar" aria-hidden="true"><span style="width:${((kuis.i + (jawab !== null ? 1 : 0)) / n) * 100}%"></span></div>
    <p class="soal" id="soal-teks">${esc(q.tanya)}</p>
    <ul class="opsi" role="group" aria-labelledby="soal-teks">
      ${q.pilihan.map((p, k) => {
        let cls = "";
        if (tampilkan && k === q.jawaban) cls = "benar";
        else if (tampilkan && k === jawab) cls = "salah";
        else if (!latihan && k === jawab) cls = "dipilih";
        return `<li><button type="button" class="${cls}" data-k="${k}" ${tampilkan ? "disabled" : ""}><span class="huruf">${HURUF[k]}</span><span>${esc(p)}</span></button></li>`;
      }).join("")}
    </ul>
    ${tampilkan ? `<div class="bahas" role="status"><b>${jawab === q.jawaban ? "Benar." : `Kurang tepat. Jawaban: ${HURUF[q.jawaban]}.`}</b> ${esc(q.bahas)}</div>` : ""}
    <div class="kuis-nav">
      <button class="tombol tombol-garis" type="button" id="kuis-keluar" style="color:#fff;border-color:#3A3E49">Keluar</button>
      <span>
        ${!latihan && kuis.i > 0 ? `<button class="tombol tombol-garis" type="button" id="kuis-sebelum" style="color:#fff;border-color:#3A3E49">← Sebelumnya</button>` : ""}
        ${(latihan ? jawab !== null : true) ? `<button class="tombol tombol-putih" type="button" id="kuis-lanjut">${kuis.i + 1 < n ? "Berikutnya →" : "Selesai"}</button>` : ""}
      </span>
    </div>`;
  $$(".opsi button").forEach((b) => b.addEventListener("click", () => jawabSoal(+b.dataset.k)));
  $("#kuis-keluar").addEventListener("click", () => {
    if (confirmKeluar()) layarMode();
  });
  const lanjut = $("#kuis-lanjut");
  if (lanjut) lanjut.addEventListener("click", maju);
  const sebelum = $("#kuis-sebelum");
  if (sebelum) sebelum.addEventListener("click", () => { kuis.i--; renderSoal(); });
  if (tampilkan && lanjut) lanjut.focus();
}

// Keluar di tengah kuis menghapus jawaban; tanyakan dulu kecuali belum ada yang dijawab
function confirmKeluar() {
  if (kuis.jawab.every((j) => j === null)) return true;
  return window.confirm("Keluar dari kuis? Jawabanmu di sesi ini tidak disimpan.");
}

function jawabSoal(k) {
  if (kuis.mode === "latihan" && kuis.jawab[kuis.i] !== null) return;
  kuis.jawab[kuis.i] = k;
  renderSoal();
}

function maju() {
  if (kuis.mode === "ujian" && kuis.jawab[kuis.i] === null) {
    toast("Soal ini belum dijawab. Kamu bisa kembali nanti.");
  }
  if (kuis.i + 1 < kuis.soal.length) { kuis.i++; renderSoal(); }
  else if (kuis.mode === "ujian" && kuis.jawab.some((j) => j === null)) {
    const kosong = kuis.jawab.filter((j) => j === null).length;
    if (window.confirm(`Masih ada ${kosong} soal yang belum dijawab. Kumpulkan sekarang?`)) selesaiKuis();
  } else selesaiKuis();
}

function selesaiKuis() {
  clearInterval(kuis.timer);
  const n = kuis.soal.length;
  const benar = kuis.soal.filter((q, k) => kuis.jawab[k] === q.jawaban).length;
  const persen = Math.round((benar / n) * 100);
  const lama = P.kuis[kuis.mode];
  const rekor = lama == null || persen > lama;
  if (rekor) P.kuis[kuis.mode] = persen;
  simpan();
  const salah = kuis.soal.filter((q, k) => kuis.jawab[k] !== q.jawaban);
  const nama = P.nama ? `, ${esc(P.nama)}` : "";
  $("#kuis-area").innerHTML = `
    <p class="hasil-angka">${persen}%</p>
    <p style="font-size:19px;margin:8px 0 0">${benar} dari ${n} soal benar${nama}. ${persen >= 80 ? "Pemahamanmu sudah kuat." : persen >= 60 ? "Sudah cukup baik; pelajari pembahasan soal yang salah." : "Baca lagi materi Lima Sila dan Sejarah, lalu coba lagi."}
    ${rekor ? "<b>Skor terbaik baru untuk mode ini.</b>" : `Skor terbaikmu: ${lama}%.`}</p>
    <div class="kuis-nav" style="justify-content:flex-start">
      ${salah.length ? `<button class="tombol" type="button" id="ulang-salah">Ulangi ${salah.length} soal yang salah</button>` : ""}
      <button class="tombol tombol-putih" type="button" id="kuis-menu">Pilih mode lagi</button>
    </div>
    <ul class="ulas" aria-label="Ulasan jawaban">
      ${kuis.soal.map((q, k) => {
        const ok = kuis.jawab[k] === q.jawaban;
        const dipilih = kuis.jawab[k] == null ? "tidak dijawab" : `${HURUF[kuis.jawab[k]]}. ${esc(q.pilihan[kuis.jawab[k]])}`;
        return `<li class="${ok ? "" : "salah"}">
          <p class="q">${k + 1}. ${esc(q.tanya)}</p>
          <p class="a">${ok ? "✓" : "✗"} Jawabanmu: ${dipilih}${ok ? "" : ` · Benar: ${HURUF[q.jawaban]}. ${esc(q.pilihan[q.jawaban])}`}</p>
          <p class="a">${esc(q.bahas)}</p>
        </li>`;
      }).join("")}
    </ul>`;
  const ul = $("#ulang-salah");
  if (ul) ul.addEventListener("click", () => mulaiKuis("latihan", salah.map((q) => q.asal)));
  $("#kuis-menu").addEventListener("click", layarMode);
}

// Keyboard: A–D atau 1–4 untuk menjawab, Enter untuk lanjut (hanya saat kuis aktif dan fokus tidak di input)
document.addEventListener("keydown", (e) => {
  if (!kuis.mode || e.ctrlKey || e.metaKey || e.altKey) return;
  if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
  const map = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
  const k = map[e.key.toLowerCase()];
  if (k !== undefined && $("#kuis-area .opsi")) {
    const tombol = $$("#kuis-area .opsi button")[k];
    if (tombol && !tombol.disabled) { e.preventDefault(); jawabSoal(k); }
  }
});

/* ---------------------------------------------------------------- progres */
function hitungProgres() {
  const item = [
    { label: "Pelajari kelima sila", href: "#lima-sila", nilai: P.sila.length / 5, ket: `${P.sila.length}/5 sila` },
    { label: "Baca linimasa sejarah", href: "#sejarah", nilai: P.linimasa.length / TIMELINE.length, ket: `${P.linimasa.length}/${TIMELINE.length} peristiwa` },
    { label: "Temukan rahasia angka Garuda", href: "#sejarah", nilai: P.garuda ? 1 : 0, ket: P.garuda ? "ditemukan" : "belum" },
    { label: "Selesaikan latihan \"Sila yang mana?\"", href: "#praktik", nilai: P.praktikTerbaik == null ? 0 : 1, ket: P.praktikTerbaik == null ? "belum" : `terbaik ${P.praktikTerbaik}/${SITUASI.length}` },
    { label: "Raih 70% atau lebih di ujian", href: "#kuis", nilai: P.kuis.ujian == null ? 0 : Math.min(1, P.kuis.ujian / 70), ket: P.kuis.ujian == null ? "belum" : `terbaik ${P.kuis.ujian}%` }
  ];
  const total = Math.round((item.reduce((a, x) => a + x.nilai, 0) / item.length) * 100);
  return { item, total };
}
function renderProgres() {
  const { item, total } = hitungProgres();
  $("#nav-persen").textContent = `${total}%`;
  $("#progres-angka").textContent = `${total}%`;
  $("#progres-cincin").style.setProperty("--p", total);
  $("#cek-list").innerHTML = item.map((x) => `
    <li class="${x.nilai >= 1 ? "ok" : ""}">
      <span class="tanda" aria-hidden="true">${x.nilai >= 1 ? "✓" : ""}</span>
      <a href="${x.href}">${esc(x.label)}</a>
      <span class="ket">${esc(x.ket)}</span>
    </li>`).join("");
}

function setupProgres() {
  const nama = $("#nama");
  nama.value = P.nama;
  nama.addEventListener("change", () => { P.nama = nama.value.trim(); simpan(); if (P.nama) toast(`Halo, ${P.nama}!`); });
  $("#reset-progres").addEventListener("click", () => {
    if (!window.confirm("Hapus semua progres di browser ini?")) return;
    P = structuredClone(AWAL);
    simpan();
    nama.value = "";
    renderStrip(); pilihSila(1); renderLinimasa(); renderGaruda(); mulaiPraktik(); layarMode();
    toast("Progres dihapus.");
  });
}

/* ---------------------------------------------------------------- mulai */
renderStrip();
pilihSila(1);
renderLinimasa();
renderUsulan();
renderPiagam();
renderGaruda();
mulaiPraktik();
layarMode();
setupProgres();
renderProgres();
// tautan langsung ke sila tertentu, mis. index.html#sila-3
const m = location.hash.match(/^#sila-([1-5])$/);
if (m) { pilihSila(+m[1]); $("#lima-sila").scrollIntoView(); }

// untuk test otomatis
window.__virsila = { SOAL, SITUASI, TIMELINE, progres: () => P };
