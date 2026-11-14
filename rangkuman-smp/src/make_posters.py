import asyncio
from playwright.async_api import async_playwright

CSS = """
@page{size:A3;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:Poppins,'Noto Color Emoji',sans-serif;color:#1d2b4f}
.sheet{width:297mm;height:420mm;padding:12mm 13mm;background:#fdf8ef;position:relative;overflow:hidden;
 background-image:radial-gradient(#e9dfc9 1px,transparent 1px);background-size:6mm 6mm}
.hd{text-align:center;margin-bottom:6mm}
.hd .ic{font-size:15mm;line-height:1}
.hd h1{margin:1mm 0 0;font-size:19mm;line-height:1;letter-spacing:1px;font-weight:700}
.hd h1 b{color:var(--c)}
.pill{display:inline-block;margin-top:3mm;background:#1d2b4f;color:#fff;padding:2mm 9mm;border-radius:10mm;font-size:6mm;font-weight:700}
.grid{display:flex;gap:6mm;align-items:flex-start;transform-origin:top left}.col{flex:1;min-width:0}
.card{position:relative;background:#fff;border:0.8mm solid var(--c);border-radius:5mm;margin:0 0 5mm;padding:3.5mm 5mm 4mm;
 box-shadow:1.5mm 1.5mm 0 var(--s)}
.card h2{margin:0 0 2mm;font-size:5.6mm;line-height:1.2;color:var(--c);display:flex;align-items:center;gap:2.5mm}
.n{flex:none;width:9mm;height:9mm;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-size:5mm}
.card p,.card li{font-size:3.55mm;line-height:1.45;margin:0}
.card ul{margin:1mm 0 0;padding-left:5mm}
.f{background:#fff4d6;border-left:1.5mm solid #f0b22b;border-radius:2mm;padding:1.6mm 3mm;margin:2mm 0;font-weight:700;font-size:3.7mm}
table{width:100%;border-collapse:collapse;font-size:3.3mm;margin-top:1.5mm}
td,th{border:0.3mm solid #d8d0bd;padding:1mm 1.6mm;text-align:left;vertical-align:top}
th{background:var(--s);}
.tip{font-size:3.3mm;background:#e9f6ee;border-radius:2mm;padding:1.4mm 3mm;margin-top:2mm}
.ft{position:absolute;bottom:9mm;left:0;right:0;text-align:center}
.ft span{display:inline-block;border:0.6mm dashed #1d2b4f;border-radius:4mm;padding:2mm 8mm;font-size:5mm;font-weight:700;background:#fff}
.em{position:absolute;top:2.5mm;right:4mm;font-size:9mm}.card h2{padding-right:11mm}
"""

JS = r"""<script>
(function(){const g=document.getElementById('g'),cards=[...g.children];
const a=document.createElement('div'),b=document.createElement('div');a.className=b.className='col';
g.innerHTML='';g.append(a,b);
// measure each card at column width
const tmp=document.createElement('div');tmp.className='col';tmp.style.cssText='position:absolute;visibility:hidden;width:'+a.getBoundingClientRect().width+'px';document.body.append(tmp);
const h=cards.map(c=>{tmp.append(c);return c.getBoundingClientRect().height});tmp.remove();
const tot=h.reduce((x,y)=>x+y,0);let acc=0,i=0;
// keep reading order: fill left column until ~half
let best=0,bd=1e9;const n=cards.length;for(let m=0;m<(1<<n);m++){if(!(m&1))continue;let l=0;for(let j=0;j<n;j++)if(m>>j&1)l+=h[j];const d=Math.abs(l-(tot-l))+(m===((1<<n)-1)?0:0);if(d<bd-20){bd=d;best=m}}
cards.forEach((c,j)=>((best>>j&1)?a:b).append(c));
const ft=document.querySelector('.ft').getBoundingClientRect().top-15;
const top=g.getBoundingClientRect().top;const avail=ft-top;const need=g.scrollHeight;
{let z=Math.min(avail/need,1.3);for(let t=0;t<30;t++){g.style.transform='scale('+z+')';g.style.width=(100/z)+'%';const r=g.scrollHeight*z;if(r<=avail)break;z*=0.985;}}
})();</script>"""

