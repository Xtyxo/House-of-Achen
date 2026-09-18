// House of Achen Dream Dashboard — mobile-first shell inspired by the approved dashboard artwork.
// Uses the app's existing state and money helpers; no concept-art balances are hard-coded.
window.HOUSE_OF_ACHEN_DREAM_DASHBOARD = true;

function hoaDreamDateLabel(){
  return new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
}
function hoaDreamLocationLabel(){
  const label=(state?.settings?.weatherLabel||'').trim();
  return label && label!=='My location' ? label : 'Plano, TX';
}
function hoaDreamOpenMenu(){
  const toggle=document.getElementById('menuToggle');
  if(toggle){toggle.click();return;}
  document.getElementById('sidebar')?.classList.toggle('open');
}
function hoaDreamLife(tab){
  if(!state.ui)state.ui={};
  state.ui.lifeTab=tab;
  saveState(false);
  nav('life');
}
function hoaDreamShortLabel(value){
  const s=String(value||'Item').replace(/\s+/g,' ').trim();
  return s.length>11?s.slice(0,10)+'…':s;
}
function hoaDreamAccounts(){
  try{if(typeof hoaEnsureManualInvestments==='function')hoaEnsureManualInvestments();}catch{}
  const all=Array.isArray(state.accounts)?state.accounts:[];
  return all.filter(a=>a && (a.snapshot===true || a.manual===true || a.connected===true));
}
function hoaDreamAccountMarkup(){
  const accounts=hoaDreamAccounts();
  if(!accounts.length)return '<div class="hoa-dream-empty">No account balances are available yet.</div>';
  const cards=accounts.map((a,i)=>{
    const raw=typeof rawBalanceFor==='function'?rawBalanceFor(a):num(a.currentBalance??a.rawBalance);
    const cap=typeof accountCapacity==='function'?accountCapacity(a):{planning:raw};
    const adjusted=Math.abs(num(cap?.planning)-num(raw))>.001;
    const kind=a.manual?'invest':'bank';
    return `<button class="hoa-dream-account tone-${(i%6)+1}" onclick="nav('accounts')" aria-label="Open accounts">
      <span class="hoa-dream-account-icon">${hoaIcon(kind,20)}</span>
      <span class="hoa-dream-account-copy"><b>${esc(a.name||a.institution||'Account')}</b><small>${esc(a.institution||a.type||'')}</small></span>
      <strong>${money(raw)}</strong>
      ${adjusted?`<em>Planning ${money(cap.planning)}</em>`:''}
    </button>`;
  }).join('');
  const total=accounts.reduce((sum,a)=>sum+(typeof rawBalanceFor==='function'?rawBalanceFor(a):num(a.currentBalance??a.rawBalance)),0);
  return `${cards}<button class="hoa-dream-account hoa-dream-total" onclick="nav('accounts')" aria-label="Open accounts"><span class="hoa-dream-account-icon">${hoaIcon('wallet',20)}</span><span class="hoa-dream-account-copy"><b>All Accounts</b><small>Raw balances</small></span><strong>${money(total)}</strong></button>`;
}
function hoaDreamSpendingItems(p){
  const tx=typeof paycheckTransactions==='function'?paycheckTransactions(p):(state.transactions||[]);
  const sums=new Map();
  tx.filter(t=>t && t.status==='Done' && t.group!=='Income' && t.group!=='Transfer' && t.countedElsewhere!==true).forEach(t=>{
    const key=(t.category||t.group||'Other').trim()||'Other';
    const value=Math.abs(num(t.paidAmount||t.plannedAmount));
    if(value>0)sums.set(key,(sums.get(key)||0)+value);
  });
  const palette=['#c64f91','#df77a8','#7b5cb8','#b78ada','#8994dc','#6f78bd','#e5a2bf','#b8a1e6'];
  const rows=[...sums.entries()].sort((a,b)=>b[1]-a[1]);
  if(rows.length>7){
    const rest=rows.slice(6).reduce((s,x)=>s+x[1],0);
    rows.splice(6,rows.length-6,['Other',rest]);
  }
  return rows.map(([label,value],i)=>({label,value,color:palette[i%palette.length]}));
}
function hoaDreamPlanRows(p){
  if(!p)return[];
  const rows=[];
  (p.allocations||[]).forEach(a=>rows.push({label:hoaDreamShortLabel(a.name),planned:num(a.planned),actual:num(a.moved)}));
  const tx=typeof paycheckTransactions==='function'?paycheckTransactions(p):[];
  const doneBills=tx.filter(t=>t.status==='Done'&&t.group==='Bills').reduce((s,t)=>s+Math.abs(num(t.paidAmount||t.plannedAmount)),0);
  if(num(p.billsDue)>0||doneBills>0)rows.push({label:'Bills',planned:num(p.billsDue),actual:doneBills});
  const quickCap=(p.quickSpend||[]).reduce((s,q)=>s+num(q.cap),0);
  const quickDone=tx.filter(t=>t.status==='Done'&&t.group==='Expenses').reduce((s,t)=>s+Math.abs(num(t.paidAmount||t.plannedAmount)),0);
  if(quickCap>0||quickDone>0)rows.push({label:'Quick spend',planned:quickCap,actual:quickDone});
  return rows.sort((a,b)=>Math.max(b.planned,b.actual)-Math.max(a.planned,a.actual)).slice(0,6);
}
function hoaDreamTile(icon,title,sub,action,tone){
  return `<button class="hoa-dream-tile ${tone||''}" onclick="${action}"><span class="hoa-dream-tile-icon">${hoaIcon(icon,24)}</span><b>${title}</b><small>${sub}</small></button>`;
}
function hoaDreamTiles(){
  return [
    hoaDreamTile('planner','Payday Desk','Accounts, bills & cash flow',"nav('payday')",'rose'),
    hoaDreamTile('receipt','Transactions','View, edit & categorize',"nav('transactions')",'peach'),
    hoaDreamTile('chart','Budgets','Stay on track',"nav('home')",'blue'),
    hoaDreamTile('goal','Goals & Funds','Big dreams, little steps',"nav('goals')",'lav'),
    hoaDreamTile('calendar','Calendar','Everything in one place',"nav('calendar')",'rose'),
    hoaDreamTile('wallet','Shopping','Deals, wishlists & trackers',"hoaDreamLife('wishlist')",'blue'),
    hoaDreamTile('beauty','Beauty & Self Care','Glow inside and out',"hoaDreamLife('library')",'peach'),
    hoaDreamTile('home','House & Living','A cozy, calm home',"hoaDreamLife('stockpile')",'mint'),
    hoaDreamTile('cat','Luna & Diana','Our sweet companions',"nav('review')",'lav'),
    hoaDreamTile('note','Notes','Ideas, lists & reminders',"nav('notes')",'rose'),
    hoaDreamTile('settings','Documents','Backup & important files',"nav('backup')",'blue')
  ].join('');
}
function hoaDreamMoodButtons(){
  const mood=state.ui?.chillMood||'';
  return ['quiet','low','okay','good','wired'].map(k=>`<button class="hoa-dream-mood ${mood===k?'active':''}" onclick="setChillMood('${k}')">${k[0].toUpperCase()+k.slice(1)}</button>`).join('');
}
function hoaDreamDashboard(){
  const p=typeof selectedPaycheck==='function'?selectedPaycheck():null;
  const c=typeof calcPaycheck==='function'?calcPaycheck(p):{safe:0,actualCashLeft:0,stillNeed:0};
  const quote=typeof dailyQuote==='function'?dailyQuote():'Small progress still counts.';
  const host=document.getElementById('content');
  if(!host)return;
  document.getElementById('pageTitle')?.replaceChildren(document.createTextNode('Home'));
  host.innerHTML=`<div class="hoa-dream-dashboard">
    <section class="hoa-dream-banner">
      <button class="hoa-banner-menu" onclick="hoaDreamOpenMenu()" aria-label="Open menu"><span class="hoa-menu-bars" aria-hidden="true"></span></button>
      <div class="hoa-dream-banner-copy">
        <span>Welcome back,</span>
        <h1>Christy</h1>
        <p>“A softer, brighter, more abundant you.”</p>
      </div>
      <div class="hoa-dream-banner-pets" aria-hidden="true">
        <div class="hoa-dream-pet luna"><img src="./assets/cats/luna-full.webp" alt=""></div>
        <div class="hoa-dream-pet diana"><img src="./assets/cats/diana-full.webp" alt=""></div>
      </div>
      <div class="hoa-dream-date"><b>${esc(hoaDreamDateLabel())}</b><span>${esc(hoaDreamLocationLabel())}</span><small>A brighter day ahead</small></div>
    </section>

    <section class="hoa-dream-panel hoa-dream-accounts">
      <div class="hoa-dream-section-head"><div><h2>Account Overview</h2><p>Your current balances, pulled from the app data.</p></div><button onclick="nav('accounts')">View all</button></div>
      <div class="hoa-dream-account-strip">${hoaDreamAccountMarkup()}</div>
    </section>

    <section class="hoa-dream-money-strip" aria-label="Paycheck summary">
      <button onclick="nav('payday')"><span>Free to Use</span><b>${money(c.safe)}</b></button>
      <button onclick="nav('payday')"><span>Currently Sitting</span><b>${money(c.actualCashLeft)}</b></button>
      <button onclick="nav('payday')"><span>Spoken For</span><b>${money(c.stillNeed)}</b></button>
    </section>

    <section class="hoa-dream-charts">
      <div class="hoa-dream-chart-card"><div class="hoa-dream-card-head"><div><h2>Spending This Paycheck</h2><p>Completed planner spending by category.</p></div>${hoaIcon('chart',20)}</div><div class="hoa-dream-chart-wrap"><canvas id="hoaDreamSpendChart"></canvas></div></div>
      <div class="hoa-dream-chart-card"><div class="hoa-dream-card-head"><div><h2>Plan vs Activity</h2><p>What you planned compared with what has actually moved.</p></div>${hoaIcon('insight',20)}</div><div class="hoa-dream-chart-wrap"><canvas id="hoaDreamPlanChart"></canvas></div></div>
    </section>

    <section class="hoa-dream-panel hoa-dream-explore">
      <div class="hoa-dream-section-head"><div><h2>Explore Your Dashboard</h2><p>Organized life · happier mind · prettier future</p></div></div>
      <div class="hoa-dream-tile-strip">${hoaDreamTiles()}</div>
    </section>

    <section class="hoa-dream-soft-row">
      <div class="hoa-dream-soft-card affirmation"><span>${hoaIcon('sparkle',18)}</span><div><small>Today's affirmation</small><b>“${esc(quote)}”</b></div></div>
      <div class="hoa-dream-soft-card"><span>${hoaIcon('life',18)}</span><div class="hoa-dream-soft-grow"><small>Mood check-in</small><div class="hoa-dream-moods">${hoaDreamMoodButtons()}</div></div></div>
      <div class="hoa-dream-soft-card brain"><span>${hoaIcon('note',18)}</span><div class="hoa-dream-soft-grow"><small>Brain dump</small><textarea oninput="saveChillNote(this.value)" placeholder="Leave the thought here…">${esc(state.ui?.chillNote||'')}</textarea></div></div>
      <button class="hoa-dream-soft-card music" onclick="openPandora()"><span>${hoaIcon('sparkle',18)}</span><div><small>Music dock</small><b>${esc(state.settings?.pandoraLabel||'Open Pandora')}</b></div></button>
    </section>
  </div>`;

  requestAnimationFrame(()=>{
    try{pie(document.getElementById('hoaDreamSpendChart'),hoaDreamSpendingItems(p));}catch(e){console.warn('Dream spending chart',e);}
    try{bars(document.getElementById('hoaDreamPlanChart'),hoaDreamPlanRows(p),[
      {key:'planned',label:'Planned',color:'#b89cf1'},
      {key:'actual',label:'Actual',color:'#d85b9b'}
    ]);}catch(e){console.warn('Dream plan chart',e);}
  });
}

