# Gustav Weigand — atlas OpenStreetMap — M4 candidate v0.24

> **Notă de stare:** acest document descrie milestone-ul istoric M4/M5. Referințele la transport din secțiunea M5 RC1 descriu starea acelui milestone, nu fișierele publice curente din `main`. Pentru integritatea publicației curente se folosește `PUBLICATION_MANIFEST.csv`.

Pachet de publicare candidat generat din `Weigand_Gustav_MASTER_v0.24_M3_COORDINATE_FROZEN_CANDIDATE_2026-09-10.xlsx`.

## Regulă metodologică

Corpusul semantic este comun ramurilor MyMaps și OSM/Website. Coordonatele sunt separate:
- MyMaps folosește numai coordonatele MyMaps înghețate în M3;
- OSM/Website folosește numai geometriile OSM/reper înghețate în M3;
- absența geometriei este păstrată explicit; nu se inventează coordonate.

## Corpus și geometrii

- Corpus canonic activ: **225 WG_LOC**.
- OSM full: **163 geometrii**, **161 poziții distincte**.
- OSM strict: **157 geometrii**, **156 poziții distincte**.
- Fără geometrie OSM: **62**.
- Setul strict exclude exact cele **6** cazuri `OSM_PROVISIONAL_REPER`.
- Poziții comune în setul full:
  - `WG_LOC_0059` + `WG_LOC_0060`;
  - `WG_LOC_0109` + `WG_LOC_0214`.
- În strict rămâne numai poziția comună `WG_LOC_0059` + `WG_LOC_0060`.

## Schema principală

Câmpurile istorice/semantice sunt identice cu ramura MyMaps:
`ID`, `Name`, `WeigandName`, `Aliases`, `Layer`, `ObjectType`, `HistoricalAdmin`,
`WeigandSection`, `ModernIdentification`, `ModernIDStatus`, `WeigandPages`,
`Description`, `Source`, `SemanticStatus`, `SemanticParity`, `GeometryParityStatus`.

Câmpurile OSM sunt platform-specific:
`OSMStatus`, `PointType`, `OSMQuality`, `OSMType`, `OSMID`, `OSMURL`, `OSMSource`,
`DistanceKM_MyMaps_OSM`, `DistanceQAStatus`, `Notes`.

`Source` citează explicit Weigand 1907 cu paginile tipărite. `OSMSource`
este separat și nu este prezentat ca sursă istorică.

## M5 RC1

La milestone-ul M5, candidatul a fost publicat pe ramura `release/v0.24-rc1`, iar fluxurile gzip M4 au fost stocate lossless ca Base64 pentru transport. `M5_MANIFEST.csv` păstrează hash-urile istorice ale acelui candidat. Fragmentele M4 neutilizate de runtime-ul v1.0 au fost ulterior eliminate din starea curentă a `main`; manifestul M5 rămâne numai evidență de audit a milestone-ului.
