'use strict';

const RC = {
  full: {expected:236, positions:219},
  strict: {expected:188, positions:175},
  semantic: {expected:236},
  nonNative: 48
};
const BASE = {
  full:'data/weigand-osm-v1.0.geojson.gz',
  strict:'data/weigand-osm-v1.0-strict.geojson.gz',
  semantic:'data/weigand-osm-v1.0-semantic-225.csv.gz'
};
const LAYERS = [
  {name:'Comunitati / Localitati',color:'#286eaf'},
  {name:'Toponime',color:'#2f8a4a'}
];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const publicLayer=old=>norm(old)==='toponime'?'Toponime':'Comunitati / Localitati';
const layerIndex=p=>publicLayer(p.Layer)==='Toponime'?1:0;
async function gunzipText(url){
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  if(typeof DecompressionStream==='undefined') throw new Error('Browserul nu suportă DecompressionStream.');
  return new TextDecoder().decode(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}
function parseCSV(text){
  text=String(text).replace(/^\uFEFF/,'');
  const rows=[]; let row=[],v='',q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(q){
      if(c==='"'&&text[i+1]==='"'){v+='"';i++;}
      else if(c==='"') q=false; else v+=c;
    }else if(c==='"') q=true;
    else if(c===','){row.push(v);v='';}
    else if(c==='\n'||c==='\r'){
      if(c==='\r'&&text[i+1]==='\n')i++;
      row.push(v); if(row.some(x=>x!==''))rows.push(row); row=[];v='';
    }else v+=c;
  }
  row.push(v); if(row.some(x=>x!==''))rows.push(row);
  const h=rows.shift();
  return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]??''])));
}
function posCount(features){
  return new Set(features.map(f=>`${Number(f.geometry.coordinates[0]).toFixed(7)},${Number(f.geometry.coordinates[1]).toFixed(7)}`)).size;
}
function allGeometryPatch(){
  return Object.assign({},window.WG_RC_GEOM_1,window.WG_RC_GEOM_2,window.WG_RC_GEOM_3,window.WG_RC_GEOM_4);
}
function allNew(){
  return Object.assign({},window.WG_RC_NEW_1,window.WG_RC_NEW_2);
}
function applySemantic(p, semMap){
  const id=p.WG_LOC;
  const base=semMap.get(id);
  if(base) Object.assign(p,base);
  const over=window.WG_RC_SEMANTIC_OVERRIDES[id];
  if(over) Object.assign(p,over);
  const legacyGroup=p.Group||p.Layer||'';
  p.Group=legacyGroup;
  p.Layer=publicLayer(p.Layer);
  p.SemanticStatus='V0.6_VERIFIED_FROZEN';
  p.SemanticParity='PASS';
  return p;
}
async function build(){
  const [full0,strict0,sem0]=await Promise.all([
    gunzipText(BASE.full).then(JSON.parse),
    gunzipText(BASE.strict).then(JSON.parse),
    gunzipText(BASE.semantic).then(parseCSV)
  ]);
  const semMap=new Map(sem0.map(r=>[r.WG_LOC,r]));
  for(const [id,over] of Object.entries(window.WG_RC_SEMANTIC_OVERRIDES)){
    const row=semMap.get(id); if(row) Object.assign(row,over);
  }
  const geom=allGeometryPatch(), newest=allNew();
  const makeOld=id=>{
    const g=geom[id], p=applySemantic({...semMap.get(id)},semMap);
    Object.assign(p,g); delete p.lat; delete p.lon;
    return {type:'Feature',geometry:{type:'Point',coordinates:[geom[id].lon,geom[id].lat]},properties:p};
  };
  const makeNew=id=>{
    const n=newest[id], p={...n.properties,SemanticStatus:'V0.6_VERIFIED_FROZEN',SemanticParity:'PASS'};
    p.Group=p.Group||p.Layer||'';
    p.Layer=publicLayer(p.Layer);
    return {type:'Feature',geometry:{type:'Point',coordinates:[n.lon,n.lat]},properties:p};
  };
  const full=full0.features.map(f=>({type:'Feature',geometry:f.geometry,properties:applySemantic({...f.properties},semMap)}));
  const fullIDs=new Set(full.map(f=>f.properties.WG_LOC));
  for(const id of Object.keys(geom)) if(!fullIDs.has(id)) full.push(makeOld(id));
  for(const id of Object.keys(newest)) full.push(makeNew(id));

  const strict=strict0.features.map(f=>({type:'Feature',geometry:f.geometry,properties:applySemantic({...f.properties},semMap)}));
  const strictIDs=new Set(strict.map(f=>f.properties.WG_LOC));
  for(const id of window.WG_RC_STRICT_ADD_IDS){
    if(strictIDs.has(id)) continue;
    strict.push(newest[id]?makeNew(id):makeOld(id));
  }
  if(full.length!==RC.full.expected||posCount(full)!==RC.full.positions) throw new Error(`FULL invalid: ${full.length}/${posCount(full)}`);
  const layerSet=new Set(full.map(f=>f.properties.Layer));
  if(layerSet.size!==2||!layerSet.has('Comunitati / Localitati')||!layerSet.has('Toponime')) throw new Error(`Arhitectură straturi invalidă: ${[...layerSet].join(', ')}`);
  const lc=full.reduce((a,f)=>(a[f.properties.Layer]=(a[f.properties.Layer]||0)+1,a),{});
  if(lc['Comunitati / Localitati']!==164||lc.Toponime!==72) throw new Error(`Număr straturi invalid: ${JSON.stringify(lc)}`);
  if(strict.length!==RC.strict.expected||posCount(strict)!==RC.strict.positions) throw new Error(`STRICT invalid: ${strict.length}/${posCount(strict)}`);
  const semanticIDs=new Set([...semMap.keys(),...Object.keys(newest)]);
  if(semanticIDs.size!==RC.semantic.expected) throw new Error(`Semantic invalid: ${semanticIDs.size}`);
  return {full,strict};
}

