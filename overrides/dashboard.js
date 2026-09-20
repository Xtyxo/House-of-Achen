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


// Dashboard pass 2: transparent paycheck math, account charts, and 30-day mood history.
function hoaDashboardPaycheckBreakdown(p,c){
  if(!p)return '<div class="hoa-formula-empty">No current paycheck is selected.</div>';
  const moved=(p.allocations||[]).reduce((sum,a)=>sum+num(a.moved),0);
  const logged=num(c.logged);
  const cushion=num(p.cushion);
  return `<div class="hoa-formula-grid">
    <div><span>Net pay</span><b>${money(p.netPay)}</b></div>
    <div><span>Starting checking</span><b>${money(p.startingChecking)}</b></div>
    <div><span>Other income</span><b>${money(p.otherIncome)}</b><small>Manual paycheck input — bank inflows are not auto-added here.</small></div>
    <div class="hoa-formula-total"><span>Available Cash</span><b>${money(c.available)}</b><small>${money(p.netPay)} + ${money(p.startingChecking)} + ${money(p.otherIncome)}</small></div>
    <div><span>Actually moved</span><b>− ${money(moved)}</b></div>
    <div><span>Logged spending</span><b>− ${money(logged)}</b></div>
    <div class="hoa-formula-total"><span>Actual Cash Left</span><b>${money(c.actualCashLeft)}</b><small>Available Cash − moved − logged spending</small></div>
    <div><span>Still need to fund</span><b>− ${money(c.stillNeed)}</b></div>
    <div><span>Keep-in-checking cushion</span><b>− ${money(cushion)}</b></div>
    <div class="hoa-formula-total hoa-formula-safe"><span>Safe to Spend</span><b>${money(c.safe)}</b><small>Actual Cash Left − still needed − cushion</small></div>
  </div><div class="hoa-formula-foot"><b>House of Achen spreadsheet logic:</b> transfers between your own bank accounts do not create new paycheck income. If Other Income is wrong, edit the paycheck input instead of letting a bank transfer silently change the formula.</div>`;
}
function hoaToggleAvailableBreakdown(){
  const panel=document.getElementById('hoaAvailableBreakdown');
  const btn=document.getElementById('hoaAvailableCashBtn');
  if(!panel)return;
  const opening=panel.hasAttribute('hidden');
  if(opening)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
  btn?.setAttribute('aria-expanded',opening?'true':'false');
}
function hoaDashboardBankAccounts(){
  return (state.accounts||[]).filter(a=>a&&(a.snapshot===true||a.connected===true)&&a.type!=='Investment');
}
function hoaDashboardAccountPieItems(){
  const palette=['#c65a94','#7b68bd','#7898d9','#73a98c','#d99672','#a879bd','#6d8fa8','#d6a15f'];
  return hoaDashboardBankAccounts()
    .map((a,i)=>({label:hoaDreamShortLabel(a.name||a.institution),value:Math.max(0,typeof rawBalanceFor==='function'?rawBalanceFor(a):num(a.currentBalance??a.rawBalance)),color:palette[i%palette.length]}))
    .filter(x=>x.value>0);
}
function hoaSignedAccountBars(canvas){
  if(!canvas)return;
  const rows=hoaDashboardBankAccounts().map(a=>({label:hoaDreamShortLabel(a.name||a.institution),value:typeof rawBalanceFor==='function'?rawBalanceFor(a):num(a.currentBalance??a.rawBalance)}));
  const {ctx,W,H}=prepCanvas(canvas),pad={l:54,r:14,t:22,b:52},cw=W-pad.l-pad.r,ch=H-pad.t-pad.b;
  if(!rows.length){ctx.fillStyle='#8a7d91';ctx.textAlign='center';ctx.font='12px system-ui';ctx.fillText('No linked balances yet',W/2,H/2);return;}
  let min=Math.min(0,...rows.map(r=>r.value)),max=Math.max(0,...rows.map(r=>r.value));
  if(max===min){max+=1;min-=1;}
  const y=v=>pad.t+(max-v)/(max-min)*ch,zero=y(0);
  ctx.strokeStyle='#eadff0';ctx.lineWidth=1;
  for(let i=0;i<5;i++){const val=max-(max-min)*i/4,gy=y(val);ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(W-pad.r,gy);ctx.stroke();}
  ctx.strokeStyle='#8f8398';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(pad.l,zero);ctx.lineTo(W-pad.r,zero);ctx.stroke();
  const groupW=cw/rows.length,bw=Math.max(8,Math.min(28,groupW*.56));
  rows.forEach((r,i)=>{
    const x=pad.l+i*groupW+groupW/2-bw/2,vy=y(r.value),top=Math.min(vy,zero),h=Math.max(1,Math.abs(vy-zero));
    ctx.fillStyle=r.value<0?'#d45c83':'#806ac2';ctx.fillRect(x,top,bw,h);
    ctx.fillStyle='#6f6478';ctx.font='8.5px system-ui';ctx.textAlign='center';ctx.fillText(r.label,pad.l+i*groupW+groupW/2,H-27);
    ctx.fillStyle=r.value<0?'#b9486f':'#5f4e97';ctx.font='8px system-ui';ctx.fillText(money(r.value),pad.l+i*groupW+groupW/2,r.value<0?Math.min(H-pad.b+13,vy+12):Math.max(10,vy-5));
  });
  ctx.textAlign='right';ctx.font='9px system-ui';ctx.fillStyle='#7f7388';ctx.fillText(money(max),pad.l-5,pad.t+3);ctx.fillText(money(min),pad.l-5,pad.t+ch);
}
const HOA_MOOD_SCORES={low:1,quiet:2,okay:3,good:4,wired:5};
const HOA_MOOD_LABELS=['','Low','Quiet','Okay','Good','Wired'];
function hoaEnsureMoodHistory(){
  if(!state.ui)state.ui={};
  if(!Array.isArray(state.ui.moodHistory))state.ui.moodHistory=[];
  const mood=state.ui.chillMood;
  if(mood&&HOA_MOOD_SCORES[mood]){
    const today=todayISO();
    if(!state.ui.moodHistory.some(x=>x.date===today))state.ui.moodHistory.push({date:today,mood});
  }
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-60);
  const cutoffIso=dateISO(cutoff);
  state.ui.moodHistory=state.ui.moodHistory.filter(x=>x?.date>=cutoffIso&&HOA_MOOD_SCORES[x.mood]);
}
function hoaMoodRows30(){
  hoaEnsureMoodHistory();
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-29);
  const cutoffIso=dateISO(cutoff);
  return state.ui.moodHistory.filter(x=>x.date>=cutoffIso).sort((a,b)=>a.date.localeCompare(b.date)).map(x=>({label:parseDate(x.date).toLocaleDateString(undefined,{month:'numeric',day:'numeric'}),value:HOA_MOOD_SCORES[x.mood],mood:x.mood}));
}
function hoaMoodLine(canvas){
  if(!canvas)return;
  const rows=hoaMoodRows30(),{ctx,W,H}=prepCanvas(canvas),pad={l:54,r:18,t:24,b:40},cw=W-pad.l-pad.r,ch=H-pad.t-pad.b;
  ctx.font='9px system-ui';ctx.fillStyle='#766c80';ctx.textAlign='right';
  for(let s=1;s<=5;s++){const y=pad.t+(5-s)/4*ch;ctx.strokeStyle='#eee4f1';ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();ctx.fillStyle='#766c80';ctx.fillText(HOA_MOOD_LABELS[s],pad.l-7,y+3);}
  if(!rows.length){ctx.textAlign='center';ctx.font='12px system-ui';ctx.fillText('Mood tracking starts when you choose a mood.',W/2,H/2);return;}
  const pts=rows.map((r,i)=>({x:pad.l+(rows.length===1?cw/2:i*cw/(rows.length-1)),y:pad.t+(5-r.value)/4*ch,r}));
  ctx.strokeStyle='#c75b98';ctx.lineWidth=3;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
  pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#7c63b8';ctx.lineWidth=2.5;ctx.stroke();});
  ctx.fillStyle='#766c80';ctx.textAlign='center';ctx.font='8.5px system-ui';pts.forEach((p,i)=>{if(rows.length<=10||i%Math.ceil(rows.length/8)===0)ctx.fillText(p.r.label,p.x,H-17);});
}
const hoaDashboardPass2Base=renderDashboard;
renderDashboard=function(){
  hoaDashboardPass2Base();
  hoaEnsureMoodHistory();
  const root=document.querySelector('.hoa-dream-dashboard');
  if(!root)return;
  const p=typeof selectedPaycheck==='function'?selectedPaycheck():null;
  const c=typeof calcPaycheck==='function'?calcPaycheck(p):{available:0,safe:0,actualCashLeft:0,stillNeed:0,logged:0};
  const moneyStrip=root.querySelector('.hoa-dream-money-strip');
  if(moneyStrip){
    moneyStrip.innerHTML=`
      <button id="hoaAvailableCashBtn" onclick="hoaToggleAvailableBreakdown()" aria-expanded="false"><span>Available Cash</span><b>${money(c.available)}</b><small>Tap to see exactly why</small></button>
      <button onclick="nav('payday')"><span>Safe to Spend</span><b>${money(c.safe)}</b><small>Spreadsheet-style final amount</small></button>
      <button onclick="nav('payday')"><span>Currently Sitting</span><b>${money(c.actualCashLeft)}</b><small>After moved + logged spending</small></button>
      <button onclick="nav('payday')"><span>Spoken For</span><b>${money(c.stillNeed)}</b><small>Still needs a job</small></button>`;
    let breakdown=document.getElementById('hoaAvailableBreakdown');
    if(!breakdown){breakdown=document.createElement('section');breakdown.id='hoaAvailableBreakdown';breakdown.className='hoa-available-breakdown';breakdown.hidden=true;moneyStrip.insertAdjacentElement('afterend',breakdown);}
    breakdown.innerHTML=hoaDashboardPaycheckBreakdown(p,c);
  }
  const charts=root.querySelector('.hoa-dream-charts');
  if(charts){
    charts.innerHTML=`<div class="hoa-dream-chart-card"><div class="hoa-dream-card-head"><div><h2>Account Balance Mix</h2><p>Positive linked balances by account. Negative balances stay out of the pie and appear in the bar chart.</p></div>${hoaIcon('chart',20)}</div><div class="hoa-dream-chart-wrap"><canvas id="hoaAccountPieChart"></canvas></div></div>
    <div class="hoa-dream-chart-card"><div class="hoa-dream-card-head"><div><h2>Account Balances</h2><p>Signed balances — anything below zero drops under the baseline.</p></div>${hoaIcon('bank',20)}</div><div class="hoa-dream-chart-wrap"><canvas id="hoaAccountBalanceBar"></canvas></div></div>`;
  }
  if(!root.querySelector('.hoa-mood-history-card')){
    const chartSection=root.querySelector('.hoa-dream-charts');
    chartSection?.insertAdjacentHTML('afterend',`<section class="hoa-dream-panel hoa-mood-history-card"><div class="hoa-dream-section-head"><div><h2>30-Day Mood Pattern</h2><p>Your check-ins build one day at a time. Changing today's mood updates today's point instead of creating duplicates.</p></div></div><div class="hoa-mood-chart-wrap"><canvas id="hoaMoodHistoryChart"></canvas></div></section>`);
  }
  requestAnimationFrame(()=>{
    try{pie(document.getElementById('hoaAccountPieChart'),hoaDashboardAccountPieItems());}catch(e){console.warn('Account pie',e);}
    try{hoaSignedAccountBars(document.getElementById('hoaAccountBalanceBar'));}catch(e){console.warn('Account bar',e);}
    try{hoaMoodLine(document.getElementById('hoaMoodHistoryChart'));}catch(e){console.warn('Mood history',e);}
  });
};
setChillMood=function(v){
  if(!state.ui)state.ui={};
  state.ui.chillMood=v;
  if(!Array.isArray(state.ui.moodHistory))state.ui.moodHistory=[];
  const today=todayISO(),existing=state.ui.moodHistory.find(x=>x.date===today);
  if(existing)existing.mood=v;else state.ui.moodHistory.push({date:today,mood:v});
  saveState(false);
  render();
};


