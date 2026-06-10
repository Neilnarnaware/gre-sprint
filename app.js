/* GRE Sprint — app.js */
'use strict';

// ---------- FIREBASE CONFIG ----------
// Web API key is safe to ship in a client app; security comes from DB rules.
// If your Realtime Database URL differs, change databaseURL below to match
// the one shown in Firebase Console → Realtime Database.
const FIREBASE = {
  apiKey: "AIzaSyAWqpj4Vj4Gf2lmNHYfEPF1AC7memahMXU",
  authDomain: "gre-sprint.firebaseapp.com",
  projectId: "gre-sprint",
  databaseURL: "https://gre-sprint-default-rtdb.firebaseio.com"
};

// ---------- ROOM (shared sync code) ----------
const CONFIG_KEY = 'greSprintConfig';
let cfg = { room: '' };

function loadCfg(){
  try { cfg = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); } catch(e){}
  cfg.room = cfg.room || '';
}
function saveCfg(){ localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg)); }
function hasSync(){ return !!cfg.room; }

// Firebase REST endpoint for this room's data node
function roomUrl(){
  return `${FIREBASE.databaseURL}/rooms/${encodeURIComponent(cfg.room)}.json`;
}

// ---------- FIREBASE SYNC (REST) ----------
async function remoteRead(){
  if(!hasSync()) return null;
  try{
    const r = await fetch(roomUrl(), { cache: 'no-store' });
    if(!r.ok) return null;
    return await r.json();   // null if node doesn't exist yet
  } catch(e){ return null; }
}

async function remoteWrite(data){
  if(!hasSync()) return false;
  try{
    const r = await fetch(roomUrl(), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.ok;
  } catch(e){ return false; }
}

// First-time write to claim/create a room node
async function createRoom(room){
  cfg = { room };
  const existing = await remoteRead();       // does this room already hold data?
  if(existing && existing.lastSaved){
    return 'joined';                          // someone (her) already set it up
  }
  const ok = await remoteWrite(blankState());
  if(!ok) throw new Error('Could not reach Firebase');
  return 'created';
}

// ---------- STATE ----------
const LOCAL_KEY = 'greSprintState';
let S = blankState();
let saving = false;
let syncStatus = 'idle'; // idle | syncing | ok | err

function blankState(){ 
  return { plan:{}, vocab:{}, quizCount:0, quizCorrect:0, lastDays:[], lastSaved: Date.now() }; 
}

async function loadState(){
  // Always load local first for instant startup
  try { 
    const local = localStorage.getItem(LOCAL_KEY);
    if(local) S = Object.assign(blankState(), JSON.parse(local));
  } catch(e){}

  // Then try remote — take whichever is newer
  if(hasSync()){
    setSyncStatus('syncing');
    const remote = await remoteRead();
    if(remote && remote.lastSaved && (!S.lastSaved || remote.lastSaved > S.lastSaved)){
      S = Object.assign(blankState(), remote);
      saveLocal();
    }
    setSyncStatus(remote !== null ? 'ok' : 'err');
  }
}

function saveLocal(){
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(S)); } catch(e){}
}

let saveTimer = null;
async function save(){
  S.lastSaved = Date.now();
  saveLocal();
  // Debounce remote writes — 1s after last change
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if(!hasSync()) return;
    setSyncStatus('syncing');
    const ok = await remoteWrite(S);
    setSyncStatus(ok ? 'ok' : 'err');
  }, 1000);
}

function setSyncStatus(st){
  syncStatus = st;
  const pill = document.getElementById('syncPill');
  if(!pill) return;
  pill.className = 'sync-pill ' + st;
  const labels = { idle:'—', syncing:'Syncing…', ok:'Synced live', err:'Offline · saved locally' };
  pill.querySelector('.label').textContent = labels[st] || st;
}

