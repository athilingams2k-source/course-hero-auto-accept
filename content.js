(() => {
  if (window.top !== window) return;

  console.log("[CH EXT] content.js injected ✅", location.href);

  // ---------------- SETTINGS ----------------
  let settings = {
    autoAccept: true,
    interval: 3,
    loopAudio: true,
    toast: true
  };

  const store = chrome.storage?.local || chrome.storage?.sync;

  if (!store) {
    console.error("[CH EXT] Chrome storage not available");
    return;
  }

  function safeMerge(data) {
    settings = { ...settings, ...(data || {}) };
  }

  store.get(Object.keys(settings), (data) => {
    safeMerge(data);
    restartInterval();
  });

  chrome.storage?.onChanged?.addListener((changes, areaName) => {
    if (areaName !== "local") return;

    for (const key in changes) {
      settings[key] = changes[key].newValue;
    }

    restartInterval();
  });

  // ---------------- TOAST ----------------
  function showToast(message) {
    try {
      if (!settings?.toast) return;

      const root = document.body || document.documentElement;
      if (!root) return;

      const t = document.createElement("div");
      t.textContent = message;

      Object.assign(t.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#323232",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "8px",
        zIndex: 999999,
        fontSize: "14px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        maxWidth: "320px"
      });

      root.appendChild(t);
      setTimeout(() => t.remove(), 3500);
    } catch (e) {
      console.log("[CH EXT] Toast error:", e);
    }
  }

  // ---------------- AUDIO ----------------
  let audio = null;
  let audioStopTimer = null;
  let audioUnlocked = false;

  document.addEventListener(
    "click",
    () => {
      audioUnlocked = true;
    },
    { once: true }
  );

  function startAudioFor1Minute() {
    if (!settings.loopAudio) return;
    if (!audioUnlocked) return;

    if (!audio) {
      audio = new Audio(chrome.runtime.getURL("audio/question.mp3"));
      audio.loop = true;
    }

    audio.currentTime = 0;

    audio.play().catch(() => {
      console.log("[CH EXT] Audio blocked");
    });

    clearTimeout(audioStopTimer);
    audioStopTimer = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 60000);
  }

  // ---------------- ACCEPT BUTTON ----------------
  const ACCEPT_SELECTOR = 'button[data-testid="accept-button"]';

  function findAcceptButton() {
    const btn = document.querySelector(ACCEPT_SELECTOR);
    if (btn) return btn;

    return Array.from(document.querySelectorAll("button")).find(
      (b) => (b.innerText || "").trim().toLowerCase() === "accept"
    );
  }

  let lastQid = null;

  function getQid() {
    const m = location.pathname.match(/\/qa\/wait\/(\d+)/);
    return m ? m[1] : null;
  }

  function handleNewQuestion() {
    const btn = findAcceptButton();
    if (!btn) return;

    const qid = getQid();

    if (qid && qid === lastQid) return;
    lastQid = qid;

    showToast("New question detected");
    startAudioFor1Minute();

    if (settings.autoAccept) {
      btn.click();
      showToast("Accepted ✅");
    }
  }

  // ---------------- INTERVAL ----------------
  let intervalId;

  function restartInterval() {
    clearInterval(intervalId);

    const ms = Math.max(2000, (Number(settings.interval) || 3) * 1000);

    intervalId = setInterval(() => {
      handleNewQuestion();
    }, ms);
  }

  restartInterval();

  // ---------------- DEBUG SHORTCUT ----------------
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key.toLowerCase() === "q") {
      showToast("Test triggered");
      startAudioFor1Minute();
    }
  });
})();