/* SAIL — Business Plan viewer. Loads the Markdown docs in /docs live and renders them
   with marked + mermaid. Nav is generated from the DOCS manifest below.
   To add/remove/reorder a document, edit DOCS — nothing else. */

const DOCS = [
  {id:'README',                                  path:'README.md',                                    title:'Overview',                         group:'Overview',              badge:'★'},
  {id:'00_Executive_Summary',                    path:'docs/00_Executive_Summary.md',                 title:'Executive Summary',                group:'Overview',              badge:'00'},
  {id:'01_Product_Vision_and_Scope',             path:'docs/01_Product_Vision_and_Scope.md',          title:'Product Vision & Scope',           group:'Strategy',              badge:'01'},
  {id:'02_Market_and_Feasibility',               path:'docs/02_Market_and_Feasibility.md',            title:'Market & Feasibility',             group:'Strategy',              badge:'02'},
  {id:'03_Functional_Requirements',              path:'docs/03_Functional_Requirements.md',           title:'Functional Requirements',          group:'Product',               badge:'03'},
  {id:'04_Subscription_Tiers_and_Feature_Matrix',path:'docs/04_Subscription_Tiers_and_Feature_Matrix.md',title:'Subscription Tiers & Features',  group:'Product',               badge:'04'},
  {id:'05_System_Architecture',                  path:'docs/05_System_Architecture.md',               title:'System Architecture',              group:'Architecture & Build',  badge:'05'},
  {id:'06_Data_Strategy_and_ETL',                path:'docs/06_Data_Strategy_and_ETL.md',             title:'Data Strategy & ETL',              group:'Architecture & Build',  badge:'06'},
  {id:'07_AI_ML_Strategy',                       path:'docs/07_AI_ML_Strategy.md',                    title:'AI / ML Strategy',                 group:'Architecture & Build',  badge:'07'},
  {id:'08_Technology_Stack',                     path:'docs/08_Technology_Stack.md',                  title:'Technology Stack',                 group:'Architecture & Build',  badge:'08'},
  {id:'09_Security_and_Compliance',              path:'docs/09_Security_and_Compliance.md',           title:'Security & Compliance',            group:'Architecture & Build',  badge:'09'},
  {id:'10_Hosting_and_Infrastructure_Costs',     path:'docs/10_Hosting_and_Infrastructure_Costs.md',  title:'Hosting & Infra Costs',            group:'Cost & Commercials',    badge:'10'},
  {id:'11_Build_Cost_and_Commercials',           path:'docs/11_Build_Cost_and_Commercials.md',        title:'Build Cost & Capital Plan',        group:'Cost & Commercials',    badge:'11'},
  {id:'12_Delivery_Plan_and_Timeline',           path:'docs/12_Delivery_Plan_and_Timeline.md',        title:'Delivery Plan & Timeline',         group:'Delivery & Roadmap',    badge:'12'},
  {id:'13_Risks_Assumptions_Dependencies',       path:'docs/13_Risks_Assumptions_Dependencies.md',    title:'Risks & Assumptions',              group:'Delivery & Roadmap',    badge:'13'},
  {id:'14_Tender_Summary_and_Next_Steps',        path:'docs/14_Tender_Summary_and_Next_Steps.md',     title:'Roadmap & Next Steps',             group:'Delivery & Roadmap',    badge:'14'},
  {id:'15_Business_Model_and_Unit_Economics',    path:'docs/15_Business_Model_and_Unit_Economics.md', title:'Business Model & Unit Economics',   group:'Business Model',        badge:'15'},
  {id:'A_KPI_and_Metrics_Catalog',               path:'docs/appendix/A_KPI_and_Metrics_Catalog.md',   title:'A · KPI & Metrics Catalog',        group:'Appendices',            badge:'A'},
  {id:'B_Data_Sources_and_Integrations',         path:'docs/appendix/B_Data_Sources_and_Integrations.md',title:'B · Data Sources & Integrations',group:'Appendices',            badge:'B'},
  {id:'C_Assumptions_and_Constants',             path:'docs/appendix/C_Assumptions_and_Constants.md', title:'C · Assumptions & Constants',      group:'Appendices',            badge:'C'},
  {id:'D_Glossary',                              path:'docs/appendix/D_Glossary.md',                  title:'D · Glossary',                     group:'Appendices',            badge:'D'},
];

