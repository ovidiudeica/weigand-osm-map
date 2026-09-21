'use strict';
/* CC-0038 isolated visual prototype: an ivory interior plus for VIOLET only.
   No modification to WG_LOC, geometries, coordinates or shared-position icons. */
(() => {
  if (!window.L || typeof L.circleMarker !== 'function') return;
  const makeCircleMarker = L.circleMarker;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  L.circleMarker = function(latlng, options = {}) {
    const layer = makeCircleMarker.call(this, latlng, options);
    if (String(options.fillColor || '').toUpperCase() !== '#944DFF' ||
        options.className !== 'wg-thematic-marker') return layer;
    let glyph = null;
    const sync = () => {
      const el = layer.getElement?.();
      const point = layer._point;
      if (!el || !el.isConnected || !point) return;
      if (!glyph || glyph.parentNode !== el.parentNode) {
        glyph?.remove();
        glyph = document.createElementNS(SVG_NS, 'path');
        glyph.setAttribute('class', 'wg-marker-interior-plus');
        glyph.setAttribute('aria-hidden', 'true');
        glyph.setAttribute('pointer-events', 'none');
        el.parentNode.insertBefore(glyph, el.nextSibling);
      }
      const x = point.x, y = point.y;
      glyph.setAttribute('d', `M ${x-3} ${y} H ${x+3} M ${x} ${y-3} V ${y+3}`);
    };
    const originalUpdate = layer._updatePath;
    layer._updatePath = function() { originalUpdate.call(this); sync(); };
    layer.on('add', () => requestAnimationFrame(sync));
    layer.on('remove', () => { glyph?.remove(); glyph = null; });
    return layer;
  };
})();