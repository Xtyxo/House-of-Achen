// House of Achen finance + premium UI layer.
// Keeps live bank reality separate from the editable paycheck planning ledger.
window.HOUSE_OF_ACHEN_FINANCE_DESK = true;

const HOA_MANUAL_INVESTMENTS = [
  {id:'acct_fidelity_go',name:'Fidelity Go',institution:'Fidelity',type:'Investments',balance:43.66},
  {id:'acct_fidelity_brokerage',name:'Fidelity Individual Brokerage',institution:'Fidelity',type:'Investments',balance:0},
  {id:'acct_climatize',name:'Climatize',institution:'Climatize',type:'Investments',balance:50.99}
];

const HOA_BORROW_MODEL_VERSION = 2;
function hoaEnsureBorrowModel(){
  if(!state.settings) state.settings={};
  if(Number(state.settings.hoaBorrowModelVersion||0)<HOA_BORROW_MODEL_VERSION){
    state.settings.chimeMyPayBorrowed=160;
    state.settings.chimeMyPayAvailable=0;
    state.settings.hoaBorrowModelVersion=HOA_BORROW_MODEL_VERSION;
  }
}
hoaEnsureBorrowModel();

const hoaFinanceBaseApplyNovaLiveData=typeof applyNovaLiveData==='function'?applyNovaLiveData:null;
if(hoaFinanceBaseApplyNovaLiveData){
  applyNovaLiveData=function(live){
    if(live?.accountRules){
      if(live.accountRules.chimeMyPayAvailable!=null)state.settings.chimeMyPayAvailable=Math.max(0,num(live.accountRules.chimeMyPayAvailable));
      if(live.accountRules.chimeMyPayBorrowed!=null)state.settings.chimeMyPayBorrowed=Math.max(0,num(live.accountRules.chimeMyPayBorrowed));
    }
    return hoaFinanceBaseApplyNovaLiveData(live);
  };
}

function hoaIcon(name,size=18){
  const paths={
    home:'<path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z"/>',
    wallet:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h15m0 3h3v4h-3a2 2 0 0 1 0-4Z"/>',
    planner:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 2v4m8-4v4M7 10h10M7 14h4m2 0h4M7 18h7"/>',
    receipt:'<path d="M5 3h14v18l-2.5-1.5L14 21l-2.5-1.5L9 21l-2.5-1.5L5 21Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    chart:'<path d="M4 20V10m6 10V4m6 16v-7m5 7H2"/>',
    delivery:'<path d="M3 7h12v10H3zM15 10h3l3 3v4h-6z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    bank:'<path d="M3 9 12 4l9 5M5 10v7m4-7v7m6-7v7m4-7v7M3 20h18"/>',
    goal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 7-7"/>',
    history:'<path d="M4 12a8 8 0 1 0 2.3-5.7L4 8"/><path d="M4 3v5h5M12 8v5l3 2"/>',
    insight:'<path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/>',
    life:'<path d="M12 21s-8-4.4-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.6-8 11-8 11Z"/>',
    cat:'<path d="M5 8 4 3l5 3a9 9 0 0 1 6 0l5-3-1 5a8 8 0 1 1-14 0Z"/><path d="M8.5 12h.01m6.99 0h.01M10 16c1.4 1 2.6 1 4 0"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    note:'<path d="M5 3h14v18H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    package:'<path d="m4 7 8-4 8 4-8 4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
    beauty:'<path d="M8 21h8M9 17h6V8H9zM10 8l1-5h2l1 5"/>',
    stockpile:'<path d="M4 6h16v14H4zM7 3h10v3M8 10h8M8 14h8"/>',
    refresh:'<path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.2 9A7 7 0 0 0 6.1 6.1L4 8m2 7a7 7 0 0 0 11.9 2.9L20 16"/>',
    invest:'<path d="M4 19h16M6 16l4-5 3 3 5-8"/><path d="m15 6 3-1 1 3"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    sparkle:'<path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6Z"/>',
    default:'<circle cx="12" cy="12" r="8"/><path d="M8 12h8"/>'
  };
  return `<svg class="hoa-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.default}</svg>`;
}

function hoaEnsureManualInvestments(){
  if(!Array.isArray(state.accounts)) state.accounts=[];
  HOA_MANUAL_INVESTMENTS.forEach(seed=>{
    let a=state.accounts.find(x=>x.id===seed.id);
    if(!a){state.accounts.push({id:seed.id,name:seed.name,institution:seed.institution,type:seed.type,rawBalance:seed.balance,currentBalance:seed.balance,connected:false,snapshot:false,manual:true});return;}
    a.manual=true;a.snapshot=false;a.connected=false;
    if(!Number.isFinite(Number(a.rawBalance)))a.rawBalance=seed.balance;
    if(!Number.isFinite(Number(a.currentBalance)))a.currentBalance=Number(a.rawBalance);
  });
}
function hoaSaveManualBalance(id,value){const a=state.accounts.find(x=>x.id===id);if(!a)return;const v=Number(value);if(!Number.isFinite(v))return;a.rawBalance=v;a.currentBalance=v;a.manual=true;a.snapshot=false;a.connected=false;saveState(false);render();toast('Manual investment balance updated');}
function hoaSnapshotAccounts(){return (state.accounts||[]).filter(a=>a.snapshot===true)}
function hoaManualInvestments(){return (state.accounts||[]).filter(a=>a.manual===true||HOA_MANUAL_INVESTMENTS.some(x=>x.id===a.id))}
function hoaRawLinkedCash(){return hoaSnapshotAccounts().reduce((s,a)=>s+rawBalanceFor(a),0)}
function hoaPlanningCash(){return hoaSnapshotAccounts().reduce((s,a)=>s+(typeof accountCapacity==='function'?accountCapacity(a).planning:rawBalanceFor(a)),0)}
function hoaManualInvestmentTotal(){return hoaManualInvestments().reduce((s,a)=>s+Math.max(0,rawBalanceFor(a)),0)}

