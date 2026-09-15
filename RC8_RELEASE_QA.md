# RC8 / v1.4 — Publication QA

**Verdict înainte de deployment:** `PASS_PROMOTION_READY__DEPLOYMENT_NOT_EXECUTED`  
**Țintă deployment:** GitHub `main` / GitHub Pages.

## Payload-uri publice

| Payload | Rânduri / features | Poziții distincte |
|---|---:|---:|
| Complet | 235 | 225 |
| Strict OSM | 183 | 176 |
| Fără geometrie | 1 | — |
| Semantic | 236 | — |

## Controale obligatorii

- corpus canonic: 236;
- geometrii publicate: 235;
- excepție explicit nemarcabilă: WG_LOC_0236 Kostei;
- strict coordinate-rule: 236 PASS / 0 WARN / 0 FAIL;
- M35 Google My Maps round-trip: 235/235 exact;
- OSM final strict-native: 183/183 acoperit de auditul live + remedieri;
- niciun marker artificial pentru Kostei;
- runtime v1.4 validează numărul de features și pozițiile distincte la încărcare;
- fișierele publice sunt versionate v1.4 și hash-uite în `PUBLICATION_MANIFEST.csv`.

## Verificare transport strict-183

Transportul `data/weigand-osm-v1.4-strict.geojson.gz` a fost refăcut în 6 fragmente Base64 textuale, pentru a elimina fragmentarea inițială neconformă. `transport-shim-v14.js` concatenează exclusiv, în ordine, `v14-strict-s01.b64` … `v14-strict-s06.b64`.

Controlul de integritate al stării finale de pe branch-ul RC8:

- raw strict: **229431 bytes**;
- raw SHA-256: `fa5c03c6bf64cb8dc1893637649f21c15cb31f32248d27f2a550d3f60b31ec1a`;
- gzip strict: **25367 bytes**;
- gzip SHA-256: `fc614e2c3c57b0cd621200661c6eecca3b113109c4ff59297987912817732d19`;
- Base64 concatenat: **33824 caractere**;
- fragmente: **6000 + 6000 + 6000 + 6000 + 6000 + 3824**;
- conținut strict: **183 features / 183 WG_LOC / 176 poziții distincte / numai Point**;
- blob-urile celor 6 fragmente de pe GitHub corespund exact blob-urilor regenerate local;
- vechile fragmente `v14-strict-01.b64` … `v14-strict-03.b64` au fost eliminate din starea RC8 și nu mai sunt referite de shim.

**Verdict transport strict-183: PASS.**

## Smoke-test branch RC8 — Milestone 37

Starea `release/v1.4-rc8` a fost verificată înainte de PR prin reconstrucție deterministă a celor patru payload-uri virtuale și prin controlul wiring-ului interfeței.

Rezultate:

- `full`: **235 features / 225 poziții distincte / 235 WG_LOC unice**;
- `strict`: **183 features / 176 poziții distincte / 183 WG_LOC unice**;
- `noGeometry`: **1 rând — WG_LOC_0236 Kostei**;
- `semantic`: **236 rânduri / 236 WG_LOC unice**, inclusiv Kostei;
- fiecare payload reconstruiește exact dimensiunea și SHA-256 din `PUBLICATION_MANIFEST.csv`;
- subsetul strict este feature-identic cu cele 183 de rânduri `StrictNative=YES` din setul complet;
- toate geometriile full/strict sunt `Point`; `SemanticParity=PASS` peste tot;
- `index.html` expune 236 corpus / 235 complet / 183 strict / 1 nemarcabil și încarcă `transport-shim-v14.js` + `app-v14.js`;
- patch-ul v1.4 pentru runtime păstrează validarea 235/225 și 183/176, registrul semantic 236, excepția no-geometry=1 și clasificarea tematică `Group`→`Layer`;
- release branch este **3 commits ahead / 0 behind** `main`; `main` nu a fost modificat.

Mediul de execuție folosit pentru QA blochează navigarea Chromium către preview-uri externe. Din acest motiv, controlul pre-PR este unul determinist de payload/runtime/static wiring, nu un GitHub Pages production smoke. Acest lucru nu afectează verificarea hash-urilor, a conținutului sau a logicii de validare a datelor.

**Verdict Milestone 37: `PASS_BRANCH_SMOKE__READY_FOR_PR`.**

## Limită de interpretare

Publicarea confirmă starea de release/proveniență. Nu reprezintă o afirmație că toate cele 236 de localizări istorice au fost determinate cu exactitate absolută.
