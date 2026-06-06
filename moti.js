// ===== MOTIVATION TAB — moti.js =====
'use strict';

// ── Short motivation quotes ────────────────────────────────────────────────────
const QUOTES = [
  { text: "I booked nothing yet. I'm waiting for you to get here first.", sig: "— Narna" },
  { text: "You learned 10 new words today. I'm already proud of you.", sig: "— Narna" },
  { text: "The GRE is just a door. You're already turning the handle.", sig: "— Narna" },
  { text: "Same timezone soon. Keep going.", sig: "— Narna" },
  { text: "Every flashcard is a flight booking in disguise. ✈️", sig: "— Narna" },
  { text: "I miss you more than you know. Study one more word for me.", sig: "— Narna" },
  { text: "You're doing something hard alone. That takes guts. I see it.", sig: "— Narna" },
  { text: "I already have our first weekend planned. You just have to show up.", sig: "— Narna" },
  { text: "Hard days don't erase the progress. It's still there.", sig: "— Narna" },
  { text: "One word at a time. One day at a time. One test away from us.", sig: "— Narna" },
  { text: "Moma, you are literally learning a thousand words to build a life with me. That's love.", sig: "— Narna" },
  { text: "I'll be right here when you land. That's a promise.", sig: "— Narna" },
  { text: "You already decided. That was the hard part. Everything else is just showing up.", sig: "— Narna" },
  { text: "Missing you is exhausting. Let's fix that. Study. 📚", sig: "— Narna" },
  { text: "Forget perfect. Consistent beats perfect every time.", sig: "— Narna" },
  { text: "The version of you that passes this test has already done the work. Be her.", sig: "— Narna" },
  { text: "Five more flashcards. That's all I'm asking for today.", sig: "— Narna" },
  { text: "You're not studying for a test. You're studying for us.", sig: "— Narna" },
  { text: "Every day you study, the distance between us shrinks. Measurably.", sig: "— Narna" },
  { text: "I can't wait for you to meet my city. Study so we can do that faster.", sig: "— Narna" },
  { text: "GRE score → application → admit → visa → flight → me. You're on step 1. Keep moving.", sig: "— Narna" },
  { text: "Tired is okay. Quitting is not. Take a break, then come back.", sig: "— Narna" },
  { text: "You've come too far to only come this far.", sig: "— Narna" },
  { text: "I'm rooting for you from across the ocean. Loudly.", sig: "— Narna" },
];

// ── Journey milestones ─────────────────────────────────────────────────────────
// Each has a label, emoji, and a function that returns 0–1 progress
const JOURNEY_STEPS = [
  { label: "Decided\nto prep",  emoji: "💡", key: "start" },
  { label: "Week 1\ndone",      emoji: "📖", key: "w1"    },
  { label: "Week 2\ndone",      emoji: "✏️",  key: "w2"    },
  { label: "Week 3\ndone",      emoji: "🧠", key: "w3"    },
  { label: "Test\ntaken",       emoji: "🎯", key: "w4"    },
  { label: "Applied\nto US",    emoji: "📋", key: "applied"},
  { label: "Admitted",          emoji: "🎓", key: "admit" },
  { label: "Same city\nas Narna",emoji: "💛", key: "here" },
];

