# Gustav Weigand — atlas OpenStreetMap

Interfață cartografică statică pentru **„Rumänen und Aromunen in Bulgarien” (1907)**, varianta OpenStreetMap, v0.22. HTML, CSS și JavaScript fără framework și fără build; [Leaflet 1.9.4](https://leafletjs.com/examples/quick-start/) este încărcat din CDN, iar fundalul folosește OpenStreetMap.

> Ramura OSM este separată de ramura MYMAPS/master. O coordonată OSM nu înlocuiește automat coordonata de cercetare.

**Starea datelor:** cele trei fișiere reale nu erau disponibile în mediul de lucru la pregătirea interfeței. Nu sunt incluse geometrii, localități sau înregistrări fictive. Fișierele reale vor fi încărcate separat și verificate înainte de publicarea finală. Un eventual site Pages publicat între timp este doar interfața în așteptarea datelor.

## Seturile v0.22

- **Complet:** 142 geometrii așteptate.
- **Strict:** 136 geometrii așteptate, cu 6 mai puține decât setul complet. Interfața încarcă fișierul strict separat; nu elimină automat înregistrări după o regulă presupusă. Criteriile exacte și identitățile celor șase excluderi trebuie confirmate din datele reale și documentația de cercetare.
- **Fără geometrie:** 4 cazuri fără obiect OSM distinct, păstrate în CSV și într-un dialog separat. Nu se atribuie coordonate de substituție.

Numerele din selector sunt așteptate; starea și lista arată numărul efectiv încărcat. Un set cu număr greșit, geometrii invalide sau straturi necunoscute este refuzat explicit.

## Structură

```text
weigand-osm-map/
├── index.html
├── styles.css
├── app.js
├── README.md
├── .nojekyll
└── data/
    ├── README.md
    ├── weigand-osm-v0.22.geojson             # de încărcat
    ├── weigand-osm-v0.22-strict.geojson      # de încărcat
    └── weigand-osm-v0.22-no-geometry.csv     # de încărcat
```

`data/README.md` păstrează folderul în Git, fără fișiere GeoJSON/CSV goale care ar putea fi confundate cu datele originale.

## Integrarea datelor reale

Păstrați fișierele originale în UTF-8 și numele exacte de mai sus. Ambele GeoJSON trebuie să fie `FeatureCollection`, cu geometrie nenulă în fiecare `Feature`; coordonatele GeoJSON sunt în ordinea longitudine, latitudine (WGS84). Verificați proveniența, corectitudinea, drepturile de republicare și relația complet/strict înainte de publicarea finală.

Schema surselor nu este încă disponibilă. Adaptorul `FIELDS` din `app.js` acceptă explicit:

| Informație | Câmpuri acceptate, în ordinea priorității |
| --- | --- |
| Nume | `name`, `nume`, `Name`, `localitate`, `toponim` |
| Identificator | `WG_LOC`, `ID`, `id` |
| Strat | `strat`, `Strat`, `layer`, `Layer` |
| Descriere | `description`, `descriere`, `Description` |
| Surse | `sources`, `surse`, `Sources`, `source` |
| Metadate OSM | `OSMStatus`, `PointType`, `OSMType`, `OSMID` |

Valorile de strat acceptate sunt `Romani / dacoromani` (și `Romani`, `dacoromani`), `Aromani`, `Mixt romani-aromani`, `Toponime`, `Localizari cu avertisment`. Compararea ignoră majusculele și diacriticele. Acesta este un contract de integrare propus, nu o afirmație despre schema fișierelor absente. Dacă schema reală diferă, actualizați `FIELDS` și aliasurile `LAYERS` fără a modifica sau deduce clasificări istorice. Avertismentele nu sunt deduse automat din OSMStatus.

Linkul OSM se construiește numai pentru `OSMType` egal cu `node`, `way` sau `relation` și un `OSMID` întreg pozitiv. Textul surselor și descrierilor este redat ca text, fără executarea HTML-ului din fișiere. Pentru ID-uri foarte mari folosiți valori JSON de tip șir.

CSV-ul necesită antet unic și patru rânduri de date; suportă separator virgulă sau punct și virgulă, câmpuri între ghilimele, ghilimele escapate și linii multiple. Toate coloanele originale sunt disponibile în dialog, inclusiv cele neincluse în adaptor.

## Utilizare

Căutați după nume sau ID, selectați straturile și setul Complet/Strict. Lista și harta folosesc aceleași filtre. Opțiunea „Doar în zona vizibilă” restrânge lista la extinderea curentă; deplasarea hărții actualizează lista. Selectarea unui rezultat centrează harta și deschide popup-ul; deschiderea unui popup evidențiază rezultatul. Descărcarea unui set devine disponibilă după selectarea și validarea lui.

Pentru previzualizare locală, rulați din rădăcina repository-ului `python -m http.server 8000`, apoi deschideți `http://localhost:8000`. Deschiderea directă prin `file://` poate bloca încărcarea datelor. Este necesară conexiune la internet pentru Leaflet și dalele OSM.

## GitHub Pages

În repository: **Settings → Pages → Deploy from a branch → main → / (root) → Save**. Sursa este rădăcina ramurii `main`; `.nojekyll` permite servirea directă a fișierelor statice. Consultați [documentația GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

URL-ul preconizat după activare este `https://ovidiudeica.github.io/weigand-osm-map/`. Prezența acestui URL în documentație nu confirmă activarea serviciului.

## Verificări înainte de publicarea finală

1. Adăugați cele trei fișiere reale și confirmați adaptorul de câmpuri/straturi.
2. Verificați JavaScript: `node --check app.js`.
3. Validați JSON: `python -m json.tool data/weigand-osm-v0.22.geojson` și `python -m json.tool data/weigand-osm-v0.22-strict.geojson`.
4. În browser verificați 142/136 geometrii, cele cinci straturi, căutarea, sincronizarea listei, popup-urile, linkurile OSM, descărcările și cele 4 înregistrări CSV, pe desktop și mobil.
5. Confirmați că fișierul strict este subsetul metodologic corect al celui complet; numărul de elemente singur nu demonstrează corectitudinea cercetării.

## Atribuire și limite de utilizare

[© OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Respectați [politica de utilizare a dalelor OSM](https://operations.osmfoundation.org/policies/tiles/). Interfața solicită numai dalele pentru vizualizarea interactivă, fără preîncărcare offline.

Interfața este pentru **vizualizare cartografică și NU pentru bulk upload în baza de date OpenStreetMap**. Nu conține mecanisme de editare sau upload în OSM. Interpretările istorice nu constituie automat date actuale pentru OSM. Licența și proveniența fișierelor de cercetare trebuie documentate la integrarea lor; atribuirea OSM nu acordă automat drepturi asupra altor surse.