// Show the current room code on the Track tab and wire the change button
function refreshRoomDisplay(){
  const disp = document.getElementById('roomDisplay');
  if(disp){
    disp.textContent = hasSync() ? ('Code: ' + cfg.room) : 'Not connected — running offline';
    disp.classList.toggle('connected', hasSync());
  }
  const btn = document.getElementById('btnChangeRoom');
  if(btn && !btn._wired){
    btn._wired = true;
    btn.onclick = async () => {
      const next = prompt('Enter a shared sync code (same on both phones):', cfg.room || '');
      if(next === null) return;
      const room = next.trim().toLowerCase().replace(/[^a-z0-9-]/g,'');
      if(room.length < 4){ toast('Code must be at least 4 characters'); return; }
      try{
        setSyncStatus('syncing');
        await createRoom(room);
        cfg = { room }; saveCfg();
        const remote = await remoteRead();
        if(remote && remote.lastSaved){ S = Object.assign(blankState(), remote); saveLocal(); }
        else { await remoteWrite(S); }
        renderAll();
        if(typeof renderJourneyMap === 'function') renderJourneyMap();
        refreshRoomDisplay();
        setSyncStatus('ok');
        toast('Now syncing on code: ' + room);
      }catch(e){ setSyncStatus('err'); toast('Could not connect to Firebase'); }
    };
  }
}

// ---------- SETUP SCREEN ----------
function showSetup(onDone){
  const el = document.getElementById('setup');
  el.style.display = 'flex';

  document.getElementById('btnSetupSave').onclick = async () => {
    const room = document.getElementById('inpRoom').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'');
    if(room.length < 4){ toast('Pick a code at least 4 characters'); return; }

    const btn = document.getElementById('btnSetupSave');
    btn.textContent = 'Connecting…';
    try{
      const result = await createRoom(room);
      cfg = { room };
      saveCfg();
      el.style.display = 'none';
      toast(result === 'joined' ? 'Joined! Loading progress…' : 'Sync on! Share code: ' + room);
      onDone();
    } catch(e){
      toast('Could not reach Firebase — check the database URL');
      btn.textContent = 'Start syncing →';
    }
  };

  document.getElementById('btnSetupSkip').onclick = () => {
    el.style.display = 'none';
    toast('Running offline — progress saves on this device only.');
    onDone();
  };
}

// ---------- OFFLINE BAR ----------
function updateOnlineBar(){
  const bar = document.getElementById('offlineBar');
  bar.classList.toggle('show', !navigator.onLine);
}
window.addEventListener('online',  updateOnlineBar);
window.addEventListener('offline', updateOnlineBar);

// ---------- UI HELPERS ----------
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 1900);
}

// ---------- NAV ----------
document.querySelectorAll('nav button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('nav button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('on'));
    document.getElementById('v-' + b.dataset.v).classList.add('on');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

// ---------- PLAN ----------
function renderPlan(){
  const list = document.getElementById('planList');
  let html = '', curWeek = 0;
  PLAN.forEach((d, i) => {
    if(d[0] !== curWeek){
      curWeek = d[0];
      const wd   = PLAN.map((x,j) => ({x,j})).filter(o => o.x[0] === curWeek);
      const done = wd.filter(o => S.plan[o.j]).length;
      html += `<div class="week-h"><span>Week ${curWeek}</span><span>${done}/${wd.length} done</span></div>`;
    }
    const on = S.plan[i] ? 'done' : '';
    html += `<div class="day ${on}" data-i="${i}">
      <div class="check">✓</div>
      <div class="day-body">
        <div class="day-title"><span>${d[1]}</span><span class="dn">D${i+1}</span></div>
        <div class="day-tasks">${d[2]}</div>
        <div class="day-min">⏱ ${d[3]}</div>
      </div></div>`;
  });
  list.innerHTML = html;
  list.querySelectorAll('.day').forEach(el => {
    el.onclick = () => {
      const i = el.dataset.i;
      S.plan[i] = !S.plan[i];
      if(S.plan[i]){ markToday(); toast('Day ' + (parseInt(i)+1) + ' complete ✓'); }
      save(); renderPlan(); updateDash();
    };
  });
}
function markToday(){
  const today = new Date().toISOString().slice(0,10);
  if(!S.lastDays.includes(today)){ S.lastDays.push(today); S.lastDays = S.lastDays.slice(-90); }
}
function streak(){
  if(!S.lastDays.length) return 0;
  const days = [...new Set(S.lastDays)].sort();
  let st = 0;
  let d = new Date();
  for(let k = 0; k < 90; k++){
    const ds = d.toISOString().slice(0,10);
    if(days.includes(ds)){ st++; d.setDate(d.getDate()-1); }
    else if(k === 0){ d.setDate(d.getDate()-1); }
    else break;
  }
  return st;
}

