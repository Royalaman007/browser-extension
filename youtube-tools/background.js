importScripts('defaults.js');

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, (stored) => {
    if (chrome.runtime.lastError) {
      return;
    }

    const defaults = getDefaultConfig();
    const merged = {
      enabled: stored.enabled ?? defaults.enabled,
      currentMode: stored.currentMode ?? defaults.currentMode,
      modeSettings: {
        noDistraction: {
          ...defaults.modeSettings.noDistraction,
          ...(stored.modeSettings?.noDistraction || {})
        },
        focus: {
          ...defaults.modeSettings.focus,
          ...(stored.modeSettings?.focus || {})
        },
        superFocus: {
          ...defaults.modeSettings.superFocus,
          ...(stored.modeSettings?.superFocus || {})
        }
      }
    };

    chrome.storage.sync.set(merged);
  });
});
