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

  const replaceBetween = (startNeedle, endNeedle, replacement, label) => {
    const start = source.indexOf(startNeedle);
    const end = source.indexOf(endNeedle, start >= 0 ? start : 0);
    if (start < 0 || end < 0 || end <= start) throw new Error(`Patch v1.6 incompatibil: ${label}.`);
    source = source.slice(0, start) + replacement + source.slice(end);
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

  // CC-0007 detail-context projection: one canonical entity may have several
  // verified editorial appearances without becoming several canonical records.
  replaceExact(
    "function showDetail(properties,record=null){",
    "function showDetail(properties,record=null,appearance=null){",
    'semnătură detail cu apariție'
  );

  replaceExact(
    "    const modern=field(properties,'ModernIdentification');",
`    const editorial=(window.__WEIGAND_PUBLIC_ORDER__?.appearances||[]).filter(item=>item.wgLoc===field(properties,'id'));
    if(editorial.length){
      const order=window.__WEIGAND_PUBLIC_ORDER__;
      const groups=new Map((order.groups||[]).map(group=>[group.id,group]));
      const card=element('section',undefined,'detail-card editorial-context');
      card.append(element('h3','Apare la Weigand în:'));
      const list=element('ol',undefined,'editorial-appearances');
      editorial
        .slice()
        .sort((a,b)=>a.chapterOrder-b.chapterOrder||a.sectionOrder-b.sectionOrder||a.appearanceOrder-b.appearanceOrder)
        .forEach(item=>{
          const group=groups.get(item.groupId);
          const parent=group?.parentId?groups.get(group.parentId):null;
          const page=(item.sourcePrintedPages||[]).length?`p. ${item.sourcePrintedPages.join(', ')}`:`PDF p. ${(item.sourcePDFPages||[]).join(', ')}`;
          const text=[parent?.publicTitle,group?.publicTitle,page].filter(Boolean).join(' → ');
          const li=element('li',text);
          if(appearance?.id===item.id) li.classList.add('is-current-appearance');
          li.dataset.appearanceId=item.id;
          list.append(li);
        });
      card.append(list);
      if(appearance){
        const selected=element('p',`Context selectat: ${appearance.sourceName||field(properties,'name')} · ${(appearance.sourcePrintedPages||[]).length?'p. '+appearance.sourcePrintedPages.join(', '):'PDF p. '+(appearance.sourcePDFPages||[]).join(', ')}`,'selected-appearance-note');
        card.append(selected);
      }
      body.append(card);
    }
    const modern=field(properties,'ModernIdentification');`,
    'card apariții editoriale'
  );

  replaceExact(
    "    highlight(record,appearance?.id||'');showDetail(record.properties,record);",
    "    highlight(record,appearance?.id||'');showDetail(record.properties,record,appearance);",
    'propagare context apariție'
  );

  // CC-0007 chapter/sublist presentation tree. Canonical records remain unique;
  // the list is a source-order projection over those records.
  replaceExact(
    "function highlight(record){document.querySelectorAll('#results button').forEach(button=>button.setAttribute('aria-current',String(button.dataset.record===String(record.index))));}",
    "function highlight(record,appearanceId=''){const id=field(record.properties,'id');document.querySelectorAll('#results button[data-wg-loc]').forEach(button=>{const active=appearanceId?button.dataset.appearanceId===appearanceId:button.dataset.wgLoc===id;button.setAttribute('aria-current',String(active));});}",
    'highlight apariție/WG_LOC'
  );

  replaceExact(
`  function selectRecord(record,move=true){
    if(move){const target=record.displayLayer||record.layer;map.fitBounds(bounds(target),{maxZoom:14,padding:[35,35],animate:false});}
    highlight(record);showDetail(record.properties,record);
  }`,
`  function selectRecord(record,move=true,appearance=null){
    if(move){const target=record.displayLayer||record.layer;map.fitBounds(bounds(target),{maxZoom:14,padding:[35,35],animate:false});}
    highlight(record,appearance?.id||'');showDetail(record.properties,record);
  }`,
    'selectare apariție editorială'
  );

  replaceBetween(
    "  function renderList(){",
    "\n  function render(){",
`  function renderList(){
    const order=window.__WEIGAND_PUBLIC_ORDER__;
    if(!order||!Array.isArray(order.groups)||!Array.isArray(order.appearances)) throw new Error('Proiecția editorială nu este disponibilă.');

    const listedRecords=visible.filter(record=>!$('in-view').checked||map.getBounds().intersects(bounds(record.displayLayer||record.layer)));
    const recordById=new Map(listedRecords.map(record=>[field(record.properties,'id'),record]));
    const query=normalize($('search').value);
    const unfiltered=!query&&selected.size===LAYERS.length&&!$('in-view').checked;

    const groupById=new Map(order.groups.map(group=>[group.id,group]));
    const topGroups=order.groups.filter(group=>!group.parentId).slice().sort((a,b)=>a.sourceOrder-b.sourceOrder);
    const childGroups=order.groups.filter(group=>group.parentId).slice().sort((a,b)=>a.sourceOrder-b.sourceOrder);
    const appearancesByGroup=new Map();

    for(const appearance of order.appearances){
      if(!appearancesByGroup.has(appearance.groupId)) appearancesByGroup.set(appearance.groupId,[]);
      appearancesByGroup.get(appearance.groupId).push(appearance);
    }
    for(const list of appearancesByGroup.values()) list.sort((a,b)=>a.appearanceOrder-b.appearanceOrder);

    const isContextVisible=appearance=>{
      if(!appearance.contextual) return false;
      const candidates=Array.isArray(appearance.candidateWGLOC)?appearance.candidateWGLOC:[];
      return candidates.some(id=>recordById.has(id));
    };

    const visibleAppearances=appearance=>{
      if(appearance.wgLoc) return recordById.has(appearance.wgLoc);
      return isContextVisible(appearance);
    };

    const linkedVisible=order.appearances.filter(a=>a.wgLoc&&recordById.has(a.wgLoc));
    const contextualVisible=order.appearances.filter(a=>!a.wgLoc&&isContextVisible(a));
    $('results').replaceChildren();
    $('count').textContent=`${linkedVisible.length} apariții · ${listedRecords.length} entități${contextualVisible.length?' · +1 context':''}`;

    let renderedAny=false;
    for(const chapter of topGroups){
      const children=childGroups.filter(group=>group.parentId===chapter.id);
      const childModels=[];
      for(const child of children){
        const all=(appearancesByGroup.get(child.id)||[]);
        const shown=all.filter(visibleAppearances);
        const keepEmpty=unfiltered&&Number(child.expectedLinkedAppearanceCount||0)===0;
        if(shown.length||keepEmpty) childModels.push({group:child,shown,keepEmpty});
      }
      if(!childModels.length) continue;

      renderedAny=true;
      const chapterLi=element('li',undefined,'chapter-group');
      const chapterDetails=element('details',undefined,'chapter-details');
      chapterDetails.open=Boolean(query)||chapter.sourceOrder===1;
      const chapterSummary=element('summary');
      const chapterCount=childModels.reduce((sum,item)=>sum+item.shown.filter(a=>a.wgLoc).length,0);
      chapterSummary.append(element('span',chapter.publicTitle,'chapter-title'),element('span',String(chapterCount),'chapter-count'));
      chapterDetails.append(chapterSummary);

      for(const model of childModels){
        const section=element('details',undefined,'sublist-details');
        section.open=Boolean(query)||chapter.sourceOrder===1;
        const summary=element('summary');
        const linkedCount=model.shown.filter(a=>a.wgLoc).length;
        const contextCount=model.shown.filter(a=>!a.wgLoc).length;
        summary.append(
          element('span',model.group.publicTitle,'sublist-title'),
          element('span',`${linkedCount}${contextCount?'+1c':''}`,'sublist-count')
        );
        section.append(summary);
        const list=element('ul',undefined,'appearance-list');

        if(model.keepEmpty&&!model.shown.length){
          const empty=element('li','Nicio entitate WG_LOC relevantă în corpusul actual.','source-empty');
          list.append(empty);
        }

        for(const appearance of model.shown){
          const li=element('li',undefined,appearance.contextual?'contextual-appearance':'appearance-item');
          if(appearance.contextual){
            const label=element('div',appearance.publicLabel||appearance.sourceName||'Mențiune contextuală','contextual-label');
            const page=(appearance.sourcePrintedPages||[]).length?`p. ${appearance.sourcePrintedPages.join(', ')}`:`PDF p. ${(appearance.sourcePDFPages||[]).join(', ')}`;
            label.append(element('small',`${page} · mențiune colectivă de sursă, neatribuită unui WG_LOC`));
            li.append(label);
          }else{
            const record=recordById.get(appearance.wgLoc);
            if(!record) continue;
            const button=element('button');
            button.type='button';
            button.dataset.record=record.index;
            button.dataset.wgLoc=appearance.wgLoc;
            button.dataset.appearanceId=appearance.id;
            const swatch=element('span','',`swatch layer-${record.category}`);
            const name=element('span',record.name,'result-name');
            const printed=(appearance.sourcePrintedPages||[]).length?`p. ${appearance.sourcePrintedPages.join(', ')}`:`PDF p. ${(appearance.sourcePDFPages||[]).join(', ')}`;
            const sourceName=appearance.sourceName&&normalize(appearance.sourceName)!==normalize(record.name)?` · Weigand: ${appearance.sourceName}`:'';
            button.append(
              swatch,
              document.createTextNode(' '),
              name,
              element('small',`${appearance.wgLoc} · ${printed}${sourceName}${record.collisionSize>1?' · poziție partajată':''}`)
            );
            button.addEventListener('click',()=>selectRecord(record,true,appearance));
            li.append(button);
          }
          list.append(li);
        }
        section.append(list);
        chapterDetails.append(section);
      }
      chapterLi.append(chapterDetails);
      $('results').append(chapterLi);
    }

    if(!renderedAny) $('results').append(element('li',records.length?'Niciun rezultat pentru selecția curentă.':'Nu sunt încărcate date cartografice.','source-empty'));
  }
`,
    'arbore Capitol/Sublistă'
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