const hoaFinanceBaseAccountCapacity=accountCapacity;
accountCapacity=function(a){
  if(a?.id!=='acct_chime_check')return hoaFinanceBaseAccountCapacity(a);
  const raw=rawBalanceFor(a);
  const limit=Math.max(0,num(state.settings.chimeSpotMeLimit||40));
  const used=Math.min(limit,Math.max(0,-raw));
  const remaining=Math.max(0,limit-used);
  const myPayAvailable=Math.max(0,num(state.settings.chimeMyPayAvailable||0));
  const myPayBorrowed=Math.max(0,num(state.settings.chimeMyPayBorrowed||0));
  const planning=raw<0&&raw>=-limit?0:raw;
  return{
    raw,
    planning,
    spendable:Math.max(0,raw)+remaining+myPayAvailable,
    bufferRemaining:remaining,
    myPay:myPayAvailable,
    myPayBorrowed,
    details:[
      `SpotMe limit ${money(limit)}`,
      `SpotMe used ${money(used)}`,
      `SpotMe remaining ${money(remaining)}`,
      `MyPay borrowed ${money(myPayBorrowed)}`,
      `MyPay available ${money(myPayAvailable)}`
    ]
  };
};
function hoaBorrowingSummary(){
  const chime=state.accounts.find(a=>a.id==='acct_chime_check');
  const ally=state.accounts.find(a=>a.id==='acct_ally_spend');
  const spotLimit=Math.max(0,num(state.settings.chimeSpotMeLimit||40));
  const spotUsed=Math.min(spotLimit,Math.max(0,-rawBalanceFor(chime)));
  const spotRemaining=Math.max(0,spotLimit-spotUsed);
  const allyLimit=Math.max(0,num(state.settings.allyFeeFreeOverdraftLimit||100));
  const allyUsed=Math.min(allyLimit,Math.max(0,-rawBalanceFor(ally)));
  const allyRemaining=Math.max(0,allyLimit-allyUsed);
  const myPayBorrowed=Math.max(0,num(state.settings.chimeMyPayBorrowed||0));
  const myPayAvailable=Math.max(0,num(state.settings.chimeMyPayAvailable||0));
  return{
    spotLimit,spotUsed,spotRemaining,
    allyLimit,allyUsed,allyRemaining,
    myPayBorrowed,myPayAvailable,
    borrowedNow:spotUsed+allyUsed+myPayBorrowed,
    availableBorrowing:spotRemaining+allyRemaining+myPayAvailable
  };
}
spendingPowerSummary=function(){
  const checkingIds=['acct_ally_spend','acct_current','acct_paypal','acct_chime_check','acct_capone_check','acct_varo_check'];
  const savingsIds=['acct_ally_save','acct_marcus','acct_chime_save','acct_capone_save','acct_varo_save'];
  const checking=checkingIds.map(id=>state.accounts.find(a=>a.id===id)).filter(Boolean);
  const savingsAccounts=savingsIds.map(id=>state.accounts.find(a=>a.id===id)).filter(Boolean);
  const raw=checking.reduce((sum,a)=>sum+rawBalanceFor(a),0);
  const spendable=checking.reduce((sum,a)=>sum+(typeof accountCapacity==='function'?accountCapacity(a).spendable:Math.max(0,rawBalanceFor(a))),0);
  const savings=savingsAccounts.reduce((sum,a)=>sum+Math.max(0,rawBalanceFor(a)),0);
  const borrow=hoaBorrowingSummary();
  const totalLinkedRaw=hoaSnapshotAccounts().reduce((sum,a)=>sum+rawBalanceFor(a),0);
  return{raw,spendable,savings,totalAccess:spendable+savings,totalLinkedRaw,...borrow};
};

