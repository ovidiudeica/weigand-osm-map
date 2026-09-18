'use strict';

// CC-0007 / v1.6 draft bootstrap.
// Preserves the validated legacy atlas runtime, loads the verified public-order
// projection, and applies only fail-fast substitutions authorized by CC-0007.
(async () => {
  const [runtimeResponse, orderResponse] = await Promise.all([
    fetch('app.js?v=1.5.0'),
    fetch('data/weigand-public-order-v1.0.json?v=1.0.0')
  ]);
  if (!runtimeResponse.ok) throw new Error(`Nu s-a putut încărca runtime-ul atlasului: HTTP ${runtimeResponse.status}.`);
  if (!orderResponse.ok) throw new Error(`Nu s-a putut încărca ordinea editorială: HTTP ${orderResponse.status}.`);

  let source = await runtimeResponse.text();
  const publicOrder = await orderResponse.json();

  const linked = (publicOrder.appearances || []).filter(item => item && item.wgLoc);
  const contextual = (publicOrder.appearances || []).filter(item => item && !item.wgLoc && item.contextual === true);
  const appearanceIds = new Set((publicOrder.appearances || []).map(item => item && item.id).filter(Boolean));
  const wgLocs = new Set(linked.map(item => item.wgLoc));

  if (publicOrder.schemaVersion !== '1.0') throw new Error('Schema public-order incompatibilă.');
  if (publicOrder.canonicalEntityCount !== 236 || wgLocs.size !== 236) throw new Error('Public-order: acoperire WG_LOC invalidă.');
  if (publicOrder.linkedAppearanceCount !== 266 || linked.length !== 266) throw new Error('Public-order: număr de apariții legate invalid.');
  if (publicOrder.contextualSlotCount !== 1 || contextual.length !== 1) throw new Error('Public-order: număr de sloturi contextuale invalid.');
  if (appearanceIds.size !== (publicOrder.appearances || []).length) throw new Error('Public-order: ID de apariție duplicat.');
  if (linked.some(item => !/^WG_LOC_\d{4}$/.test(item.wgLoc))) throw new Error('Public-order: WG_LOC invalid.');
  if (contextual[0]?.sourceName !== 'Vadin' || contextual[0]?.selectable !== false) throw new Error('Public-order: slotul contextual Vadin este invalid.');

  window.__WEIGAND_PUBLIC_ORDER__ = publicOrder;

  const replaceExact = (needle, replacement, label) => {
    if (!source.includes(needle)) throw new Error(`Patch v1.6 incompatibil: ${label}.`);
    source = source.replace(needle, replacement);
  };

  // v1.5 dataset/count and Group-first semantic classification invariants.
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

  replaceExact("Browserul nu suportă decomprimarea gzip necesară pentru ediția v1.0.", "Browserul nu suportă decomprimarea gzip necesară pentru ediția v1.6.", 'mesaj ediție');
  replaceExact("expected:163,expectedPositions:161", "expected:236,expectedPositions:226", 'număr full');
  replaceExact("expected:157,expectedPositions:156", "expected:184,expectedPositions:177", 'număr strict');
  replaceExact("missingCache.length!==62", "missingCache.length!==0", 'număr noGeometry');
  replaceExact("Sunt așteptate 62 de cazuri; CSV-ul conține ${missingCache.length}.", "Sunt așteptate 0 excepții nemarcabile; CSV-ul conține ${missingCache.length}.", 'mesaj noGeometry');

  replaceExact(
    "const source=field(properties,'sources');",
    "const source=field(properties,'sources').replace(/\\s*(?:[—–-]\\s*)?https?:\\/\\/\\S+/gi,'').replace(/\\s*[—–-]\\s*$/g,'').trim();",
    'filtru sursă publică'
  );

  // CC-0007 canonical marker palette calibrated for OSM Standard.
  replaceExact("color:'#286eaf'", "color:'#1F5A8A'", 'paletă Români / Dacoromâni');
  replaceExact("color:'#cf4d9b'", "color:'#A63D32'", 'paletă Aromâni');
  replaceExact("color:'#7b4aad'", "color:'#6C4A8B'", 'paletă mixt');
  replaceExact("color:'#2f8a4a'", "color:'#8C5A08'", 'paletă Toponime');
  replaceExact("color:'#fff',weight:2,fillColor:color", "color:'#FFF8E7',weight:2,fillColor:color", 'casing marker ivory');

  // Execute only after every expected legacy fragment was found and replaced.
  (0, eval)(source + '\n//# sourceURL=app-v16-runtime.js');
})().catch(error => {
  const status=document.getElementById('status');
  if(status){status.textContent=`Interfața v1.6 nu a putut porni: ${error.message}`;status.dataset.state='error';}
  else console.error(error);
});
