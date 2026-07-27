// ==UserScript==
// @name         AI Theme Custom
// @version      2.7.0
// @license      MIT
// @description  Full interface customization engine for ChatGPT, Gemini, and Claude (Based on AI-UX-Customizer architecture): Custom themes, preset picker, EN/VI multilingual support, custom avatars & icons, standing images, page background images/colors, and input bar settings button.
// @icon         data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%235985E1'%3E%3Cpath d='M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z'/%3E%3C/svg%3E
// @author       AI Theme Team
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://gemini.google.com/*
// @match        https://bard.google.com/*
// @match        https://share.gemini.google/*
// @match        https://claude.ai/*
// @include      *://chatgpt.com/*
// @include      *://chat.openai.com/*
// @include      *://gemini.google.com/*
// @include      *://bard.google.com/*
// @include      *://share.gemini.google/*
// @include      *://claude.ai/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  const APPID = 'ai-theme-custom';
  const STORAGE_KEY = `${APPID}-config`;
  const PALETTE_ICON_PATH = 'M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z';
  const GEMINI_ANCHOR_SELECTORS = [
    'input-area-v2 .trailing-actions-wrapper',
    '.trailing-actions-wrapper',
    'input-container .input-buttons-wrapper-bottom',
    '.input-area-container .trailing-actions-wrapper'
  ];
  const GEMINI_INPUT_AREA_SELECTORS = [
    'input-area-v2',
    'input-container',
    '.input-area-container'
  ];
  const CHATGPT_ANCHOR_SELECTOR = 'form[data-type="unified-composer"] div[class*="[grid-area:trailing]"]';
  const CHATGPT_INPUT_AREA_SELECTOR = 'form[data-type="unified-composer"]';
  const CHATGPT_CHAT_CONTENT_SELECTOR = ':is(.group\\/turn-messages, div[class*="--thread-content-max-width"].grid)';
  const GEMINI_CHAT_CONTENT_SELECTOR = '.conversation-container';
  const CLAUDE_ANCHOR_SELECTORS = [
    'fieldset:has([data-testid="chat-input"]) div.relative.flex.gap-2.w-full.items-center > div.flex-row',
    'fieldset:has(div.ProseMirror[data-testid="chat-input"]) div.flex-row',
    'fieldset:has([data-testid="chat-input"]) .flex-row'
  ];
  const CLAUDE_INPUT_AREA_SELECTORS = [
    'fieldset:has([data-testid="chat-input"])',
    'fieldset:has(div.ProseMirror[data-testid="chat-input"])'
  ];
  const CLAUDE_CHAT_CONTENT_SELECTOR = ':is([data-testid="conversation-turn-list"], main .mx-auto)';
  const BASE_MESSAGE_SELECTOR = 'user-query, model-response, [data-message-author-role="user"], [data-message-author-role="assistant"], .user-turn, .agent-turn';
  const CLAUDE_MESSAGE_SELECTOR = '[data-testid="user-message"], [data-testid="human-message"], [data-testid="assistant-turn"], [data-testid="assistant-message"]';
  const MESSAGE_SELECTOR = `${BASE_MESSAGE_SELECTOR}, ${CLAUDE_MESSAGE_SELECTOR}`;
  const CSS_VAR_CHAT_MAX_WIDTH = `--${APPID}-chat-content-max-width`;
  const CLASS_MAX_WIDTH_ACTIVE = `${APPID}-max-width-active`;
  const CHAT_MAX_WIDTH_MIN = 30;
  const CHAT_MAX_WIDTH_MAX = 80;
  const IMAGE_QUALITY = 0.85;
  const IMAGE_MAX_WIDTH_BG = 1920;
  const IMAGE_MAX_HEIGHT_STANDING = 1080;
  const IMAGE_MAX_WIDTH_ICON = 512;

  // --- Platform Detection ---
  const PLATFORMS = {
    CHATGPT: 'ChatGPT',
    GEMINI: 'Gemini',
    CLAUDE: 'Claude'
  };

  function detectPlatform() {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return PLATFORMS.CHATGPT;
    if (host.includes('gemini.google.com') || host.includes('bard.google.com') || host.includes('share.gemini.google')) return PLATFORMS.GEMINI;
    if (host.includes('claude.ai')) return PLATFORMS.CLAUDE;
    return null;
  }

  function getInputAreaSelectors() {
    switch (CURRENT_PLATFORM) {
      case PLATFORMS.GEMINI:
        return GEMINI_INPUT_AREA_SELECTORS;
      case PLATFORMS.CLAUDE:
        return CLAUDE_INPUT_AREA_SELECTORS;
      default:
        return [CHATGPT_INPUT_AREA_SELECTOR];
    }
  }

  function getAnchorSelectors() {
    switch (CURRENT_PLATFORM) {
      case PLATFORMS.GEMINI:
        return GEMINI_ANCHOR_SELECTORS;
      case PLATFORMS.CLAUDE:
        return CLAUDE_ANCHOR_SELECTORS;
      default:
        return [CHATGPT_ANCHOR_SELECTOR];
    }
  }

  function getWindowBackgroundSelector() {
    switch (CURRENT_PLATFORM) {
      case PLATFORMS.GEMINI:
        return 'bard-sidenav-content';
      case PLATFORMS.CLAUDE:
        return ':is(main, [data-testid="chat-page"])';
      default:
        return ':is(div[data-scroll-root], div:has(> main#main):not(div[data-scroll-root] *))';
    }
  }

  const CURRENT_PLATFORM = detectPlatform();
  if (!CURRENT_PLATFORM) return;

  // --- i18n Dictionary ---
  const I18N = {
    vi: {
      settings_title: 'Tùy Chỉnh Giao Diện AI',
      applied_theme: 'Giao diện đang áp dụng:',
      presets_btn: 'Giao Diện Có Sẵn',
      theme_editor_btn: 'Trình Chỉnh Sửa Giao Diện',
      json_editor_btn: 'Chỉnh Sửa JSON / Nhập Xuất',
      icon_size: 'Kích thước ảnh đại diện (px):',
      chat_max_width: 'Chiều rộng tối đa khung trò chuyện (vw):',
      chat_max_width_default: 'Mặc định trang web',
      lang_switch: 'English',

      editor_title: 'Quản Lý & Chỉnh Sửa Giao Diện',
      select_theme: 'Chọn giao diện:',
      new_theme: 'Giao diện mới',
      delete_theme: 'Xóa',
      rename_theme: 'Đổi tên:',
      title_patterns: 'Biểu thức chính quy khớp tiêu đề trò chuyện:',

      assistant_sec: 'Trợ lý AI',
      user_sec: 'Người dùng',
      window_sec: 'Nền trang',
      input_sec: 'Khung nhập liệu',

      field_name: 'Tên hiển thị:',
      field_icon: 'Biểu tượng (URL / SVG / Base64):',
      field_standing_img: 'Ảnh đứng nhân vật (URL):',
      field_text_color: 'Màu chữ:',
      field_bubble_bg: 'Màu nền bong bóng chat:',

      window_bg_color: 'Màu nền trang:',
      window_bg_image: 'Ảnh nền trang (URL hoặc chọn từ máy):',
      window_bg_size: 'Kiểu co giãn (phủ, vừa khung...):',
      pick_image: 'Chọn ảnh',
      pick_image_processing: 'Đang xử lý ảnh...',
      pick_image_done: 'Đã chọn ảnh',
      pick_image_failed: 'Không thể xử lý ảnh',

      input_bg_color: 'Màu nền khung nhập:',
      input_text_color: 'Màu chữ khung nhập:',

      save: 'Lưu',
      close: 'Đóng',
      reset: 'Khôi phục mặc định',
      preset_modal_title: 'Thư Viện Giao Diện Có Sẵn',
      preset_modal_subtitle: '{count} giao diện · Xem trước mini',
      select_preset: '⚡ Chọn giao diện',
      preset_applied: 'Đã áp dụng giao diện thành công!',
      active_theme: 'Đang dùng',
      restore_native: 'Khôi phục giao diện gốc',
      preset_preview_assistant: 'AI · Xem trước giao diện',
      preset_preview_user: 'Bạn · Trông ổn đấy',
      default_theme: 'Mặc định',
      default_theme_option: 'Giao diện mặc định',
      theme_name_fallback: 'Giao diện {n}',
      json_syntax_error: 'Lỗi cú pháp JSON: {message}',
      aria_settings: 'Tùy chỉnh giao diện AI'
    },
    en: {
      settings_title: 'AI Theme Custom',
      applied_theme: 'Applied Theme:',
      presets_btn: 'Preset Themes',
      theme_editor_btn: 'Theme Editor',
      json_editor_btn: 'JSON Editor / Import Export',
      icon_size: 'Avatar Icon Size (px):',
      chat_max_width: 'Chat Content Max Width (vw):',
      chat_max_width_default: 'Website default',
      lang_switch: 'Tiếng Việt',

      editor_title: 'Theme Manager & Editor',
      select_theme: 'Select Theme:',
      new_theme: 'New Theme',
      delete_theme: 'Delete',
      rename_theme: 'Rename:',
      title_patterns: 'Chat Title Matching Regex:',

      assistant_sec: 'AI Assistant',
      user_sec: 'User',
      window_sec: 'Window Background',
      input_sec: 'Input Area',

      field_name: 'Display Name:',
      field_icon: 'Icon (URL / SVG / Base64):',
      field_standing_img: 'Standing Character Image (URL):',
      field_text_color: 'Text Color:',
      field_bubble_bg: 'Bubble Background Color:',

      window_bg_color: 'Page Background Color:',
      window_bg_image: 'Page background image (URL or pick from device):',
      window_bg_size: 'Background size (cover, contain...):',
      pick_image: 'Pick image',
      pick_image_processing: 'Processing image...',
      pick_image_done: 'Image selected',
      pick_image_failed: 'Could not process image',

      input_bg_color: 'Input Background Color:',
      input_text_color: 'Input Text Color:',

      save: 'Save',
      close: 'Close',
      reset: 'Reset Defaults',
      preset_modal_title: 'Built-in Preset Themes Library',
      preset_modal_subtitle: '{count} themes · Mini chat preview',
      select_preset: '⚡ Select Theme',
      preset_applied: 'Theme successfully applied!',
      active_theme: 'Active',
      restore_native: 'Restore website appearance',
      preset_preview_assistant: 'AI · Theme preview',
      preset_preview_user: 'User · Looks good',
      default_theme: 'Default',
      default_theme_option: 'Default Theme',
      theme_name_fallback: 'Theme {n}',
      json_syntax_error: 'Syntax Error JSON: {message}',
      aria_settings: 'AI Theme Custom'
    }
  };

  let currentLang = 'vi';
  function t(key, vars) {
    let str = I18N[currentLang]?.[key] ?? I18N.en?.[key] ?? key;
    if (vars && typeof vars === 'object') {
      for (const [name, value] of Object.entries(vars)) {
        str = str.replaceAll(`{${name}}`, String(value));
      }
    }
    return str;
  }

  // --- SVG Data URI Converter (Matching AI-UX-Customizer svgToDataUrl) ---
  function svgToDataUrl(svg) {
    if (!svg || typeof svg !== 'string') return null;
    const sanitizedSvg = svg.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const encodedSvg = encodeURIComponent(sanitizedSvg).replaceAll("'", '%27').replaceAll('"', '%22');
    return `data:image/svg+xml,${encodedSvg}`;
  }

  function getFormattedIconUrl(iconStr, defaultSvgStr) {
    const fallbackUrl = svgToDataUrl(defaultSvgStr);
    if (!iconStr || typeof iconStr !== 'string' || iconStr.trim() === '') return fallbackUrl;
    let str = iconStr.trim();
    if (str.startsWith('<svg') || str.includes('<svg')) {
      str = str.replace(/%23([0-9a-fA-F]{3,8})/g, '#$1');
      return svgToDataUrl(str) || fallbackUrl;
    }
    if (str.startsWith('data:image/') || str.startsWith('http://') || str.startsWith('https://') || str.startsWith('blob:')) {
      return str;
    }
    return fallbackUrl;
  }

  async function imageFileToDataUrl(file, { maxWidth, maxHeight, quality = IMAGE_QUALITY } = {}) {
    if (!(file instanceof Blob)) throw new Error('Invalid image file');

    const readOriginalDataUrl = () => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

    const loadImageSource = async () => {
      if (typeof createImageBitmap === 'function') {
        return createImageBitmap(file);
      }
      const objectUrl = URL.createObjectURL(file);
      try {
        return await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Failed to decode image file'));
          image.src = objectUrl;
        });
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    const source = await loadImageSource();
    let width = source.width;
    let height = source.height;
    const needsResize = (maxWidth && width > maxWidth) || (maxHeight && height > maxHeight);
    const isWebP = file.type === 'image/webp';

    if (isWebP && !needsResize) {
      if (typeof source.close === 'function') source.close();
      return readOriginalDataUrl();
    }

    if (needsResize) {
      const ratio = width / height;
      if (maxWidth && width > maxWidth) {
        width = maxWidth;
        height = width / ratio;
      }
      if (maxHeight && height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable');
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    if (typeof source.close === 'function') source.close();
    return canvas.toDataURL('image/webp', quality);
  }

  function pickLocalImageFile({ maxWidth, maxHeight, onSelected, onError }) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      fileInput.remove();
      if (!file) return;
      try {
        showToast(t('pick_image_processing'));
        const dataUrl = await imageFileToDataUrl(file, { maxWidth, maxHeight });
        onSelected(dataUrl);
        showToast(t('pick_image_done'));
      } catch (error) {
        console.error(`[${APPID}] Image pick failed:`, error);
        if (typeof onError === 'function') onError(error);
        else showToast(t('pick_image_failed'));
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
  }

  // --- DOM Builders ---
  const SVG_TAGS = new Set(['svg', 'path', 'circle', 'rect', 'g', 'line', 'text', 'use', 'defs']);

  function h(tag, props = {}, children = []) {
    const el = SVG_TAGS.has(tag)
      ? document.createElementNS('http://www.w3.org/2000/svg', tag)
      : document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'style' && typeof value === 'string') el.style.cssText = value;
      else if (key.startsWith('on') && typeof value === 'function') el[key] = value;
      else if (key === 'text') el.textContent = String(value);
      else if (key === 'className') el.className = String(value);
      else if (key === 'dataset' && typeof value === 'object') {
        for (const [dataKey, dataVal] of Object.entries(value)) {
          el.dataset[dataKey] = dataVal;
        }
      } else if (key === 'value' || key === 'checked' || key === 'selected' || key === 'disabled') {
        el[key] = value;
      } else {
        el.setAttribute(key, value === true ? '' : String(value));
      }
    }
    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  }

  function mount(host, ...nodes) {
    host.replaceChildren(...nodes);
    return host;
  }

  function queryFirstElement(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el instanceof HTMLElement) return el;
    }
    return null;
  }

  // --- Theme Preview & CSS Helpers ---
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  function sanitizePreviewColor(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const color = value.trim();
    const isHex = /^#[0-9a-f]{3,8}$/i.test(color);
    const isFunctional = /^(?:rgb|hsl)a?\(\s*[-\d.%\s,]+\)$/i.test(color);
    return isHex || isFunctional || color === 'transparent' ? color : fallback;
  }

  function getPresetPreviewPalette(preset) {
    const assistant = preset?.assistant || {};
    const user = preset?.user || {};
    return {
      window: sanitizePreviewColor(preset?.window?.backgroundColor, '#202124'),
      input: sanitizePreviewColor(preset?.inputArea?.backgroundColor, '#303134'),
      assistantText: sanitizePreviewColor(assistant.textColor, '#e8eaed'),
      assistantBubble: sanitizePreviewColor(assistant.bubbleBackgroundColor, '#303134'),
      userText: sanitizePreviewColor(user.textColor, '#e8eaed'),
      userBubble: sanitizePreviewColor(user.bubbleBackgroundColor, '#3c4043')
    };
  }

  function buildBubbleThemeCss(actor) {
    if (!actor || typeof actor !== 'object') return '';
    const declarations = [];
    if (actor.textColor) declarations.push(`color: ${actor.textColor} !important;`);
    if (actor.bubbleBackgroundColor) declarations.push(`background-color: ${actor.bubbleBackgroundColor} !important;`);
    if (actor.font) declarations.push(`font-family: ${actor.font} !important;`);
    if (Number.isFinite(actor.bubblePadding)) declarations.push(`padding: ${actor.bubblePadding}px !important;`);
    if (Number.isFinite(actor.bubbleBorderRadius)) declarations.push(`border-radius: ${actor.bubbleBorderRadius}px !important;`);
    if (Number.isFinite(actor.bubbleMaxWidth)) declarations.push(`max-width: ${actor.bubbleMaxWidth}% !important;`);
    if (actor.textColor && actor.bubbleBackgroundColor) {
      declarations.push(`border: 1px solid color-mix(in srgb, ${actor.textColor} 24%, transparent) !important;`);
    }
    return declarations.join('\n        ');
  }

  function buildInputThemeCss(platform, inputArea, userFont) {
    const selectors = platform === PLATFORMS.GEMINI
      ? {
          background: 'input-area-v2',
          text: 'rich-textarea .ql-editor'
        }
      : platform === PLATFORMS.CLAUDE
        ? {
            background: 'fieldset:has([data-testid="chat-input"])',
            text: 'div.ProseMirror[data-testid="chat-input"]'
          }
        : {
            background: 'form[data-type="unified-composer"] div[style*="border-radius"]',
            text: 'div.ProseMirror#prompt-textarea'
          };
    const declarations = [];
    if (inputArea?.backgroundColor) {
      declarations.push(`${selectors.background} { background-color: ${inputArea.backgroundColor} !important; }`);
      declarations.push(`${selectors.text} { background-color: transparent !important; }`);
    }
    if (inputArea?.textColor) {
      declarations.push(`${selectors.text} { color: ${inputArea.textColor} !important; }`);
    }
    if (userFont) {
      declarations.push(`${selectors.text} { font-family: ${userFont} !important; }`);
    }
    return declarations.join('\n');
  }
  function renderPresetCard(preset, index, activePresetId, labels) {
    const palette = getPresetPreviewPalette(preset);
    const isNative = preset.id === 'preset-native-default';
    const isActive = preset.id === activePresetId;
    const name = preset.name || t('theme_name_fallback', { n: index + 1 });
    const actionLabel = isNative ? labels.restore : labels.apply;

    return h('button', {
      type: 'button',
      className: `${APPID}-select-preset${isActive ? ' is-active' : ''}`,
      dataset: { idx: String(index) },
      'aria-pressed': isActive ? 'true' : 'false'
    }, [
      h('span', { className: `${APPID}-preset-preview`, style: `background:${palette.window};` }, [
        h('span', { className: `${APPID}-preset-heading` }, [
          h('strong', { text: name }),
          isActive ? h('span', { className: `${APPID}-active-badge`, text: labels.active }) : null
        ]),
        h('span', { className: `${APPID}-palette` }, [
          h('i', { className: `${APPID}-palette-dot`, style: `background:${palette.window};` }),
          h('i', { className: `${APPID}-palette-dot`, style: `background:${palette.assistantText};` }),
          h('i', { className: `${APPID}-palette-dot`, style: `background:${palette.userText};` })
        ]),
        h('span', {
          className: `${APPID}-preview-assistant`,
          style: `color:${palette.assistantText};background:${palette.assistantBubble};`,
          text: labels.previewAssistant
        }),
        h('span', {
          className: `${APPID}-preview-user`,
          style: `color:${palette.userText};background:${palette.userBubble};`,
          text: labels.previewUser
        }),
        h('span', {
          className: `${APPID}-preview-input`,
          style: `background:${palette.input};`
        })
      ]),
      h('span', { className: `${APPID}-preset-action`, text: actionLabel })
    ]);
  }

  // --- Built-in Presets ---
  const BUILTIN_PRESETS = [
    {
      id: 'preset-native-default',
      name: '🌐 Giao diện gốc',
      matchPatterns: [],
      urlPatterns: [],
      assistant: { name: null, icon: null, standingImageUrl: null, textColor: null, font: null, bubbleBackgroundColor: null, bubblePadding: null, bubbleBorderRadius: null, bubbleMaxWidth: null },
      user: { name: null, icon: null, standingImageUrl: null, textColor: null, font: null, bubbleBackgroundColor: null, bubblePadding: null, bubbleBorderRadius: null, bubbleMaxWidth: null },
      window: { backgroundColor: null, backgroundImageUrl: null },
      inputArea: { backgroundColor: null, textColor: null }
    },
    {
      id: 'preset-cyberpunk-neon',
      name: 'Cyberpunk Neon ⚡',
      matchPatterns: ['/\\[cyberpunk\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Cyber AI', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2362f6e8"><path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4Zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6Z"/></svg>`, standingImageUrl: null, textColor: '#62f6e8', font: "'Cascadia Code', 'Fira Code', monospace", bubbleBackgroundColor: 'rgba(8, 21, 32, 0.94)', bubblePadding: 12, bubbleBorderRadius: 14, bubbleMaxWidth: 92 },
      user: { name: 'NetRunner', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff8bd5"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#ff8bd5', font: "'Cascadia Code', 'Fira Code', monospace", bubbleBackgroundColor: 'rgba(43, 12, 42, 0.94)', bubblePadding: 12, bubbleBorderRadius: 14, bubbleMaxWidth: 82 },
      window: { backgroundColor: '#070812', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#111426', textColor: '#dffcff' }
    },
    {
      id: 'preset-sakura-blossom',
      name: 'Sakura Blossom 🌸',
      matchPatterns: ['/\\[sakura\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Sakura AI', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffb3c7"><path d="M12 3c1.5-2 5-1 5 2 3-1 5.5 2 3.5 4.5 2.5 1.5 1.5 5-1.5 5.5.5 3-3 4.5-5 2.5-2 2.5-5.5.5-5-2.5-3-.5-4-4-1.5-5.5C4.5 7 7 4 10 5c0-1 .7-1.7 2-2Zm0 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>`, standingImageUrl: null, textColor: '#ffe5ed', font: "'Segoe UI', 'Quicksand', sans-serif", bubbleBackgroundColor: 'rgba(56, 35, 46, 0.94)', bubblePadding: 11, bubbleBorderRadius: 18, bubbleMaxWidth: 90 },
      user: { name: 'Traveler', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffd2df"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#ffd2df', font: "'Segoe UI', 'Quicksand', sans-serif", bubbleBackgroundColor: 'rgba(74, 41, 56, 0.94)', bubblePadding: 11, bubbleBorderRadius: 18, bubbleMaxWidth: 80 },
      window: { backgroundColor: '#1b1117', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#2a1a22', textColor: '#fff1f5' }
    },
    {
      id: 'preset-emerald-forest',
      name: 'Emerald Forest 🌲',
      matchPatterns: ['/\\[emerald\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Forest Spirit', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%237ee2a8"><path d="m12 2-5 7h3l-5 7h5v6h4v-6h5l-5-7h3l-5-7Z"/></svg>`, standingImageUrl: null, textColor: '#b7f7cf', font: "'Segoe UI', system-ui, sans-serif", bubbleBackgroundColor: 'rgba(18, 53, 34, 0.94)', bubblePadding: 11, bubbleBorderRadius: 14, bubbleMaxWidth: 91 },
      user: { name: 'Ranger', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a7f3d0"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#a7f3d0', font: "'Segoe UI', system-ui, sans-serif", bubbleBackgroundColor: 'rgba(25, 69, 45, 0.94)', bubblePadding: 11, bubbleBorderRadius: 14, bubbleMaxWidth: 81 },
      window: { backgroundColor: '#08150f', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#10261a', textColor: '#e7fff0' }
    },
    {
      id: 'preset-sunset-vaporwave',
      name: 'Sunset Vaporwave 🌅',
      matchPatterns: ['/\\[sunset\\]/i', '/\\[vaporwave\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Synthwave AI', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffd18a"><path d="M3 17h18v2H3v-2Zm2-3h14l-2-3-2 2-3-5-3 5-2-2-2 3Z"/></svg>`, standingImageUrl: null, textColor: '#ffd18a', font: "'Trebuchet MS', 'Outfit', sans-serif", bubbleBackgroundColor: 'rgba(60, 29, 79, 0.94)', bubblePadding: 12, bubbleBorderRadius: 17, bubbleMaxWidth: 91 },
      user: { name: 'Dreamer', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff9ebd"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#ff9ebd', font: "'Trebuchet MS', 'Outfit', sans-serif", bubbleBackgroundColor: 'rgba(84, 32, 62, 0.94)', bubblePadding: 12, bubbleBorderRadius: 17, bubbleMaxWidth: 81 },
      window: { backgroundColor: '#160b25', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#27113c', textColor: '#fff1d8' }
    },
    {
      id: 'preset-deep-space',
      name: 'Deep Space Neon 🌌',
      matchPatterns: ['/\\[space\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Cosmos Core', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2382e9ff"><path d="M12 2 9.8 8.8 3 11l6.8 2.2L12 20l2.2-6.8L21 11l-6.8-2.2L12 2Z"/></svg>`, standingImageUrl: null, textColor: '#82e9ff', font: "'Segoe UI', system-ui, sans-serif", bubbleBackgroundColor: 'rgba(13, 41, 66, 0.94)', bubblePadding: 11, bubbleBorderRadius: 15, bubbleMaxWidth: 92 },
      user: { name: 'Astronaut', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23c4b5fd"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#c4b5fd', font: "'Segoe UI', system-ui, sans-serif", bubbleBackgroundColor: 'rgba(32, 35, 74, 0.94)', bubblePadding: 11, bubbleBorderRadius: 15, bubbleMaxWidth: 82 },
      window: { backgroundColor: '#030914', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#0b1b30', textColor: '#e6faff' }
    },
    {
      id: 'preset-minimalist-slate',
      name: 'Minimalist Slate 📓',
      matchPatterns: ['/\\[slate\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Assistant', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f1f5f9"><path d="M4 4h16v16H4V4Zm4 4v2h8V8H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z"/></svg>`, standingImageUrl: null, textColor: '#f1f5f9', font: "system-ui, -apple-system, 'Segoe UI', sans-serif", bubbleBackgroundColor: 'rgba(30, 41, 59, 0.96)', bubblePadding: 10, bubbleBorderRadius: 10, bubbleMaxWidth: 92 },
      user: { name: 'You', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e2e8f0"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#e2e8f0', font: "system-ui, -apple-system, 'Segoe UI', sans-serif", bubbleBackgroundColor: 'rgba(51, 65, 85, 0.96)', bubblePadding: 10, bubbleBorderRadius: 10, bubbleMaxWidth: 82 },
      window: { backgroundColor: '#0f172a', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#1e293b', textColor: '#f8fafc' }
    },
    {
      id: 'preset-golden-luxe',
      name: 'Golden Amber Luxe ⚜️',
      matchPatterns: ['/\\[gold\\]/i', '/\\[luxe\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Royal Oracle', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffe29a"><path d="M5 16 3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5Zm0 2h14v2H5v-2Z"/></svg>`, standingImageUrl: null, textColor: '#ffe29a', font: "Georgia, 'Times New Roman', serif", bubbleBackgroundColor: 'rgba(53, 38, 15, 0.96)', bubblePadding: 12, bubbleBorderRadius: 13, bubbleMaxWidth: 90 },
      user: { name: 'Sovereign', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffd07a"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#ffd07a', font: "Georgia, 'Times New Roman', serif", bubbleBackgroundColor: 'rgba(71, 49, 19, 0.96)', bubblePadding: 12, bubbleBorderRadius: 13, bubbleMaxWidth: 80 },
      window: { backgroundColor: '#100c08', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#231b10', textColor: '#fff6dc' }
    },
    {
      id: 'preset-nordic-frost',
      name: 'Nordic Frost Ice ❄️',
      matchPatterns: ['/\\[frost\\]/i', '/\\[ice\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Frost AI', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d9f5ff"><path d="M11 2h2v7l5-5 2 2-5 5h7v2h-7l5 5-2 2-5-5v7h-2v-7l-5 5-2-2 5-5H2v-2h7L4 6l2-2 5 5V2Z"/></svg>`, standingImageUrl: null, textColor: '#d9f5ff', font: "'Segoe UI', system-ui, sans-serif", bubbleBackgroundColor: 'rgba(18, 48, 77, 0.95)', bubblePadding: 11, bubbleBorderRadius: 16, bubbleMaxWidth: 91 },
      user: { name: 'Explorer', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23bae6fd"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#bae6fd', font: "'Segoe UI', system-ui, sans-serif", bubbleBackgroundColor: 'rgba(27, 66, 101, 0.95)', bubblePadding: 11, bubbleBorderRadius: 16, bubbleMaxWidth: 81 },
      window: { backgroundColor: '#07111f', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#10233b', textColor: '#effbff' }
    },
    {
      id: 'preset-dracula-gothic',
      name: 'Dracula Gothic 🧛',
      matchPatterns: ['/\\[dracula\\]/i', '/\\[gothic\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Vampire Lord', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f5c2e7"><path d="M3 4h6l3 4 3-4h6l-3 16-6-5-6 5L3 4Z"/></svg>`, standingImageUrl: null, textColor: '#f5c2e7', font: "'Cascadia Code', 'Fira Code', monospace", bubbleBackgroundColor: 'rgba(50, 29, 69, 0.96)', bubblePadding: 11, bubbleBorderRadius: 13, bubbleMaxWidth: 91 },
      user: { name: 'Hunter', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffb3c7"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#ffb3c7', font: "'Cascadia Code', 'Fira Code', monospace", bubbleBackgroundColor: 'rgba(72, 32, 57, 0.96)', bubblePadding: 11, bubbleBorderRadius: 13, bubbleMaxWidth: 81 },
      window: { backgroundColor: '#100b1a', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#1f1630', textColor: '#f8eaff' }
    },
    {
      id: 'preset-tokyo-midnight',
      name: 'Tokyo Midnight 🗼',
      matchPatterns: ['/\\[tokyo\\]/i', '/\\[midnight\\]/i'],
      urlPatterns: [],
      assistant: { name: 'Neon AI', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2367e8f9"><path d="m12 2 3 7h5l-4 4 2 9-6-4-6 4 2-9-4-4h5l3-7Z"/></svg>`, standingImageUrl: null, textColor: '#67e8f9', font: "'Segoe UI', 'Outfit', sans-serif", bubbleBackgroundColor: 'rgba(16, 42, 58, 0.96)', bubblePadding: 11, bubbleBorderRadius: 15, bubbleMaxWidth: 92 },
      user: { name: 'Cyber Citizen', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fda4af"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-8 2.8-8 5v3h16v-3c0-2.2-2.5-5-8-5Z"/></svg>`, standingImageUrl: null, textColor: '#fda4af', font: "'Segoe UI', 'Outfit', sans-serif", bubbleBackgroundColor: 'rgba(55, 24, 45, 0.96)', bubblePadding: 11, bubbleBorderRadius: 15, bubbleMaxWidth: 82 },
      window: { backgroundColor: '#060914', backgroundImageUrl: null },
      inputArea: { backgroundColor: '#11182a', textColor: '#edfaff' }
    }
  ];

  // --- Configuration Store ---
  function getDefaultConfig() {
    return {
      language: 'vi',
      options: { icon_size: 42, chat_content_max_width: null },
      defaultSet: JSON.parse(JSON.stringify(BUILTIN_PRESETS[1])),
      themeSets: []
    };
  }

  let config = getDefaultConfig();

  async function loadConfig() {
    try {
      let stored = null;
      if (typeof GM !== 'undefined' && GM.getValue) stored = await GM.getValue(STORAGE_KEY, null);
      else if (typeof GM_getValue !== 'undefined') stored = GM_getValue(STORAGE_KEY, null);
      else stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
        config = Object.assign(getDefaultConfig(), parsed);
        if (config.language) currentLang = config.language;
      }
    } catch (e) { console.warn(`[${APPID}] Load config error:`, e); }
  }

  async function saveConfig() {
    try {
      config.language = currentLang;
      const str = JSON.stringify(config);
      if (typeof GM !== 'undefined' && GM.setValue) await GM.setValue(STORAGE_KEY, str);
      else if (typeof GM_setValue !== 'undefined') GM_setValue(STORAGE_KEY, str);
      else localStorage.setItem(STORAGE_KEY, str);
      applyCurrentTheme();
      showToast(t('save'));
    } catch (e) { console.error(`[${APPID}] Save config error:`, e); }
  }

  function showToast(msg) {
    let toast = document.getElementById(`${APPID}-toast`);
    if (!toast) {
      toast = document.createElement('div');
      toast.id = `${APPID}-toast`;
      toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: rgba(18, 18, 24, 0.94); color: #fff;
        padding: 10px 18px; border-radius: 8px; font-size: 14px;
        border: 1px solid rgba(255,255,255,0.2); z-index: 2147483647;
        transition: opacity 0.3s ease; opacity: 0; pointer-events: none;
        font-family: system-ui, sans-serif;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
  }

  function getActiveTheme() {
    return config.defaultSet || BUILTIN_PRESETS[1];
  }

  function getChatContentSelector() {
    switch (CURRENT_PLATFORM) {
      case PLATFORMS.GEMINI:
        return GEMINI_CHAT_CONTENT_SELECTOR;
      case PLATFORMS.CLAUDE:
        return CLAUDE_CHAT_CONTENT_SELECTOR;
      default:
        return CHATGPT_CHAT_CONTENT_SELECTOR;
    }
  }

  function themeHasStandingImage(theme) {
    const asst = theme?.assistant || {};
    const user = theme?.user || {};
    return Boolean(
      asst.standingImageUrl || asst.standingImage || user.standingImageUrl || user.standingImage
    );
  }

  function buildChatContentMaxWidthValue(userMaxWidth, iconSize, hasStandingImage, viewportWidth) {
    if (!Number.isFinite(userMaxWidth)) return null;
    const clamped = Math.min(CHAT_MAX_WIDTH_MAX, Math.max(CHAT_MAX_WIDTH_MIN, userMaxWidth));
    let marginPerSide = iconSize + 32;
    if (hasStandingImage) marginPerSide = Math.max(marginPerSide, iconSize * 2);
    const maxAllowed = Math.max(320, viewportWidth - marginPerSide * 2);
    return `min(${clamped}vw, ${maxAllowed}px)`;
  }

  function applyChatContentMaxWidth() {
    if (!document.body) return;
    const userMaxWidth = config.options?.chat_content_max_width;
    const iconSize = config.options?.icon_size || 42;
    const finalMaxWidth = buildChatContentMaxWidthValue(
      userMaxWidth,
      iconSize,
      themeHasStandingImage(getActiveTheme()),
      window.innerWidth
    );

    if (!finalMaxWidth) {
      document.body.classList.remove(CLASS_MAX_WIDTH_ACTIVE);
      document.documentElement.style.removeProperty(CSS_VAR_CHAT_MAX_WIDTH);
      return;
    }

    document.body.classList.add(CLASS_MAX_WIDTH_ACTIVE);
    document.documentElement.style.setProperty(CSS_VAR_CHAT_MAX_WIDTH, finalMaxWidth);
  }

  function buildChatContentMaxWidthCss() {
    const chatSelector = getChatContentSelector();
    const scopedSelector = CURRENT_PLATFORM === PLATFORMS.CHATGPT
      ? `body.${CLASS_MAX_WIDTH_ACTIVE} main ${chatSelector}`
      : `body.${CLASS_MAX_WIDTH_ACTIVE} ${chatSelector}`;
    return `
      ${scopedSelector} {
        max-width: var(${CSS_VAR_CHAT_MAX_WIDTH}) !important;
        margin-inline: auto !important;
      }
    `;
  }

  // --- Style Injection Engine ---
  let styleEl = null;

  function ensureStyleElement() {
    const parent = document.head || document.documentElement || document.body;
    if (!parent) return;
    if (!styleEl || !parent.contains(styleEl)) {
      styleEl = document.createElement('style');
      styleEl.id = `${APPID}-theme-styles`;
      parent.appendChild(styleEl);
    }
  }

  // --- Process Message Elements for Avatars (Exact AI-UX-Customizer side-avatar-container architecture) ---
  function processMessageElement(node) {
    if (!node || !(node instanceof HTMLElement)) return;
    const tagName = node.tagName.toLowerCase();
    const roleAttr = node.getAttribute('data-message-author-role');

    let role = null;
    if (tagName === 'user-query' || roleAttr === 'user' || node.classList.contains('user-turn')) {
      role = 'user';
    } else if (tagName === 'model-response' || roleAttr === 'assistant' || node.classList.contains('agent-turn')) {
      role = 'assistant';
    } else if (node.matches?.('[data-testid="user-message"], [data-testid="human-message"], .font-user-message')) {
      role = 'user';
    } else if (node.matches?.('[data-testid="assistant-turn"], [data-testid="assistant-message"], .font-claude-response')) {
      role = 'assistant';
    }
    if (!role) return;

    let container = node.querySelector('.side-avatar-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'side-avatar-container';
      const iconSpan = document.createElement('span');
      iconSpan.className = 'side-avatar-icon';
      const nameDiv = document.createElement('div');
      nameDiv.className = 'side-avatar-name';
      container.appendChild(iconSpan);
      container.appendChild(nameDiv);
      node.prepend(container);
    }

    const activeTheme = getActiveTheme();
    const actor = role === 'user' ? activeTheme.user : activeTheme.assistant;
    const nameDiv = container.querySelector('.side-avatar-name');
    if (actor?.name) {
      nameDiv.textContent = actor.name;
      nameDiv.style.display = 'block';
    } else {
      nameDiv.style.display = 'none';
    }
  }

  function renderAllAvatars() {
    if (!document.body) return;
    const selectors = MESSAGE_SELECTOR;
    document.querySelectorAll(selectors).forEach(processMessageElement);
  }

  // --- Standing Character Images Renderer ---
  function renderStandingImages(activeTheme) {
    if (!document.body) return;
    const asst = activeTheme?.assistant || {};
    const user = activeTheme?.user || {};
    const imgStyle = 'max-height: 55vh; max-width: 260px; object-fit: contain;';

    let asstStanding = document.getElementById(`${APPID}-standing-asst`);
    const asstImgUrl = asst.standingImageUrl || asst.standingImage;
    if (asstImgUrl) {
      if (!asstStanding) {
        asstStanding = document.createElement('div');
        asstStanding.id = `${APPID}-standing-asst`;
        asstStanding.style.cssText = `
          position: fixed !important; bottom: 0 !important; left: 15px !important;
          z-index: 1 !important; pointer-events: none !important;
          max-height: 55vh !important; max-width: 260px !important;
        `;
        document.body.appendChild(asstStanding);
      }
      mount(asstStanding, h('img', { src: asstImgUrl, style: imgStyle }));
      asstStanding.style.display = 'block';
    } else if (asstStanding) {
      asstStanding.style.display = 'none';
    }

    let userStanding = document.getElementById(`${APPID}-standing-user`);
    const userImgUrl = user.standingImageUrl || user.standingImage;
    if (userImgUrl) {
      if (!userStanding) {
        userStanding = document.createElement('div');
        userStanding.id = `${APPID}-standing-user`;
        userStanding.style.cssText = `
          position: fixed !important; bottom: 0 !important; right: 15px !important;
          z-index: 1 !important; pointer-events: none !important;
          max-height: 55vh !important; max-width: 260px !important;
        `;
        document.body.appendChild(userStanding);
      }
      mount(userStanding, h('img', { src: userImgUrl, style: imgStyle }));
      userStanding.style.display = 'block';
    } else if (userStanding) {
      userStanding.style.display = 'none';
    }
  }

  // --- Apply Theme (Matching AI-UX-Customizer CSS Variables & Selectors) ---
  function applyCurrentTheme() {
    ensureStyleElement();
    const activeTheme = getActiveTheme();
    const root = document.documentElement;

    const asst = activeTheme.assistant || {};
    const user = activeTheme.user || {};
    const win = activeTheme.window || {};
    const inp = activeTheme.inputArea || {};
    const opts = config.options || {};

    const defaultAsstSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00ffcc"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>`;
    const defaultUserSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff007f"><path d="M12 2a10 10 0 1 0 22 12 10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z"/></svg>`;

    const userIconUrl = getFormattedIconUrl(user.icon, defaultUserSvg);
    const asstIconUrl = getFormattedIconUrl(asst.icon, defaultAsstSvg);

    const iconSize = opts.icon_size || 42;

    root.style.setProperty('--aiuxc-icon-size', `${iconSize}px`);
    root.style.setProperty('--aiuxc-user-icon', `url("${userIconUrl}")`);
    root.style.setProperty('--aiuxc-assistant-icon', `url("${asstIconUrl}")`);

    let css = `
      ${MESSAGE_SELECTOR} {
        position: relative !important;
        overflow: visible !important;
        min-height: calc(var(--aiuxc-icon-size, 42px) + 2em) !important;
      }

      .side-avatar-container {
        position: absolute !important;
        top: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        width: var(--aiuxc-icon-size, 42px) !important;
        pointer-events: none !important;
        white-space: normal !important;
        word-break: break-word !important;
        z-index: 10 !important;
      }

      .side-avatar-icon {
        width: var(--aiuxc-icon-size, 42px) !important;
        height: var(--aiuxc-icon-size, 42px) !important;
        border-radius: 50% !important;
        display: block !important;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.35) !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }

      .side-avatar-name {
        font-size: 0.75rem !important;
        text-align: center !important;
        margin-top: 4px !important;
        width: 100% !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        padding: 2px 4px !important;
        border-radius: 4px !important;
        box-sizing: border-box !important;
        color: #ffffff !important;
        white-space: nowrap !important;
      }

      /* User Avatar on Right */
      user-query .side-avatar-container, [data-message-author-role="user"] .side-avatar-container, .user-turn .side-avatar-container, [data-testid="user-message"] .side-avatar-container, [data-testid="human-message"] .side-avatar-container {
        left: 100% !important;
        margin-left: 12px !important;
      }
      user-query .side-avatar-icon, [data-message-author-role="user"] .side-avatar-icon, .user-turn .side-avatar-icon, [data-testid="user-message"] .side-avatar-icon, [data-testid="human-message"] .side-avatar-icon {
        background-image: var(--aiuxc-user-icon) !important;
      }

      /* Assistant Avatar on Left */
      model-response .side-avatar-container, [data-message-author-role="assistant"] .side-avatar-container, .agent-turn .side-avatar-container, [data-testid="assistant-turn"] .side-avatar-container, [data-testid="assistant-message"] .side-avatar-container {
        right: 100% !important;
        margin-right: 12px !important;
      }
      model-response .side-avatar-icon, [data-message-author-role="assistant"] .side-avatar-icon, .agent-turn .side-avatar-icon, [data-testid="assistant-turn"] .side-avatar-icon, [data-testid="assistant-message"] .side-avatar-icon {
        background-image: var(--aiuxc-assistant-icon) !important;
      }

      /* Gemini Specific Margin space for side avatars */
      user-query, model-response {
        margin-left: ${iconSize + 16}px !important;
        margin-right: ${iconSize + 16}px !important;
        width: calc(100% - ${(iconSize + 16) * 2}px) !important;
        box-sizing: border-box !important;
      }

      /* Claude Specific Margin space for side avatars */
      [data-testid="user-message"], [data-testid="human-message"], [data-testid="assistant-turn"], [data-testid="assistant-message"] {
        margin-left: ${iconSize + 16}px !important;
        margin-right: ${iconSize + 16}px !important;
        width: calc(100% - ${(iconSize + 16) * 2}px) !important;
        box-sizing: border-box !important;
      }

      /* Hide native Gemini icons */
      user-query gmat-icon, user-query .user-icon, model-response gmat-icon[data-mat-icon-name="spark"], model-response .model-avatar-container {
        display: none !important;
      }

      /* Bubble Customization */
      .user-query-bubble-with-background, user-query .query-text, [data-testid="user-message"], [data-testid="human-message"], .font-user-message {
        ${buildBubbleThemeCss(user)}
      }

      .response-container-with-gpi, model-response .markdown, message-content.model-response-text, .font-claude-response, .font-claude-response-body, .standard-markdown {
        ${buildBubbleThemeCss(asst)}
      }
    `;

    // Window Background — platform-scoped so Tailwind flex utilities inside composer stay untouched
    if (win.backgroundColor || win.backgroundImageUrl) {
      const windowBgSelector = getWindowBackgroundSelector();
      css += `
        ${windowBgSelector} {
          ${win.backgroundColor ? `background-color: ${win.backgroundColor} !important;` : ''}
          ${win.backgroundImageUrl ? `
            background-image: url("${win.backgroundImageUrl}") !important;
            background-size: ${win.backgroundSize || 'cover'} !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
          ` : ''}
        }
      `;
      if (CURRENT_PLATFORM === PLATFORMS.CHATGPT) {
        css += `
        form[data-type="unified-composer"], form[data-type="unified-composer"] * {
          background-image: none !important;
        }
        `;
      } else if (CURRENT_PLATFORM === PLATFORMS.CLAUDE) {
        css += `
        fieldset:has([data-testid="chat-input"]), fieldset:has([data-testid="chat-input"]) * {
          background-image: none !important;
        }
        `;
      }
    }

    // Input Area
    css += buildInputThemeCss(CURRENT_PLATFORM, inp, user.font);
    css += buildChatContentMaxWidthCss();

    if (styleEl) styleEl.textContent = css;

    const label = document.getElementById(`${APPID}-applied-theme-name`);
    if (label) label.textContent = activeTheme.name || t('default_theme');

    renderStandingImages(activeTheme);
    renderAllAvatars();
    applyChatContentMaxWidth();
  }

  // --- Sentinel Engine for SPA Instant DOM Detection ---
  function initSentinelEngine() {
    const sentinelStyleId = `${APPID}-sentinel-rules`;
    const messageSelector = MESSAGE_SELECTOR;
    const inputAreaSelector = `:is(${getInputAreaSelectors().join(', ')})`;

    const processInsertedNode = (node) => {
      if (!(node instanceof HTMLElement)) return;

      if (node.matches(messageSelector)) processMessageElement(node);
      if (node.matches(inputAreaSelector)) observeInputAreaForButtonPlacement(node);
      node.querySelectorAll?.(messageSelector).forEach(processMessageElement);
      node.querySelectorAll?.(inputAreaSelector).forEach(observeInputAreaForButtonPlacement);
    };

    const handleSentinelAnimation = (e) => {
      if (e.animationName !== `${APPID}-sentinel-anim`) return;
      processInsertedNode(e.target);
    };
    document.addEventListener('animationstart', handleSentinelAnimation, true);

    if (!document.getElementById(sentinelStyleId)) {
      const style = document.createElement('style');
      style.id = sentinelStyleId;
      style.textContent = `
        @keyframes ${APPID}-sentinel-anim { from { opacity: 0.99; } to { opacity: 1; } }
        ${messageSelector}, ${inputAreaSelector} {
          animation-duration: 0.001s !important;
          animation-name: ${APPID}-sentinel-anim !important;
        }
      `;
      const nonceSource = document.querySelector?.('style[nonce], script[nonce]');
      if (nonceSource?.nonce) style.nonce = nonceSource.nonce;

      const target = document.head || document.documentElement;
      if (target) target.appendChild(style);
    }

    if (!initSentinelEngine.fallbackObserver && document.body) {
      const fallbackObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const addedNode of mutation.addedNodes || []) {
            processInsertedNode(addedNode);
          }
        }
      });
      fallbackObserver.observe(document.body, { childList: true, subtree: true });
      initSentinelEngine.fallbackObserver = fallbackObserver;
    }

    document.querySelectorAll(messageSelector).forEach(processMessageElement);
    document.querySelectorAll(inputAreaSelector).forEach(observeInputAreaForButtonPlacement);
  }

  // --- Settings Button Placement (Exact AI-UX-Customizer INSERTION_ANCHOR) ---
  function createPaletteIcon() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      'aria-hidden': 'true',
      width: '22',
      height: '22',
      viewBox: '0 -960 960 960',
      fill: 'currentColor'
    }, [
      h('path', { d: PALETTE_ICON_PATH })
    ]);
  }

  function applyFloatingButtonStyles(btn) {
    btn.style.setProperty('position', 'fixed', 'important');
    btn.style.setProperty('bottom', '20px', 'important');
    btn.style.setProperty('right', '20px', 'important');
    btn.style.setProperty('z-index', '2147483647', 'important');
    btn.style.setProperty('background', 'rgba(6, 182, 212, 0.9)', 'important');
    btn.style.setProperty('border-radius', '50%', 'important');
    btn.style.setProperty('color', '#fff', 'important');
    btn.style.setProperty('display', 'flex', 'important');
  }

  function applyInlineButtonStyles(btn, platform) {
    const isGemini = platform === PLATFORMS.GEMINI;
    btn.style.cssText = `
      z-index: 1000 !important;
      background: transparent !important;
      border: none !important;
      border-radius: 50% !important;
      position: static !important;
      margin: 0 ${isGemini ? '2px' : '4px'} 0 0 !important;
      width: ${isGemini ? '40px' : '36px'} !important;
      height: ${isGemini ? '40px' : '36px'} !important;
      align-self: center !important;
      color: ${isGemini
        ? 'var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant, #5f6368))'
        : platform === PLATFORMS.CLAUDE
          ? 'currentColor'
          : '#c4c7c5'} !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 !important;
      pointer-events: auto !important;
      flex-shrink: 0 !important;
      box-shadow: none !important;
      outline: none !important;
      transition: background-color 120ms ease, color 120ms ease, transform 120ms ease !important;
    `;
  }

  function ensureSettingsButtonPlacement() {
    if (!document.body) return;
    const platform = CURRENT_PLATFORM;
    const isGemini = platform === PLATFORMS.GEMINI;
    let btn = ensureSettingsButtonPlacement.element || document.getElementById(`${APPID}-settings-btn`);

    if (!btn) {
      btn = document.createElement('button');
      btn.id = `${APPID}-settings-btn`;
      btn.type = 'button';
      btn.title = t('aria_settings');
      btn.setAttribute('aria-label', t('aria_settings'));
      mount(btn, createPaletteIcon());
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSettingsPanel();
      };
    }

    ensureSettingsButtonPlacement.element = btn;
    applyInlineButtonStyles(btn, platform);

    if (isGemini) {
      btn.onmouseover = () => {
        btn.style.setProperty('background', 'color-mix(in srgb, currentColor 8%, transparent)', 'important');
        btn.style.setProperty('transform', 'scale(1.04)', 'important');
      };
      btn.onmouseout = () => {
        btn.style.setProperty('background', 'transparent', 'important');
        btn.style.setProperty('transform', 'none', 'important');
      };
      btn.onfocus = () => {
        btn.style.setProperty('background', 'color-mix(in srgb, currentColor 12%, transparent)', 'important');
        btn.style.setProperty('box-shadow', '0 0 0 2px color-mix(in srgb, currentColor 28%, transparent)', 'important');
      };
      btn.onblur = () => {
        btn.style.setProperty('background', 'transparent', 'important');
        btn.style.setProperty('box-shadow', 'none', 'important');
      };

      const trailingActions = queryFirstElement(GEMINI_ANCHOR_SELECTORS);
      if (trailingActions instanceof HTMLElement) {
        const ghostButton = document.getElementById(btn.id);
        if (ghostButton && ghostButton !== btn) ghostButton.remove();
        if (!trailingActions.contains(btn) || trailingActions.children[0] !== btn) {
          trailingActions.prepend(btn);
        }
        btn.style.setProperty('display', 'flex', 'important');
      } else {
        if (!document.body.contains(btn)) document.body.appendChild(btn);
        applyFloatingButtonStyles(btn);
      }
      return;
    }

    const anchor = queryFirstElement(getAnchorSelectors());
    if (anchor && anchor instanceof HTMLElement) {
      if (!anchor.contains(btn)) anchor.prepend(btn);
    } else {
      if (!document.body.contains(btn)) document.body.appendChild(btn);
      applyFloatingButtonStyles(btn);
    }
  }

  // --- Settings Button Lifecycle ---
  let settingsButtonPlacementFrame = 0;
  let observedInputArea = null;
  let inputAreaPlacementObserver = null;

  function getInputAreaSelector() {
    return getInputAreaSelectors()[0];
  }

  function getSettingsAnchorSelector() {
    return getAnchorSelectors()[0];
  }

  function findSettingsAnchor() {
    return queryFirstElement(getAnchorSelectors());
  }

  function findInputArea() {
    return queryFirstElement(getInputAreaSelectors());
  }

  function isSettingsButtonPlacementValid() {
    const anchor = findSettingsAnchor();
    const button = document.getElementById(`${APPID}-settings-btn`);
    return anchor instanceof HTMLElement
      && button instanceof HTMLElement
      && button.parentElement === anchor;
  }

  function scheduleSettingsButtonPlacement() {
    if (settingsButtonPlacementFrame) return;

    settingsButtonPlacementFrame = requestAnimationFrame(() => {
      settingsButtonPlacementFrame = 0;
      ensureSettingsButtonPlacement();
    });
  }

  function observeInputAreaForButtonPlacement(inputArea = findInputArea()) {
    if (!(inputArea instanceof HTMLElement)) return;

    if (observedInputArea !== inputArea) {
      inputAreaPlacementObserver?.disconnect();
      observedInputArea = inputArea;
      inputAreaPlacementObserver = new MutationObserver(() => {
        if (!isSettingsButtonPlacementValid()) scheduleSettingsButtonPlacement();
      });
      inputAreaPlacementObserver.observe(inputArea, { childList: true, subtree: true });
    }

    if (!isSettingsButtonPlacementValid()) scheduleSettingsButtonPlacement();
  }

  // --- Settings Panel ---
  let settingsPanelEl = null;

  function toggleSettingsPanel() {
    if (settingsPanelEl && settingsPanelEl.style.display !== 'none') {
      settingsPanelEl.style.display = 'none';
    } else {
      renderSettingsPanel();
    }
  }

  function renderSettingsPanel() {
    if (!document.body) return;
    if (!settingsPanelEl) {
      settingsPanelEl = document.createElement('div');
      settingsPanelEl.id = `${APPID}-settings-panel`;
      settingsPanelEl.style.cssText = `
        position: fixed !important;
        bottom: 85px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        width: 330px !important;
        max-height: 75vh !important;
        overflow-y: auto !important;
        background: #181825 !important;
        color: #cdd6f4 !important;
        border-radius: 14px !important;
        padding: 16px !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6) !important;
        font-family: system-ui, -apple-system, sans-serif !important;
      `;
      document.body.appendChild(settingsPanelEl);
    }

    const activeTheme = getActiveTheme();
    const useDefaultChatWidth = !Number.isFinite(config.options.chat_content_max_width);
    const chatWidthValue = useDefaultChatWidth ? 60 : config.options.chat_content_max_width;
    const chatWidthLabel = h('span', {
      id: `${APPID}-chat-width-label`,
      style: 'color:#a6e3a1; font-size:12px; margin-left:8px;',
      text: useDefaultChatWidth ? t('chat_max_width_default') : `${chatWidthValue}vw`
    });

    const iconSizeInput = h('input', {
      type: 'number',
      id: `${APPID}-opt-icon-size`,
      value: config.options.icon_size || 42,
      style: 'width:100%; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px; box-sizing:border-box;',
      onchange: (e) => {
        config.options.icon_size = parseInt(e.target.value, 10) || 42;
        saveConfig();
      }
    });

    const chatWidthDefaultToggle = h('input', {
      type: 'checkbox',
      id: `${APPID}-opt-chat-width-default`,
      checked: useDefaultChatWidth,
      onchange: (e) => {
        if (e.target.checked) {
          config.options.chat_content_max_width = null;
          chatWidthLabel.textContent = t('chat_max_width_default');
          applyChatContentMaxWidth();
        } else {
          const nextValue = parseInt(chatWidthInput.value, 10) || 60;
          config.options.chat_content_max_width = nextValue;
          chatWidthLabel.textContent = `${nextValue}vw`;
          applyChatContentMaxWidth();
        }
        saveConfig();
      }
    });

    const chatWidthInput = h('input', {
      type: 'range',
      id: `${APPID}-opt-chat-width`,
      min: String(CHAT_MAX_WIDTH_MIN),
      max: String(CHAT_MAX_WIDTH_MAX),
      step: '1',
      value: String(chatWidthValue),
      style: 'width:100%; margin-top:6px;',
      oninput: (e) => {
        const nextValue = parseInt(e.target.value, 10);
        if (!Number.isFinite(config.options.chat_content_max_width)) {
          chatWidthDefaultToggle.checked = false;
        }
        config.options.chat_content_max_width = nextValue;
        chatWidthLabel.textContent = `${nextValue}vw`;
        applyChatContentMaxWidth();
      },
      onchange: () => saveConfig()
    });

    mount(settingsPanelEl,
      h('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;' }, [
        h('span', { style: 'font-weight:bold; font-size:15px; color:#89b4fa;', text: t('settings_title') }),
        h('button', {
          id: `${APPID}-lang-btn`,
          type: 'button',
          style: 'background:#313244; color:#a6adc8; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;',
          text: t('lang_switch'),
          onclick: () => {
            currentLang = currentLang === 'vi' ? 'en' : 'vi';
            saveConfig();
            renderSettingsPanel();
          }
        })
      ]),
      h('div', { style: 'background:#1e1e2e; padding:10px; border-radius:8px; margin-bottom:12px; font-size:13px;' }, [
        h('span', { style: 'color:#a6adc8;', text: t('applied_theme') }),
        h('strong', {
          id: `${APPID}-applied-theme-name`,
          style: 'color:#a6e3a1; margin-left:6px;',
          text: activeTheme.name || t('default_theme')
        })
      ]),
      h('div', { style: 'display:flex; flex-direction:column; gap:8px; margin-bottom:16px;' }, [
        h('button', {
          id: `${APPID}-open-presets`,
          type: 'button',
          style: 'background:linear-gradient(135deg,#f5c2e7,#cba6f7); color:#11111b; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;',
          text: t('presets_btn'),
          onclick: openPresetsModal
        }),
        h('button', {
          id: `${APPID}-open-editor`,
          type: 'button',
          style: 'background:#313244; color:#cdd6f4; border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:6px; cursor:pointer;',
          text: t('theme_editor_btn'),
          onclick: openThemeEditorModal
        }),
        h('button', {
          id: `${APPID}-open-json`,
          type: 'button',
          style: 'background:#313244; color:#cdd6f4; border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:6px; cursor:pointer;',
          text: t('json_editor_btn'),
          onclick: openJsonModal
        })
      ]),
      h('hr', { style: 'border:none; border-top:1px solid rgba(255,255,255,0.1); margin:12px 0;' }),
      h('div', { style: 'font-size:13px; display:flex; flex-direction:column; gap:10px;' }, [
        h('div', {}, [
          h('label', { style: 'display:block; margin-bottom:4px; color:#a6adc8;', text: t('icon_size') }),
          iconSizeInput
        ]),
        h('div', {}, [
          h('div', { style: 'display:flex; align-items:center; justify-content:space-between; gap:8px;' }, [
            h('label', { style: 'color:#a6adc8;', text: t('chat_max_width') }),
            chatWidthLabel
          ]),
          h('label', { style: 'display:flex; align-items:center; gap:8px; margin-top:6px; color:#a6adc8; font-size:12px;' }, [
            chatWidthDefaultToggle,
            h('span', { text: t('chat_max_width_default') })
          ]),
          chatWidthInput
        ])
      ])
    );

    settingsPanelEl.style.display = 'block';
  }

  const PRESET_MODAL_CSS = `
    #${APPID}-preset-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .${APPID}-select-preset {
      appearance: none;
      width: 100%;
      min-width: 0;
      padding: 0;
      overflow: hidden;
      color: #cdd6f4;
      text-align: left;
      background: #11111b;
      border: 1px solid rgba(255,255,255,0.13);
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    }
    .${APPID}-select-preset:hover {
      transform: translateY(-3px);
      border-color: rgba(203,166,247,0.7);
      box-shadow: 0 14px 30px rgba(0,0,0,0.34);
    }
    .${APPID}-select-preset:focus-visible {
      outline: 3px solid rgba(137,180,250,0.72);
      outline-offset: 3px;
    }
    .${APPID}-select-preset.is-active {
      border-color: #a6e3a1;
      box-shadow: 0 0 0 1px rgba(166,227,161,0.5), 0 12px 28px rgba(0,0,0,0.3);
    }
    .${APPID}-preset-preview {
      display: flex;
      flex-direction: column;
      min-height: 188px;
      padding: 14px;
      box-sizing: border-box;
    }
    .${APPID}-preset-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      color: #f8fafc;
      font-size: 14px;
    }
    .${APPID}-active-badge {
      flex: 0 0 auto;
      padding: 3px 7px;
      color: #102018;
      font-size: 10px;
      font-weight: 800;
      background: #a6e3a1;
      border-radius: 999px;
    }
    .${APPID}-palette {
      display: flex;
      gap: 6px;
      margin: 11px 0 13px;
    }
    .${APPID}-palette-dot {
      display: block;
      width: 14px;
      height: 14px;
      border: 1px solid rgba(255,255,255,0.34);
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0,0,0,0.28);
    }
    .${APPID}-preview-assistant,
    .${APPID}-preview-user {
      display: block;
      width: fit-content;
      max-width: 86%;
      padding: 7px 9px;
      font-size: 11px;
      line-height: 1.3;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .${APPID}-preview-assistant {
      border-radius: 10px 10px 10px 3px;
    }
    .${APPID}-preview-user {
      align-self: flex-end;
      margin-top: 8px;
      border-radius: 10px 10px 3px 10px;
    }
    .${APPID}-preview-input {
      display: block;
      width: 72%;
      height: 9px;
      margin: auto auto 0;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 999px;
    }
    .${APPID}-preset-action {
      display: block;
      padding: 10px 12px;
      color: #11111b;
      font-size: 12px;
      font-weight: 800;
      text-align: center;
      background: linear-gradient(135deg,#89b4fa,#cba6f7);
    }
    .${APPID}-select-preset.is-active .${APPID}-preset-action {
      background: linear-gradient(135deg,#a6e3a1,#94e2d5);
    }
    @media (max-width: 999px) {
      #${APPID}-preset-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 679px) {
      #${APPID}-preset-grid { grid-template-columns: 1fr; }
    }
  `;

  // --- Presets Modal ---
  function openPresetsModal() {
    let modal = document.getElementById(`${APPID}-presets-modal`);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = `${APPID}-presets-modal`;
      modal.style.cssText = `
        position: fixed; inset:0; z-index:100001; background:rgba(0,0,0,0.78);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(7px);
      `;
      document.body.appendChild(modal);
    }

    const labels = {
      active: t('active_theme'),
      apply: t('select_preset'),
      restore: t('restore_native'),
      previewAssistant: t('preset_preview_assistant'),
      previewUser: t('preset_preview_user')
    };
    const activePresetId = config.defaultSet?.id || '';
    const presetCards = BUILTIN_PRESETS.map((preset, index) => {
      const card = renderPresetCard(preset, index, activePresetId, labels);
      card.onclick = async () => {
        config.defaultSet = JSON.parse(JSON.stringify(BUILTIN_PRESETS[index]));
        await saveConfig();
        showToast(t('preset_applied'));
        modal.remove();
      };
      return card;
    });

    mount(modal,
      h('style', { text: PRESET_MODAL_CSS }),
      h('div', {
        style: 'background:#181825; color:#cdd6f4; width:1040px; max-width:94vw; max-height:88vh; border-radius:16px; padding:22px; overflow-y:auto; border:1px solid rgba(255,255,255,0.16); box-shadow:0 24px 80px rgba(0,0,0,0.55); font-family:system-ui, sans-serif; box-sizing:border-box;'
      }, [
        h('div', { style: 'display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:18px;' }, [
          h('div', {}, [
            h('h3', { style: 'margin:0; font-size:21px; color:#f5c2e7;', text: t('preset_modal_title') }),
            h('p', {
              style: 'margin:5px 0 0; color:#a6adc8; font-size:12px;',
              text: t('preset_modal_subtitle', { count: BUILTIN_PRESETS.length - 1 })
            })
          ]),
          h('button', {
            id: `${APPID}-close-presets`,
            type: 'button',
            'aria-label': t('close'),
            style: 'background:#313244; border:1px solid rgba(255,255,255,0.12); border-radius:50%; width:36px; height:36px; color:#cdd6f4; font-size:20px; cursor:pointer;',
            text: '×',
            onclick: () => modal.remove()
          })
        ]),
        h('div', { id: `${APPID}-preset-grid` }, presetCards)
      ])
    );
  }

  // --- Theme Editor ---
  function openThemeEditorModal() {
    let modal = document.getElementById(`${APPID}-editor-modal`);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = `${APPID}-editor-modal`;
      modal.style.cssText = `
        position: fixed; inset:0; z-index:100001; background:rgba(0,0,0,0.75);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px);
      `;
      document.body.appendChild(modal);
    }

    let activeThemeIndex = -1;

    function fieldLabel(text) {
      return h('label', { style: 'display:block; font-size:12px; color:#a6adc8;', text });
    }

    function textInput(id, value) {
      return h('input', {
        type: 'text',
        id,
        value: value || '',
        style: 'width:100%; background:#313244; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px; margin-bottom:8px; box-sizing:border-box;'
      });
    }

    function textArea(id, value) {
      const el = h('textarea', {
        id,
        style: 'width:100%; height:42px; background:#313244; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px; margin-bottom:8px; box-sizing:border-box;'
      });
      el.value = value || '';
      return el;
    }

    function colorInput(id, value) {
      return h('input', {
        type: 'color',
        id,
        value: value || '#00ffcc',
        style: 'width:100%; height:30px; background:#313244; border:none; border-radius:4px; margin-bottom:8px;'
      });
    }

    function createImageFieldRow(label, inputEl, pickOptions) {
      const pickBtn = h('button', {
        type: 'button',
        title: t('pick_image'),
        style: 'flex:0 0 auto; white-space:nowrap; background:#45475a; color:#cdd6f4; border:1px solid #585b70; border-radius:6px; padding:6px 10px; cursor:pointer; font-size:12px;',
        text: `📁 ${t('pick_image')}`,
        onclick: () => pickLocalImageFile({
          ...pickOptions,
          onSelected: (dataUrl) => { inputEl.value = dataUrl; }
        })
      });
      inputEl.style.marginBottom = '0';
      return h('div', { style: 'margin-bottom:8px;' }, [
        fieldLabel(label),
        h('div', { style: 'display:flex; gap:8px; align-items:stretch;' }, [
          h('div', { style: 'flex:1; min-width:0;' }, [inputEl]),
          pickBtn
        ])
      ]);
    }

    function renderEditor() {
      const isDefault = activeThemeIndex === -1;
      const targetTheme = isDefault ? config.defaultSet : config.themeSets[activeThemeIndex];

      const themeSelect = h('select', {
        id: `${APPID}-theme-select`,
        style: 'background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px 12px; border-radius:6px; flex:1;',
        onchange: (e) => {
          activeThemeIndex = parseInt(e.target.value, 10);
          renderEditor();
        }
      }, [
        h('option', { value: '-1', selected: isDefault, text: t('default_theme_option') }),
        ...config.themeSets.map((tTheme, i) => h('option', {
          value: String(i),
          selected: activeThemeIndex === i,
          text: tTheme.name || t('theme_name_fallback', { n: i + 1 })
        }))
      ]);

      const toolbarChildren = [
        h('label', { style: 'font-weight:bold;', text: t('select_theme') }),
        themeSelect,
        h('button', {
          id: `${APPID}-new-theme-btn`,
          type: 'button',
          style: 'background:#a6e3a1; color:#11111b; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;',
          text: t('new_theme'),
          onclick: () => {
            const newTheme = JSON.parse(JSON.stringify(BUILTIN_PRESETS[1]));
            newTheme.id = `${APPID}-theme-${Date.now()}`;
            newTheme.name = t('theme_name_fallback', { n: config.themeSets.length + 1 });
            config.themeSets.push(newTheme);
            activeThemeIndex = config.themeSets.length - 1;
            renderEditor();
          }
        })
      ];

      if (!isDefault) {
        toolbarChildren.push(h('button', {
          id: `${APPID}-del-theme-btn`,
          type: 'button',
          style: 'background:#f38ba8; color:#11111b; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;',
          text: t('delete_theme'),
          onclick: () => {
            config.themeSets.splice(activeThemeIndex, 1);
            activeThemeIndex = -1;
            renderEditor();
          }
        }));
      }

      const asstName = textInput(`${APPID}-asst-name`, targetTheme.assistant?.name);
      const asstIcon = textArea(`${APPID}-asst-icon`, targetTheme.assistant?.icon);
      const asstStandingInput = textInput(
        `${APPID}-asst-standing`,
        targetTheme.assistant?.standingImageUrl || targetTheme.assistant?.standingImage
      );
      const asstStanding = createImageFieldRow(t('field_standing_img'), asstStandingInput, {
        maxHeight: IMAGE_MAX_HEIGHT_STANDING
      });
      const asstIconRow = createImageFieldRow(t('field_icon'), asstIcon, {
        maxWidth: IMAGE_MAX_WIDTH_ICON,
        maxHeight: IMAGE_MAX_WIDTH_ICON
      });
      const asstColor = colorInput(`${APPID}-asst-color`, targetTheme.assistant?.textColor || '#00ffcc');

      const userName = textInput(`${APPID}-user-name`, targetTheme.user?.name);
      const userIcon = textArea(`${APPID}-user-icon`, targetTheme.user?.icon);
      const userStandingInput = textInput(
        `${APPID}-user-standing`,
        targetTheme.user?.standingImageUrl || targetTheme.user?.standingImage
      );
      const userStanding = createImageFieldRow(t('field_standing_img'), userStandingInput, {
        maxHeight: IMAGE_MAX_HEIGHT_STANDING
      });
      const userIconRow = createImageFieldRow(t('field_icon'), userIcon, {
        maxWidth: IMAGE_MAX_WIDTH_ICON,
        maxHeight: IMAGE_MAX_WIDTH_ICON
      });
      const userColor = colorInput(`${APPID}-user-color`, targetTheme.user?.textColor || '#ff66cc');

      if (!targetTheme.window) targetTheme.window = {};
      if (!targetTheme.inputArea) targetTheme.inputArea = {};

      const winBgColor = textInput(`${APPID}-win-bg-color`, targetTheme.window.backgroundColor || '');
      const winBgImageInput = textInput(`${APPID}-win-bg-image`, targetTheme.window.backgroundImageUrl || '');
      const winBgImage = createImageFieldRow(t('window_bg_image'), winBgImageInput, {
        maxWidth: IMAGE_MAX_WIDTH_BG
      });
      const winBgSize = textInput(`${APPID}-win-bg-size`, targetTheme.window.backgroundSize || 'cover');
      const inputBgColor = textInput(`${APPID}-input-bg-color`, targetTheme.inputArea.backgroundColor || '');
      const inputTextColor = textInput(`${APPID}-input-text-color`, targetTheme.inputArea.textColor || '');

      mount(modal,
        h('div', {
          style: 'background:#181825; color:#cdd6f4; width:760px; max-width:94vw; max-height:90vh; border-radius:14px; padding:22px; overflow-y:auto; border:1px solid rgba(255,255,255,0.15); font-family:system-ui, sans-serif;'
        }, [
          h('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;' }, [
            h('h3', { style: 'margin:0; font-size:20px; color:#89b4fa;', text: t('editor_title') }),
            h('button', {
              id: `${APPID}-close-editor`,
              type: 'button',
              style: 'background:none; border:none; color:#a6adc8; font-size:22px; cursor:pointer;',
              text: '✕',
              onclick: () => modal.remove()
            })
          ]),
          h('div', { style: 'display:flex; gap:8px; align-items:center; margin-bottom:16px; flex-wrap:wrap;' }, toolbarChildren),
          h('div', { style: 'display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;' }, [
            h('div', { style: 'background:#1e1e2e; padding:14px; border-radius:10px;' }, [
              h('h4', { style: 'margin:0 0 10px 0; color:#89b4fa;', text: t('assistant_sec') }),
              fieldLabel(t('field_name')), asstName,
              asstIconRow,
              asstStanding,
              fieldLabel(t('field_text_color')), asstColor
            ]),
            h('div', { style: 'background:#1e1e2e; padding:14px; border-radius:10px;' }, [
              h('h4', { style: 'margin:0 0 10px 0; color:#f5c2e7;', text: t('user_sec') }),
              fieldLabel(t('field_name')), userName,
              userIconRow,
              userStanding,
              fieldLabel(t('field_text_color')), userColor
            ])
          ]),
          h('div', { style: 'display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;' }, [
            h('div', { style: 'background:#1e1e2e; padding:14px; border-radius:10px;' }, [
              h('h4', { style: 'margin:0 0 10px 0; color:#94e2d5;', text: t('window_sec') }),
              fieldLabel(t('window_bg_color')), winBgColor,
              winBgImage,
              fieldLabel(t('window_bg_size')), winBgSize
            ]),
            h('div', { style: 'background:#1e1e2e; padding:14px; border-radius:10px;' }, [
              h('h4', { style: 'margin:0 0 10px 0; color:#f9e2af;', text: t('input_sec') }),
              fieldLabel(t('input_bg_color')), inputBgColor,
              fieldLabel(t('input_text_color')), inputTextColor
            ])
          ]),
          h('div', { style: 'display:flex; justify-content:flex-end; gap:8px; margin-top:20px;' }, [
            h('button', {
              id: `${APPID}-save-editor`,
              type: 'button',
              style: 'background:#89b4fa; color:#11111b; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;',
              text: t('save'),
              onclick: () => {
                if (!targetTheme.assistant) targetTheme.assistant = {};
                if (!targetTheme.user) targetTheme.user = {};
                if (!targetTheme.window) targetTheme.window = {};
                if (!targetTheme.inputArea) targetTheme.inputArea = {};
                targetTheme.assistant.name = asstName.value;
                targetTheme.assistant.icon = asstIcon.value;
                targetTheme.assistant.standingImageUrl = asstStandingInput.value.trim() || null;
                targetTheme.assistant.textColor = asstColor.value;
                targetTheme.user.name = userName.value;
                targetTheme.user.icon = userIcon.value;
                targetTheme.user.standingImageUrl = userStandingInput.value.trim() || null;
                targetTheme.user.textColor = userColor.value;
                targetTheme.window.backgroundColor = winBgColor.value.trim() || null;
                targetTheme.window.backgroundImageUrl = winBgImageInput.value.trim() || null;
                targetTheme.window.backgroundSize = winBgSize.value.trim() || 'cover';
                targetTheme.inputArea.backgroundColor = inputBgColor.value.trim() || null;
                targetTheme.inputArea.textColor = inputTextColor.value.trim() || null;
                saveConfig();
                modal.remove();
              }
            })
          ])
        ])
      );
    }

    renderEditor();
  }

  // --- JSON Modal ---
  function openJsonModal() {
    let modal = document.getElementById(`${APPID}-json-modal`);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = `${APPID}-json-modal`;
      modal.style.cssText = `
        position: fixed; inset:0; z-index:100001; background:rgba(0,0,0,0.75);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px);
      `;
      document.body.appendChild(modal);
    }

    const textarea = h('textarea', {
      id: `${APPID}-json-textarea`,
      style: 'width:100%; height:340px; background:#1e1e2e; color:#a6e3a1; font-family:monospace; border:1px solid #45475a; padding:12px; border-radius:8px; box-sizing:border-box; font-size:13px;'
    });
    textarea.value = JSON.stringify(config, null, 2);

    mount(modal,
      h('div', {
        style: 'background:#181825; color:#cdd6f4; width:680px; max-width:92vw; max-height:85vh; border-radius:14px; padding:22px; overflow-y:auto; border:1px solid rgba(255,255,255,0.15); font-family:system-ui, sans-serif;'
      }, [
        h('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;' }, [
          h('h3', { style: 'margin:0; font-size:18px; color:#89b4fa;', text: t('json_editor_btn') }),
          h('button', {
            id: `${APPID}-close-json`,
            type: 'button',
            style: 'background:none; border:none; color:#a6adc8; font-size:22px; cursor:pointer;',
            text: '✕',
            onclick: () => modal.remove()
          })
        ]),
        textarea,
        h('div', { style: 'display:flex; justify-content:space-between; margin-top:14px;' }, [
          h('button', {
            id: `${APPID}-reset-btn`,
            type: 'button',
            style: 'background:#f38ba8; color:#11111b; border:none; padding:8px 14px; border-radius:6px; font-weight:bold; cursor:pointer;',
            text: t('reset'),
            onclick: () => {
              config = getDefaultConfig();
              saveConfig();
              modal.remove();
            }
          }),
          h('button', {
            id: `${APPID}-save-json`,
            type: 'button',
            style: 'background:#a6e3a1; color:#11111b; border:none; padding:8px 18px; border-radius:6px; font-weight:bold; cursor:pointer;',
            text: t('save'),
            onclick: () => {
              try {
                config = JSON.parse(textarea.value);
                saveConfig();
                modal.remove();
              } catch (e) {
                alert(t('json_syntax_error', { message: e.message }));
              }
            }
          })
        ])
      ])
    );
  }

  function ensureBody(callback) {
    if (document.body) callback();
    else {
      const observer = new MutationObserver(() => {
        if (document.body) { observer.disconnect(); callback(); }
      });
      observer.observe(document.documentElement || document, { childList: true, subtree: true });
    }
  }

  let chatWidthResizeFrame = 0;
  function scheduleChatContentMaxWidthUpdate() {
    if (chatWidthResizeFrame) return;
    chatWidthResizeFrame = requestAnimationFrame(() => {
      chatWidthResizeFrame = 0;
      applyChatContentMaxWidth();
    });
  }

  async function init() {
    await loadConfig();

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', scheduleChatContentMaxWidthUpdate, { passive: true });
    }

    ensureBody(() => {
      const steps = [
        ['initSentinelEngine', initSentinelEngine],
        ['applyCurrentTheme', applyCurrentTheme],
        ['ensureSettingsButtonPlacement', ensureSettingsButtonPlacement],
        ['observeInputAreaForButtonPlacement', observeInputAreaForButtonPlacement]
      ];
      for (const [name, step] of steps) {
        try {
          step();
        } catch (error) {
          console.error(`[${APPID}] ${name} failed:`, error);
        }
      }
    });
  }

  init();
})();
