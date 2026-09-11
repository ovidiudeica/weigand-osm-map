# Gustav Weigand — Rumänen und Aromunen in Bulgarien — Atlas OSM

**Release Candidate:** v0.24 RC1  
**Corpus canonic:** 225 entități `WG_LOC`  
**Sursa istorică de adevăr:** Gustav Weigand, *Rumänen und Aromunen in Bulgarien* (1907).

Acest repository publică ramura **OpenStreetMap / Website** a proiectului. Corpusul semantic este comun cu ramura Google My Maps; coordonatele sunt însă specifice platformei și sunt păstrate separat.

## Date publicate în RC1

- corpus canonic activ: **225 WG_LOC**;
- set OSM complet: **163 geometrii / 161 poziții distincte**;
- set OSM strict: **157 geometrii / 156 poziții distincte**;
- fără geometrie OSM adoptată: **62 entități**;
- setul strict exclude exact cele 6 cazuri cu statut `OSM_PROVISIONAL_REPER`;
- toate entitățile publicate păstrează numele Weigand, paginile tipărite, paginile PDF, descrierea/sinteza, identificarea modernă și statutul de verificare.

Pozițiile comune sunt deliberate și nu sunt deduplicate: în setul complet există două perechi de entități care împart o poziție OSM/reper; în setul strict rămâne o singură pereche comună.

## Fișiere

```text
index.html
app.js
styles.css
.nojekyll
transport-shim.js
README_M4.md
M5_RELEASE_QA.md
M5_MANIFEST.csv
data/transport/
  fragmente Base64 pentru full / strict / semantic / no-geometry
```

În RC1, payload-urile M4 sunt păstrate în repository ca fluxuri gzip deterministe codificate Base64. `transport-shim.js` concatenează fragmentele și reconstruiește fără pierderi exact fluxurile gzip validate în M5; `app.js` le decomprimă în browser, iar descărcările livrează fișierele originale `.geojson` / `.csv`. `M5_MANIFEST.csv` conține hash-urile SHA-256 ale payload-urilor canonice și ale fluxurilor gzip deterministe.

## Regula de sursă

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → PUBLICARE OSM**

OpenStreetMap și sursele moderne sunt folosite pentru identificare/geometrie modernă, nu pentru a rescrie informația istorică din Weigand.

## Release Candidate

RC1 este construit pe ramura `release/v0.24-rc1`. Baseline-ul pre-canonic v0.22 este păstrat în ramura `archive/v0.22-pre-canonical`. `main` rămâne nemodificat până la validarea finală a RC-ului.

QA structural și de integritate: **PASS**. Un smoke-test vizual/manual GitHub Pages rămâne obligatoriu înainte de merge, deoarece mediul automatizat nu permite navigarea browserului către pagina publică.