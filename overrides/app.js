// House of Achen Git-managed behavior overrides.
// Approved Luna + Diana image assets + plain-language financial labels.
window.HOUSE_OF_ACHEN_GIT_OVERRIDES = true;

const HOA_PURPLE = '#B792C8';
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', HOA_PURPLE);

// Approved final companion assets. Keep these as the single source of truth.
const HOA_CAT_ASSETS = Object.freeze({
  lunaFull: './assets/cats/luna-full.webp',
  lunaHead: './assets/cats/luna-head.webp',
  dianaFull: './assets/cats/diana-full.webp',
  dianaHead: './assets/cats/diana-head.webp'
});

function hoaCatImage(src, alt, className) {
  return `<img class="${className}" src="${src}" alt="${alt}" draggable="false" decoding="async">`;
}

function lunaFullImage() {
  return hoaCatImage(
    HOA_CAT_ASSETS.lunaFull,
    'Luna, black cat with soft green eyes and a gold crescent moon',
    'hoa-cat hoa-cat-full hoa-luna'
  );
}

function lunaHeadImage() {
  return hoaCatImage(
    HOA_CAT_ASSETS.lunaHead,
    'Luna, black cat with soft green eyes and a gold crescent moon',
    'hoa-cat hoa-cat-head hoa-luna-head'
  );
}

function dianaFullImage() {
  return hoaCatImage(
    HOA_CAT_ASSETS.dianaFull,
    'Diana, gray tabby with a white muzzle and chest, soft green eyes, pearl necklace and pink heart pendant',
    'hoa-cat hoa-cat-full hoa-diana'
  );
}

function dianaHeadImage() {
  return hoaCatImage(
    HOA_CAT_ASSETS.dianaHead,
    'Diana, gray tabby with soft green eyes, pearl necklace and pink heart pendant',
    'hoa-cat hoa-cat-head hoa-diana-head'
  );
}

// The production app already calls these names everywhere Luna/Diana are rendered.
// Repointing them to the approved raster art updates every existing main mascot location
// without changing the surrounding UI.
lunaSvg = function(){ return lunaFullImage(); };
dianaSvg = function(){ return dianaFullImage(); };

// Isolated sizing only: preserve natural aspect ratios and transparent backgrounds.
(function installCompanionAssetStyles(){
  if (document.getElementById('hoa-approved-cat-styles')) return;
  const style = document.createElement('style');
  style.id = 'hoa-approved-cat-styles';
  style.textContent = `
    .hoa-cat{
      display:block;
      max-width:100%;
      height:auto;
      object-fit:contain;
      object-position:center;
      user-select:none;
      -webkit-user-drag:none;
    }
    .pet-art .hoa-cat-full{
      width:100%;
      height:100%;
      object-fit:contain;
    }
    .diana-box > div:first-child{
      display:grid;
      place-items:center;
      min-width:0;
    }
    .diana-box .hoa-cat-full{
      width:100%;
      height:auto;
      object-fit:contain;
    }
    #lunaIconMount{
      width:100%;
      height:100%;
      padding:4px;
      box-sizing:border-box;
      display:grid;
      place-items:center;
    }
    #lunaIconMount .hoa-cat-head{
      width:100%;
      height:100%;
      object-fit:contain;
    }
    .companion-scene{
      width:92px;
      height:82px;
      margin:-2px 0 7px -2px;
      display:grid;
      place-items:center;
    }
    .companion-scene .hoa-cat-head{
      width:100%;
      height:100%;
      object-fit:contain;
    }
    @media(max-width:520px){
      .companion-scene{width:82px;height:74px}
      #lunaIconMount{padding:3px}
    }
  `;
  document.head.appendChild(style);
})();

// Luna's existing tip bubble now uses the approved close-up head rather than any generic
// or hand-drawn cat scene. Diana's approved head asset is kept above for any icon/bubble use.
function decorateLunaBubble(){
  const bubble = document.getElementById('lunaBubble');
  if(!bubble) return;
  let mount = bubble.querySelector('.companion-scene');
  if(!mount){
    mount = document.createElement('div');
    mount.className = 'companion-scene';
    const title = bubble.querySelector('b');
    bubble.insertBefore(mount, title);
  }
  mount.innerHTML = lunaHeadImage();
  const title = bubble.querySelector('b');
  if(title) title.textContent = 'Luna says…';
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
  if(mount)mount.innerHTML=lunaHeadImage();
  const openBubble=document.querySelector('#lunaBubble.open');
  if(openBubble)decorateLunaBubble();
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
