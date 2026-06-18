const DEFAULT_AIS = [
  { id: "chatgpt", name: "ChatGPT", icon: "GPT", iconUrl: "assets/icons/chatgpt-official.svg", url: "https://chatgpt.com/", openMode: "iframe", visible: true, builtIn: true },
  { id: "gemini", name: "Google Gemini", icon: "◇", iconUrl: "assets/icons/gemini-official.svg", url: "https://gemini.google.com/", openMode: "iframe", visible: true, builtIn: true },
  { id: "grok", name: "xAI Grok", icon: "X", iconUrl: "assets/icons/grok.svg", url: "https://grok.com/", openMode: "iframe", visible: true, builtIn: true, hintKey: "grokLoginHint" },
  { id: "doubao", name: "豆包", icon: "豆", iconUrl: "assets/icons/doubao-official.png", url: "https://www.doubao.com/", openMode: "iframe", visible: true, builtIn: true },
  { id: "kimi", name: "Kimi", icon: "K", iconUrl: "assets/icons/kimi-official.ico", url: "https://kimi.moonshot.cn/", openMode: "iframe", visible: true, builtIn: true },
  { id: "copilot", name: "Microsoft Copilot", icon: "Co", iconUrl: "assets/icons/copilot-official.ico", url: "https://copilot.microsoft.com/", openMode: "iframe", visible: true, builtIn: true },
  { id: "claude", name: "Anthropic Claude", icon: "C", iconUrl: "assets/icons/claude-official.svg", url: "https://claude.ai/", openMode: "iframe", visible: true, builtIn: true },
  { id: "deepseek", name: "DeepSeek", icon: "DS", iconUrl: "assets/icons/deepseek-official.svg", url: "https://chat.deepseek.com/", openMode: "iframe", visible: true, builtIn: true }
];

const DEFAULT_STATE = {
  aiList: DEFAULT_AIS,
  defaultAiId: "chatgpt",
  rememberLastAi: false,
  lastAiId: "chatgpt",
  currentAiId: "chatgpt",
  isMenuCollapsed: false,
  enableEmbeddingCompat: true
};

const elements = {
  aiRail: document.getElementById("aiRail"),
  aiList: document.getElementById("aiList"),
  railToggle: document.getElementById("railToggle"),
  menuButton: document.getElementById("menuButton"),
  modelPill: document.getElementById("modelPill"),
  modelPillName: document.getElementById("modelPillName"),
  drawerScrim: document.getElementById("drawerScrim"),
  settingsButton: document.getElementById("settingsButton"),
  closeSettingsButton: document.getElementById("closeSettingsButton"),
  settingsPanel: document.getElementById("settingsPanel"),
  aiHint: document.getElementById("aiHint"),
  aiFrame: document.getElementById("aiFrame"),
  fallback: document.getElementById("fallback"),
  fallbackTitle: document.getElementById("fallbackTitle"),
  fallbackText: document.getElementById("fallbackText"),
  promptPreview: document.getElementById("promptPreview"),
  fallbackCopyButton: document.getElementById("fallbackCopyButton"),
  fallbackOpenButton: document.getElementById("fallbackOpenButton"),
  defaultAiSelect: document.getElementById("defaultAiSelect"),
  rememberLastCheckbox: document.getElementById("rememberLastCheckbox"),
  embeddingCompatCheckbox: document.getElementById("embeddingCompatCheckbox"),
  manageList: document.getElementById("manageList"),
  customAiForm: document.getElementById("customAiForm"),
  customAiName: document.getElementById("customAiName"),
  customAiUrl: document.getElementById("customAiUrl"),
  customAiIcon: document.getElementById("customAiIcon"),
  customAiIconUrl: document.getElementById("customAiIconUrl"),
  customAiOpenMode: document.getElementById("customAiOpenMode"),
  toast: document.getElementById("toast")
};

let state = structuredClone(DEFAULT_STATE);
let currentPrompt = "";
let isDrawerOpen = false;

await init();

async function init() {
  ensureRequiredElements();
  localizePage();
  state = await loadState();
  const startupAiId = state.rememberLastAi ? state.lastAiId : state.defaultAiId;
  state.currentAiId = getAiById(startupAiId)?.id || "chatgpt";

  bindEvents();
  setDrawerOpen(false);
  render();
  await syncEmbeddingCompatRules();
  activateAi(state.currentAiId, { skipSave: true });
}

function t(key, substitutions) {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

function localizePage() {
  document.documentElement.lang = chrome.i18n.getUILanguage().startsWith("zh") ? "zh-CN" : "en";
  document.title = t("appName");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
}

function ensureRequiredElements() {
  const missing = Object.entries(elements)
    .filter(([, element]) => !element)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`AI Pilot side panel is missing required elements: ${missing.join(", ")}`);
  }
}

