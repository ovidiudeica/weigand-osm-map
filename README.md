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
data/transport/
  full-01.b64 ... full-04.b64
  strict-01.b64 ... strict-04.b64
  semantic-01.b64 ... semantic-04.b64
  noGeometry.b64
```

În RC1, fișierele M4 sunt păstrate în repository ca fluxuri gzip deterministe codificate Base64. Interfața le reconstruiește fără pierderi în browser, le decomprimă, iar descărcările oferă utilizatorului fișierele originale `.geojson` / `.csv`. Hash-urile SHA-256 după reconstrucție și decomprimare sunt controlate în manifestul M5; transportul nu modifică datele canonice.

## Regula de sursă

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → PUBLICARE OSM**

OpenStreetMap și sursele moderne sunt folosite pentru identificare/geometrie modernă, nu pentru a rescrie informația istorică din Weigand.

## Release Candidate

RC1 este construit pe ramura `release/v0.24-rc1`. Baseline-ul pre-canonic v0.22 este păstrat în ramura `archive/v0.22-pre-canonical`. `main` nu este modificat până la validarea finală a RC-ului.
