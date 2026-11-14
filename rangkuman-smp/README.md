# Rangkuman SMP Interaktif

Website belajar interaktif IPA (Fisika, Kimia, Biologi) dan Matematika untuk SMP kelas 7–9, dengan tampilan ala aplikasi belajar.

**Live:** https://rivaldimhr.github.io/rangkuman-smp/

## Fitur
- **27 bab, 149 pembahasan** — tiap bab punya tab *Materi*, *Penemuan Rumus* (sejarah penemu & penurunan rumus), *Contoh Soal* (langkah dibuka satu per satu), dan *Lab Interaktif*.
- **Ilustrasi SVG** di setiap bab, dibuat langsung dengan kode.
- **27 lab interaktif**: tangga satuan (panjang, massa, liter, luas, kubik), termometer, balapan GLBB, tuas, kolam gelombang, meja optik, rangkaian lampu, tata surya, perakit atom, skala pH, percobaan fotosintesis, papan Mendel, studio grafik, pemecah SPLDV, bukti Pythagoras, simulasi dadu, kanvas transformasi, simulator pembagian cara pistol, dan permainan memilah/mengurutkan.
- **Tryout & Quiz terpisah dari materi** — 143 soal; setiap kuis menjelaskan apa yang dibahas dan setiap soal punya pembahasan. Ada tryout acak per mapel dan Daily Challenge.
- **Gamifikasi**: XP, koin, level, layar *Level Up*, dan Laporan Belajar mingguan. Progres tersimpan di browser (localStorage).
- **Kamus Rumus** yang bisa dicari dan **4 poster A3** siap cetak di `poster/`.

## Struktur
```
index.html            kerangka aplikasi
style.css             tampilan
app.js                router, beranda, bab, kuis, laporan, level/XP
labs.js               semua lab interaktif
data/*.js             isi materi & soal per mapel (C({...}) per bab)
poster/*.pdf          poster A3 per mapel
src/make_posters.py   pembuat poster A3 (Playwright/Chromium)
```

Tanpa framework dan tanpa build step — cukup buka `index.html`. Menambah bab baru cukup menambahkan satu blok `C({...})` di file `data/` yang sesuai.