function hoaDreamInstallBottomTabs(){
  let dock=document.getElementById('hoaDreamBottomTabs');
  if(!dock){
    dock=document.createElement('nav');
    dock.id='hoaDreamBottomTabs';
    dock.className='hoa-dream-bottom-tabs';
    dock.setAttribute('aria-label','Primary navigation');
    dock.innerHTML=`
      <button data-view="dashboard" onclick="nav('dashboard')">${hoaIcon('home',21)}<span>Home</span></button>
      <button data-view="payday" onclick="nav('payday')">${hoaIcon('planner',21)}<span>Payday</span></button>
      <button data-view="transactions" onclick="nav('transactions')">${hoaIcon('receipt',21)}<span>Activity</span></button>
      <button data-view="accounts" onclick="nav('accounts')">${hoaIcon('bank',21)}<span>Accounts</span></button>
      <button data-view="goals" onclick="nav('goals')">${hoaIcon('goal',21)}<span>Goals</span></button>`;
    document.body.appendChild(dock);
  }
  dock.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  document.body.classList.toggle('hoa-dream-home',currentView==='dashboard');
}

// Replace only the landing dashboard. All existing money/life views and stored data remain intact.
renderDashboard=hoaDreamDashboard;
const hoaDreamBaseRender=render;
render=function(){
  const result=hoaDreamBaseRender();
  hoaDreamInstallBottomTabs();
  return result;
};