def card(i, title, body, em=""):
    e = f'<span class="em">{em}</span>' if em else ""
    return f'<div class="card"><h2><span class="n">{i}</span>{title}</h2>{e}{body}</div>'

def page(icon, word, c, s, cards, foot):
    body = "".join(card(i + 1, *x) for i, x in enumerate(cards))
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="sheet" style="--c:{c};--s:{s}"><div class="hd"><div class="ic">{icon}</div>
<h1>RANGKUMAN <b>{word}</b></h1><div class="pill">SMP KELAS 7 • 8 • 9</div></div>
<div class="grid" id="g">{body}</div><div class="ft"><span>{foot}</span></div></div>{JS}</body></html>"""

FIS = [
 ("Besaran & Satuan", """<p><b>Besaran pokok</b> (7):</p><table><tr><th>Besaran</th><th>Satuan SI</th></tr>
<tr><td>Panjang</td><td>meter (m)</td></tr><tr><td>Massa</td><td>kilogram (kg)</td></tr><tr><td>Waktu</td><td>sekon (s)</td></tr>
<tr><td>Suhu</td><td>kelvin (K)</td></tr><tr><td>Kuat arus</td><td>ampere (A)</td></tr><tr><td>Intensitas cahaya</td><td>kandela (cd)</td></tr>
<tr><td>Jumlah zat</td><td>mol</td></tr></table>
<p style="margin-top:1.5mm"><b>Besaran turunan</b>: luas (m²), volume (m³), massa jenis (kg/m³), kecepatan (m/s).</p>""", "📏"),
 ("Zat & Wujudnya", """<ul><li>Mencair: padat → cair</li><li>Membeku: cair → padat</li><li>Menguap: cair → gas</li>
<li>Mengembun: gas → cair</li><li>Menyublim: padat → gas</li><li>Mengkristal/deposisi: gas → padat</li></ul>
<div class="f">Massa jenis: ρ = m / V</div><p>ρ air = 1.000 kg/m³ = 1 g/cm³</p>""", "🧊"),
 ("Suhu & Kalor", """<div class="f">C : R : (F−32) : (K−273) = 5 : 4 : 9 : 5</div>
<p><b>Pemuaian</b>: panjang, luas, volume (rel kereta diberi celah).</p>
<div class="f">Q = m · c · ΔT &nbsp;|&nbsp; Q = m · L</div>
<p><b>Perpindahan kalor</b>: konduksi (merambat, sendok panas), konveksi (aliran, air mendidih), radiasi (pancaran, sinar matahari).</p>
<div class="f">Asas Black: Q lepas = Q terima</div>""", "🌡️"),
 ("Gerak & Gaya", """<p><b>GLB</b>: kecepatan tetap → <b>s = v · t</b></p>
<p><b>GLBB</b>: percepatan tetap</p><div class="f">vₜ = v₀ + a·t &nbsp;|&nbsp; s = v₀·t + ½·a·t²</div>
<ul><li><b>Newton I</b>: ΣF = 0 → benda diam / GLB (inersia)</li><li><b>Newton II</b>: F = m · a</li><li><b>Newton III</b>: F aksi = −F reaksi</li></ul>
<p style="margin-top:1.5mm"><b>Tekanan</b></p><div class="f">P = F/A &nbsp;|&nbsp; Ph = ρ·g·h</div>
<div class="f">Pascal: F₁/A₁ = F₂/A₂ &nbsp;|&nbsp; Archimedes: Fa = ρ·g·V</div>""", "🚀"),
 ("Usaha, Energi & Pesawat Sederhana", """<div class="f">W = F · s &nbsp;|&nbsp; Ek = ½·m·v² &nbsp;|&nbsp; Ep = m·g·h</div>
