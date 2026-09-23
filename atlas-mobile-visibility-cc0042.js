'use strict';
/* CC-0042 mobile-only visual candidate. Keep WG_LOC geometry and desktop behavior untouched.
   Fit map content into the part not covered by the explorer/detail overlays. */
(() => {
  if (!window.L || !L.Map?.prototype?.fitBounds) return;
  const fit = L.Map.prototype.fitBounds;
  L.Map.prototype.fitBounds = function(bounds, options = {}) {
    if (!window.matchMedia('(max-width:760px)').matches) return fit.call(this, bounds, options);
    const explorer = document.querySelector('.explorer');
    const detail = document.querySelector('#detail-panel');
    const map = document.querySelector('.map-stage');
    if (!explorer || !detail || !map) return fit.call(this, bounds, options);
    const mapHeight = map.getBoundingClientRect().height;
    const bottom = Math.ceil(Math.max(explorer.getBoundingClientRect().height+18,
      detail.getBoundingClientRect().height+12));
    const safeBottom = Math.min(bottom, Math.max(0,mapHeight-90));
    const pad = 35;
    return fit.call(this, bounds, {
      ...options,
      paddingTopLeft: [pad,pad],
      paddingBottomRight: [pad,safeBottom]
    });
  };
})();