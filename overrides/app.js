// House of Achen Git-managed behavior overrides.
// Approved Luna + Diana image assets + plain-language financial labels.
window.HOUSE_OF_ACHEN_GIT_OVERRIDES = true;

const HOA_PURPLE = '#B792C8';
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', HOA_PURPLE);

// Mobile app-shell hardening. The base site was originally desktop-first, so make sure
// the installed app always behaves like a phone app instead of exposing a giant canvas.
(function installMobileAppShellFix(){
  let viewport=document.querySelector('meta[name="viewport"]');
  if(!viewport){
    viewport=document.createElement('meta');
    viewport.name='viewport';
    document.head.appendChild(viewport);
  }
  viewport.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover');

  if(document.getElementById('hoa-mobile-shell-fix'))return;
  const style=document.createElement('style');
  style.id='hoa-mobile-shell-fix';
  style.textContent=`
    html,body{
      width:100%;
      max-width:100%;
      min-width:0;
      overflow-x:hidden;
    }
    *,*::before,*::after{box-sizing:border-box}

    @media(max-width:780px){
      html,body{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important}
      body{margin:0!important}

      .app,.app-shell,.shell,.layout,.main,.main-content,.content-wrap,.content,#content{
        min-width:0!important;
        max-width:100%!important;
      }
      .main,.main-content,.content-wrap,.content{
        width:100%!important;
        margin-left:0!important;
        margin-right:0!important;
        left:auto!important;
        right:auto!important;
        transform:none!important;
      }
      .content,#content{overflow-x:hidden!important}
      .topbar{
        width:100%!important;
        max-width:100vw!important;
        margin-left:0!important;
        left:0!important;
        right:0!important;
      }

      .sidebar{
        position:fixed!important;
        top:0!important;
        bottom:0!important;
        left:0!important;
        right:auto!important;
        width:min(86vw,320px)!important;
        max-width:86vw!important;
        transform:translateX(-105%)!important;
        transition:transform .2s ease!important;
      }
      .sidebar.open{transform:translateX(0)!important}

      .hoa-dream-dashboard,
      .hoa-dream-dashboard>*,
      .hoa-dream-banner,
      .hoa-dream-panel,
      .hoa-dream-chart-card,
      .hoa-dream-charts,
      .hoa-dream-soft-row,
      .hoa-dream-money-strip{
        width:100%!important;
        max-width:100%!important;
        min-width:0!important;
      }

      .hoa-dream-account-strip,.hoa-dream-tile-strip{
        width:100%!important;
        max-width:100%!important;
        min-width:0!important;
        overflow-x:auto!important;
        overflow-y:hidden!important;
        -webkit-overflow-scrolling:touch;
        overscroll-behavior-x:contain;
      }

      .hoa-dream-money-strip{
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        gap:7px!important;
        overflow:visible!important;
      }
      .hoa-dream-money-strip button{
        min-width:0!important;
        width:auto!important;
        padding:10px 8px!important;
      }
      .hoa-dream-money-strip span{font-size:8px!important;letter-spacing:.05em!important}
      .hoa-dream-money-strip b{font-size:16px!important;white-space:nowrap}

      img,canvas,svg{max-width:100%}
      .hoa-dream-chart-wrap canvas{min-width:0!important}
    }

    @media(max-width:480px){
      .hoa-dream-banner{min-height:190px!important}
      .hoa-dream-banner-copy{left:14px!important;top:58px!important;max-width:54%!important}
      .hoa-dream-banner-copy>span{font-size:15px!important}
      .hoa-dream-banner-copy h1{font-size:46px!important;line-height:.9!important}
      .hoa-dream-banner-copy p{font-size:9.5px!important;line-height:1.3!important;max-width:150px!important}
      .hoa-dream-banner-pets{width:62%!important;right:-9%!important;height:68%!important;bottom:-3px!important}
      .hoa-dream-date{right:8px!important;top:8px!important;min-width:104px!important;padding:6px 7px!important}
      .hoa-dream-date b,.hoa-dream-date span{font-size:8px!important}
      .hoa-dream-date small{font-size:7px!important}
      .hoa-dream-money-strip{gap:5px!important}
      .hoa-dream-money-strip button{padding:9px 5px!important}
      .hoa-dream-money-strip span{font-size:7px!important;letter-spacing:.025em!important}
      .hoa-dream-money-strip b{font-size:14px!important}
    }
  `;
  document.head.appendChild(style);
})();

function hoaNormalizeMobileViewport(){
  if(window.innerWidth>780)return;
  document.documentElement.scrollLeft=0;
  document.body.scrollLeft=0;
  if(window.scrollX!==0)window.scrollTo(0,window.scrollY);
}
window.addEventListener('load',()=>requestAnimationFrame(hoaNormalizeMobileViewport),{once:true});
window.addEventListener('resize',hoaNormalizeMobileViewport,{passive:true});

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
  requestAnimationFrame(hoaNormalizeMobileViewport);
}