<p><b>Hukum kekekalan energi</b>: energi tidak dapat diciptakan/dimusnahkan, hanya berubah bentuk. Em = Ep + Ek.</p>
<ul><li><b>Tuas</b>: W × Lb = F × Lk (gunting, linggis)</li><li><b>Bidang miring</b>: KM = s/h (tangga, jalan berkelok)</li>
<li><b>Katrol</b>: tetap KM=1, bebas KM=2, majemuk KM = jumlah tali</li></ul>""", "⚙️"),
 ("Getaran, Gelombang & Bunyi", """<div class="f">f = n/t &nbsp;|&nbsp; T = t/n = 1/f &nbsp;|&nbsp; v = λ · f</div>
<p>Gelombang <b>transversal</b> (tali, cahaya) & <b>longitudinal</b> (bunyi, slinki).</p>
<p>Bunyi butuh medium. Infrasonik &lt;20 Hz, audiosonik 20–20.000 Hz, ultrasonik &gt;20.000 Hz.</p>
<div class="f">Pantulan bunyi: s = v · t / 2</div><p><b>Resonansi</b>: ikut bergetar karena frekuensi sama (gitar, kentongan).</p>""", "🔊"),
 ("Cahaya & Alat Optik", """<div class="f">1/f = 1/s + 1/s' &nbsp;|&nbsp; M = s'/s &nbsp;|&nbsp; P = 100/f (cm)</div>
<ul><li>Cermin datar: bayangan maya, tegak, sama besar</li><li>Cermin cekung (+): mengumpulkan cahaya (lampu senter)</li>
<li>Cermin cembung (−): menyebarkan (spion)</li><li>Lensa cembung (+) & cekung (−) → pembiasan</li></ul>
<table><tr><th>Cacat mata</th><th>Kacamata</th></tr><tr><td>Miopi (rabun jauh)</td><td>Lensa cekung (−)</td></tr>
<tr><td>Hipermetropi (rabun dekat)</td><td>Lensa cembung (+)</td></tr><tr><td>Presbiopi (mata tua)</td><td>Lensa rangkap</td></tr></table>""", "🔍"),
 ("Listrik & Magnet", """<div class="f">Coulomb: F = k·q₁·q₂ / r²</div><div class="f">Ohm: V = I · R</div>
<p><b>Kirchhoff I</b>: ΣI masuk = ΣI keluar</p><p>Seri: Rₜ = R₁+R₂ &nbsp;•&nbsp; Paralel: 1/Rₜ = 1/R₁+1/R₂</p>
<div class="f">W = V·I·t &nbsp;|&nbsp; P = V·I</div>
<p><b>Magnet</b>: dibuat dengan digosok, induksi, elektromagnet. <b>Induksi elektromagnetik</b> → generator, dinamo.</p>
<div class="f">Trafo: Vp/Vs = Np/Ns = Is/Ip</div><p>Step-up: Ns &gt; Np &nbsp;•&nbsp; Step-down: Ns &lt; Np</p>""", "⚡"),
 ("Tata Surya", """<p>Pusat: <b>Matahari</b> (bintang). Urutan planet: <b>Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus</b>.</p>
<p>Satelit (Bulan), komet (berekor), meteor (terbakar di atmosfer), meteorit (sampai ke Bumi), asteroid.</p>
<ul><li><b>Rotasi Bumi</b> (24 jam): siang–malam, gerak semu harian</li><li><b>Revolusi Bumi</b> (365¼ hari): pergantian musim</li>
<li>Bulan: fase bulan, gerhana Matahari & Bulan</li></ul>
<div class="tip">💡 Hafalan: <b>"Mak Ve Bu Ma Ju Sa U Ne"</b></div>""", "🪐"),
]

KIM = [
 ("Klasifikasi Materi", """<table><tr><th>Jenis</th><th>Pengertian</th><th>Contoh</th></tr>