async function loadState() {
  const stored = await chrome.storage.local.get([...Object.keys(DEFAULT_STATE), "hasNormalizedRailV2"]);
  const merged = { ...DEFAULT_STATE, ...stored };
  merged.aiList = mergeAiList(stored.aiList);
  const firstVisibleAi = merged.aiList.find((ai) => ai.visible !== false) || merged.aiList[0];
  if (!getVisibleAiFromList(merged.aiList, merged.defaultAiId)) {
    merged.defaultAiId = firstVisibleAi?.id || "chatgpt";
  }
  if (!getVisibleAiFromList(merged.aiList, merged.lastAiId)) {
    merged.lastAiId = merged.defaultAiId;
  }
  if (!getVisibleAiFromList(merged.aiList, merged.currentAiId)) {
    merged.currentAiId = merged.defaultAiId;
  }
  if (stored.hasNormalizedRailV2 !== true) {
    merged.isMenuCollapsed = false;
    await chrome.storage.local.set({ isMenuCollapsed: false, hasNormalizedRailV2: true });
  }
  await chrome.storage.local.set({
    aiList: merged.aiList,
    defaultAiId: merged.defaultAiId,
    lastAiId: merged.lastAiId,
    currentAiId: merged.currentAiId
  });
  return merged;
}

function mergeAiList(storedList) {
  if (!Array.isArray(storedList)) return structuredClone(DEFAULT_AIS);

  const storedById = new Map(storedList.map((ai) => [ai.id, ai]));
  const builtIns = DEFAULT_AIS.map((defaultAi) => {
    const storedAi = storedById.get(defaultAi.id) || {};
    return {
      ...storedAi,
      ...defaultAi,
      visible: storedAi.visible ?? defaultAi.visible,
      openMode: storedAi.openMode ?? defaultAi.openMode,
      builtIn: true
    };
  });
  const custom = storedList.filter((ai) => ai.id !== "other" && ai.id !== "perplexity" && !DEFAULT_AIS.some((defaultAi) => defaultAi.id === ai.id));
  return [...builtIns, ...custom];
}

async function saveState(patch = {}) {
  state = { ...state, ...patch };
  await chrome.storage.local.set(patch);
}

function bindEvents() {
  elements.menuButton.addEventListener("click", () => setDrawerOpen(true));
  elements.modelPill.addEventListener("click", () => setDrawerOpen(true));
  elements.railToggle.addEventListener("click", () => setDrawerOpen(false));
  elements.drawerScrim.addEventListener("click", () => setDrawerOpen(false));

  elements.settingsButton.addEventListener("click", openSettings);
  elements.closeSettingsButton.addEventListener("click", closeSettings);

  elements.fallbackCopyButton.addEventListener("click", copyCurrentPrompt);
  elements.fallbackOpenButton.addEventListener("click", () => openAi(getCurrentAi(), "tab"));

  elements.defaultAiSelect.addEventListener("change", async (event) => {
    const patch = { defaultAiId: event.target.value };
    if (!state.rememberLastAi) {
      patch.lastAiId = event.target.value;
    }
    await saveState(patch);
    showToast(t("defaultAiUpdated"));
  });

  elements.rememberLastCheckbox.addEventListener("change", async (event) => {
    await saveState({ rememberLastAi: event.target.checked });
    showToast(event.target.checked ? t("rememberLastEnabled") : t("rememberLastDisabled"));
  });

  elements.embeddingCompatCheckbox.addEventListener("change", async (event) => {
    await saveState({ enableEmbeddingCompat: event.target.checked });
    const response = await syncEmbeddingCompatRules();
    showToast(response?.ok ? t("embeddingCompatUpdated") : t("embeddingCompatUpdateFailed"));
  });

  elements.customAiForm.addEventListener("submit", handleAddCustomAi);

}

function render() {
  renderAiList();
  renderSettings();
}

function renderAiList() {
  elements.aiList.textContent = "";
  const visibleAis = state.aiList.filter((ai) => ai.visible !== false);

  visibleAis.forEach((ai) => {
    const button = document.createElement("button");
    button.className = `ai-item${ai.id === state.currentAiId ? " is-active" : ""}`;
    button.type = "button";
    button.title = ai.name;
    button.dataset.id = ai.id;

    const icon = createAiIcon(ai);

    const label = document.createElement("span");
    label.className = "ai-label";
    label.textContent = ai.name;

    button.append(icon, label);
    button.addEventListener("click", async () => {
      await activateAi(ai.id);
      setDrawerOpen(false);
    });
    elements.aiList.appendChild(button);
  });
}