// Apply the readability pass after every normal app render without touching the stored data model.
const hoaBaseRender = render;
render = function(){
  const result=hoaBaseRender();
  hoaAfterRender();
  return result;
};

refreshCompanionArt();
hoaNormalizeMobileViewport();
render();

// House of Achen biometric app lock — platform biometric first, local password fallback after logout/failure.
(function installHoaBiometricLock(){
  const KEY='hoa_biometric_credential_v1';
  const FALLBACK_HASH='f079a670a9622aa6584722729362afb560bacd40b956f5b24b0ecce345035fbf';
  let unlocked=false;
  let allowPassword=sessionStorage.getItem('hoa_explicit_logout')==='1';

  const toB64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const fromB64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((s.length+3)%4)),c=>c.charCodeAt(0));
  const randomBytes=n=>crypto.getRandomValues(new Uint8Array(n));
  const hex=buf=>Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');

  async function fallbackHash(value){
    const input='HouseOfAchenFallback:v1:'+String(value||'').trim().toLowerCase();
    return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input)));
  }

  if(!document.getElementById('hoa-biometric-style')){
    const style=document.createElement('style');
    style.id='hoa-biometric-style';
    style.textContent=`
      #hoaBiometricLock{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 75% 18%,rgba(217,194,241,.62),transparent 32%),linear-gradient(145deg,#211d38,#4d385f 55%,#9c6687);color:#fff}
      #hoaBiometricLock[hidden]{display:none!important}
      .hoa-lock-card{width:min(92vw,390px);padding:24px 20px;border:1px solid rgba(255,255,255,.28);border-radius:26px;background:rgba(34,27,55,.74);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 24px 70px rgba(12,9,24,.34);text-align:center}
      .hoa-lock-moon{width:58px;height:58px;margin:0 auto 13px;border-radius:19px;display:grid;place-items:center;background:linear-gradient(145deg,#f3cddd,#d9cdf4);color:#473552;font-size:27px}
      .hoa-lock-card small{display:block;font-size:9px;letter-spacing:.15em;font-weight:900;color:#ddcfe5}.hoa-lock-card h2{margin:6px 0 7px;font:600 28px Georgia,serif}.hoa-lock-card p{margin:0 auto 16px;max-width:310px;font-size:11px;line-height:1.5;color:#e8deeb}
      .hoa-lock-primary,.hoa-lock-secondary,.hoa-password-unlock{width:100%;min-height:46px;border-radius:14px;font-weight:850}
      .hoa-lock-primary{border:0;background:linear-gradient(135deg,#f2bfd6,#d8c9ff);color:#342946}
      .hoa-lock-secondary{margin-top:8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#ded3e4}
      .hoa-lock-error{min-height:18px;margin-top:10px;color:#ffd8df;font-size:10px}
      .hoa-lock-password{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.14)}
      .hoa-lock-password[hidden]{display:none!important}.hoa-lock-password input{width:100%;min-height:46px;border:1px solid rgba(255,255,255,.2);border-radius:13px;background:rgba(255,255,255,.1);color:#fff;padding:11px 12px;font-size:16px;outline:none}
      .hoa-lock-password input::placeholder{color:#cfc2d5}.hoa-password-unlock{margin-top:8px;border:0;background:rgba(255,255,255,.9);color:#443550}
      body.hoa-app-locked{overflow:hidden!important}
    `;
    document.head.appendChild(style);
  }

  function ensureOverlay(){
    let overlay=document.getElementById('hoaBiometricLock');
    if(overlay)return overlay;
    overlay=document.createElement('div');
    overlay.id='hoaBiometricLock';
    overlay.innerHTML=`<div class="hoa-lock-card">
      <div class="hoa-lock-moon">☾</div><small>HOUSE OF ACHEN</small>
      <h2 id="hoaLockTitle">House of Achen is locked</h2>
      <p id="hoaLockCopy">Verify with your fingerprint or Android device security to continue.</p>
      <button class="hoa-lock-primary" id="hoaLockPrimary">Unlock with fingerprint</button>
      <button class="hoa-lock-secondary" id="hoaLockPasswordToggle" hidden>Use app password instead</button>
      <div class="hoa-lock-password" id="hoaLockPasswordArea" hidden>
        <input id="hoaLockPassword" type="password" autocomplete="current-password" placeholder="App password">
        <button class="hoa-password-unlock" id="hoaLockPasswordSubmit">Unlock with password</button>
      </div>
      <div class="hoa-lock-error" id="hoaLockError" role="status"></div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#hoaLockPrimary').addEventListener('click',hoaRunBiometric);
    overlay.querySelector('#hoaLockPasswordToggle').addEventListener('click',()=>showPassword(true));
    overlay.querySelector('#hoaLockPasswordSubmit').addEventListener('click',hoaTryPassword);
    overlay.querySelector('#hoaLockPassword').addEventListener('keydown',e=>{if(e.key==='Enter')hoaTryPassword();});
    return overlay;
  }
  async function platformAvailable(){
    try{return !!(window.PublicKeyCredential&&navigator.credentials&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());}catch{return false;}
  }
  function showPassword(focus=false){
    allowPassword=true;
    const overlay=ensureOverlay();
    overlay.querySelector('#hoaLockPasswordToggle').hidden=false;
    overlay.querySelector('#hoaLockPasswordArea').hidden=false;
    if(focus)setTimeout(()=>overlay.querySelector('#hoaLockPassword')?.focus(),50);
  }
  async function hoaTryPassword(){
    const overlay=ensureOverlay(),input=overlay.querySelector('#hoaLockPassword'),err=overlay.querySelector('#hoaLockError');
    err.textContent='';
    const digest=await fallbackHash(input?.value||'');
    if(digest===FALLBACK_HASH){if(input)input.value='';hoaUnlockApp('password');}
    else{err.textContent='That app password is not correct.';input?.select();}
  }
  function hoaUnlockApp(method='biometric'){
    unlocked=true;
    allowPassword=false;
    sessionStorage.removeItem('hoa_explicit_logout');
    const overlay=ensureOverlay();
    overlay.hidden=true;
    document.body.classList.remove('hoa-app-locked');
    sessionStorage.setItem('hoa_last_unlock',JSON.stringify({method,at:Date.now()}));
  }
  async function configureOverlay(){
    const overlay=ensureOverlay(),primary=overlay.querySelector('#hoaLockPrimary'),toggle=overlay.querySelector('#hoaLockPasswordToggle'),area=overlay.querySelector('#hoaLockPasswordArea'),title=overlay.querySelector('#hoaLockTitle'),copy=overlay.querySelector('#hoaLockCopy'),err=overlay.querySelector('#hoaLockError');
    err.textContent='';
    const available=await platformAvailable();
    const enrolled=!!localStorage.getItem(KEY);
    area.hidden=!allowPassword;
    toggle.hidden=!allowPassword;
    primary.hidden=false;
    primary.disabled=false;
    if(!available){
      title.textContent='Biometric unlock unavailable';
      copy.textContent='Your browser is not exposing the device biometric right now. Use your House of Achen app password instead.';
      primary.hidden=true;
      showPassword(false);
      return;
    }
    if(enrolled){
      title.textContent='House of Achen is locked';
      copy.textContent='Verify with your fingerprint or Android device security to continue.';
      primary.textContent='Unlock with fingerprint';
    }else{
      title.textContent='Set up fingerprint unlock';
      copy.textContent='Enroll this device once. House of Achen will lock again whenever the app is reopened or returns from the background.';
      primary.textContent='Set up fingerprint';
    }
  }
  function hoaLockApp(explicit=false){
    unlocked=false;
    if(explicit){
      allowPassword=true;
      sessionStorage.setItem('hoa_explicit_logout','1');
    }
    const overlay=ensureOverlay();
    overlay.hidden=false;
    document.body.classList.add('hoa-app-locked');
    configureOverlay();
  }
  async function hoaRunBiometric(){
    const overlay=ensureOverlay(),button=overlay.querySelector('#hoaLockPrimary'),err=overlay.querySelector('#hoaLockError');
    err.textContent='';
    button.disabled=true;
    try{
      const available=await platformAvailable();
      if(!available){showPassword(true);return;}
      let id=localStorage.getItem(KEY);
      if(!id){
        const credential=await navigator.credentials.create({publicKey:{
          challenge:randomBytes(32),
          rp:{name:'House of Achen'},
          user:{id:randomBytes(32),name:'house-of-achen-local',displayName:'House of Achen'},
          pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
          authenticatorSelection:{authenticatorAttachment:'platform',residentKey:'preferred',userVerification:'required'},
          timeout:60000,attestation:'none'
        }});
        if(!credential)throw new Error('No biometric credential was created.');
        id=toB64(credential.rawId);
        localStorage.setItem(KEY,id);
      }else{
        const assertion=await navigator.credentials.get({publicKey:{
          challenge:randomBytes(32),
          allowCredentials:[{type:'public-key',id:fromB64(id),transports:['internal']}],
          userVerification:'required',timeout:60000
        }});
        if(!assertion)throw new Error('Verification was not completed.');
      }
      hoaUnlockApp('biometric');
    }catch(e){
      err.textContent=e?.name==='NotAllowedError'?'Fingerprint/device verification was cancelled. You can use the app password instead.':(e?.message||'Biometric verification failed. Use the app password instead.');
      showPassword(false);
    }finally{button.disabled=false;}
  }

  window.hoaLockApp=()=>hoaLockApp(false);
  window.hoaExplicitLogout=()=>hoaLockApp(true);
  window.hoaUnlockApp=hoaUnlockApp;
  hoaLockApp(false);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){unlocked=false;}else if(!unlocked)hoaLockApp(false);});
  window.addEventListener('pagehide',()=>{unlocked=false;});
})();
