'use strict';

// M5 RC transport adapter. The controlled GitHub connector can write UTF-8
// text but not binary gzip payloads. Each deterministic M4 gzip file is
// therefore stored losslessly as Base64 text. Large payloads are split into
// text chunks; the adapter concatenates and reconstructs the exact gzip bytes
// before app.js performs normal DecompressionStream I/O.
(() => {
  const nativeFetch = window.fetch.bind(window);
  const encoded = {
    'data/weigand-osm-v0.24.geojson.gz': [
      'data/transport/full-01.b64','data/transport/full-gap.b64',
      'data/transport/full-02.b64','data/transport/full-03.b64',
      'data/transport/full-04.b64'
    ],
    'data/weigand-osm-v0.24-strict.geojson.gz': [
      'data/transport/strict-prefix-1.b64','data/transport/strict-prefix-2.b64',
      'data/transport/strict-prefix-3.b64','data/transport/strict-02.b64',
      'data/transport/strict-03.b64','data/transport/strict-04.b64'
    ],
    'data/weigand-osm-v0.24-no-geometry.csv.gz': ['data/transport/noGeometry.b64'],
    'data/weigand-osm-v0.24-semantic-225.csv.gz': [
      'data/transport/semantic-01.b64','data/transport/semantic-gap-1.b64',
      'data/transport/semantic-gap-2.b64','data/transport/semantic-02.b64',
      'data/transport/semantic03-1.b64','data/transport/semantic03-2.b64',
      'data/transport/semantic03-3.b64','data/transport/semantic-04.b64'
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
