document.addEventListener("DOMContentLoaded", () => {
  const store = chrome.storage.local;

  const autoAccept = document.getElementById("autoAccept");
  const interval = document.getElementById("interval");
  const loopAudio = document.getElementById("loopAudio");
  const toast = document.getElementById("toast");

  const defaults = {
    autoAccept: true,
    interval: 3,
    loopAudio: true,
    toast: true
  };

  // ---------------- LOAD SETTINGS ----------------
  store.get(Object.keys(defaults), (data) => {
    const s = { ...defaults, ...(data || {}) };

    autoAccept.checked = s.autoAccept;
    interval.value = s.interval;
    loopAudio.checked = s.loopAudio;
    toast.checked = s.toast;
  });

  // ---------------- SAVE SETTINGS ----------------
  function save() {
    const val = Number(interval.value);

    store.set({
      autoAccept: autoAccept.checked,
      interval: isFinite(val) ? Math.max(2, val) : 3,
      loopAudio: loopAudio.checked,
      toast: toast.checked
    }, () => {
      notifyContentScript();
    });
  }

  autoAccept.addEventListener("change", save);
  interval.addEventListener("input", save);
  loopAudio.addEventListener("change", save);
  toast.addEventListener("change", save);

  // ---------------- NOTIFY CONTENT SCRIPT ----------------
  function notifyContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs?.[0];
      if (!tab?.id || !tab?.url) return;

      if (!tab.url.includes("coursehero.com")) return;

      // Optional ping (safe, no error spam)
      chrome.tabs.sendMessage(
        tab.id,
        { type: "PING_SETTINGS_UPDATED" },
        () => {
          void chrome.runtime.lastError;
        }
      );
    });
  }
});