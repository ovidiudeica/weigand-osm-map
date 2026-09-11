'use strict';

// UI-only patch for shared OSM positions. It leaves coordinates and datasets untouched.
(() => {
  if (!window.L) return;

  const seenColors = new Map();
  const positionKey = value => {
    const ll = L.latLng(value);
    return `${Number(ll.lat).toFixed(7)},${Number(ll.lng).toFixed(7)}`;
  };

  const originalCircleMarker = L.circleMarker;
  L.circleMarker = function(latlng, options = {}) {
    try {
      const key = positionKey(latlng);
      const colors = seenColors.get(key) || [];
      colors.push(options.fillColor || options.color || '#286eaf');
      seenColors.set(key, colors);
    } catch (_) {}
    return originalCircleMarker.call(this, latlng, options);
  };

  const originalMarker = L.marker;
  L.marker = function(latlng, options = {}) {
    try {
      const iconOptions = options.icon?.options;
      if (iconOptions?.className === 'shared-position-icon' && typeof iconOptions.html === 'string') {
        const key = positionKey(latlng);
        const countMatch = String(options.title || '').match(/de\s+(\d+)\s+entități/);
        const count = Math.max(2, Number(countMatch?.[1] || 2));
        const colors = (seenColors.get(key) || []).slice(-count);
        const back = colors[0] || '#286eaf';
        const front = colors[1] || back;
        const html = iconOptions.html.replace(
          'class="shared-position-marker"',
          `class="shared-position-marker" style="--shared-back:${back};--shared-front:${front}"`
        );
        options = {...options, icon: L.divIcon({...iconOptions, html})};
      }
    } catch (_) {}
    return originalMarker.call(this, latlng, options);
  };
})();
