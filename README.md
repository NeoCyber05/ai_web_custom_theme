# AI Web Custom

![license](https://img.shields.io/badge/license-MIT-green)
![userscript](https://img.shields.io/badge/userscript-Tampermonkey-blueviolet)
![platform](https://img.shields.io/badge/platform-ChatGPT%20%7C%20Gemini%20%7C%20Claude-lightgrey)
![i18n](https://img.shields.io/badge/i18n-English%20%7C%20Vietnamese-blue)

A professional suite of two standalone userscripts designed to enhance productivity and UI customization across AI chat platforms (**ChatGPT**, **Google Gemini**, and **Claude**).

---

## Overview

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
- **Multilingual Support (EN / VI)**: Quick language toggle inside the Settings Panel.
- **Visual Theme Library**: Mini-chat color previews for Cyberpunk Neon, Sakura Blossom, Emerald Forest, Sunset Vaporwave, Deep Space Neon, Minimalist Slate, Golden Amber Luxe, Nordic Frost Ice, Dracula Gothic, and Tokyo Midnight.
- **Full Visual Control**: Customize names, avatars, chat bubbles, spacing, backgrounds, and more.
- **Automatic Matching**: Switch themes automatically by chat title or URL pattern.
- **Navigation Tools**: Toolbar, jump list, and shortcuts (`Alt+J`, `Alt+N`).

---

## 2. AI Prompt Deck

`AI-Prompt-Deck.user.js`

A fast prompt snippet manager for ChatGPT, Google Gemini, and Claude.

### Key Features
- **Multilingual Support (EN / VI)**: Quick language toggle.
- **1-Click Prompt Insertion**: Paste prompt templates into the chat input instantly.
- **Category Organization**: Group prompts by custom categories like Coding, Writing, Translation, ...
- **Management Modal**: Add, edit, remove, and reorganize prompt buttons.

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

### Step 3: Install the Script (Cài Đặt Script)

1. Open the script file you want to install:
   - 🚀 [AI-Theme-Custom.user.js](./AI-Theme-Custom.user.js)
   - ⚡ [AI-Prompt-Deck.user.js](./AI-Prompt-Deck.user.js)
2. Copy all code in the file (`Ctrl + A` -> `Ctrl + C`).
3. Click the **Tampermonkey icon** in your browser toolbar -> Select **Create a new script...** (*Tạo script mới*).
4. Paste the code (`Ctrl + V`) and press **`Ctrl + S`** (File -> Save) to save.

---

### Step 4: How to Use

1. Open your target AI platform:
   - [ChatGPT](https://chatgpt.com)
   - [Google Gemini](https://gemini.google.com)
   - [Claude](https://claude.ai) *(Prompt Deck only)*

2. **AI Theme Custom**:
   - Look for the palette icon beside the model/input controls.
   - Click it to open the **Settings Panel**.
   - Open **Preset Themes**, compare the mini-chat color previews, then select a theme card.
   - Click the language button (**English** / **Tiếng Việt**) at the top to toggle languages.

3. **AI Prompt Deck**:
   - Look for the floating **✏️** button at the bottom-left corner of the page.
   - Click it to open the **Quick Prompt Deck**.
   - Click any prompt snippet to automatically insert pre-written text into the chat input area.
   - Click **Thêm Nút Mới / Add New Button** or **Quản Lý / Manage** to create and edit your custom prompts.

---

## License

Distributed under the [MIT License](LICENSE).
