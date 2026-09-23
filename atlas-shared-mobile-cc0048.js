'use strict';
/* CC-0048: keep shared popups clear of map controls. */
(() => {
  if (!window.L || !L.marker) return;
  const original = L.marker;
  L.marker = function (latlng, options = {}) {
    const marker = original.call(this, latlng, options);
    if (options.icon?.options?.className !== 'shared-position-icon') return marker;
    const open = marker.openPopup;
    marker.openPopup = function (...args) {
      const result = open.apply(this, args);
      const mobile = matchMedia('(max-width:760px)').matches;
      const popup = marker.getPopup()?.getElement();
      const map = marker._map;
      const explorer = document.querySelector('.explorer');
      if (!popup || !map || !explorer) return result;
      const bounds = popup.getBoundingClientRect();
      const controls = [...document.querySelectorAll('.map-title,.leaflet-control-zoom')]
        .map(e => e.getBoundingClientRect())
        .filter(r => mobile || (bounds.left < r.right && bounds.right > r.left &&
          bounds.top < r.bottom && bounds.bottom > r.top));
      if (!controls.length) return result;
      const top = Math.max(...controls.map(r => r.bottom)) + 8;
      const bottom = (mobile ? explorer.getBoundingClientRect().top :
        map.getContainer().getBoundingClientRect().bottom) - 8;
      const delta = Math.max(0, top - bounds.top);
      if (delta > 0 && bounds.bottom + delta <= bottom) {
        map.stop();
        map.panBy([0, -Math.ceil(delta)], { animate: false });
      }
      return result;
    };
    return marker;
  };
})();