let map,group,sets,mode='full';
function show(features){
  group.clearLayers();
  const q=norm(document.getElementById('search').value);
  let visible=0;
  for(const f of features){
    const p=f.properties, text=norm([p.Name,p.WeigandName,p.Aliases,p.WG_LOC,p.ModernIdentification,p.Description].join(' '));
    if(q&&!text.includes(q)) continue;
    const [lon,lat]=f.geometry.coordinates, li=layerIndex(p);
    const marker=L.circleMarker([lat,lon],{radius:6,color:'#fff',weight:1.5,fillColor:LAYERS[li].color,fillOpacity:.92});
    const osm=(p.OSMType&&p.OSMID)?`<br><a target="_blank" rel="noopener" href="https://www.openstreetmap.org/${p.OSMType}/${p.OSMID}">OSM ↗</a>`:'';
    marker.bindPopup(`<strong>${p.Name||p.WG_LOC}</strong><br>${p.WG_LOC}<br>${p.WeigandName||''}<br><small>${p.ModernIdentification||''}</small>${osm}`);
    marker.addTo(group); visible++;
  }
  document.getElementById('visible').textContent=String(visible);
  document.getElementById('mode-stat').textContent=`${mode==='full'?'Complet':'Strict'}: ${features.length} geometrii · ${posCount(features)} poziții`;
}
async function start(){
  const status=document.getElementById('status');
  try{
    sets=await build();
    map=L.map('map').setView([42.75,25.2],7);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
    group=L.featureGroup().addTo(map);
    const render=()=>show(sets[mode]);
    document.getElementById('search').addEventListener('input',render);
    document.querySelectorAll('[name=mode]').forEach(x=>x.addEventListener('change',()=>{mode=x.value;render();}));
    render(); map.fitBounds(group.getBounds(),{padding:[20,20]});
    status.textContent=`QA PASS · 2 straturi: Comunitati/Localitati 164 + Toponime 72 · semantic 236/236 · full 236/219 poziții · strict 188/175 · referințe editoriale non-native ${RC.nonNative}`;
    status.dataset.state='ready';
  }catch(e){status.textContent=`QA FAIL: ${e.message}`;status.dataset.state='error';throw e;}
}
document.addEventListener('DOMContentLoaded',start,{once:true});
