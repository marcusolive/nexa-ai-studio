const Data = (() => {
  const rnd = Kit.rng(42);
  const days = n => Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const MODELS = [
    { id: 'gpt-4.1-mini', color: '#6d4aff', share: 46 },
    { id: 'claude-sonnet', color: '#d97757', share: 31 },
    { id: 'llama-3.1-70b', color: '#12b886', share: 15 },
    { id: 'embeddings', color: '#f59f00', share: 8 }
  ];

  const agents = [
    { id: 'ag_support', name: 'Customer support', model: 'claude-sonnet', kb: 'Help center', status: 'Live', runs: 18420, success: 96.4, latency: 1.8 },
    { id: 'ag_sales', name: 'Sales assistant', model: 'gpt-4.1-mini', kb: 'Pricing & plans', status: 'Live', runs: 7310, success: 93.1, latency: 1.4 },
    { id: 'ag_invoice', name: 'Invoice extractor', model: 'gpt-4.1-mini', kb: 'Invoice schemas', status: 'Live', runs: 12988, success: 98.7, latency: 2.6 },
    { id: 'ag_hr', name: 'HR policies bot', model: 'llama-3.1-70b', kb: 'Employee handbook', status: 'Paused', runs: 2104, success: 91.2, latency: 2.1 },
    { id: 'ag_legal', name: 'Contract reviewer', model: 'claude-sonnet', kb: 'Contract templates', status: 'Testing', runs: 640, success: 88.5, latency: 4.2 },
    { id: 'ag_it', name: 'IT helpdesk', model: 'gpt-4.1-mini', kb: 'IT runbooks', status: 'Live', runs: 5233, success: 94.9, latency: 1.6 }
  ];

  const docs = [
    { name: 'refund-policy.pdf', kb: 'Help center', type: 'PDF', chunks: 48, size: '312 KB', status: 'Indexed', updated: '2 days ago' },
    { name: 'security-faq.md', kb: 'Help center', type: 'Markdown', chunks: 22, size: '41 KB', status: 'Indexed', updated: '5 days ago' },
    { name: 'pricing-2026.xlsx', kb: 'Pricing & plans', type: 'Sheet', chunks: 35, size: '96 KB', status: 'Indexed', updated: '1 week ago' },
    { name: 'shipping-rules.docx', kb: 'Help center', type: 'Word', chunks: 30, size: '128 KB', status: 'Indexed', updated: '3 days ago' },
    { name: 'employee-handbook.pdf', kb: 'Employee handbook', type: 'PDF', chunks: 214, size: '2.1 MB', status: 'Indexed', updated: '1 month ago' },
    { name: 'nda-template.docx', kb: 'Contract templates', type: 'Word', chunks: 18, size: '64 KB', status: 'Indexed', updated: '2 weeks ago' },
    { name: 'vpn-runbook.md', kb: 'IT runbooks', type: 'Markdown', chunks: 12, size: '18 KB', status: 'Indexed', updated: 'yesterday' },
    { name: 'invoice-schema.json', kb: 'Invoice schemas', type: 'JSON', chunks: 9, size: '12 KB', status: 'Indexed', updated: '4 days ago' },
    { name: 'onboarding-guide.pdf', kb: 'Employee handbook', type: 'PDF', chunks: 76, size: '860 KB', status: 'Stale', updated: '3 months ago' }
  ];

  const statuses = ['Success', 'Success', 'Success', 'Success', 'Success', 'Success', 'Fallback', 'Error'];
  const questions = ['Refund for annual plan', 'Reset 2FA', 'Invoice #4821 total', 'Change shipping address', 'Plan comparison', 'VPN not connecting', 'Vacation policy', 'NDA clause 4', 'Cancel subscription', 'Delivery time to Canada'];
  const runs = Array.from({ length: 64 }, (_, i) => {
    const ag = agents[Math.floor(rnd() * agents.length)];
    const tokens = Math.round(600 + rnd() * 2600);
    const st = statuses[Math.floor(rnd() * statuses.length)];
    const t = new Date(Date.now() - i * (7 + rnd() * 30) * 60000);
    return {
      id: `run_${(98231 - i * 37).toString(36)}`,
      agent: ag.name,
      input: questions[Math.floor(rnd() * questions.length)],
      status: st,
      latency: +(ag.latency * (0.6 + rnd() * 0.9)).toFixed(2),
      tokens,
      cost: +(tokens * 0.0000042).toFixed(4),
      time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  });

  const req30 = Array.from({ length: 30 }, (_, i) => Math.round(1400 + i * 28 + Math.sin(i / 2) * 220 + rnd() * 180));
  const err30 = req30.map(v => Math.round(v * (0.015 + rnd() * 0.02)));
  const cost30 = req30.map(v => +(v * 0.0061 + rnd() * 1.4).toFixed(2));

  const answers = [
    { match: /refund|money back|annual/i, text: 'Annual plans can be refunded within 30 days of purchase. After that, you can cancel the renewal at any time and keep access until the end of the paid period.', sources: ['refund-policy.pdf · p.2', 'refund-policy.pdf · p.3'] },
    { match: /card|payment data|security|store/i, text: 'We never store card data. Payments are processed by a PCI-compliant provider, and only a token reaches our servers.', sources: ['security-faq.md · §4'] },
    { match: /ship|deliver|canada/i, text: 'Orders ship within 2 business days. Delivery to Canada takes 5 to 8 business days, and tracking is sent by email.', sources: ['shipping-rules.docx · §2', 'shipping-rules.docx · §5'] },
    { match: /price|plan|cost/i, text: 'There are three plans: Starter at $19, Growth at $49 and Scale at $149 per month. Annual billing gives two months free.', sources: ['pricing-2026.xlsx · Plans'] }
  ];

  return { days, MODELS, agents, docs, runs, req30, err30, cost30, answers, budget: { limit: 1200, spent: 0 } };
})();
