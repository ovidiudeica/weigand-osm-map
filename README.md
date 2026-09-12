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

După M9, stratul de publicare a fost regenerat pentru a elimina metadatele specifice digitizării externe și legăturile de stocare din fișierele publice. Această operație nu modifică `WG_LOC`, `WeigandPages`, identificările moderne, geometriile OSM sau coordonatele. Din acest motiv, hash-urile payload-urilor publice curente diferă de baseline-ul M9.

**Sursa de adevăr pentru hash-urile fișierelor publice curente este `PUBLICATION_MANIFEST.csv`.** `M5_MANIFEST.csv` și `M9_MANIFEST.csv` sunt păstrate ca evidențe istorice ale milestone-urilor respective și nu trebuie folosite pentru verificarea payload-urilor curente.

## Runtime v1.0

`transport-shim.js` reconstruiește din Base64 cele patru fluxuri publice curente. `app.js` le decomprimă în browser și oferă descărcările GeoJSON/CSV v1.0. În `data/transport/` sunt păstrate numai fragmentele utilizate de runtime-ul public curent; fragmentele istorice neutilizate au fost eliminate din starea curentă a publicației.

## Regula de sursă

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → PUBLICARE v1.0**

În publicația publică, citarea Weigand folosește numai pagina tipărită (`WeigandPages`, de exemplu `p. 57`) și referința bibliografică normală. OpenStreetMap și sursele moderne sunt folosite pentru identificare/geometrie modernă, nu pentru a rescrie informația istorică din Weigand.

Tag-ul GitHub nu este o cerință a proiectului; versiunea v1.0 este identificată prin pachetul M9, QA, starea publicată în `main`/GitHub Pages și manifestul publicației curente.