// Dashboard privacy mode: hide sensitive money information until Christy reveals it.
let hoaFinancePrivacyVisible=false;
function hoaFinancePrivacyTargets(root){
  return [
    root?.querySelector('.hoa-dream-accounts'),
    root?.querySelector('.hoa-dream-money-strip'),
    root?.querySelector('#hoaAvailableBreakdown'),
    root?.querySelector('.hoa-dream-charts')
  ].filter(Boolean);
}
function hoaFinancePrivacyMarkup(){
  return `<section class="hoa-finance-privacy-control" id="hoaFinancePrivacyControl">
    <div class="hoa-finance-privacy-copy">
      <span class="hoa-finance-privacy-icon" aria-hidden="true">✦</span>
      <div><small>FINANCIAL PRIVACY</small><b id="hoaFinancePrivacyStatus">Balances hidden</b><span id="hoaFinancePrivacyHint">Tap the frosted area or button to reveal.</span></div>
    </div>
    <button type="button" id="hoaFinancePrivacyButton" onclick="hoaToggleFinancePrivacy()" aria-pressed="false">Reveal finances</button>
  </section>`;
}
function hoaApplyFinancePrivacy(){
  if(currentView!=='dashboard')return;
  const root=document.querySelector('.hoa-dream-dashboard');
  if(!root)return;
  const accounts=root.querySelector('.hoa-dream-accounts');
  if(accounts&&!root.querySelector('#hoaFinancePrivacyControl')){
    accounts.insertAdjacentHTML('beforebegin',hoaFinancePrivacyMarkup());
  }
  hoaFinancePrivacyTargets(root).forEach(el=>el.classList.add('hoa-finance-sensitive'));
  root.classList.toggle('hoa-finance-private',!hoaFinancePrivacyVisible);
  root.classList.toggle('hoa-finance-visible',hoaFinancePrivacyVisible);
  const btn=root.querySelector('#hoaFinancePrivacyButton');
  const status=root.querySelector('#hoaFinancePrivacyStatus');
  const hint=root.querySelector('#hoaFinancePrivacyHint');
  if(btn){
    btn.textContent=hoaFinancePrivacyVisible?'Hide finances':'Reveal finances';
    btn.setAttribute('aria-pressed',hoaFinancePrivacyVisible?'true':'false');
  }
  if(status)status.textContent=hoaFinancePrivacyVisible?'Balances visible':'Balances hidden';
  if(hint)hint.textContent=hoaFinancePrivacyVisible?'Tap Hide when you are done.':'Tap the frosted area or button to reveal.';
}
function hoaToggleFinancePrivacy(force){
  hoaFinancePrivacyVisible=typeof force==='boolean'?force:!hoaFinancePrivacyVisible;
  hoaApplyFinancePrivacy();
}
function hoaFinancePrivacyIntercept(event){
  if(hoaFinancePrivacyVisible||currentView!=='dashboard')return;
  const target=event.target?.closest?.('.hoa-finance-sensitive');
  if(!target)return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();
  hoaToggleFinancePrivacy(true);
}
if(!document.documentElement.dataset.hoaFinancePrivacyBound){
  document.documentElement.dataset.hoaFinancePrivacyBound='1';
  document.addEventListener('click',hoaFinancePrivacyIntercept,true);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      hoaFinancePrivacyVisible=false;
    }else{
      requestAnimationFrame(hoaApplyFinancePrivacy);
    }
  });
  window.addEventListener('pagehide',()=>{hoaFinancePrivacyVisible=false;});
}
const hoaFinancePrivacyBaseRender=render;
render=function(){
  const result=hoaFinancePrivacyBaseRender();
  requestAnimationFrame(hoaApplyFinancePrivacy);
  return result;
};
requestAnimationFrame(hoaApplyFinancePrivacy);


