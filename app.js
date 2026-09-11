'use strict';

const LAYERS = [
  {name:'Romani / dacoromani', color:'#286eaf', aliases:['romani / dacoromani','romani','dacoromani']},
  {name:'Aromani', color:'#cf4d9b', aliases:['aromani']},
  {name:'Mixt romani-aromani', color:'#7b4aad', aliases:['mixt romani-aromani']},
  {name:'Toponime', color:'#2f8a4a', aliases:['toponime']}
];

const FIELDS = {
  name:['Name','name','nume','localitate','toponim'],
  id:['ID','WG_LOC','id'],
  layer:['Layer','layer','Strat','strat'],
  description:['Description','description','descriere'],
  sources:['Source','Sources','source','sources','surse'],
  notes:['Notes','notes'],
  osmURL:['OSMURL']
};

const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

function field(properties,key){
  for(const alias of FIELDS[key] || [key]){
    const value = properties?.[alias];
    if(value !== undefined && value !== null && value !== '') return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }
  return '';
}

function layerIndex(properties){
  const value = normalize(field(properties,'layer'));
  return LAYERS.findIndex(layer => layer.aliases.includes(value));
}

function osmURL(properties){
  const type = field(properties,'OSMType').toLowerCase().trim();
  const id = field(properties,'OSMID').trim();
  if(/^(node|way|relation)$/.test(type) && /^[1-9]\d*$/.test(id)) return `https://www.openstreetmap.org/${type}/${id}`;
  const url = field(properties,'osmURL').trim();
  return /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/[1-9]\d*$/.test(url) ? url : null;
}

function element(tag,text,className){
  const node = document.createElement(tag);
  if(text !== undefined) node.textContent = text;
  if(className) node.className = className;
  return node;
}

const TECH_ROWS = [
  ['WG_LOC / ID','id'],['Strat','layer'],['Nume în Weigand','WeigandName'],['Variante / aliasuri','Aliases'],
  ['Tip obiect','ObjectType'],['Admin./context istoric','HistoricalAdmin'],['Secțiune Weigand','WeigandSection'],
  ['Pagini Weigand','WeigandPages'],['Identificare modernă','ModernIdentification'],
  ['Statut identificare','ModernIDStatus'],['Descriere','description'],['Sursă Weigand','sources'],['Statut semantic','SemanticStatus'],
  ['Paritate semantică','SemanticParity'],['Statut geometrie','GeometryParityStatus'],['Statut OSM','OSMStatus'],
  ['Tip punct','PointType'],['Calitate OSM','OSMQuality'],['OSMType','OSMType'],['OSMID','OSMID'],
  ['Sursă verificare OSM','OSMSource'],['Distanță MyMaps–OSM (km)','DistanceKM_MyMaps_OSM'],['QA distanță','DistanceQAStatus'],['Note','notes']
];

function technicalList(properties){
  const dl = element('dl');
  for(const [label,key] of TECH_ROWS){
    const value = field(properties,key);
    if(value) dl.append(element('dt',label),element('dd',value));
  }
  return dl;
}

function details(properties){
  const box = element('div');
  box.append(element('h3',field(properties,'name') || field(properties,'id') || 'Nume nespecificat'),technicalList(properties));
  const url = osmURL(properties);
  if(url){
    const link = element('a','Vezi obiectul OpenStreetMap ↗');
    link.href=url; link.target='_blank'; link.rel='noopener noreferrer'; box.append(link);
  }
  return box;
}

function detailCard(title,values,className=''){
  const card = element('section',undefined,`detail-card ${className}`.trim());
  card.append(element('h3',title));
  values.filter(Boolean).forEach((value,i)=>card.append(element('p',value,i===0?'value-large':'')));
  return card;
}

