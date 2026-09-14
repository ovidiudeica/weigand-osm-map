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

## Limită de interpretare

Publicarea confirmă starea de release/proveniență. Nu reprezintă o afirmație că toate cele 236 de localizări istorice au fost determinate cu exactitate absolută.
