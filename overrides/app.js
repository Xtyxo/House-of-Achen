// House of Achen Git-managed behavior overrides.
// Companion redesign + plain-language financial labels.
window.HOUSE_OF_ACHEN_GIT_OVERRIDES = true;

const HOA_PURPLE = '#B792C8';
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', HOA_PURPLE);

// Cute 90s-anime-inspired companions based on Christy's Luna/Diana reference:
// Luna = black, green eyes, gold crescent. Diana = gray tabby, green eyes, pearl + pink heart.
lunaSvg = function(){return `<svg class="cat-svg hoa-luna" viewBox="0 0 120 120" role="img" aria-label="Luna, cute black cat with green eyes and a crescent">
  <path d="M43 83C20 105 9 87 18 75c6-8 18-7 26-3" fill="none" stroke="#171820" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="60" cy="84" rx="28" ry="29" fill="#191a22"/>
  <ellipse cx="47" cy="105" rx="12" ry="7" fill="#171820"/><ellipse cx="73" cy="105" rx="12" ry="7" fill="#171820"/>
  <path d="M35 43 27 18 48 29Q60 24 72 29L94 18 86 43Q92 51 90 63Q88 80 60 82Q32 80 30 63Q28 51 35 43Z" fill="#191a22" stroke="#0f1016" stroke-width="2"/>
  <path d="M34 37 30 24 44 32M86 37 90 24 76 32" fill="#df9ea9"/>
  <ellipse cx="46" cy="55" rx="11" ry="14" fill="#eef7e8"/><ellipse cx="74" cy="55" rx="11" ry="14" fill="#eef7e8"/>
  <ellipse cx="47" cy="57" rx="6.5" ry="10" fill="#8fc36e"/><ellipse cx="73" cy="57" rx="6.5" ry="10" fill="#8fc36e"/>
  <ellipse cx="48" cy="58" rx="2.4" ry="7" fill="#243126"/><ellipse cx="72" cy="58" rx="2.4" ry="7" fill="#243126"/>
  <circle cx="43" cy="50" r="3.2" fill="#fff"/><circle cx="69" cy="50" r="3.2" fill="#fff"/><circle cx="51" cy="61" r="1.5" fill="#fff"/><circle cx="77" cy="61" r="1.5" fill="#fff"/>
  <path d="M55 68Q60 72 65 68Q60 76 55 68Z" fill="#df9aa8"/><path d="M60 73Q55 78 51 74M60 73Q65 78 69 74" fill="none" stroke="#a17b8a" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M39 69 18 65M39 74 16 78M81 69 102 65M81 74 104 78" stroke="#77717d" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M60 36a8 8 0 1 1 6-13 9 9 0 1 0-6 13Z" fill="#e0c967"/>
  <ellipse cx="45" cy="70" rx="7" ry="2.5" fill="#d78aa1" opacity=".2"/><ellipse cx="75" cy="70" rx="7" ry="2.5" fill="#d78aa1" opacity=".2"/>
</svg>`};