// Dashboard pass 3: cozy daily home + eye-only account privacy.
try{document.removeEventListener('click',hoaFinancePrivacyIntercept,true)}catch{}

function hoaPrivacyEyeSvg(open){
  return open
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 6.2A9.5 9.5 0 0 1 12 6c6.1 0 9.5 6 9.5 6a15 15 0 0 1-3.2 3.7M6.2 6.2C3.7 8 2.5 12 2.5 12s3.4 6 9.5 6a9.8 9.8 0 0 0 3.2-.5M9.9 9.9A3 3 0 0 0 14.1 14.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
}
function hoaHomeBankAccounts(){
  if(typeof hoaDashboardBankAccounts==='function')return hoaDashboardBankAccounts();
  return (state.accounts||[]).filter(a=>a&&(a.snapshot===true||a.connected===true)&&!a.manual&&a.type!=='Investment');
}
function hoaHomeBankAccountMarkup(){
  const accounts=hoaHomeBankAccounts();
  if(!accounts.length)return '<div class="hoa-dream-empty">No linked bank balances are available yet.</div>';
  const cards=accounts.map((a,i)=>{
    const raw=typeof rawBalanceFor==='function'?rawBalanceFor(a):num(a.currentBalance??a.rawBalance);
    return `<button class="hoa-dream-account tone-${(i%6)+1}" onclick="nav('accounts')" aria-label="Open ${esc(a.name||a.institution||'account')}">
      <span class="hoa-dream-account-icon">${hoaIcon('bank',20)}</span>
      <span class="hoa-dream-account-copy"><b>${esc(a.name||a.institution||'Account')}</b><small>${esc(a.institution||a.type||'')}</small></span>
      <strong>${money(raw)}</strong>
    </button>`;
  }).join('');
  const total=accounts.reduce((sum,a)=>sum+(typeof rawBalanceFor==='function'?rawBalanceFor(a):num(a.currentBalance??a.rawBalance)),0);
  return `${cards}<button class="hoa-dream-account hoa-dream-total" onclick="nav('accounts')" aria-label="Open financial overview"><span class="hoa-dream-account-icon">${hoaIcon('wallet',20)}</span><span class="hoa-dream-account-copy"><b>All Bank Accounts</b><small>Latest available raw balances</small></span><strong>${money(total)}</strong></button>`;
}

