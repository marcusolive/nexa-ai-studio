(() => {
  const { $, $$, icon, fmt } = Kit;
  const nav = Kit.shell();
  const labels30 = Data.days(30);
  Data.budget.spent = Data.cost30.reduce((a, b) => a + b, 0);

  const statusBadge = s => {
    const map = { Live: 'ok', Success: 'ok', Indexed: 'ok', Paused: 'mute', Testing: 'info', Fallback: 'warn', Stale: 'warn', Indexing: 'info', Error: 'bad' };
    return `<span class="badge dot ${map[s] || 'mute'}">${s}</span>`;
  };

  $$('[data-go]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); nav.go(b.dataset.go); }));
  $('#agentCount').textContent = Data.agents.length;

  function renderOverview() {
    const today = Data.req30.at(-1), prev = Data.req30.at(-2);
    Kit.countUp($('#todayReq'), today);
    const avgLatency = Data.runs.reduce((a, r) => a + r.latency, 0) / Data.runs.length;
    const success = Data.runs.filter(r => r.status === 'Success').length / Data.runs.length * 100;
    const kpis = [
      { label: 'Requests (24h)', value: today, f: v => fmt.num(v), delta: (today - prev) / prev * 100, data: Data.req30.slice(-14), icon: 'chart' },
      { label: 'Resolution rate', value: success, f: v => fmt.pct(v), delta: 1.8, data: [91, 92, 92, 93, 94, 93, 95, 95, 96], icon: 'check' },
      { label: 'Avg latency', value: avgLatency, f: v => `${v.toFixed(2)} s`, delta: -6.2, invert: true, data: [2.6, 2.5, 2.4, 2.3, 2.2, 2.2, 2.1, 2.0], icon: 'clock' },
      { label: 'Cost this month', value: Data.budget.spent, f: v => fmt.money(v), delta: 4.1, invert: true, data: Data.cost30.slice(-14), icon: 'wallet' }
    ];
    $('#kpis').innerHTML = kpis.map((k, i) => `<div class="card kpi"><div class="lbl">${icon(k.icon)}${k.label}</div><div class="val" id="kv${i}">0</div><div class="delta ${(k.delta >= 0) !== !!k.invert ? 'up' : 'down'}">${k.delta >= 0 ? '▲' : '▼'} ${Math.abs(k.delta).toFixed(1)}% vs last period</div><div class="spark" id="ks${i}"></div></div>`).join('');
    kpis.forEach((k, i) => { Kit.countUp($(`#kv${i}`), k.value, k.f); Kit.spark($(`#ks${i}`), k.data, 'var(--brand)'); });
    drawReq(30);
    Kit.donut($('#modelDonut'), { items: Data.MODELS.map(m => ({ label: m.id, value: m.share, color: m.color })), center: { value: '4', label: 'models' }, format: v => `${v}%` });
    $('#recentRuns').innerHTML = Data.runs.slice(0, 5).map(r => `<div class="li"><span class="ic">${icon('bot')}</span><div class="grow"><b>${r.input}</b><small>${r.agent} · ${r.time} · ${r.latency}s</small></div>${statusBadge(r.status)}</div>`).join('');
    const checks = [['Model gateway', 'Operational', 'ok', 'plug'], ['Vector index (pgvector)', 'Operational', 'ok', 'doc'], ['Guardrails service', 'Operational', 'ok', 'shield'], ['Webhook delivery', 'Degraded · retries', 'warn', 'alert']];
    $('#health').innerHTML = checks.map(c => `<div class="li"><span class="ic">${icon(c[3])}</span><div class="grow"><b>${c[0]}</b><small>p95 ${(80 + Math.random() * 60).toFixed(0)} ms</small></div><span class="badge dot ${c[2]}">${c[1]}</span></div>`).join('');
  }

  function drawReq(n) {
    Kit.line($('#reqChart'), {
      labels: labels30.slice(-n),
      series: [{ name: 'Requests', color: '#6d4aff', data: Data.req30.slice(-n) }, { name: 'Errors', color: '#d93025', data: Data.err30.slice(-n), dashed: true }]
    });
  }
  $$('#range button').forEach(b => b.addEventListener('click', () => { $$('#range button').forEach(x => x.classList.toggle('on', x === b)); drawReq(Number(b.dataset.r)); }));

  let agentsTbl;
  function renderAgents() {
    agentsTbl = Kit.table($('#agentsTable'), {
      columns: [
        { key: 'name', label: 'Agent', render: (v, r) => `<b>${v}</b><br><span class="mono" style="color:var(--muted)">${r.id}</span>` },
        { key: 'model', label: 'Model', render: v => `<span class="mono">${v}</span>` },
        { key: 'kb', label: 'Knowledge base' },
        { key: 'status', label: 'Status', render: statusBadge },
        { key: 'runs', label: 'Runs (30d)', num: true, render: v => fmt.num(v) },
        { key: 'success', label: 'Success', num: true, render: v => `${v.toFixed(1)}%` },
        { key: 'latency', label: 'p50 latency', num: true, render: v => `${v.toFixed(1)} s` }
      ],
      rows: Data.agents,
      filters: [{ label: 'Status', key: 'status', options: ['Live', 'Testing', 'Paused'] }],
      onRow: openAgent
    });
  }

  function openAgent(a) {
    Kit.openModal({
      title: a.name,
      body: `<div class="grid g2" style="gap:12px"><div><small style="color:var(--muted)">Model</small><div class="mono">${a.model}</div></div><div><small style="color:var(--muted)">Status</small><div>${statusBadge(a.status)}</div></div><div><small style="color:var(--muted)">Knowledge base</small><div>${a.kb}</div></div><div><small style="color:var(--muted)">Success rate</small><div>${a.success}%</div></div></div>
        <div style="margin-top:16px"><small style="color:var(--muted)">System prompt</small><pre class="mono" style="white-space:pre-wrap;background:#f6f8fc;border:1px solid var(--line);border-radius:8px;padding:12px;margin-top:6px">You are the ${a.name.toLowerCase()} for ACME.\nAnswer only with information from the "${a.kb}" knowledge base.\nIf the answer is not there, say you do not know and offer a human handoff.\nAlways cite the source document.</pre></div>`,
      actions: [{ label: a.status === 'Live' ? 'Pause agent' : 'Set live', onClick: () => { a.status = a.status === 'Live' ? 'Paused' : 'Live'; agentsTbl.refresh(Data.agents); Kit.toast(`${a.name} is now ${a.status.toLowerCase()}`); } }, { label: 'Open in playground', primary: true, onClick: () => { $('#pgAgent').value = a.id; nav.go('playground'); } }]
    });
  }

  $$('[data-new-agent]').forEach(b => b.addEventListener('click', () => {
    Kit.openModal({
      title: 'New agent',
      body: `<form class="form" id="agentForm"><label>Name<input name="name" required placeholder="e.g. Returns assistant"></label>
        <label>Model<select name="model">${Data.MODELS.filter(m => m.id !== 'embeddings').map(m => `<option>${m.id}</option>`).join('')}</select></label>
        <label>Knowledge base<select name="kb">${[...new Set(Data.docs.map(d => d.kb))].map(k => `<option>${k}</option>`).join('')}</select></label>
        <label>Instructions<textarea name="prompt" placeholder="Describe what the agent should and should not answer"></textarea></label></form>`,
      actions: [{ label: 'Cancel' }, { label: 'Create agent', primary: true, onClick: m => {
        const f = new FormData($('#agentForm', m));
        if (!f.get('name').trim()) { $('#agentForm input', m).focus(); return false; }
        const a = { id: `ag_${f.get('name').toLowerCase().replace(/\W+/g, '_').slice(0, 14)}`, name: f.get('name').trim(), model: f.get('model'), kb: f.get('kb'), status: 'Testing', runs: 0, success: 0, latency: 0 };
        Data.agents.unshift(a); agentsTbl.refresh(Data.agents); $('#agentCount').textContent = Data.agents.length; fillAgentSelect();
        Kit.toast(`Agent "${a.name}" created in testing mode`, 'Open');
        nav.go('agents');
      } }]
    });
  }));

  function fillAgentSelect() { $('#pgAgent').innerHTML = Data.agents.map(a => `<option value="${a.id}">${a.name}</option>`).join(''); }

  const chat = $('#chat'), trace = $('#trace');
  const suggestions = ['What is the refund deadline for annual plans?', 'Do you store my card data?', 'How long is delivery to Canada?', 'How much is the Growth plan?'];
  $('#suggest').innerHTML = suggestions.map(s => `<button type="button">${s}</button>`).join('');
  $$('#suggest button').forEach(b => b.addEventListener('click', () => ask(b.textContent)));
  $('#ask').addEventListener('submit', e => { e.preventDefault(); const v = $('#askInput').value.trim(); if (v) ask(v); });
  chat.innerHTML = `<div class="msg a">Hi! I answer only from the knowledge base and always show the source. Try one of the questions below.</div>`;

  function ask(q) {
    $('#askInput').value = '';
    chat.insertAdjacentHTML('beforeend', `<div class="msg u">${q.replace(/</g, '&lt;')}</div>`);
    const hit = Data.answers.find(a => a.match.test(q));
    const text = hit ? hit.text : 'I could not find this in the knowledge base, so I will not guess. Would you like me to open a ticket with a human agent?';
    const sources = hit ? hit.sources : [];
    const steps = [
      ['Guardrails', 'Input checked: no PII, no prompt injection', '12 ms'],
      ['Embedding', 'Query embedded with text-embedding-3-small', '38 ms'],
      ['Retrieval', hit ? `${sources.length + 2} chunks found, top score 0.${86 + Math.floor(Math.random() * 10)}` : 'No chunk above threshold 0.75', '64 ms'],
      ['Generation', `${$('#pgAgent').selectedOptions[0].text} · ${hit ? 'grounded answer' : 'fallback answer'}`, `${(0.9 + Math.random()).toFixed(2)} s`],
      ['Output check', 'Citations present, no hallucinated facts', '9 ms']
    ];
    trace.innerHTML = '';
    steps.forEach((s, i) => setTimeout(() => trace.insertAdjacentHTML('beforeend', `<div class="step"><i>${i + 1}</i><div><b>${s[0]}</b><small>${s[1]}</small></div><code>${s[2]}</code></div>`), i * 260));
    const el = document.createElement('div');
    el.className = 'msg a caret';
    setTimeout(() => {
      chat.appendChild(el);
      const words = text.split(' ');
      let i = 0;
      const t = setInterval(() => {
        el.textContent = words.slice(0, ++i).join(' ');
        chat.scrollTop = chat.scrollHeight;
        if (i >= words.length) {
          clearInterval(t); el.classList.remove('caret');
          if (sources.length) el.insertAdjacentHTML('beforeend', `<div class="src">${sources.map(s => `<span>${s}</span>`).join('')}</div>`);
          chat.scrollTop = chat.scrollHeight;
        }
      }, 45);
    }, 1300);
  }

  let docsTbl;
  function renderKnowledge() {
    const chunks = Data.docs.reduce((a, d) => a + d.chunks, 0);
    const stats = [['Documents', Data.docs.length, 'doc'], ['Chunks indexed', chunks, 'chart'], ['Knowledge bases', new Set(Data.docs.map(d => d.kb)).size, 'bot'], ['Stale documents', Data.docs.filter(d => d.status === 'Stale').length, 'alert']];
    $('#kbStats').innerHTML = stats.map(s => `<div class="card kpi"><div class="lbl">${icon(s[2])}${s[0]}</div><div class="val">${fmt.num(s[1])}</div></div>`).join('');
    docsTbl = Kit.table($('#docsTable'), {
      columns: [
        { key: 'name', label: 'Document', render: (v, r) => `<span class="mono">${v}</span>${r.progress != null ? `<div class="bar indexing" style="margin-top:6px;width:160px"><i style="width:${r.progress}%"></i></div>` : ''}` },
        { key: 'kb', label: 'Knowledge base' }, { key: 'type', label: 'Type' },
        { key: 'chunks', label: 'Chunks', num: true }, { key: 'size', label: 'Size', num: true },
        { key: 'status', label: 'Status', render: statusBadge }, { key: 'updated', label: 'Updated' }
      ],
      rows: Data.docs,
      filters: [{ label: 'Knowledge base', key: 'kb', options: [...new Set(Data.docs.map(d => d.kb))] }]
    });
  }

  $('#upload').addEventListener('click', () => {
    const name = ['return-policy-2026.pdf', 'warranty-terms.docx', 'faq-international.md'][Math.floor(Math.random() * 3)];
    const doc = { name, kb: 'Help center', type: name.split('.').pop().toUpperCase(), chunks: 0, size: `${(80 + Math.random() * 400).toFixed(0)} KB`, status: 'Indexing', updated: 'just now', progress: 0 };
    Data.docs.unshift(doc); docsTbl.refresh(Data.docs);
    Kit.toast(`Uploading ${name}…`);
    const t = setInterval(() => {
      doc.progress = Math.min(100, doc.progress + 14 + Math.random() * 12);
      doc.chunks = Math.round(doc.progress * 0.4);
      if (doc.progress >= 100) { clearInterval(t); doc.status = 'Indexed'; delete doc.progress; Kit.toast(`${name} indexed: ${doc.chunks} chunks`); }
      docsTbl.refresh(Data.docs);
    }, 450);
  });

  function renderRuns() {
    Kit.table($('#runsTable'), {
      columns: [
        { key: 'id', label: 'Run', render: v => `<span class="mono">${v}</span>` }, { key: 'time', label: 'Time' },
        { key: 'agent', label: 'Agent' }, { key: 'input', label: 'Input' }, { key: 'status', label: 'Status', render: statusBadge },
        { key: 'latency', label: 'Latency', num: true, render: v => `${v.toFixed(2)} s` },
        { key: 'tokens', label: 'Tokens', num: true, render: v => fmt.num(v) },
        { key: 'cost', label: 'Cost', num: true, render: v => `$${v.toFixed(4)}` }
      ],
      rows: Data.runs, pageSize: 10,
      filters: [{ label: 'Status', key: 'status', options: ['Success', 'Fallback', 'Error'] }, { label: 'Agent', key: 'agent', options: Data.agents.map(a => a.name) }],
      onRow: r => Kit.openModal({ title: `Trace ${r.id}`, body: `<div class="trace">${[['Guardrails', 'passed', '11 ms'], ['Retrieval', '4 chunks · score 0.91', '58 ms'], ['Generation', `${fmt.num(r.tokens)} tokens`, `${r.latency}s`], ['Result', r.status, `$${r.cost}`]].map((s, i) => `<div class="step"><i>${i + 1}</i><div><b>${s[0]}</b><small>${s[1]}</small></div><code>${s[2]}</code></div>`).join('')}</div>` })
    });
  }

  $('#export').addEventListener('click', () => {
    const head = 'id,time,agent,input,status,latency,tokens,cost';
    const csv = [head, ...Data.runs.map(r => [r.id, r.time, r.agent, r.input, r.status, r.latency, r.tokens, r.cost].map(v => `"${v}"`).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'nexa-runs.csv'; a.click();
    Kit.toast('CSV exported');
  });

  function renderUsage() {
    const pct = Data.budget.spent / Data.budget.limit * 100;
    const forecast = Data.budget.spent / 30 * 31;
    $('#budget').innerHTML = `
      <div class="card kpi"><div class="lbl">${icon('wallet')}Spent this month</div><div class="val">${fmt.money(Data.budget.spent)}</div><div class="bar" style="margin-top:10px"><i style="width:0" data-w="${pct}"></i></div><small style="color:var(--muted)">${pct.toFixed(0)}% of ${fmt.money(Data.budget.limit)} budget</small></div>
      <div class="card kpi"><div class="lbl">${icon('chart')}Forecast end of month</div><div class="val">${fmt.money(forecast)}</div><div class="delta ${forecast > Data.budget.limit ? 'down' : 'up'}">${forecast > Data.budget.limit ? 'Above budget' : 'Within budget'}</div></div>
      <div class="card kpi"><div class="lbl">${icon('spark')}Cost per 1k requests</div><div class="val">$${(Data.budget.spent / Data.req30.reduce((a, b) => a + b, 0) * 1000).toFixed(2)}</div><div class="delta up">▼ 8.4% after prompt caching</div></div>`;
    requestAnimationFrame(() => $$('[data-w]').forEach(b => b.style.width = `${b.dataset.w}%`));
    Kit.bars($('#costBars'), { labels: labels30.slice(-14).map(l => l.split(' ')[1]), data: Data.cost30.slice(-14), color: '#6d4aff', format: v => fmt.money2(v) });
    const totalRuns = Data.agents.reduce((a, b) => a + b.runs, 0);
    $('#costAgents').innerHTML = Data.agents.map(a => {
      const c = Data.budget.spent * a.runs / totalRuns;
      return `<div class="li"><div class="grow"><b>${a.name}</b><div class="bar" style="margin-top:6px"><i style="width:${(a.runs / totalRuns * 100 * 2.2).toFixed(0)}%"></i></div></div><b>${fmt.money(c)}</b></div>`;
    }).join('');
  }

  function renderSettings() {
    const keys = [['Production', 'nx_live_••••••••••3f9a', 'Created Oct 2, 2026'], ['Staging', 'nx_test_••••••••••b71c', 'Created Nov 1, 2026']];
    $('#keys').innerHTML = keys.map(k => `<div class="li"><span class="ic">${icon('lock')}</span><div class="grow"><b>${k[0]}</b><small class="keyrow">${k[1]}</small></div><small style="color:var(--muted)">${k[2]}</small></div>`).join('');
    const toggles = [['Block personal data in prompts', true], ['Require citations in every answer', true], ['Human handoff when confidence is low', true], ['Allow data to be used for model training', false], ['Log full conversations for 30 days', true]];
    $('#toggles').innerHTML = toggles.map((t, i) => `<div class="li"><div class="grow"><b>${t[0]}</b></div><button class="switch ${t[1] ? 'on' : ''}" role="switch" aria-checked="${t[1]}" aria-label="${t[0]}" data-t="${i}"></button></div>`).join('');
    $$('.switch').forEach(s => s.addEventListener('click', () => { const on = !s.classList.contains('on'); s.classList.toggle('on', on); s.setAttribute('aria-checked', on); Kit.toast(`${s.getAttribute('aria-label')}: ${on ? 'on' : 'off'}`); }));
    $('#newKey').onclick = () => Kit.openModal({ title: 'New API key', body: `<p style="margin-bottom:10px">Copy this key now. For security it will not be shown again.</p><pre class="mono" style="background:#f6f8fc;border:1px solid var(--line);border-radius:8px;padding:12px">nx_live_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 10)}</pre>`, actions: [{ label: 'Done', primary: true }] });
  }

  $('#q').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const term = e.target.value.trim().toLowerCase();
    const ag = Data.agents.find(a => a.name.toLowerCase().includes(term));
    if (ag) { nav.go('agents'); openAgent(ag); return; }
    const doc = Data.docs.find(d => d.name.includes(term));
    if (doc) { nav.go('knowledge'); Kit.toast(`Found ${doc.name} in ${doc.kb}`); return; }
    Kit.toast(`No results for "${e.target.value}"`);
  });

  fillAgentSelect();
  renderOverview(); renderAgents(); renderKnowledge(); renderRuns(); renderSettings();
  document.addEventListener('view', e => { if (e.detail === 'usage') renderUsage(); if (e.detail === 'overview') drawReq(30); });
  if (location.hash === '#/usage') renderUsage();
})();
