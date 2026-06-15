# YouTube Tools

A Chrome extension that makes YouTube calmer and more focused with three built-in modes:

- **No Distraction** — Theater Mode
- **Focus** — Theater Mode + Hide Home Feed + Hide Shorts
- **Super Focus** — Fully customizable feature set

## Features

| Feature | What it does |
| --- | --- |
| Theater Mode | Opens videos in YouTube Theater Mode |
| Hide Home Feed | Removes homepage video feed |
| Hide Shorts | Hides Shorts shelves and blocks Shorts pages |
| Hide Comments | Hides the comments section |
| Hide Recommendations | Hides recommendation shelves |
| Hide Related Videos | Hides the sidebar next to the player |
| Hide End Screens | Hides end-screen suggestions |
| Hide Trending | Hides Trending/Explore navigation and pages |
| Hide Notification Count | Hides the red badge on the bell icon |

Settings are stored in `chrome.storage.sync` and persist across browser restarts.

## Installation

1. Download and unzip `youtube-tools-4.0.zip`.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select the unzipped `youtube-tools-4.0` folder.
6. Pin **YouTube Tools** from the extensions menu.
7. Open [YouTube](https://www.youtube.com), click the extension icon, choose a mode, and refresh any open YouTube tabs.

## Usage

### Popup

- Toggle the extension on or off
- Switch between **No Distraction**, **Focus**, and **Super Focus**
- See which features are active for the current mode
- Click the gear icon to open Settings

### Settings

- Customize features for each mode independently
- Click **Save Changes** to persist updates
- Click **Reset Defaults** to restore the original preset for the selected mode

## File Structure

```
youtube-tools-4.0/
├── manifest.json
├── background.js
├── content.js
├── content.css
├── defaults.js
├── popup.html / popup.css / popup.js
├── settings.html / settings.css / settings.js
└── icons/
```

## Notes

- YouTube updates its layout often. If a feature stops working after a YouTube change, update the selectors in `content.css` and `content.js`.
- Theater Mode applies when you open or navigate to a watch page.
- Shorts and Trending pages redirect to the YouTube homepage when those features are enabled.

## License

Personal use. Modify freely for your own setup.