<tr><td><b>Unsur</b></td><td>Zat tunggal, tidak bisa diuraikan lagi</td><td>O, Fe, Au, Na</td></tr>
<tr><td><b>Senyawa</b></td><td>Gabungan unsur melalui reaksi kimia, perbandingan tetap</td><td>H₂O, NaCl, CO₂</td></tr>
<tr><td><b>Campuran homogen</b></td><td>Komponen tidak bisa dibedakan</td><td>Air gula, udara</td></tr>
<tr><td><b>Campuran heterogen</b></td><td>Komponen masih terlihat</td><td>Air + pasir, salad</td></tr></table>
<p style="margin-top:2mm"><b>Metode pemisahan campuran</b></p>
<table><tr><th>Metode</th><th>Prinsip</th><th>Contoh</th></tr>
<tr><td>Filtrasi</td><td>Perbedaan ukuran partikel</td><td>Menyaring air keruh</td></tr>
<tr><td>Sentrifugasi</td><td>Pemutaran cepat</td><td>Memisahkan sel darah</td></tr>
<tr><td>Kromatografi</td><td>Kecepatan rambat zat</td><td>Memisahkan tinta</td></tr>
<tr><td>Destilasi</td><td>Perbedaan titik didih</td><td>Air suling, minyak bumi</td></tr>
<tr><td>Sublimasi</td><td>Zat menyublim</td><td>Kapur barus</td></tr>
<tr><td>Kristalisasi</td><td>Penguapan pelarut</td><td>Garam dari air laut</td></tr></table>""", "🧪"),
 ("Sifat & Perubahan Materi", """<p><b>Sifat fisika</b>: wujud, warna, bau, titik didih, kelarutan. <b>Sifat kimia</b>: mudah terbakar, berkarat, membusuk.</p>
<table><tr><th>Perubahan Fisika</th><th>Perubahan Kimia</th></tr>
<tr><td>Tidak terbentuk zat baru</td><td>Terbentuk zat baru (reaksi kimia)</td></tr>
<tr><td>Es mencair, gula larut, kertas digunting</td><td>Kertas terbakar, besi berkarat, nasi basi</td></tr></table>
<p style="margin-top:1.5mm"><b>Ciri reaksi kimia</b>: perubahan warna, suhu, timbul gas, terbentuk endapan.</p>""", "🔥"),
 ("Struktur Atom Sederhana", """<ul><li><b>Atom</b>: partikel terkecil suatu unsur</li><li><b>Molekul</b>: gabungan 2 atom atau lebih (O₂, H₂O)</li>
<li><b>Ion</b>: atom bermuatan — kation (+) Na⁺, anion (−) Cl⁻</li></ul>
<table><tr><th>Partikel</th><th>Muatan</th><th>Letak</th></tr>
<tr><td>Proton</td><td>+</td><td>Inti atom</td></tr><tr><td>Neutron</td><td>0 (netral)</td><td>Inti atom</td></tr>
<tr><td>Elektron</td><td>−</td><td>Kulit atom</td></tr></table>
<div class="f">Nomor atom = jumlah proton &nbsp;|&nbsp; Nomor massa = proton + neutron</div>""", "⚛️"),
 ("Asam, Basa & Garam", """<table><tr><th></th><th>Asam</th><th>Basa</th></tr>
