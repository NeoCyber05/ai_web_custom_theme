# AI Workspace Suite

![license](https://img.shields.io/badge/license-MIT-green)
![userscript](https://img.shields.io/badge/userscript-Tampermonkey-blueviolet)
![platform](https://img.shields.io/badge/platform-ChatGPT%20%7C%20Gemini%20%7C%20Claude-lightgrey)
![i18n](https://img.shields.io/badge/i18n-English%20%7C%20Vietnamese-blue)

A professional suite of two standalone userscripts designed to enhance productivity and UI customization across AI chat platforms (**ChatGPT**, **Google Gemini**, and **Claude**).

---

## Suite Overview

This repository contains two independent scripts. You may install either script individually or both simultaneously based on your workflow needs.

| Script | Supported Platforms | Primary Function |
| :--- | :--- | :--- |
| **AI Theme Custom** | ChatGPT, Gemini | Full UI customization, preset themes, and chat navigation |
| **AI Prompt Deck** | ChatGPT, Gemini, Claude | 1-Click prompt snippet manager and category tool |

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

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or Violentmonkey) in your web browser.
2. Open Tampermonkey Dashboard -> Go to **Utilities** -> Select **Import from file** or click **Create a new script**.
3. Choose the script file to install:
   - For UI Customization: [`AI-Theme-Custom.user.js`](./AI-Theme-Custom.user.js)
   - For Prompt Snippets: [`AI-Prompt-Deck.user.js`](./AI-Prompt-Deck.user.js)
4. Copy the script code, paste it into the editor, and save (`Ctrl + S`).

---

## License

Distributed under the [MIT License](LICENSE).
