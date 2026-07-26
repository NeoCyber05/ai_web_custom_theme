# AI Workspace Suite

![license](https://img.shields.io/badge/license-MIT-green)
![userscript](https://img.shields.io/badge/userscript-Tampermonkey-blueviolet)
![platform](https://img.shields.io/badge/platform-ChatGPT%20%7C%20Gemini%20%7C%20Claude-lightgrey)
![i18n](https://img.shields.io/badge/i18n-English%20%7C%20Vietnamese-blue)

A professional suite of two standalone userscripts designed to enhance productivity and UI customization across AI chat platforms (**ChatGPT**, **Google Gemini**, and **Claude**).

---

## Suite Overview

This repository contains two independent scripts. You may install either script individually or both simultaneously based on your workflow needs.

| Script | Supported Platforms | Primary Function | Installation Link |
| :--- | :--- | :--- | :--- |
| **AI Theme Custom** | ChatGPT, Gemini | Full UI customization, preset themes, and chat navigation | [AI-Theme-Custom.user.js](./AI-Theme-Custom.user.js) ([Guide](#installation-guide)) |
| **AI Prompt Deck** | ChatGPT, Gemini, Claude | 1-Click prompt snippet manager and category tool | [AI-Prompt-Deck.user.js](./AI-Prompt-Deck.user.js) ([Guide](#installation-guide)) |

---

## 1. AI Theme Custom

`AI-Theme-Custom.user.js`

An interface customization and navigation engine for ChatGPT and Google Gemini.

### Key Features
- **Multilingual Support (EN / VI)**: Integrated language switcher (`English` / `Tiếng Việt`) available directly inside the Settings Panel.
- **Built-in Presets**: Pre-configured theme library (Cyberpunk Neon ⚡, Sakura Blossom 🌸, Emerald Forest 🌲, Sunset Vaporwave 🌅, Deep Space Neon 🌌, Minimalist Slate 📓, Golden Amber Luxe ⚜️, Nordic Frost Ice ❄️, Dracula Gothic 🧛, Tokyo Midnight 🗼) applicable with one click.
- **Full Visual Control**: Modify display names, avatar icons (SVG, URL, Base64), standing character images, chat bubble colors, border radius, padding, page background images, and input fields.
- **Automatic Matching**: Dynamic theme switching based on Chat Title patterns or URL regular expressions.
- **Navigation Tools**: Fixed/floating message toolbar, searchable jump list, and keyboard shortcuts (`Alt+J`, `Alt+N`).

---

## 2. AI Prompt Deck

`AI-Prompt-Deck.user.js`

A fast prompt snippet manager for ChatGPT, Google Gemini, and Claude.

### Key Features
- **Multilingual Support (EN / VI)**: Quick language toggle (`English` / `Tiếng Việt`).
- **1-Click Prompt Insertion**: Instantly paste pre-written prompt templates directly into the chat input area.
- **Category Organization**: Group prompts by custom categories (e.g., Coding, Writing, Translation, General).
- **Management Modal**: Add, edit, remove, and reorganize custom prompt buttons with an intuitive modal editor.

---

## Installation Guide

Follow these simple steps to install and enable the scripts on your browser:

### Step 1: Install Tampermonkey Extension
Ensure you have a userscript manager extension installed:
- 🌐 [Tampermonkey for Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- 🦊 [Tampermonkey for Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- 🔷 [Tampermonkey for Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

---

### Step 2: Enable Developer Mode (Chromium Browsers)
> **Required for Chrome, Edge, Brave, Opera**:
> 1. Open `chrome://extensions/` (or `edge://extensions/`) in your browser URL bar.
> 2. Enable **Developer Mode** (*Chế độ dành cho nhà phát triển*) toggle at the top right corner.
> 3. Under Tampermonkey options, ensure **Allow access to file URLs** is enabled if working locally.

---

### Step 3: Install the Script

#### Method A: Click the "Raw" button (Recommended)
1. Open the script file you want to install:
   - 🚀 [AI-Theme-Custom.user.js](./AI-Theme-Custom.user.js)
   - ⚡ [AI-Prompt-Deck.user.js](./AI-Prompt-Deck.user.js)
2. On GitHub's file viewer page, click the **`Raw`** button near the top-right of the code viewer.
3. Tampermonkey will automatically detect the script file and open an installation tab.
4. Click **Install** (hoặc **Cài Đặt**) to finish.

#### Method B: Copy Code Manually
If Tampermonkey does not open automatically when clicking Raw:
1. Open the script file link above and click **`Raw`**.
2. Press `Ctrl + A` then `Ctrl + C` to copy all code.
3. Click the **Tampermonkey icon** in your browser toolbar -> Select **Create a new script...** (*Tạo script mới*).
4. Delete any default placeholder code, paste the copied code, and press **`Ctrl + S`** to Save.

---

## How to Use

1. Open your target AI platform:
   - [ChatGPT](https://chatgpt.com)
   - [Google Gemini](https://gemini.google.com)
   - [Claude](https://claude.ai) *(Prompt Deck only)*

2. **AI Theme Custom**:
   - Look for the floating **🎨** button at the bottom-right corner of the page.
   - Click it to open the **Settings Panel**.
   - Click **Preset Themes** to apply themes like *Cyberpunk Neon*, *Sakura Blossom*, or *Emerald Forest*.
   - Click the language button (**English** / **Tiếng Việt**) at the top to toggle languages.

3. **AI Prompt Deck**:
   - Look for the floating **✏️** button at the bottom-left corner of the page.
   - Click it to open the **Quick Prompt Deck**.
   - Click any prompt snippet to automatically insert pre-written text into the chat input area.
   - Click **Thêm Nút Mới / Add New Button** or **Quản Lý / Manage** to create and edit your custom prompts.

---

## License

Distributed under the [MIT License](LICENSE).
