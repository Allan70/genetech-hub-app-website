import './style.css';
import logo from './assets/logo.png';

// Where the backend release store lives. The production domain is a
// Cloudflare Tunnel straight into the same local API this repo runs
// (docker-compose's `cloudflared` service) - GET /releases/* is public
// (see api/routes/releases.routes.js) so this page can hit it directly.
const API_BASE = 'https://appapi.genetechhub.africa';
const FALLBACK_VERSION = '1.0.0';

// ---------- Minimal inline icon set (Feather-style, MIT-licensed spirit) ----------
const ICONS = {
  chart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  box: '<path d="M21 8V6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 6v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 14v-2"/><path d="m3.27 6.96 8.73 5.04 8.73-5.04"/><path d="M12 22.08V12"/>',
  store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/><path d="M9 20v-6h6v6"/>',
  columns: '<rect x="3" y="4" width="6" height="16" rx="1"/><rect x="9.5" y="4" width="6" height="10" rx="1"/><rect x="16" y="4" width="5" height="13" rx="1"/>',
  bell: '<path d="M12 2a6 6 0 0 0-6 6c0 7-3 9-3 9h18s-3-2-3-9a6 6 0 0 0-6-6z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  shield: '<path d="M12 2 4 5v6c0 5.25 3.4 9.7 8 11 4.6-1.3 8-5.75 8-11V5z"/><path d="m9 12 2 2 4-4"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  creditCard: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  apple: '<path d="M16 6c1.5-2 1-4 1-4s-2 .2-3.5 2c-1.2 1.4-1 3-1 3s1.8.3 3.5-1z"/><path d="M18.5 20c-1 1.2-2 1.9-3.2 1.9-1.3 0-1.7-.8-3.3-.8s-2 .8-3.3.8c-1.2 0-2.3-.8-3.3-2-2-2.4-3.4-6.9-1.4-10 1-1.6 2.7-2.6 4.3-2.6 1.3 0 2.3.9 3.3.9 1 0 2.2-1 3.7-.9 1.4.1 2.7.7 3.5 1.9-3.1 1.9-2.6 6.4.7 7.8-.6 1.4-1.3 2.7-2 3z"/>',
  package: '<path d="M21 8V6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 6v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 14v-2"/><path d="m3.27 6.96 8.73 5.04 8.73-5.04"/><path d="M12 22.08V12"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  filePlus: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><line x1="9" y1="15" x2="15" y2="15"/>',
};

function ic(name, cls = 'icon') {
  return `<svg class="${cls}" viewBox="0 0 24 24">${ICONS[name] || ''}</svg>`;
}

// ---------- Content data ----------

const NAV_LINKS = [
  ['#features', 'Features'],
  ['#why', 'Why GenetechHub'],
  ['#integrations', 'Integrations'],
  ['#architecture', 'How it works'],
  ['#download', 'Download'],
];

const STATS = [
  ['6', 'Platforms from one codebase'],
  ['23', 'Backend API domains'],
  ['9', 'Built-in analytics reports'],
  ['3', 'Offline-first sync engines'],
];