<tr><td>pH</td><td>&lt; 7</td><td>&gt; 7</td></tr><tr><td>Rasa</td><td>Masam</td><td>Pahit, licin</td></tr>
<tr><td>Lakmus</td><td>Biru → merah</td><td>Merah → biru</td></tr>
<tr><td>Contoh</td><td>Cuka, jeruk, HCl</td><td>Sabun, NaOH, pasta gigi</td></tr></table>
<p style="margin-top:1.5mm">pH 7 = netral (air murni). Skala pH: 1 (sangat asam) – 14 (sangat basa).</p>
<p><b>Indikator</b>: kertas lakmus, fenolftalein, indikator universal, alami (kunyit, kol ungu).</p>
<div class="f">Netralisasi: Asam + Basa → Garam + Air</div><p>Contoh: HCl + NaOH → NaCl + H₂O. Obat maag menetralkan asam lambung.</p>""", "🍋"),
 ("Bahan Kimia dalam Kehidupan", """<p><b>Zat aditif</b> (ditambahkan pada makanan):</p>
<table><tr><th>Jenis</th><th>Alami</th><th>Buatan</th></tr>
<tr><td>Pewarna</td><td>Kunyit, daun suji</td><td>Tartrazin</td></tr><tr><td>Pemanis</td><td>Gula, madu</td><td>Aspartam, sakarin</td></tr>
<tr><td>Penyedap</td><td>Bawang, garam</td><td>MSG</td></tr><tr><td>Pengawet</td><td>Garam, gula</td><td>Natrium benzoat</td></tr></table>
<div class="tip">⚠️ Dilarang di makanan: <b>formalin, boraks, rhodamin B</b></div>
<p style="margin-top:1.5mm"><b>Zat adiktif & psikotropika</b>: menimbulkan ketergantungan (nikotin, kafein, alkohol, narkotika). Merusak otak, organ, dan masa depan.</p>
<div class="tip">✅ Katakan TIDAK pada narkoba!</div>""", "🍬"),
]

BIO = [
 ("Objek IPA & Metode Ilmiah", """<p><b>Langkah metode ilmiah</b>: rumusan masalah → hipotesis → eksperimen → analisis data → kesimpulan.</p>
<p><b>Keselamatan laboratorium</b>: pakai jas lab & sarung tangan, baca label bahan, jangan makan/minum di lab, buang limbah di tempatnya.</p>""", "🔬"),
 ("Keanekaragaman Makhluk Hidup", """<p><b>Ciri makhluk hidup</b>: bernapas, bergerak, makan, tumbuh, berkembang biak, peka rangsang, ekskresi.</p>
<p><b>Takson</b> (klasifikasi): Kingdom → Filum → Kelas → Ordo → Famili → Genus → Spesies</p>
<div class="tip">💡 Nama ilmiah (binomial nomenklatur): <i>Genus spesies</i>, contoh <i>Oryza sativa</i> (padi)</div>
<div class="f">Sel → Jaringan → Organ → Sistem Organ → Organisme</div>""", "🌿"),
 ("Ekologi & Lingkungan", """<p><b>Komponen ekosistem</b>: biotik (makhluk hidup) & abiotik (air, tanah, cahaya, suhu).</p>
<p><b>Rantai makanan</b>: Produsen → Konsumen I → Konsumen II → Konsumen III → Pengurai</p>
<p>Contoh: padi → tikus → ular → elang. Jaring-jaring makanan = gabungan banyak rantai.</p>
<table><tr><th>Simbiosis</th><th>Sifat</th><th>Contoh</th></tr>
<tr><td>Mutualisme</td><td>+ / +</td><td>Lebah & bunga</td></tr><tr><td>Komensalisme</td><td>+ / 0</td><td>Anggrek & pohon</td></tr>
<tr><td>Parasitisme</td><td>+ / −</td><td>Benalu & inang</td></tr></table>
<p style="margin-top:1.5mm"><b>Pencemaran</b>: air, udara, tanah. <b>Pemanasan global</b> akibat gas rumah kaca (CO₂) → es kutub mencair.</p>""", "🌎"),
 ("Sistem Tubuh Manusia", """<table><tr><th>Sistem</th><th>Organ utama</th><th>Fungsi</th></tr>