const HOA_CAT_MESSAGES=[
  'Luna says: protect your peace. Diana says: and maybe knock one tiny thing off the list.',
  'Luna recommends a cozy five-minute reset. Diana recommends inspecting the snacks.',
  'Diana says you are allowed to have a soft day. Luna has already approved the nap.',
  'Luna says small progress still counts. Diana says being adorable also counts.',
  'Today’s household meeting has concluded: more softness, fewer unnecessary emergencies.',
  'Luna is supervising quietly. Diana is supervising loudly. You are doing fine.'
];
function hoaDailyCatMessage(){
  const d=new Date(),seed=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);
  return HOA_CAT_MESSAGES[Math.abs(seed)%HOA_CAT_MESSAGES.length];
}
function hoaDashboardDailyEntry(){
  if(!state.ui)state.ui={};
  if(!state.ui.dashboardDaily||typeof state.ui.dashboardDaily!=='object')state.ui.dashboardDaily={};
  const key=todayISO();
  if(!state.ui.dashboardDaily[key])state.ui.dashboardDaily[key]={focus:'',win:'',selfCare:{}};
  if(!state.ui.dashboardDaily[key].selfCare)state.ui.dashboardDaily[key].selfCare={};
  return state.ui.dashboardDaily[key];
}
function hoaSaveDashboardDaily(field,value){
  const row=hoaDashboardDailyEntry();
  row[field]=value;
  saveState(false);
}
function hoaSelfCareItems(){
  if(!state.settings)state.settings={};
  if(!Array.isArray(state.settings.dashboardSelfCareItems)||!state.settings.dashboardSelfCareItems.length){
    state.settings.dashboardSelfCareItems=['Skincare','Water','Hair care','Unwind'];
  }
  return state.settings.dashboardSelfCareItems;
}
function hoaSelfCareMarkup(){
  const row=hoaDashboardDailyEntry(),items=hoaSelfCareItems();
  return items.map((item,i)=>`<button type="button" class="hoa-selfcare-chip ${row.selfCare[i]?'done':''}" onclick="hoaToggleSelfCare(${i})"><span>${row.selfCare[i]?'✓':'○'}</span>${esc(item)}</button>`).join('');
}
function hoaToggleSelfCare(i){
  const row=hoaDashboardDailyEntry();
  row.selfCare[i]=!row.selfCare[i];
  saveState(false);
  render();
}
function hoaOpenSelfCareEditor(){
  openModal('Customize self-care',`<div class="field"><label>Daily self-care items</label><textarea id="hoaSelfCareEdit" rows="5" placeholder="One item per line">${esc(hoaSelfCareItems().join('\n'))}</textarea><div class="sub" style="margin-top:6px">Keep it short and useful. These become your daily check-off chips.</div></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="hoaSaveSelfCareItems()">Save</button>`);
}
function hoaSaveSelfCareItems(){
  const items=(document.getElementById('hoaSelfCareEdit')?.value||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).slice(0,8);
  if(!items.length)return toast('Add at least one self-care item');
  state.settings.dashboardSelfCareItems=items;
  saveState(false);closeModal();render();
}
function hoaEnsureReminders(){
  if(!Array.isArray(state.reminders))state.reminders=[];
  return state.reminders;
}
function hoaUpcomingReminders(){
  const today=todayISO();
  return hoaEnsureReminders().filter(r=>r&&!r.done&&r.date>=today).sort((a,b)=>((a.date||'')+(a.time||'')).localeCompare((b.date||'')+(b.time||''))).slice(0,3);
}
function hoaReminderMarkup(){
  const rows=hoaUpcomingReminders();
  if(!rows.length)return '<div class="hoa-reminder-empty">Nothing urgent hanging over you. Add something when you need it.</div>';
  return rows.map(r=>`<div class="hoa-reminder-row"><button class="hoa-reminder-check" onclick="hoaCompleteReminder('${r.id}')" aria-label="Mark reminder complete">○</button><div><b>${esc(r.title||'Reminder')}</b><span>${fmtDate(r.date)}${r.time?' · '+esc(r.time):''}</span></div></div>`).join('');
}
function hoaOpenDashboardReminder(){
  openModal('Add reminder',`<div class="form-grid"><div class="field span2"><label>Reminder</label><input id="hoaReminderTitle" placeholder="What do you want future-you to remember?"></div><div class="field"><label>Date</label><input id="hoaReminderDate" type="date" value="${todayISO()}"></div><div class="field"><label>Time (optional)</label><input id="hoaReminderTime" type="time"></div></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="hoaSaveDashboardReminder()">Add reminder</button>`);
}
function hoaSaveDashboardReminder(){
  const title=(document.getElementById('hoaReminderTitle')?.value||'').trim();
  const date=document.getElementById('hoaReminderDate')?.value||todayISO();
  const time=document.getElementById('hoaReminderTime')?.value||'';
  if(!title)return toast('Add a reminder');
  hoaEnsureReminders().push({id:uid('rem'),title,date,time,done:false,createdAt:new Date().toISOString()});
  saveState(false);closeModal();render();
}
function hoaCompleteReminder(id){
  const r=hoaEnsureReminders().find(x=>x.id===id);
  if(!r)return;
  r.done=true;saveState(false);render();
}

