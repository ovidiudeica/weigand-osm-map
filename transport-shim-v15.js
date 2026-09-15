'use strict';

// v1.5 CC-0002 candidate transport adapter: reconstructs deterministic gzip payloads from UTF-8 Base64 chunks.
(() => {
  const nativeFetch = window.fetch.bind(window);
  const encoded = {
    "data/weigand-osm-v1.5.geojson.gz": [
      "data/transport-v15/v15-full-01.b64",
      "data/transport-v15/v15-full-02.b64",
      "data/transport-v15/v15-full-03a.b64",
      "data/transport-v15/v15-full-03b.b64",
      "data/transport-v15/v15-full-03c.b64",
      "data/transport-v15/v15-full-03d.b64",
      "data/transport-v15/v15-full-03e.b64",
      "data/transport-v15/v15-full-03f.b64",
      "data/transport-v15/v15-full-04.b64"
    ],
    "data/weigand-osm-v1.5-strict.geojson.gz": [
      "data/transport-v15/v15-strict-s01.b64",
      "data/transport-v15/v15-strict-s02.b64",
      "data/transport-v15/v15-strict-s03.b64",
      "data/transport-v15/v15-strict-s04.b64",
      "data/transport-v15/v15-strict-s05.b64",
      "data/transport-v15/v15-strict-s06.b64"
    ],
    "data/weigand-osm-v1.5-no-geometry.csv.gz": [
      "data/transport-v15/v15-noGeometry-01.b64"
    ],
    "data/weigand-osm-v1.5-semantic-236.csv.gz": [
      "data/transport-v15/v15-semantic-01.b64",
      "data/transport-v15/v15-semantic-02.b64",
      "data/transport-v15/v15-semantic-03.b64"
    ]
  };
  const cache = new Map();

  const normalize = input => {
    const value = typeof input === 'string' ? input : input?.url || '';
    try {
      const u = new URL(value, window.location.href);
      const marker = '/weigand-osm-map/';
      const i = u.pathname.indexOf(marker);
      return (i >= 0 ? u.pathname.slice(i + marker.length) : u.pathname.replace(/^\//, '')).split(/[?#]/,1)[0];
    } catch (_) {
      return value.replace(/^\.\//, '').split(/[?#]/,1)[0];
    }
  };

  const decode = b64 => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    return bytes;
  };

  async function getBytes(paths, init) {
    const key=paths.join('|');
    if(!cache.has(key)){
      cache.set(key, Promise.all(paths.map(async path => {
        const response=await nativeFetch(path, init);
        if(!response.ok) throw new Error(`Eroare HTTP ${response.status} pentru ${path}.`);
        return (await response.text()).replace(/\s+/g,'');
      })).then(parts=>decode(parts.join(''))));
    }
    return cache.get(key);
  }

  window.fetch = async (input, init) => {
    const key=normalize(input);
    const paths=encoded[key];
    if(!paths) return nativeFetch(input,init);
    const bytes=await getBytes(paths,init);
    return new Response(bytes,{status:200,headers:{'Content-Type':'application/gzip','Cache-Control':'no-cache'}});
  };
})();
