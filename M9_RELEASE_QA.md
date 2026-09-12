# M9 v1.0 release QA — baseline istoric

La milestone-ul M9, QA de pre-publicare a fost **32/32 PASS**, 0 FAIL.

Upstream gate la acel moment: M8 VERIFIED/FROZEN — 52/52 PASS, 225/225 entity audit PASS.

## Baseline M9

Payload-urile M9 inițiale erau byte-identical cu payload-urile M7 certificate de M8; `M9_MANIFEST.csv` păstrează dimensiunile și hash-urile acelui baseline istoric.

După M9, stratul public a fost regenerat pentru eliminarea metadatelor specifice digitizării externe și a legăturilor de stocare. Din acest motiv, payload-urile publice curente **nu mai sunt byte-identical cu baseline-ul M9**, iar hash-urile din `M9_MANIFEST.csv` **nu trebuie folosite pentru verificarea fișierelor publice curente**.

Sursa de adevăr pentru dimensiunile și hash-urile publicației curente este `PUBLICATION_MANIFEST.csv`.

Operația post-M9 nu modifică `WG_LOC`, `WeigandPages`, identificările moderne, geometriile sau coordonatele OSM.

## Counts păstrate

- MyMaps semantic 225; importable 188 / 187 positions; no geometry 37.
- OSM semantic 225; full 163 / 161 positions; strict 157 / 156 positions; no geometry 62.