// ── Stars canvas ───────────────────────────────────────────────────────────────
function initStars(){
  const canvas = document.getElementById('starsCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({length: 90}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + .3,
      phase: Math.random() * Math.PI * 2,
      speed: .004 + Math.random() * .008,
    }));
  }

  function draw(t){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const a = .15 + .55 * (Math.sin(t * s.speed + s.phase) * .5 + .5);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(167,139,218,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}

// ── Compute journey step from plan state ──────────────────────────────────────
function getJourneyStep(){
  // Plan has 30 days, weeks 1-4
  const planDone = Object.values(S.plan||{}).filter(Boolean).length;
  const w1 = [0,6].every((_,i,a,d=a[0]) => d <= planDone);  // days 1-7 done
  const daysArr = Object.keys(S.plan||{}).filter(k=>S.plan[k]).map(Number);

  const w1done = daysArr.filter(d => d < 7).length  >= 7;
  const w2done = daysArr.filter(d => d < 14).length >= 14;
  const w3done = daysArr.filter(d => d < 21).length >= 21;
  const w4done = daysArr.filter(d => d < 30).length >= 30;

  // step 0 = always done (decided), step 1-4 = weekly, 5-7 = future
  let step = 0;
  if(planDone > 0)  step = 1;
  if(w1done)        step = 2;
  if(w2done)        step = 3;
  if(w3done)        step = 4;
  if(w4done)        step = 5;
  // 6 = applied, 7 = admitted, 8 = here — user can't unlock these via plan
  return step;
}

// ── Draw journey map ──────────────────────────────────────────────────────────
function renderJourneyMap(){
  const wrap = document.getElementById('journeyWrap');
  if(!wrap) return;

  const step = getJourneyStep();
  const total = JOURNEY_STEPS.length - 1; // 7 edges
  const pct   = Math.round(step / total * 100);

  document.getElementById('journeyPct').textContent  = pct + '%';
  document.getElementById('journeyDist').textContent = `Step ${step} of ${total}`;
  document.getElementById('journeyBarFill').style.width = pct + '%';

  const W = wrap.offsetWidth || 320;
  const H = 260;

  // Generate a gentle S-curve path through the milestones
  // Place 8 nodes across the space in a winding path
  const nodes = JOURNEY_STEPS.map((s, i) => {
    const t = i / (JOURNEY_STEPS.length - 1);
    const x = 32 + t * (W - 64);
    // Sine wave y to create a winding path
    const y = H * 0.5 + Math.sin(t * Math.PI * 1.8) * (H * 0.33);
    return { x, y, ...s, idx: i };
  });

  // Build SVG
  // Path string: smooth cubic bezier through all points
  let pathD = `M ${nodes[0].x} ${nodes[0].y}`;
  for(let i = 1; i < nodes.length; i++){
    const p = nodes[i-1], c = nodes[i];
    const cpx = (p.x + c.x) / 2;
    pathD += ` C ${cpx} ${p.y}, ${cpx} ${c.y}, ${c.x} ${c.y}`;
  }

  // Progress path (partial)
  let donePath = `M ${nodes[0].x} ${nodes[0].y}`;
  for(let i = 1; i <= Math.min(step, nodes.length-1); i++){
    const p = nodes[i-1], c = nodes[i];
    const cpx = (p.x + c.x) / 2;
    donePath += ` C ${cpx} ${p.y}, ${cpx} ${c.y}, ${c.x} ${c.y}`;
  }

  const svg = `<svg class="journey-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <!-- Background path -->
    <path d="${pathD}" fill="none" stroke="#2e2845" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 6"/>
    <!-- Done path -->
    ${step > 0 ? `<path d="${donePath}" fill="none" stroke="url(#pg)" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>` : ''}
    <defs>
      <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#7c5cbf"/>
        <stop offset="100%" stop-color="#3ecf8e"/>
      </linearGradient>
    </defs>
    ${nodes.map((n, i) => {
      const done   = i < step;
      const active = i === step;
      const color  = done ? '#3ecf8e' : active ? '#f0b429' : '#2e2845';
      const stroke = done ? '#3ecf8e' : active ? '#f0b429' : '#3d3660';
      const textC  = done ? '#3ecf8e' : active ? '#f0b429' : '#6b5f8a';
      const fs     = active ? '19' : '15';
      const r      = active ? 20 : done ? 18 : 16;
      // Label lines
      const lines  = n.label.split('\n');
      const ly     = n.y + r + 14;
      const labelSvg = lines.map((l,li) =>
        `<text x="${n.x}" y="${ly + li*13}" text-anchor="middle" fill="${textC}" font-family="'Spline Sans Mono',monospace" font-size="9" font-weight="600">${l}</text>`
      ).join('');
      return `
        <circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${done?'#3ecf8e':active?'#f0b429':'#13101f'}" stroke="${stroke}" stroke-width="2" ${active?'filter="url(#glow)"':''}/>
        <text x="${n.x}" y="${n.y+1}" text-anchor="middle" dominant-baseline="middle" font-size="${fs}">${n.emoji}</text>
        ${labelSvg}
      `;
    }).join('')}
  </svg>`;

  wrap.innerHTML = svg;

  // Journey title label
  const titles = [
    "She decided — that's step one ✓",
    "She started — momentum is real",
    "Week 1 done — she's on her way",
    "Week 2 done — past the halfway mark",
    "Week 3 done — almost there 🔥",
    "Test done — the hard part is over",
    "Applied — the door is open",
    "Admitted — just one flight left 🛫",
    "Same city 💛"
  ];
  document.getElementById('journeyTitle').textContent = titles[Math.min(step, titles.length-1)];
}

// ── Render quote stack ────────────────────────────────────────────────────────
function renderQuotes(){
  const stack = document.getElementById('quoteStack');
  if(!stack) return;

  // Show 5 at a time, rotating by day
  const dayOffset = Math.floor(Date.now() / 86400000);
  const shown = [];
  for(let i = 0; i < 5; i++){
    shown.push(QUOTES[(dayOffset + i) % QUOTES.length]);
  }

  stack.innerHTML = shown.map((q, i) => `
    <div class="quote-card ${i===0?'featured':''}" onclick="cycleQuote(this)">
      <div class="qtext">${q.text}</div>
      <div class="qsig">${q.sig}</div>
    </div>`
  ).join('');
}

// Tap a quote to replace it with a new one
let quoteOffset = 5;
function cycleQuote(card){
  const q = QUOTES[quoteOffset % QUOTES.length];
  quoteOffset++;
  card.querySelector('.qtext').textContent = q.text;
  card.querySelector('.qsig').textContent  = q.sig;
  card.style.opacity = '0';
  card.style.transform = 'translateY(-8px)';
  setTimeout(()=>{
    card.style.transition = 'opacity .3s, transform .3s';
    card.style.opacity = '1';
    card.style.transform = 'none';
  }, 10);
}

// ── Greeting time-of-day ──────────────────────────────────────────────────────
function setGreeting(){
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('motiDay');
  if(el) el.textContent = greet + ', Moma 💛';
}

// ── Word of the day ───────────────────────────────────────────────────────────
function renderWordReminder(){
  const allWords = Object.values(DECKS).flat();
  const dayIdx = Math.floor(Date.now() / 86400000) % allWords.length;
  const w = allWords[dayIdx];

  const wEl = document.getElementById('wrWord');
  const dEl = document.getElementById('wrDef');
  if(wEl) wEl.textContent = w[0];
  if(dEl) dEl.textContent = w[1] + ' · ' + w[2];

  const s = streak();
  const sEl = document.getElementById('wrStreak');
  const subEl = document.getElementById('wrSub');
  if(sEl) sEl.textContent = s;
  if(subEl) subEl.textContent = s > 0 ? `${s}-day streak 🔥 keep it going` : 'Start your streak today';
}

// ── Notification ──────────────────────────────────────────────────────────────
async function requestDailyReminder(btn){
  if(!('Notification' in window)){ toast("Notifications not supported here"); return; }
  const perm = await Notification.requestPermission();
  if(perm === 'granted'){
    localStorage.setItem('motiNotif','1');
    btn.textContent = 'On ✓'; btn.classList.add('on');
    toast('Reminder set for 8 PM 🔔');
  } else {
    toast('Enable notifications in your phone settings first');
  }
}

function checkNotif(){
  const btn = document.getElementById('notifBtn');
  if(!btn) return;
  if(localStorage.getItem('motiNotif')==='1'){
    btn.textContent='On ✓'; btn.classList.add('on');
    const today = new Date().toISOString().slice(0,10);
    if(localStorage.getItem('lastNotif')!==today && new Date().getHours()>=20){
      localStorage.setItem('lastNotif',today);
      try{
        new Notification('GRE Sprint 📚',{
          body:"Hey Moma! Time for today's vocab — Narna is counting on you 💛",
          icon:'icons/icon-192.png'
        });
      }catch(e){}
    }
  }
  btn.onclick = ()=> requestDailyReminder(btn);
}

// ── Milestone unlock banner ───────────────────────────────────────────────────
let lastStep = -1;
function checkMilestoneUnlock(){
  const step = getJourneyStep();
  if(lastStep >= 0 && step > lastStep){
    const msg = [
      '','🎉 Week 1 done!','🎉 Week 2 done!','🎉 Week 3 done!',
      '🎯 Test prep complete!','📋 Apply now!','🎓 Admitted!','💛 Moma is here!'
    ][step] || '🎉 Milestone unlocked!';
    const el = document.getElementById('milestoneUnlock');
    if(el){ el.textContent = msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),3500); }
  }
  lastStep = step;
}

