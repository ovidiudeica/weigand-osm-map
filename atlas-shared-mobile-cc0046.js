'use strict';
/* CC-0046: keyboard focus lifecycle for a shared-position popup. UI only. */
(() => {
  if (!window.L || !L.marker) return;
  const original=L.marker;
  let modality='pointer';
  let lastSelectedMarker=null;
  const closeDetail=document.querySelector('#detail-close');
  closeDetail?.addEventListener('click',()=>{
    if(modality==='keyboard' && lastSelectedMarker){
      requestAnimationFrame(()=>focus(lastSelectedMarker.getElement()));
    }
  });
  document.addEventListener('keydown',event=>{
    const panel=document.querySelector('#detail-panel');
    if(event.key!=='Escape'||!panel?.classList.contains('is-open')||
       !panel.contains(document.activeElement)||!lastSelectedMarker)return;
    event.preventDefault();event.stopPropagation();closeDetail?.click();
  });
  document.addEventListener('keydown', () => { modality='keyboard'; }, true);
  document.addEventListener('pointerdown', () => { modality='pointer'; }, true);
  const focus=(element)=>{ if(element?.isConnected) element.focus({preventScroll:true}); };
  L.marker=function(latlng,options={}){
    const marker=original.call(this,latlng,options);
    if(options.icon?.options?.className!=='shared-position-icon')return marker;
    let box=null, pendingSelection=false, openedByKeyboard=false;
    const oldBind=marker.bindPopup;
    marker.bindPopup=function(content,settings={}){
      box=content instanceof Element ? content : null;
      if(box){
        box.setAttribute('role','group');
        box.setAttribute('aria-label','Poziție OSM partajată: alege fișa canonică');
        box.addEventListener('keydown',(event)=>{
          const buttons=[...box.querySelectorAll('button')];
          const i=buttons.indexOf(document.activeElement);
          if(event.key==='Escape'){
            event.preventDefault();event.stopPropagation();
            marker._map?.closePopup();focus(marker.getElement());return;
          }
          if(event.key==='Tab' && i>=0){
            const next=i+(event.shiftKey?-1:1);
            if(next>=0&&next<buttons.length){
              event.preventDefault();event.stopPropagation();focus(buttons[next]);
            }else if(event.shiftKey&&next<0){
              event.preventDefault();event.stopPropagation();focus(marker.getElement());
            }
          }
        });
        box.addEventListener('click',event=>{
          if(!event.target.closest('button'))return;
          pendingSelection=true;
          lastSelectedMarker=marker;
          requestAnimationFrame(()=>{
            if(document.querySelector('#detail-panel')?.classList.contains('is-open')){
              focus(document.querySelector('#detail-close'));
            }
            pendingSelection=false;
          });
        });
      }
      return oldBind.call(this,content,settings);
    };
    const oldOpen=marker.openPopup;
    marker.openPopup=function(...args){
      openedByKeyboard=modality==='keyboard';
      const el=marker.getElement();
      if(box&&el){
        const names=[...box.querySelectorAll('button')].map(b=>b.textContent.trim());
        el.setAttribute('aria-label','Poziție OSM partajată: '+names.join('; '));
      }
      const result=oldOpen.apply(this,args);
      if(openedByKeyboard){
        requestAnimationFrame(()=>{
          if(marker.isPopupOpen?.() && box) focus(box.querySelector('button'));
        });
      }
      return result;
    };
    marker.on('popupclose',()=>{
      if(openedByKeyboard && !pendingSelection){
        requestAnimationFrame(()=>focus(marker.getElement()));
      }
      openedByKeyboard=false;
    });
    return marker;
  };
})();