dianaSvg = function(){return `<svg class="cat-svg hoa-diana" viewBox="0 0 120 120" role="img" aria-label="Diana, cute gray tabby with green eyes and a pearl heart necklace">
  <ellipse cx="62" cy="85" rx="31" ry="30" fill="#a9a6aa" stroke="#716e74" stroke-width="1.5"/>
  <path d="M91 86q21 5 14 18-7 12-31 5" fill="none" stroke="#8c898f" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="48" cy="105" rx="12" ry="7" fill="#b9b6ba"/><ellipse cx="72" cy="105" rx="12" ry="7" fill="#b9b6ba"/>
  <path d="M35 43 27 20 48 30Q60 25 72 30L94 20 86 43Q92 51 90 63Q88 80 60 82Q32 80 30 63Q28 51 35 43Z" fill="#aaa7ac" stroke="#716e74" stroke-width="1.8"/>
  <path d="M34 37 30 25 44 33M86 37 90 25 76 33" fill="#dfa7af"/>
  <path d="M43 33 49 43M60 29 60 43M77 33 71 43" stroke="#6e6b72" stroke-width="4" stroke-linecap="round"/>
  <path d="M35 49 29 47M85 49 91 47M37 72 31 75M83 72 89 75" stroke="#747078" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M43 82q17 12 34 0v20H43Z" fill="#efefef" opacity=".85"/>
  <ellipse cx="46" cy="55" rx="11" ry="14" fill="#eef7e8"/><ellipse cx="74" cy="55" rx="11" ry="14" fill="#eef7e8"/>
  <ellipse cx="47" cy="57" rx="6.5" ry="10" fill="#8fc36e"/><ellipse cx="73" cy="57" rx="6.5" ry="10" fill="#8fc36e"/>
  <ellipse cx="48" cy="58" rx="2.4" ry="7" fill="#2e3930"/><ellipse cx="72" cy="58" rx="2.4" ry="7" fill="#2e3930"/>
  <circle cx="43" cy="50" r="3.2" fill="#fff"/><circle cx="69" cy="50" r="3.2" fill="#fff"/>
  <path d="M55 68Q60 72 65 68Q60 76 55 68Z" fill="#dd9aa5"/><path d="M60 73Q55 78 51 74M60 73Q65 78 69 74" fill="none" stroke="#887b83" stroke-width="1.5" stroke-linecap="round"/>
  <g fill="#fff" stroke="#c8bcc9" stroke-width=".7"><circle cx="41" cy="83" r="3"/><circle cx="47" cy="86" r="3"/><circle cx="53" cy="88" r="3"/><circle cx="60" cy="89" r="3"/><circle cx="67" cy="88" r="3"/><circle cx="73" cy="86" r="3"/><circle cx="79" cy="83" r="3"/></g>
  <path d="M60 90c-5-7-13-2-9 5l9 10 9-10c4-7-4-12-9-5Z" fill="#e68daf" stroke="#b85f82" stroke-width="1"/><path d="M56 93l3 3 6-6" fill="none" stroke="#fff" stroke-width="1.3" opacity=".7"/>
</svg>`};

function lunaYarnScene(){return `<svg viewBox="0 0 150 90" aria-hidden="true">
  <ellipse cx="45" cy="60" rx="25" ry="21" fill="#191a22"/><circle cx="45" cy="39" r="22" fill="#191a22"/>
  <path d="M28 31 24 12 39 23M62 31 67 12 52 23" fill="#191a22"/><path d="M29 27 26 17 36 24M61 27 65 17 54 24" fill="#df9ea9"/>
  <ellipse cx="37" cy="39" rx="7" ry="9" fill="#8fc36e"/><ellipse cx="53" cy="39" rx="7" ry="9" fill="#8fc36e"/><circle cx="35" cy="36" r="2" fill="#fff"/><circle cx="51" cy="36" r="2" fill="#fff"/>
  <path d="M45 26a5 5 0 1 1 4-8 6 6 0 1 0-4 8Z" fill="#e0c967"/>
  <path d="M65 62c10-9 18-2 21 6" fill="none" stroke="#191a22" stroke-width="5" stroke-linecap="round"/>
  <circle cx="113" cy="64" r="16" fill="#b792c8"/><path d="M101 57q12 14 25 0M100 68q13-12 27 1M111 49q-5 14 5 30" fill="none" stroke="#d9c7e5" stroke-width="2"/><path d="M97 66q-18 1-20 11" fill="none" stroke="#8e6c9e" stroke-width="2"/>
  <path d="M38 48q7 6 14 0" fill="none" stroke="#d795a4" stroke-width="1.5" stroke-linecap="round"/>
</svg>`}

function sleepingTogetherScene(){return `<svg viewBox="0 0 170 90" aria-hidden="true">
  <ellipse cx="59" cy="60" rx="43" ry="22" fill="#191a22"/><circle cx="77" cy="48" r="20" fill="#191a22"/><path d="M62 41 59 25 71 35M91 41 94 25 83 35" fill="#191a22"/><path d="M68 49q5 4 10 0M82 49q5 4 10 0" fill="none" stroke="#8fc36e" stroke-width="1.6" stroke-linecap="round"/><path d="M77 37a5 5 0 1 1 4-8 6 6 0 1 0-4 8Z" fill="#e0c967"/>
  <ellipse cx="119" cy="60" rx="38" ry="22" fill="#aaa7ac"/><circle cx="109" cy="48" r="20" fill="#aaa7ac"/><path d="M94 41 91 25 103 35M123 41 126 25 115 35" fill="#aaa7ac"/><path d="M96 32 101 39M109 29 109 39M122 32 117 39" stroke="#747078" stroke-width="3" stroke-linecap="round"/>
  <path d="M99 49q5 4 10 0M113 49q5 4 10 0" fill="none" stroke="#72876d" stroke-width="1.6" stroke-linecap="round"/>
  <g fill="#fff" stroke="#c8bcc9" stroke-width=".6"><circle cx="99" cy="66" r="2.5"/><circle cx="105" cy="68" r="2.5"/><circle cx="111" cy="69" r="2.5"/><circle cx="117" cy="68" r="2.5"/></g><path d="M110 70c-4-5-9-1-6 4l6 6 6-6c3-5-2-9-6-4Z" fill="#e68daf"/>
  <path d="M78 61q8 6 15 0" fill="none" stroke="#d795a4" stroke-width="1.5" stroke-linecap="round"/>
</svg>`}

