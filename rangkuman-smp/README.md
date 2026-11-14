# Rangkuman SMP Interaktif

Catatan belajar interaktif IPA (Fisika, Kimia, Biologi) dan Matematika untuk SMP kelas 7–9.

**Live:** https://rivaldimhr.github.io/rangkuman-smp/

## Fitur
- 27 bab dalam 4 mata pelajaran, kartu bisa dibuka/tutup, pencarian, dan progress "sudah paham" (tersimpan di browser)
- Alat hitung di dalam bab: konversi suhu, massa jenis, GLBB, energi, gelombang, hukum Ohm, skala pH, persilangan Mendel, persamaan kuadrat, Pythagoras, volume, statistika, transformasi titik
- Simulasi pembagian cara pistol (porogapit) langkah demi langkah
- Kuis bernilai di tiap mata pelajaran
- 4 poster rangkuman ukuran A3 siap cetak di folder `poster/`

## Struktur
```
index.html          website (satu file, tanpa build)
poster/*.pdf        poster A3 per mata pelajaran
src/make_posters.py isi materi + render poster A3 ke PDF (Playwright/Chromium)
src/make_site.py    membangun index.html dari isi materi yang sama
```

## Membuat ulang
```bash
cd src
python3 make_posters.py   # menulis ../poster/*.pdf
python3 make_site.py      # menulis ../index.html
```
Isi materi cukup diubah di satu tempat (`make_posters.py`), lalu poster dan website ikut diperbarui.
