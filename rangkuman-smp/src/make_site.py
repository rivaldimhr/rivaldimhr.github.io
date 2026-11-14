import re, json
src=open('make_posters.py').read()
exec(src[:src.index('async def main')])
def px(h): return re.sub(r'([\d.]+)mm', lambda m: f"{float(m.group(1))*3.2:.1f}px", h)

TOOLS = {
 "FISIKA": {
  0: '<div class="tool"><b>🔢 Konversi Suhu</b><br>Celcius: <input id="tc" type="number" value="100"> <button onclick="suhu()">Ubah</button><div class="out" id="to"></div></div>',
  1: '<div class="tool"><b>🔢 Massa Jenis</b><br>m (kg) <input id="mj_m" type="number" value="2"> V (m³) <input id="mj_v" type="number" value="0.002"> <button onclick="mj()">Hitung ρ</button><div class="out" id="mjo"></div></div>',
  3: '<div class="tool"><b>🔢 GLBB</b><br>v₀ <input id="g_v" type="number" value="0"> a <input id="g_a" type="number" value="2"> t <input id="g_t" type="number" value="5"> <button onclick="glbb()">Hitung</button><div class="out" id="glo"></div></div>',
  4: '<div class="tool"><b>🔢 Energi</b><br>m (kg) <input id="e_m" type="number" value="2"> v (m/s) <input id="e_v" type="number" value="3"> h (m) <input id="e_h" type="number" value="5"> <button onclick="energi()">Hitung</button><div class="out" id="eo"></div></div>',
  5: '<div class="tool"><b>🔢 Cepat Rambat</b><br>λ (m) <input id="w_l" type="number" value="2"> f (Hz) <input id="w_f" type="number" value="170"> <button onclick="gel()">Hitung v</button><div class="out" id="wo"></div></div>',
  7: '<div class="tool"><b>🔢 Hukum Ohm & Daya</b><br>I (A) <input id="oi" type="number" value="2"> R (Ω) <input id="or" type="number" value="5"> <button onclick="ohm()">Hitung</button><div class="out" id="oo"></div></div>',
 },
 "KIMIA": {
  3: '<div class="tool"><b>🎚️ Geser skala pH</b><br><input id="ph" type="range" min="1" max="14" value="7" style="width:100%" oninput="phf()"><div class="out" id="pho"></div></div>',
 },
 "BIOLOGI": {
  5: '<div class="tool"><b>🧬 Persilangan Monohibrid</b><br>Induk 1 <input id="g1" value="Mm"> Induk 2 <input id="g2" value="Mm"> <button onclick="cross()">Silangkan</button><div class="out" id="go"></div></div>',
 },
 "MATEMATIKA": {
  2: '<div class="tool"><b>🔢 Akar Persamaan Kuadrat</b><br>a <input id="qa" type="number" value="1"> b <input id="qb" type="number" value="-5"> c <input id="qc" type="number" value="6"> <button onclick="quad()">Hitung</button><div class="out" id="qo"></div></div>',
  3: '<div class="tool"><b>🔢 Pythagoras</b><br>a <input id="pa" type="number" value="3"> b <input id="pb" type="number" value="4"> <button onclick="pyth()">Hitung c</button><div class="out" id="pyo"></div></div><div class="tool"><b>🔢 Volume Bangun Ruang Sisi Lengkung</b><br>r <input id="vr" type="number" value="7"> t <input id="vt" type="number" value="10"> <button onclick="vol()">Hitung</button><div class="out" id="vo"></div></div>',
  4: '<div class="tool"><b>🔢 Mean, Median, Modus</b><br>Data (pisah koma): <input id="sd" value="4,6,6,7,8" style="width:180px"> <button onclick="stat()">Hitung</button><div class="out" id="sto"></div></div>',
  5: '<div class="tool"><b>🔢 Transformasi Titik</b><br>x <input id="tx" type="number" value="2"> y <input id="ty" type="number" value="3"> <button onclick="trans()">Tampilkan</button><div class="out" id="tro"></div></div>',
  6: '<div class="tool"><b>🔫➗ Simulasi Pembagian Cara Pistol</b><br><input id="d1" type="number" value="756"> : <input id="d2" type="number" value="6"> <button onclick="bagi()">Mulai</button> <button onclick="step(1)">Langkah berikutnya ▶</button> <button onclick="step(99)">Semua</button><pre id="dpre" class="pg"></pre><div class="out" id="do"></div></div>',
 },
}
QUIZ = {
 "FISIKA":[["Satuan SI untuk suhu adalah…",["Celcius","Kelvin","Fahrenheit"],1],["Perubahan wujud padat → gas disebut…",["Menguap","Menyublim","Membeku"],1],["Benda 2 kg dipercepat 3 m/s². Gayanya…",["6 N","5 N","1,5 N"],0],["Penderita miopi memakai lensa…",["Cembung","Cekung","Rangkap"],1],["Planet terdekat dari Matahari:",["Venus","Mars","Merkurius"],2],["I = 2 A, R = 5 Ω. V = …",["10 V","7 V","2,5 V"],0]],
 "KIMIA":[["H₂O termasuk…",["Unsur","Senyawa","Campuran"],1],["Memisahkan tinta menggunakan…",["Filtrasi","Kromatografi","Destilasi"],1],["Besi berkarat adalah perubahan…",["Fisika","Kimia","Wujud"],1],["Partikel bermuatan negatif:",["Proton","Neutron","Elektron"],2],["Asam mengubah lakmus biru menjadi…",["Merah","Biru","Hijau"],0],["Zat yang dilarang di makanan:",["Boraks","Kunyit","Gula"],0]],
 "BIOLOGI":[["Urutan organisasi kehidupan yang benar:",["Sel → Organ → Jaringan","Sel → Jaringan → Organ","Jaringan → Sel → Organ"],1],["Lebah & bunga adalah simbiosis…",["Mutualisme","Komensalisme","Parasitisme"],0],["Pertukaran O₂ & CO₂ terjadi di…",["Bronkus","Alveolus","Trakea"],1],["Jaringan pengangkut air pada tumbuhan:",["Floem","Xilem","Epidermis"],1],["Mm × Mm → rasio fenotipe…",["1:1","3:1","1:2:1"],1],["Contoh bioteknologi konvensional:",["Kloning","Tempe","Kultur jaringan"],1]],
 "MATEMATIKA":[["2³ × 2⁴ = …",["2⁷","2¹²","4⁷"],0],["Jika 2x + 3 = 11, maka x = …",["3","4","7"],1],["Gradien garis y = 3x − 2 adalah…",["−2","3","2"],1],["Sisi miring segitiga dengan sisi 6 dan 8:",["10","12","14"],0],["Modus dari 3, 5, 5, 7, 8:",["5","7","5,6"],0],["844 : 4 dengan cara pistol = …",["211","221","201"],0],["Refleksi titik (2, 3) terhadap sumbu-x:",["(−2, 3)","(2, −3)","(3, 2)"],1]],
}
JS2 = r"""
const $=i=>document.getElementById(i),n=i=>parseFloat($(i).value),fx=v=>(+v.toFixed(2)).toLocaleString('id');
let store={};try{store=JSON.parse(localStorage.getItem('rk9')||'{}')}catch(e){}
function save(){try{localStorage.setItem('rk9',JSON.stringify(store))}catch(e){}}
const tabs=[...document.querySelectorAll('.tabs button')];
function show(b){tabs.forEach(x=>{x.classList.remove('on');x.style.background='#fff';x.style.color='#1d2b4f'});document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));b.classList.add('on');b.style.background=b.dataset.c;b.style.color='#fff';$(b.dataset.p).classList.add('on');document.body.style.setProperty('--c',b.dataset.c);prog()}
tabs.forEach(b=>b.onclick=()=>show(b));
document.querySelectorAll('.card h2').forEach(h=>h.onclick=e=>{if(e.target.tagName!=='INPUT')h.parentElement.classList.toggle('open')});
document.querySelectorAll('.done').forEach(c=>{c.checked=!!store[c.dataset.k];c.parentElement.parentElement.parentElement.classList.toggle('learned',c.checked);c.onchange=()=>{store[c.dataset.k]=c.checked;save();c.closest('.card').classList.toggle('learned',c.checked);prog()}});
function prog(){document.querySelectorAll('.page').forEach(p=>{const a=p.querySelectorAll('.done'),d=[...a].filter(x=>x.checked).length;p.querySelector('.bar i').style.width=(100*d/a.length)+'%';p.querySelector('.bar span').textContent=d+' / '+a.length+' bab dipelajari'})}
$('cari').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.card').forEach(c=>{const m=!q||c.textContent.toLowerCase().includes(q);c.style.display=m?'':'none';if(q&&m)c.classList.add('open')})};
$('bukaSemua').onclick=()=>{const p=document.querySelector('.page.on');const all=[...p.querySelectorAll('.card')].every(c=>c.classList.contains('open'));p.querySelectorAll('.card').forEach(c=>c.classList.toggle('open',!all))};
function suhu(){const c=n('tc');$('to').textContent=`${c}°C = ${fx(c*4/5)}°R = ${fx(c*9/5+32)}°F = ${fx(c+273)} K`}
function mj(){$('mjo').textContent=`ρ = ${n('mj_m')} / ${n('mj_v')} = ${fx(n('mj_m')/n('mj_v'))} kg/m³`}
function glbb(){const v=n('g_v'),a=n('g_a'),t=n('g_t');$('glo').textContent=`vₜ = ${fx(v+a*t)} m/s • s = ${fx(v*t+a*t*t/2)} m`}
function energi(){const m=n('e_m'),v=n('e_v'),h=n('e_h');$('eo').textContent=`Ek = ${fx(m*v*v/2)} J • Ep = ${fx(m*10*h)} J (g = 10 m/s²)`}
function gel(){$('wo').textContent=`v = ${n('w_l')} × ${n('w_f')} = ${fx(n('w_l')*n('w_f'))} m/s`}
function ohm(){const i=n('oi'),r=n('or');$('oo').textContent=`V = ${fx(i*r)} volt • P = ${fx(i*i*r)} watt`}
function phf(){const p=+$('ph').value,cols=['#e53935','#f4511e','#fb8c00','#fdd835','#c0ca33','#7cb342','#43a047','#26a69a','#29b6f6','#1e88e5','#3949ab','#5e35b1','#8e24aa','#6a1b9a'],ex={1:'asam lambung',2:'air jeruk nipis',3:'cuka',5:'kopi',7:'air murni',8:'air laut',9:'pasta gigi',10:'sabun',12:'air kapur',14:'NaOH'};$('pho').innerHTML=`<span style="background:${cols[p-1]};color:#fff;padding:4px 12px;border-radius:8px">pH ${p}</span> → ${p<7?'ASAM':p>7?'BASA':'NETRAL'}${ex[p]?' (contoh: '+ex[p]+')':''}`}
function cross(){const a=$('g1').value,b=$('g2').value;if(a.length!=2||b.length!=2){$('go').textContent='Tulis 2 huruf, mis. Mm';return}const r={};for(const x of a)for(const y of b){const g=[x,y].sort().join('');r[g]=(r[g]||0)+1}const d=Object.keys(r).filter(g=>g!==g.toLowerCase()).reduce((s,g)=>s+r[g],0);$('go').innerHTML='Genotipe: '+Object.entries(r).map(([g,c])=>g+' ('+c+'/4)').join(', ')+'<br>Fenotipe dominan : resesif = '+d+' : '+(4-d)}
function quad(){const a=n('qa'),b=n('qb'),c=n('qc'),D=b*b-4*a*c;if(!a){$('qo').textContent='a tidak boleh 0';return}$('qo').textContent=D<0?`D = ${D} < 0 → tidak ada akar real`:`D = ${D} → x₁ = ${fx((-b+Math.sqrt(D))/(2*a))}, x₂ = ${fx((-b-Math.sqrt(D))/(2*a))} • puncak x = ${fx(-b/(2*a))}`}
function pyth(){$('pyo').textContent=`c = √(${n('pa')}² + ${n('pb')}²) = ${fx(Math.hypot(n('pa'),n('pb')))}`}
function vol(){const r=n('vr'),t=n('vt');$('vo').textContent=`Tabung = ${fx(Math.PI*r*r*t)} • Kerucut = ${fx(Math.PI*r*r*t/3)} • Bola = ${fx(4/3*Math.PI*r**3)}`}
function stat(){const d=$('sd').value.split(',').map(Number).filter(x=>!isNaN(x)).sort((a,b)=>a-b);if(!d.length)return;const m=d.reduce((a,b)=>a+b,0)/d.length,k=d.length,med=k%2?d[(k-1)/2]:(d[k/2-1]+d[k/2])/2,f={};d.forEach(x=>f[x]=(f[x]||0)+1);const mx=Math.max(...Object.values(f)),mo=Object.keys(f).filter(x=>f[x]===mx);$('sto').textContent=`Urut: ${d.join(', ')} → Mean ${fx(m)} • Median ${fx(med)} • Modus ${mx>1?mo.join(', '):'tidak ada'}`}
function trans(){const x=n('tx'),y=n('ty');$('tro').innerHTML=`Refleksi sumbu-x (${x}, ${-y}) • sumbu-y (${-x}, ${y}) • y=x (${y}, ${x})<br>Rotasi 90° (${-y}, ${x}) • 180° (${-x}, ${-y}) • Dilatasi k=2 (${2*x}, ${2*y})`}
let S=null;
function bagi(){const s=String(Math.trunc(Math.abs(n('d1')))),d=Math.trunc(Math.abs(n('d2')));if(!d){$('do').textContent='Pembagi tidak boleh 0';return}
 let sis=0,q='',steps=[],started=false;for(let i=0;i<s.length;i++){const cur=sis*10+ +s[i],k=Math.floor(cur/d);sis=cur-k*d;if(k>0)started=true;if(started||i==s.length-1){q+=k;steps.push({i,cur,k,sub:k*d,sis})}else q+='';}
 S={s,d,steps,shown:0,q};$('do').textContent='Tekan "Langkah berikutnya ▶"';draw()}
function step(k){if(!S)bagi();S.shown=Math.min(S.steps.length,S.shown+k);draw()}
function draw(){const {s,d,steps,shown}=S,ds=String(d),pad=ds.length+3,W=s.length*2;let top=' '.repeat(pad),lines=[];
 const qd=steps.slice(0,shown);let qs=Array(s.length).fill(' ');qd.forEach(t=>qs[t.i]=String(t.k));top+=qs.join(' ');
 lines.push(top);lines.push(' '.repeat(ds.length+1)+'┌'+'─'.repeat(W+1));lines.push(' '+ds+' │ '+s.split('').join(' '));
 qd.forEach((t,j)=>{const cs=String(t.cur),ss=String(t.sub),end=pad+t.i*2;if(j>0)lines.push(' '.repeat(end-(cs.length-1)*2)+cs.split('').join(' ')+'   ← turunkan '+s[t.i]);
  lines.push(' '.repeat(end-(ss.length-1)*2)+ss.split('').join(' ')+'   ← '+d+' × '+t.k);lines.push(' '.repeat(end-(cs.length-1)*2)+'─'.repeat(cs.length*2-1));
  if(j==steps.length-1)lines.push(' '.repeat(end-(String(t.sis).length-1)*2)+String(t.sis).split('').join(' ')+'   ← sisa')});
 $('dpre').textContent=lines.join('\n');
 if(shown){const t=steps[shown-1];$('do').innerHTML=`Langkah ${shown}: <b>Bagi</b> ${t.cur} : ${d} = ${t.k} → <b>Kali</b> ${d}×${t.k} = ${t.sub} → <b>Kurang</b> ${t.cur}−${t.sub} = ${t.sis}`+(shown<steps.length?' → <b>Turunkan</b> angka berikutnya':`<br>✅ Hasil = <b>${+S.q}</b>${t.sis?' sisa '+t.sis:''} • Cek: ${+S.q} × ${d}${t.sis?' + '+t.sis:''} = ${+S.q*d+t.sis}`)}}
document.querySelectorAll('.quiz').forEach(z=>{const Q=JSON.parse(z.dataset.q);let sc=0,ans=0;const res=document.createElement('div');res.className='score';
 Q.forEach(([t,o,k],qi)=>{const d=document.createElement('div');d.className='q';d.innerHTML='<b>'+(qi+1)+'. '+t+'</b><br>';o.forEach((x,i)=>{const b=document.createElement('button');b.textContent=x;b.onclick=()=>{if(d.dataset.done)return;d.dataset.done=1;ans++;if(i==k){sc++;b.className='ok'}else{b.className='no';d.querySelectorAll('button')[k].className='ok'}res.textContent=`Skor: ${sc} / ${Q.length}`+(ans==Q.length?(sc==Q.length?' 🎉 Sempurna!':' — coba ulangi bab yang salah ya!'):'')};d.appendChild(b)});z.appendChild(d)});
 const r=document.createElement('button');r.textContent='🔄 Ulangi kuis';r.className='reset';r.onclick=()=>{sc=0;ans=0;res.textContent='';z.querySelectorAll('.q').forEach(d=>{delete d.dataset.done;d.querySelectorAll('button').forEach(b=>b.className='')})};z.append(res,r)});
show(tabs[0]);phf();bagi();
"""
pages=[];btns=[]
for name,ic,w,c,s,cards,foot in POSTERS:
    pid=w.lower()
    btns.append(f'<button data-p="{pid}" data-c="{c}">{ic} {w.title()}</button>')
    body=''
    for i,(t,h,em) in enumerate(cards):
        tool=TOOLS.get(w,{}).get(i,'')
        body+=f'<div class="card{" open" if i==0 else ""}"><h2><span class="n">{i+1}</span>{t}<span class="em">{em}</span><label class="chk" onclick="event.stopPropagation()"><input type="checkbox" class="done" data-k="{pid}{i}"> sudah paham</label></h2><div class="body">{px(h)}{tool}</div></div>'
    pages.append(f'<section class="page" id="{pid}" style="--c:{c};--s:{s}"><div class="bar"><i></i><span></span></div>{body}<h2 class="qt">📝 Kuis {w.title()}</h2><div class="quiz" data-q=\'{json.dumps(QUIZ[w],ensure_ascii=False)}\'></div><p class="foot">{foot}</p></section>')