function dianaHeartScene(){return `<svg viewBox="0 0 150 90" aria-hidden="true">
  <ellipse cx="68" cy="61" rx="28" ry="22" fill="#aaa7ac"/><circle cx="68" cy="39" r="22" fill="#aaa7ac"/><path d="M51 31 48 13 61 24M85 31 89 13 76 24" fill="#aaa7ac"/><path d="M55 24 60 32M68 19 68 32M82 24 77 32" stroke="#747078" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="60" cy="40" rx="7" ry="9" fill="#8fc36e"/><ellipse cx="76" cy="40" rx="7" ry="9" fill="#8fc36e"/><circle cx="58" cy="37" r="2" fill="#fff"/><circle cx="74" cy="37" r="2" fill="#fff"/>
  <g fill="#fff" stroke="#c8bcc9" stroke-width=".6"><circle cx="55" cy="57" r="2.7"/><circle cx="61" cy="59" r="2.7"/><circle cx="68" cy="60" r="2.7"/><circle cx="75" cy="59" r="2.7"/><circle cx="81" cy="57" r="2.7"/></g><path d="M68 61c-4-6-11-1-7 5l7 8 7-8c4-6-3-11-7-5Z" fill="#e68daf"/>
  <path d="M92 57q10-8 18 1" fill="none" stroke="#aaa7ac" stroke-width="7" stroke-linecap="round"/>
  <path d="M118 29c-6-9-19-2-13 8l13 14 13-14c6-10-7-17-13-8Z" fill="#e99ab7" opacity=".9"/><path d="M118 18v-7M103 22l-5-5M133 22l5-5" stroke="#b792c8" stroke-width="2" stroke-linecap="round"/>
</svg>`}

const companionScenes = [
  {title:'Luna says…', art:lunaYarnScene},
  {title:'Luna & Diana say…', art:sleepingTogetherScene},
  {title:'Diana dropped by…', art:dianaHeartScene}
];
let companionSceneIndex = 0;
function decorateLunaBubble(){
  const bubble = document.getElementById('lunaBubble');
  if(!bubble) return;
  let mount = bubble.querySelector('.companion-scene');
  if(!mount){
    mount = document.createElement('div');
    mount.className = 'companion-scene';
    const title = bubble.querySelector('b');
    bubble.insertBefore(mount,title);
  }
  const scene = companionScenes[companionSceneIndex++ % companionScenes.length];
  mount.innerHTML = scene.art();
  const title = bubble.querySelector('b');
  if(title) title.textContent = scene.title;
}

maybeShowLuna = function(v){
  if(!state.settings.lunaTips)return;
  clearTimeout(lunaTimer);
  lunaTimer=setTimeout(()=>{
    const text=document.getElementById('lunaText');
    const bubble=document.getElementById('lunaBubble');
    if(!text||!bubble)return;
    text.textContent=LUNA_TIPS[v]||LUNA_TIPS.home;
    decorateLunaBubble();
    bubble.classList.add('open');
  },700);
};

toggleLuna = function(){
  const bubble=document.getElementById('lunaBubble');
  if(!bubble)return;
  if(bubble.classList.contains('open')){closeLuna();return;}
  document.getElementById('lunaText').textContent=LUNA_TIPS[currentView]||LUNA_TIPS.home;
  decorateLunaBubble();
  bubble.classList.add('open');
};

