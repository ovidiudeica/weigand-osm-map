'use strict';

// UI-only enhancements for shared OSM positions and modern place labels.
// Datasets and canonical coordinates remain untouched.
(() => {
  if (!window.L) return;

  const LABEL_ZOOM = 9;
  const labelsByPosition = new Map();
  const markerOrdinal = new Map();
  const seenColors = new Map();

  const positionKey = value => {
    const ll = L.latLng(value);
    return `${Number(ll.lat).toFixed(7)},${Number(ll.lng).toFixed(7)}`;
  };

  const modernPlaceName = properties => {
    const modern = String(properties?.ModernIdentification || '').trim();
    if (modern.includes(',')) {
      const first = modern.split(',', 1)[0].trim();
      if (first) return first;
    }
    return String(properties?.Name || properties?.name || properties?.WG_LOC || properties?.ID || '').trim();
  };

  const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[character]);

  // Public UI keeps the bibliographic citation but suppresses raw storage URLs.
  // The underlying canonical datasets remain byte-for-byte unchanged.
  const publicSourceText = value => String(value ?? '')
    .replace(/\s*(?:[—–-]\s*)?https?:\/\/\S+/gi, '')
    .replace(/\s*[—–-]\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const installPublicSourceFilter = () => {
    const currentField = window.field;
    if (typeof currentField !== 'function') return false;
    if (currentField.__weigandPublicSourceFilter) return true;

    const wrappedField = function(properties, key) {
      const value = currentField(properties, key);
      return key === 'sources' ? publicSourceText(value) : value;
    };
    wrappedField.__weigandPublicSourceFilter = true;
    window.field = wrappedField;
    return true;
  };

  let sourceFilterAttempts = 0;
  const sourceFilterTimer = window.setInterval(() => {
    sourceFilterAttempts += 1;
    if (installPublicSourceFilter() || sourceFilterAttempts >= 100) {
      window.clearInterval(sourceFilterTimer);
    }
  }, 0);

  const syncMapLabelState = map => {
    const container = map?.getContainer?.();
    if (!container) return;
    const zoom = map.getZoom();
    container.classList.toggle('osm-labels-visible', zoom >= LABEL_ZOOM);
    container.dataset.labelZoom = String(zoom);
  };

  // Capture the atlas map without changing app.js, so label visibility can follow zoom.
  const originalMap = L.map;
  L.map = function(...args) {
    const map = originalMap.apply(this, args);
    const sync = () => syncMapLabelState(map);
    map.on('zoomend', sync);
    map.whenReady(sync);
    return map;
  };

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = String(args[0]?.url || args[0] || '');
    if (/weigand-osm-v1\.0(?:-strict)?\.geojson\.gz(?:[?#].*)?$/.test(url)) {
      try {
        const clone = response.clone();
        const stream = clone.body.pipeThrough(new DecompressionStream('gzip'));
        const data = JSON.parse(await new Response(stream).text());
        labelsByPosition.clear();
        markerOrdinal.clear();
        for (const feature of data.features || []) {
          if (feature?.geometry?.type !== 'Point') continue;
          const [lon, lat] = feature.geometry.coordinates || [];
          const key = positionKey([lat, lon]);
          const label = modernPlaceName(feature.properties);
          if (!labelsByPosition.has(key)) labelsByPosition.set(key, []);
          labelsByPosition.get(key).push(label);
        }
      } catch (_) {
        // Labels are progressive enhancement; the atlas must keep working if this fails.
      }
    }
    return response;
  };

  const originalCircleMarker = L.circleMarker;
  L.circleMarker = function(latlng, options = {}) {
    const key = positionKey(latlng);

    const colors = seenColors.get(key) || [];
    colors.push(options.fillColor || options.color || '#286eaf');
    seenColors.set(key, colors);

    const layer = originalCircleMarker.call(this, latlng, options);
    const labels = labelsByPosition.get(key) || [];
    const ordinal = markerOrdinal.get(key) || 0;
    markerOrdinal.set(key, ordinal + 1);
    const label = labels[ordinal] || labels[0];

    if (label) {
      layer.bindTooltip(label, {
        permanent: true,
        direction: 'right',
        offset: [9, 0],
        className: 'osm-place-label',
        opacity: 1,
        interactive: false
      });

      const forceLabel = () => {
        const tooltip = layer.getTooltip?.();
        if (!tooltip?.isOpen?.()) layer.openTooltip();
        tooltip?.getElement?.()?.classList.add('osm-label-force');
      };
      const releaseLabel = () => {
        layer.getTooltip?.()?.getElement?.()?.classList.remove('osm-label-force');
      };

      layer.on('mouseover', forceLabel);
      layer.on('mouseout', releaseLabel);
      layer.on('add', () => {
        const element = layer.getElement?.();
        if (!element || element.dataset.osmLabelFocusBound === 'true') return;
        element.dataset.osmLabelFocusBound = 'true';
        element.addEventListener('focus', forceLabel);
        element.addEventListener('blur', releaseLabel);
      });
    }
    return layer;
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
        const labels = (labelsByPosition.get(key) || []).slice(0, count);
        const back = colors[0] || '#286eaf';
        const front = colors[1] || back;

        let html = iconOptions.html.replace(
          'class="shared-position-marker"',
          `class="shared-position-marker" style="--shared-back:${back};--shared-front:${front}"`
        );

        const labelHTML = labels.slice(0, 2).map((label, index) =>
          `<span class="shared-position-marker__label shared-position-marker__label--${index}">${escapeHTML(label)}</span>`
        ).join('');
        html = html.replace(/<\/span>\s*$/, `${labelHTML}</span>`);

        options = {...options, icon: L.divIcon({...iconOptions, html})};
      }
    } catch (_) {}
    return originalMarker.call(this, latlng, options);
  };
})();
