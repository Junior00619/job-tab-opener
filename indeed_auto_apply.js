(function () {
    const MAX_TRIES = 25;
    const TRY_EVERY_MS = 500;
  
    function isVisible(el) {
      if (!el) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }
  
    function findApplyButton() {
      const elements = Array.from(document.querySelectorAll("button, a"));
  
      for (const el of elements) {
        const text = (el.innerText || "").toLowerCase().trim();
        if (
          text === "apply" ||
          text.includes("apply now") ||
          text.includes("apply on company site") ||
          text.includes("apply on employer site")
        ) {
          if (isVisible(el)) return el;
        }
      }
  
      return null;
    }
  
    async function tryClick() {
      for (let i = 0; i < MAX_TRIES; i++) {
        const btn = findApplyButton();
        if (btn) {
          if (!btn.dataset.clicked) {
            btn.dataset.clicked = "true";
            btn.scrollIntoView({ block: "center" });
            btn.focus();
            btn.click();
          }
          return;
        }
        await new Promise(r => setTimeout(r, TRY_EVERY_MS));
      }
    }
  
    window.addEventListener("load", () => {
      setTimeout(tryClick, 800);
    });
  })();
  