const FEATURES = [
  {
    icon: 'chart', title: 'Unified Dashboard',
    desc: 'Sales and expenses merged into one cash timeline, not two reports you reconcile by hand.',
    bullets: ['Live grand-total banner (income minus expenses)', 'Category breakdowns and recent-transaction tiles', 'Instant load from cache, refreshes quietly in the background'],
  },
  {
    icon: 'users', title: 'Customers, Leads & Discover',
    desc: 'Find, enrich, and manage every relationship in one CRM hub — from cold lead to signed project.',
    bullets: ['Live business search via Google Places', 'One-tap Apollo, Clay & HubSpot enrichment', 'Projects and invoices linked to the customer record'],
  },
  {
    icon: 'mail', title: 'Email & Template Builder',
    desc: 'A full email client plus a drag-and-block visual builder — no HTML required.',
    bullets: ['Inbox, sent, drafts, starred, spam & automated folders', 'Structured content blocks: text, tables, lists, links', 'Drafts sync automatically, even after writing them offline'],
  },
  {
    icon: 'box', title: 'Inventory Management',
    desc: 'Track stock by category with images, and know what is running low before customers notice.',
    bullets: ['Per-item sale/expense reporting', 'Photo attachments via the camera or gallery', 'Shareable inventory reports'],
  },
  {
    icon: 'store', title: 'Online Store Front',
    desc: 'Decide what customers see, independently of what you track internally.',
    bullets: ['Per-listing "visible in store" toggle', 'Sort by name, price or stock', 'Priced natively in KES for the local market'],
  },
  {
    icon: 'columns', title: 'Live Project Kanban',
    desc: 'Drag-and-drop boards that update on every teammate\'s screen the instant a card moves.',
    bullets: ['Custom columns per project', 'Real-time sync over Socket.IO', 'Keeps working offline — updates queue and replay on reconnect'],
  },
  {
    icon: 'bell', title: 'Smart Notifications',
    desc: 'Push alerts that open the exact right screen — every time, from any app state.',
    bullets: ['Deep-links from a stock alert straight to Inventory', 'Admin-defined event triggers, no code required', 'Personal notification inbox for every user'],
  },
  {
    icon: 'clock', title: 'Activity Log & Audit Trail',
    desc: 'Every meaningful action, logged and searchable — "who changed this" is never a mystery.',
    bullets: ['Full audit history per record', 'Backed by a dedicated audit-log API', 'Supports accountability across a growing team'],
  },
  {
    icon: 'trendingUp', title: 'Analytics & Data Export',
    desc: 'A built-in BI layer, plus a one-tap export so your data is never locked in.',
    bullets: ['9 reports: sales, expenses, invoice aging, LTV, staff performance & more', 'Low-stock alerts computed automatically', '"Export all data" from Settings, any time'],
  },
];

// 10 flagship selling points (deep, specific)
const FLAGSHIP_POINTS = [
  {
    title: 'One ledger, not a spreadsheet reconciliation project',
    desc: 'Sales and expenses merge into a single running timeline with a live grand total. No more closing the month by matching two exports against each other.',
  },
  {
    title: 'Real offline-first — three dedicated sync engines',
    desc: 'Kanban boards, email drafts, and custom templates all write to local storage first and queue changes in an outbox. Lose signal in the field or the back office — nothing is lost, and it all sends the moment you reconnect.',
  },
  {
    title: 'Live, multi-device collaboration on project boards',
    desc: 'Move a card and every teammate with that project open sees it instantly over a live socket connection — layered on top of the offline engine, so it degrades gracefully instead of breaking.',
  },
  {
    title: 'A lead-generation pipeline built in, not bolted on',
    desc: 'Search real businesses by location, then enrich with one tap: Apollo for verified contacts, Clay for deep data enrichment, HubSpot to push straight into your CRM. Bring your own API keys, or use the shared evaluation key.',
  },
  {
    title: 'Get paid without leaving the app',
    desc: 'KopoKopo mobile-money is wired straight into invoicing — send an STK push to a customer\'s phone, or hand them a pay-by-link. No manual matching of M-Pesa messages to invoices.',
  },
  {
    title: 'An email platform your team can actually build in',
    desc: 'A drag-and-block template builder means anyone can compose an on-brand email from structured content — text, tables, links — without touching HTML or waiting on a developer.',
  },
  {
    title: 'A BI layer that already exists',
    desc: 'Nine analytics reports ship with the app on day one: daily sales, revenue by category, invoice aging, customer lifetime value, staff performance, low-stock alerts, and more. No separate reporting tool to buy or maintain.',
  },
  {
    title: 'Customers, projects and invoices are one connected record',
    desc: 'An invoice lives on its project and its customer — never a disconnected billing module you have to re-key information into.',
  },
  {
    title: 'Your data is always yours',
    desc: 'One tap in Settings exports everything. Nothing your team enters is ever locked behind a tool you can\'t get it back out of.',
  },
  {
    title: 'One codebase, six platforms',
    desc: 'Android, iOS, web, Windows, macOS and Linux all ship from the same Flutter codebase — the same features and the same roadmap everywhere your team works.',
  },
];

