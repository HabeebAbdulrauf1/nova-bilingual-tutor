(() => {
  "use strict";

  const CONFIG = window.NOVA_CONFIG;
  const CONTENT = window.NOVA_CONTENT;
  const app = document.getElementById("app");
  const progressWrap = document.getElementById("progressWrap");
  const progressBar = document.getElementById("progressBar");
  const progressPhase = document.getElementById("progressPhase");
  const progressText = document.getElementById("progressText");
  const testBadge = document.getElementById("testBadge");

  if (CONFIG.testMode) testBadge.classList.remove("hidden");

  const params = new URLSearchParams(window.location.search);
  const pid = sanitizePid(params.get("pid") || "");
  const condition = String(params.get("condition") || "").toUpperCase();
  const requestedVersion = String(params.get("version") || CONFIG.studyVersion);
  const version = CONFIG.studyVersion;

  if (!pid || !["A", "B"].includes(condition)) {
    renderFatal("This study link is incomplete. Please return to the entry survey and use the automatic link provided there. Do not start the activity from a bookmarked or copied Nova link.");
    return;
  }

  if (requestedVersion !== CONFIG.studyVersion) {
    renderFatal("This study link is for a different study version. Please return to the entry survey and use its current automatic link.");
    return;
  }

  const storageKey = `nova_state_${pid}_${condition}_${version}`;
  const initialState = {
    pid,
    condition,
    studyVersion: version,
    phase: "intro",
    trainingIndex: 0,
    trainingResponses: {},
    mentalEffort: null,
    posttestOrder: createConstrainedPosttestOrder(CONTENT.posttest, pid),
    posttestIndex: 0,
    posttestResponses: {},
    estimatedScore: null,
    startedAt: new Date().toISOString(),
    finalPayload: null
  };

  let state = loadState() || initialState;
  normalizeState();
  saveState();

  if (!state.startBackupSent) {
    state.startBackupSent = true;
    saveState();
    sendBackup("start");
  }

  render();

  function sanitizePid(value) {
    const cleaned = String(value).trim();
    return /^[A-Za-z0-9_-]{3,100}$/.test(cleaned) ? cleaned : "";
  }

  function normalizeState() {
    state.pid = pid;
    state.condition = condition;
    state.studyVersion = version;
    if (!Array.isArray(state.posttestOrder) || state.posttestOrder.length !== CONTENT.posttest.length) {
      state.posttestOrder = createConstrainedPosttestOrder(CONTENT.posttest, pid);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function saveState() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
  }

  function hashString(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(items, random) {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createConstrainedPosttestOrder(items, seedText) {
    const random = mulberry32(hashString(seedText + "|posttest|" + version));
    for (let attempt = 0; attempt < 500; attempt++) {
      const arr = shuffled(items, random);
      let ok = true;
      for (let i = 2; i < arr.length; i++) {
        if (arr[i].type === arr[i-1].type && arr[i].type === arr[i-2].type) {
          ok = false; break;
        }
      }
      if (ok) return arr.map(x => x.id);
    }
    return items.map(x => x.id);
  }

  function getPosttestItem(id) {
    return CONTENT.posttest.find(x => x.id === id);
  }

  function render() {
    switch (state.phase) {
      case "intro": return renderIntro();
      case "training": return renderTraining();
      case "mental": return renderMentalEffort();
      case "postintro": return renderPostIntro();
      case "posttest": return renderPosttest();
      case "estimate": return renderEstimate();
      case "complete": return renderComplete();
      default: return renderFatal("An unexpected study state was detected. Please notify the researcher.");
    }
  }

  function setProgress(phase, current, total) {
    progressWrap.classList.remove("hidden");
    progressPhase.textContent = phase;
    progressText.textContent = `${current} of ${total}`;
    progressBar.style.width = `${Math.max(0, Math.min(100, (current / total) * 100))}%`;
  }

  function clearProgress() { progressWrap.classList.add("hidden"); }

  function renderIntro() {
    clearProgress();
    app.innerHTML = `
      <h1>AI Learning Activity</h1>
      <p>Hi. I’m Nova, an AI learning assistant. You will work through six short examples about using AI-generated information for university work.</p>
      <p>For each example, choose the best answer. After you respond, I will show you the best answer and explain the key idea. After the learning section, you will answer new questions on your own.</p>
      <p>You do not need to have taken a research-methods course to complete this activity. Read each example carefully and use the explanations to learn the ideas.</p>
      <button class="primary-btn" id="startBtn">Start</button>`;
    document.getElementById("startBtn").addEventListener("click", () => {
      state.phase = "training";
      saveState(); render();
    });
  }

  function renderTraining() {
    const item = CONTENT.training[state.trainingIndex];
    if (!item) {
      state.phase = "mental"; saveState(); render(); return;
    }
    setProgress("Learning examples", state.trainingIndex + 1, CONTENT.training.length);
    const existing = state.trainingResponses[item.id];
    app.innerHTML = `
      <div class="small">${escapeHtml(item.title)}</div>
      <div class="question">${escapeHtml(item.question)}</div>
      <div class="options" id="options">${Object.entries(item.options).map(([k,v]) => optionButton(k,v,existing?.response)).join("")}</div>
      <div id="feedbackArea"></div>`;
    [...document.querySelectorAll(".option-btn")].forEach(btn => {
      btn.addEventListener("click", () => chooseTraining(item, btn.dataset.value));
    });
    if (existing) showTrainingFeedback(item, existing.response);
  }

  function chooseTraining(item, response) {
    if (state.trainingResponses[item.id]) return;
    state.trainingResponses[item.id] = { response, correct: response === item.correct ? 1 : 0 };
    saveState();
    showTrainingFeedback(item, response);
  }

  function showTrainingFeedback(item, response) {
    [...document.querySelectorAll(".option-btn")].forEach(btn => {
      btn.disabled = true;
      btn.classList.toggle("selected", btn.dataset.value === response);
    });
    const isCorrect = response === item.correct;
    const explanation = state.condition === "A" ? item.explanationA : item.explanationB;
    const area = document.getElementById("feedbackArea");
    area.innerHTML = `
      <div class="feedback">
        <div class="feedback-status ${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "Correct." : "Not quite."}</div>
        <div class="key-box"><strong>Best answer:</strong> ${escapeHtml(item.bestAnswer)}</div>
        <div class="key-box"><strong>Key principle:</strong> ${escapeHtml(item.principle)}</div>
        <p>${escapeHtml(explanation)}</p>
        <button class="primary-btn" id="continueTraining">Continue</button>
      </div>`;
    document.getElementById("continueTraining").addEventListener("click", () => {
      state.trainingIndex += 1;
      if (state.trainingIndex >= CONTENT.training.length) state.phase = "mental";
      saveState(); render();
    });
  }

  function renderMentalEffort() {
    setProgress("Learning activity", CONTENT.training.length, CONTENT.training.length);
    app.innerHTML = `
      <h2>Before we continue</h2>
      <p>Thinking about the six learning examples you just completed, how much mental effort did you invest in understanding Nova’s explanations?</p>
      <div class="scale-endpoints"><span>1 = Very, very low mental effort</span><span>9 = Very, very high mental effort</span></div>
      <div class="scale-grid">${Array.from({length:9},(_,i)=>`<button class="scale-btn ${state.mentalEffort===i+1?'selected':''}" data-value="${i+1}">${i+1}</button>`).join("")}</div>
      <button class="primary-btn ${state.mentalEffort ? '' : 'hidden'}" id="mentalContinue">Continue</button>`;
    [...document.querySelectorAll(".scale-btn")].forEach(btn => btn.addEventListener("click", () => {
      state.mentalEffort = Number(btn.dataset.value);
      saveState(); renderMentalEffort();
    }));
    const c = document.getElementById("mentalContinue");
    if (c) c.addEventListener("click", () => {
      if (!state.trainingBackupSent) {
        state.trainingBackupSent = true;
        saveState(); sendBackup("training_complete");
      }
      state.phase = "postintro"; saveState(); render();
    });
  }

  function renderPostIntro() {
    clearProgress();
    app.innerHTML = `
      <h2>New questions</h2>
      <p>You have finished the learning section. I will now show you 12 new academic situations. Choose the best answer based on what you have learned.</p>
      <div class="notice">I will not tell you whether your answers are correct during this section.</div>
      <button class="primary-btn" id="postStart">Continue</button>`;
    document.getElementById("postStart").addEventListener("click", () => {
      state.phase = "posttest"; saveState(); render();
    });
  }

  function renderPosttest() {
    if (state.posttestIndex >= state.posttestOrder.length) {
      state.phase = "estimate"; saveState(); render(); return;
    }
    const id = state.posttestOrder[state.posttestIndex];
    const item = getPosttestItem(id);
    setProgress("New questions", state.posttestIndex + 1, state.posttestOrder.length);
    app.innerHTML = `
      <div class="question">${escapeHtml(item.question)}</div>
      <div class="options">${Object.entries(item.options).map(([k,v]) => optionButton(k,v,null)).join("")}</div>`;
    [...document.querySelectorAll(".option-btn")].forEach(btn => btn.addEventListener("click", () => {
      if (state.posttestResponses[item.id]) return;
      const response = btn.dataset.value;
      state.posttestResponses[item.id] = { response, correct: response === item.correct ? 1 : 0 };
      state.posttestIndex += 1;
      saveState(); render();
    }));
  }

  function renderEstimate() {
    setProgress("Assessment complete", 12, 12);
    app.innerHTML = `
      <h2>One final estimate</h2>
      <p>Out of the 12 new questions you just answered, how many do you think you answered correctly?</p>
      <div class="scale-grid">${Array.from({length:13},(_,i)=>`<button class="scale-btn ${state.estimatedScore===i?'selected':''}" data-value="${i}">${i}</button>`).join("")}</div>
      <button class="primary-btn ${Number.isInteger(state.estimatedScore) ? '' : 'hidden'}" id="estimateContinue">Continue</button>`;
    [...document.querySelectorAll(".scale-btn")].forEach(btn => btn.addEventListener("click", () => {
      state.estimatedScore = Number(btn.dataset.value);
      saveState(); renderEstimate();
    }));
    const c = document.getElementById("estimateContinue");
    if (c) c.addEventListener("click", () => finalizeStudy());
  }

  function finalizeStudy() {
    const payload = buildCorePayload();
    state.finalPayload = payload;
    state.phase = "complete";
    saveState();
    renderComplete();
  }

  function renderComplete() {
    clearProgress();
    const payload = state.finalPayload || buildCorePayload();
    // Re-attempt the redundant final backup whenever a completed local session is reopened.
    // FINAL_BACKUP is de-duplicated by event_id, so this safely improves recovery after an offline/failed POST.
    sendBackup("final");
    const exitUrl = buildExitUrl(payload);
    if (!exitUrl.ok) {
      app.innerHTML = `<h2>Your Nova responses are saved on this device.</h2><div class="error">${escapeHtml(exitUrl.error)}</div><p>Please notify the researcher. Do not repeat the learning activity.</p>`;
      return;
    }
    app.innerHTML = `
      <h2>Nova section complete</h2>
      <p>Your responses are ready to continue to the final survey.</p>
      ${CONFIG.testMode ? '<div class="notice"><strong>Test mode:</strong> the next page is the local payload inspector, not Qualtrics.</div>' : ''}
      <button class="primary-btn" id="exitBtn">Continue to final survey</button>
      <p class="small" id="redirectNote">Automatic redirect in ${CONFIG.autoRedirectSeconds} seconds.</p>`;
    const go = () => window.location.assign(exitUrl.url);
    document.getElementById("exitBtn").addEventListener("click", go);
    if (CONFIG.autoRedirectSeconds > 0) setTimeout(go, CONFIG.autoRedirectSeconds * 1000);
  }

  function buildCorePayload() {
    const p = {
      pid: state.pid,
      condition: state.condition,
      study_version: state.studyVersion,
      nova_complete: 1,
      mental_effort: state.mentalEffort,
      estimated_score: state.estimatedScore
    };
    CONTENT.training.forEach(item => {
      const r = state.trainingResponses[item.id] || {};
      p[`${item.id.toLowerCase()}_resp`] = r.response || "";
      p[`${item.id.toLowerCase()}_correct`] = Number.isInteger(r.correct) ? r.correct : "";
    });
    CONTENT.posttest.forEach(item => {
      const r = state.posttestResponses[item.id] || {};
      p[`${item.id.toLowerCase()}_resp`] = r.response || "";
      p[`${item.id.toLowerCase()}_correct`] = Number.isInteger(r.correct) ? r.correct : "";
    });
    const scored = CONTENT.posttest.map(item => state.posttestResponses[item.id]?.correct ?? 0);
    p.total_transfer = scored.reduce((a,b)=>a+b,0);
    p.conceptual_transfer = CONTENT.posttest.filter(x=>x.type==="conceptual").reduce((s,x)=>s+(state.posttestResponses[x.id]?.correct ?? 0),0);
    p.procedural_transfer = CONTENT.posttest.filter(x=>x.type==="procedural").reduce((s,x)=>s+(state.posttestResponses[x.id]?.correct ?? 0),0);
    p.calibration_bias = Number.isInteger(state.estimatedScore) ? state.estimatedScore - p.total_transfer : "";
    return p;
  }

  function buildExitUrl(payload) {
    try {
      const base = new URL(CONFIG.exitSurveyUrl, window.location.href);
      const qeed = base64UrlEncode(JSON.stringify(payload));
      base.searchParams.set("Q_EED", qeed);
      const url = base.toString();
      if (url.length > CONFIG.maxExitUrlLength) {
        return { ok: false, error: `The final survey link is unexpectedly long (${url.length} characters). Please notify the researcher so the data-passing configuration can be corrected.` };
      }
      return { ok: true, url };
    } catch (_) {
      return { ok: false, error: "The final survey URL is not configured correctly." };
    }
  }

  function base64UrlEncode(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function sendBackup(phase) {
    if (!CONFIG.backupWebAppUrl) return;
    try {
      const snapshot = {
        event_id: `${state.pid}_${phase}_${state.studyVersion}`,
        phase,
        pid: state.pid,
        condition: state.condition,
        study_version: state.studyVersion,
        saved_at_client: new Date().toISOString(),
        data: phase === "final" ? buildCorePayload() : {
          training_responses: state.trainingResponses,
          mental_effort: state.mentalEffort,
          posttest_responses: state.posttestResponses,
          estimated_score: state.estimatedScore
        }
      };
      const form = document.createElement("form");
      form.method = "POST";
      form.action = CONFIG.backupWebAppUrl;
      form.target = "backupFrame";
      form.className = "hidden";
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "payload";
      input.value = JSON.stringify(snapshot);
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      setTimeout(() => form.remove(), 1000);
    } catch (_) {}
  }

  function optionButton(key, value, selected) {
    return `<button class="option-btn ${selected===key?'selected':''}" data-value="${key}"><strong>${key}.</strong> ${escapeHtml(value)}</button>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  }

  function renderFatal(message) {
    clearProgress();
    app.innerHTML = `<h1>Study link problem</h1><div class="error">${escapeHtml(message)}</div><p>Please notify the researcher rather than trying to create a new link yourself.</p>`;
  }
})();