editBufferRules=function(){
  openModal('Borrowing & buffer rules',`<div class="callout butter"><b>Borrowed</b> and <b>still available</b> are tracked separately. Borrowed MyPay is never added to spending power.</div><div class="form-grid" style="margin-top:14px"><div class="field"><label>Ally fee-free overdraft limit</label><input id="v7AllyBuffer" type="number" step="1" value="${num(state.settings.allyFeeFreeOverdraftLimit||100)}"></div><div class="field"><label>Chime SpotMe total limit</label><input id="v7Spot" type="number" step="1" value="${num(state.settings.chimeSpotMeLimit||40)}"></div><div class="field"><label>Chime MyPay already borrowed / owed</label><input id="v7MyPayBorrowed" type="number" step=".01" value="${num(state.settings.chimeMyPayBorrowed||0)}"></div><div class="field"><label>Chime MyPay still available</label><input id="v7MyPay" type="number" step=".01" value="${num(state.settings.chimeMyPayAvailable||0)}"></div></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveBufferRules()">Save</button>`);
};
saveBufferRules=function(){
  state.settings.allyFeeFreeOverdraftLimit=Math.max(0,num(document.getElementById('v7AllyBuffer').value));
  state.settings.chimeSpotMeLimit=Math.max(0,num(document.getElementById('v7Spot').value));
  state.settings.chimeMyPayBorrowed=Math.max(0,num(document.getElementById('v7MyPayBorrowed').value));
  state.settings.chimeMyPayAvailable=Math.max(0,num(document.getElementById('v7MyPay').value));
  state.settings.hoaBorrowModelVersion=HOA_BORROW_MODEL_VERSION;
  saveState();
  closeModal();
  render();
  toast('Borrowing figures updated');
};

const hoaFinanceBaseRenderAccounts=renderAccounts;
renderAccounts=function(){
  hoaFinanceBaseRenderAccounts();
  const summary=spendingPowerSummary();
  const grid=document.querySelector('#content .power-grid');
  if(grid){
    grid.innerHTML=`<div class="power-card"><span class="sub">All linked bank balances</span><b>${money(summary.totalLinkedRaw)}</b><div class="tinyline">Raw bank-reported balances only. No borrowing is added.</div></div><div class="power-card"><span class="sub">Borrowed now</span><b>${money(summary.borrowedNow)}</b><div class="tinyline">MyPay ${money(summary.myPayBorrowed)} + SpotMe used ${money(summary.spotUsed)} + Ally used ${money(summary.allyUsed)}.</div></div><div class="power-card accent"><span class="sub">Still available to borrow</span><b>${money(summary.availableBorrowing)}</b><div class="tinyline">Ally ${money(summary.allyRemaining)} + SpotMe ${money(summary.spotRemaining)} + MyPay ${money(summary.myPayAvailable)}.</div></div><div class="power-card"><span class="sub">Savings balances</span><b>${money(summary.savings)}</b><div class="tinyline">Raw connected savings balances.</div></div>`;
  }
  const note=document.querySelector('#content .capacity-note');
  if(note)note.innerHTML='<strong>Important:</strong> MyPay already borrowed is a debt, not available cash. SpotMe and Ally show used and remaining capacity separately.';
};