// ── Vocab nav button ──────────────────────────────────────────────────────────
function bindVocabBtn(){
  const btn = document.getElementById('wrGo');
  if(!btn) return;
  btn.onclick = ()=>{
    document.querySelectorAll('nav button').forEach(b=>b.classList.remove('on'));
    const vb = document.querySelector('[data-v="vocab"]');
    if(vb){ vb.classList.add('on'); }
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));
    const vv = document.getElementById('v-vocab');
    if(vv){ vv.classList.add('on'); }
    window.scrollTo({top:0,behavior:'smooth'});
  };
}

// ── Main init ─────────────────────────────────────────────────────────────────
function initMotivation(){
  initStars();
  setGreeting();
  renderWordReminder();
  renderJourneyMap();
  renderQuotes();
  checkNotif();
  checkMilestoneUnlock();
  bindVocabBtn();

  // Re-render journey when plan changes (hook into existing save)
  const origSave = window._origSave || save;
  window._origSave = origSave;
}

// Re-render journey map whenever the moti tab is opened
document.querySelector('[data-v="moti"]') && (() => {
  const orig = document.querySelector('[data-v="moti"]').onclick;
  document.querySelector('[data-v="moti"]').onclick = function(e){
    if(orig) orig.call(this, e);
    setTimeout(()=>{ renderJourneyMap(); renderWordReminder(); checkMilestoneUnlock(); }, 60);
  };
})();