function hoaDashboardV3(){
  const quote=typeof dailyQuote==='function'?dailyQuote():'Small progress still counts.';
  const daily=hoaDashboardDailyEntry();
  const host=document.getElementById('content');
  if(!host)return;
  document.getElementById('pageTitle')?.replaceChildren(document.createTextNode('Home'));
  host.innerHTML=`<div class="hoa-dream-dashboard hoa-dashboard-v3">
    <section class="hoa-dream-banner">
      <button class="hoa-banner-menu" onclick="hoaDreamOpenMenu()" aria-label="Open menu"><span class="hoa-menu-bars" aria-hidden="true"></span></button>
      <div class="hoa-dream-banner-copy"><span>Welcome back,</span><h1>Christy</h1><p>“A softer, brighter, more abundant you.”</p></div>
      <div class="hoa-dream-banner-pets" aria-hidden="true"><div class="hoa-dream-pet luna"><img src="./assets/cats/luna-full.webp" alt=""></div><div class="hoa-dream-pet diana"><img src="./assets/cats/diana-full.webp" alt=""></div></div>
      <div class="hoa-dream-date"><b>${esc(hoaDreamDateLabel())}</b><span>${esc(hoaDreamLocationLabel())}</span><small>A brighter day ahead</small></div>
    </section>

    <section class="hoa-dream-panel hoa-dream-accounts">
      <div class="hoa-dream-section-head"><div><h2>Account Overview</h2><p>Latest available bank snapshots.</p></div><div class="hoa-account-head-actions"><button id="hoaAccountPrivacyEye" class="hoa-account-eye" onclick="hoaToggleFinancePrivacy()" aria-label="Reveal account balances" aria-pressed="false">${hoaPrivacyEyeSvg(false)}</button><button onclick="nav('accounts')">View all</button></div></div>
      <div class="hoa-home-account-private-body"><div class="hoa-dream-account-strip">${hoaHomeBankAccountMarkup()}</div></div>
    </section>

    <section class="hoa-home-affirmation"><span>${hoaIcon('sparkle',20)}</span><div><small>TODAY'S AFFIRMATION</small><b>“${esc(quote)}”</b></div></section>

    ${hoaDreamMusicDockMarkup()}

    <section class="hoa-cat-message"><img src="./assets/cats/luna-head.webp" alt="Luna"><div><small>LUNA & DIANA SAY…</small><b>${esc(hoaDailyCatMessage())}</b></div><img src="./assets/cats/diana-head.webp" alt="Diana"></section>

    <section class="hoa-home-card hoa-focus-card"><div class="hoa-home-card-head"><div><small>TODAY'S LITTLE FOCUS</small><h2>One thing is enough.</h2></div>${hoaIcon('goal',20)}</div><input value="${esc(daily.focus||'')}" oninput="hoaSaveDashboardDaily('focus',this.value)" placeholder="What deserves your attention today?"></section>

    <section class="hoa-home-card hoa-mood-card"><div class="hoa-home-card-head"><div><small>MOOD CHECK-IN</small><h2>How are you feeling?</h2></div>${hoaIcon('life',20)}</div><div class="hoa-dream-moods hoa-v3-moods">${hoaDreamMoodButtons()}</div></section>

    <section class="hoa-dream-panel hoa-mood-history-card"><div class="hoa-dream-section-head"><div><h2>30-Day Mood Story</h2><p>Your check-ins build one day at a time.</p></div></div><div class="hoa-mood-chart-wrap"><canvas id="hoaMoodHistoryChart"></canvas></div></section>

    <section class="hoa-home-card hoa-reminders-card"><div class="hoa-home-card-head"><div><small>UPCOMING REMINDERS</small><h2>What’s coming up</h2></div><button class="hoa-mini-action" onclick="hoaOpenDashboardReminder()">+ Add</button></div><div class="hoa-reminder-list">${hoaReminderMarkup()}</div></section>

    <section class="hoa-home-card hoa-selfcare-card"><div class="hoa-home-card-head"><div><small>SELF-CARE CHECK</small><h2>A few things for you.</h2></div><button class="hoa-mini-action" onclick="hoaOpenSelfCareEditor()">Edit</button></div><div class="hoa-selfcare-list">${hoaSelfCareMarkup()}</div></section>

    <section class="hoa-home-card hoa-win-card"><div class="hoa-home-card-head"><div><small>LITTLE WIN OF THE DAY</small><h2>What went right?</h2></div>${hoaIcon('sparkle',20)}</div><input value="${esc(daily.win||'')}" oninput="hoaSaveDashboardDaily('win',this.value)" placeholder="Even a tiny win counts."></section>

    <section class="hoa-home-card hoa-brain-card"><div class="hoa-home-card-head"><div><small>BRAIN DUMP</small><h2>Leave the thought here.</h2></div>${hoaIcon('note',20)}</div><textarea oninput="saveChillNote(this.value)" placeholder="Anything taking up space in your head…">${esc(state.ui?.chillNote||'')}</textarea></section>

    <section class="hoa-dream-panel hoa-dream-explore">
      <div class="hoa-dream-section-head"><div><h2>Explore House of Achen</h2><p>Everything else has a home too.</p></div></div>
      <div class="hoa-dream-tile-strip">${hoaDreamTiles()}</div>
    </section>
  </div>`;

  requestAnimationFrame(()=>{
    try{hoaMoodLine(document.getElementById('hoaMoodHistoryChart'));}catch(e){console.warn('Mood history',e);}
    hoaApplyFinancePrivacy();
  });
}

renderDashboard=hoaDashboardV3;

hoaFinancePrivacyTargets=function(root){
  return [root?.querySelector('.hoa-home-account-private-body')].filter(Boolean);
};
hoaApplyFinancePrivacy=function(){
  if(currentView!=='dashboard')return;
  const root=document.querySelector('.hoa-dream-dashboard');
  if(!root)return;
  root.classList.toggle('hoa-finance-private',!hoaFinancePrivacyVisible);
  root.classList.toggle('hoa-finance-visible',hoaFinancePrivacyVisible);
  const eye=root.querySelector('#hoaAccountPrivacyEye');
  if(eye){
    eye.innerHTML=hoaPrivacyEyeSvg(hoaFinancePrivacyVisible);
    eye.setAttribute('aria-pressed',hoaFinancePrivacyVisible?'true':'false');
    eye.setAttribute('aria-label',hoaFinancePrivacyVisible?'Hide account balances':'Reveal account balances');
    eye.title=hoaFinancePrivacyVisible?'Hide balances':'Reveal balances';
  }
};
hoaToggleFinancePrivacy=function(force){
  hoaFinancePrivacyVisible=typeof force==='boolean'?force:!hoaFinancePrivacyVisible;
  hoaApplyFinancePrivacy();
};

