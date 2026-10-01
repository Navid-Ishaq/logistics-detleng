const routes = {
  home: { title: 'Logistics & Supply Chain', eyebrow: 'The world in motion', intro: 'The global system that connects what people need with the places, products, information and decisions that make delivery possible.', sections: [1] },
  understand: { title: 'Understand Logistics & Supply Chain', eyebrow: 'See the whole system', intro: 'From one customer need to a worldwide network: understand how movement, storage, sourcing, production and information work as one.', sections: [2,4,10] },
  journey: { title: 'The Complete Supply Chain Journey', eyebrow: 'Every product has a story', intro: 'Follow the physical product, the information around it and the decisions that keep the entire network moving.', sections: [3] },
  foundations: { title: 'Foundations for Logistics Thinking', eyebrow: 'Build your operating mind', intro: 'Learn to see flows, handoffs, trade-offs, capacity, uncertainty and cause-and-effect before reaching for advanced tools.', sections: [5,8,9] },
  skills: { title: 'Skills, Technology & Information', eyebrow: 'Turn knowledge into capability', intro: 'Build the communication, data, process and systems skills used to coordinate complex work with clarity and control.', sections: [6,7] },
  careers: { title: 'Careers Across the Supply Chain', eyebrow: 'Find where you can contribute', intro: 'Explore the people behind procurement, planning, warehousing, transport, analytics, systems and operational leadership.', sections: [11,12] },
  practice: { title: 'Logistics Practice Lab', eyebrow: 'Think like the system', intro: 'Turn ideas into decisions through a fictional fulfilment operation built around stock, service, disruption and improvement.', sections: [13] },
  glossary: { title: 'Glossary', eyebrow: 'Plain-language reference', intro: 'Search the essential vocabulary of logistics and supply chain management.', sections: [14] },
  resources: { title: 'Keep learning with a question', eyebrow: 'Learning resources', intro: 'Choose reliable sources, understand their context, and apply each idea to a small exercise.', sections: [15] },
  about: { title: 'About the project', eyebrow: 'Independent learning', intro: 'A practical educational project by Muhammad Naveed, designed to make a complex field easier to understand.', sections: [16] },
  faqs: { title: 'Frequently asked questions', eyebrow: 'Clear answers', intro: 'Straightforward answers for people beginning their logistics and supply chain learning.', sections: [17] }
};

let sections = [];
const main = document.querySelector('main');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

