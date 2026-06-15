const MODE_DESCRIPTIONS = {
  noDistraction: 'Cleaner viewing with Theater Mode enabled by default.',
  focus: 'Reduce doomscrolling by hiding Home feed and Shorts while watching in Theater Mode.',
  superFocus: 'Fully customizable. Tune every feature for a study-tool experience.'
};

const FEATURE_DESCRIPTIONS = {
  theaterMode: 'Automatically opens videos in Theater Mode.',
  hideHomeFeed: 'Removes videos from the YouTube homepage.',
  hideShorts: 'Hides Shorts shelves and blocks the Shorts tab.',
  hideComments: 'Hides the comments section below videos.',
  hideRecommendations: 'Hides recommendation shelves across YouTube.',
  hideRelatedVideos: 'Hides sidebar videos next to the player.',
  hideEndScreens: 'Hides end-screen suggestions during the last seconds.',
  hideTrending: 'Hides Trending/Explore navigation, pages, and suggestions.',
  hideNotificationCount: 'Hides the red notification badge on the bell icon.'
};

const modeTabsEl = document.getElementById('modeTabs');
const featureGridEl = document.getElementById('featureGrid');
const panelTitleEl = document.getElementById('panelTitle');
const panelDescriptionEl = document.getElementById('panelDescription');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const toastEl = document.getElementById('toast');

let config = YT_TOOLS.getDefaultConfig();
let activeMode = 'noDistraction';
let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2400);
}

function renderTabs() {
  modeTabsEl.innerHTML = '';
  YT_TOOLS.MODE_KEYS.forEach((mode) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tab-btn${mode === activeMode ? ' active' : ''}`;
    button.textContent = YT_TOOLS.MODE_LABELS[mode];
    button.addEventListener('click', () => {
      activeMode = mode;
      renderTabs();
      renderFeatureGrid();
    });
    modeTabsEl.appendChild(button);
  });
}

function renderFeatureGrid() {
  panelTitleEl.textContent = `${YT_TOOLS.MODE_LABELS[activeMode]} Settings`;
  panelDescriptionEl.textContent = MODE_DESCRIPTIONS[activeMode];
  featureGridEl.innerHTML = '';

  YT_TOOLS.FEATURE_KEYS.forEach((key) => {
    const card = document.createElement('div');
    card.className = 'feature-card';

    const copy = document.createElement('div');
    copy.className = 'feature-copy';
    copy.innerHTML = `
      <strong>${YT_TOOLS.FEATURE_LABELS[key]}</strong>
      <span>${FEATURE_DESCRIPTIONS[key]}</span>
    `;

    const label = document.createElement('label');
    label.className = 'toggle';
    label.innerHTML = `
      <input type="checkbox" data-feature="${key}" ${config.modeSettings[activeMode][key] ? 'checked' : ''}>
      <span class="slider"></span>
    `;

    card.appendChild(copy);
    card.appendChild(label);
    featureGridEl.appendChild(card);
  });
}

function collectFeatureValues() {
  const values = {};
  featureGridEl.querySelectorAll('input[data-feature]').forEach((input) => {
    values[input.dataset.feature] = input.checked;
  });
  return values;
}

function loadConfig() {
  chrome.storage.sync.get(null, (stored) => {
    config = {
      ...YT_TOOLS.getDefaultConfig(),
      ...stored,
      modeSettings: {
        ...YT_TOOLS.getDefaultConfig().modeSettings,
        ...(stored.modeSettings || {})
      }
    };
    renderTabs();
    renderFeatureGrid();
  });
}

saveBtn.addEventListener('click', () => {
  config.modeSettings[activeMode] = collectFeatureValues();
  chrome.storage.sync.set(config, () => {
    showToast('Settings saved. Refresh open YouTube tabs to apply changes.');
  });
});

resetBtn.addEventListener('click', () => {
  const defaults = YT_TOOLS.getDefaultModeSettings();
  config.modeSettings[activeMode] = { ...defaults[activeMode] };
  chrome.storage.sync.set(config, () => {
    renderFeatureGrid();
    showToast(`${YT_TOOLS.MODE_LABELS[activeMode]} reset to defaults.`);
  });
});

loadConfig();