// A full app/browser launch should always land on Home instead of restoring the last screen.
// Navigation still remembers the current view while the app remains open.
if(!state.ui)state.ui={};
currentView='dashboard';
state.ui.view='dashboard';
saveState(false);

hoaDreamInstallBottomTabs();
render();


// Stabilization pass 1: keep mobile text editing focused and restore the Pandora dock.
function hoaDreamMusicDockMarkup(){
  const label=(state.settings?.pandoraLabel||'My Pandora').trim()||'My Pandora';
  const hasPandora=!!String(state.settings?.pandoraUrl||'').trim();
  return `<section class="hoa-dream-music-dock" aria-label="Pandora music dock">
    <div class="hoa-dream-music-icon" aria-hidden="true">${hoaIcon('note',24)}</div>
    <div class="hoa-dream-music-copy">
      <small>PANDORA MUSIC DOCK</small>
      <b>${esc(label)}</b>
      <span>${hasPandora?'Your saved Pandora station is ready.':'Set your favorite Pandora station or playlist.'}</span>
      <div class="hoa-dream-equalizer" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
    </div>
    <div class="hoa-dream-music-actions">
      <button class="hoa-dream-music-play" onclick="openPandora()">${hoaIcon('sparkle',16)} Open Pandora</button>
      <button class="hoa-dream-music-settings" onclick="openPandoraSettings()">${hasPandora?'Change':'Set'} default</button>
    </div>
  </section>`;
}
function hoaDreamUpgradeDashboard(){
  if(currentView!=='dashboard')return;
  const root=document.querySelector('.hoa-dream-dashboard');
  if(!root)return;
  const accounts=root.querySelector('.hoa-dream-accounts');
  if(accounts&&!root.querySelector('.hoa-dream-music-dock')){
    accounts.insertAdjacentHTML('beforebegin',hoaDreamMusicDockMarkup());
  }
  root.querySelector('.hoa-dream-soft-card.music')?.remove();
}
function hoaDreamHasFocusedEditor(){
  if(currentView!=='dashboard')return false;
  const el=document.activeElement;
  if(!el||!el.closest?.('.hoa-dream-dashboard'))return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}
const hoaDreamStableRender=render;
render=function(){
  // Android shows/hides the keyboard by resizing the viewport. The legacy resize
  // handler calls render(), so do not replace a focused dashboard field mid-edit.
  if(hoaDreamHasFocusedEditor()){
    hoaDreamInstallBottomTabs();
    return;
  }
  const result=hoaDreamStableRender();
  hoaDreamUpgradeDashboard();
  return result;
};
hoaDreamUpgradeDashboard();
