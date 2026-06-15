const enabledToggle = document.getElementById('enabledToggle');
const statusText = document.getElementById('statusText');
const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));
const activeFeaturesEl = document.getElementById('activeFeatures');
const settingsBtn = document.getElementById('settingsBtn');

let config = YT_TOOLS.getDefaultConfig();

function renderActiveFeatures() {
  const features = YT_TOOLS.getActiveFeatures(config);
  const enabled = YT_TOOLS.FEATURE_KEYS.filter((key) => features[key]);

  activeFeaturesEl.innerHTML = '';

  if (!config.enabled || enabled.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = config.enabled ? 'No features active for this mode' : 'Extension is disabled';
    activeFeaturesEl.appendChild(li);
    return;
  }

  enabled.forEach((key) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.55 17.05 4.5 12l1.41-1.41 3.64 3.64 8.95-8.95L19.5 6.9 9.55 17.05z"/>
      </svg>
      <span>${YT_TOOLS.FEATURE_LABELS[key]}</span>
    `;
    activeFeaturesEl.appendChild(li);
  });
}

function renderUI() {
  enabledToggle.checked = config.enabled;
  statusText.textContent = config.enabled ? 'Enabled' : 'Disabled';
  statusText.className = `status ${config.enabled ? 'enabled' : 'disabled'}`;

  modeInputs.forEach((input) => {
    input.checked = input.value === config.currentMode;
  });

  renderActiveFeatures();
}

function saveConfig() {
  chrome.storage.sync.set(config, () => {
    renderUI();
  });
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
    renderUI();
  });
}

enabledToggle.addEventListener('change', () => {
  config.enabled = enabledToggle.checked;
  saveConfig();
});

modeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) {
      config.currentMode = input.value;
      saveConfig();
    }
  });
});

settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') {
    return;
  }
  loadConfig();
});

loadConfig();