function validateGeoJSON(data,expected,expectedPositions){
  if(!data || data.type!=='FeatureCollection' || !Array.isArray(data.features)) throw new Error('Este necesar un GeoJSON FeatureCollection.');
  if(data.features.length!==expected) throw new Error(`Setul trebuie să conțină ${expected} geometrii; fișierul conține ${data.features.length}.`);
  const ids=new Set(), positions=new Set();
  for(const [i,feature] of data.features.entries()){
    if(feature?.type!=='Feature' || feature?.geometry?.type!=='Point') throw new Error(`Geometrie neacceptată la înregistrarea ${i+1}; M3 publică puncte OSM/reper.`);
    const c=feature.geometry.coordinates;
    if(!Array.isArray(c)||c.length<2||!Number.isFinite(c[0])||!Number.isFinite(c[1])||Math.abs(c[0])>180||Math.abs(c[1])>90) throw new Error(`Coordonate invalide la înregistrarea ${i+1}.`);
    const properties=feature.properties;
    if(!properties||typeof properties!=='object'||Array.isArray(properties)||layerIndex(properties)<0) throw new Error(`Strat necunoscut la înregistrarea ${i+1}.`);
    const id=field(properties,'id');
    if(!/^WG_LOC_\d{4}$/.test(id)) throw new Error(`WG_LOC invalid la înregistrarea ${i+1}.`);
    if(ids.has(id)) throw new Error(`WG_LOC duplicat: ${id}.`);
    ids.add(id);
    if(field(properties,'SemanticParity')!=='PASS') throw new Error(`Paritate semantică nevalidată: ${id}.`);
    positions.add(`${Number(c[0]).toFixed(7)},${Number(c[1]).toFixed(7)}`);
  }
  if(positions.size!==expectedPositions) throw new Error(`Setul are ${positions.size} poziții distincte; sunt așteptate ${expectedPositions}.`);
  return data;
}

function parseCSV(text){
  text=String(text).replace(/^\uFEFF/,'');
  const firstLine=text.split(/\r?\n/,1)[0];
  const delimiter=firstLine.includes(';')&&!firstLine.includes(',')?';':',';
  const rows=[]; let row=[],value='',quoted=false,closed=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(quoted){
      if(c==='"'&&text[i+1]==='"'){value+='"';i++;}
      else if(c==='"'){quoted=false;closed=true;} else value+=c;
    }else if(c==='"'&&value===''&&!closed) quoted=true;
    else if(c===delimiter){row.push(value);value='';closed=false;}
    else if(c==='\n'||c==='\r'){
      if(c==='\r'&&text[i+1]==='\n') i++;
      row.push(value); if(row.some(v=>v!=='')) rows.push(row); row=[];value='';closed=false;
    }else{ if(closed||c==='"') throw new Error('Format CSV invalid.'); value+=c; }
  }
  if(quoted) throw new Error('CSV cu ghilimele neînchise.');
  row.push(value); if(row.some(v=>v!=='')) rows.push(row);
  const headers=(rows.shift()||[]).map(v=>v.trim());
  if(!headers.length||headers.some(v=>!v)||new Set(headers).size!==headers.length) throw new Error('Antet CSV invalid.');
  return rows.map(values=>{
    if(values.length!==headers.length) throw new Error('Număr de coloane CSV inconsistent.');
    return Object.fromEntries(headers.map((h,i)=>[h,values[i]]));
  });
}

const DATASETS={
  full:{url:'data/weigand-osm-v1.0.geojson.gz',filename:'weigand-osm-v1.0.geojson',mime:'application/geo+json'},
  strict:{url:'data/weigand-osm-v1.0-strict.geojson.gz',filename:'weigand-osm-v1.0-strict.geojson',mime:'application/geo+json'},
  noGeometry:{url:'data/weigand-osm-v1.0-no-geometry.csv.gz',filename:'weigand-osm-v1.0-no-geometry.csv',mime:'text/csv;charset=utf-8'},
  semantic:{url:'data/weigand-osm-v1.0-semantic-225.csv.gz',filename:'weigand-osm-v1.0-semantic-225.csv',mime:'text/csv;charset=utf-8'}
};