// Additional compact selling points (12 more = 22 total)
const COMPACT_POINTS = [
  { icon: 'bell', title: 'Deep-linked push alerts', desc: 'A notification opens the exact screen it refers to — even from a killed app.' },
  { icon: 'zap', title: 'No-code notification rules', desc: 'Admins define what triggers an alert and who gets it, with no dev cycle.' },
  { icon: 'shield', title: 'Server-enforced roles', desc: 'Admin, Manager and staff permissions are checked on every route, not just hidden in the UI.' },
  { icon: 'key', title: 'Bring your own API keys', desc: 'Each staff member can wire up their own Apollo, Clay, HubSpot or Places credentials.' },
  { icon: 'refresh', title: 'Instant, cache-first screens', desc: 'Dashboard and Inventory paint from the last snapshot immediately, then quietly refresh.' },
  { icon: 'mapPin', title: 'Built for the local market', desc: 'KES pricing and mobile-money payments, end to end — not a generic template.' },
  { icon: 'printer', title: 'Print jobs, tracked', desc: 'Every physical print (like receipts) is logged with a status, not fire-and-forget.' },
  { icon: 'calendar', title: 'Scheduled & recurring to-dos', desc: 'Set it once — a daily background job makes sure nothing falls through the cracks.' },
  { icon: 'eye', title: 'Storefront visibility control', desc: 'Toggle what customers see in the store, independent of internal stock tracking.' },
  { icon: 'layers', title: 'Built to grow with the business', desc: '23 backend domains already exist — suppliers, services, software projects and more — ready to switch on.' },
  { icon: 'checkCircle', title: 'Firebase-backed accounts', desc: 'Secure sign-in and push messaging on infrastructure built for scale.' },
  { icon: 'users', title: 'Built by the team, for the team', desc: 'This is an in-house tool — feature requests go straight to the people who build it.' },
];

const INTEGRATIONS = [
  { code: 'GP', color: '#4285F4', name: 'Google Places (Serper)', desc: 'Live business discovery by location, right from the Discover tab.' },
  { code: 'AP', color: '#7c3aed', name: 'Apollo.io', desc: 'One-tap People Search enrichment for verified contact details.' },
  { code: 'CL', color: '#111827', name: 'Clay', desc: 'Async table-run enrichment for deeper, structured lead data.' },
  { code: 'HS', color: '#f97316', name: 'HubSpot CRM', desc: 'Push enriched leads straight into your existing HubSpot pipeline.' },
  { code: 'KK', color: '#059669', name: 'KopoKopo', desc: 'Mobile-money STK push and pay-by-link, wired into invoicing.' },
  { code: 'FB', color: '#eab308', name: 'Firebase', desc: 'Auth, push messaging and cloud infrastructure under the hood.' },
];

const ARCHITECTURE = [
  { title: 'Write locally, first', desc: 'Kanban moves, email drafts and custom templates save to on-device SQLite the instant you make them — before any network call happens.' },
  { title: 'Queue in an outbox', desc: 'Every change becomes an outbox entry, replayed in order once connectivity returns. A safety-net timer and connectivity listener keep the queue moving.' },
  { title: 'Sync — and go live', desc: 'Project boards add a Socket.IO layer on top: teammates online at the same time see each other\'s changes immediately, no refresh needed.' },
];

const PLATFORMS = [
  ['smartphone', 'Android'],
  ['apple', 'iOS'],
  ['globe', 'Web'],
  ['monitor', 'Windows'],
  ['monitor', 'macOS'],
  ['terminal', 'Linux'],
];

// ---------- Render ----------

const app = document.querySelector('#app');