// ---------- VOCAB ----------
let curDeck = Object.keys(DECKS)[0];
let vi = 0;

function renderDeckPills(){
  const p = document.getElementById('deckPills');
  p.innerHTML = Object.keys(DECKS).map(k =>
    `<div class="pill ${k === curDeck ? 'on' : ''}" data-d="${k}">${k}</div>`
  ).join('');
  p.querySelectorAll('.pill').forEach(el => {
    el.onclick = () => { curDeck = el.dataset.d; vi = 0; renderDeckPills(); showCard(); };
  });
}
function showCard(){
  const deck = DECKS[curDeck];
  document.getElementById('vLen').textContent = deck.length;
  if(vi >= deck.length) vi = 0;
  document.getElementById('vIdx').textContent = vi + 1;
  const c = deck[vi];
  document.getElementById('flash').classList.remove('flip');
  document.getElementById('fWord').textContent = c[0];
  document.getElementById('fPos').textContent  = c[1];
  document.getElementById('fDef').textContent  = c[2];
  document.getElementById('fEx').textContent   = '\u201C' + c[3] + '\u201D';
  document.getElementById('fSyn').textContent  = '≈ ' + c[4];
  updateVocabStats();
}
document.getElementById('flash').onclick = () =>
  document.getElementById('flash').classList.toggle('flip');

document.getElementById('btnKnow').onclick = () => {
  S.vocab[curDeck + '::' + DECKS[curDeck][vi][0]] = 'known';
  markToday(); save();
  toast('Mastered: ' + DECKS[curDeck][vi][0]);
  nextCard();
};
document.getElementById('btnAgain').onclick = () => {
  S.vocab[curDeck + '::' + DECKS[curDeck][vi][0]] = 'review';
  markToday(); save(); nextCard();
};
function nextCard(){ vi = (vi+1) % DECKS[curDeck].length; showCard(); updateDash(); }

function updateVocabStats(){
  let known=0, review=0, total=0;
  Object.keys(DECKS).forEach(k => DECKS[k].forEach(c => {
    total++;
    const st = S.vocab[k + '::' + c[0]];
    if(st === 'known') known++;
    else if(st === 'review') review++;
  }));
  document.getElementById('vTotal').textContent  = total;
  document.getElementById('vKnown').textContent  = known;
  document.getElementById('vReview').textContent = review;
}
document.getElementById('resetVocab').onclick = () => {
  if(confirm('Reset all flashcard mastery?')){ S.vocab = {}; save(); showCard(); updateDash(); toast('Vocab reset'); }
};

// ---------- QUIZ ----------
let curQuiz = Object.keys(QUIZZES)[0];

function renderQuizPills(){
  const p = document.getElementById('quizPills');
  p.innerHTML = Object.keys(QUIZZES).map(k =>
    `<div class="pill ${k === curQuiz ? 'on' : ''}" data-q="${k}">${k}</div>`
  ).join('');
  p.querySelectorAll('.pill').forEach(el => {
    el.onclick = () => { curQuiz = el.dataset.q; renderQuizPills(); renderQuiz(); };
  });
}
function renderQuiz(){
  const list = document.getElementById('quizList');
  const letters = ['A','B','C','D','E'];
  list.innerHTML = QUIZZES[curQuiz].map((item, qi) => {
    const opts = item.opts.map((o, oi) =>
      `<div class="opt" data-q="${qi}" data-o="${oi}">
        <span class="letter">${letters[oi]}</span><span>${o}</span>
      </div>`
    ).join('');
    return `<div class="q-card" data-card="${qi}">
      <div class="q-meta">${item.meta}</div>
      <div class="q-text">${item.q}</div>
      ${opts}
      <div class="q-exp" id="exp-${qi}">${item.exp}</div>
    </div>`;
  }).join('');

  list.querySelectorAll('.opt').forEach(el => {
    el.onclick = () => {
      const card = el.closest('.q-card');
      if(card.dataset.answered) return;
      card.dataset.answered = '1';
      const qi = +el.dataset.q, oi = +el.dataset.o;
      const item = QUIZZES[curQuiz][qi];
      card.querySelectorAll('.opt').forEach((o, i) => {
        if(i === item.correct) o.classList.add('correct');
      });
      const ok = oi === item.correct;
      if(!ok) el.classList.add('wrong');
      card.querySelector('#exp-' + qi).classList.add('show');
      S.quizCount++; if(ok) S.quizCorrect++;
      markToday(); save(); updateDash();
      toast(ok ? 'Correct ✓' : 'Review the explanation');
    };
  });
}

