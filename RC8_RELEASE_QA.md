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

## Limită de interpretare

Publicarea confirmă starea de release/proveniență. Nu reprezintă o afirmație că toate cele 236 de localizări istorice au fost determinate cu exactitate absolută.
