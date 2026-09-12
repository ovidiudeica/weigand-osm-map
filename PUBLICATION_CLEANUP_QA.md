# Publication cleanup QA — 2026-09-12

## Domeniu

Acest control privește exclusiv publicația GitHub / website. Masterul canonic și arhiva de cercetare din Google Drive nu sunt modificate.

## Starea publică verificată

- corpus semantic: **225 WG_LOC**;
- OSM full: **163 geometrii / 161 poziții distincte**;
- OSM strict: **157 geometrii / 156 poziții distincte**;
- fără geometrie OSM: **62**;
- `WeigandPages` rămâne câmpul de paginare publică pentru pagina tipărită;
- metadatele de paginare ale digitizării externe au fost eliminate din cele patru payload-uri publice active;
- legăturile de stocare ale digitizării externe au fost eliminate din câmpurile publice de sursă;
- interfața publică citează Weigand prin pagina tipărită și referința bibliografică normală;
- în starea curentă a `main` sunt păstrate numai fragmentele Base64 necesare runtime-ului v1.0; fragmentele istorice neutilizate nu mai fac parte din publicația curentă.

## Integritatea payload-urilor curente

Hash-urile de mai jos sunt cele post-curățare și sunt identice cu `PUBLICATION_MANIFEST.csv`:

| payload | raw bytes | raw SHA-256 | gzip bytes | gzip SHA-256 |
|---|---:|---|---:|---|
| full | 235906 | `f2b0083f11fce16ad9b02d7da64ba4af824de971e1ca2c07ff730704a150f808` | 28781 | `44f4a64fc52e96896b3ebb2f01e6844b4e39c2fe1889ff69c77b0e329b123181` |
| strict | 226879 | `06156adbdcef8e7d0e45afe7274231e41aae2c1f53b8900b4c02bf8bac5bbc9c` | 27499 | `de9e2060ee4572c234fddb3e69865c988a5ac4ae765f3e85778c342a3c59db9b` |
| noGeometry | 47343 | `6370f8851e4bc43f5ac88c7777cdaff3d7d2fc3729fb0e47abda9a4086a84532` | 8022 | `7a7057802caebc943a51fedec93c532234d9fec8fb39ad2da8b31d7f05430691` |
| semantic | 192254 | `4fbda8eb55915072a2da7ef30bdc15c082c214ac245b38e80235bbe4d6ca1492` | 30388 | `d66069e7ac3c7c3bee2c0dbe4a226802c32d17361d397562d00158bc237a5aac` |

`M5_MANIFEST.csv` și `M9_MANIFEST.csv` rămân evidențe istorice ale milestone-urilor lor. Ele nu reprezintă integritatea binară a payload-urilor publice curente.

## Invariante științifice

Curățarea publicației nu modifică identitățile `WG_LOC`, pagina tipărită Weigand, identificările moderne, clasificările științifice, geometriile sau coordonatele OSM. Ramura Google My Maps și masterul canonic din Drive rămân în afara acestui write.