// ---------- ESSAY ----------
let promptIdx = 0;
function renderEssay(){
  document.getElementById('essayIntro').innerHTML = ESSAY.intro;
  document.getElementById('promptText').textContent = ESSAY.prompts[promptIdx];
  document.getElementById('essaySteps').innerHTML = ESSAY.template.map((s, i) =>
    `<div class="estep">
      <div class="eh"><span class="num">${i+1}</span>${s[0]}</div>
      <div class="ed">${s[1]}</div>
      <div class="et">${s[2]}</div>
    </div>`
  ).join('');
  document.getElementById('essayScoring').innerHTML = ESSAY.scoring.map(s => `<li>${s}</li>`).join('');
  document.getElementById('essayTips').innerHTML    = ESSAY.tips.map(s => `<li>${s}</li>`).join('');
}
document.getElementById('newPrompt').onclick = () => {
  promptIdx = (promptIdx+1) % ESSAY.prompts.length;
  document.getElementById('promptText').textContent = ESSAY.prompts[promptIdx];
};

// ---------- TIMER ----------
const PRESETS = [
  ['Verbal section', 18], ['Quant section', 21], ['Essay (AWA)', 30],
  ['Quick drill', 10], ['Pomodoro', 25]
];
let tPreset=0, tRemain=PRESETS[0][1]*60, tInt=null, tRunning=false;

function fmt(s){ const m = Math.floor(s/60), x = s%60; return m + ':' + String(x).padStart(2,'0'); }
function renderPresets(){
  document.getElementById('presetRow').innerHTML = PRESETS.map((p,i) =>
    `<div class="preset ${i===tPreset?'on':''}" data-i="${i}">${p[0]} · ${p[1]}m</div>`
  ).join('');
  document.getElementById('presetRow').querySelectorAll('.preset').forEach(el => {
    el.onclick = () => {
      if(tRunning) return;
      tPreset = +el.dataset.i; tRemain = PRESETS[tPreset][1]*60;
      renderPresets(); paintTimer();
    };
  });
}
function paintTimer(){
  const d = document.getElementById('timerDisplay');
  d.textContent = fmt(tRemain);
  d.classList.toggle('warn', tRemain <= 60);
  document.getElementById('timerLabel').textContent = PRESETS[tPreset][0] + ' · ' + PRESETS[tPreset][1] + ' min';
}
document.getElementById('timerGo').onclick = () => {
  const btn = document.getElementById('timerGo');
  if(tRunning){
    clearInterval(tInt); tRunning=false;
    btn.textContent='Start'; btn.classList.add('go'); btn.classList.remove('stop');
    return;
  }
  tRunning=true; btn.textContent='Pause';
  btn.classList.remove('go'); btn.classList.add('stop');
  tInt = setInterval(() => {
    tRemain--; paintTimer();
    if(tRemain <= 0){
      clearInterval(tInt); tRunning=false;
      btn.textContent='Start'; btn.classList.add('go'); btn.classList.remove('stop');
      toast('⏰ Time\'s up!');
      try { navigator.vibrate && navigator.vibrate([200,100,200]); } catch(e){}
    }
  }, 1000);
};
document.getElementById('timerReset').onclick = () => {
  clearInterval(tInt); tRunning=false; tRemain=PRESETS[tPreset][1]*60;
  const btn=document.getElementById('timerGo');
  btn.textContent='Start'; btn.classList.add('go'); btn.classList.remove('stop');
  paintTimer();
};

