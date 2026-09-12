'use strict';

(async () => {
  const CHUNKS = [
    'data/transport/parity-192-01.b64',
    'data/transport/parity-192-02.b64',
    'data/transport/parity-192-03.b64'
  ];
  const EXPECTED_FEATURES = 192;
  const EXPECTED_POSITIONS = 187;

  const status = document.getElementById('status');
  const setStatus = (text, ok=false) => {
    status.textContent = text;
    status.dataset.state = ok ? 'ok' : 'pending';
  };

  function decodeBase64(text) {
    const binary = atob(text.replace(/\s+/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function loadGeoJSON() {
    const parts = await Promise.all(CHUNKS.map(async path => {
      const r = await fetch(path, {cache: 'no-store'});
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${path}`);
      return r.text();
    }));
    const gz = decodeBase64(parts.join(''));
    const stream = new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip'));
    const text = await new Response(stream).text();
    return JSON.parse(text);
  }

  function validate(data) {
    if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) throw new Error('Invalid FeatureCollection');
    if (data.features.length !== EXPECTED_FEATURES) throw new Error(`Expected ${EXPECTED_FEATURES} features, got ${data.features.length}`);
    const ids = new Set();
    const positions = new Set();
    const historical = new Set();
    for (const feature of data.features) {
      const p = feature.properties || {};
      const c = feature.geometry?.coordinates;
      if (feature.geometry?.type !== 'Point' || !Array.isArray(c) || c.length < 2) throw new Error(`Invalid geometry: ${p.ID || '?'}`);
      if (!/^WG_LOC_\d{4}$/.test(p.ID || '')) throw new Error(`Invalid primary ID: ${p.ID || '?'}`);
      if (ids.has(p.ID)) throw new Error(`Duplicate primary ID: ${p.ID}`);
      ids.add(p.ID);
      String(p.HistoricalEntityIDs || p.ID).split(';').map(x => x.trim()).filter(Boolean).forEach(x => historical.add(x));
      positions.add(`${Number(c[0]).toFixed(7)},${Number(c[1]).toFixed(7)}`);
      if (p.SemanticParity !== 'PASS') throw new Error(`Semantic parity failure: ${p.ID}`);
    }
    if (positions.size !== EXPECTED_POSITIONS) throw new Error(`Expected ${EXPECTED_POSITIONS} distinct positions, got ${positions.size}`);
    if (historical.size !== 193) throw new Error(`Expected 193 preserved historical WG_LOC IDs, got ${historical.size}`);
    return {positions: positions.size, historical: historical.size};
  }

  const palette = {
    'Daco-Romanians': '#286eaf',
    'Aromanians': '#c13b3b',
    'Daco-Romanians + Aromanians': '#7b4aad',
    'Toponyms': '#2f8a4a'
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function popup(feature) {
    const p = feature.properties || {};
    const warning = p.Notes ? `<p class="warning">${escapeHtml(p.Notes)}</p>` : '';
    return `
      <div class="popup">
        <h3>${escapeHtml(p.Name)}</h3>
        <dl>
          <dt>Group</dt><dd>${escapeHtml(p.Group || 'Toponym')}</dd>
          <dt>Place</dt><dd>${escapeHtml(p.WeigandName)}</dd>
          <dt>Location</dt><dd>${escapeHtml(p.HistoricalLocation)}</dd>
          <dt>Modern identification</dt><dd>${escapeHtml(p.ModernIdentification)}</dd>
          <dt>Source</dt><dd>${escapeHtml(p.Source)}</dd>
          <dt>Position type</dt><dd>${escapeHtml(p.PointType)}</dd>
        </dl>
        ${warning}
        <p>${escapeHtml(p.Description)}</p>
        <details><summary>Internal synchronization</summary><p>${escapeHtml(p.HistoricalEntityIDs)}</p></details>
      </div>`;
  }

  try {
    setStatus('Loading 192-marker parity dataset…');
    if (!window.L) throw new Error('Leaflet not loaded');
    if (typeof DecompressionStream === 'undefined') throw new Error('Browser does not support gzip DecompressionStream');
    const data = await loadGeoJSON();
    const qa = validate(data);

    const map = L.map('map').setView([42.6, 24.8], 7);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const group = L.featureGroup().addTo(map);
    for (const feature of data.features) {
      const p = feature.properties || {};
      const [lon, lat] = feature.geometry.coordinates;
      const key = p.PublicLayer === 'Toponyms' ? 'Toponyms' : p.Group;
      const marker = L.circleMarker([lat, lon], {
        radius: 6,
        weight: 2,
        color: '#fff',
        fillColor: palette[key] || '#666',
        fillOpacity: 0.95
      }).bindPopup(popup(feature), {maxWidth: 430});
      group.addLayer(marker);
    }
    if (group.getLayers().length) map.fitBounds(group.getBounds(), {padding:[20,20]});

    document.getElementById('features').textContent = data.features.length;
    document.getElementById('positions').textContent = qa.positions;
    document.getElementById('historical').textContent = qa.historical;
    setStatus('PASS — 192 public markers loaded with 187 distinct website positions and 193 preserved historical WG_LOC identities.', true);
  } catch (error) {
    setStatus(`FAIL — ${error.message}`);
    console.error(error);
  }
})();
