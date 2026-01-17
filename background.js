const OPEN_DELAY_MS = 350;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

browser.runtime.onMessage.addListener(async (msg) => {
  if (!msg || msg.type !== "OPEN_JOB_TABS") return;

  const urls = Array.isArray(msg.urls) ? msg.urls : [];
  const deduped = [...new Set(urls)].filter(Boolean);

  for (const url of deduped) {
    try {
      await browser.tabs.create({ url, active: false });
      await sleep(OPEN_DELAY_MS);
    } catch (e) {
      console.warn("Failed to open tab:", url, e);
    }
  }

  return Promise.resolve({ opened: deduped.length });
});

browser.browserAction.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) return;
  try {
    await browser.tabs.sendMessage(tab.id, { type: "COLLECT_AND_OPEN" });
  } catch (e) {
    console.warn("Could not message content script.", e);
  }
});
