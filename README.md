# Gustav Weigand — atlas OpenStreetMap

Interfață cartografică statică pentru **„Rumänen und Aromunen in Bulgarien” (1907)**, varianta OpenStreetMap, **v0.22**.

**Site live:** https://ovidiudeica.github.io/weigand-osm-map/

Interfața este construită cu HTML, CSS și JavaScript, fără framework și fără proces de build. Harta folosește [Leaflet 1.9.4](https://leafletjs.com/) și fundal OpenStreetMap.

> **Regulă metodologică:** ramura OSM este separată de ramura MYMAPS/master. O coordonată OSM nu înlocuiește automat coordonata de cercetare.

## Starea publicată — v0.22

Datele cartografice reale sunt integrate și publicate în repository.

- **Total entități OSM procesate:** 146/146.
- **Set complet:** 142 geometrii OSM/reper documentate, reprezentate în **140 poziții cartografice distincte**.
- **Set strict:** 136 geometrii, reprezentate în **135 poziții cartografice distincte**; exclude cele 6 cazuri cu statut `reper OSM indirect / obiect de verificat`.
- **Fără geometrie OSM:** 4 cazuri confirmate în cercetare, păstrate separat și fără coordonate OSM inventate.

Cele patru cazuri fără obiect OSM distinct rămân în fișierul de audit CSV. Coordonatele master, acolo unde sunt prezente ca referință, **nu sunt tratate ca `lat_osm` / `lon_osm`**.

Diferența dintre numărul de geometrii și numărul de poziții vizuale este intenționată și provine din entități de cercetare care folosesc aceeași poziție OSM/reper. Interfața nu mai ascunde aceste cazuri: pozițiile comune sunt afișate printr-un **marcator compus cu numărul înregistrărilor** și un popup care prezintă separat fiecare entitate.

## Poziții suprapuse

În setul complet există două poziții comune:

- **WG_LOC_0059 — Zlatiya** și **WG_LOC_0060 — Zlatiya** folosesc același obiect OSM, `node 273879682`. Sunt două entități de cercetare distincte și nu sunt deduplicate.
- **WG_LOC_0214 — Botevgrad** și **WG_LOC_0109 — Bukor** au aceeași poziție cartografică în ramura OSM; Bukor are statut `reper OSM indirect / obiect de verificat`.

În setul strict, Bukor este exclus prin regula metodologică a celor 6 repere indirecte, astfel încât rămâne o singură poziție suprapusă: perechea Zlatiya. De aceea setul strict are 136 geometrii și 135 poziții distincte.

## Structura repository-ului

```text
weigand-osm-map/
├── index.html
├── styles.css
├── app.js
├── README.md
├── .nojekyll
└── data/
    ├── weigand-osm-v0.22.geojson
    ├── weigand-osm-v0.22-strict.geojson
    └── weigand-osm-v0.22-no-geometry.csv
```

## Fișiere de date

### `data/weigand-osm-v0.22.geojson`

Setul cartografic complet, cu **142** geometrii. Include obiecte OSM verificate direct, repere directe, obiecte recuperate indirect și cele 6 repere indirecte documentate metodologic.

### `data/weigand-osm-v0.22-strict.geojson`

Setul cartografic strict, cu **136** geometrii. Exclude cele 6 cazuri cu statut:

`reper OSM indirect / obiect de verificat`

Acest set este recomandat atunci când se dorește o reprezentare cartografică mai conservatoare.

### `data/weigand-osm-v0.22-no-geometry.csv`

Conține **4** cazuri confirmate, dar fără obiect OSM distinct suficient de sigur. Aceste cazuri nu sunt transformate artificial în puncte OSM.

## Schema utilizată de interfață

Interfața citește explicit câmpurile reale ale setului publicat:

| Informație | Câmp |
| --- | --- |
| Nume | `Name` |
| Identificator de cercetare | `ID` |
| Strat | `Layer` |
| Descriere | `Description` |
| Statut OSM | `OSMStatus` |
| Tip punct | `PointType` |
| Tip obiect OSM | `OSMType` |
| ID obiect OSM | `OSMID` |
| URL obiect OSM | `OSMURL` |
| Sursă | `Source` |
| Note | `Notes` |

`app.js` păstrează și câteva aliasuri pentru robustețe, dar datele publicate folosesc schema de mai sus.

## Straturi

Cele cinci straturi cartografice sunt:

1. `Romani / dacoromani`
2. `Aromani`
3. `Mixt romani-aromani`
4. `Toponime`
5. `Localizari cu avertisment`

Interfața permite activarea/dezactivarea independentă a straturilor.

## Funcționalități

Site-ul public oferă:

- comutare între setul **Complet (142 geometrii / 140 poziții)** și **Strict (136 geometrii / 135 poziții)**;
- marcatori compuși pentru pozițiile care conțin mai multe entități de cercetare, fără deplasarea coordonatelor;
- popup comun care prezintă separat toate înregistrările aflate la aceeași poziție;
- filtrare pe cele 5 straturi;
- căutare după nume, identificator `WG_LOC` / `ID`, descriere, statut și note;
- listă de rezultate sincronizată cu harta;
- indicarea `poziție comună ×N` în listă pentru înregistrările suprapuse;
- afișarea simultană a numărului de rezultate și a numărului de poziții cartografice distincte;
- opțiunea „Doar în zona vizibilă a hărții”;
- zoom și deschiderea popup-ului la selectarea unui rezultat;
- popup cu ID, strat, statut OSM, tip punct, tip/ID obiect OSM, URL OSM, descriere, surse și note;
- link direct către obiectul OpenStreetMap când acesta este documentat;
- descărcarea seturilor GeoJSON complet și strict;
- dialog separat pentru cele 4 cazuri fără geometrie OSM.

## Validare v0.22

La publicarea datelor reale și la corecția reprezentării suprapunerilor au fost confirmate:

- **146/146** entități OSM procesate;
- **142** geometrii și **140** poziții distincte în setul complet;
- **136** geometrii și **135** poziții distincte în setul strict;
- **4** cazuri în CSV-ul fără geometrie;
- geometrii și coordonate valide pentru interfața Leaflet;
- toate cele 5 valori de strat recunoscute;
- detectarea automată a pozițiilor identice fără modificarea datelor-sursă;
- căutarea, filtrele, popup-urile, linkurile OSM, tile-urile și descărcările funcționale;
- sintaxa JavaScript validată după modificarea logicii de suprapunere.

## Utilizare locală

Din rădăcina repository-ului:

```bash
python -m http.server 8000
```

Apoi deschideți:

```text
http://localhost:8000
```

Deschiderea directă prin `file://` poate bloca `fetch()` pentru fișierele de date. Este necesară conexiune la internet pentru Leaflet și dalele OpenStreetMap.

## GitHub Pages

Site-ul este publicat prin GitHub Pages din ramura `main`, rădăcina repository-ului:

https://ovidiudeica.github.io/weigand-osm-map/

Repository-ul sursă este:

https://github.com/ovidiudeica/weigand-osm-map

## Atribuire și limite de utilizare

[© OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

Pentru dalele standard OpenStreetMap trebuie respectată [politica de utilizare a tile-urilor](https://operations.osmfoundation.org/policies/tiles/). Interfața folosește dalele pentru vizualizare interactivă și nu implementează preîncărcare offline.

Interfața este pentru **vizualizare cartografică și cercetare**. Nu este un instrument pentru bulk upload în baza de date OpenStreetMap și nu conține funcții de editare OSM.

Interpretările istorice, identificările de cercetare și coordonatele ramurii master/MYMAPS nu devin automat date actuale OpenStreetMap. Proveniența și statutul fiecărui punct trebuie citite împreună cu câmpurile de audit din setul publicat.