const hoaDashboardV3BaseRenderAccounts=typeof renderAccounts==='function'?renderAccounts:null;
if(hoaDashboardV3BaseRenderAccounts){
  renderAccounts=function(){
    hoaDashboardV3BaseRenderAccounts();
    const host=document.getElementById('content');
    if(!host||host.querySelector('.hoa-financial-overview-extra'))return;
    const p=typeof selectedPaycheck==='function'?selectedPaycheck():null;
    const c=typeof calcPaycheck==='function'?calcPaycheck(p):{};
    const anchor=host.querySelector('.power-grid')||host.firstElementChild;
    const html=`<section class="hoa-financial-overview-extra">
      <div class="section-title"><div><h3>Financial overview</h3><p>The detailed money view lives here instead of crowding your Home dashboard.</p></div></div>
      <div class="hoa-dream-charts hoa-account-overview-charts">
        <div class="hoa-dream-chart-card"><div class="hoa-dream-card-head"><div><h2>Account Balance Mix</h2><p>Positive linked balances by account.</p></div>${hoaIcon('chart',20)}</div><div class="hoa-dream-chart-wrap"><canvas id="hoaAccountPieChartAccounts"></canvas></div></div>
        <div class="hoa-dream-chart-card"><div class="hoa-dream-card-head"><div><h2>Signed Account Balances</h2><p>Negative balances fall below zero.</p></div>${hoaIcon('bank',20)}</div><div class="hoa-dream-chart-wrap"><canvas id="hoaAccountBalanceBarAccounts"></canvas></div></div>
      </div>
      <div class="hoa-account-paycheck-summary">
        <div class="hoa-dream-section-head"><div><h2>Current Paycheck Snapshot</h2><p>House of Achen paycheck math, separate from raw bank balances.</p></div><button onclick="nav('payday')">Open planner</button></div>
        <div class="hoa-account-paycheck-kpis"><div><span>Available Cash</span><b>${money(c.available||0)}</b></div><div><span>Safe to Spend</span><b>${money(c.safe||0)}</b></div><div><span>Actual Cash Left</span><b>${money(c.actualCashLeft||0)}</b></div><div><span>Still Need to Fund</span><b>${money(c.stillNeed||0)}</b></div></div>
        <div class="hoa-account-formula">${hoaDashboardPaycheckBreakdown(p,c)}</div>
      </div>
    </section>`;
    anchor?.insertAdjacentHTML('afterend',html);
    requestAnimationFrame(()=>{
      try{pie(document.getElementById('hoaAccountPieChartAccounts'),hoaDashboardAccountPieItems());}catch(e){console.warn('Accounts pie',e);}
      try{hoaSignedAccountBars(document.getElementById('hoaAccountBalanceBarAccounts'));}catch(e){console.warn('Accounts bars',e);}
    });
  };
}

hoaFinancePrivacyVisible=false;
if(currentView==='dashboard')render();


// Dashboard pass 4: compact quick cards, automatic weather, calendar reminders, and organized Life Hub.
function hoaQuickCardPreview(type){
  const d=hoaDashboardDailyEntry();
  if(type==='focus')return (d.focus||'').trim()||'Set one thing';
  if(type==='win')return (d.win||'').trim()||'Capture a win';
  if(type==='selfcare'){
    const items=hoaSelfCareItems(),done=items.filter((_,i)=>d.selfCare?.[i]).length;
    return done+'/'+items.length+' checked';
  }
  const note=String(state.ui?.chillNote||'').trim();
  return note?note.slice(0,30)+(note.length>30?'…':''):'Drop a thought';
}
function hoaQuickDockMarkup(){
  return `<section class="hoa-dashboard-quick-dock" aria-label="Daily quick cards">
    <button onclick="hoaOpenQuickSheet('focus')"><span>${hoaIcon('goal',17)}</span><b>Little Focus</b><small>${esc(hoaQuickCardPreview('focus'))}</small></button>
    <button onclick="hoaOpenQuickSheet('win')"><span>${hoaIcon('sparkle',17)}</span><b>Today's Win</b><small>${esc(hoaQuickCardPreview('win'))}</small></button>
    <button onclick="hoaOpenQuickSheet('selfcare')"><span>${hoaIcon('life',17)}</span><b>Self Care</b><small>${esc(hoaQuickCardPreview('selfcare'))}</small></button>
    <button onclick="hoaOpenQuickSheet('brain')"><span>${hoaIcon('note',17)}</span><b>Brain Dump</b><small>${esc(hoaQuickCardPreview('brain'))}</small></button>
  </section>`;
}
function hoaEnsureQuickSheet(){
  let bg=document.getElementById('hoaHomeSheetBg');
  if(bg)return bg;
  bg=document.createElement('div');
  bg.id='hoaHomeSheetBg';
  bg.className='hoa-home-sheet-bg';
  bg.innerHTML='<section class="hoa-home-sheet" id="hoaHomeSheet" role="dialog" aria-modal="true"><div class="hoa-home-sheet-head"><div><small id="hoaHomeSheetEyebrow"></small><h2 id="hoaHomeSheetTitle"></h2></div><button onclick="hoaCloseQuickSheet()" aria-label="Close">×</button></div><div class="hoa-home-sheet-body" id="hoaHomeSheetBody"></div></section>';
  bg.addEventListener('click',e=>{if(e.target===bg)hoaCloseQuickSheet();});
  document.body.appendChild(bg);
  return bg;
}
function hoaRefreshQuickDock(){
  const root=document.querySelector('.hoa-dream-dashboard');
  const old=root?.querySelector('.hoa-dashboard-quick-dock');
  if(old)old.outerHTML=hoaQuickDockMarkup();
}
function hoaOpenQuickSheet(type){
  const bg=hoaEnsureQuickSheet(),body=bg.querySelector('#hoaHomeSheetBody'),title=bg.querySelector('#hoaHomeSheetTitle'),eyebrow=bg.querySelector('#hoaHomeSheetEyebrow'),d=hoaDashboardDailyEntry();
  if(type==='focus'){
    eyebrow.textContent="TODAY'S LITTLE FOCUS";title.textContent='One thing is enough.';
    body.innerHTML=`<textarea id="hoaSheetFocus" class="hoa-sheet-textarea" placeholder="What deserves your attention today?">${esc(d.focus||'')}</textarea><p>Keep it simple. This resets to a fresh entry each day.</p>`;
    body.querySelector('#hoaSheetFocus').addEventListener('input',e=>{hoaSaveDashboardDaily('focus',e.target.value);hoaRefreshQuickDock();});
  }else if(type==='win'){
    eyebrow.textContent="TODAY'S WIN";title.textContent='What went right?';
    body.innerHTML=`<textarea id="hoaSheetWin" class="hoa-sheet-textarea" placeholder="Even a tiny win counts.">${esc(d.win||'')}</textarea><p>Your daily wins stay saved by date.</p>`;
    body.querySelector('#hoaSheetWin').addEventListener('input',e=>{hoaSaveDashboardDaily('win',e.target.value);hoaRefreshQuickDock();});
  }else if(type==='selfcare'){
    eyebrow.textContent='SELF CARE CHECK';title.textContent='A few things for you.';
    body.innerHTML=`<div class="hoa-sheet-selfcare">${hoaSelfCareItems().map((item,i)=>`<button type="button" class="${d.selfCare?.[i]?'done':''}" onclick="hoaToggleSelfCareSheet(${i},this)"><span>${d.selfCare?.[i]?'✓':'○'}</span>${esc(item)}</button>`).join('')}</div><button class="hoa-sheet-edit" onclick="hoaCloseQuickSheet();hoaOpenSelfCareEditor()">Edit self-care list</button>`;
  }else{
    eyebrow.textContent='BRAIN DUMP';title.textContent='Leave the thought here.';
    body.innerHTML=`<textarea id="hoaSheetBrain" class="hoa-sheet-textarea hoa-sheet-brain" placeholder="Anything taking up space in your head…">${esc(state.ui?.chillNote||'')}</textarea><p>This stays here until you clear or replace it.</p>`;
    body.querySelector('#hoaSheetBrain').addEventListener('input',e=>{state.ui.chillNote=e.target.value;saveState(false);hoaRefreshQuickDock();});
  }
  bg.classList.add('open');
  document.body.classList.add('hoa-sheet-open');
  setTimeout(()=>body.querySelector('textarea')?.focus(),120);
}
function hoaToggleSelfCareSheet(i,btn){
  const d=hoaDashboardDailyEntry();
  d.selfCare[i]=!d.selfCare[i];saveState(false);
  btn.classList.toggle('done',!!d.selfCare[i]);
  btn.querySelector('span').textContent=d.selfCare[i]?'✓':'○';
  hoaRefreshQuickDock();
}
function hoaCloseQuickSheet(){
  document.getElementById('hoaHomeSheetBg')?.classList.remove('open');
  document.body.classList.remove('hoa-sheet-open');
}

