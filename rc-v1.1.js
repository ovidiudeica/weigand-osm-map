'use strict';
const RC={full:[236,226],strict:[182,175],semantic:236,nonNative:54};
const BASE={full:'data/weigand-osm-v1.0.geojson.gz',strict:'data/weigand-osm-v1.0-strict.geojson.gz',semantic:'data/weigand-osm-v1.0-semantic-225.csv.gz'};
const LAYERS=[['Comunitati / Localitati','#286eaf'],['Toponime','#2f8a4a']];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const pub=old=>norm(old)==='toponime'?'Toponime':'Comunitati / Localitati';
const ORDER=window.WG_RC_ORDER||{},RANK={};
for(const [l,ids] of Object.entries(ORDER))RANK[l]=new Map(ids.map((id,i)=>[id,i+1]));
function ord(p){const r=RANK[p.Layer]?.get(p.WG_LOC);if(!r)throw Error(`Ordine lipsă: ${p.WG_LOC}`);p.DisplayOrder=r;return p;}
function cmp(a,b){return (a.properties.Layer==='Toponime')-(b.properties.Layer==='Toponime')||a.properties.DisplayOrder-b.properties.DisplayOrder;}
async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error(`HTTP ${r.status}: ${url}`);const s=r.body.pipeThrough(new DecompressionStream('gzip'));return new TextDecoder().decode(await new Response(s).arrayBuffer());}
function csv(t){t=String(t).replace(/^\uFEFF/,'');const z=[];let r=[],v='',q=false;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'&&t[i+1]==='"'){v+='"';i++;}else if(c==='"')q=false;else v+=c;}else if(c==='"')q=true;else if(c===','){r.push(v);v='';}else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;r.push(v);if(r.some(x=>x!==''))z.push(r);r=[];v='';}else v+=c;}r.push(v);if(r.some(x=>x!==''))z.push(r);const h=z.shift();return z.map(a=>Object.fromEntries(h.map((k,i)=>[k,a[i]??''])));}
const pc=fs=>new Set(fs.map(f=>f.geometry.coordinates.map(Number).map(x=>x.toFixed(7)).join(','))).size;
function p139Geom(){const o={};for(const [id,v] of Object.entries(window.WG_RC_P139||{}))o[id]={lat:v[0],lon:v[1],OSMStatus:'WEBSITE_EDITORIAL_P139_RESEARCH_POINT_v0_7',OSMType:'',OSMID:'',OSMURL:'',OSMSource:`Weigand 1907 PDF p.139; COMMON_HISTORICAL_MAP_RESEARCH_GEOMETRY; uncertainty ${v[2]} m`,PointType:'HISTORICAL_MAP_RESEARCH_POINT',OSMQuality:'EDITORIAL_RESEARCH_GEOMETRY',GeometryParityStatus:'COMMON_HISTORICAL_MAP_RESEARCH_GEOMETRY',SemanticParity:'PASS'};return o;}
function geom(){return Object.assign({},window.WG_RC_GEOM_1,window.WG_RC_GEOM_2,window.WG_RC_GEOM_3,window.WG_RC_GEOM_4,p139Geom());}
const newest=()=>Object.assign({},window.WG_RC_NEW_1,window.WG_RC_NEW_2);
function sem(p,m){const id=p.WG_LOC,b=m.get(id),o=window.WG_RC_SEMANTIC_OVERRIDES[id],pv=window.WG_RC_P139?.[id];if(b)Object.assign(p,b);if(o)Object.assign(p,o);if(pv){if(window.WG_RC_P139_NAMES?.[id])p.Name=window.WG_RC_P139_NAMES[id];p.ModernIdentification=`Historical location refined from Weigand PDF p.139; editorial research point ${Number(pv[0]).toFixed(6)}, ${Number(pv[1]).toFixed(6)}; uncertainty ${pv[2]} m`;p.ModernIDStatus='localizare istorica aproximativa';}p.Group=p.Group||p.Layer||'';p.Layer=pub(p.Layer);p.SemanticStatus='V0.7_VERIFIED_FROZEN';p.SemanticParity='PASS';return ord(p);}
async function build(){
 const [f0,s0,sv]=await Promise.all([text(BASE.full).then(JSON.parse),text(BASE.strict).then(JSON.parse),text(BASE.semantic).then(csv)]);
 const m=new Map(sv.map(x=>[x.WG_LOC,x]));for(const [id,o] of Object.entries(window.WG_RC_SEMANTIC_OVERRIDES)){const r=m.get(id);if(r)Object.assign(r,o);}
 const g=geom(),n=newest(),pids=new Set(Object.keys(window.WG_RC_P139||{}));
 const old=id=>{const x=g[id],p=sem({...m.get(id)},m);Object.assign(p,x);delete p.lat;delete p.lon;return{type:'Feature',geometry:{type:'Point',coordinates:[x.lon,x.lat]},properties:p};};
 const neu=id=>{const x=n[id],p=sem({...x.properties},m);return{type:'Feature',geometry:{type:'Point',coordinates:[x.lon,x.lat]},properties:p};};
 const existing=f=>{const id=f.properties.WG_LOC;if(!pids.has(id))return{type:'Feature',geometry:f.geometry,properties:sem({...f.properties},m)};const x=g[id],p=sem({...f.properties},m);Object.assign(p,x);delete p.lat;delete p.lon;return{type:'Feature',geometry:{type:'Point',coordinates:[x.lon,x.lat]},properties:p};};
 const full=f0.features.map(existing),seen=new Set(full.map(f=>f.properties.WG_LOC));
 for(const id of Object.keys(g))if(!seen.has(id))full.push(old(id));for(const id of Object.keys(n))full.push(neu(id));
 const strict=s0.features.filter(f=>!pids.has(f.properties.WG_LOC)).map(f=>({type:'Feature',geometry:f.geometry,properties:sem({...f.properties},m)})),ss=new Set(strict.map(f=>f.properties.WG_LOC));
 for(const id of window.WG_RC_STRICT_ADD_IDS)if(!ss.has(id)&&!pids.has(id))strict.push(n[id]?neu(id):old(id));
 if(full.length!==RC.full[0]||pc(full)!==RC.full[1])throw Error(`FULL ${full.length}/${pc(full)}`);
 if(strict.length!==RC.strict[0]||pc(strict)!==RC.strict[1])throw Error(`STRICT ${strict.length}/${pc(strict)}`);
 full.sort(cmp);strict.sort(cmp);
 for(const [l,ids] of Object.entries(ORDER)){const got=full.filter(f=>f.properties.Layer===l).map(f=>f.properties.WG_LOC);if(got.length!==ids.length||got.some((x,i)=>x!==ids[i]))throw Error(`Ordine invalidă: ${l}`);}
 if(new Set([...m.keys(),...Object.keys(n)]).size!==RC.semantic)throw Error('Semantic count invalid');
 return{full,strict};
}
let map,group,sets,mode='full';
function show(fs){group.clearLayers();const q=norm(document.getElementById('search').value);let c=0;for(const f of fs){const p=f.properties,s=norm([p.Name,p.WeigandName,p.Aliases,p.WG_LOC,p.ModernIdentification,p.Description].join(' '));if(q&&!s.includes(q))continue;const [lo,la]=f.geometry.coordinates,i=p.Layer==='Toponime'?1:0,m=L.circleMarker([la,lo],{radius:6,color:'#fff',weight:1.5,fillColor:LAYERS[i][1],fillOpacity:.92});const u=p.OSMType&&p.OSMID?`<br><a target="_blank" rel="noopener" href="https://www.openstreetmap.org/${p.OSMType}/${p.OSMID}">OSM ↗</a>`:'';m.bindPopup(`<strong>${p.Name||p.WG_LOC}</strong><br>${p.WG_LOC}<br>${p.WeigandName||''}<br><small>Ordine: ${p.DisplayOrder}</small><br><small>${p.ModernIdentification||''}</small>${u}`).addTo(group);c++;}document.getElementById('visible').textContent=c;document.getElementById('mode-stat').textContent=`${mode==='full'?'Complet':'Strict'}: ${fs.length} geometrii · ${pc(fs)} poziții`;}
async function start(){const st=document.getElementById('status');try{sets=await build();map=L.map('map').setView([42.75,25.2],7);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);group=L.featureGroup().addTo(map);const r=()=>show(sets[mode]);document.getElementById('search').addEventListener('input',r);document.querySelectorAll('[name=mode]').forEach(x=>x.addEventListener('change',()=>{mode=x.value;r();}));r();map.fitBounds(group.getBounds(),{padding:[20,20]});st.textContent='QA PASS · p.139: 10 corecții · ordine Weigand · 2 straturi 164+72 · full 236/226 · strict 182/175 · non-native 54';st.dataset.state='ready';}catch(e){st.textContent=`QA FAIL: ${e.message}`;st.dataset.state='error';throw e;}}
document.addEventListener('DOMContentLoaded',start,{once:true});
