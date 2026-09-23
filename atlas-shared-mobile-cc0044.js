'use strict';
/* CC-0044 isolated UI; shared-marker geometry and existing popup data remain canonical. */
(() => {
  if (!window.L || !L.marker) return;
  const oldMarker=L.marker;
  const mobile=()=>window.matchMedia('(max-width:760px)').matches;
  const place=(marker,forPopup)=>{
    const map=marker._map;if(!mobile()||!map)return;
    const stage=document.querySelector('.map-stage')?.getBoundingClientRect();
    const explorer=document.querySelector('.explorer')?.getBoundingClientRect();
    const detail=document.querySelector('#detail-panel')?.getBoundingClientRect();
    if(!stage||!explorer||!detail)return;
    if(forPopup){
      const targetY=Math.min(explorer.top-32,stage.top+stage.height*0.49);
      const pos=map.latLngToContainerPoint(marker.getLatLng());
      const delta=stage.top+pos.y-targetY;
      if(Math.abs(delta)>1)map.panBy([0,delta],{animate:false});
    }else{
      map.fitBounds(L.latLngBounds([marker.getLatLng()]),{maxZoom:14,padding:[35,35],animate:false});
    }
  };
  L.marker=function(latlng,options={}){
    const marker=oldMarker.call(this,latlng,options);
    if(options.icon?.options?.className!=='shared-position-icon')return marker;
    const oldBind=marker.bindPopup;
    marker.bindPopup=function(content,options={}){
      if(content instanceof Element){
        content.addEventListener('click',event=>{
          if(!event.target.closest('button'))return;
          requestAnimationFrame(()=>place(marker,false));
        });
      }
      return oldBind.call(this,content,mobile()?{...options,autoPan:false}:options);
    };
    const oldOpen=marker.openPopup;
    marker.openPopup=function(...args){place(marker,true);return oldOpen.apply(this,args);};
    return marker;
  };
})();