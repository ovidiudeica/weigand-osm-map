# Gustav Weigand — Rumänen und Aromunen in Bulgarien — Atlas OSM — DRAFT

**Statut editorial:** **DRAFT / work in progress**  
**Versiune tehnică curentă a interfeței:** **DRAFT v1.6**  
**Versiune a datelor geografice publice:** **v1.5 (păstrate neschimbate)**  
**Corpus canonic:** 236 entități `WG_LOC`  
**Sursa istorică de adevăr:** Gustav Weigand, *Rumänen und Aromunen in Bulgarien* (1907).

> Acest repository este un spațiu public de cercetare și lucru. Nu reprezintă o ediție științifică/digitală finală. Conținutul, identificările și prezentarea pot fi revizuite pe măsură ce auditul documentar continuă.

Repository-ul găzduiește ramura **OpenStreetMap / Website** a proiectului. Corpusul semantic este comun cu ramura Google My Maps; coordonatele și geometriile rămân specifice platformei, iar proveniența lor este documentată separat. Numerele de versiune, tagurile și eventualele GitHub Releases trebuie interpretate ca **snapshot-uri de cercetare**, nu ca declarații de finalitate editorială.

## Starea tehnică a Website-ului DRAFT v1.6 și a datelor v1.5

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

Website-ul v1.6 este o **interfață tehnică verificată într-un proiect aflat încă în DRAFT**, folosind payload-urile geografice v1.5 protejate. Verificările tehnice includ sincronizarea corpusului, round-trip Google My Maps, reconstrucția payload-urilor, regresia numărătorilor și smoke-test-ul public GitHub Pages.

Aceste verificări nu transformă proiectul într-o ediție finală și nu afirmă că toate cele 236 de localizări istorice sunt cunoscute cu precizie exactă. Identitatea istorică, identificarea modernă, geometriile native, reperele de referință, punctele de cercetare și excepțiile nemarcabile rămân diferențiate.

## Runtime DRAFT v1.6; transport și date geografice v1.5

Interfața activă este `index.html` → `app-v16.js` → `app.js` (runtime legacy protejat). `app-v16.js` validează proiecția editorială `data/weigand-public-order-v1.0.json` înainte de încărcarea atlasului. Ierarhia Explorer urmează **Capitol → Sublistă → apariție în ordinea Weigand**, cu **266 apariții documentate** pentru **236 entități canonice WG_LOC** și **un slot contextual Vadin (Cap. 4, p. 50), ne-selectabil și fără WG_LOC propriu**. Aparițiile multiple selectează întotdeauna aceeași entitate canonică. Căutarea, filtrarea și restrângerea la viewport nu reordonează aparițiile rămase.

Paleta markerelor OSM Standard este: **Români/Dacoromâni — albastru `#2F95ED`; Aromâni — roșu `#F25752`; Români + Aromâni — violet `#A66BE8`; Toponime — galben intens `#FFD400`**; contur ivory `#FFF8E7`. Pentru prezentarea vizuală, toate cele patru categorii sunt reprezentate prin **buline colorate**, inclusiv **toponimele galbene**; aceeași formă este utilizată în legendă, filtre și lista de rezultate. Pozițiile OSM partajate sunt afișate prin **o singură bulină**: culoare simplă pentru aceeași categorie sau două semicercuri colorate, separate de o linie ivory fină pentru categorii diferite. Clickul deschide fișele WG_LOC individuale, ordonate după prima apariție în Weigand. Geometriile și coordonatele canonice nu se modifică. Datele geografice v1.5 și ordinea editorială nu sunt modificate. Harta publică utilizează numai basemap-ul OpenStreetMap Standard / OSM Carto, cu atribuire vizibilă.