async function fetchDatasetBytes(dataset){
  const response=await fetch(dataset.url,{signal:AbortSignal.timeout(20000)});
  if(!response.ok) throw new Error(`Eroare HTTP ${response.status} pentru ${dataset.url}.`);
  if(typeof DecompressionStream==='undefined') throw new Error('Browserul nu suportă decomprimarea gzip necesară pentru ediția v1.0.');
  const stream=response.body.pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function fetchDatasetText(dataset){return new TextDecoder('utf-8').decode(await fetchDatasetBytes(dataset));}
async function downloadDataset(anchor,dataset){
  const original=anchor.textContent; anchor.textContent=`${original}…`; anchor.setAttribute('aria-disabled','true');
  try{
    const bytes=await fetchDatasetBytes(dataset); const objectURL=URL.createObjectURL(new Blob([bytes],{type:dataset.mime}));
    const tmp=document.createElement('a'); tmp.href=objectURL; tmp.download=dataset.filename; document.body.append(tmp); tmp.click(); tmp.remove();
    setTimeout(()=>URL.revokeObjectURL(objectURL),30000);
  }finally{anchor.textContent=original;anchor.setAttribute('aria-disabled','false');}
}
function pointKey(feature,index){
  if(feature?.geometry?.type==='Point'&&Array.isArray(feature.geometry.coordinates)){
    const [lon,lat]=feature.geometry.coordinates; return `${Number(lon).toFixed(7)},${Number(lat).toFixed(7)}`;
  }
  return `non-point-${index}`;
}
function distinctPositionCount(records){return new Set(records.map(record=>record.positionKey)).size;}

async function start(){
  const $=id=>document.getElementById(id);
  const status=$('status');
  const setStatus=(text,ready=false)=>{status.textContent=text;status.dataset.state=ready?'ready':'error';};
  const panel=$('detail-panel');

  $('about-open').addEventListener('click',()=>$('about-dialog').showModal());
  $('detail-close').addEventListener('click',()=>{panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');});

  function showDetail(properties,record=null){
    const name=field(properties,'name')||field(properties,'id')||'Nume nespecificat';
    const category=layerIndex(properties);
    $('detail-title').textContent=name;
    $('detail-meta').textContent=`${field(properties,'id')} · ${category>=0?LAYERS[category].name:field(properties,'layer')}`;
    const body=$('detail-body'); body.replaceChildren();
    const weigandName=field(properties,'WeigandName');
    const description=field(properties,'description');
    if(weigandName||description) body.append(detailCard('În Weigand 1907',[weigandName,description]));
    const source=field(properties,'sources');
    const pageBits=field(properties,'WeigandPages')&&`p. ${field(properties,'WeigandPages')}`;
    if(source||pageBits) body.append(detailCard('Citare Weigand 1907',[pageBits,source],'citation'));
    const modern=field(properties,'ModernIdentification');
    const modernStatus=field(properties,'ModernIDStatus');
    if(modern||modernStatus) body.append(detailCard('Identificare modernă',[modern,modernStatus]));
    if(record?.collisionSize>1){
      const others=record.collisionSize-1;
      body.append(detailCard('Poziție cartografică',[`Poziție OSM partajată cu încă ${others} ${others===1?'entitate canonică':'entități canonice'}.`],'shared-position-note'));
    }
    const actions=element('div',undefined,'detail-actions');
    const url=osmURL(properties);
    if(url){const link=element('a','Vezi în OpenStreetMap ↗');link.href=url;link.target='_blank';link.rel='noopener noreferrer';actions.append(link);}
    if(actions.childNodes.length) body.append(actions);
    const tech=element('details',undefined,'detail-card technical'); tech.append(element('summary','Date tehnice și QA'),technicalList(properties)); body.append(tech);
    panel.classList.add('is-open'); panel.setAttribute('aria-hidden','false');
  }

  const configs={
    full:{link:$('download-full'),dataset:DATASETS.full,expected:163,expectedPositions:161},
    strict:{link:$('download-strict'),dataset:DATASETS.strict,expected:157,expectedPositions:156}
  };
  Object.values(configs).forEach(config=>config.link.addEventListener('click',event=>{
    event.preventDefault(); if(config.link.getAttribute('aria-disabled')==='true') return;
    downloadDataset(config.link,config.dataset).catch(error=>setStatus(`Descărcare: ${error.message}`));
  }));
  $('download-semantic').addEventListener('click',event=>{event.preventDefault();downloadDataset($('download-semantic'),DATASETS.semantic).catch(error=>setStatus(`Descărcare: ${error.message}`));});

  let missingCache;
  $('no-geometry').addEventListener('click',async()=>{
    $('missing-dialog').showModal(); const content=$('missing-content'); content.textContent='Se încarcă…';
    try{
      if(!missingCache){
        missingCache=parseCSV(await fetchDatasetText(DATASETS.noGeometry));
        if(missingCache.length!==62) throw new Error(`Sunt așteptate 62 de cazuri; CSV-ul conține ${missingCache.length}.`);
        const ids=new Set();
        for(const row of missingCache){
          const id=row.WG_LOC||row.ID;
          if(!/^WG_LOC_\d{4}$/.test(id||'')) throw new Error(`WG_LOC invalid în registrul fără geometrie: ${id||'lipsă'}.`);
          if(ids.has(id)) throw new Error(`WG_LOC duplicat în registrul fără geometrie: ${id}.`);
          ids.add(id); if(row.SemanticParity!=='PASS') throw new Error(`Paritate semantică nevalidată pentru ${id}.`);
        }
      }
      content.replaceChildren();
      for(const record of missingCache){const article=element('article',undefined,'record');article.append(details(record));content.append(article);}
    }catch(error){content.textContent=error.message;}
  });

  const selected=new Set(LAYERS.map((_,i)=>i));
  LAYERS.forEach((layer,i)=>{
    const label=element('label'); const input=element('input'); const swatch=element('span','',`swatch layer-${i}`); const name=element('span',layer.name); const count=element('span','0','filter-count'); count.id=`filter-count-${i}`;
    input.type='checkbox';input.checked=true; label.append(input,swatch,name,count); $('filters').append(label);
    input.addEventListener('change',()=>{input.checked?selected.add(i):selected.delete(i);render();});
  });

  if(!window.L){setStatus('Leaflet nu s-a încărcat. Verifică conexiunea la internet și reîncarcă pagina.');return;}
  const map=L.map('map',{zoomControl:true}).setView([42.75,25.2],7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(map);
  const group=L.featureGroup().addTo(map);

  let records=[],visible=[],sequence=0,mode='full'; const cache={};
  const bounds=layer=>layer.getBounds?layer.getBounds():L.latLngBounds([layer.getLatLng()]);
  function highlight(record){document.querySelectorAll('#results button').forEach(button=>button.setAttribute('aria-current',String(button.dataset.record===String(record.index))));}
  function selectRecord(record,move=true){
    if(move){const target=record.displayLayer||record.layer;map.fitBounds(bounds(target),{maxZoom:14,padding:[35,35],animate:false});}
    highlight(record);showDetail(record.properties,record);
  }
  function overlapMarker(members){
    const center=bounds(members[0].layer).getCenter(),count=members.length;
    const title=`Poziție OSM partajată de ${count} entități canonice`;
    const icon=L.divIcon({
      className:'shared-position-icon',
      iconSize:[30,30],
      iconAnchor:[15,15],
      html:`<span class="shared-position-marker" title="${title}" aria-hidden="true"><span class="shared-position-marker__back"></span><span class="shared-position-marker__front"></span></span>`
    });
    const marker=L.marker(center,{icon,keyboard:true,title,zIndexOffset:1000});
    const box=element('div',undefined,'shared-position-popup');
    box.append(element('h3','Poziție OSM partajată'),element('p',`${count} entități canonice sunt asociate aceleiași poziții. Selectează fișa pe care vrei să o deschizi.`));
    members.forEach(record=>{const b=element('button',`${record.name} · ${field(record.properties,'id')}`);b.type='button';b.addEventListener('click',()=>{map.closePopup();selectRecord(record,false);});box.append(b);});
    marker.bindPopup(box,{maxWidth:360}); return marker;
  }
  function renderList(){
    const listed=visible.filter(record=>!$('in-view').checked||map.getBounds().intersects(bounds(record.displayLayer||record.layer)));
    $('results').replaceChildren(); $('count').textContent=`${listed.length} în listă · ${visible.length} filtrate`;
    if(!listed.length) $('results').append(element('li',records.length?'Niciun rezultat pentru selecția curentă.':'Nu sunt încărcate date cartografice.'));
    for(const record of listed){
      const li=element('li'),button=element('button'),swatch=element('span','',`swatch layer-${record.category}`),name=element('span',record.name,'result-name');
      button.type='button';button.dataset.record=record.index;button.append(swatch,document.createTextNode(' '),name,element('small',`${field(record.properties,'id')} · ${LAYERS[record.category].name}${record.collisionSize>1?' · poziție partajată':''}`));
      button.addEventListener('click',()=>selectRecord(record,true));li.append(button);$('results').append(li);
    }
  }
  function render(){
    map.closePopup();group.clearLayers();const query=normalize($('search').value);visible=records.filter(record=>selected.has(record.category)&&record.search.includes(query));records.forEach(record=>{record.displayLayer=null;});
    const byPosition=new Map();for(const record of visible){if(!byPosition.has(record.positionKey))byPosition.set(record.positionKey,[]);byPosition.get(record.positionKey).push(record);}
    for(const members of byPosition.values()){
      if(members.length===1){members[0].displayLayer=members[0].layer;group.addLayer(members[0].layer);}else{const marker=overlapMarker(members);group.addLayer(marker);members.forEach(record=>{record.displayLayer=marker;});}
    }
    renderList();
  }
  function fit(){if(group.getLayers().length)map.fitBounds(group.getBounds(),{padding:[30,30],maxZoom:13});}
  async function loadMode(){
    const request=++sequence;records=[];render();setStatus('Se verifică setul selectat…');const current=mode,config=configs[current];
    try{
      const data=cache[current]||validateGeoJSON(JSON.parse(await fetchDatasetText(config.dataset)),config.expected,config.expectedPositions);cache[current]=data;config.link.setAttribute('aria-disabled','false');if(request!==sequence)return;
      records=data.features.map((feature,index)=>{
        const properties=feature.properties,category=layerIndex(properties),color=LAYERS[category].color,name=field(properties,'name')||field(properties,'id');
        const [lon,lat]=feature.geometry.coordinates;const layer=L.circleMarker([lat,lon],{radius:7,color:'#fff',weight:2,fillColor:color,fillOpacity:.94});
        const record={index,properties,category,name,layer,positionKey:pointKey(feature,index),search:normalize([name,field(properties,'id'),field(properties,'WeigandName'),field(properties,'Aliases'),field(properties,'ModernIdentification'),field(properties,'description'),field(properties,'OSMStatus'),field(properties,'notes')].join(' '))};
        layer.on('click',()=>selectRecord(record,false));return record;
      });
      const counts=new Map();records.forEach(record=>counts.set(record.positionKey,(counts.get(record.positionKey)||0)+1));records.forEach(record=>{record.collisionSize=counts.get(record.positionKey)||1;});
      LAYERS.forEach((_,i)=>{$(`filter-count-${i}`).textContent=String(records.filter(r=>r.category===i).length);});$('map-total').textContent=String(records.length);
      render();fit();setStatus(`${current==='full'?'Complet':'Strict'}: ${records.length} geometrii · ${distinctPositionCount(records)} poziții distincte.`,true);
    }catch(error){if(request===sequence)setStatus(`Set ${current==='full'?'complet':'strict'}: ${error.message}`);}
  }
  $('search').addEventListener('input',render);$('in-view').addEventListener('change',renderList);$('fit').addEventListener('click',fit);map.on('moveend',renderList);
  document.querySelectorAll('[name=mode]').forEach(input=>input.addEventListener('change',()=>{mode=input.value;panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');loadMode();}));
  await loadMode();
}

if(typeof document!=='undefined') start().catch(error=>{const status=document.getElementById('status');if(status)status.textContent=`Interfața nu a putut porni: ${error.message}`;});
if(typeof module!=='undefined') module.exports={DATASETS,fetchDatasetBytes,fetchDatasetText,parseCSV,validateGeoJSON,layerIndex,osmURL,normalize,pointKey,distinctPositionCount};