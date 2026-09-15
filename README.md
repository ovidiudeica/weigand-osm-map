# Gustav Weigand — Rumänen und Aromunen in Bulgarien — Atlas OSM

**Ediție publicată:** v1.4 / RC8  
**Corpus canonic:** 236 entități `WG_LOC`  
**Corpus canonic de release:** WG_LOC v0.13 VERIFIED/CANDIDATE  
**Sursa istorică de adevăr:** Gustav Weigand, *Rumänen und Aromunen in Bulgarien* (1907).

Acest repository publică ramura **OpenStreetMap / Website** a proiectului. Corpusul semantic este comun cu ramura Google My Maps; coordonatele/geometriile rămân specifice platformei și proveniența lor este explicită.

## Date v1.4 / RC8

- corpus canonic activ: **236 WG_LOC**;
- geometrii publicate în setul complet: **235**, în **225 poziții distincte**;
- set strict OSM: **183 geometrii**, în **176 poziții distincte**;
- entități explicit nemarcabile prin evidență: **1** — `WG_LOC_0236` Kostei;
- model de release: **236 corpus / 235 mapped / 1 explicit unmarked**;
- audit regulă coordonate: **236 PASS / 0 WARN / 0 FAIL**;
- Google My Maps greenfield round-trip: **235/235 coordonate păstrate exact**;
- verificarea nativă OSM a detectat problemele RC7, iar toate cazurile care au rămas în setul strict RC8 au fost remediate și re-gate-uite.

## Ce înseamnă „strict” și „complet”

**Complet** include toate geometriile publicabile: obiecte OSM native, referințe/fallback-uri explicite și geometrii editoriale/de cercetare etichetate ca atare.

**Strict** include numai rândurile finale cu `StrictNative=YES`.

Kostei nu primește marker doar pentru a forța totalul la 236. Milestone 32 a stabilit că sursele disponibile nu justifică o localizare publică; el rămâne în registrul semantic și în fișierul `no-geometry`.

## QA și promovare

Milestone 36: **PASS_PROMOTION_READY__DEPLOYMENT_NOT_EXECUTED** înaintea acestei publicări. Criteriile de promovare includ:

- regresie canonică v0.13: PASS;
- rebuild sincronizat RC8: PASS;
- set final strict-native OSM: 183/183 acoperit de lanțul live + remedieri documentate;
- My Maps round-trip RC8: 235/235 exact;
- manifestul pachetului RC8: 20/20 SHA-256 corecte;
- 0 blocking release holds.

Această publicare nu afirmă că toate cele 236 de localizări istorice sunt exact cunoscute. Geometriile native, referințele, punctele de cercetare și excepția nemarcabilă rămân diferențiate.

## Runtime v1.4

Runtime-ul public păstrează transportul compatibil cu limitările de fișiere text ale conectorului GitHub:

- `transport-shim-v14.js` reconstruiește deterministic cele patru fluxuri gzip v1.4 din fragmente Base64 aflate în `data/transport-v14/`;
- `app-v14.js` pornește runtime-ul atlasului verificat anterior și aplică fail-fast numai substituțiile necesare pentru căile/count-urile v1.4, clasificarea tematică pe `Group` și filtrarea publică a URL-urilor de stocare;
- payload-urile virtuale sunt `data/weigand-osm-v1.4.geojson.gz`, `data/weigand-osm-v1.4-strict.geojson.gz`, `data/weigand-osm-v1.4-no-geometry.csv.gz` și `data/weigand-osm-v1.4-semantic-236.csv.gz`.

`transport-shim.js` și `data/transport/` rămân în repository numai ca istoric al publicației v1.0 și nu sunt folosite de pagina v1.4.

## Regula de sursă

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → RAMURI SINCRONIZATE MY MAPS / OSM-WEBSITE**

Weigand 1907 rămâne autoritatea istorică și semantică. OpenStreetMap și alte surse moderne sunt folosite pentru identificare și geometrie modernă, fără a rescrie afirmația istorică și fără a transforma automat un obiect modern într-o dovadă a localizării istorice exacte.

Hash-urile payload-urilor publice curente sunt în `PUBLICATION_MANIFEST.csv`. Fișierele M5/M9 sunt păstrate ca evidențe istorice și nu reprezintă starea curentă.