function hoaCategoryOptions(selected=''){
  const names=[];(state.settings?.categories||[]).forEach(c=>{if(c?.name&&!names.includes(c.name))names.push(c.name)});
  const p=selectedPaycheck?.();(p?.allocations||[]).forEach(a=>{if(a.name&&!names.includes(a.name))names.push(a.name)});(p?.quickSpend||[]).forEach(q=>{if(q.name&&!names.includes(q.name))names.push(q.name)});
  return `<option value="">Choose category / bucket</option>`+names.map(n=>`<option value="${esc(n)}" ${n===selected?'selected':''}>${esc(n)}</option>`).join('');
}
setBankCategory=function(id,val){const t=state.bankTransactions.find(x=>x.id===id);if(!t)return;t.paydeskCategory=val;saveState(false);render();};
addBankTxToLedger=function(id){
  const b=state.bankTransactions.find(x=>x.id===id);if(!b)return;if(!b.paydeskCategory)return toast('Choose a category / bucket first');
  if(b.addedToLedger||state.transactions.some(t=>t.sourceBankTxId===b.id)){b.addedToLedger=true;saveState(false);render();return toast('Already in the planner ledger');}
  const group=categoryGroup(b.paydeskCategory),amt=Math.abs(num(b.amount));
  state.transactions.push({id:uid('txn'),date:b.date,paycheckId:selectedPaycheck()?.id||'',status:'Done',group,category:b.paydeskCategory,name:b.merchant||b.name,plannedAmount:amt,paidAmount:amt,fromAccount:num(b.amount)>0?b.account:'',toAccount:num(b.amount)<0?b.account:'',priority:'P3 • Normal',notes:`Imported from recent bank activity snapshot. Provider label: ${b.providerCategory||''}`,countedElsewhere:group==='Transfer',sourceBankTxId:b.id});
  b.addedToLedger=true;saveState();render();toast('Added to Paycheck Planner ledger');
};
function hoaLatestPayroll(){return [...(state.bankTransactions||[])].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).find(t=>num(t.amount)<0&&(/income|payroll|paycheck|mci|tmone|mass markets/i.test([t.providerCategory,t.name,t.merchant].join(' '))));}
function hoaAccountCard(a){
  const raw=rawBalanceFor(a),cap=typeof accountCapacity==='function'?accountCapacity(a):{planning:raw};const manual=!!a.manual;const isAdjusted=!manual&&Math.abs(cap.planning-raw)>.001;
  return `<div class="hoa-account-card ${manual?'manual':'linked'}"><div class="hoa-account-card-head"><span class="hoa-account-icon">${hoaIcon(manual?'invest':'bank',17)}</span><div><b>${esc(a.name||a.institution||'Account')}</b><span>${esc(a.institution||'')}</span></div><span class="hoa-status-pill ${manual?'manual':'live'}">${manual?'Manual':'Linked'}</span></div>${manual?`<div class="hoa-manual-balance"><span>$</span><input aria-label="${esc(a.name)} balance" type="number" step="0.01" value="${Number(raw).toFixed(2)}" onchange="hoaSaveManualBalance('${a.id}',this.value)"></div>`:`<div class="hoa-balance">${money(raw)}</div>`}<div class="hoa-account-foot">${manual?'Edit this whenever the investment value changes.':`Bank snapshot${a.asOf?` · ${new Date(a.asOf).toLocaleDateString()}`:''}`}${isAdjusted?`<span>Planning balance ${money(cap.planning)}</span>`:''}</div></div>`;
}
function hoaTransactionRows(){
  const bt=[...(state.bankTransactions||[])].sort((a,b)=>(b.date||'').localeCompare(a.date||''));const ledger=state.transactions||[];if(!bt.length)return '<div class="empty-state">No bank activity has been published yet.</div>';
  return `<div class="table-wrap hoa-tx-wrap"><table class="table hoa-tx-table"><thead><tr><th>Date</th><th>Merchant / description</th><th>Account</th><th>Amount</th><th>Bank label</th><th>Category / bucket</th><th>Planner</th></tr></thead><tbody>${bt.map(t=>{const linked=t.addedToLedger||ledger.some(x=>x.sourceBankTxId===t.id);const outgoing=num(t.amount)>0;return `<tr class="${t.paydeskCategory?'is-reviewed':'needs-review'}"><td>${fmtDate(t.date)}</td><td><b>${esc(t.merchant||t.name||'Transaction')}</b><div class="ledger-source">${esc(t.name||'')}</div></td><td>${esc(t.account||'')}</td><td class="money ${outgoing?'outflow':'inflow'}">${outgoing?'-':'+'}${money(Math.abs(num(t.amount)))}</td><td><span class="mini-tag">${esc(t.providerCategory||'Unlabeled')}</span></td><td><select aria-label="Category for ${esc(t.merchant||t.name||'transaction')}" onchange="setBankCategory('${t.id}',this.value)">${hoaCategoryOptions(t.paydeskCategory||'')}</select></td><td><button class="btn tiny ${linked?'':'primary'}" ${linked?'disabled':''} onclick="addBankTxToLedger('${t.id}')">${linked?`${hoaIcon('check',13)} Added`:'Add to planner'}</button></td></tr>`;}).join('')}</tbody></table></div>`;
}
function renderPaydayLive(){
  hoaEnsureManualInvestments();const p=selectedPaycheck?.(),c=calcPaycheck?.(p)||{},payroll=hoaLatestPayroll();const review=(state.bankTransactions||[]).filter(t=>!t.paydeskCategory).length;const pub=state.liveUpdate?.publishedAt;const accounts=[...hoaSnapshotAccounts(),...hoaManualInvestments()];
  document.getElementById('content').innerHTML=`<section class="hoa-live-hero"><div class="hoa-live-copy"><div class="eyebrow">LIVE MONEY + A CALMER PLAN</div><h2>Payday Desk</h2><p>Your linked accounts show what is actually sitting in the banks. Your Paycheck Planner stays separate so you can decide what each paycheck is supposed to do.</p><div class="hoa-live-actions"><button class="btn primary" onclick="pullNovaUpdate()">${hoaIcon('refresh',16)} Refresh latest snapshot</button><button class="btn" onclick="requestNovaRefresh()">${hoaIcon('sparkle',16)} Ask Nova to sync banks</button><button class="btn" onclick="nav('payday')">${hoaIcon('planner',16)} Open Paycheck Planner</button></div><div class="hoa-freshness">${pub?`Published ${new Date(pub).toLocaleString()}`:'No Nova snapshot pulled yet'} · connected data can lag the bank slightly</div></div><div class="hoa-cat-duo"><div class="hoa-cat luna">${lunaSvg()}</div><div class="hoa-cat diana">${dianaSvg()}</div><div class="hoa-cat-caption">Luna watches the plan. Diana catches what still needs review.</div></div></section>
  <div class="grid kpis hoa-live-kpis"><div class="card kpi a-blue"><div class="kpi-label">Linked cash · raw</div><div class="kpi-value">${money(hoaRawLinkedCash())}</div><div class="kpi-note">All connected checking, payment and savings balances</div></div><div class="card kpi a-mint"><div class="kpi-label">Planning cash</div><div class="kpi-value">${money(hoaPlanningCash())}</div><div class="kpi-note">Uses your Chime / Ally planning treatment, without calling buffers income</div></div><div class="card kpi a-lilac"><div class="kpi-label">Manual investments</div><div class="kpi-value">${money(hoaManualInvestmentTotal())}</div><div class="kpi-note">Fidelity + Climatize · editable by you</div></div><div class="card kpi a-rose"><div class="kpi-label">Needs Diana review</div><div class="kpi-value">${review}</div><div class="kpi-note">Recent transactions missing your category / bucket</div></div></div>
  <div class="section-title"><div><h3>Account overview</h3><p>Linked accounts refresh from the published bank snapshot. Manual investments never get overwritten by a bank refresh.</p></div></div><div class="hoa-account-grid">${accounts.map(hoaAccountCard).join('')}</div>
  <div class="grid two hoa-paycheck-match"><div class="card hoa-estimate-card"><div class="hoa-card-title">${hoaIcon('planner',18)} Paycheck estimate</div><div class="hoa-estimate-grid"><div><span>Planner net pay</span><b>${money(p?.netPay||0)}</b></div><div><span>Safe to spend</span><b>${money(c.safe||0)}</b></div><div><span>Still to fund</span><b>${money(c.stillNeed||0)}</b></div><div><span>Pay period</span><b>${p?`${fmtDate(p.date)} – ${fmtDate(p.end)}`:'Not set'}</b></div></div><p>This is your editable plan, not a bank balance. Open the planner to change where the check should go.</p><button class="btn" onclick="nav('payday')">${hoaIcon('planner',15)} Edit paycheck plan</button></div><div class="card hoa-payroll-card"><div class="hoa-card-title">${hoaIcon('bank',18)} Latest payroll match</div>${payroll?`<div class="hoa-payroll-amount">${money(Math.abs(num(payroll.amount)))}</div><div class="sub">${esc(payroll.merchant||payroll.name)} · ${fmtDate(payroll.date)} · ${esc(payroll.account)}</div>${p?`<div class="hoa-variance">Compared with planner: ${money(Math.abs(num(payroll.amount))-num(p.netPay))} difference</div>`:''}`:`<div class="hoa-no-match">No payroll deposit is present in the latest 20 posted transactions. I will match it here automatically when it appears in a refreshed snapshot.</div>`}</div></div>
  <div class="hoa-diana-review card"><div class="hoa-diana-art">${dianaSvg()}</div><div><div class="eyebrow">DIANA'S MONEY CHECK</div><h3>${review?`${review} transaction${review===1?'':'s'} still need a home.`:'Everything in this snapshot has a category.'}</h3><p>Assigning a category tells House of Achen what the transaction was. Tap <b>Add to planner</b> only when you want that bank row to affect your paycheck ledger, so transfers and already-funded items do not get counted twice.</p></div></div>
  <div class="section-title"><div><h3>Last 20 posted bank transactions</h3><p>The account is locked to the real bank source. You control the House of Achen category / bucket and whether it belongs in the Paycheck Planner ledger.</p></div><button class="btn" onclick="pullNovaUpdate()">${hoaIcon('refresh',15)} Refresh snapshot</button></div>${hoaTransactionRows()}`;
}
function hoaDecorateNavigation(){
  const sidebar=document.getElementById('sidebar');if(!sidebar)return;const plannerBtn=sidebar.querySelector('.nav-btn[data-view="payday"]');let liveBtn=sidebar.querySelector('.nav-btn[data-view="payday-live"]');
  if(!liveBtn&&plannerBtn){liveBtn=document.createElement('button');liveBtn.className='nav-btn hoa-live-nav';liveBtn.dataset.view='payday-live';plannerBtn.parentNode.insertBefore(liveBtn,plannerBtn);}
  if(liveBtn){liveBtn.innerHTML=`<span class="nav-ico">${hoaIcon('wallet',18)}</span><span class="nav-text">Payday Desk</span>`;liveBtn.onclick=()=>nav('payday-live')}
  if(plannerBtn){plannerBtn.innerHTML=`<span class="nav-ico">${hoaIcon('planner',18)}</span><span class="nav-text">Paycheck Planner</span>`;plannerBtn.onclick=()=>nav('payday')}
  const icons={dashboard:'home',home:'wallet',transactions:'receipt',spending:'chart',delivery:'delivery',calendar:'calendar',accounts:'bank',goals:'goal',history:'history',insights:'insight',life:'life',review:'cat',settings:'settings',backup:'package',journal:'note',notes:'note',groceries:'stockpile',packages:'package',beautyinv:'beauty',stockpile:'stockpile'};
  sidebar.querySelectorAll('.nav-btn').forEach(btn=>{if(btn.dataset.view==='payday'||btn.dataset.view==='payday-live')return;const mount=btn.querySelector('.nav-ico');if(mount)mount.innerHTML=hoaIcon(icons[btn.dataset.view]||'default',18);btn.onclick=()=>nav(btn.dataset.view);});sidebar.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
}
function hoaStripEmoji(root){if(!root||!document.createTreeWalker)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{if(n.parentElement?.closest('script,style'))return;n.nodeValue=n.nodeValue.replace(/[\p{Extended_Pictographic}\uFE0F]/gu,'').replace(/ {2,}/g,' ')});}
function hoaPolishRenderedPage(){
  hoaDecorateNavigation();document.querySelector('.brand h1')?.replaceChildren(document.createTextNode('Life HQ'));
  if(currentView==='payday'){const title=document.getElementById('pageTitle');if(title)title.textContent='Paycheck Planner';const h2=document.querySelector('#content .hero h2');if(h2)h2.textContent='Paycheck Planner';const eyebrow=document.querySelector('#content .hero .eyebrow');if(eyebrow)eyebrow.textContent='PLAN THE JOB OF EVERY PAYCHECK';const actions=document.querySelector('#content .hero .hero-actions');if(actions&&!actions.querySelector('[data-hoa-live-link]'))actions.insertAdjacentHTML('afterbegin',`<button class="btn" data-hoa-live-link onclick="nav('payday-live')">${hoaIcon('wallet',15)} Payday Desk</button>`);}
  hoaStripEmoji(document.getElementById('app')||document.body);
}
refreshPrompt=function(){return `Refresh my House of Achen Payday Desk. Resync every financial account currently linked to my ChatGPT Finances connection, including Ally, Chime, Current, Marcus, PayPal, Capital One, Varo, and any new linked account. Publish accurate raw balances and the 20 most recent POSTED bank transactions to the existing House of Achen live snapshot. Keep my Chime SpotMe planning rule and Ally temporary-cushion treatment separate from raw balances; do not count overdraft, SpotMe, advances, or credit as income or savings. Fidelity Go, Fidelity Individual Brokerage, and Climatize are manual investment accounts inside House of Achen and must never be overwritten by the connected-bank refresh. Preserve every category assignment, Add-to-Planner decision, paycheck plan, journal, list, package, beauty inventory, and other local House of Achen data. Update the existing GitHub/Netlify House of Achen app, not a new copy.`};
requestNovaRefresh=async function(){const txt=refreshPrompt();try{await navigator.clipboard.writeText(txt)}catch(e){}window.open('https://chatgpt.com/','_blank');toast('Nova sync request copied. Send it in ChatGPT, then return and tap Refresh latest snapshot.');};
openChatGPTBankRefresh=requestNovaRefresh;
LUNA_TIPS['payday-live']='This is the reality page: live account snapshots at the top, your category review below, and your separate Paycheck Planner one tap away.';
LUNA_TIPS.payday='This is your planning ledger. Give each paycheck jobs here, then use the Payday Desk to reconcile those plans with the real bank activity.';
hoaEnsureManualInvestments();saveState(false);
const hoaFinanceBaseRender=render;
render=function(){hoaEnsureManualInvestments();if(currentView==='payday-live'){document.getElementById('pageTitle').textContent='Payday Desk';renderPaydayLive();hoaPolishRenderedPage();return;}const out=hoaFinanceBaseRender();hoaPolishRenderedPage();return out;};
hoaDecorateNavigation();render();


