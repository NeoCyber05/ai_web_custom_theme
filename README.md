# AI Workspace Suite

![license](https://img.shields.io/badge/license-MIT-green)
![userscript](https://img.shields.io/badge/userscript-Tampermonkey-blueviolet)
![platform](https://img.shields.io/badge/platform-ChatGPT%20%7C%20Gemini%20%7C%20Claude-lightgrey)
![i18n](https://img.shields.io/badge/i18n-English%20%7C%20Vietnamese-blue)

A professional suite of two standalone userscripts designed to enhance productivity and UI customization across AI chat platforms (**ChatGPT**, **Google Gemini**, and **Claude**).

---

## Suite Overview

This repository contains two independent scripts. You may install either script individually or both simultaneously based on your workflow needs.

| Script | Supported Platforms | Primary Function | Installation |
| :--- | :--- | :--- | :--- |
| **AI Theme Custom** | ChatGPT, Gemini | Full UI customization, preset themes, and chat navigation | [Install AI Theme Custom](./AI-Theme-Custom.user.js) |
| **AI Prompt Deck** | ChatGPT, Gemini, Claude | 1-Click prompt snippet manager and category tool | [Install AI Prompt Deck](./AI-Prompt-Deck.user.js) |

---

## 1. AI Theme Custom

`AI-Theme-Custom.user.js`

An interface customization and navigation engine for ChatGPT and Google Gemini.

### Key Features
- **Multilingual Support (EN / VI)**: Integrated language switcher (`English` / `Tiếng Việt`) available directly inside the Settings Panel.
- **Built-in Presets**: Pre-configured theme library (Cyberpunk Neon, Sakura Blossom, Emerald Forest, Sunset Vaporwave, Deep Space, Minimalist Slate) applicable with one click.
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

1. **Install a Userscript Manager**:
   - Install [Tampermonkey](https://www.tampermonkey.net/) (recommended) or Violentmonkey in your browser.

2. **Enable Required Browser Permissions**:
   > **Important Note for Chromium Browsers (Chrome, Edge, Brave, Opera)**:
   > You must enable **Developer Mode** in your browser (`chrome://extensions/`) and ensure **Allow User Scripts** (or Extension Access to File URLs) is turned ON in Tampermonkey extension settings for userscripts to run properly.

3. **One-Click Installation**:
   - Click the installation link for your desired script:
     - 🚀 [Install AI Theme Custom](./AI-Theme-Custom.user.js)
     - ⚡ [Install AI Prompt Deck](./AI-Prompt-Deck.user.js)
   - Tampermonkey will automatically open the installation page. Click **Install** (or **Reinstall**) to complete setup.

---

## License

Distributed under the [MIT License](LICENSE).
