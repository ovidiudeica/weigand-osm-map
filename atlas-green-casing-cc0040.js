'use strict';
/* CC-0040 isolated UI-only prototype. The dark opaque ring belongs exclusively to
   ordinary GREEN circle markers; no shared-position icon or geometry is changed. */
(() => {
  if (!window.L || typeof L.circleMarker !== 'function') return;
  const original = L.circleMarker;
  const ns = 'http://www.w3.org/2000/svg';
  L.circleMarker = function(latlng, options = {}) {
    const layer = original.call(this, latlng, options);
    if (options.className !== 'wg-thematic-marker' ||
        String(options.fillColor || '').toUpperCase() !== '#00C853') return layer;
    let ring = null;
    const sync = () => {
      const el = layer.getElement?.();
      const point = layer._point;
      if (!el || !el.isConnected || !point) return;
      if (!ring || ring.parentNode !== el.parentNode) {
        ring?.remove();
        ring = document.createElementNS(ns, 'circle');
        ring.setAttribute('class', 'wg-green-contrast-ring');
        ring.setAttribute('aria-hidden', 'true');
        ring.setAttribute('pointer-events', 'none');
        el.parentNode.insertBefore(ring, el);
      }
      ring.setAttribute('cx', point.x);
      ring.setAttribute('cy', point.y);
      ring.setAttribute('r', (Number(layer._radius || 7) + 2.3).toFixed(2));
    };
    const oldUpdate = layer._updatePath;
    layer._updatePath = function() { oldUpdate.call(this); sync(); };
    layer.on('add', () => requestAnimationFrame(sync));
    layer.on('remove', () => { ring?.remove(); ring = null; });
    return layer;
  };
})();