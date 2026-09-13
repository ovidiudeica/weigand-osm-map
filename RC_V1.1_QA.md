# v1.1 RC4 — staging QA for 236 WG_LOC

Status: **release candidate / staging only**. This branch does not modify `main` and does not replace the current public v1.0 payloads.

## Canonical input

- canonical successor: **WG_LOC v0.7 VERIFIED/FROZEN**;
- ACTIVE identities: **236**;
- RETIRED identities: **3**;
- reserved IDs through **WG_LOC_0239**;
- public map architecture: **2 layers only** — `Comunitati / Localitati` (164) and `Toponime` (72);
- `Group` is metadata only and is ignored for ordering;
- display order follows the sequence in Weigand 1907, not alphabetic order and not numeric WG_LOC order;
- page-139 red-label audit incorporated: **25/25**;
- page-139 black-label control-network audit incorporated: **87 recorded black labels, 35 modern control points**;
- approved p.139 coordinate refinements applied to **10 WG_LOC**.

## Applied p.139 corrections

The ten corrected records are:

`WG_LOC_0113`, `WG_LOC_0114`, `WG_LOC_0129`, `WG_LOC_0134`, `WG_LOC_0135`, `WG_LOC_0136`, `WG_LOC_0147`, `WG_LOC_0155`, `WG_LOC_0157`, `WG_LOC_0160`.

For these records the Website geometry is explicitly editorial/historical-map derived. Any OSM object/reference ID that belonged only to the former container or rejected candidate has been removed. The same research point may be used in both branches only because the provenance is explicitly `COMMON_HISTORICAL_MAP_RESEARCH_GEOMETRY`; it is not treated as independent confirmation.

Two rejected modern-candidate display names were also removed from the public semantic layer: `WG_LOC_0113` is displayed as **Cincofci**, and `WG_LOC_0147` as **Čerčelát / Cercelat**.

## Runtime reconstruction used by `rc-v1.1.html`

The QA page deliberately reuses the certified v1.0 transport payloads already present on the staging branch and applies the v1.1 delta in the browser. This avoids replacing the current public runtime before promotion.

The staging delta contains the pre-existing geometry/semantic/new-ID patches, the two-layer mapping, Weigand-order table, and the dedicated p.139 patch. `rc-v1.1.js` also overrides baseline geometries for corrected IDs that already existed in the v1.0 full set.

## Required self-checks

`rc-v1.1.js` refuses to mark the staging page ready unless these invariants hold:

- semantic IDs: **236**;
- public layers: **164 + 72**;
- Weigand display order matches the explicit order table;
- full Website layer: **236 geometries / 226 distinct positions**;
- strict native OSM subset: **182 geometries / 175 distinct positions**;
- non-native/editorial Website references: **54**;
- semantic status: **V0.7_VERIFIED_FROZEN**;
- the ten p.139-corrected records are excluded from the strict native-OSM subset.

## Local artifact QA completed

The RC4 build produced from the same v0.7 state passed:

- My Maps: **236/236 rows, 0 without geometry, 232 distinct positions**;
- OSM/Website full: **236/236 rows, 0 without geometry, 226 distinct positions**;
- OSM strict: **182 rows, 175 distinct positions**;
- non-native/editorial Website records: **54**;
- public layers: **164 Comunitati / Localitati + 72 Toponime**;
- display order: **1–164** and **1–72**, unchanged from the verified book-order RC3;
- semantic/order mismatches between branches: **0**;
- stale OSM IDs on the ten corrected p.139 records: **0**;
- spreadsheet formula scan: **0 errors**;
- GeoJSON/CSV structural validation: **PASS**.

## Pull-request scope QA

PR #16 changes only staging/QA files (`rc-v1.1-*` and this QA document). It does **not** modify `index.html`, `app.js`, the existing v1.0 payload files, or `main`.

## Remaining promotion gate

Do **not** merge to `main` yet. Two external/manual checks remain:

1. visually inspect the standalone `rc-v1.1.html` map, especially representative exact-modern, editorial-reference, shared-position and p.139-derived records;
2. import the two RC4 My Maps CSV layers into a greenfield My Maps map and confirm **164 + 72 = 236** rows in preserved Weigand order.

Only after those two checks should the public runtime assets be promoted in a separate controlled commit/PR.
