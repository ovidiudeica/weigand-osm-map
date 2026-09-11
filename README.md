# Gustav Weigand — Rumänen und Aromunen in Bulgarien — Atlas OSM

**Ediție publicată:** v1.0  
**Corpus canonic:** 225 entități `WG_LOC`  
**Sursa istorică de adevăr:** Gustav Weigand, *Rumänen und Aromunen in Bulgarien* (1907).

Acest repository publică ramura **OpenStreetMap / Website** a proiectului. Corpusul semantic este comun cu ramura Google My Maps; coordonatele rămân specifice platformei și nu sunt propagate între MyMaps și OSM.

## Date v1.0

- corpus canonic activ: **225 WG_LOC**;
- MyMaps final: **188 geometrii / 187 poziții**, 37 fără geometrie;
- OSM complet: **163 geometrii / 161 poziții distincte**;
- OSM strict: **157 geometrii / 156 poziții distincte**;
- fără geometrie OSM adoptată: **62 entități**;
- setul strict exclude exact cele 6 cazuri frozen cu reper OSM provizoriu;
- descrierile și citările provin din M6; cele două ramuri au trecut M7 structural parity și M8 QA academic/paritate.

## QA

Milestone 8: **52/52 controale PASS**, **225/225 WG_LOC entity-level PASS**, 0 probleme blocante. Câmpurile semantice comune MyMaps–OSM sunt identice 3.825/3.825. Geometriile sunt neschimbate față de freeze-ul M3.

## Runtime v1.0

`transport-shim.js` reconstruiește din Base64 exact cele patru fluxuri gzip deterministe verificate în M8. `app.js` le decomprimă în browser și oferă descărcările GeoJSON/CSV v1.0.

## Regula de sursă

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → PUBLICARE v1.0**

OpenStreetMap și sursele moderne sunt folosite pentru identificare/geometrie modernă, nu pentru a rescrie informația istorică din Weigand.

Tag-ul GitHub nu este o cerință a proiectului; versiunea v1.0 este identificată prin pachetul M9, manifest, QA și starea publicată în `main`/GitHub Pages.
