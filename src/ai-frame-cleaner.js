(async function initAiFrameCleaner() {
  if (!(await isEmbeddingCompatEnabled())) return;

  const COOKIE_TEXT_PATTERNS = [
    "接受所有 Cookie",
    "接受所有Cookie",
    "全部拒绝",
    "Cookie 设置",
    "我们使用 Cookie",
    "我们使用Cookie",
    "使用 Cookie",
    "cookie settings",
    "accept all cookies",
    "accept all",
    "reject all",
    "we use cookies",
    "we use cookie"
  ];

  let runCount = 0;

  hideCookieDialogs();

  const observer = new MutationObserver(() => {
    runCount += 1;
    if (runCount > 80) {
      observer.disconnect();
      return;
    }
    window.requestAnimationFrame(hideCookieDialogs);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 30000);

  function hideCookieDialogs() {
    const controls = Array.from(document.querySelectorAll('button, a, [role="button"]'))
      .filter((node) => hasCookieText(node));

    for (const control of controls) {
      const dialog = findSmallestCookieDialog(control);
      if (dialog) hideNode(dialog);
    }

    document.documentElement.style.removeProperty("overflow");
    document.body?.style.removeProperty("overflow");
  }

  function hasCookieText(node) {
    const text = (node.innerText || node.textContent || "").trim();
    const compactText = text.replace(/\s+/g, " ").toLowerCase();
    return COOKIE_TEXT_PATTERNS.some((pattern) => compactText.includes(pattern.toLowerCase()));
  }

  function findSmallestCookieDialog(control) {
    let current = control;
    let best = null;

    while (current && current !== document.body && current !== document.documentElement) {
      if (current instanceof HTMLElement && isCookieDialogCandidate(current)) {
        best = current;
        break;
      }
      current = current.parentElement;
    }

    return best;
  }

  function isCookieDialogCandidate(node) {
    const text = (node.innerText || node.textContent || "").trim();
    const compactText = text.replace(/\s+/g, " ").toLowerCase();
    const hasCookieCopy = COOKIE_TEXT_PATTERNS.some((pattern) => compactText.includes(pattern.toLowerCase()));
    if (!hasCookieCopy) return false;
    if (text.length > 1200) return false;
    if (containsAppSurface(node)) return false;

    const rect = node.getBoundingClientRect();
    const hasModalSize = rect.width >= 260 && rect.height >= 120 && rect.width <= window.innerWidth * 0.98 && rect.height <= window.innerHeight * 0.75;
    if (!hasModalSize) return false;

    return isOverlayLike(node) || hasRoundedDarkCookieStyle(node);
  }

  function isOverlayLike(node) {
    const style = window.getComputedStyle(node);
    const zIndex = Number.parseInt(style.zIndex, 10);
    const rect = node.getBoundingClientRect();
    const coversEnough = rect.width > 220 && rect.height > 80;

    return (
      ["fixed", "sticky", "absolute"].includes(style.position) ||
      (Number.isFinite(zIndex) && zIndex >= 10) ||
      (coversEnough && style.boxShadow !== "none")
    );
  }

  function hasRoundedDarkCookieStyle(node) {
    const style = window.getComputedStyle(node);
    const bg = style.backgroundColor || "";
    const radius = Number.parseFloat(style.borderRadius || "0");
    return radius >= 8 && (bg.includes("0, 0, 0") || bg.includes("rgb(0") || bg.includes("rgba(0"));
  }

  function hideNode(node) {
    node.setAttribute("data-ai-pilot-cookie-hidden", "true");
    node.style.setProperty("display", "none", "important");
    node.style.setProperty("visibility", "hidden", "important");
    node.style.setProperty("pointer-events", "none", "important");
  }

  function containsAppSurface(node) {
    return Boolean(node.querySelector('textarea, input:not([type="hidden"]), [contenteditable="true"], main, nav, form'));
  }

  function isEmbeddingCompatEnabled() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get({ enableEmbeddingCompat: true }, (result) => {
          if (chrome.runtime.lastError) {
            resolve(false);
            return;
          }
          resolve(result.enableEmbeddingCompat === true);
        });
      } catch {
        resolve(false);
      }
    });
  }
})();