<tr><td>Pencernaan</td><td>Mulut, lambung, usus halus, usus besar</td><td>Mencerna & menyerap makanan</td></tr>
<tr><td>Pernapasan</td><td>Hidung, trakea, bronkus, paru-paru (alveolus)</td><td>Pertukaran O₂ & CO₂</td></tr>
<tr><td>Peredaran darah</td><td>Jantung, pembuluh darah, darah</td><td>Mengangkut O₂ & sari makanan</td></tr>
<tr><td>Ekskresi</td><td>Ginjal, kulit, paru-paru, hati</td><td>Membuang zat sisa</td></tr>
<tr><td>Gerak</td><td>Rangka (pasif) & otot (aktif)</td><td>Menopang & menggerakkan tubuh</td></tr>
<tr><td>Saraf & indra</td><td>Otak, sumsum tulang belakang, mata, telinga, hidung, lidah, kulit</td><td>Mengatur & menerima rangsang</td></tr>
<tr><td>Reproduksi</td><td>Testis (sperma), ovarium (sel telur)</td><td>Menghasilkan keturunan</td></tr></table>
<div class="tip">💡 Gerak refleks: rangsang → reseptor → saraf sensorik → sumsum tulang belakang → saraf motorik → efektor</div>""", "🫀"),
 ("Struktur & Fungsi Tumbuhan", """<div class="f">Fotosintesis: 6CO₂ + 6H₂O —(cahaya, klorofil)→ C₆H₁₂O₆ + 6O₂</div>
<p><b>Respirasi</b>: glukosa + O₂ → CO₂ + H₂O + energi.</p>
<p><b>Jaringan</b>: meristem (tumbuh), epidermis (pelindung), parenkim (pengisi), xilem (angkut air), floem (angkut hasil fotosintesis).</p>
<p><b>Gerak tumbuhan</b>: tropisme (fototropisme, geotropisme), nasti (putri malu), taksis (gerak spermatozoid lumut).</p>""", "🌱"),
 ("Pewarisan Sifat & Bioteknologi", """<p><b>DNA → gen → kromosom</b>. Sifat <b>dominan</b> (huruf besar) menutupi <b>resesif</b> (huruf kecil).</p>
<div class="f">Mm × Mm → MM : Mm : mm = 1 : 2 : 1 &nbsp;(fenotipe 3 : 1)</div>
<table><tr><th>Konvensional</th><th>Modern</th></tr>
<tr><td>Tempe, tape, yoghurt, kecap (pakai mikroorganisme)</td><td>Kultur jaringan, rekayasa genetika, kloning, insulin buatan</td></tr></table>""", "🧬"),
]

MAT = [
 ("Bilangan", """<p><b>Bilangan bulat</b>: …, −2, −1, 0, 1, 2, … &nbsp;(−) × (−) = (+)</p>
<p><b>Pecahan</b>: samakan penyebut untuk +/−; a/b × c/d = ac/bd; a/b : c/d = a/b × d/c</p>
<div class="f">aᵐ × aⁿ = aᵐ⁺ⁿ &nbsp;|&nbsp; aᵐ : aⁿ = aᵐ⁻ⁿ &nbsp;|&nbsp; (aᵐ)ⁿ = aᵐⁿ</div>
<div class="f">a⁰ = 1 &nbsp;|&nbsp; a⁻ⁿ = 1/aⁿ &nbsp;|&nbsp; √(a·b) = √a · √b</div><p>Contoh: √50 = √(25×2) = 5√2</p>""", "🔢"),
 ("Aljabar", """<p>Suku sejenis bisa dijumlah: 3x + 5x = 8x. &nbsp;(a + b)² = a² + 2ab + b²</p>
<p><b>PLSV</b>: 2x + 3 = 11 → 2x = 8 → x = 4</p><p><b>PtSLV</b>: 3x − 2 &lt; 7 → x &lt; 3 (tanda dibalik jika dikali bilangan negatif)</p>
<p><b>SPLDV</b> — cara: substitusi, eliminasi, grafik</p>
<div class="f">x + y = 5 dan x − y = 1 → 2x = 6 → x = 3, y = 2</div>""", "✖️"),
 ("Fungsi & Grafik", """<p><b>Relasi</b>: hubungan dua himpunan. <b>Fungsi</b>: setiap anggota domain punya tepat satu pasangan.</p>
