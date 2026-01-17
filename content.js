function uniq(arr) {
    return [...new Set(arr)];
  }
  
  function getJkFromString(s) {
    if (!s) return null;
    const m = s.match(/(?:\?|&|#)jk=([a-fA-F0-9]+)/);
    return m ? m[1] : null;
  }
  
  function canonicalIndeedUrl(jk) {
    return `https://www.indeed.com/viewjob?jk=${encodeURIComponent(jk)}`;
  }
  
  function collectIndeedJobKeys() {
    const jks = [];
  
    document.querySelectorAll("[data-jk]").forEach(el => {
      const jk = el.getAttribute("data-jk");
      if (jk) jks.push(jk);
    });
  
    document.querySelectorAll('a[href*="jk="]').forEach(a => {
      const jk = getJkFromString(a.getAttribute("href"));
      if (jk) jks.push(jk);
    });
  
    return uniq(jks);
  }
  
  browser.runtime.onMessage.addListener(async (msg) => {
    if (!msg || msg.type !== "COLLECT_AND_OPEN") return;
  
    const jks = collectIndeedJobKeys();
  
    if (!jks.length) {
      console.warn("No jobs found. Use this on an Indeed search results page.");
      return;
    }
  
    const MAX_TABS = 40;
    const urls = jks.slice(0, MAX_TABS).map(canonicalIndeedUrl);
  
    await browser.runtime.sendMessage({
      type: "OPEN_JOB_TABS",
      urls
    });
  });
  