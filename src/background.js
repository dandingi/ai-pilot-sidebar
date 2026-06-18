const EMBEDDING_RULE_START_ID = 31000;
const EMBEDDING_RULE_DOMAINS = [
  "chatgpt.com",
  "grok.com",
  "grok.x.ai",
  "x.ai",
  "gemini.google.com",
  "doubao.com",
  "kimi.moonshot.cn",
  "claude.ai",
  "chat.deepseek.com",
  "copilot.microsoft.com"
];

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  const { enableEmbeddingCompat = true } = await chrome.storage.local.get("enableEmbeddingCompat");
  await updateEmbeddingRulesSafely(enableEmbeddingCompat);
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("enableEmbeddingCompat").then(({ enableEmbeddingCompat = true }) => {
    updateEmbeddingRulesSafely(enableEmbeddingCompat);
  });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "toggle-side-panel") {
    await openSidePanelSafely(tab);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "AI_PILOT_SET_EMBEDDING_COMPAT") {
    updateEmbeddingRulesSafely(message.enabled === true)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  return false;
});

async function openSidePanelSafely(tab) {
  try {
    await openSidePanel(tab);
  } catch (error) {
    console.warn("AI Pilot side panel open was skipped:", error);
  }
}

async function openSidePanel(tab) {
  if (tab?.windowId) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    return;
  }

  if (tab?.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
}

async function updateEmbeddingRulesSafely(enabled) {
  try {
    await updateEmbeddingRules(enabled);
  } catch (error) {
    console.warn("AI Pilot embedding compatibility rules were skipped:", error);
  }
}

async function updateEmbeddingRules(enabled) {
  const ruleIds = EMBEDDING_RULE_DOMAINS.map((_, index) => EMBEDDING_RULE_START_ID + index);

  if (!chrome.declarativeNetRequest?.updateDynamicRules) {
    return;
  }

  const addRules = enabled
    ? EMBEDDING_RULE_DOMAINS.map((domain, index) => ({
        id: EMBEDDING_RULE_START_ID + index,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "x-frame-options", operation: "remove" },
            { header: "content-security-policy", operation: "remove" },
            { header: "content-security-policy-report-only", operation: "remove" }
          ]
        },
        condition: {
          requestDomains: [domain],
          resourceTypes: ["sub_frame"]
        }
      }))
    : [];

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds,
    addRules
  });
}
