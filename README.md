# Gustav Weigand — Rumänen und Aromunen in Bulgarien — Atlas OSM — DRAFT

**Statut editorial:** **DRAFT / work in progress**  
**Versiune tehnică curentă:** v1.5  
**Corpus canonic:** 236 entități `WG_LOC`  
**Sursa istorică de adevăr:** Gustav Weigand, *Rumänen und Aromunen in Bulgarien* (1907).

> Acest repository este un spațiu public de cercetare și lucru. Nu reprezintă o ediție științifică/digitală finală. Conținutul, identificările și prezentarea pot fi revizuite pe măsură ce auditul documentar continuă.

Repository-ul găzduiește ramura **OpenStreetMap / Website** a proiectului. Corpusul semantic este comun cu ramura Google My Maps; coordonatele și geometriile rămân specifice platformei, iar proveniența lor este documentată separat. Numerele de versiune, tagurile și eventualele GitHub Releases trebuie interpretate ca **snapshot-uri de cercetare**, nu ca declarații de finalitate editorială.

## Starea tehnică v1.5

- corpus canonic activ: **236 WG_LOC**;
- geometrii în setul complet: **236**, în **226 poziții distincte**;
- set strict OSM: **184 geometrii**, în **177 poziții distincte**;
- entități explicit nemarcabile prin evidență: **0**;
- model tehnic: **236 corpus / 236 mapped / 0 explicit unmarked**;
- `WG_LOC_0236` **Kostel** este mapat prin obiectul OSM nativ verificat, cu proveniența modernă păstrată separat de afirmația istorică;
- `WG_LOC_0139` este identificat modern ca **Stargel, Gorna Malina, Sofia, Bulgaria**, fără schimbare de coordonate sau geometrie.

## Ce înseamnă „strict” și „complet”

**Complet** include toate geometriile publicabile în starea curentă a cercetării: obiecte OSM native, referințe/fallback-uri explicite și geometrii editoriale/de cercetare etichetate ca atare.

**Strict** include numai rândurile finale cu `StrictNative=YES`.

`WG_LOC_0236` Kostel este inclus în setul complet și în setul strict pe baza obiectului OSM nativ verificat. Această localizare modernă rămâne distinctă de afirmația istorică din Weigand 1907 și nu este prezentată ca dovadă automată a poziției istorice exacte.

## Statut editorial și QA

v1.5 este o **versiune tehnică verificată într-un proiect aflat încă în DRAFT**. Verificările tehnice includ sincronizarea corpusului, round-trip Google My Maps, reconstrucția payload-urilor, regresia numărătorilor și smoke-test-ul public GitHub Pages.

Aceste verificări nu transformă proiectul într-o ediție finală și nu afirmă că toate cele 236 de localizări istorice sunt cunoscute cu precizie exactă. Identitatea istorică, identificarea modernă, geometriile native, reperele de referință, punctele de cercetare și excepțiile nemarcabile rămân diferențiate.

## Runtime v1.5

Runtime-ul curent folosește transportul versionat v1.5:

- `transport-shim-v15.js` reconstruiește deterministic fluxurile gzip v1.5 din fragmentele Base64 din `data/transport-v15/`;
- `app-v15.js` pornește runtime-ul atlasului și aplică substituțiile validate pentru căile/count-urile v1.5 și clasificarea tematică pe `Group`;
- payload-urile virtuale sunt `data/weigand-osm-v1.5.geojson.gz`, `data/weigand-osm-v1.5-strict.geojson.gz`, `data/weigand-osm-v1.5-no-geometry.csv.gz` și `data/weigand-osm-v1.5-semantic-236.csv.gz`.

Fișierele și runtime-urile versiunilor anterioare sunt păstrate în repository pentru trasabilitate și audit și nu reprezintă starea tehnică curentă a paginii.

## Regula de sursă

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → RAMURI SINCRONIZATE MY MAPS / OSM-WEBSITE**

Weigand 1907 rămâne autoritatea istorică și semantică. OpenStreetMap și alte surse moderne sunt folosite pentru identificare și geometrie modernă, fără a rescrie afirmația istorică și fără a transforma automat un obiect modern într-o dovadă a localizării istorice exacte.

Hash-urile payload-urilor tehnice curente sunt în `PUBLICATION_MANIFEST.csv`. Denumirea istorică a fișierului nu schimbă statutul editorial de **DRAFT / work in progress** al proiectului.
