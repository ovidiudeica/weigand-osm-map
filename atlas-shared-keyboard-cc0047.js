'use strict';
/* CC-0047: expose the existing shared marker on natural keyboard focus. */
(() => {
  if (!window.L || !L.marker) return;
  const makeMarker = L.marker;
  L.marker = function(latlng, options = {}) {
    const marker = makeMarker.call(this, latlng, options);
    if (options.icon?.options?.className !== 'shared-position-icon') return marker;
    const offset = marker.options.zIndexOffset;
    const onFocus = () => {
      if (!marker.getElement()?.matches(':focus-visible')) return;
      marker.setZIndexOffset(offset + 1000000);
      if (!marker._map) return;
      const map = marker._map;
      map.stop();
      const stage = map.getContainer().getBoundingClientRect();
      const point = map.latLngToContainerPoint(marker.getLatLng());
      if (!window.matchMedia('(max-width:760px)').matches) {
        const el = marker.getElement(), rect = el.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        if (el.contains(hit) && rect.left >= stage.left + 32 && rect.right <= stage.right - 32 &&
            rect.top >= stage.top + 32 && rect.bottom <= stage.bottom - 32) return;
        map.panBy([point.x - stage.width / 2, point.y - stage.height / 2], {animate:false});
        return;
      }
      const explorer = document.querySelector('.explorer')?.getBoundingClientRect();
      if (!explorer) return;
      const targetY = Math.min(explorer.top - 50, stage.top + stage.height * 0.35);
      map.panBy([point.x - stage.width / 2, stage.top + point.y - targetY], {animate:false});
    };
    const onBlur = () => marker.setZIndexOffset(offset);
    marker.on('add', () => {
      const el = marker.getElement();
      const box = marker.getPopup()?.getContent();
      if (!el) return;
      if (box instanceof Element) {
        const names = [...box.querySelectorAll('button')].map(b => b.textContent.trim());
        el.setAttribute('aria-label', 'Poziție OSM partajată: ' + names.join('; '));
      }
      el.addEventListener('focus', onFocus);
      el.addEventListener('blur', onBlur);
    });
    return marker;
  };
})();