function escapeHTML(value='') {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function inline(text) {
  return escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
}

function slugify(text) {
  return text.toLowerCase().replace(/&amp;|&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function parseSource(source) {
  const raw = source.split(/^## /m).slice(1);
  return raw.map((block, index) => {
    const split = block.indexOf('\n');
    const heading = block.slice(0, split).trim();
    return { index, heading, cleanHeading: heading.replace(/^\d+\.\s*/,''), body: block.slice(split + 1).trim() };
  });
}

function markdown(md) {
  const lines = md.split(/\r?\n/);
  let html = '', paragraph = [], list = null;
  const flushParagraph = () => { if(paragraph.length){ html += `<p>${inline(paragraph.join(' '))}</p>`; paragraph=[]; } };
  const closeList = () => { if(list){ html += `</${list}>`; list=null; } };
  for(let i=0;i<lines.length;i++){
    const line = lines[i].trim();
    if(!line){ flushParagraph(); closeList(); continue; }
    if(line.startsWith('|') && i+1 < lines.length && /^\|?[\s|:-]+\|?$/.test(lines[i+1].trim())){
      flushParagraph(); closeList();
      const rows=[];
      rows.push(line.split('|').filter(Boolean).map(x=>x.trim())); i+=2;
      while(i<lines.length && lines[i].trim().startsWith('|')){ rows.push(lines[i].trim().split('|').filter(Boolean).map(x=>x.trim())); i++; }
      i--;
      html += '<div class="table-wrap"><table><thead><tr>'+rows[0].map(c=>`<th>${inline(c)}</th>`).join('')+'</tr></thead><tbody>'+
        rows.slice(1).map(row=>'<tr>'+row.map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table></div>';
      continue;
    }
    if(/^### /.test(line)){ flushParagraph(); closeList(); const t=line.replace(/^### /,''); html+=`<h3 id="${slugify(t)}">${inline(t)}</h3>`; continue; }
    if(/^#### /.test(line)){ flushParagraph(); closeList(); const t=line.replace(/^#### /,''); html+=`<h4>${inline(t)}</h4>`; continue; }
    if(/^> /.test(line)){ flushParagraph(); closeList(); html+=`<blockquote>${inline(line.slice(2))}</blockquote>`; continue; }
    const bullet=line.match(/^[-*] (.+)/); const numbered=line.match(/^\d+\. (.+)/);
    if(bullet || numbered){ flushParagraph(); const wanted=bullet?'ul':'ol'; if(list!==wanted){ closeList(); list=wanted; html+=`<${list}>`; } html+=`<li>${inline((bullet||numbered)[1])}</li>`; continue; }
    paragraph.push(line);
  }
  flushParagraph(); closeList(); return html;
}

function journeyTool(){
  const stages=[
    ['01','Demand','A customer need becomes a plan.','Customer, planner, sales team','Orders, forecasts, service promise','How much may be needed, where and when?','Forecast error or a promise the network cannot keep.'],
    ['02','Sourcing','Materials and finished goods are obtained.','Buyer, supplier, quality team','Specifications, quantities, prices, lead times','Which source offers the right balance of cost, quality and reliability?','Late supply, poor quality or unclear requirements.'],
    ['03','Production','Materials become a finished backpack.','Production team, planner, suppliers','Bill of materials, schedule, capacity, quality records','What should be made, in what sequence and with which resources?','A bottleneck, missing material or quality failure.'],
    ['04','Storage','Accepted products are recorded and placed safely.','Warehouse team, inventory controller','SKU, quantity, condition, location','Where should stock be placed and how will it be found?','Damage, incorrect count or unclear location.'],
    ['05','Fulfilment','An order is checked, picked, packed and labelled.','Customer service, picker, packer','Order details, availability, address, handling needs','Can the exact promise be fulfilled accurately?','Wrong item, missing stock or incomplete address.'],
    ['06','Delivery','The shipment moves to the recipient.','Carrier, coordinator, customer','Route, service level, tracking, proof of delivery','Which transport option meets the promise at a sensible cost?','Delay, damage, missed delivery or poor visibility.'],
    ['07','Returns','A returned item and its records move back through the system.','Customer, carrier, returns team, finance','Reason, condition, authorisation, refund status','Can the item be resold, repaired, recycled or disposed of?','Lost value, slow refund or an unrecorded stock change.'],
    ['08','Improve','Results and feedback shape the next cycle.','Managers, analysts, operational teams','Service, cost, quality, inventory and feedback data','What caused the result, and what change should be tested?','Treating a symptom instead of the real cause.']
  ];
  return `<section class="journey-board" aria-labelledby="journey-tool-title"><h2 id="journey-tool-title">The backpack journey</h2><p>Select a stage to see the work, information and decisions behind it.</p><div class="journey-tabs" role="tablist" aria-label="Supply chain stages">${stages.map((s,i)=>`<button role="tab" aria-selected="${i===0}" aria-controls="journey-panel" data-stage="${i}">${s[0]} ${s[1]}</button>`).join('')}</div><div class="journey-panel" id="journey-panel" role="tabpanel"></div></section>`;
}

function foundationsTool(){
  const items=['Explain the difference between logistics and supply chain management','Follow the flow of goods and the flow of information','Use basic percentages, averages, units, time and cost','Read a simple stock record and check a balance','Map a process with owners, inputs and outputs','State assumptions and separate facts from estimates'];
  return `<section class="tool" aria-labelledby="foundation-check"><h2 id="foundation-check">Foundation practice check</h2><p>This is a personal learning aid, not a qualification or a certification of professional readiness.</p><div class="progress" aria-hidden="true"><span></span></div><p class="progress-label" aria-live="polite">0 of ${items.length} areas reviewed</p><div class="checklist">${items.map((x,i)=>`<label><input type="checkbox" data-foundation="${i}"><span>${x}</span></label>`).join('')}</div><button class="button secondary reset-check" type="button">Reset checklist</button></section>`;
}

function careerTool(){
  const cards=[
    ['data','Supply chain analysis','Clean data, build reports, find patterns and explain decisions.'],['people','Procurement and sourcing','Compare offers, maintain supplier information and follow up commitments.'],['operations','Inventory and warehouse operations','Receive, record, locate, pick and investigate stock differences.'],['people','Transport coordination','Book shipments, work with carriers and resolve delivery exceptions.'],['data','Demand and supply planning','Review demand, stock and supply to update replenishment plans.'],['systems','Systems and improvement','Map processes, gather requirements, test changes and support users.'],['operations','Operations and management','Coordinate people, priorities, capacity and performance; usually built through experience.']
  ];
  return `<section class="tool" aria-labelledby="career-explorer"><h2 id="career-explorer">Explore by the work you enjoy</h2><div class="career-filter" role="group" aria-label="Filter careers"><button class="active" data-filter="all">All</button><button data-filter="data">Data & planning</button><button data-filter="people">Coordination</button><button data-filter="operations">Physical operations</button><button data-filter="systems">Systems & improvement</button></div><div class="career-grid">${cards.map(c=>`<article class="card career-card" data-kind="${c[0]}"><span class="number">${c[0].toUpperCase()}</span><h3>${c[1]}</h3><p>${c[2]}</p></article>`).join('')}</div></section>`;
}

function practiceTool(){
  return `<section class="tool" aria-labelledby="cost-comparison"><h2 id="cost-comparison">Standard or Express?</h2><p>Compare the quoted transport cost for the fictional store. Reliability and other conditions still need checking.</p><div class="field"><label for="orders">Orders to ship</label><input id="orders" type="number" inputmode="numeric" min="0" max="10000" value="20"></div><div class="result" id="cost-result" aria-live="polite"></div></section><section class="tool"><h2>Test a supplier delay</h2><p>The average is 20 backpacks per working day and the normal replenishment period is 10 working days.</p><div class="field"><label for="delay-days">Additional delay in working days</label><input id="delay-days" type="number" inputmode="numeric" min="0" max="365" value="5"></div><div class="result" id="delay-result" aria-live="polite"></div><details><summary>What should you check before responding?</summary><p>Check stock by model, open customer orders, incoming shipments and the reliability of the new date. Possible responses include a partial shipment, an alternative source or a revised availability promise.</p></details></section>`;
}

function glossaryTool(){
  const match = sections[14]?.body.match(/\| Term \| Simple meaning \|[\s\S]*/);
  if(!match) return '';
  const terms=match[0].split(/\r?\n/).slice(2).filter(x=>x.startsWith('|')).map(row=>row.split('|').filter(Boolean).map(x=>x.trim()));
  return `<section class="tool"><div class="field"><label for="term-search">Search the glossary</label><input id="term-search" type="search" placeholder="Try “inventory” or “lead time”" autocomplete="off"></div><dl class="glossary-list">${terms.map(t=>`<div class="term" data-term="${escapeHTML((t[0]+' '+t[1]).toLowerCase())}"><dt>${inline(t[0])}</dt><dd>${inline(t[1])}</dd></div>`).join('')}</dl><p class="empty glossary-empty" hidden>No matching term. Try a broader word.</p></section>`;
}

function faqEnhance(html){ return `<div class="faq">${html.replace(/<h3 id="([^"]+)">([^<]+)<\/h3>\s*<p>([\s\S]*?)<\/p>/g,'<details><summary>$2</summary><p>$3</p></details>')}</div>`; }

function routeImage(key){
  if(['journey','practice'].includes(key)) return './assets/operations-flow.png';
  if(['skills','careers','foundations'].includes(key)) return './assets/people-decisions-network.png';
  return './assets/global-logistics-network.png';
}

function renderHome(){
  return `<section class="hero hero-global"><div class="hero-copy"><span class="eyebrow">The world in motion</span><p class="brand-command">LOGISTICS <span>&amp;</span> SUPPLY CHAIN</p><h1>Connect the world. <em>Move what matters.</em></h1><p class="hero-lede">Behind every product is a living global system—people, materials, transport, technology, information and decisions working across borders to turn demand into delivery.</p><div class="actions"><a class="button" href="#understand">Understand the whole system</a><a class="button secondary" href="#journey">Follow the complete journey</a></div></div><figure class="hero-visual"><img src="./assets/global-logistics-network.png" alt="A worldwide logistics network connecting sea, rail, road, air, warehousing and cities" fetchpriority="high"><figcaption>Sea · Rail · Road · Air · Warehousing · Last mile</figcaption></figure></section>
  <section class="brand-ribbon" aria-label="Logistics and Supply Chain statement"><span>LOGISTICS &amp; SUPPLY CHAIN</span><strong>Movement is visible. The system behind it is the real story.</strong></section>
  <div class="route-strip"><a href="#understand"><small>01 · Orient</small><strong>Understand the field</strong></a><a href="#journey"><small>02 · Follow</small><strong>See the journey</strong></a><a href="#foundations"><small>03 · Prepare</small><strong>Build foundations</strong></a><a href="#practice"><small>04 · Apply</small><strong>Try the lab</strong></a></div>
  <section class="section"><span class="eyebrow">The power behind the product</span><h2>Logistics moves the world. Supply chain thinking makes that movement possible.</h2><p class="section-intro">A backpack, medicine, machine part or meal reaches its destination because thousands of connected choices happen at the right time. Learn to see those choices—and you begin to see the whole world differently.</p><div class="path-grid"><article class="card power-card"><span class="number">FLOW 01</span><h3>Move physical goods</h3><p>Materials and products travel through suppliers, production, ports, warehouses, delivery networks and returns.</p></article><article class="card power-card"><span class="number">FLOW 02</span><h3>Keep information alive</h3><p>Orders, forecasts, stock records, documents, tracking and feedback tell every participant what must happen next.</p></article><article class="card power-card"><span class="number">FLOW 03</span><h3>Make connected decisions</h3><p>People balance service, cost, speed, capacity, quality, risk and environmental impact across the network.</p></article></div></section>
  <section class="section network"><span class="eyebrow">Connected, not linear</span><h2>The network keeps thinking while the product keeps moving.</h2><div class="network-map"><div class="node"><b>Need</b><strong>Demand</strong><p>What, where and when?</p></div><div class="node"><b>Source</b><strong>Supply</strong><p>Who can provide it?</p></div><div class="node"><b>Make & hold</b><strong>Operations</strong><p>How will it be ready?</p></div><div class="node"><b>Move</b><strong>Delivery</strong><p>How will the promise be met?</p></div><div class="node"><b>Learn</b><strong>Feedback</strong><p>What should improve?</p></div></div></section>
  <section class="section article">${markdown(sections[1]?.body||'')}<div class="next-card"><h2>Start with one product. Discover the system behind it.</h2><p>You do not need every answer today. Begin with a clear question, explore a simple example, and build your understanding one step at a time.</p><a href="#journey">Begin your learning journey</a></div></section>`;
}

function renderRoute(key){
  const route=routes[key]||routes.home;
  document.title=`${route.title} — Logistics & Supply Chain`;
  nav.querySelectorAll('a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')===`#${key}`));
  if(key==='home') return renderHome();
  let tool='';
  if(key==='journey') tool=journeyTool();
  if(key==='foundations') tool=foundationsTool();
  if(key==='careers') tool=careerTool();
  if(key==='practice') tool=practiceTool();
  if(key==='glossary') tool=glossaryTool();
  const content = route.sections.map(i=>{
    if(key==='glossary'&&i===14) return '';
    let body=markdown(sections[i]?.body||'');
    if(key==='faqs') body=faqEnhance(body);
    return `<section id="${slugify(sections[i]?.cleanHeading||'section')}"><h2>${inline(sections[i]?.cleanHeading||'')}</h2>${body}</section>`;
  }).join('');
  const toc=route.sections.map(i=>`<a href="#${key}/${slugify(sections[i]?.cleanHeading||'section')}">${escapeHTML(sections[i]?.cleanHeading||'')}</a>`).join('');
  return `<header class="page-hero page-hero-visual"><div class="page-hero-copy"><span class="brand-stamp">LOGISTICS &amp; SUPPLY CHAIN</span><span class="eyebrow">${route.eyebrow}</span><h1>${route.title}</h1><p>${route.intro}</p></div><div class="page-hero-image" role="img" aria-label="${route.title} visual showing the connected world of logistics and supply chain" style="--route-image:url('${routeImage(key)}')"></div></header><div class="page-shell"><aside class="toc" aria-label="On this page"><strong>On this page</strong>${toc}</aside><article class="article">${tool}${content}<div class="next-card"><span class="brand-stamp light">LOGISTICS &amp; SUPPLY CHAIN</span><h2>Keep the system connected</h2><p>Move between ideas, then return to the journey or practice lab to turn understanding into operational thinking.</p><a href="#journey">Review the journey</a> · <a href="#practice">Open the practice lab</a></div></article></div>`;
}

function setupInteractions(key){
  if(key==='journey'){
    const tabs=[...document.querySelectorAll('[data-stage]')];
    const stages=[
      ['Demand','A customer need becomes a plan.','Customer, planner, sales team','Orders, forecasts, service promise','How much may be needed, where and when?','Forecast error or an unrealistic promise.'],['Sourcing','Materials and finished goods are obtained.','Buyer, supplier, quality team','Specifications, quantities, prices, lead times','Which source balances cost, quality and reliability?','Late supply, poor quality or unclear requirements.'],['Production','Materials become a finished backpack.','Production team, planner, suppliers','Bill of materials, schedule, capacity, quality records','What should be made, in what sequence?','A bottleneck, missing material or quality failure.'],['Storage','Products are recorded and placed safely.','Warehouse team, inventory controller','SKU, quantity, condition, location','Where should stock be placed and found?','Damage, incorrect count or unclear location.'],['Fulfilment','An order is checked, picked, packed and labelled.','Customer service, picker, packer','Order, availability, address, handling needs','Can the exact promise be fulfilled?','Wrong item, missing stock or incomplete address.'],['Delivery','The shipment moves to the recipient.','Carrier, coordinator, customer','Route, service level, tracking, proof','Which option meets the promise sensibly?','Delay, damage or poor visibility.'],['Returns','The product and records move back.','Customer, carrier, returns team, finance','Reason, condition, authorisation, refund','Resell, repair, recycle or dispose?','Lost value or an unrecorded stock change.'],['Improve','Results shape the next cycle.','Managers, analysts, operational teams','Service, cost, quality and feedback data','What caused the result, and what should change?','Treating a symptom instead of the cause.']
    ];
    const panel=document.querySelector('#journey-panel');
    const show=i=>{const s=stages[i]; tabs.forEach((t,n)=>t.setAttribute('aria-selected',String(n===i))); panel.innerHTML=`<span class="eyebrow">Stage ${String(i+1).padStart(2,'0')}</span><h3>${s[0]}</h3><p>${s[1]}</p><div class="journey-detail"><div><b>Who is involved</b>${s[2]}</div><div><b>Information needed</b>${s[3]}</div><div><b>Decision</b>${s[4]}</div><div><b>What can go wrong</b>${s[5]}</div></div>`;};
    tabs.forEach((t,i)=>t.addEventListener('click',()=>show(i))); show(0);
  }
  if(key==='foundations'){
    const boxes=[...document.querySelectorAll('[data-foundation]')], bar=document.querySelector('.progress span'), label=document.querySelector('.progress-label');
    const update=()=>{const n=boxes.filter(b=>b.checked).length;bar.style.width=`${n/boxes.length*100}%`;label.textContent=`${n} of ${boxes.length} areas reviewed`;}; boxes.forEach(b=>b.addEventListener('change',update)); document.querySelector('.reset-check').addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);update();boxes[0].focus();});
  }
  if(key==='careers') document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.career-card').forEach(c=>c.hidden=btn.dataset.filter!=='all'&&c.dataset.kind!==btn.dataset.filter);}));
  if(key==='practice'){
    const orders=document.querySelector('#orders'), delay=document.querySelector('#delay-days');
    const costs=()=>{const n=Math.max(0,Number(orders.value)||0);document.querySelector('#cost-result').innerHTML=`Standard: <strong>€${n*4}</strong> · Express: <strong>€${n*7}</strong> · Additional Express cost: <strong>€${n*3}</strong>`;};
    const delays=()=>{const n=Math.max(0,Number(delay.value)||0);document.querySelector('#delay-result').innerHTML=`At 20 orders per working day, ${n} extra day${n===1?'':'s'} represents <strong>${n*20} backpacks</strong> of additional expected demand across the range. This is a learning estimate, not a complete reorder recommendation.`;}; orders.addEventListener('input',costs);delay.addEventListener('input',delays);costs();delays();
  }
  if(key==='glossary') document.querySelector('#term-search').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();let shown=0;document.querySelectorAll('.term').forEach(t=>{t.hidden=q&&!t.dataset.term.includes(q);if(!t.hidden)shown++;});document.querySelector('.glossary-empty').hidden=shown!==0;});
}

function navigate(){
  const [key='home', anchor] = location.hash.slice(1).split('/');
  const routeKey=routes[key]?key:'home';
  main.innerHTML=renderRoute(routeKey); setupInteractions(routeKey);
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');
  requestAnimationFrame(()=>{if(anchor){document.getElementById(anchor)?.scrollIntoView();}else{window.scrollTo(0,0);} main.focus({preventScroll:true});});
}

fetch('./content.md').then(r=>{if(!r.ok) throw new Error('Content unavailable');return r.text();}).then(text=>{sections=parseSource(text);navigate();window.addEventListener('hashchange',navigate);}).catch(()=>{main.innerHTML='<div class="empty"><h1>The guide could not load</h1><p>Please run the site through a local web server so its content file can be read.</p></div>';});
