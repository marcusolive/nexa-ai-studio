const Kit = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const later = fn => (reduced ? fn() : setTimeout(fn, 40));

  const ICONS = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6 6 0 0 1 3.5 6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>',
    bed: '<path d="M2 18V6"/><path d="M2 12h20v6"/><path d="M22 18v-4"/><path d="M6 12V9a2 2 0 0 1 2-2h4v5"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 6-10 16-10 0 10-4 16-9 17z"/><path d="M4 21c4-6 8-9 12-11"/>',
    drop: '<path d="M12 2.7l5.7 5.6a8 8 0 1 1-11.3 0z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    bank: '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8"/><path d="M3 20h18"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
    plug: '<path d="M9 7V2M15 7V2"/><path d="M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
    wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v13H5a2 2 0 0 1-2-2V5"/><path d="M16 14h.01"/>',
    swap: '<path d="M7 7h13l-4-4M17 17H4l4 4"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    filter: '<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    pill: '<path d="M10.5 20.5a5 5 0 0 1-7-7l10-10a5 5 0 0 1 7 7z"/><path d="M8.5 8.5l7 7"/>',
    thermo: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/>'
  };
  const icon = (name, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  const fmt = {
    money: (v, cur = 'USD', loc = 'en-US') => new Intl.NumberFormat(loc, { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(v),
    money2: (v, cur = 'USD', loc = 'en-US') => new Intl.NumberFormat(loc, { style: 'currency', currency: cur }).format(v),
    num: (v, d = 0) => new Intl.NumberFormat('en-US', { maximumFractionDigits: d, minimumFractionDigits: d }).format(v),
    pct: (v, d = 1) => `${v.toFixed(d)}%`,
    compact: v => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
  };

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function tooltip(host) {
    let tip = $('.tip', host);
    if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip); }
    return {
      show(x, y, html) { tip.innerHTML = html; tip.style.left = `${x}px`; tip.style.top = `${y}px`; tip.style.opacity = 1; },
      hide() { tip.style.opacity = 0; }
    };
  }

  function line(host, { labels, series, height = 240, area = true, format = v => fmt.num(v) }) {
    host.classList.add('chart');
    host.innerHTML = '';
    const w = host.clientWidth || 600, h = height, pad = { l: 44, r: 12, t: 12, b: 26 };
    const all = series.flatMap(s => s.data);
    const max = Math.max(...all) * 1.1, min = Math.min(0, Math.min(...all));
    const x = i => pad.l + (i * (w - pad.l - pad.r)) / (labels.length - 1);
    const y = v => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);
    const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, height: h });
    for (let k = 0; k <= 4; k++) {
      const v = min + ((max - min) * k) / 4, yy = y(v);
      svg.appendChild(svgEl('line', { x1: pad.l, x2: w - pad.r, y1: yy, y2: yy, stroke: '#eef0f3' }));
      const t = svgEl('text', { x: pad.l - 8, y: yy + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#80868b' });
      t.textContent = fmt.compact(v); svg.appendChild(t);
    }
    const step = Math.ceil(labels.length / 8);
    labels.forEach((l, i) => {
      if (i % step) return;
      const t = svgEl('text', { x: x(i), y: h - 6, 'text-anchor': 'middle', 'font-size': 11, fill: '#80868b' });
      t.textContent = l; svg.appendChild(t);
    });
    series.forEach((s, si) => {
      const d = s.data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('');
      if (area && si === 0) {
        const gid = `g${Math.random().toString(36).slice(2)}`;
        const defs = svgEl('defs');
        const g = svgEl('linearGradient', { id: gid, x1: 0, x2: 0, y1: 0, y2: 1 });
        g.appendChild(svgEl('stop', { offset: '0', 'stop-color': s.color, 'stop-opacity': '.22' }));
        g.appendChild(svgEl('stop', { offset: '1', 'stop-color': s.color, 'stop-opacity': '0' }));
        defs.appendChild(g); svg.appendChild(defs);
        svg.appendChild(svgEl('path', { d: `${d}L${x(s.data.length - 1)},${y(min)}L${x(0)},${y(min)}Z`, fill: `url(#${gid})` }));
      }
      const p = svgEl('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2.2, 'stroke-dasharray': s.dashed ? '5 5' : '', 'stroke-linejoin': 'round' });
      if (!s.dashed) p.dataset.draw = '1';
      svg.appendChild(p);
    });
    const cursor = svgEl('line', { y1: pad.t, y2: h - pad.b, stroke: '#bdc1c6', 'stroke-dasharray': '3 3', opacity: 0 });
    svg.appendChild(cursor);
    host.appendChild(svg);
    $$('path[data-draw]', svg).forEach(p => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      later(() => { p.style.transition = 'stroke-dashoffset 1.2s ease'; p.style.strokeDashoffset = 0; });
    });
    const tip = tooltip(host);
    svg.addEventListener('mousemove', e => {
      const r = svg.getBoundingClientRect(), mx = ((e.clientX - r.left) / r.width) * w;
      const i = Math.max(0, Math.min(labels.length - 1, Math.round(((mx - pad.l) / (w - pad.l - pad.r)) * (labels.length - 1))));
      cursor.setAttribute('x1', x(i)); cursor.setAttribute('x2', x(i)); cursor.setAttribute('opacity', 1);
      tip.show((x(i) / w) * r.width, (y(series[0].data[i]) / h) * r.height, `<b>${labels[i]}</b><br>${series.map(s => `<span style="color:${s.color}">●</span> ${s.name}: ${format(s.data[i])}`).join('<br>')}`);
    });
    svg.addEventListener('mouseleave', () => { cursor.setAttribute('opacity', 0); tip.hide(); });
    legend(host, series.map(s => ({ label: s.name, color: s.color })));
  }

  function bars(host, { labels, data, color = 'var(--brand)', height = 220, format = v => fmt.num(v), colors }) {
    host.classList.add('chart');
    host.innerHTML = '';
    const w = host.clientWidth || 600, h = height, pad = { l: 40, r: 8, t: 10, b: 26 };
    const max = Math.max(...data.map(Math.abs)) * 1.15, hasNeg = data.some(v => v < 0);
    const zero = hasNeg ? pad.t + (h - pad.t - pad.b) / 2 : h - pad.b;
    const scale = (hasNeg ? (h - pad.t - pad.b) / 2 : h - pad.t - pad.b) / max;
    const bw = ((w - pad.l - pad.r) / data.length) * 0.62, gap = ((w - pad.l - pad.r) / data.length) * 0.38;
    const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, height: h });
    svg.appendChild(svgEl('line', { x1: pad.l, x2: w - pad.r, y1: zero, y2: zero, stroke: '#dadce0' }));
    const tip = tooltip(host);
    data.forEach((v, i) => {
      const bx = pad.l + i * (bw + gap) + gap / 2, bh = Math.abs(v) * scale;
      const c = colors ? colors[i] : (v < 0 ? 'var(--bad)' : color);
      const r = svgEl('rect', { x: bx, y: zero, width: bw, height: 0, rx: 4, fill: c });
      r.style.transition = `all .7s cubic-bezier(.2,.7,.2,1) ${i * 40}ms`;
      svg.appendChild(r);
      later(() => { r.setAttribute('y', v < 0 ? zero : zero - bh); r.setAttribute('height', bh); });
      r.addEventListener('mousemove', e => { const b = svg.getBoundingClientRect(); tip.show(e.clientX - b.left, e.clientY - b.top, `<b>${labels[i]}</b>: ${format(v)}`); });
      r.addEventListener('mouseleave', tip.hide);
      const t = svgEl('text', { x: bx + bw / 2, y: h - 6, 'text-anchor': 'middle', 'font-size': 11, fill: '#80868b' });
      t.textContent = labels[i]; svg.appendChild(t);
    });
    host.appendChild(svg);
  }

  function donut(host, { items, size = 180, center, format = v => fmt.num(v) }) {
    host.classList.add('chart');
    host.innerHTML = '';
    const total = items.reduce((a, b) => a + b.value, 0), r = size / 2 - 14, c = 2 * Math.PI * r;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:20px;flex-wrap:wrap';
    const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size });
    svg.style.width = `${size}px`;
    svg.appendChild(svgEl('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: '#eef1f5', 'stroke-width': 18 }));
    let off = 0;
    items.forEach(it => {
      const len = (it.value / total) * c;
      const s = svgEl('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: it.color, 'stroke-width': 18, 'stroke-dasharray': `0 ${c}`, 'stroke-dashoffset': -off, transform: `rotate(-90 ${size / 2} ${size / 2})` });
      s.style.transition = 'stroke-dasharray 1s ease';
      svg.appendChild(s);
      later(() => s.setAttribute('stroke-dasharray', `${len} ${c - len}`));
      off += len;
    });
    if (center) {
      const t1 = svgEl('text', { x: size / 2, y: size / 2 - 2, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 600, fill: '#1f2328' }); t1.textContent = center.value;
      const t2 = svgEl('text', { x: size / 2, y: size / 2 + 18, 'text-anchor': 'middle', 'font-size': 11, fill: '#80868b' }); t2.textContent = center.label;
      svg.append(t1, t2);
    }
    wrap.appendChild(svg);
    const lg = document.createElement('div');
    lg.style.cssText = 'display:grid;gap:8px;font-size:13px;min-width:140px';
    lg.innerHTML = items.map(it => `<div style="display:flex;align-items:center;gap:8px"><i style="width:10px;height:10px;border-radius:3px;background:${it.color}"></i><span style="flex:1;color:var(--muted)">${it.label}</span><b>${format(it.value)}</b></div>`).join('');
    wrap.appendChild(lg);
    host.appendChild(wrap);
  }

  function spark(host, data, color = 'var(--brand)') {
    const w = 120, h = 36, max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / (max - min || 1)) * (h - 4)}`).join(' ');
    host.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/></svg>`;
  }

  function legend(host, items) {
    const lg = document.createElement('div');
    lg.className = 'legend';
    lg.innerHTML = items.map(i => `<span><i style="background:${i.color}"></i>${i.label}</span>`).join('');
    host.appendChild(lg);
  }

  function table(host, { columns, rows, pageSize = 8, searchable = true, filters = [], onRow }) {
    let q = '', sortKey = null, dir = 1, page = 0;
    const state = {};
    host.innerHTML = `
      <div class="tbl-tools">
        ${searchable ? `<input type="search" placeholder="Filter" aria-label="Filter rows" style="flex:1;max-width:280px">` : ''}
        ${filters.map((f, i) => `<select data-f="${i}" aria-label="${f.label}"><option value="">${f.label}: all</option>${f.options.map(o => `<option>${o}</option>`).join('')}</select>`).join('')}
      </div>
      <div class="tbl-wrap"><table class="t"><thead><tr>${columns.map(c => `<th data-k="${c.key}" class="${c.num ? 'num' : ''}">${c.label}</th>`).join('')}</tr></thead><tbody></tbody></table></div>
      <div class="pager"><span></span><button data-p="-1" aria-label="Previous page">‹</button><button data-p="1" aria-label="Next page">›</button></div>`;
    const tbody = $('tbody', host), info = $('.pager span', host);
    function view() {
      let list = rows.filter(r => !q || columns.some(c => String(r[c.key]).toLowerCase().includes(q)));
      filters.forEach((f, i) => { if (state[i]) list = list.filter(r => String(r[f.key]) === state[i]); });
      if (sortKey) list = [...list].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0) * dir);
      const pages = Math.max(1, Math.ceil(list.length / pageSize));
      page = Math.min(page, pages - 1);
      const slice = list.slice(page * pageSize, page * pageSize + pageSize);
      tbody.innerHTML = slice.length ? slice.map((r, i) => `<tr data-i="${rows.indexOf(r)}">${columns.map(c => `<td class="${c.num ? 'num' : ''}">${c.render ? c.render(r[c.key], r) : r[c.key]}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${columns.length}" class="empty">No results</td></tr>`;
      info.textContent = `${list.length ? page * pageSize + 1 : 0}–${Math.min(list.length, (page + 1) * pageSize)} of ${list.length}`;
    }
    $('input', host)?.addEventListener('input', e => { q = e.target.value.toLowerCase(); page = 0; view(); });
    $$('select[data-f]', host).forEach(s => s.addEventListener('change', () => { state[s.dataset.f] = s.value; page = 0; view(); }));
    $$('th', host).forEach(th => th.addEventListener('click', () => { const k = th.dataset.k; dir = sortKey === k ? -dir : 1; sortKey = k; view(); }));
    $$('.pager button', host).forEach(b => b.addEventListener('click', () => { page = Math.max(0, page + Number(b.dataset.p)); view(); }));
    tbody.addEventListener('click', e => { const tr = e.target.closest('tr[data-i]'); if (tr && onRow) onRow(rows[Number(tr.dataset.i)]); });
    view();
    return { refresh(newRows) { rows = newRows; view(); } };
  }

  let scrim, modalEl, toastEl, toastTimer;
  function ensureOverlays() {
    if (scrim) return;
    scrim = document.createElement('div'); scrim.className = 'scrim';
    modalEl = document.createElement('div'); modalEl.className = 'modal'; modalEl.setAttribute('role', 'dialog'); modalEl.setAttribute('aria-modal', 'true');
    toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status');
    document.body.append(scrim, modalEl, toastEl);
    scrim.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }
  function openModal({ title, body, actions = [] }) {
    ensureOverlays();
    modalEl.innerHTML = `<div class="mh"><h2>${title}</h2><button class="x" aria-label="Close">×</button></div><div class="mb">${body}</div>${actions.length ? `<div class="mf">${actions.map((a, i) => `<button class="btn ${a.primary ? 'primary' : ''}" data-a="${i}">${a.label}</button>`).join('')}</div>` : ''}`;
    scrim.classList.add('on'); modalEl.classList.add('on');
    $('.x', modalEl).onclick = closeModal;
    $$('[data-a]', modalEl).forEach(b => b.onclick = () => { const a = actions[Number(b.dataset.a)]; if (!a.onClick || a.onClick(modalEl) !== false) closeModal(); });
    return modalEl;
  }
  function closeModal() { if (!modalEl) return; scrim.classList.remove('on'); modalEl.classList.remove('on'); }
  function toast(msg, action) {
    ensureOverlays();
    toastEl.innerHTML = `<span>${msg}</span>${action ? `<b>${action}</b>` : ''}`;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('on'), 2600);
  }

  function countUp(el, to, format = v => fmt.num(v)) {
    if (reduced) { el.textContent = format(to); return; }
    const start = performance.now(), dur = 900;
    const tick = now => {
      const p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = format(to * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const route = () => location.hash.replace(/^#\/?/, '');

  function shell() {
    $$('[data-icon]').forEach(el => { el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)); });
    const views = $$('.view'), links = $$('.side a[data-view]');
    function go(id) {
      views.forEach(v => v.classList.toggle('on', v.id === id));
      links.forEach(a => a.classList.toggle('on', a.dataset.view === id));
      document.body.classList.remove('nav');
      if (route() !== id) history.replaceState(null, '', `#/${id}`);
      document.dispatchEvent(new CustomEvent('view', { detail: id }));
      window.scrollTo({ top: 0 });
    }
    links.forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(a.dataset.view); }));
    $('.burger')?.addEventListener('click', () => document.body.classList.toggle('nav'));
    const search = $('.search input');
    document.addEventListener('keydown', e => { if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search?.focus(); } });
    const first = route();
    go(views.some(v => v.id === first) ? first : views[0]?.id);
    window.addEventListener('hashchange', () => { const id = route(); if (views.some(v => v.id === id)) go(id); });
    return { go };
  }

  function rng(seed = 7) {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  return { $, $$, icon, fmt, line, bars, donut, spark, table, openModal, closeModal, toast, countUp, shell, rng };
})();