function applyMoneyLanguage(){
  const kpiMap={
    'Current net pay':['💰 MONEY IN','money-pay','Your current paycheck amount'],
    'Net pay':['💰 PAYCHECK','money-pay','What this paycheck brought in'],
    'Safe to spend':['💗 FREE TO USE','money-free','Safe to Spend · after your plan + cushion'],
    'Actual cash left':['💵 CURRENTLY SITTING','money-sitting','Cash still sitting before remaining jobs'],
    'Still need to fund':['🔒 SPOKEN FOR','money-spoken','Money that still has a job in this paycheck']
  };
  document.querySelectorAll('.kpi-label').forEach(el=>{
    const original=el.dataset.hoaOriginal||el.textContent.trim();
    if(!el.dataset.hoaOriginal)el.dataset.hoaOriginal=original;
    const hit=kpiMap[original];
    if(!hit)return;
    el.textContent=hit[0];
    const card=el.closest('.card');
    card?.classList.add(hit[1]);
    const note=card?.querySelector('.kpi-note');
    if(note)note.textContent=hit[2];
    card?.setAttribute('title',hit[2]);
  });

  const powerMap={
    'Checking/payment spending power':['⚠️ BORROWABLE CAPACITY','money-borrow','Can physically cover, including fee-free buffers/advance capacity'],
    'Raw checking/payment total':['🏦 BANK BALANCE TOTAL','money-sitting','What the connected checking/payment accounts actually report'],
    'Savings balances':['🌱 SAVINGS','money-pay','Actual positive savings balances'],
    'Accessible incl. savings':['🧺 ALL ACCESSIBLE','money-spoken','Informational total; not permission to spend it'],
    'Payday Desk Safe to Spend':['💗 FREE TO USE','money-free','Your budget decision number'],
    'Unreconciled recent bank rows':['🧾 NEEDS REVIEW','money-spoken','Recent bank activity not yet reconciled'],
    'Nova snapshot':['✨ DATA UPDATED','money-pay','When connected data was last published']
  };
  document.querySelectorAll('.power-card .sub').forEach(el=>{
    const original=el.dataset.hoaOriginal||el.textContent.trim();
    if(!el.dataset.hoaOriginal)el.dataset.hoaOriginal=original;
    const hit=powerMap[original];
    if(!hit)return;
    el.textContent=hit[0];
    const card=el.closest('.power-card');
    card?.classList.add(hit[1]);
    card?.setAttribute('title',hit[2]);
    const tiny=card?.querySelector('.tinyline');
    if(tiny && original==='Checking/payment spending power') tiny.textContent='Includes remaining fee-free buffers + current MyPay. Not income.';
  });
}

function moneyReaderMarkup(accounts=false){
  return `<div class="money-reader" data-hoa-reader="1">
    <div class="money-reader-title">How to read these numbers ✨</div>
    <div class="money-reader-grid">
      <div class="money-reader-item free"><b>💗 FREE TO USE</b><span>Your Safe to Spend. Use this for normal purchase decisions.</span></div>
      <div class="money-reader-item spoken"><b>🔒 SPOKEN FOR</b><span>Money still reserved for bills, funds, buckets or your cushion.</span></div>
      <div class="money-reader-item sitting"><b>💵 CURRENTLY SITTING</b><span>Cash still in the plan before all of its remaining jobs are handled.</span></div>
      <div class="money-reader-item borrow"><b>⚠️ BORROWABLE CAPACITY</b><span>${accounts?'What accounts could technically cover with fee-free buffers/advance capacity.':'Useful as a bank reality check, but it is not extra income.'}</span></div>
    </div>
  </div>`;
}

function insertMoneyReader(){
  const host=document.getElementById('content');
  if(!host||host.querySelector('[data-hoa-reader="1"]'))return;
  if(currentView==='home'||currentView==='payday'){
    const kpis=host.querySelector('.grid.kpis');
    if(kpis)kpis.insertAdjacentHTML('afterend',moneyReaderMarkup(false));
  } else if(currentView==='accounts'){
    const grid=host.querySelector('.power-grid');
    if(grid)grid.insertAdjacentHTML('afterend',moneyReaderMarkup(true));
  }
}

function refreshCompanionArt(){
  const mount=document.getElementById('lunaIconMount');
  if(mount)mount.innerHTML=lunaSvg();
}

function hoaAfterRender(){
  applyMoneyLanguage();
  insertMoneyReader();
  refreshCompanionArt();
}

// Apply the readability pass after every normal app render without touching the stored data model.
const hoaBaseRender = render;
render = function(){
  const result=hoaBaseRender();
  hoaAfterRender();
  return result;
};

refreshCompanionArt();
render();