const hoaDashboardV4Base=hoaDashboardV3;
function hoaDashboardV4(){
  hoaDashboardV4Base();
  const root=document.querySelector('.hoa-dream-dashboard');
  if(!root)return;
  ['.hoa-focus-card','.hoa-reminders-card','.hoa-selfcare-card','.hoa-win-card','.hoa-brain-card'].forEach(sel=>root.querySelector(sel)?.remove());
  const explore=root.querySelector('.hoa-dream-explore');
  if(explore&&!root.querySelector('.hoa-dashboard-quick-dock'))explore.insertAdjacentHTML('beforebegin',hoaQuickDockMarkup());
  const date=root.querySelector('.hoa-dream-date');
  if(date&&!date.querySelector('#hoaWeatherMount'))date.insertAdjacentHTML('beforeend','<div id="hoaWeatherMount" class="hoa-weather-mini" aria-live="polite"></div>');
  requestAnimationFrame(()=>{hoaRenderWeatherFromCache();hoaRefreshWeather();});
}
renderDashboard=hoaDashboardV4;
hoaDreamHasFocusedEditor=function(){
  if(currentView!=='dashboard')return false;
  const el=document.activeElement;
  if(!el)return false;
  if(el.closest?.('.hoa-home-sheet'))return /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  if(!el.closest?.('.hoa-dream-dashboard'))return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
};