// ---------- TRACK / DASH ----------
function updateDash(){
  const planDone = Object.values(S.plan).filter(Boolean).length;
  const pct = Math.round(planDone/PLAN.length*100);
  document.getElementById('pctBig').textContent = pct + '%';
  document.getElementById('ringFill').style.strokeDashoffset = 201 - (201*pct/100);
  let known=0, totalW=0;
  Object.keys(DECKS).forEach(k => DECKS[k].forEach(c => {
    totalW++;
    if(S.vocab[k + '::' + c[0]] === 'known') known++;
  }));
  document.getElementById('dayCount').textContent = planDone + ' / ' + PLAN.length + ' days · ' + known + ' words mastered';
  document.getElementById('tDays').textContent = planDone;
  document.getElementById('tDaysBar').style.width = pct + '%';
  document.getElementById('tWords').textContent = known;
  document.getElementById('tWordsBar').style.width = Math.round(known/totalW*100) + '%';
  document.getElementById('tQuiz').textContent  = S.quizCount;
  document.getElementById('tAcc').textContent   = S.quizCount ? Math.round(S.quizCorrect/S.quizCount*100) + '%' : '0%';
  document.getElementById('tStreak').textContent = streak();
}

function renderMilestones(){
  const m = document.getElementById('milestones');
  const goals = {1:'Foundations + diagnostic',2:'Core verbal & quant + half test',3:'Advanced topics + essay',4:'Full mock + final polish'};
  m.innerHTML = [1,2,3,4].map(w => {
    const wd   = PLAN.map((d,i) => ({d,i})).filter(x => x.d[0] === w);
    const done = wd.filter(x => S.plan[x.i]).length;
    const pct  = Math.round(done/wd.length*100);
    return `<div class="card" style="padding:14px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong style="font-size:14px">Week ${w} — ${goals[w]}</strong>
        <span style="font-family:'Spline Sans Mono',monospace;font-size:12px;color:var(--gold-deep)">${done}/${wd.length}</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

function renderResources(){
  document.getElementById('resList').innerHTML = RESOURCES.map(r =>
    `<a class="res" href="${r[4]}" target="_blank" rel="noopener">
      <div class="ricon ${r[0]==='g'?'g':r[0]==='r'?'r':r[0]==='m'?'m':''}">${r[0].toUpperCase()}</div>
      <div class="res-body">
        <div class="res-t">${r[1]} <span class="${r[2]==='free'?'free':'paid'}">${r[2].toUpperCase()}</span></div>
        <div class="res-d">${r[3]}</div>
      </div>
    </a>`
  ).join('');
}

document.getElementById('resetAll').onclick = () => {
  if(confirm('Reset ALL progress — plan, vocab, and quiz?')){
    S = blankState(); save(); renderAll(); toast('Everything reset');
  }
};

// ---------- LIVE REFRESH (poll Firebase while app is open) ----------
setInterval(async () => {
  if(!hasSync() || document.hidden) return;
  const remote = await remoteRead();
  if(remote && remote.lastSaved && remote.lastSaved > (S.lastSaved||0)){
    S = Object.assign(blankState(), remote);
    saveLocal(); renderAll();
    if(typeof renderJourneyMap === 'function') renderJourneyMap();
    if(typeof renderWordReminder === 'function') renderWordReminder();
    setSyncStatus('ok');
    toast('Updated ✓');
  }
}, 15000);

// Also refresh the moment the app regains focus (e.g. you reopen to check on her)
document.addEventListener('visibilitychange', async () => {
  if(document.hidden || !hasSync()) return;
  const remote = await remoteRead();
  if(remote && remote.lastSaved && remote.lastSaved > (S.lastSaved||0)){
    S = Object.assign(blankState(), remote);
    saveLocal(); renderAll();
    if(typeof renderJourneyMap === 'function') renderJourneyMap();
    setSyncStatus('ok');
  }
});

// ---------- RENDER ALL ----------
function renderAll(){
  renderPlan(); renderDeckPills(); showCard();
  renderQuizPills(); renderQuiz();
  renderMilestones(); updateDash();
}

// ---------- SERVICE WORKER ----------
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ---------- INIT ----------
(async function(){
  loadCfg();
  updateOnlineBar();
  renderResources();
  renderEssay();
  renderPresets(); paintTimer();

  const needsSetup = !hasSync() && !localStorage.getItem(LOCAL_KEY);

  if(needsSetup){
    showSetup(async () => {
      await loadState();
      renderAll();
      refreshRoomDisplay();
      if(typeof initMotivation === 'function') initMotivation();
    });
  } else {
    await loadState();
    renderAll();
    refreshRoomDisplay();
    if(typeof initMotivation === 'function') initMotivation();
  }
})();
