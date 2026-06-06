let audioTabs = new Map();

/**
 * Handle messages from content script
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender?.tab?.id;

  if (!tabId) return;

  // ---------------- PLAY ALERT ----------------
  if (msg?.type === "PLAY_ALERT") {
    startAlert(tabId);
  }

  // ---------------- STOP ALERT ----------------
  if (msg?.type === "STOP_ALERT") {
    stopAlert(tabId);
  }

  // Optional response safety
  sendResponse?.({ status: "ok" });
});

/**
 * Start audio alert in content script
 */
function startAlert(tabId) {
  chrome.tabs.sendMessage(
    tabId,
    { type: "START_AUDIO_LOOP" },
    () => {
      if (chrome.runtime.lastError) {
        console.log("[BG] startAlert error:", chrome.runtime.lastError.message);
      }
    }
  );

  // track active tab
  audioTabs.set(tabId, Date.now());

  // auto cleanup after 70 seconds (safety fallback)
  setTimeout(() => {
    stopAlert(tabId);
  }, 70000);
}

/**
 * Stop audio alert
 */
function stopAlert(tabId) {
  chrome.tabs.sendMessage(
    tabId,
    { type: "STOP_AUDIO_LOOP" },
    () => {
      if (chrome.runtime.lastError) {
        console.log("[BG] stopAlert error:", chrome.runtime.lastError.message);
      }
    }
  );

  audioTabs.delete(tabId);
}

/**
 * Clean memory when tab is closed
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  audioTabs.delete(tabId);
});