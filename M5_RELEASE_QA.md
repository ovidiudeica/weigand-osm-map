# Milestone 5 — Release Candidate v0.24 RC1 — QA

**Data:** 2026-09-11  
**Branch:** `release/v0.24-rc1`  
**Baseline `main`:** `14a8f45a0e3bafa9cfb30b01f5f0fa7803051e4d`  
**Arhivă pre-canonică:** `archive/v0.22-pre-canonical` la același commit.

## Statut

**QA structural / integritate: PASS — 47/47 controale.**

`main` nu este modificat. Nu s-a făcut merge și nu s-a publicat versiunea finală.

## Rezultate OSM

- corpus semantic: **225 WG_LOC**;
- OSM full: **163 geometrii / 161 poziții distincte**;
- OSM strict: **157 geometrii / 156 poziții distincte**;
- fără geometrie OSM adoptată: **62**;
- `SemanticParity=PASS`: **225/225**;
- ID-uri `RETIRED` în output: **0**;
- full + no-geometry = 225 exact, fără suprapunere de ID;
- strict este subset al full.

## Cross-check MyMaps

- import MyMaps: **188 reprezentări / 187 poziții distincte**;
- fără geometrie MyMaps adoptată: **37**;
- acoperire semantică: **225/225**;
- distribuție import: 77 români/dacoromâni, 77 aromâni, 28 toponime, 6 mixt.

## Integritatea transportului GitHub

Payload-urile M4 au fost recomprimate deterministic (`gzip`, `mtime=0`) și codificate Base64 pentru stocare textuală. Cele **20 de fragmente** din `data/transport/` au exact dimensiunile și Git blob SHA-urile regenerate local din payload-urile M4. Reconstrucția este lossless; hash-urile payload-urilor canonice și ale fluxurilor gzip sunt în `M5_MANIFEST.csv`.

Fișierele v0.22 au fost eliminate numai din branch-ul RC; ele rămân conservate în `main` și în `archive/v0.22-pre-canonical`.

## Limitare înainte de merge

Smoke-testul vizual/manual al GitHub Pages nu a putut fi executat în mediul automatizat deoarece navigarea browserului este blocată administrativ. Prin urmare, RC1 trebuie păstrat ca **Draft PR** până la verificarea manuală a randării, interacțiunilor și tile-urilor Leaflet.

După PASS vizual: **Ready for review → merge în `main` → release/tag**.
