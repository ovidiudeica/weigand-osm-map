# v1.6 — Release QA snapshot (pre-merge documentation candidate)

**Editorial status:** DRAFT / work in progress; research snapshot, not a final scholarly or digital edition.  
**Change control:** CC-0008, DOCUMENTATION only.  
**Audit date:** 2026-09-19.  
**Frozen incoming main:** `5d2ecbcd6888ebad6f2729e4387d8f75bca549f3` (CC-0007 PR #26 merge).  
**Interim documentation branch candidate (before adding this QA file):** `3bbfb8f07b4f71b1b9c67563907a0d8af87436c8`.  
**Final v1.6 tag candidate:** NOT YET ASSIGNED. The QA-file commit changes the branch head; an authorized documentation PR merge will change `main` again. Freeze and independently verify that *post-merge* `main` SHA before seeking separate tag/release authorization.

## Scope and exact file allowance

Only `README.md` is updated; `V16_RELEASE_MANIFEST.csv` and `V16_RELEASE_QA.md` are added. `PUBLICATION_MANIFEST.csv`, `index.html`, `app.js`, `app-v16.js`, `styles.css`, `transport-shim-v15.js`, `data/transport-v15/`, all geographic payloads and all WG_LOC semantics, coordinates and geometry remain protected. CC-0008 does **not** authorize a tag, GitHub Release, release promotion or manual deployment.

## Source of audit evidence

- CC-0007 controlled merge PASS: https://docs.google.com/document/d/1kPuZItM3qbBoFnY9DDFLDkJdP52DXb-mq4M9cDZtgg4/edit
- Independent post-implementation verification: https://docs.google.com/document/d/1mRzRdF9FNWXRO1e8V8pmOXOLcH1QzIHgitvk55hZVW0/edit
- Read-only public v1.6 release-readiness and HTTP-hash audit: https://docs.google.com/document/d/1ts-72Je767l3PaAuR0s2SKLP01r3SQwGCY4gizf0qdc/edit
- Release-documentation contract: https://docs.google.com/document/d/1GzTDfNY8P_OBi-E4leRaWxU63NzYly4Pn5BAfjoCzPM/edit
- Legacy payload manifest: `PUBLICATION_MANIFEST.csv` at frozen v1.5 tag `cbb22365ee7930329a0f0aa2ccc32a31f3ef13ac`.

## Public runtime audit: PASS (not a new data build)

At the time of the read-only public audit, GitHub Pages already served `index.html` as **DRAFT v1.6**. Browser/CDP testing against the public URL passed **17/17 core checks and 8/8 supplemental checks**: desktop/mobile loading; six chapter containers and fourteen sublists; 266 linked editorial appearances across 236 canonical WG_LOC; one unbound, non-selectable contextual “Vadin” (Chapter 4, p. 50); Belovo in Chapter 1 / Rhodopes / p. 16; multi-appearance detail; thematic and viewport survivor-order stability; map/list/detail synchronization; shared-position chooser; no horizontal overflow; rendered blue `#1F5A8A`, red `#A63D32`, violet `#6C4A8B` and ochre `#8C5A08`, with ivory `#FFF8E7` casing; and visible © OpenStreetMap contributors attribution.

Full: **236 geometries / 226 distinct positions**. Strict: **184 geometries / 177 distinct positions**; semantic register: **236**; noGeometry: **0**. The public audit does not independently reproduce all assertions in Weigand 1907. Independent historical-semantic authority remains the primary source and canonical WG_LOC.

## Resource integrity / V16_RELEASE_MANIFEST.csv

The new versioned manifest contains **8 data rows**: four HTTP-measured live UI/editorial resources and four inherited *virtual* v1.5 gzip payload references. New measured public resources:

| Path | Bytes | SHA-256 |
|---|---:|---|
| `index.html` | 8552 | `e326560d7ce9e58e14b8d2b7db4289d2e3db813c2c86c34767dd1d3149e5e0ef` |
| `app-v16.js` | 17035 | `9c8f9e1b11e0d36182cadcc535751f22a31934b71c07703bf3af7ee86183f024` |
| `styles.css` | 14070 | `2bc9fd2cbfe8286e6a748c925ee8addedbc65b1d51e0b1de18d66844556fa8b9` |
| `data/weigand-public-order-v1.0.json` | 238463 | `c1527f0189a5da82d25248f3e01cc6911b22e494e95c148b627a6adf15b14cb9` |

The four inherited gzip byte counts and SHA-256 hashes are **copied from the already approved `PUBLICATION_MANIFEST.csv`**, not claimed to be fresh HTTP assets or a v1.6 rebuild. The `transport-shim-v15.js` reconstructs them from `data/transport-v15/`.

## Editorial limitations to retain

Canonical corpus **v0.17** reconciled source-section/page metadata for 15 WG_LOC, but the protected public v1.5 Full/Strict/Semantic downloads **do not republish those updates**. The derived public-order JSON has its own independently audited editorial appearances and is not a replacement semantic export. A future public v0.17 payload requires separate `DATA_PAYLOAD` change control, deterministic rebuild and payload/hash/coordinate regression.

Some legacy HTML “Despre atlas” copy still identifies geography/transport technical v1.5; it is **not** updated by this documentation-only change. Clarify UI v1.6 versus geographic data v1.5 in README and eventual release notes. There were no GitHub CI/check runs or PR reviews recorded for the CC-0007 head during prior verification; do not describe missing checks as PASS. The earlier release-readiness audit did not repeat each standalone public download click.

## Tag/release and gate status

At the pre-documentation audit, `v1.4` and `v1.5` existed as prerelease research snapshots; no `v1.6` tag or GitHub Release existed. No tag or release is created by CC-0008. For a future v1.6 release, first merge the docs PR after explicit authorization, re-check the new `main` SHA, the three-path allowlist and manifest/resource hashes, and obtain explicit release authorization. Keep `DRAFT / work in progress`, prerelease classification, and the v1.5-payload provenance disclosure.

**Pre-merge documentation decision:** implementation candidate only; independent three-path diff/readback gate and owner merge authorization remain required.
