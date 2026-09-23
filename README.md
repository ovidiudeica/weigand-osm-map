# Gustav Weigand — Atlas digital OpenStreetMap (DRAFT)

**Statut editorial:** DRAFT / work in progress. Atlasul este un instrument public de cercetare, nu o ediție științifică definitivă a cărții lui Gustav Weigand, *Rumänen und Aromunen in Bulgarien* (1907).

**Website:** https://ovidiudeica.github.io/weigand-osm-map/  
**Interfață publică:** bază DRAFT v1.6, cu îmbunătățirile CC-0030–CC-0048, publicate pe GitHub Pages la 23 septembrie 2026.  
**Sursa codului publicat:** commit `e5fc113952b694d0e7fd889df7f6ba865b336249`; conținutul acestuia este identic cu candidatul local CC-0048 `6ba8b50a759dc40655188eb21aee5c02fc755c2f`.  
**Date încărcate în prezent:** fluxurile tehnice **candidate v1.7** pentru Full, Strict și registrul semantic; fluxul gol noGeometry este moștenit din v1.5. Publicarea fișierelor candidate prin website nu înseamnă aprobarea unei ediții științifice finale sau crearea unui release de date separat.

## Corpus, ramuri și limite

Sursa istorică și semantică de adevăr este cartea lui Weigand (1907), în corpusul canonic `WG_LOC`. Acesta alimentează ramurile Google My Maps și OpenStreetMap/Website cu aceeași semantică, dar cu coordonate și geometrii specifice platformei. Obiectele OSM moderne și reperele editoriale nu constituie automat dovada localizării istorice exacte.

| Set afișat | Entități/geometrii | Poziții distincte |
|---|---:|---:|
| Complet (Full) | 236 | 226 |
| Strict OSM | 184 | 177 |

Registrul semantic conține 236 de entități. Setul strict conține exclusiv elementele clasificate `StrictNative=YES`; Full include și fallback-uri / puncte de cercetare etichetate explicit. Numărătorile descriu seturile publicate și nu reprezintă o evaluare a preciziei istorice a fiecărei identificări.

## Codarea vizuală

- Români/Dacoromâni: albastru `#1683FF`
- Aromâni: roșu `#FF3347`
- Mixt: violet `#944DFF`
- Toponime: verde `#00C853`

Marcatorii sunt circulari. Categoriile și pozițiile partajate au indicii de formă/interior distincte. În interfața mobilă CC-0048, legenda este ascunsă temporar cât timp este deschis un popup de poziție partajată și reapare la închiderea acestuia; popupurile obișnuite nu declanșează această regulă. Codul, numărătorile și paleta sunt păstrate conform candidatului aprobat.

## Arhitectura website-ului public

GitHub Pages servește directorul `/` din ramura `main` (cu `.nojekyll`). Punctul de intrare este `index.html`. Bootstrapul `app-v16.js` aplică proiecția ordinii editoriale și adaptează `app.js` la datele v1.7. `transport-shim-v17.js` reconstruiește fluxurile gzip din `data/transport-v17/` și reutilizează `data/transport-v15/v15-noGeometry-01.b64`. Ordinea editorială este în `data/weigand-public-order-v1.0.json`.

CSS/JS separate `atlas-*.css` / `atlas-*.js` păstrează istoricul incremental al îmbunătățirilor de interfață. Nu sunt fișiere temporare de eliminat numai pe baza numelui CC. La o reorganizare trebuie verificate toate dependențele din HTML/JS și cererile efective din browser.

Directorul `candidate-v17/`, rapoartele QA istorice și adaptoarele de transport mai vechi rămân în repository pentru trasabilitate. Unele fișiere istorice folosesc cifre și stări valabile numai la data lor; nu le interpretați ca descriere a publicației actuale. Consultă [ghidul de structură](docs/REPOSITORY_STRUCTURE.md) pentru clasificare și condițiile unei viitoare curățări.

## Stadiul QA și publicarea

CC-0048: PASS tehnic în matricea documentată și aprobarea vizuală a proprietarului. CC-0049: verificările complete pe telefon fizic și cu NVDA/VoiceOver/TalkBack rămân deschise. Nu se declară conformitate WCAG.

- [Raport QA final CC-0048](https://docs.google.com/document/d/1qwAKGDS7aGMHRpTiuUFL5pQwmmWc9YpBWNW-FmudhSg/edit)
- [Raportul publicării CC-0048](https://docs.google.com/document/d/1pcdsiC55oO72bzsosbaeCy79WMoS8dSWAKXQZ-836X8/edit)
- [Protocolul CC-0049](https://docs.google.com/document/d/1-o0h6EXo7p4Dqj61aqHhLTknXeM2VRxKa6mgjTP8n_g/edit)
- [Specificația LIVE](https://docs.google.com/document/d/1AcrLh6vMdxuobPhZZYgaGNuCo4ppGNMKcOqJ_FhSHX0/edit)

Versiunile GitHub v1.4, v1.5 și v1.6 sunt **snapshoturi de cercetare**; etichetele și fișierele istorice rămân distincte de starea curentă a site-ului. Nu modificați corpusul canonic, ordinea editorială, coordonatele sau datele publicate printr-un gate de curățenie a repository-ului.

