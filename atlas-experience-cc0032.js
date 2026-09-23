'use strict';
/* CC-0032: presentation-only editorial navigation + stable links.
   Uses only the validated public-order projection and currently rendered WG_LOC buttons.
   It never alters canonical data, map geometry, or the source-order payload. */
(() => {
  function launch(){
  const $=id=>document.getElementById(id);
  const order=window.__WEIGAND_PUBLIC_ORDER__;
  if(!order || order.schemaVersion!=='1.0') throw Error('Ordinea editorială verificată nu este disponibilă.');
  const appearances=order.appearances.filter(a=>a&&a.wgLoc&&a.selectable!==false);
  const byAppearance=new Map(appearances.map(a=>[a.id,a]));
  const validWG=new Set(appearances.map(a=>a.wgLoc));
  if(appearances.length!==266||validWG.size!==236||order.contextualSlotCount!==1) throw Error('Invariantele ordinii editoriale nu corespund.');
  const prev=$('book-prev'),next=$('book-next'),position=$('book-position'),notice=$('atlas-link-notice'),share=$('detail-share');
  if(!prev||!next||!position||!notice||!share) throw Error('Controalele editoriale CC-0032 lipsesc.');
  let restoring=false,initialRoute=true,revision=0;
  const currentMode=()=>document.querySelector('[name=mode]:checked')?.value||'full';
  const orderedButtons=()=>[...document.querySelectorAll('#results button[data-wg-loc][data-appearance-id]')];
  const isReady=()=> $('status')?.dataset.state==='ready';
  const context=()=>window.__WEIGAND_SELECTED_CONTEXT__||null;
  const appearanceFor=(wg,appearanceId)=>{
    const a=appearanceId&&byAppearance.get(appearanceId);
    return a?.wgLoc===wg?a:appearances.find(item=>item.wgLoc===wg)||null;
  };
  const absolute=(wg,mode,app)=>{
    const url=new URL(location.href);
    url.searchParams.delete('wg');url.searchParams.delete('appearance');url.searchParams.delete('mode');
    if(wg)url.searchParams.set('wg',wg);
    url.searchParams.set('mode',mode==='strict'?'strict':'full');
    if(wg&&app)url.searchParams.set('appearance',app);
    return url;
  };
  const writeRoute=(replace=false)=>{
    const active=context(),wg=active&&validWG.has(active.wgLoc)?active.wgLoc:'';
    const app=wg?appearanceFor(wg,active.appearanceId)?.id:'';
    const url=absolute(wg,currentMode(),app);
    if(url.href===location.href)return;
    history[replace?'replaceState':'pushState']({cc0032:true},'',url);
  };
  const inform=(text,offer=null)=>{
    notice.replaceChildren();
    if(!text){notice.hidden=true;return;}
    notice.hidden=false;
    const p=document.createElement('p');p.textContent=text;notice.append(p);
    if(offer){const b=document.createElement('button');b.type='button';b.textContent='Deschide în Complet';b.addEventListener('click',offer);notice.append(b);}
  };
  const update=()=>{
    const buttons=orderedButtons(),active=context(),selected=active&&buttons.findIndex(b=>b.dataset.wgLoc===active.wgLoc && (!active.appearanceId||b.dataset.appearanceId===active.appearanceId));
    const index=Number.isInteger(selected)?selected:-1;
    position.textContent=buttons.length?(index<0?'Alege o apariție · '+buttons.length+' disponibile':(index+1)+' / '+buttons.length+' apariții'):'Nicio apariție în filtrul curent';
    prev.disabled=index<=0;
    next.disabled=!buttons.length||index>=buttons.length-1;
    next.textContent=index<0?'Începe cartea →':'Următoarea →';
    share.disabled=!active||!validWG.has(active.wgLoc);
  };
  const choose=(delta)=>{
    const buttons=orderedButtons(),active=context();
    const i=active?buttons.findIndex(b=>b.dataset.wgLoc===active.wgLoc&&(!active.appearanceId||b.dataset.appearanceId===active.appearanceId)):-1;
    const target=buttons[i+delta];
    if(target){target.click();target.scrollIntoView({block:'nearest',behavior:'instant'});update();}
  };
  prev.addEventListener('click',()=>choose(-1));
  next.addEventListener('click',()=>choose(1));
  share.addEventListener('click',async()=>{
    const active=context();if(!active||!validWG.has(active.wgLoc))return;
    const url=absolute(active.wgLoc,currentMode(),appearanceFor(active.wgLoc,active.appearanceId)?.id||'').href;
    try{
      if(!navigator.clipboard?.writeText)throw Error('Clipboard API indisponibil');
      await navigator.clipboard.writeText(url);
      inform('Link copiat pentru '+active.wgLoc+'.');
    }catch(e){
      notice.replaceChildren();notice.hidden=false;
      const p=document.createElement('p');p.textContent='Copierea automată nu este disponibilă. Selectează linkul de mai jos și copiază-l manual:';
      const input=document.createElement('input');input.id='atlas-copy-link';input.type='text';input.readOnly=true;input.value=url;input.setAttribute('aria-label','Link direct către '+active.wgLoc);
      const select=document.createElement('button');select.type='button';select.textContent='Selectează linkul';
      select.addEventListener('click',()=>{input.focus();input.select();});
      notice.append(p,input,select);input.focus();input.select();
    }
  });
  const ready=()=>new Promise((resolve,reject)=>{
    if(isReady())return resolve();
    const status=$('status');let done=false;
    const ob=new MutationObserver(()=>{if(isReady()&&!done){done=true;ob.disconnect();resolve();}});
    ob.observe(status,{attributes:true,attributeFilter:['data-state']});
    setTimeout(()=>{if(!done){done=true;ob.disconnect();reject(Error('Setul de date nu a devenit disponibil.'));}},50000);
  });
  const resetTransientFilters=()=>{
    const search=$('search');if(search.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
    const view=$('in-view');if(view.checked){view.checked=false;view.dispatchEvent(new Event('change',{bubbles:true}));}
    document.querySelectorAll('#filters input[type=checkbox]').forEach(c=>{if(!c.checked){c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));}});
  };
  async function restore(){
    const token=++revision;restoring=true;
    try{
      const url=new URL(location.href),wg=url.searchParams.get('wg')||'',app=url.searchParams.get('appearance')||'';
      const mode=url.searchParams.get('mode')==='strict'?'strict':'full';
      if(wg&&!validWG.has(wg)){inform('WG_LOC inexistent în corpusul canonic: '+wg+'.');return;}
      if(app&&(!byAppearance.has(app)||byAppearance.get(app).wgLoc!==wg)){inform('Apariția editorială din link nu corespunde entității.');return;}
      const radio=document.querySelector('[name=mode][value='+mode+']');
      if(radio&&!radio.checked){radio.click();await ready();}
      else await ready();
      if(token!==revision)return;
      if(!wg){window.__WEIGAND_SELECTED_CONTEXT__=null;$('detail-panel').classList.remove('is-open');$('detail-panel').setAttribute('aria-hidden','true');inform('');return;}
      resetTransientFilters();
      const target=[...orderedButtons()].find(b=>b.dataset.wgLoc===wg&&(!app||b.dataset.appearanceId===app));
      if(!target){
        inform('Această entitate nu este disponibilă în modul Strict. Poți deschide explicit varianta Complet.',async()=>{
          restoring=true;const full=document.querySelector('[name=mode][value=full]');full.click();
          try{await ready();resetTransientFilters();const b=[...orderedButtons()].find(b=>b.dataset.wgLoc===wg&&(!app||b.dataset.appearanceId===app));if(b){b.click();inform('');}}finally{restoring=false;writeRoute(true);update();}
        });
        return;
      }
      target.click();inform('');
    }catch(e){inform('Nu s-a putut deschide linkul: '+e.message);}
    finally{restoring=false;update();}
  }
  window.addEventListener('weigand:selection',()=>{
    if(!restoring){inform('');writeRoute(false);}
    update();
  });
  document.querySelectorAll('[name=mode]').forEach(r=>r.addEventListener('change',()=>{
    if(!restoring){window.__WEIGAND_SELECTED_CONTEXT__=null;inform('');writeRoute(false);}
    ready().then(update).catch(()=>update());
  }));
  window.addEventListener('popstate',()=>{restore();});
  new MutationObserver(update).observe($('results'),{childList:true});
  if(isReady()){restore();}
  else ready().then(()=>restore()).catch(e=>inform('Navigarea nu este disponibilă: '+e.message));
  update();
  }
  const status=document.getElementById('status');
  if(!status)throw Error('Starea atlasului lipsește.');
  if(status.dataset.state==='ready')launch();
  else {
    const observer=new MutationObserver(()=>{
      if(status.dataset.state==='ready'){observer.disconnect();launch();}
    });
    observer.observe(status,{attributes:true,attributeFilter:['data-state']});
  }
})();