function renderSettings() {
  elements.defaultAiSelect.textContent = "";

  const visibleAis = state.aiList.filter((ai) => ai.visible !== false);
  visibleAis.forEach((ai) => {
    const option = document.createElement("option");
    option.value = ai.id;
    option.textContent = ai.name;
    elements.defaultAiSelect.appendChild(option);
  });

  elements.defaultAiSelect.value = state.defaultAiId;
  elements.rememberLastCheckbox.checked = state.rememberLastAi;
  elements.embeddingCompatCheckbox.checked = state.enableEmbeddingCompat === true;
  renderManageList();
}

function renderManageList() {
  elements.manageList.textContent = "";

  state.aiList.forEach((ai, index) => {
    const row = document.createElement("div");
    row.className = "manage-row";

    const summary = document.createElement("div");
    summary.className = "manage-summary";

    const icon = createAiIcon(ai);

    const name = document.createElement("div");
    name.className = "manage-name";
    name.innerHTML = `<strong>${escapeHtml(ai.name)}</strong><span>${escapeHtml(ai.url)}</span><em>${getAiMeta(ai)}</em>`;
    summary.append(icon, name);

    const controls = document.createElement("div");
    controls.className = "manage-controls";

    const visibleButton = createSmallButton(ai.visible === false ? t("show") : t("hide"), async () => {
      if (ai.visible !== false && state.aiList.filter((item) => item.visible !== false).length <= 1) {
        showToast(t("keepOneVisibleAi"));
        return;
      }
      ai.visible = ai.visible === false;
      await persistAiList();
    });

    const upButton = createSmallButton("↑", async () => {
      if (index === 0) return;
      state.aiList.splice(index, 1);
      state.aiList.splice(index - 1, 0, ai);
      await persistAiList();
    });

    const downButton = createSmallButton("↓", async () => {
      if (index === state.aiList.length - 1) return;
      state.aiList.splice(index, 1);
      state.aiList.splice(index + 1, 0, ai);
      await persistAiList();
    });

    controls.append(visibleButton, upButton, downButton);

    if (!ai.builtIn) {
      controls.append(createSmallButton(t("delete"), async () => {
        state.aiList = state.aiList.filter((item) => item.id !== ai.id);
        await persistAiList();
      }));
    }

    row.append(summary, controls);
    elements.manageList.appendChild(row);
  });
}

async function activateAi(aiId, options = {}) {
  const ai = getAiById(aiId) || getAiById(state.defaultAiId) || state.aiList[0];
  if (!ai) return;

  state.currentAiId = ai.id;
  if (!options.skipSave) {
    await saveState({ currentAiId: ai.id, lastAiId: ai.id });
  }

  elements.modelPillName.textContent = ai.name;
  const aiHint = getAiHint(ai);
  elements.aiHint.textContent = aiHint;
  elements.aiHint.hidden = !aiHint;
  renderAiList();

  if (ai.openMode === "tab" || ai.openMode === "window") {
    showFallback(ai, t("officialSiteFallbackTitle", [ai.name]), t("officialSiteFallbackText"));
    return;
  }

  elements.fallback.hidden = true;
  elements.aiFrame.hidden = false;
  elements.aiFrame.src = options.forceReload ? withCacheBust(ai.url) : ai.url;

  window.setTimeout(() => {
    if (state.currentAiId === ai.id) {
      updatePromptPreview();
    }
  }, 500);
}

function getAiHint(ai) {
  return ai.hintKey ? t(ai.hintKey) : ai.hint || t("cookieLoginHint");
}

function showFallback(ai, title, text) {
  elements.aiFrame.hidden = true;
  elements.fallback.hidden = false;
  elements.fallbackTitle.textContent = title || t("fallbackTitle", [ai.name]);
  elements.fallbackText.textContent = text || t("fallbackText");
  updatePromptPreview();
}

async function syncEmbeddingCompatRules() {
  return chrome.runtime.sendMessage({
    type: "AI_PILOT_SET_EMBEDDING_COMPAT",
    enabled: state.enableEmbeddingCompat === true
  });
}

async function openAi(ai, mode) {
  if (!ai) return;
  if (mode === "window" || ai.openMode === "window") {
    await chrome.windows.create({ url: ai.url, type: "popup", width: 460, height: 760 });
    return;
  }

  await chrome.tabs.create({ url: ai.url });
}

async function handleAddCustomAi(event) {
  event.preventDefault();
  const name = elements.customAiName.value.trim();
  const url = normalizeUrl(elements.customAiUrl.value.trim());
  const icon = elements.customAiIcon.value.trim() || name.slice(0, 2);
  const iconUrl = normalizeUrl(elements.customAiIconUrl.value.trim());
  const openMode = elements.customAiOpenMode.value;

  if (!name || !url) {
    showToast(t("fillNameAndUrl"));
    return;
  }

  if (!isSecureUrl(url) || (iconUrl && !isSecureUrl(iconUrl))) {
    showToast(t("fillHttpsUrl"));
    return;
  }

  const customAi = {
    id: `custom-${Date.now()}`,
    name,
    icon,
    iconUrl,
    url,
    openMode,
    visible: true,
    builtIn: false
  };

  state.aiList = [...state.aiList, customAi];
  await persistAiList();
  elements.customAiForm.reset();
  showToast(t("customAiAdded"));
}

