# Structura repository-ului și regulile CC-0050

Acest document este o propunere de organizare **doar documentară**. Nu autorizează mutarea, redenumirea sau ștergerea fișierelor ori ramurilor.

## Fișiere active în publicația curentă

`index.html` și `.nojekyll` servesc interfața din `main` pe GitHub Pages, directorul `/`. Bootstrapul `app-v16.js` adaptează `app.js` și ordinea `data/weigand-public-order-v1.0.json`. `transport-shim-v17.js` folosește `data/transport-v17/` pentru Full/Strict/Semantic și `data/transport-v15/v15-noGeometry-01.b64` pentru noGeometry.

`styles.css`, `marker-cosmetic.css/js`, `mobile-controls.js` și modulele `atlas-*.css/js` sunt încărcate sau utilizate prin bootstrap și formează runtime-ul actual. Numele CC reprezintă etape de dezvoltare, nu dovezi de neutilizare.

## Fișiere istorice și necesitatea auditului de referințe

`app-v14.js`, `app-v15.js`, `transport-shim.js`, `transport-shim-v14.js`, `transport-shim-v15.js` și directoarele `data/transport/`, `data/transport-v14/`, `data/transport-v15/` pot fi necesare pentru linkuri externe sau versiuni vechi. Nu le eliminați înainte de verificarea încărcărilor actuale, a referințelor publice istorice și a arhivării. Fragmentul `v15-noGeometry-01.b64` este dependență activă și trebuie păstrat.

`candidate-v17/` este un snapshot documentar din faza de pregătire a payload-ului. Rapoartele `M5_*`, `M9_*`, `RC8_*`, `V15_*`, `V16_*`, `PUBLICATION_*` și `README_M4.md` descriu perioade diferite. Eventuala mutare în `docs/history/` necesită actualizarea linkurilor și un gate separat.

## Convenții recomandate

- `main`: exclusiv website-ul public autorizat.
- `work/ccNNNN-<scop>`: candidați de implementare cu QA, fără publicare automată.
- `docs/`: documentație actuală (fără a muta retroactiv fișiere neauditate).
- `docs/history/`: numai documente istorice relocate după backup și verificarea linkurilor.
- Dovezile QA brute și corpusul master rămân în Google Drive, nu în runtime-ul GitHub.

## Invariante înainte de schimbare

Păstrați intacte `WG_LOC`, sursa Weigand 1907, semantica Full/Strict, ordinea editorială, culorile aprobate și geometriile/coordatele OSM. Confirmați identitatea octet cu octet a payload-urilor și comparați exporturile Full/Strict/Semantic prin nume, bytes și SHA-256.

Un candidat trebuie să prezinte: manifest înainte/după, backup verificat, lista dependențelor, smoke-test public/preview, rezultate de tastatură și interacțiune mobilă, status CC-0049 și aprobarea expresă a lui Ovidiu înainte de merge, ștergeri sau deployment.

## Backup și ștergerea ramurilor

CC-0050 a pregătit snapshoturi ZIP la SHA pentru fiecare din cele 17 ramuri, plus metadate de tag/release/PR. ZIP-ul snapshotului păstrează conținutul, **nu întreg istoricul de obiecte Git**. Până la un Git mirror/bundle complet, verificat și arhivat extern, ramurile divergente rămân păstrate. Nu folosiți force-push și nu rescrieți istoricul.

Raport audit: https://docs.google.com/document/d/1L7AJP1K6pZT95OWYB2sC0aibBErjbfxklNg8j5-Zg2E/edit

