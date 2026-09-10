# Gustav Weigand — atlas OpenStreetMap — M4 candidate v0.24

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
`WeigandSection`, `ModernIdentification`, `ModernIDStatus`, `WeigandPages`, `PDFPages`,
`Description`, `Source`, `SemanticStatus`, `SemanticParity`, `GeometryParityStatus`.

Câmpurile OSM sunt platform-specific:
`OSMStatus`, `PointType`, `OSMQuality`, `OSMType`, `OSMID`, `OSMURL`, `OSMSource`,
`DistanceKM_MyMaps_OSM`, `DistanceQAStatus`, `Notes`.

`Source` citează explicit Weigand 1907 cu paginile tipărite și paginile PDF. `OSMSource`
este separat și nu este prezentat ca sursă istorică.

## M5 RC1

Milestone 5 publică acest candidat numai pe ramura `release/v0.24-rc1`; `main` rămâne baseline până la validarea finală. Din cauza limitării conectorului controlat GitHub la fișiere text, fluxurile gzip M4 sunt stocate lossless în `data/transport/` ca Base64 și reconstruite de `transport-shim.js`. QA M5 verifică hash-urile datelor rezultate după reconstrucție și decomprimare.