async function persistAiList() {
  const firstVisibleAi = state.aiList.find((ai) => ai.visible !== false) || state.aiList[0];
  const patch = { aiList: state.aiList };

  if (!getVisibleAiFromList(state.aiList, state.defaultAiId)) {
    patch.defaultAiId = firstVisibleAi?.id || "chatgpt";
  }

  if (!getVisibleAiFromList(state.aiList, state.lastAiId)) {
    patch.lastAiId = patch.defaultAiId || state.defaultAiId;
  }

  await saveState(patch);
  render();
  if (!getVisibleAiFromList(state.aiList, state.currentAiId)) {
    await activateAi(firstVisibleAi?.id || state.aiList[0]?.id);
  }
}

async function getActivePageContext() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return {};

  return { title: tab.title, url: tab.url };
}

function buildPrompt(action, context = {}) {
  const title = context.title || "";
  const url = context.url || "";
  const selection = context.selection || "";
  const headings = context.headings ? `\n${t("promptHeadings")}：\n${context.headings}` : "";
  const intro = `${t("promptPageTitle")}：${title}\n${t("promptPageUrl")}：${url}${headings}`;

  if (action === "summarize-selection") {
    return `${intro}\n\n${t("promptSummarizeSelection")}\n\n${selection || t("promptNoSelectionSummarize")} `;
  }

  if (action === "translate-selection") {
    return `${intro}\n\n${t("promptTranslateSelection")}\n\n${selection || t("promptNoSelection")} `;
  }

  if (action === "rewrite-selection") {
    return `${intro}\n\n${t("promptRewriteSelection")}\n\n${selection || t("promptNoSelection")} `;
  }

  if (action === "explain-selection") {
    return `${intro}\n\n${t("promptExplainSelection")}\n\n${selection || t("promptNoSelection")} `;
  }

  return `${intro}\n\n${t("promptSummarizePage")}`;
}

async function copyCurrentPrompt() {
  const prompt = currentPrompt || buildPrompt("summarize-page", await getActivePageContext());
  currentPrompt = prompt;
  updatePromptPreview();

  try {
    await navigator.clipboard.writeText(prompt);
    showToast(t("promptCopied"));
  } catch {
    showToast(t("promptCopyFailed"));
  }
}

function updatePromptPreview() {
  const text = currentPrompt || t("promptPreviewEmpty");
  elements.promptPreview.value = text;
}

function openSettings() {
  setDrawerOpen(false);
  renderSettings();
  elements.settingsPanel.hidden = false;
}

function closeSettings() {
  elements.settingsPanel.hidden = true;
}

function setDrawerOpen(open) {
  isDrawerOpen = open;
  elements.aiRail.classList.toggle("is-open", isDrawerOpen);
  elements.drawerScrim.hidden = !isDrawerOpen;
  elements.menuButton.classList.toggle("is-hidden", isDrawerOpen);
}

function createSmallButton(label, onClick) {
  const button = document.createElement("button");
  button.className = "small-button";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createAiIcon(ai) {
  const icon = document.createElement("span");
  icon.className = "ai-icon";

  if (ai.iconUrl) {
    const img = document.createElement("img");
    img.src = ai.iconUrl;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      icon.textContent = ai.icon || ai.name.slice(0, 2);
      img.remove();
    }, { once: true });
    icon.appendChild(img);
  } else {
    icon.textContent = ai.icon || ai.name.slice(0, 2);
  }

  return icon;
}

function getAiMeta(ai) {
  const modeLabels = {
    iframe: t("metaIframe"),
    tab: t("metaTab"),
    window: t("metaWindow")
  };
  const parts = [modeLabels[ai.openMode] || t("metaIframe")];
  if (ai.visible === false) {
    parts.push(t("metaHidden"));
  }
  if (!ai.builtIn) {
    parts.push(t("metaCustom"));
  }
  return parts.join(" · ");
}

function getCurrentAi() {
  return getAiById(state.currentAiId);
}

function getAiById(id) {
  return state.aiList.find((ai) => ai.id === id);
}

function getAiFromList(aiList, id) {
  return aiList.find((ai) => ai.id === id);
}

function getVisibleAiFromList(aiList, id) {
  const ai = getAiFromList(aiList, id);
  return ai?.visible !== false ? ai : undefined;
}

function withCacheBust(url) {
  const parsed = new URL(url);
  parsed.searchParams.set("_ai_pilot_refresh", Date.now());
  return parsed.toString();
}

function normalizeUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function isSecureUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 1800);
}