const DEFAULT_ID = 'README';
const BY_ID = Object.fromEntries(DOCS.map(d => [d.id, d]));
const ORDER = DOCS.map(d => d.id);
const IDSET = new Set(ORDER);
const CACHE = {};

marked.setOptions({gfm:true, breaks:false});
const $ = s => document.querySelector(s);
const theme = () => document.documentElement.getAttribute('data-theme');
const slug = t => t.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').replace(/-+/g,'-');

/* ---------- build sidebar nav + header menu from manifest ---------- */
function buildNav(){
  const nav = $('#nav'), menu = $('#menu');
  let html = '', menuHtml = '', seen = null, firstOfGroup = {};
  for(const d of DOCS){
    if(d.group !== seen){
      if(seen !== null) html += '</div>';
      html += `<div class="navgroup"><div class="glabel">${d.group}</div>`;
      seen = d.group;
      firstOfGroup[d.group] = d.id;
    }
    html += `<a class="navlink" data-id="${d.id}" data-title="${d.title.toLowerCase()}" href="#${d.id}">`
          + `<span class="badge">${d.badge}</span><span class="lk">${d.title}</span></a>`;
  }
  if(seen !== null) html += '</div>';
  nav.innerHTML = html;
  for(const g of Object.keys(firstOfGroup)) menuHtml += `<a href="#${firstOfGroup[g]}">${g}</a>`;
  menu.innerHTML = menuHtml;
}

