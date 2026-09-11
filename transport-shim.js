'use strict';

// M9 v1.0 transport adapter. The GitHub connector writes UTF-8 text, so the
// four M8-verified deterministic gzip payloads are stored losslessly as Base64.
// The adapter reconstructs the exact gzip bytes before app.js decompresses them.
(() => {
  const nativeFetch = window.fetch.bind(window);
  const encoded = {
    'data/weigand-osm-v1.0.geojson.gz': [
      'data/transport/v1-full-01.b64','data/transport/v1-full-02.b64',
      'data/transport/v1-full-03.b64','data/transport/v1-full-04.b64'
    ],
    'data/weigand-osm-v1.0-strict.geojson.gz': [
      'data/transport/v1-strict-01.b64','data/transport/v1-strict-02.b64',
      'data/transport/v1-strict-03.b64','data/transport/v1-strict-04.b64'
    ],
    'data/weigand-osm-v1.0-no-geometry.csv.gz': [
      'data/transport/v1-noGeometry-01.b64','data/transport/v1-noGeometry-02.b64'
    ],
    'data/weigand-osm-v1.0-semantic-225.csv.gz': [
      'data/transport/v1-semantic-01.b64','data/transport/v1-semantic-02.b64',
      'data/transport/v1-semantic-03.b64','data/transport/v1-semantic-04.b64',
      'data/transport/v1-semantic-05.b64'
    ]
  };
  const cache = new Map();

  const normalize = input => {
    const value = typeof input === 'string' ? input : input?.url || '';
    try {
      const u = new URL(value, window.location.href);
      const marker = '/weigand-osm-map/';
      const i = u.pathname.indexOf(marker);
      return (i >= 0 ? u.pathname.slice(i + marker.length) : u.pathname.replace(/^\//, ''))
        .split(/[?#]/, 1)[0];
    } catch (_) {
      return value.replace(/^\.\//, '').split(/[?#]/, 1)[0];
    }
  };

  const decode = b64 => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };

  async function getBytes(paths, init) {
    const key = paths.join('|');
    if (!cache.has(key)) {
      cache.set(key, Promise.all(paths.map(async path => {
        const response = await nativeFetch(path, init);
        if (!response.ok) throw new Error(`Eroare HTTP ${response.status} pentru ${path}.`);
        return (await response.text()).replace(/\s+/g, '');
      })).then(parts => decode(parts.join(''))));
    }
    return cache.get(key);
  }

  window.fetch = async (input, init) => {
    const key = normalize(input);
    const paths = encoded[key];
    if (!paths) return nativeFetch(input, init);
    const bytes = await getBytes(paths, init);
    return new Response(bytes, {
      status: 200,
      headers: {'Content-Type': 'application/gzip', 'Cache-Control': 'no-cache'}
    });
  };
})();