<div class="f">Garis lurus: y = mx + c &nbsp;|&nbsp; m = (y₂ − y₁)/(x₂ − x₁)</div>
<p>Sejajar: m₁ = m₂ &nbsp;•&nbsp; Tegak lurus: m₁ × m₂ = −1</p>
<div class="f">Fungsi kuadrat: y = ax² + bx + c &nbsp;|&nbsp; puncak x = −b/2a</div>
<p>a &gt; 0 parabola terbuka ke atas, a &lt; 0 ke bawah. D = b² − 4ac.</p>""", "📈"),
 ("Geometri & Pengukuran", """<p><b>Sudut</b>: lancip (&lt;90°), siku (90°), tumpul (&gt;90°). Berpelurus = 180°, berpenyiku = 90°.</p>
<table><tr><th>Bangun</th><th>Luas</th><th>Keliling</th></tr>
<tr><td>Persegi</td><td>s²</td><td>4s</td></tr><tr><td>Persegi panjang</td><td>p × l</td><td>2(p + l)</td></tr>
<tr><td>Segitiga</td><td>½ × a × t</td><td>a + b + c</td></tr><tr><td>Jajargenjang</td><td>a × t</td><td>2(a + b)</td></tr>
<tr><td>Trapesium</td><td>½(a + b) × t</td><td>jumlah sisi</td></tr><tr><td>Belah ketupat / layang-layang</td><td>½ × d₁ × d₂</td><td>jumlah sisi</td></tr></table>
<div class="f">Pythagoras: c² = a² + b² &nbsp;(tripel: 3-4-5, 5-12-13, 8-15-17)</div>
<p><b>Lingkaran</b>: L = πr², K = 2πr. Sudut pusat = 2 × sudut keliling.</p>
<div class="f">Busur = (α/360°)·2πr &nbsp;|&nbsp; Juring = (α/360°)·πr²</div>
<table><tr><th>Bangun ruang</th><th>Volume</th></tr>
<tr><td>Kubus</td><td>s³ (LP = 6s²)</td></tr><tr><td>Balok</td><td>p × l × t</td></tr><tr><td>Prisma</td><td>L alas × t</td></tr>
<tr><td>Limas</td><td>⅓ × L alas × t</td></tr><tr><td>Tabung</td><td>πr²t</td></tr><tr><td>Kerucut</td><td>⅓πr²t</td></tr><tr><td>Bola</td><td>4/3 πr³ (LP = 4πr²)</td></tr></table>""", "📐"),
 ("Statistika & Peluang", """<p><b>Penyajian data</b>: diagram batang, garis, lingkaran (sudut = data/total × 360°).</p>
<div class="f">Mean = jumlah data / banyak data</div>
<p><b>Median</b>: nilai tengah setelah data diurutkan. <b>Modus</b>: data yang paling sering muncul.</p>
<p>Contoh: 4, 6, 6, 7, 8 → mean 6,2; median 6; modus 6</p>
<div class="f">P(A) = n(A) / n(S) &nbsp;|&nbsp; 0 ≤ P(A) ≤ 1</div><p>Contoh: peluang muncul angka genap pada dadu = 3/6 = ½</p>""", "🎲"),
 ("Transformasi Geometri", """<table><tr><th>Jenis</th><th>Rumus titik (x, y)</th></tr>
