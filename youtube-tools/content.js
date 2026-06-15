(function () {
  const CLASS_MAP = {
    theaterMode: 'yt-tools-theater',
    hideHomeFeed: 'yt-tools-hide-home-feed',
    hideShorts: 'yt-tools-hide-shorts',
    hideComments: 'yt-tools-hide-comments',
    hideRecommendations: 'yt-tools-hide-recommendations',
    hideRelatedVideos: 'yt-tools-hide-related',
    hideEndScreens: 'yt-tools-hide-end-screens',
    hideTrending: 'yt-tools-hide-trending',
    hideNotificationCount: 'yt-tools-hide-notifications'
  };

  let currentFeatures = YT_TOOLS.emptyFeatures();
  let theaterObserver = null;
  let mutationObserver = null;

  function applyBodyClasses(features) {
    const root = document.documentElement;
    YT_TOOLS.FEATURE_KEYS.forEach((key) => {
      const className = CLASS_MAP[key];
      if (className) {
        root.classList.toggle(className, Boolean(features[key]));
      }
    });
  }

  function enableTheaterMode() {
    const flexy = document.querySelector('ytd-watch-flexy');
    if (!flexy) {
      return;
    }

    if (flexy.hasAttribute('theater') || flexy.theater) {
      return;
    }

    const theaterButton =
      document.querySelector('button.ytp-size-button') ||
      document.querySelector('button[aria-label*="Theater"]') ||
      document.querySelector('button[aria-label*="Cinema"]') ||
      document.querySelector('button[aria-label*="theater"]');

    if (theaterButton) {
      theaterButton.click();
      return;
    }

    flexy.setAttribute('theater', '');
    flexy.theater = true;
    flexy.dispatchEvent(new CustomEvent('yt-page-data-updated'));
  }

  function disableTheaterMode() {
    const flexy = document.querySelector('ytd-watch-flexy');
    if (!flexy) {
      return;
    }

    if (!flexy.hasAttribute('theater') && !flexy.theater) {
      return;
    }

    const theaterButton =
      document.querySelector('button.ytp-size-button') ||
      document.querySelector('button[aria-label*="Theater"]') ||
      document.querySelector('button[aria-label*="Cinema"]') ||
      document.querySelector('button[aria-label*="theater"]');

    if (theaterButton) {
      theaterButton.click();
      return;
    }

    flexy.removeAttribute('theater');
    flexy.theater = false;
  }

  function redirectShorts() {
    if (!currentFeatures.hideShorts) {
      return;
    }

    const path = window.location.pathname;
    if (path.startsWith('/shorts')) {
      window.location.replace('https://www.youtube.com/');
    }
  }

  function isExploreNavTarget(link, containerText) {
    const href = link.getAttribute('href') || '';
    const label = (
      link.getAttribute('title') ||
      link.getAttribute('aria-label') ||
      ''
    ).trim().toLowerCase();
    const text = (containerText || '').trim().toLowerCase();

    return (
      /\/feed\/(explore|trending)/.test(href) ||
      /^\/(gaming|news|music|movies)(\/|$)/.test(href) ||
      label === 'explore' ||
      label === 'trending' ||
      label.includes('explore') ||
      text === 'explore' ||
      text === 'trending'
    );
  }

  function markExploreNavigation() {
    const selectors = [
      'ytd-guide-entry-renderer',
      'ytd-mini-guide-entry-renderer',
      'ytd-guide-section-renderer ytd-guide-entry-renderer'
    ];

    document.querySelectorAll(selectors.join(',')).forEach((entry) => {
      const link = entry.querySelector('a[href]');
      if (!link) {
        entry.classList.remove('yt-tools-nav-explore');
        return;
      }

      const isTarget = isExploreNavTarget(link, entry.textContent);
      entry.classList.toggle('yt-tools-nav-explore', currentFeatures.hideTrending && isTarget);
    });
  }

  function redirectTrending() {
    if (!currentFeatures.hideTrending) {
      return;
    }

    const path = window.location.pathname;
    if (
      path === '/feed/trending' ||
      path === '/feed/explore' ||
      path.startsWith('/gaming') ||
      path.startsWith('/news') ||
      path.startsWith('/music') ||
      path.startsWith('/movies')
    ) {
      window.location.replace('https://www.youtube.com/');
    }
  }

  function applyTheaterMode() {
    if (currentFeatures.theaterMode) {
      enableTheaterMode();
    }
  }

  function applyRuntimeFeatures() {
    redirectShorts();
    redirectTrending();
    markExploreNavigation();
    applyTheaterMode();
  }

  function startObservers() {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }

    mutationObserver = new MutationObserver(() => {
      applyRuntimeFeatures();
    });

    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    if (theaterObserver) {
      theaterObserver.disconnect();
    }

    theaterObserver = new MutationObserver(() => {
      if (currentFeatures.theaterMode) {
        enableTheaterMode();
      }
    });

    const observeTarget = document.documentElement;
    theaterObserver.observe(observeTarget, {
      childList: true,
      subtree: true
    });
  }

  function updateFeatures(config) {
    currentFeatures = YT_TOOLS.getActiveFeatures(config);
    applyBodyClasses(currentFeatures);
    applyRuntimeFeatures();
  }

  function loadAndApply() {
    chrome.storage.sync.get(null, (stored) => {
      const config = {
        ...YT_TOOLS.getDefaultConfig(),
        ...stored,
        modeSettings: {
          ...YT_TOOLS.getDefaultConfig().modeSettings,
          ...(stored.modeSettings || {})
        }
      };
      updateFeatures(config);
    });
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') {
      return;
    }

    chrome.storage.sync.get(null, (stored) => {
      const config = {
        ...YT_TOOLS.getDefaultConfig(),
        ...stored,
        modeSettings: {
          ...YT_TOOLS.getDefaultConfig().modeSettings,
          ...(stored.modeSettings || {})
        }
      };
      updateFeatures(config);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndApply);
  } else {
    loadAndApply();
  }

  startObservers();
})();