// Stabilization pass 1: spending-only bank view + editable Quick Spend actuals.
function hoaBankSpendText(t){return [t?.name,t?.merchant,t?.providerCategory,t?.account].filter(Boolean).join(' ').toLowerCase();}
function hoaLooksLikePersonTransfer(t){
  const text=hoaBankSpendText(t);
  return /\b(payment to|sent to|paid to|zelle|venmo|cash ?app|cashapp)\b/.test(text);
}
function hoaLooksLikeOwnAccountTransfer(t){
  const text=hoaBankSpendText(t);
  return /round up|chime transfer|transfer (from|to) chime|savings transfer|account transfer|money transfer to ally|transfer to ally bank|capital one.*transfer|marcus.*transfer|varo.*transfer|current.*transfer/.test(text);
}
function hoaIsEconomicSpendBankTx(t){
  if(num(t?.amount)<=0)return false;
  const category=String(t?.providerCategory||'').toLowerCase();
  const text=hoaBankSpendText(t);
  if(/round up/.test(text))return false;
  if(/transfer/.test(category)||/\btransfer\b/.test(text)){
    if(hoaLooksLikeOwnAccountTransfer(t))return false;
    return hoaLooksLikePersonTransfer(t);
  }
  return true;
}
function hoaSpendingBankRows(){
  return [...(state.bankTransactions||[])].filter(hoaIsEconomicSpendBankTx).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
}
renderSpending=function(){
  const bt=hoaSpendingBankRows();
  const ledger=[...(state.transactions||[])].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const added=bt.filter(t=>t.addedToLedger||ledger.some(x=>x.sourceBankTxId===t.id)).length;
  const uncategorized=bt.filter(t=>!t.paydeskCategory).length;
  const spent=bt.reduce((sum,t)=>sum+Math.abs(num(t.amount)),0);
  document.getElementById('content').innerHTML=`<div class="hero"><div><div class="eyebrow">ACTUAL SPENDING ONLY</div><h2>Overall Spending</h2><p>Purchases and money sent to other people show here. Transfers between your own accounts, savings moves and round-ups stay out of this page.</p></div><div class="hero-actions"><button class="btn" onclick="openChatGPTBankRefresh()">Update banking info with ChatGPT</button><button class="btn primary" onclick="openTransactionModal()">+ Manual transaction</button></div></div>
  <div class="grid kpis"><div class="card kpi a-peach"><div class="kpi-label">Recent spending shown</div><div class="kpi-value">${money(spent)}</div><div class="bank-kpi-note">Own-account transfers and round-ups excluded.</div></div><div class="card kpi a-blue"><div class="kpi-label">Spending rows</div><div class="kpi-value">${bt.length}</div></div><div class="card kpi a-lilac"><div class="kpi-label">Needs a category</div><div class="kpi-value">${uncategorized}</div></div><div class="card kpi a-mint"><div class="kpi-label">Added to HOA ledger</div><div class="kpi-value">${added}</div></div></div>
  <div class="callout info-only" style="margin-top:16px"><b>Filtered on purpose:</b> House of Achen keeps the full bank snapshot for reconciliation, but this page only shows economic spending. Internal transfers such as Chime Checking ↔ Chime Savings, transfers to your own Ally account, and round-ups are hidden here.</div>
  <div class="section-title"><div><h3>Recent purchases & person-to-person outflows</h3><p>Choose your Paycheck Desk category, then add a row to the ledger only when you want it counted there.</p></div></div>
  ${bt.length?`<div class="table-wrap bank-activity-table"><table class="table" style="min-width:1040px"><thead><tr><th>Date</th><th>Account</th><th>Merchant / person</th><th>Spent</th><th>Bank label</th><th>Your category</th><th>Actions</th></tr></thead><tbody>${bt.map(t=>{const linked=t.addedToLedger||ledger.some(x=>x.sourceBankTxId===t.id);return `<tr><td>${fmtDate(t.date)}</td><td>${esc(t.account)}</td><td><b>${esc(t.merchant||t.name)}</b><div class="ledger-source">${esc(t.name||'')}</div></td><td class="money outflow">-${money(Math.abs(num(t.amount)))}</td><td><span class="mini-tag">${esc(t.providerCategory||'')}</span></td><td><select onchange="setBankCategory('${t.id}',this.value)">${paydeskCategoryOptions(t.paydeskCategory||'')}</select></td><td><div class="activity-actions"><button class="btn tiny ${linked?'':'primary'}" ${linked?'disabled':''} onclick="addBankTxToLedger('${t.id}')">${linked?'Added ✓':'Add to ledger'}</button>${isDeliveryBankTx(t)?`<button class="btn tiny" onclick="logDeliveryFromBank('${t.id}')">Log delivery</button>`:''}</div></td></tr>`;}).join('')}</tbody></table></div>`:'<div class="empty-state">No qualifying spending is in the latest bank snapshot.</div>'}
  <div class="section-title"><div><h3>House of Achen ledger</h3><p>Your manual and imported ledger entries. Transfers marked as transfers remain available here for reconciliation but do not become spending just because they moved money.</p></div></div>
  ${ledger.length?`<div class="table-wrap"><table class="table" style="min-width:850px"><thead><tr><th>Date</th><th>Name</th><th>Category</th><th>Group</th><th>Amount</th><th>Source</th><th></th></tr></thead><tbody>${ledger.map(t=>`<tr><td>${fmtDate(t.date)}</td><td><b>${esc(t.name||t.category)}</b></td><td>${esc(t.category||'')}</td><td>${groupChip(t.group)}</td><td class="money">${money(t.paidAmount||t.plannedAmount)}</td><td>${t.sourceBankTxId?'<span class="mini-tag">Bank snapshot</span>':'Manual/app'}</td><td><button class="btn tiny" onclick="openTransactionModal('${t.id}')">Edit</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state">No House of Achen ledger transactions yet.</div>'}`;
};

function hoaQuickLedgerSpent(p,name){
  return paycheckTransactions(p).filter(t=>t.status==='Done'&&t.group==='Expenses'&&t.category===name).reduce((sum,t)=>sum+Math.abs(num(t.paidAmount||t.plannedAmount)),0);
}
function hoaQuickEffectiveSpent(p,q){
  const ledger=hoaQuickLedgerSpent(p,q.name);
  return q.spentManual===null||q.spentManual===undefined||q.spentManual===''?ledger:Math.max(0,num(q.spentManual));
}
quickSpendActual=function(p,name){
  const q=(p?.quickSpend||[]).find(x=>x.name===name);
  return q?hoaQuickEffectiveSpent(p,q):hoaQuickLedgerSpent(p,name);
};
openQuickModal=function(i=null){
  const p=selectedPaycheck();
  const q=i===null?{name:'',cap:0,priority:'Planned',spentManual:null}:p.quickSpend[i];
  const spentValue=q.spentManual===null||q.spentManual===undefined?'':q.spentManual;
  openModal(i===null?'Add quick-spend bucket':'Edit quick-spend bucket',`<div class="form-grid"><div class="field span2"><label>Bucket</label><input id="qName" value="${esc(q.name||'')}"></div><div class="field"><label>Planned cap</label><input id="qCap" type="number" step=".01" value="${num(q.cap)}"></div><div class="field"><label>Priority</label><select id="qPri">${['Essential','Planned','Fun','Flex'].map(x=>`<option ${x===q.priority?'selected':''}>${x}</option>`).join('')}</select></div><div class="field span2"><label>Spent so far</label><input id="qSpent" type="number" min="0" step=".01" value="${spentValue}" placeholder="Leave blank to calculate from completed ledger transactions"><div class="sub" style="margin-top:5px">Enter a total here when you want to track the bucket directly. Leave it blank to use completed ledger transactions in this category.</div></div></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveQuick(${i===null?'null':i})">Save</button>`);
};
saveQuick=function(i){
  const p=selectedPaycheck();
  const prior=i===null?{}:(p.quickSpend[i]||{});
  const rawSpent=document.getElementById('qSpent').value.trim();
  const q={...prior,name:document.getElementById('qName').value.trim(),cap:Math.max(0,num(document.getElementById('qCap').value)),priority:document.getElementById('qPri').value,spentManual:rawSpent===''?null:Math.max(0,num(rawSpent))};
  if(!q.name)return toast('Add a bucket name');
  if(i===null)p.quickSpend.push(q);else p.quickSpend[i]=q;
  markPayEdited(p);saveState();closeModal();renderPayday();
};
quickTable=function(p){
  if(!p||!(p.quickSpend||[]).length)return '<div class="empty-state">No quick-spend buckets yet.</div>';
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Bucket</th><th>Planned cap</th><th>Priority</th><th>Spent</th><th>Source</th><th>Remaining</th><th></th></tr></thead><tbody>${p.quickSpend.map((q,i)=>{const ledger=hoaQuickLedgerSpent(p,q.name),manual=!(q.spentManual===null||q.spentManual===undefined||q.spentManual===''),spent=hoaQuickEffectiveSpent(p,q);return `<tr><td><b>${esc(q.name)}</b></td><td class="money">${money(q.cap)}</td><td>${esc(q.priority||'')}</td><td class="money">${money(spent)}</td><td><span class="mini-tag">${manual?'Manual total':`Ledger · ${money(ledger)}`}</span></td><td class="money">${money(Math.max(0,num(q.cap)-spent))}</td><td><button class="btn tiny" onclick="openQuickModal(${i})">Edit</button> <button class="btn tiny danger" onclick="deleteQuick(${i})">×</button></td></tr>`;}).join('')}</tbody></table></div>`;
};

const hoaCoreBaseCalcPaycheck=calcPaycheck;
calcPaycheck=function(p){
  const base=hoaCoreBaseCalcPaycheck(p);
  if(!p||p.importedSnapshot&&!p.edited)return base;
  const tx=paycheckTransactions(p);
  let logged=tx.filter(t=>t.status==='Done'&&t.group!=='Income'&&t.countedElsewhere!==true).reduce((sum,t)=>sum+Math.abs(num(t.paidAmount||t.plannedAmount)),0);
  (p.quickSpend||[]).forEach(q=>{
    if(q.spentManual===null||q.spentManual===undefined||q.spentManual==='')return;
    const ledger=hoaQuickLedgerSpent(p,q.name);
    logged+=Math.max(0,num(q.spentManual))-ledger;
  });
  const moved=(p.allocations||[]).reduce((sum,a)=>sum+num(a.moved),0);
  const allocationRemaining=(p.allocations||[]).reduce((sum,a)=>sum+Math.max(0,num(a.planned)-num(a.moved)),0);
  const quickRemaining=(p.quickSpend||[]).reduce((sum,q)=>sum+Math.max(0,num(q.cap)-hoaQuickEffectiveSpent(p,q)),0);
  const available=num(p.netPay)+num(p.startingChecking)+num(p.otherIncome);
  const actualCashLeft=available-moved-logged;
  const stillNeed=allocationRemaining+num(p.billsDue)+quickRemaining;
  const safe=Math.max(0,actualCashLeft-stillNeed-num(p.cushion));
  return {...base,available,moved,logged,actualCashLeft,stillNeed,safe,quickRemaining,allocationRemaining};
};


// Dashboard pass 2: persistent Ignore choice for bank rows.
paydeskCategoryOptions=function(selected=''){
  const names=[];
  (state.settings.categories||[]).forEach(c=>{if(c?.name&&!names.includes(c.name))names.push(c.name)});
  const p=selectedPaycheck();
  (p?.allocations||[]).forEach(a=>{if(a.name&&!names.includes(a.name))names.push(a.name)});
  (p?.quickSpend||[]).forEach(q=>{if(q.name&&!names.includes(q.name))names.push(q.name)});
  return `<option value="">— choose Paycheck Desk category —</option><option value="__IGNORE__" ${selected==='__IGNORE__'?'selected':''}>Ignore — do not import</option>`+
    names.map(n=>`<option value="${esc(n)}" ${n===selected?'selected':''}>${esc(n)}</option>`).join('');
};
const hoaPass2BaseSetBankCategory=setBankCategory;
setBankCategory=function(id,val){
  const t=state.bankTransactions.find(x=>x.id===id);
  if(!t)return;
  t.paydeskCategory=val;
  saveState(false);
  if(val==='__IGNORE__')toast('Ignored — this bank row will stay out of Overall Spending on future refreshes.');
  renderSpending();
};
const hoaPass2BaseSpendingRows=hoaSpendingBankRows;
hoaSpendingBankRows=function(){
  return hoaPass2BaseSpendingRows().filter(t=>t.paydeskCategory!=='__IGNORE__');
};
const hoaPass2BaseAddBankTx=addBankTxToLedger;
addBankTxToLedger=function(id){
  const t=state.bankTransactions.find(x=>x.id===id);
  if(t?.paydeskCategory==='__IGNORE__')return toast('This bank row is marked Ignore.');
  return hoaPass2BaseAddBankTx(id);
};
