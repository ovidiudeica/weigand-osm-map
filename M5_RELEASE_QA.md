# Milestone 5 — Release Candidate v0.24 RC1 — QA

> **Statut document:** evidență istorică M5. `M5_MANIFEST.csv` păstrează hash-urile candidatului M4/M5 și nu descrie payload-urile publice curente. Fragmentele de transport istorice neutilizate au fost eliminate ulterior din `main`. Pentru verificarea publicației curente se folosește `PUBLICATION_MANIFEST.csv`.

**Data:** 2026-09-11  
**Branch:** `release/v0.24-rc1`  
**Baseline `main`:** `14a8f45a0e3bafa9cfb30b01f5f0fa7803051e4d`  
**Arhivă pre-canonică:** `archive/v0.22-pre-canonical` la același commit.

## Statut la M5

**M5 VERIFIED / RELEASE CANDIDATE APPROVED.**

**QA structural / integritate / dataset: PASS.**  
**Smoke-test vizual și funcțional GitHub Pages: PASS**, confirmat manual la 2026-09-11.

La momentul acestui milestone, `main` nu era modificat și nu se făcuse încă merge-ul M5.

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

## Integritatea transportului la M5

Payload-urile M4 au fost recomprimate deterministic (`gzip`, `mtime=0`) și codificate Base64 pentru stocare textuală. La M5, cele **20 de fragmente** de transport aveau exact dimensiunile și Git blob SHA-urile regenerate local din payload-urile M4. Reconstrucția era lossless; hash-urile payload-urilor canonice și ale fluxurilor gzip din acel milestone sunt în `M5_MANIFEST.csv`.

Aceste hash-uri sunt istorice. Ele nu sunt hash-urile payload-urilor publice curente post-M9.

## Smoke-test vizual / funcțional

Testul manual a fost raportat **PASS** pentru versiunea RC1. Au fost confirmate funcționarea interfeței și a hărții în browser, inclusiv încărcarea paginii și utilizarea normală a atlasului.

Gate-ul vizual care bloca merge-ul era închis.

## Concluzie istorică

RC1 a fost aprobat pentru review final și merge controlat în `main`. Documentul se păstrează pentru trasabilitatea milestone-ului M5; starea curentă a publicației este documentată separat.