<tr><td>Translasi (a, b)</td><td>(x + a, y + b)</td></tr>
<tr><td>Refleksi sumbu-x</td><td>(x, −y)</td></tr><tr><td>Refleksi sumbu-y</td><td>(−x, y)</td></tr>
<tr><td>Refleksi y = x</td><td>(y, x)</td></tr>
<tr><td>Rotasi 90° (pusat O)</td><td>(−y, x)</td></tr><tr><td>Rotasi 180°</td><td>(−x, −y)</td></tr>
<tr><td>Dilatasi faktor k</td><td>(kx, ky)</td></tr></table>
<div class="tip">💡 Translasi, refleksi & rotasi tidak mengubah ukuran; dilatasi mengubah ukuran.</div>""", "🔄"),

 ("Pembagian Cara Pistol (Porogapit)", """<p>Disebut "pistol" karena garis bantunya ( <b>)‾‾‾</b> ) mirip bentuk pistol. Contoh: <b>756 : 6</b></p>
<div style="display:flex;gap:4mm;align-items:flex-start;margin-top:1.5mm">
<pre style="font-family:'DejaVu Sans Mono',monospace;font-size:3.6mm;line-height:1.3;background:#fff4d6;border-radius:2mm;padding:2mm 3mm;margin:0">     1 2 6   ← hasil
   ┌──────
 6 │ 7 5 6
     6       ← 6×1
     ─ ↓
     1 5     ← turunkan 5
     1 2     ← 6×2
     ───  ↓
       3 6   ← turunkan 6
       3 6   ← 6×6
       ───
         0   ← sisa</pre>
<ol style="margin:0;padding-left:5mm">
<li><b>Tulis</b> pembagi di kiri garis, angka yang dibagi di dalam garis.</li>
<li><b>Bagi</b> angka paling kiri: 7 : 6 = <b>1</b>, tulis di atas.</li>
<li><b>Kalikan</b>: 1 × 6 = 6, tulis di bawah 7.</li>
<li><b>Kurangi</b>: 7 − 6 = 1.</li>
<li><b>Turunkan</b> angka berikutnya (5) → 15.</li>
<li><b>Ulangi</b>: 15 : 6 = <b>2</b> (2×6=12, sisa 3) → turunkan 6 → 36 : 6 = <b>6</b>, sisa 0.</li>
</ol></div>
<div class="f">Hasil: 756 : 6 = 126 &nbsp;|&nbsp; Cek: 126 × 6 = 756 ✔</div>
<div class="tip">💡 Ingat urutan <b>Ba–Ka–Ku–Tu</b>: Bagi → Kali → Kurang → Turunkan. Jika angka belum bisa dibagi, tulis <b>0</b> di hasil lalu turunkan angka berikutnya.</div>""", "➗"),
]

POSTERS = [
 ("Rangkuman_Fisika_A3", "⚡", "FISIKA", "#2b6fd6", "#cfe0fb", FIS, "Fisika itu seru kalau paham konsepnya! ⚡"),
 ("Rangkuman_Kimia_A3", "🧪", "KIMIA", "#8a3fd1", "#e6d5f7", KIM, "Kimia ada di sekitar kita setiap hari! 🧪"),
 ("Rangkuman_Biologi_A3", "🧬", "BIOLOGI", "#2e9e5b", "#d3efdf", BIO, "Kenali tubuhmu, jaga lingkunganmu! 🌱"),
 ("Rangkuman_Matematika_A3", "📐", "MATEMATIKA", "#f07b2b", "#fde0cb", MAT, "Latihan sedikit tiap hari, jago matematika! 📐"),
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1123, "height": 1587})
        for name, ic, w, c, s, cards, foot in POSTERS:
            html = page(ic, w, c, s, cards, foot)
            await pg.set_content(html)
            await pg.wait_for_timeout(300)
            over = await pg.evaluate("(()=>{const g=document.querySelector('.grid');return g.getBoundingClientRect().bottom>document.querySelector('.ft').getBoundingClientRect().top})()")
            print(name, "OVERFLOW" if over else "ok")
            await pg.pdf(path=f"../poster/{name}.pdf", format="A3", print_background=True, page_ranges="1")
            pass
        await b.close()

asyncio.run(main())
