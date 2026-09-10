'use strict';

const LAYERS = [
  {name: 'Romani / dacoromani', color: '#286eaf', aliases: ['romani', 'dacoromani', 'romani / dacoromani']},
  {name: 'Aromani', color: '#a84f83', aliases: ['aromani']},
  {name: 'Mixt romani-aromani', color: '#7965aa', aliases: ['mixt romani-aromani']},
  {name: 'Toponime', color: '#32785c', aliases: ['toponime']},
  {name: 'Localizari cu avertisment', color: '#b36b16', aliases: ['localizari cu avertisment']}
];

const FIELDS = {
  name: ['name', 'nume', 'Name', 'localitate', 'toponim'],
  id: ['WG_LOC', 'ID', 'id'],
  layer: ['strat', 'Strat', 'layer', 'Layer'],
  description: ['description', 'descriere', 'Description'],
  sources: ['sources', 'surse', 'Sources', 'source', 'Source'],
  notes: ['Notes', 'notes'],
  osmURL: ['OSMURL']
};

const normalize = value => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

function field(properties, key) {
  for (const alias of FIELDS[key] || [key]) {
    const value = properties[alias];
    if (value !== undefined && value !== null && value !== '') {
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
  }
  return '';
}

function layerIndex(properties) {
  const name = normalize(field(properties, 'layer'));
  return LAYERS.findIndex(layer => layer.aliases.includes(name));
}

function osmURL(properties) {
  const type = field(properties, 'OSMType').toLowerCase().trim();
  const id = field(properties, 'OSMID').trim();
  if (/^(node|way|relation)$/.test(type) && /^[1-9]\d*$/.test(id)) {
    return `https://www.openstreetmap.org/${type}/${id}`;
  }
  const url = field(properties, 'osmURL').trim();
  return /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/[1-9]\d*$/.test(url) ? url : null;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function details(properties) {
  const box = element('div');
  box.append(element('h3', field(properties, 'name') || field(properties, 'id') || 'Nume nespecificat'));

  const list = element('dl');
  for (const [label, key] of [
    ['WG_LOC / ID', 'id'],
    ['Strat', 'layer'],
    ['OSMStatus', 'OSMStatus'],
    ['PointType', 'PointType'],
    ['OSMType', 'OSMType'],
    ['OSMID', 'OSMID'],
    ['OSMURL (sursă)', 'osmURL'],
    ['Descriere', 'description'],
    ['Surse', 'sources'],
    ['Note', 'notes']
  ]) {
    list.append(element('dt', label), element('dd', field(properties, key) || 'Nespecificat'));
  }

  box.append(list);
  const url = osmURL(properties);
  if (url) {
    const link = element('a', 'Vezi obiectul OpenStreetMap ↗');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    box.append(link);
  }
  return box;
}

function validateGeoJSON(data, expected) {
  if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error('Este necesar un GeoJSON FeatureCollection.');
  }
  if (data.features.length !== expected) {
    throw new Error(`Setul trebuie să conțină ${expected} geometrii; fișierul conține ${data.features.length}.`);
  }

  const position = p => Array.isArray(p) && p.length >= 2 && p.every(Number.isFinite)
    && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90;
  const line = c => Array.isArray(c) && c.length >= 2 && c.every(position);
  const ring = c => line(c) && c.length >= 4 && JSON.stringify(c[0]) === JSON.stringify(c.at(-1));
  const polygon = c => Array.isArray(c) && c.length > 0 && c.every(ring);

  function geometry(g) {
    if (!g) return false;
    const c = g.coordinates;
    switch (g.type) {
      case 'Point': return position(c);
      case 'MultiPoint': return Array.isArray(c) && c.length > 0 && c.every(position);
      case 'LineString': return line(c);
      case 'MultiLineString': return Array.isArray(c) && c.length > 0 && c.every(line);
      case 'Polygon': return polygon(c);
      case 'MultiPolygon': return Array.isArray(c) && c.length > 0 && c.every(polygon);
      case 'GeometryCollection': return Array.isArray(g.geometries) && g.geometries.length > 0 && g.geometries.every(geometry);
      default: return false;
    }
  }

  for (const [i, feature] of data.features.entries()) {
    if (feature.type !== 'Feature' || !geometry(feature.geometry)) {
      throw new Error(`Geometrie invalidă la înregistrarea ${i + 1}.`);
    }
    if (!feature.properties || typeof feature.properties !== 'object'
        || Array.isArray(feature.properties) || layerIndex(feature.properties) < 0) {
      throw new Error(`Strat necunoscut la înregistrarea ${i + 1}. Verificați adaptorul FIELDS / LAYERS.`);
    }
  }
  return data;
}

// RFC 4180-style quoted fields, escaped quotes, CRLF and embedded newlines.
function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0];
  const delimiter = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';
  const rows = [];
  let row = [], value = '', quoted = false, closed = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { value += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else value += c;
    } else if (c === '"' && value === '' && !closed) quoted = true;
    else if (c === delimiter) { row.push(value); value = ''; closed = false; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(value);
      if (row.some(v => v !== '')) rows.push(row);
      row = []; value = ''; closed = false;
    } else {
      if (closed || c === '"') throw new Error('Format CSV invalid.');
      value += c;
    }
  }

  if (quoted) throw new Error('CSV cu ghilimele neînchise.');
  row.push(value);
  if (row.some(v => v !== '')) rows.push(row);

  const headers = (rows.shift() || []).map(h => h.trim());
  if (!headers.length || headers.some(h => !h) || new Set(headers).size !== headers.length) {
    throw new Error('Antet CSV invalid.');
  }

  return rows.map(values => {
    if (values.length !== headers.length) throw new Error('Număr de coloane CSV inconsistent.');
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

async function fetchText(url) {
  const response = await fetch(url, {signal: AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error(`Eroare HTTP ${response.status}.`);
  return response.text();
}

function pointKey(feature, index) {
  if (feature?.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
    const [lon, lat] = feature.geometry.coordinates;
    return `${Number(lon).toFixed(7)},${Number(lat).toFixed(7)}`;
  }
  return `non-point-${index}`;
}

function distinctPositionCount(records) {
  return new Set(records.map(record => record.positionKey)).size;
}

async function start() {
  const $ = id => document.getElementById(id);
  const status = $('status');
  const setStatus = (text, ready = false) => {
    status.textContent = text;
    status.dataset.state = ready ? 'ready' : 'error';
  };

  const configs = {
    full: {link: $('download-full'), expected: 142, expectedPositions: 140},
    strict: {link: $('download-strict'), expected: 136, expectedPositions: 135}
  };

  for (const config of Object.values(configs)) {
    config.link.addEventListener('click', event => {
      if (config.link.getAttribute('aria-disabled') === 'true') event.preventDefault();
    });
  }

  let csvRecords;
  $('no-geometry').addEventListener('click', async () => {
    $('missing-dialog').showModal();
    const content = $('missing-content');
    content.textContent = 'Se încarcă…';

    try {
      if (!csvRecords) {
        const rows = parseCSV(await fetchText($('no-geometry').dataset.source));
        if (rows.length !== 4) {
          throw new Error(`Sunt așteptate 4 cazuri; CSV-ul conține ${rows.length}.`);
        }
        csvRecords = rows;
      }

      content.replaceChildren();
      for (const record of csvRecords) {
        const article = element('article', undefined, 'record');
        article.append(details(record));

        const extra = element('dl');
        for (const [key, value] of Object.entries(record)) {
          extra.append(element('dt', key), element('dd', value || '—'));
        }
        const raw = element('details');
        raw.append(element('summary', 'Toate câmpurile originale'), extra);
        article.append(raw);
        content.append(article);
      }
    } catch (error) {
      content.textContent = error.message;
    }
  });

  const selected = new Set(LAYERS.map((_, i) => i));
  LAYERS.forEach((layer, i) => {
    const label = element('label');
    const input = element('input');
    const swatch = element('span', '', 'swatch');

    input.type = 'checkbox';
    input.checked = true;
    swatch.style.backgroundColor = layer.color;

    label.append(input, swatch, document.createTextNode(layer.name));
    $('filters').append(label);

    input.addEventListener('change', () => {
      input.checked ? selected.add(i) : selected.delete(i);
      render();
    });
  });

  let map, group, records = [], visible = [], sequence = 0, mode = 'full';
  const cache = {};

  if (!window.L) {
    setStatus('Leaflet nu s-a încărcat. Verifică conexiunea la internet și reîncarcă pagina.');
    return;
  }

  map = L.map('map').setView([42.75, 25.2], 7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  group = L.featureGroup().addTo(map);

  function bounds(layer) {
    return layer.getBounds ? layer.getBounds() : L.latLngBounds([layer.getLatLng()]);
  }

  function highlight(record) {
    document.querySelectorAll('#results button').forEach(button => {
      button.setAttribute('aria-current', String(button.dataset.record === String(record.index)));
    });
  }

  function overlapPopup(members) {
    const box = element('div');
    const title = element('h3', `${members.length} înregistrări la aceeași poziție OSM/reper`);
    const note = element(
      'p',
      'Marcatorul compus evită ascunderea entităților suprapuse. Coordonatele de cercetare nu sunt deplasate.'
    );
    box.append(title, note);

    members.forEach((record, i) => {
      if (i) box.append(document.createElement('hr'));
      box.append(details(record.properties));
    });
    return box;
  }

  function overlapMarker(members) {
    const center = bounds(members[0].layer).getCenter();
    const count = members.length;
    const icon = L.divIcon({
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      html: `<span title="${count} înregistrări la aceeași poziție" style="
        display:flex;align-items:center;justify-content:center;width:32px;height:32px;
        border-radius:50%;background:#16233a;color:#fff;border:3px solid #fff;
        box-shadow:0 2px 9px rgba(0,0,0,.35);font:700 13px/1 system-ui,sans-serif;
      ">${count}</span>`
    });

    const marker = L.marker(center, {
      icon,
      keyboard: true,
      title: `${count} înregistrări la aceeași poziție`,
      zIndexOffset: 1000
    });
    marker.bindPopup(() => overlapPopup(members), {maxWidth: 430});
    return marker;
  }

  function renderList() {
    const inView = $('in-view').checked;
    const listed = visible.filter(record => {
      const target = record.displayLayer || record.layer;
      return !inView || map.getBounds().intersects(bounds(target));
    });

    $('results').replaceChildren();
    $('count').textContent =
      `${listed.length} în listă · ${visible.length} rezultate filtrate · ` +
      `${distinctPositionCount(visible)} poziții cartografice distincte`;

    if (!listed.length) {
      $('results').append(element(
        'li',
        records.length ? 'Niciun rezultat pentru selecția curentă.' : 'Nu sunt încărcate date cartografice.'
      ));
    }

    for (const record of listed) {
      const li = element('li');
      const button = element('button');
      const swatch = element('span', '', 'swatch');

      button.type = 'button';
      button.dataset.record = record.index;
      swatch.style.backgroundColor = LAYERS[record.category].color;

      const collisionNote = record.collisionSize > 1 ? ` · poziție comună ×${record.collisionSize}` : '';
      button.append(
        swatch,
        document.createTextNode(` ${record.name}`),
        element(
          'small',
          `${field(record.properties, 'id') || 'ID nespecificat'} · ` +
          `${LAYERS[record.category].name}${collisionNote}`
        )
      );

      button.addEventListener('click', () => {
        const target = record.displayLayer || record.layer;
        map.fitBounds(bounds(target), {maxZoom: 14, padding: [35, 35], animate: false});

        if (target.getLatLng) target.openPopup();
        else target.openPopup(bounds(target).getCenter());

        highlight(record);
        if (window.matchMedia('(max-width:760px)').matches) {
          $('map').scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      });

      li.append(button);
      $('results').append(li);
    }
  }

  function render() {
    if (!map) return;

    map.closePopup();
    group.clearLayers();

    const query = normalize($('search').value);
    visible = records.filter(record => selected.has(record.category) && record.search.includes(query));

    records.forEach(record => { record.displayLayer = null; });

    const byPosition = new Map();
    for (const record of visible) {
      if (!byPosition.has(record.positionKey)) byPosition.set(record.positionKey, []);
      byPosition.get(record.positionKey).push(record);
    }

    for (const members of byPosition.values()) {
      if (members.length === 1) {
        members[0].displayLayer = members[0].layer;
        group.addLayer(members[0].layer);
      } else {
        const marker = overlapMarker(members);
        group.addLayer(marker);
        members.forEach(record => { record.displayLayer = marker; });
      }
    }

    renderList();
  }

  function fit() {
    if (group.getLayers().length) {
      map.fitBounds(group.getBounds(), {padding: [30, 30], maxZoom: 13});
    }
  }

  async function loadMode() {
    const request = ++sequence;
    records = [];
    render();
    setStatus('Se verifică setul selectat…');

    const current = mode;
    const config = configs[current];

    try {
      const data = cache[current]
        || validateGeoJSON(JSON.parse(await fetchText(config.link.getAttribute('href'))), config.expected);

      cache[current] = data;
      config.link.setAttribute('aria-disabled', 'false');
      if (request !== sequence) return;

      records = data.features.map((feature, index) => {
        const properties = feature.properties;
        const category = layerIndex(properties);
        const color = LAYERS[category].color;
        const name = field(properties, 'name') || field(properties, 'id') || 'Nume nespecificat';

        const layer = L.geoJSON(feature, {
          style: {color, weight: 3, fillOpacity: .2},
          pointToLayer: (_, latlng) => L.circleMarker(latlng, {
            radius: 7,
            color: '#fff',
            weight: 2,
            fillColor: color,
            fillOpacity: .9
          })
        });

        const record = {
          index,
          properties,
          category,
          name,
          layer,
          positionKey: pointKey(feature, index),
          search: normalize(
            `${name} ${field(properties, 'id')} ${field(properties, 'description')} ` +
            `${field(properties, 'OSMStatus')} ${field(properties, 'notes')}`
          )
        };

        layer.bindPopup(() => details(properties));
        layer.on('popupopen', () => highlight(record));
        return record;
      });

      const collisionCounts = new Map();
      for (const record of records) {
        collisionCounts.set(record.positionKey, (collisionCounts.get(record.positionKey) || 0) + 1);
      }
      records.forEach(record => {
        record.collisionSize = collisionCounts.get(record.positionKey) || 1;
      });

      const positions = distinctPositionCount(records);
      if (positions !== config.expectedPositions) {
        throw new Error(
          `Setul are ${positions} poziții distincte; sunt așteptate ${config.expectedPositions}.`
        );
      }

      render();
      fit();
      setStatus(
        `${current === 'full' ? 'Complet' : 'Strict'}: ` +
        `${records.length} geometrii · ${positions} poziții cartografice distincte.`,
        true
      );
    } catch (error) {
      if (request === sequence) {
        setStatus(`Set ${current === 'full' ? 'complet' : 'strict'}: ${error.message}`);
      }
    }
  }

  $('search').addEventListener('input', render);
  $('in-view').addEventListener('change', renderList);
  $('fit').addEventListener('click', fit);
  map.on('moveend', renderList);

  document.querySelectorAll('[name=mode]').forEach(input => {
    input.addEventListener('change', () => {
      mode = input.value;
      loadMode();
    });
  });

  await loadMode();
}

if (typeof document !== 'undefined') {
  start().catch(error => {
    document.getElementById('status').textContent = `Interfața nu a putut porni: ${error.message}`;
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    parseCSV,
    validateGeoJSON,
    layerIndex,
    osmURL,
    normalize,
    pointKey,
    distinctPositionCount
  };
}