Datele descărcabile **nu au fost reconstruite pentru v1.6**:
- `transport-shim-v15.js` reconstruiește determinist fluxurile gzip v1.5 din fragmentele Base64 din `data/transport-v15/`;
- setul **Complet v1.5**: 236 geometrii / 226 poziții distincte;
- setul **Strict v1.5**: 184 geometrii / 177 poziții distincte;
- registrul **noGeometry v1.5**: 0; registrul **semantic v1.5**: 236;
- payload-urile virtuale protejate sunt `data/weigand-osm-v1.5.geojson.gz`, `data/weigand-osm-v1.5-strict.geojson.gz`, `data/weigand-osm-v1.5-no-geometry.csv.gz` și `data/weigand-osm-v1.5-semantic-236.csv.gz`.

**Limită editorială explicită:** corpusul canonic v0.17 a reconciliat metadate de secțiune și pagini pentru 15 WG_LOC, dar aceste corecții **nu au fost republicate** în descărcările Full/Strict/Semantic v1.5. Proiecția de ordine derivată v1.0 și interfața v1.6 nu echivalează cu un export nou al corpusului. O republicare a acelor metadate necesită controlul separat `DATA_PAYLOAD`.

`PUBLICATION_MANIFEST.csv` rămâne manifestul autoritativ al payload-urilor geografice v1.5. `V16_RELEASE_MANIFEST.csv` înregistrează resursele UI v1.6 măsurate public și face trimitere explicită la fluxurile geografice v1.5. `V16_RELEASE_QA.md` păstrează dovezile și limitele gate-ului documentar. În interfața existentă, textul din dialogul „Despre atlas” care menționează v1.5 descrie payload-ul geografic moștenit; modificarea HTML-ului nu intră în CC-0008. Nu există încă autorizare de tag sau GitHub Release v1.6.

Fișierele și runtime-urile versiunilor anterioare sunt păstrate în repository pentru trasabilitate și audit și nu reprezintă starea tehnică curentă a paginii.

## Regula de sursă

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → RAMURI SINCRONIZATE MY MAPS / OSM-WEBSITE**

Weigand 1907 rămâne autoritatea istorică și semantică. OpenStreetMap și alte surse moderne sunt folosite pentru identificare și geometrie modernă, fără a rescrie afirmația istorică și fără a transforma automat un obiect modern într-o dovadă a localizării istorice exacte.

Hash-urile payload-urilor tehnice curente sunt în `PUBLICATION_MANIFEST.csv`. Denumirea istorică a fișierului nu schimbă statutul editorial de **DRAFT / work in progress** al proiectului.

### Referințe bibliografice afișate în website

Interfața v1.6 afișează exclusiv paginile tipărite ale cărții Weigand 1907, cu `p.` / `pp.`. Apariția `WG_APP_0266` / `WG_LOC_0229` (Vlasi) de pe planșa atașată fără pagină proprie este citată ca „Planșa: Alte Rumänische Ortsnamen bei Sofia”. Paginile PDF se păstrează numai în proiecția editorială internă pentru audit și nu apar în lista rezultatelor sau în fișe. Această regulă modifică numai afișarea și documentația, nu corpusul, ordinea sau geometriile v1.5.

**Corecție de afișare:** și câmpurile publice din fișa principală, citarea „Weigand 1907”, secțiunea tehnică și textele asociate utilizează referințe fără `PDF p.` / `PDF pp.`. Valoarea publică a `WeigandPages` este derivată din aparițiile editoriale și afișează `p.` / `pp.` tipărite sau titlul planșei pentru `WG_LOC_0229`. Datele-sursă și exporturile v1.5 sunt nemodificate.

**Coordonate în fișă:** „Date tehnice și QA” afișează latitudinea și longitudinea (grade zecimale) preluate direct din `feature.geometry.coordinates` al GeoJSON-ului OSM v1.5 pentru înregistrarea `WG_LOC` selectată. Ordinea GeoJSON `[longitudine, latitudine]` este inversată numai la etichetare. Nu se recalculează sau rotunjesc coordonatele; pentru poziții partajate, fiecare fișă folosește propria geometrie. Datele și exporturile rămân nemodificate.

**Afișare Sursă Weigand:** atât citarea publică, cât și câmpul din „Date tehnice și QA” omit linkurile către fișierul digitalizat (inclusiv linkul Google Drive), păstrând referința bibliografică. Valorile-sursă v1.5 nu se modifică.