CSS2="""
*{box-sizing:border-box}body{margin:0;font-family:Poppins,'Segoe UI',system-ui,sans-serif;color:#1d2b4f;background:#fdf8ef;background-image:radial-gradient(#e9dfc9 1px,transparent 1px);background-size:20px 20px}
header{text-align:center;padding:28px 12px 6px}header h1{margin:0;font-size:clamp(28px,6vw,52px);line-height:1.05}header h1 b{color:var(--c,#f07b2b)}
.pill{display:inline-block;margin-top:10px;background:#1d2b4f;color:#fff;padding:6px 20px;border-radius:30px;font-weight:700}
.tabs{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:12px;background:#fdf8efee;backdrop-filter:blur(4px)}
.tabs button{border:2px solid #1d2b4f;background:#fff;padding:9px 18px;border-radius:14px;font:inherit;font-weight:700;cursor:pointer}
.ctl{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:4px 12px 10px}.ctl input{padding:9px 14px;border-radius:12px;border:2px solid #ccc;font:inherit;width:min(360px,70vw)}
.ctl button{border:0;background:#1d2b4f;color:#fff;border-radius:12px;padding:9px 14px;font:inherit;cursor:pointer}
.page{display:none;max-width:900px;margin:auto;padding:0 14px 40px}.page.on{display:block}
.bar{position:relative;height:26px;background:#fff;border:2px solid var(--c);border-radius:20px;overflow:hidden;margin:8px 0 14px}.bar i{position:absolute;inset:0 auto 0 0;background:var(--s);transition:width .4s}.bar span{position:relative;display:block;text-align:center;font-size:13px;font-weight:700;line-height:22px}
.card{background:#fff;border:2.5px solid var(--c);border-radius:16px;margin:14px 0;box-shadow:5px 5px 0 var(--s);overflow:hidden}
.card.learned{opacity:.85}.card.learned h2 .n{background:#2e9e5b}
.card h2{margin:0;padding:12px 14px;font-size:19px;color:var(--c);display:flex;align-items:center;gap:10px;cursor:pointer;flex-wrap:wrap}
.n{flex:none;width:32px;height:32px;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-size:16px}
.em{font-size:24px}.chk{margin-left:auto;font-size:12px;color:#555;font-weight:400;display:flex;gap:4px;align-items:center}
.body{display:none;padding:2px 18px 16px;font-size:15px;line-height:1.6}.card.open .body{display:block}
.body p,.body li{font-size:15px !important;line-height:1.6 !important}
.f{background:#fff4d6;border-left:5px solid #f0b22b;border-radius:8px;padding:6px 12px;margin:8px 0;font-weight:700}
table{width:100%;border-collapse:collapse;margin:6px 0;font-size:14px}td,th{border:1px solid #d8d0bd;padding:5px 8px;text-align:left;vertical-align:top}th{background:var(--s)}
.tip{background:#e9f6ee;border-radius:8px;padding:6px 12px;margin-top:8px;font-size:14px}
.body pre{overflow:auto}
.tool{background:#eef6ff;border:2px dashed #9cc3f5;border-radius:12px;padding:10px 12px;margin:12px 0}
.tool input{width:80px;padding:6px;border-radius:8px;border:1px solid #aaa;font:inherit}
.tool button,.q button,.reset{background:var(--c);color:#fff;border:0;border-radius:8px;padding:7px 13px;font:inherit;cursor:pointer;margin:4px 3px 0 0}
.out{font-weight:700;margin-top:8px}.pg{font-family:'DejaVu Sans Mono',Consolas,monospace;background:#fff4d6;border-radius:8px;padding:10px;font-size:15px;line-height:1.35;min-height:20px}
.qt{color:var(--c);margin-top:28px}.q{background:#fff;border:2px solid #e5e0d5;border-radius:12px;padding:10px 14px;margin:8px 0}
.q button{background:#fff;color:#1d2b4f;border:2px solid var(--c)}.q button.ok{background:#2e9e5b;color:#fff;border-color:#2e9e5b}.q button.no{background:#d9534f;color:#fff;border-color:#d9534f}
.score{font-weight:700;font-size:18px;margin:10px 0}.foot{text-align:center;font-weight:700;margin-top:30px;border:2px dashed #1d2b4f;border-radius:14px;padding:10px;background:#fff}
@media(max-width:600px){.chk{margin-left:42px}}
"""
html=f"""<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet"><meta name="description" content="Rangkuman interaktif Fisika, Kimia, Biologi dan Matematika SMP kelas 7–9 dengan alat hitung, simulasi pembagian cara pistol, dan kuis."><title>Rangkuman Interaktif IPA & Matematika SMP</title><style>{CSS2}</style></head><body>
<header><h1>RANGKUMAN <b>INTERAKTIF</b></h1><div class="pill">IPA & MATEMATIKA • SMP KELAS 7 • 8 • 9</div></header>
<div class="tabs">{''.join(btns)}</div><div class="ctl"><input id="cari" placeholder="🔍 Cari materi, mis. 'Ohm' atau 'fotosintesis'"><button id="bukaSemua">Buka/Tutup semua bab</button></div><div class="ctl" style="margin-top:0">📄 Poster A3 (PDF): <a href="poster/Rangkuman_Fisika_A3.pdf" download style="font-weight:700;color:#1d2b4f">Fisika</a> <a href="poster/Rangkuman_Kimia_A3.pdf" download style="font-weight:700;color:#1d2b4f">Kimia</a> <a href="poster/Rangkuman_Biologi_A3.pdf" download style="font-weight:700;color:#1d2b4f">Biologi</a> <a href="poster/Rangkuman_Matematika_A3.pdf" download style="font-weight:700;color:#1d2b4f">Matematika</a></div>
{''.join(pages)}<p style="text-align:center;font-size:13px;margin:0 0 24px"><a href="../" style="color:#1d2b4f">← Kembali ke portofolio Rivaldi</a></p><script>{JS2}</script></body></html>"""
open('../index.html','w').write(html)
print(len(html))
