const FEATURE_KEYS = [
  'theaterMode',
  'hideHomeFeed',
  'hideShorts',
  'hideComments',
  'hideRecommendations',
  'hideRelatedVideos',
  'hideEndScreens',
  'hideTrending',
  'hideNotificationCount'
];

const FEATURE_LABELS = {
  theaterMode: 'Theater Mode',
  hideHomeFeed: 'Hide Home Feed',
  hideShorts: 'Hide Shorts',
  hideComments: 'Hide Comments',
  hideRecommendations: 'Hide Recommendations',
  hideRelatedVideos: 'Hide Related Videos',
  hideEndScreens: 'Hide End Screens',
  hideTrending: 'Hide Trending / Explore',
  hideNotificationCount: 'Hide Notification Count'
};

const MODE_KEYS = ['noDistraction', 'focus', 'superFocus'];

const MODE_LABELS = {
  noDistraction: 'No Distraction',
  focus: 'Focus',
  superFocus: 'Super Focus'
};

function emptyFeatures() {
  return {
    theaterMode: false,
    hideHomeFeed: false,
    hideShorts: false,
    hideComments: false,
    hideRecommendations: false,
    hideRelatedVideos: false,
    hideEndScreens: false,
    hideTrending: false,
    hideNotificationCount: false
  };
}

function getDefaultModeSettings() {
  return {
    noDistraction: {
      theaterMode: true,
      hideHomeFeed: false,
      hideShorts: false,
      hideComments: false,
      hideRecommendations: false,
      hideRelatedVideos: false,
      hideEndScreens: false,
      hideTrending: false,
      hideNotificationCount: false
    },
    focus: {
      theaterMode: true,
      hideHomeFeed: true,
      hideShorts: true,
      hideComments: false,
      hideRecommendations: false,
      hideRelatedVideos: false,
      hideEndScreens: false,
      hideTrending: false,
      hideNotificationCount: false
    },
    superFocus: {
      theaterMode: true,
      hideHomeFeed: true,
      hideShorts: true,
      hideComments: true,
      hideRecommendations: false,
      hideRelatedVideos: true,
      hideEndScreens: true,
      hideTrending: false,
      hideNotificationCount: true
    }
  };
}

function getDefaultConfig() {
  return {
    enabled: true,
    currentMode: 'noDistraction',
    modeSettings: getDefaultModeSettings()
  };
}

function getActiveFeatures(config) {
  if (!config || !config.enabled) {
    return emptyFeatures();
  }
  const mode = config.currentMode || 'noDistraction';
  const settings = config.modeSettings?.[mode] || getDefaultModeSettings()[mode];
  return { ...emptyFeatures(), ...settings };
}

if (typeof globalThis !== 'undefined') {
  globalThis.YT_TOOLS = {
    FEATURE_KEYS,
    FEATURE_LABELS,
    MODE_KEYS,
    MODE_LABELS,
    emptyFeatures,
    getDefaultModeSettings,
    getDefaultConfig,
    getActiveFeatures
  };
}