app.innerHTML = `
<header class="nav">
  <div class="wrap">
    <a class="brand" href="#top">
      <img src="${logo}" alt="GenetechHub logo" />
      GenetechHub
    </a>
    <nav class="nav-links">
      ${NAV_LINKS.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}
    </nav>
    <a class="btn btn-primary btn-sm nav-cta" href="#download">${ic('download', 'icon')} Download</a>
  </div>
</header>

<section id="top" class="hero">
  <div class="wrap hero-inner">
    <div>
      <span class="eyebrow">${ic('zap', 'icon')} Now on Android &middot; v${FALLBACK_VERSION}</span>
      <h1>Every part of the business.<br /><span>One app, built for us.</span></h1>
      <p class="lead">
        GenetechHub replaces the spreadsheets, the separate CRM, the payment app, and the
        group-chat handoffs with a single tool: sales, customers, inventory, invoicing,
        projects and email — offline-capable, real-time where it matters, and already running
        on six platforms.
      </p>
      <div class="hero-ctas">
        <a href="#download" class="btn btn-primary">${ic('download')} Download for Android</a>
        <a href="#features" class="btn btn-ghost">See what's inside ${ic('arrowRight', 'icon')}</a>
      </div>
      <div class="hero-note">${ic('checkCircle')} Built in-house for the Genetech Hub team — no seat licenses, no third-party lock-in.</div>
    </div>
    <div class="phone-frame">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <div class="phone-topbar">
          <span class="name"><img src="${logo}" alt="" /> GenetechHub</span>
          ${ic('bell', 'icon').replace('class="icon"', 'class="icon" style="width:14px;height:14px;color:#98a1b0"')}
        </div>
        <div class="phone-row">
          <div class="phone-card"><div class="label">Today</div><div class="value good">+KES 48.2K</div></div>
          <div class="phone-card"><div class="label">Expenses</div><div class="value">KES 9.4K</div></div>
        </div>
        <div class="phone-list">
          <div class="phone-list-item"><span class="dot"></span><div><div class="t">New lead enriched</div><div class="s">Apollo &middot; 2m ago</div></div></div>
          <div class="phone-list-item"><span class="dot" style="background:#34d399"></span><div><div class="t">Invoice #1042 paid</div><div class="s">KopoKopo &middot; 14m ago</div></div></div>
          <div class="phone-list-item"><span class="dot" style="background:#60a5fa"></span><div><div class="t">Kanban card moved</div><div class="s">Live sync &middot; just now</div></div></div>
          <div class="phone-list-item"><span class="dot" style="background:#f472b6"></span><div><div class="t">Low stock: Cement 50kg</div><div class="s">Inventory alert</div></div></div>
        </div>
        <div class="phone-tabbar">
          ${ic('chart', 'icon active')}
          ${ic('users', 'icon')}
          ${ic('mail', 'icon')}
          ${ic('columns', 'icon')}
          ${ic('box', 'icon')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="stats" style="padding:0;border-bottom:1px solid var(--panel-border)">
  <div class="wrap" style="padding:0">
    <div class="stats-grid">
      ${STATS.map(([n, l]) => `
        <div class="stat"><div class="num"><span class="gold">${n}</span></div><div class="lbl">${l}</div></div>
      `).join('')}
    </div>
  </div>
</section>

<section id="features">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Features</span>
      <h2>Nine screens. Every one of them does real work.</h2>
      <p>This isn't a CRUD shell — each module was built to remove a specific piece of manual work your team was doing before.</p>
    </div>
    <div class="feature-grid">
      ${FEATURES.map(f => `
        <div class="feature-card">
          <div class="ico-wrap">${ic(f.icon)}</div>
          <h3>${f.title}</h3>
          <p>${f.desc}</p>
          <ul>${f.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section id="why">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Why GenetechHub</span>
      <h2>22 reasons the team is better off with it</h2>
      <p>Not marketing fluff — every point below maps to a real, shipped capability in the app.</p>
    </div>
    <div class="points-flagship">
      ${FLAGSHIP_POINTS.map((p, i) => `
        <div class="point-card">
          <div class="num">${String(i + 1).padStart(2, '0')}</div>
          <div><h4>${p.title}</h4><p>${p.desc}</p></div>
        </div>
      `).join('')}
    </div>
    <div class="points-compact">
      ${COMPACT_POINTS.map(p => `
        <div class="point-mini">
          ${ic(p.icon)}
          <div><h5>${p.title}</h5><p>${p.desc}</p></div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section id="integrations">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Integrations</span>
      <h2>Already connected to the tools that matter</h2>
      <p>No separate subscriptions to juggle — these are wired directly into the Discover, Leads, Invoices and Auth flows.</p>
    </div>
    <div class="integrations-grid">
      ${INTEGRATIONS.map(i => `
        <div class="integration-card">
          <div class="integration-badge" style="background:${i.color}">${i.code}</div>
          <div><h4>${i.name}</h4><p>${i.desc}</p></div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section id="architecture">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">How it works</span>
      <h2>Offline-first by design, real-time where it counts</h2>
      <p>A field team member with no signal and two people editing the same board at once are both first-class scenarios — not edge cases patched in later.</p>
    </div>
    <div class="arch-grid">
      ${ARCHITECTURE.map(a => `
        <div class="arch-card"><h4>${a.title}</h4><p>${a.desc}</p></div>
      `).join('')}
    </div>
  </div>
</section>

<section id="platforms" style="padding-bottom:72px">
  <div class="wrap">
    <div class="section-head" style="margin-bottom:36px">
      <span class="eyebrow">Everywhere the team works</span>
      <h2>One codebase. Six platforms.</h2>
    </div>
    <div class="platform-row">
      ${PLATFORMS.map(([icon, name]) => `<div class="platform-chip">${ic(icon)} ${name}</div>`).join('')}
    </div>
  </div>
</section>

<section id="download">
  <div class="wrap">
    <div class="download-panel">
      <div class="download-info">
        <span class="version-pill"><span class="dot"></span> Latest release</span>
        <h2>Get GenetechHub on your device</h2>
        <p>Sideloaded directly — no app store review, no delay between a build and your team having it in hand.</p>
        <details class="install-steps" open>
          <summary>${ic('smartphone', 'icon')} How to install on Android</summary>
          <ol>
            <li>Tap <b>Download for Android</b> — the APK lands in your Downloads folder.</li>
            <li>Open it. If prompted, allow <b>Install from this source</b> for your browser or Files app.</li>
            <li>Tap <b>Install</b>, then open GenetechHub and sign in with your work account.</li>
          </ol>
        </details>
        <details class="install-steps">
          <summary>${ic('monitor', 'icon')} How to install on Windows</summary>
          <ol>
            <li>Click <b>Download for Windows</b> — a .zip archive lands in your Downloads folder.</li>
            <li>Extract it anywhere, then open the extracted folder.</li>
            <li>Run <b>GenetechHub.exe</b> and sign in. If SmartScreen warns about an unrecognized app, choose <b>More info &rarr; Run anyway</b>.</li>
          </ol>
        </details>
      </div>
      <div class="download-cards">
        <div class="download-card">
          <div class="icon-lg">${ic('package', 'icon icon-lg')}</div>
          <h3 style="color:#fff;margin-bottom:6px">GenetechHub.apk</h3>
          <p style="margin-bottom:18px" id="dl-android-updated">v${FALLBACK_VERSION}</p>
          <a id="dl-android-button" class="btn btn-primary" href="${API_BASE}/releases/latest/download?platform=android">
            ${ic('download')} Download for Android
          </a>
          <div class="download-meta" style="justify-content:center">
            <span>Version: <b id="dl-android-version">${FALLBACK_VERSION}</b></span>
            <span>Size: <b id="dl-android-size">—</b></span>
          </div>
          <div class="fallback">Android 7.0+ &middot; internal build for Genetech Hub staff</div>
        </div>
        <div class="download-card">
          <div class="icon-lg">${ic('monitor', 'icon icon-lg')}</div>
          <h3 style="color:#fff;margin-bottom:6px">GenetechHub.zip</h3>
          <p style="margin-bottom:18px" id="dl-windows-updated">v${FALLBACK_VERSION}</p>
          <a id="dl-windows-button" class="btn btn-primary" href="${API_BASE}/releases/latest/download?platform=windows">
            ${ic('download')} Download for Windows
          </a>
          <div class="download-meta" style="justify-content:center">
            <span>Version: <b id="dl-windows-version">${FALLBACK_VERSION}</b></span>
            <span>Size: <b id="dl-windows-size">—</b></span>
          </div>
          <div class="fallback">Windows 10/11 &middot; internal build for Genetech Hub staff</div>
        </div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap footer-inner">
    <div class="footer-brand"><img src="${logo}" alt="" /> &copy; ${new Date().getFullYear()} Genetech Hub</div>
    <div class="footer-links">
      <a href="#features">Features</a>
      <a href="#why">Why GenetechHub</a>
      <a href="#integrations">Integrations</a>
      <a href="#download">Download</a>
      <a href="mailto:info@genetechhub.africa">${ic('mail', 'icon')} info@genetechhub.africa</a>
    </div>
  </div>
  <p class="footer-note">Internal tool for Genetech Hub staff. Questions or feature requests go straight to the dev team.</p>
</footer>
`;

// ---------- Live release metadata ----------
// Best-effort: if the API is unreachable (offline preview, tunnel down),
// each download button still works via its hardcoded /releases/latest/download
// URL and the page just keeps showing the fallback version/size.
function hydrateRelease(platform) {
  fetch(`${API_BASE}/releases/latest?platform=${platform}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((release) => {
      const versionEl = document.getElementById(`dl-${platform}-version`);
      if (versionEl) versionEl.textContent = release.version;
      const updatedEl = document.getElementById(`dl-${platform}-updated`);
      if (updatedEl) updatedEl.textContent = `v${release.version}`;
      const sizeEl = document.getElementById(`dl-${platform}-size`);
      if (sizeEl && release.size) {
        sizeEl.textContent = `${(release.size / (1024 * 1024)).toFixed(1)} MB`;
      }
    })
    .catch(() => { /* keep fallback text */ });
}

hydrateRelease('android');
hydrateRelease('windows');
