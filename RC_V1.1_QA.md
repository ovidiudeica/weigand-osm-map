# v1.1 RC — staging QA for 236 WG_LOC

Status: **release candidate / staging only**. This branch does not modify `main` and does not replace the current public v1.0 payloads.

## Canonical input

- canonical successor: **WG_LOC v0.6 VERIFIED/FROZEN**;
- ACTIVE identities: **236**;
- RETIRED identities: **3**;
- reserved IDs through **WG_LOC_0239**;
- page-139 red-label audit incorporated: **25/25**;
- 32-case localization audit integrated into the canonical modern-identification layer.

## Runtime reconstruction used by `rc-v1.1.html`

The QA page deliberately reuses the certified v1.0 transport payloads already present on the staging branch and applies the v1.1 delta in the browser. This avoids replacing the public payload files before review.

The delta contains:

- geometry for the **62** pre-existing WG_LOC that had no v1.0 Website/OSM geometry;
- **59** existing-record semantic field overrides needed by v0.6;
- **11** new canonical records, `WG_LOC_0229`–`WG_LOC_0239`;
- **31** additions to the strict set with a native OSM object/reference.

## Required self-checks

`rc-v1.1.js` refuses to mark the staging page ready unless all of these invariants hold:

- semantic IDs: **236**;
- full Website layer: **236 geometries / 219 distinct positions**;
- strict OSM subset: **188 geometries / 175 distinct positions**;
- semantic parity: generated from the same v0.6 semantic state;
- non-native/editorial Website references in the release-candidate build: **48**.

Transferred coordinates retain explicit transfer/reference provenance. A transferred point is not treated as independent confirmation and a Website editorial point is not presented as a native OSM object.

## Local artifact QA already completed

The release-candidate build produced from the same v0.6 source passed:

- My Maps: **236/236 rows, 0 without geometry, 227 distinct positions**;
- OSM/Website full: **236/236 rows, 0 without geometry, 219 distinct positions**;
- OSM strict: **188 rows, 175 distinct positions**;
- semantic mismatches between branches: **0**;
- spreadsheet formula scan: **0 errors**;
- GeoJSON/CSV structural validation: **PASS**.

## Promotion gate

Do **not** replace `index.html`, `app.js`, the v1.0 payloads, or merge to `main` until the standalone RC page has been visually checked for representative exact, reference, shared-position and historical-map-derived cases. After that review, the final v1.1 payloads can replace the v1.0 runtime assets in a separate promotion commit/PR.