/* ---------- cross-link resolution ---------- */
function resolveHref(href){
  if(!href) return null;
  if(href.startsWith('#')) return null;                       // in-page anchor
  if(/^(https?:|mailto:)/i.test(href)) return {ext:true};
  const m = href.match(/([^\/?#]+)\.md(?:[#?].*)?$/i);
  if(m){
    let base = m[1];
    if(/_internal\//i.test(href) && base === 'README') base = 'internal-README';
    return IDSET.has(base) ? {hash:'#'+base} : {missing:true};
  }
  return {missing:true};
}

/* ---------- render ---------- */
function paint(id, md){
  const el = $('#doc');
  el.innerHTML = marked.parse(md);
  el.querySelectorAll('h1,h2,h3,h4').forEach(h => { if(!h.id) h.id = slug(h.textContent); });
  el.querySelectorAll('table').forEach(t => {
    if(!t.parentElement.classList.contains('tablewrap')){
      const w = document.createElement('div'); w.className = 'tablewrap';
      t.replaceWith(w); w.appendChild(t);
    }
  });
  el.querySelectorAll('code.language-mermaid').forEach(c => {
    const pre = c.closest('pre') || c;
    const d = document.createElement('pre'); d.className = 'mermaid'; d.textContent = c.textContent;
    pre.replaceWith(d);
  });
  el.querySelectorAll('a[href]').forEach(a => {
    const r = resolveHref(a.getAttribute('href'));
    if(!r) return;
    if(r.ext){ a.target = '_blank'; a.rel = 'noopener'; return; }
    if(r.hash){ a.setAttribute('href', r.hash); }
    else { a.classList.add('xref-missing'); a.setAttribute('href','#'); a.title = 'Not available'; a.addEventListener('click', e => e.preventDefault()); }
  });
  const nodes = el.querySelectorAll('pre.mermaid');
  if(nodes.length){
    try{
      mermaid.initialize({startOnLoad:false, theme: theme()==='dark'?'dark':'default', securityLevel:'loose',
        flowchart:{useMaxWidth:true}, themeVariables:{fontFamily:'inherit'}});
      mermaid.run({nodes});
    }catch(e){ console.warn('mermaid', e); }
  }
}

async function renderDoc(id){
  const doc = BY_ID[id]; if(!doc) return;
  const el = $('#doc');
  if(CACHE[id] !== undefined){ paint(id, CACHE[id]); return; }
  el.innerHTML = '<p class="loading">Loading…</p>';
  try{
    const res = await fetch(doc.path, {cache:'no-cache'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const md = await res.text();
    CACHE[id] = md;
    paint(id, md);
  }catch(err){
    el.innerHTML = '<h1>Couldn’t load this document</h1>'
      + '<p>The viewer fetches the Markdown files over HTTP. If you opened <code>index.html</code> directly '
      + 'from disk, your browser blocks that. View it via the hosted link, or run a local server from the repo folder:</p>'
      + '<pre><code>python3 -m http.server 8080</code></pre>'
      + '<p>then open <code>http://localhost:8080/</code>.</p>'
      + '<p style="color:var(--faint)">('+ (doc.path) +' — '+ err.message +')</p>';
  }
}

function setActive(id){
  document.querySelectorAll('.navlink').forEach(a => a.classList.toggle('active', a.dataset.id === id));
  const t = BY_ID[id] ? BY_ID[id].title : '';
  $('#crumb').innerHTML = 'SAIL Business Plan &nbsp;/&nbsp; <b>'+t+'</b>';
  document.title = t + ' — SAIL Business Plan';
  const i = ORDER.indexOf(id);
  const prev = i>0 ? ORDER[i-1] : null;
  const next = (i>=0 && i<ORDER.length-1) ? ORDER[i+1] : null;
  $('#pager').innerHTML =
    (prev ? `<a class="prv" href="#${prev}"><span class="lbl">&#8592; Previous</span><span class="ttl">${BY_ID[prev].title}</span></a>` : '<a class="disabled"></a>') +
    (next ? `<a class="nxt" href="#${next}"><span class="lbl">Next &#8594;</span><span class="ttl">${BY_ID[next].title}</span></a>` : '<a class="disabled"></a>');
}

async function loadDoc(id){
  await renderDoc(id);
  setActive(id);
  const active = document.querySelector('.navlink.active');
  if(active) active.scrollIntoView({block:'nearest'});
  window.scrollTo({top:0});
  document.body.classList.remove('navopen');
}

function route(){
  const raw = decodeURIComponent(location.hash.slice(1));
  if(!raw){ loadDoc(DEFAULT_ID); return; }
  if(IDSET.has(raw)){ loadDoc(raw); return; }
  const el = document.getElementById(raw);         // maybe an in-page heading anchor
  if(el){ el.scrollIntoView({behavior:'smooth'}); return; }
  loadDoc(DEFAULT_ID);
}

/* ---------- theme ---------- */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  const lbl = $('#themeToggle .tlbl'); if(lbl) lbl.textContent = t==='dark' ? 'Light' : 'Dark';
  try{ localStorage.setItem('sail-theme', t); }catch(e){}
}

/* ---------- init ---------- */
buildNav();
window.addEventListener('hashchange', route);
$('#themeToggle').addEventListener('click', () => {
  applyTheme(theme()==='dark' ? 'light' : 'dark');
  const cur = document.querySelector('.navlink.active');
  if(cur){ CACHE[cur.dataset.id] !== undefined ? paint(cur.dataset.id, CACHE[cur.dataset.id]) : renderDoc(cur.dataset.id); }
});
$('#printBtn').addEventListener('click', () => window.print());
$('#menuToggle').addEventListener('click', () => document.body.classList.toggle('navopen'));
$('#scrim').addEventListener('click', () => document.body.classList.remove('navopen'));
$('#filter').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.navlink').forEach(a => { a.style.display = a.dataset.title.includes(q) ? '' : 'none'; });
  document.querySelectorAll('.navgroup').forEach(g => {
    const any = [...g.querySelectorAll('.navlink')].some(a => a.style.display !== 'none');
    g.style.display = any ? '' : 'none';
  });
});
(function(){
  let t = 'light';
  try{ t = localStorage.getItem('sail-theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'); }catch(e){}
  applyTheme(t);
})();
route();
