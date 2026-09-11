# M9 v1.0 release QA

Pre-publication QA: **32/32 PASS**, 0 FAIL.

Upstream gate: M8 VERIFIED/FROZEN — 52/52 PASS, 225/225 entity audit PASS.

Final v1.0 payloads are byte-identical to the M7 payloads certified by M8; M9 changes only release filenames/runtime references and packaging. MyMaps and OSM coordinates remain independent and unchanged.

Counts:
- MyMaps semantic 225; importable 188 / 187 positions; no geometry 37.
- OSM semantic 225; full 163 / 161 positions; strict 157 / 156 positions; no geometry 62.
