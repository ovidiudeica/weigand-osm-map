# v1.5 — Release QA snapshot

**Project status:** DRAFT / work in progress  
**Release class:** research snapshot, not a final scholarly/digital edition  
**Pre-QA-snapshot audited main:** `f1968a75f17099b7da8357a964c0d8c769822bdd`  
**Audit date:** 2026-09-18

## Release baseline

The v1.5 technical/publication baseline verified before creation of this QA snapshot is:

| Surface | Verified state |
|---|---:|
| Canonical corpus | 236 WG_LOC |
| Full dataset | 236 geometries |
| Full distinct positions | 226 |
| Strict OSM dataset | 184 geometries |
| Strict distinct positions | 177 |
| No-geometry register | 0 |
| Semantic register | 236 |
| Public mapped entities | 236 |

`WG_LOC_0236` **Kostel** is included in both Full and Strict based on the verified native OpenStreetMap object. The modern OSM identification remains provenance-distinct from the historical statement in Weigand 1907.

## Payload integrity

Source of truth: `PUBLICATION_MANIFEST.csv`.

| Payload | Records | Positions | Gzip bytes | Gzip SHA-256 |
|---|---:|---:|---:|---|
| Full | 236 | 226 | 33275 | `ff78e8c5c1bcb40bee6c09f8da36131588dc54b12d9c97af11a7c59fa00c9e55` |
| Strict | 184 | 177 | 26041 | `74cbb3e0f8fbff51772ae50e78af2009cf8adce81e72b88e4417f287626375b0` |
| noGeometry | 0 | — | 173 | `87b00c688f6b8aab5563f311da7233be38054b1440b0436e636e2011214b43bf` |
| Semantic | 236 | — | 23008 | `9cf3c635568e00f014fd863f0ec30000006b72d4b949e35405d4f2d25b3cff9c` |

The v1.5 transport chunks were previously reconstructed deterministically and matched these manifest hashes.

## Runtime and publication checks

The following release-readiness gates passed before this file was created:

- repaired v1.5 transport mapping integrated through PR #23;
- public GitHub Pages runtime verified after that integration;
- Full public runtime rendered 236 geometries / 226 distinct positions;
- Strict configuration is wired for 184 geometries / 177 distinct positions;
- public state reports 236 canonical / 236 mapped / no-geometry 0;
- `WG_LOC_0236` Kostel is present on the public surface;
- public editorial state remains explicitly **DRAFT / work in progress**;
- README was corrected and integrated through PR #24 so repository documentation matches the verified 236/184/0 baseline;
- GitHub Pages deployment for `f1968a75f17099b7da8357a964c0d8c769822bdd` completed successfully;
- cache-busted public smoke on that deployment passed;
- open pull requests: 0 at release-readiness re-audit;
- open issues: 0 at release-readiness re-audit;
- obsolete draft staging PRs #15 and #16 were closed unmerged as superseded;
- no `v1.5` tag existed at release-readiness re-audit;
- no GitHub Release for `v1.5` existed at release-readiness re-audit.

## Historical/source boundary

Historical and semantic authority remains Gustav Weigand, *Rumänen und Aromunen in Bulgarien* (1907).

Architecture:

**WEIGAND 1907 → CORPUS CANONIC WG_LOC → synchronized Google My Maps and OSM/Website branches**

Modern OSM objects and coordinates are localization/provenance data. They do not replace the historical source and do not automatically establish exact historical position.

## Editorial boundary

v1.5 is a **research snapshot in a DRAFT project**. A tag or GitHub Release for v1.5 must not be described as a final edition, stable scholarly edition, or completion of the historical research.

## Gate status

This file is itself a pre-tag archival artifact. Its addition must be integrated through a separate audited PR.

After this QA snapshot is merged, the new `main` merge commit must be rechecked before any `v1.5` tag is created. The eventual tag target must be that post-QA-snapshot verified `main` commit, not the pre-snapshot commit recorded above.

**Verdict before merge of this file:** `PASS_V15_PRETAG_QA_SNAPSHOT_CONTENT__MERGE_NOT_AUTHORIZED`