function hoaWeatherIconSvg(code,isDay){
  const night=!isDay;
  const moon='<path d="M17.7 4.3a7.4 7.4 0 1 0 2 14.1A8.6 8.6 0 0 1 17.7 4.3Z" fill="currentColor"/>';
  const sun='<circle cx="9" cy="9" r="3.2" fill="currentColor"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M13.9 4.1l-1.4 1.4M5.5 12.5l-1.4 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
  const cloud='<path d="M6.5 17.5h10.2a3.3 3.3 0 0 0 .4-6.6A5.4 5.4 0 0 0 6.8 9.6a4 4 0 0 0-.3 7.9Z" fill="currentColor"/>';
  const rain=cloud+'<path d="M8 19.3l-1 2M12 19.3l-1 2M16 19.3l-1 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
  const snow='<path d="M12 4v16M5.1 8l13.8 8M18.9 8 5.1 16M9.7 5.4 12 7.2l2.3-1.8M9.7 18.6 12 16.8l2.3 1.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
  let body,label;
  if(code===0){body=night?moon:sun;label=night?'Clear night':'Sunny';}
  else if(code===1||code===2){body=(night?moon:sun)+cloud;label=code===1?'Mostly clear':'Partly cloudy';}
  else if(code===3||code===45||code===48){body=cloud+(night?moon:'');label=code===3?'Cloudy':'Cloudy / foggy';}
  else if((code>=51&&code<=67)||(code>=80&&code<=82)||(code>=95&&code<=99)){body=rain+(night?moon:'');label='Rainy';}
  else if((code>=71&&code<=77)||(code>=85&&code<=86)){body=snow+(night?moon:'');label='Snowy';}
  else{body=night?moon:cloud;label='Current weather';}
  return {svg:`<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`,label};
}
function hoaRenderWeather(data){
  const mount=document.getElementById('hoaWeatherMount');if(!mount||!data)return;
  const icon=hoaWeatherIconSvg(Number(data.code),Number(data.isDay)===1);
  const temp=Number.isFinite(Number(data.temp))?Math.round(Number(data.temp))+'°':'';
  mount.innerHTML=`${icon.svg}<span>${temp?temp+' · ':''}${esc(icon.label)}</span>`;
}
function hoaRenderWeatherFromCache(){
  try{const cached=JSON.parse(localStorage.getItem('hoa_weather_cache_v1')||'null');if(cached)hoaRenderWeather(cached);}catch{}
}
async function hoaRefreshWeather(force=false){
  if(window.hoaWeatherFetchInFlight)return;
  let cached=null;try{cached=JSON.parse(localStorage.getItem('hoa_weather_cache_v1')||'null');}catch{}
  if(!force&&cached?.at&&Date.now()-cached.at<20*60*1000){hoaRenderWeather(cached);return;}
  window.hoaWeatherFetchInFlight=true;
  try{
    const lat=Number(state.settings?.weatherLat)||33.0198,lon=Number(state.settings?.weatherLng)||-96.6989;
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=weather_code,is_day,temperature_2m&temperature_unit=fahrenheit&timezone=auto`;
    const res=await fetch(url,{cache:'no-store'});
    if(!res.ok)throw new Error('Weather unavailable');
    const json=await res.json(),cur=json.current||{};
    const data={code:Number(cur.weather_code),isDay:Number(cur.is_day),temp:Number(cur.temperature_2m),at:Date.now()};
    localStorage.setItem('hoa_weather_cache_v1',JSON.stringify(data));hoaRenderWeather(data);
  }catch(e){hoaRenderWeatherFromCache();}
  finally{window.hoaWeatherFetchInFlight=false;}
}
if(!window.hoaWeatherRefreshTimer)window.hoaWeatherRefreshTimer=setInterval(()=>hoaRefreshWeather(true),30*60*1000);

const hoaCalendarRemindersBase=typeof renderCalendar==='function'?renderCalendar:null;
if(hoaCalendarRemindersBase){
  renderCalendar=function(){
    hoaCalendarRemindersBase();
    const host=document.getElementById('content');if(!host||host.querySelector('.hoa-calendar-reminders'))return;
    const rows=hoaEnsureReminders().filter(r=>r&&!r.done&&r.date>=todayISO()).sort((a,b)=>((a.date||'')+(a.time||'')).localeCompare((b.date||'')+(b.time||''))).slice(0,10);
    host.insertAdjacentHTML('beforeend',`<section class="card hoa-calendar-reminders"><div class="section-title"><div><h3>Upcoming reminders</h3><p>Reminders live with your calendar instead of crowding Home.</p></div><button class="btn primary" onclick="hoaOpenDashboardReminder()">+ Add reminder</button></div>${rows.length?`<div class="hoa-calendar-reminder-list">${rows.map(r=>`<div class="hoa-reminder-row"><button class="hoa-reminder-check" onclick="hoaCompleteReminder('${r.id}')" aria-label="Mark reminder complete">○</button><div><b>${esc(r.title||'Reminder')}</b><span>${fmtDate(r.date)}${r.time?' · '+esc(r.time):''}</span></div></div>`).join('')}</div>`:'<div class="empty-state">No upcoming reminders yet.</div>'}</section>`);
  };
}

function hoaLifeHomeView(){
  const items=[
    ['packages','Package Tracker','Incoming orders and deliveries','package'],
    ['groceries','Grocery List','What the house actually needs','stockpile'],
    ['stockpile','Home Stockpile','On-hand quantities and buy-under prices','home'],
    ['beautyinv','Beauty Inventory','What you own, opened, low or repurchase','beauty'],
    ['journal','Journal','Longer thoughts and entries','note'],
    ['notes','Quick Notes','Fast lists, ideas and pins','note'],
    ['review','Diana Check-In','A calm review of what is still open','cat']
  ];
  return `<div class="section-title"><div><h3>Home & everyday life</h3><p>The useful rooms, grouped instead of scattered through the sidebar.</p></div></div><div class="hoa-life-home-grid">${items.map(([view,title,sub,icon])=>`<button onclick="nav('${view}')"><span>${hoaIcon(icon,21)}</span><div><b>${title}</b><small>${sub}</small></div></button>`).join('')}</div>`;
}
renderLife=function(){
  let tab=state.ui.lifeTab||'coupons';
  if(tab==='future'||tab==='stockpile')tab='home';
  if(!['coupons','wishlist','library','home'].includes(tab))tab='coupons';
  state.ui.lifeTab=tab;
  document.getElementById('content').innerHTML=`<div class="hero"><div><div class="eyebrow">LIFE & HOME</div><h2>Life Hub</h2><p>Shopping, beauty, home systems and personal lists — grouped into a few clear places.</p></div></div><div class="life-tabs hoa-life-tabs"><button class="btn ${tab==='coupons'?'active':''}" onclick="lifeTab('coupons')">Deals & Coupons</button><button class="btn ${tab==='wishlist'?'active':''}" onclick="lifeTab('wishlist')">Wishlist</button><button class="btn ${tab==='library'?'active':''}" onclick="lifeTab('library')">Beauty Library</button><button class="btn ${tab==='home'?'active':''}" onclick="lifeTab('home')">Home & Lists</button></div><div id="lifeContent"></div>`;
  renderLifeTab();
};
lifeTab=function(t){state.ui.lifeTab=t;saveState(false);renderLifeTab();};
renderLifeTab=function(){
  const h=document.getElementById('lifeContent');if(!h)return;
  const t=state.ui.lifeTab;
  if(t==='coupons')h.innerHTML=couponView();
  else if(t==='wishlist')h.innerHTML=wishlistView();
  else if(t==='library')h.innerHTML=libraryView();
  else h.innerHTML=hoaLifeHomeView();
};

function hoaOrganizeLowerNav(){
  const sidebar=document.getElementById('sidebar');if(!sidebar)return;
  sidebar.querySelectorAll('.hoa-nav-section-label,[data-hoa-lock-button]').forEach(x=>x.remove());
  const life=sidebar.querySelector('.nav-btn[data-view="life"]');if(!life)return;
  const parent=life.parentElement;
  const groups=[
    ['LIFE & HOME',['life','packages','groceries','stockpile','beautyinv']],
    ['NOTES & CHECK-IN',['journal','notes','review']],
    ['APP',['settings','backup']]
  ];
  const all=groups.flatMap(g=>g[1]).map(v=>sidebar.querySelector(`.nav-btn[data-view="${v}"]`)).filter(Boolean);
  all.forEach(btn=>{if(btn.parentElement===parent)btn.remove();});
  groups.forEach(([label,views])=>{
    const heading=document.createElement('div');heading.className='hoa-nav-section-label';heading.textContent=label;parent.appendChild(heading);
    views.forEach(v=>{const btn=sidebar.querySelector(`.nav-btn[data-view="${v}"]`)||all.find(b=>b.dataset.view===v);if(btn)parent.appendChild(btn);});
    if(label==='APP'){
      const lock=document.createElement('button');lock.className='nav-btn hoa-lock-nav';lock.dataset.hoaLockButton='1';lock.innerHTML=`<span class="nav-ico">${hoaIcon('settings',18)}</span><span class="nav-text">Lock / Log out</span>`;lock.onclick=()=>window.hoaExplicitLogout?.();parent.appendChild(lock);
    }
  });
}
const hoaDashboardV4RenderBase=render;
render=function(){
  const result=hoaDashboardV4RenderBase();
  hoaOrganizeLowerNav();
  return result;
};
hoaOrganizeLowerNav();
if(currentView==='dashboard')render();
