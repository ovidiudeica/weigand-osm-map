'use strict';

// v1.5 draft/versioned bootstrap. Reuses the validated legacy atlas runtime but applies
// explicit, fail-fast substitutions for the v1.5 datasets/counts and the
// canonical Group-based thematic classification.
(async () => {
  const response = await fetch('app.js?v=1.5.0');
  if (!response.ok) throw new Error(`Nu s-a putut încărca runtime-ul atlasului: HTTP ${response.status}.`);
  let source = await response.text();

  const replaceExact = (needle, replacement, label) => {
    if (!source.includes(needle)) throw new Error(`Patch v1.5 incompatibil: ${label}.`);
    source = source.replace(needle, replacement);
  };

  replaceExact(
`function layerIndex(properties){
  const value = normalize(field(properties,'layer'));
  return LAYERS.findIndex(layer => layer.aliases.includes(value));
}`,
`function layerIndex(properties){
  const values=[field(properties,'Group'),field(properties,'layer')].map(normalize).filter(Boolean);
  for(const value of values){
    const i=LAYERS.findIndex(layer=>layer.aliases.includes(value));
    if(i>=0) return i;
  }
  return -1;
}`,
    'clasificare tematică Group/Layer'
  );

  replaceExact("data/weigand-osm-v1.0.geojson.gz", "data/weigand-osm-v1.5.geojson.gz", 'URL full');
  replaceExact("weigand-osm-v1.0.geojson", "weigand-osm-v1.5.geojson", 'filename full');
  replaceExact("data/weigand-osm-v1.0-strict.geojson.gz", "data/weigand-osm-v1.5-strict.geojson.gz", 'URL strict');
  replaceExact("weigand-osm-v1.0-strict.geojson", "weigand-osm-v1.5-strict.geojson", 'filename strict');
  replaceExact("data/weigand-osm-v1.0-no-geometry.csv.gz", "data/weigand-osm-v1.5-no-geometry.csv.gz", 'URL noGeometry');
  replaceExact("weigand-osm-v1.0-no-geometry.csv", "weigand-osm-v1.5-no-geometry.csv", 'filename noGeometry');
  replaceExact("data/weigand-osm-v1.0-semantic-225.csv.gz", "data/weigand-osm-v1.5-semantic-236.csv.gz", 'URL semantic');
  replaceExact("weigand-osm-v1.0-semantic-225.csv", "weigand-osm-v1.5-semantic-236.csv", 'filename semantic');

  replaceExact("Browserul nu suportă decomprimarea gzip necesară pentru ediția v1.0.", "Browserul nu suportă decomprimarea gzip necesară pentru ediția v1.5.", 'mesaj ediție');
  replaceExact("expected:163,expectedPositions:161", "expected:236,expectedPositions:226", 'număr full');
  replaceExact("expected:157,expectedPositions:156", "expected:184,expectedPositions:177", 'număr strict');
  replaceExact("missingCache.length!==62", "missingCache.length!==0", 'număr noGeometry');
  replaceExact("Sunt așteptate 62 de cazuri; CSV-ul conține ${missingCache.length}.", "Sunt așteptate 0 excepții nemarcabile; CSV-ul conține ${missingCache.length}.", 'mesaj noGeometry');

  replaceExact(
    "const source=field(properties,'sources');",
    "const source=field(properties,'sources').replace(/\\s*(?:[—–-]\\s*)?https?:\\/\\/\\S+/gi,'').replace(/\\s*[—–-]\\s*$/g,'').trim();",
    'filtru sursă publică'
  );

  // Execute only after every expected legacy fragment was found and replaced.
  (0, eval)(source + '\n//# sourceURL=app-v15-runtime.js');
})().catch(error => {
  const status=document.getElementById('status');
  if(status){status.textContent=`Interfața v1.5 nu a putut porni: ${error.message}`;status.dataset.state='error';}
  else console.error(error);
});
