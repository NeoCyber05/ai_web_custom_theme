// ==UserScript==
// @name         AI Theme Custom
// @namespace    https://github.com/ai-theme-custom
// @version      2.0.1
// @license      MIT
// @description  Full interface customization engine for ChatGPT and Gemini: Custom themes, preset picker, EN/VI multilingual support, custom avatars, standing images, and chat navigation console.
// @icon         data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%235985E1'%3E%3Cpath d='M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z'/%3E%3C/svg%3E
// @author       AI Theme Team
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://gemini.google.com/*
// @include      *://chatgpt.com/*
// @include      *://chat.openai.com/*
// @include      *://gemini.google.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      *
// @run-at       document-idle
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  const APPID = 'ai-theme-custom';
  const APPNAME = 'AI Theme Custom';
  const STORAGE_KEY = `${APPID}-config`;

  // --- Platform Detection ---
  const PLATFORMS = {
    CHATGPT: 'ChatGPT',
    GEMINI: 'Gemini'
  };

  function detectPlatform() {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return PLATFORMS.CHATGPT;
    if (host.includes('gemini.google.com') || host.includes('bard.google.com')) return PLATFORMS.GEMINI;
    return null;
  }

  const CURRENT_PLATFORM = detectPlatform();
  if (!CURRENT_PLATFORM) return;

  // --- i18n Dictionary ---
  const I18N = {
    vi: {
      lang_name: 'Tiếng Việt',
      lang_switch: 'English',
      settings_title: 'AI Theme Custom',
      applied_theme: 'Theme đang áp dụng:',
      presets_btn: 'Theme Có Sẵn (Presets)',
      theme_editor_btn: 'Trình Chỉnh Sửa Theme',
      json_editor_btn: 'Chỉnh Sửa JSON / Import Export',
      icon_size: 'Kích thước Avatar (px):',
      chat_max_width: 'Chiều rộng tối đa khung Chat (vw):',
      respect_avatar: 'Tránh ảnh đứng đè lên Avatar',
      nav_console: 'Thanh điều hướng tin nhắn',
      nav_position: 'Vị trí Thanh điều hướng:',
      pos_input_top: 'Phía trên khung nhập',
      pos_header: 'Nhúng trên Header',
      collapsible: 'Nút thu gọn tin nhắn dài',
      keyboard_shortcuts: 'Bật phím tắt (Alt+↑/↓, Alt+J, Alt+N)',
      
      // Theme Editor Modal
      editor_title: 'Trình Quản Lý & Chỉnh Sửa Theme',
      select_theme: 'Chọn Theme:',
      new_theme: 'Theme Mới',
      copy_theme: 'Nhân Bản',
      delete_theme: 'Xóa',
      rename_theme: 'Đổi tên:',
      title_patterns: 'Regex khớp Tiêu đề Chat (Mỗi dòng 1 mẫu):',
      url_patterns: 'Regex khớp Đường dẫn URL (Mỗi dòng 1 mẫu):',
      apply_preset_to_current: 'Nạp từ Theme Có Sẵn (Preset)...',
      
      // Actors
      assistant_sec: 'AI Assistant (Trợ Lý)',
      user_sec: 'User (Người Dùng)',
      window_sec: 'Nền Ứng Dụng (Window Background)',
      input_sec: 'Khung Nhập Liệu (Input Area)',
      
      field_name: 'Tên hiển thị:',
      field_icon: 'Icon (URL / SVG / Base64):',
      field_standing_img: 'Ảnh đứng (Standing Image URL):',
      field_text_color: 'Màu chữ:',
      field_bubble_bg: 'Màu nền bong bóng chat:',
      field_padding: 'Khoảng cách viền (Padding px):',
      field_radius: 'Bo góc (Radius px):',
      field_max_width: 'Rộng tối đa (%):',
      
      window_bg_color: 'Màu nền trang:',
      window_bg_image: 'Ảnh nền trang (URL):',
      window_bg_size: 'Kiểu co giãn (Size):',
      window_bg_pos: 'Vị trí ảnh (Position):',
      window_bg_repeat: 'Lặp lại ảnh (Repeat):',
      
      input_bg_color: 'Màu nền khung nhập:',
      input_text_color: 'Màu chữ khung nhập:',
      
      // Buttons
      save: 'Lưu',
      cancel: 'Hủy',
      close: 'Đóng',
      apply: 'Áp dụng',
      import: 'Nhập JSON',
      export: 'Xuất JSON',
      reset: 'Khôi phục mặc định',

      // Presets Modal
      preset_modal_title: 'Thư Viện Theme Có Sẵn (Presets)',
      apply_as_default: 'Đặt làm Theme Mặc Định',
      add_as_new: 'Thêm thành Theme Mới',
      preset_applied: 'Đã áp dụng theme preset thành công!',
      
      // Jump List
      jumplist_title: 'Danh Sách Tin Nhắn (Jump List)',
      search_placeholder: 'Tìm kiếm tin nhắn (Hỗ trợ Regex)...',
      total_msgs: 'Tổng tin nhắn:',
      user_msgs: 'User:',
      asst_msgs: 'Assistant:',
      no_msgs: 'Không tìm thấy tin nhắn nào.'
    },
    en: {
      lang_name: 'English',
      lang_switch: 'Tiếng Việt',
      settings_title: 'AI Theme Custom',
      applied_theme: 'Applied Theme:',
      presets_btn: 'Preset Themes',
      theme_editor_btn: 'Theme Editor',
      json_editor_btn: 'JSON Editor / Import Export',
      icon_size: 'Avatar Icon Size (px):',
      chat_max_width: 'Chat Content Max Width (vw):',
      respect_avatar: 'Prevent Standing Image Overlapping Avatar',
      nav_console: 'Navigation Console',
      nav_position: 'Console Position:',
      pos_input_top: 'Input Top Floating',
      pos_header: 'Embedded in Header',
      collapsible: 'Collapsible Message Buttons',
      keyboard_shortcuts: 'Keyboard Shortcuts (Alt+↑/↓, Alt+J, Alt+N)',
      
      // Theme Editor Modal
      editor_title: 'Theme Manager & Editor',
      select_theme: 'Select Theme:',
      new_theme: 'New Theme',
      copy_theme: 'Duplicate',
      delete_theme: 'Delete',
      rename_theme: 'Rename:',
      title_patterns: 'Chat Title Matching Regex (One per line):',
      url_patterns: 'URL Matching Regex (One per line):',
      apply_preset_to_current: 'Load from Preset Theme...',
      
      // Actors
      assistant_sec: 'AI Assistant',
      user_sec: 'User',
      window_sec: 'Window Background',
      input_sec: 'Input Area',
      
      field_name: 'Display Name:',
      field_icon: 'Icon (URL / SVG / Base64):',
      field_standing_img: 'Standing Image (URL):',
      field_text_color: 'Text Color:',
      field_bubble_bg: 'Bubble Background Color:',
      field_padding: 'Padding (px):',
      field_radius: 'Border Radius (px):',
      field_max_width: 'Max Width (%):',
      
      window_bg_color: 'Page Background Color:',
      window_bg_image: 'Page Background Image (URL):',
      window_bg_size: 'Background Size:',
      window_bg_pos: 'Background Position:',
      window_bg_repeat: 'Background Repeat:',
      
      input_bg_color: 'Input Background Color:',
      input_text_color: 'Input Text Color:',
      
      // Buttons
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      apply: 'Apply',
      import: 'Import JSON',
      export: 'Export JSON',
      reset: 'Reset Defaults',

      // Presets Modal
      preset_modal_title: 'Built-in Preset Themes Library',
      apply_as_default: 'Apply to Default Theme',
      add_as_new: 'Add as New Theme',
      preset_applied: 'Preset theme successfully applied!',
      
      // Jump List
      jumplist_title: 'Message Jump List',
      search_placeholder: 'Search messages (Regex supported)...',
      total_msgs: 'Total Messages:',
      user_msgs: 'User:',
      asst_msgs: 'Assistant:',
      no_msgs: 'No messages found.'
    }
  };

  let currentLang = 'vi';

  function t(key) {
    return I18N[currentLang]?.[key] || I18N['en']?.[key] || key;
  }

  // --- Built-in Presets ---
  const BUILTIN_PRESETS = [
    {
      id: 'preset-cyberpunk-neon',
      name: 'Cyberpunk Neon',
      matchPatterns: ['/\\[cyberpunk\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Cyber AI',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300ffcc'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z'/></svg>",
        textColor: '#00ffcc',
        font: "'Fira Code', monospace",
        bubbleBackgroundColor: 'rgba(20, 10, 35, 0.85)',
        bubblePadding: 12,
        bubbleBorderRadius: 12,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'NetRunner',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff007f'><path d='M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#ff66cc',
        font: "'Fira Code', monospace",
        bubbleBackgroundColor: 'rgba(35, 10, 30, 0.85)',
        bubblePadding: 12,
        bubbleBorderRadius: 12,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#0b0612', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#160b24', textColor: '#00ffcc' }
    },
    {
      id: 'preset-sakura-blossom',
      name: 'Sakura Blossom',
      matchPatterns: ['/\\[sakura\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Sakura AI',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff9ebb'><path d='M12 2L9.5 8.5 3 9.5 8 14l-1.5 6.5L12 17l5.5 3.5L16 14l5-4.5-6.5-1z'/></svg>",
        textColor: '#ffd1dc',
        font: "'Quicksand', sans-serif",
        bubbleBackgroundColor: 'rgba(45, 25, 35, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 16,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Traveler',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffb7c5'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#ffb7c5',
        font: "'Quicksand', sans-serif",
        bubbleBackgroundColor: 'rgba(55, 30, 42, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 16,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#1e141a', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#2a1b24', textColor: '#ffe4e9' }
    },
    {
      id: 'preset-emerald-forest',
      name: 'Emerald Forest',
      matchPatterns: ['/\\[emerald\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Forest Spirit',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2350c878'><path d='M12 2L4 12h5v8h6v-8h5z'/></svg>",
        textColor: '#a3e8b8',
        font: "'Segoe UI', sans-serif",
        bubbleBackgroundColor: 'rgba(18, 38, 28, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 10,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Ranger',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232ecc71'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#76d7c4',
        font: "'Segoe UI', sans-serif",
        bubbleBackgroundColor: 'rgba(22, 48, 35, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 10,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#0d1a14', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#14261d', textColor: '#d4efdf' }
    },
    {
      id: 'preset-sunset-vaporwave',
      name: 'Sunset Vaporwave',
      matchPatterns: ['/\\[sunset\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Synthwave AI',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff7e5f'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z'/></svg>",
        textColor: '#ffb37e',
        font: "'Outfit', sans-serif",
        bubbleBackgroundColor: 'rgba(40, 20, 45, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 14,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Dreamer',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23feb47b'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#ffd3b6',
        font: "'Outfit', sans-serif",
        bubbleBackgroundColor: 'rgba(50, 25, 40, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 14,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#1a0c1e', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#25122b', textColor: '#ffe0d6' }
    },
    {
      id: 'preset-deep-space',
      name: 'Deep Space Neon',
      matchPatterns: ['/\\[space\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Cosmos Core',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300bfff'><circle cx='12' cy='12' r='8'/></svg>",
        textColor: '#80d8ff',
        font: "'Roboto', sans-serif",
        bubbleBackgroundColor: 'rgba(10, 25, 45, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 10,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Astronaut',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2340c4ff'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#b3e5fc',
        font: "'Roboto', sans-serif",
        bubbleBackgroundColor: 'rgba(15, 35, 60, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 10,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#050e1a', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#0c1b2e', textColor: '#e0f7fa' }
    },
    {
      id: 'preset-minimalist-slate',
      name: 'Minimalist Slate',
      matchPatterns: ['/\\[slate\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Assistant',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z'/></svg>",
        textColor: '#f1f5f9',
        font: 'system-ui, sans-serif',
        bubbleBackgroundColor: 'rgba(30, 41, 59, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 8,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'You',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#e2e8f0',
        font: 'system-ui, sans-serif',
        bubbleBackgroundColor: 'rgba(51, 65, 85, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 8,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#0f172a', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#1e293b', textColor: '#f8fafc' }
    },
    {
      id: 'preset-golden-luxe',
      name: 'Golden Amber Luxe ⚜️',
      matchPatterns: ['/\\[gold\\]/i', '/\\[luxe\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Royal Oracle',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffd700'><path d='M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z'/></svg>",
        textColor: '#ffe082',
        font: "'Playfair Display', serif",
        bubbleBackgroundColor: 'rgba(38, 28, 12, 0.88)',
        bubblePadding: 12,
        bubbleBorderRadius: 14,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Sovereign',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffb300'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#ffecb3',
        font: "'Playfair Display', serif",
        bubbleBackgroundColor: 'rgba(48, 36, 16, 0.88)',
        bubblePadding: 12,
        bubbleBorderRadius: 14,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#0f0d0e', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#1c1714', textColor: '#fff8e1' }
    },
    {
      id: 'preset-nordic-frost',
      name: 'Nordic Frost Ice ❄️',
      matchPatterns: ['/\\[frost\\]/i', '/\\[ice\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Frost AI',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338bdf8'><path d='M12 2v20M2 12h20M5 5l14 14M19 5L5 19'/></svg>",
        textColor: '#bae6fd',
        font: "'Inter', sans-serif",
        bubbleBackgroundColor: 'rgba(15, 32, 57, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 12,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Explorer',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237dd3fc'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#e0f2fe',
        font: "'Inter', sans-serif",
        bubbleBackgroundColor: 'rgba(20, 42, 75, 0.85)',
        bubblePadding: 10,
        bubbleBorderRadius: 12,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#070f1e', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#0f1d33', textColor: '#f0f9ff' }
    },
    {
      id: 'preset-dracula-gothic',
      name: 'Dracula Gothic 🧛',
      matchPatterns: ['/\\[dracula\\]/i', '/\\[gothic\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Vampire Lord',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cba6f7'><path d='M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10A10 10 0 0 0 12 2zm1 14.5h-2v-2h2v2zm0-4h-2v-5h2v5z'/></svg>",
        textColor: '#f5c2e7',
        font: "'Fira Code', monospace",
        bubbleBackgroundColor: 'rgba(42, 22, 58, 0.88)',
        bubblePadding: 11,
        bubbleBorderRadius: 12,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Hunter',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f38ba8'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#f2cdcd',
        font: "'Fira Code', monospace",
        bubbleBackgroundColor: 'rgba(52, 25, 68, 0.88)',
        bubblePadding: 11,
        bubbleBorderRadius: 12,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#110c1d', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#1e162e', textColor: '#cdd6f4' }
    },
    {
      id: 'preset-tokyo-midnight',
      name: 'Tokyo Midnight 🗼',
      matchPatterns: ['/\\[tokyo\\]/i', '/\\[midnight\\]/i'],
      urlPatterns: [],
      assistant: {
        name: 'Neon AI',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306b6d4'><path d='M12 2L2 7l10 5 10-5-10-5zm0 9l-10-5v10l10 5 10-5V6l-10 5z'/></svg>",
        textColor: '#67e8f9',
        font: "'Outfit', sans-serif",
        bubbleBackgroundColor: 'rgba(18, 22, 45, 0.88)',
        bubblePadding: 10,
        bubbleBorderRadius: 14,
        bubbleMaxWidth: 90
      },
      user: {
        name: 'Cyber Citizen',
        icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f43f5e'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z'/></svg>",
        textColor: '#fda4af',
        font: "'Outfit', sans-serif",
        bubbleBackgroundColor: 'rgba(35, 18, 42, 0.88)',
        bubblePadding: 10,
        bubbleBorderRadius: 14,
        bubbleMaxWidth: 80
      },
      window: { backgroundColor: '#090c15', backgroundImageUrl: null, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' },
      inputArea: { backgroundColor: '#131828', textColor: '#e0e7ff' }
    }
  ];

  // --- Configuration Store ---
  function getDefaultConfig() {
    return {
      language: 'vi',
      options: {
        icon_size: 64,
        chat_content_max_width: null,
        respect_avatar_space: true
      },
      features: {
        fixed_nav_console: { enabled: true, position: 'input_top' },
        collapsible_button: { enabled: true },
        keyboard_shortcuts: { enabled: true }
      },
      defaultSet: JSON.parse(JSON.stringify(BUILTIN_PRESETS[0])),
      themeSets: []
    };
  }

  let config = getDefaultConfig();

  async function loadConfig() {
    try {
      let stored = null;
      if (typeof GM !== 'undefined' && GM.getValue) {
        stored = await GM.getValue(STORAGE_KEY, null);
      } else if (typeof GM_getValue !== 'undefined') {
        stored = GM_getValue(STORAGE_KEY, null);
      } else {
        stored = localStorage.getItem(STORAGE_KEY);
      }
      if (stored) {
        const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
        config = Object.assign(getDefaultConfig(), parsed);
        if (config.language) currentLang = config.language;
      }
    } catch (e) {
      console.warn(`[${APPID}] Error loading config:`, e);
    }
  }

  async function saveConfig() {
    try {
      config.language = currentLang;
      const str = JSON.stringify(config);
      if (typeof GM !== 'undefined' && GM.setValue) {
        await GM.setValue(STORAGE_KEY, str);
      } else if (typeof GM_setValue !== 'undefined') {
        GM_setValue(STORAGE_KEY, str);
      } else {
        localStorage.setItem(STORAGE_KEY, str);
      }
      applyCurrentTheme();
      showToast(t('save'));
    } catch (e) {
      console.error(`[${APPID}] Error saving config:`, e);
    }
  }

  // --- Toast Notification ---
  function showToast(msg) {
    let toast = document.getElementById(`${APPID}-toast`);
    if (!toast) {
      toast = document.createElement('div');
      toast.id = `${APPID}-toast`;
      toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: rgba(18, 18, 24, 0.92); color: #fff;
        padding: 10px 18px; border-radius: 8px; font-size: 14px;
        border: 1px solid rgba(255,255,255,0.15); z-index: 2147483647;
        box-shadow: 0 4px 14px rgba(0,0,0,0.4); backdrop-filter: blur(8px);
        transition: opacity 0.3s ease; opacity: 0; pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
  }

  // --- Theme Engine ---
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

  function getActiveTheme() {
    const pageTitle = document.title || '';
    const pageUrl = window.location.href;

    for (const theme of config.themeSets) {
      for (const patternStr of (theme.urlPatterns || [])) {
        try {
          const match = patternStr.match(/^\/(.*)\/([gimsuy]*)$/);
          const regex = match ? new RegExp(match[1], match[2]) : new RegExp(patternStr, 'i');
          if (regex.test(pageUrl)) return theme;
        } catch (e) {}
      }
    }

    for (const theme of config.themeSets) {
      for (const patternStr of (theme.matchPatterns || [])) {
        try {
          const match = patternStr.match(/^\/(.*)\/([gimsuy]*)$/);
          const regex = match ? new RegExp(match[1], match[2]) : new RegExp(patternStr, 'i');
          if (regex.test(pageTitle)) return theme;
        } catch (e) {}
      }
    }

    return config.defaultSet || BUILTIN_PRESETS[0];
  }

  function applyCurrentTheme() {
    ensureStyleElement();
    const activeTheme = getActiveTheme();
    const isGemini = CURRENT_PLATFORM === PLATFORMS.GEMINI;

    const asst = activeTheme.assistant || {};
    const user = activeTheme.user || {};
    const win = activeTheme.window || {};
    const inp = activeTheme.inputArea || {};
    const opts = config.options || {};

    let css = `
      :root {
        --aitc-icon-size: ${opts.icon_size || 64}px;
        --aitc-asst-text: ${asst.textColor || 'inherit'};
        --aitc-asst-bg: ${asst.bubbleBackgroundColor || 'transparent'};
        --aitc-user-text: ${user.textColor || 'inherit'};
        --aitc-user-bg: ${user.bubbleBackgroundColor || 'transparent'};
        ${win.backgroundColor ? `--main-surface-primary: ${win.backgroundColor} !important; --main-surface-secondary: ${win.backgroundColor} !important;` : ''}
      }
    `;

    if (opts.chat_content_max_width) {
      css += `
        main, .conversation-container, [role="main"] {
          max-width: ${opts.chat_content_max_width}vw !important;
        }
      `;
    }

    if (win.backgroundColor) {
      css += `body, main, #__next, [role="main"], section, .flex-1, .conversation-container, chat-app, infinite-scroller { background-color: ${win.backgroundColor} !important; }`;
    }
    if (win.backgroundImageUrl) {
      css += `
        body, main, #__next {
          background-image: url("${win.backgroundImageUrl}") !important;
          background-size: ${win.backgroundSize || 'cover'} !important;
          background-position: ${win.backgroundPosition || 'center center'} !important;
          background-repeat: ${win.backgroundRepeat || 'no-repeat'} !important;
        }
      `;
    }

    if (inp.backgroundColor) {
      css += `#prompt-textarea, [contenteditable="true"], textarea, form { background-color: ${inp.backgroundColor} !important; }`;
    }
    if (inp.textColor) {
      css += `#prompt-textarea, [contenteditable="true"], textarea { color: ${inp.textColor} !important; }`;
    }

    if (!isGemini) {
      css += `
        [data-message-author-role="assistant"], .agent-turn {
          color: ${asst.textColor || 'inherit'} !important;
          background-color: ${asst.bubbleBackgroundColor || 'transparent'} !important;
          padding: ${asst.bubblePadding ?? 8}px !important;
          border-radius: ${asst.bubbleBorderRadius ?? 10}px !important;
          max-width: ${asst.bubbleMaxWidth ? asst.bubbleMaxWidth + '%' : '100%'} !important;
        }
        [data-message-author-role="user"], .user-turn {
          color: ${user.textColor || 'inherit'} !important;
          background-color: ${user.bubbleBackgroundColor || 'transparent'} !important;
          padding: ${user.bubblePadding ?? 8}px !important;
          border-radius: ${user.bubbleBorderRadius ?? 10}px !important;
          max-width: ${user.bubbleMaxWidth ? user.bubbleMaxWidth + '%' : '100%'} !important;
        }
      `;
    } else {
      css += `
        model-response, .model-response-text, .response-container {
          color: ${asst.textColor || 'inherit'} !important;
          background-color: ${asst.bubbleBackgroundColor || 'transparent'} !important;
          padding: ${asst.bubblePadding ?? 8}px !important;
          border-radius: ${asst.bubbleBorderRadius ?? 10}px !important;
        }
        user-query, .user-query-container {
          color: ${user.textColor || 'inherit'} !important;
          background-color: ${user.bubbleBackgroundColor || 'transparent'} !important;
          padding: ${user.bubblePadding ?? 8}px !important;
          border-radius: ${user.bubbleBorderRadius ?? 10}px !important;
        }
      `;
    }

    if (styleEl) styleEl.textContent = css;

    const label = document.getElementById(`${APPID}-applied-theme-name`);
    if (label) label.textContent = activeTheme.name || 'Default';
  }

  // --- Settings Panel ---
  let settingsPanelEl = null;

  function createSettingsButton() {
    if (document.getElementById(`${APPID}-settings-btn`)) return;

    const btn = document.createElement('button');
    btn.id = `${APPID}-settings-btn`;
    btn.innerHTML = '🎨';
    btn.title = 'AI Theme Custom';
    btn.style.cssText = `
      position: fixed; bottom: 85px; right: 20px; z-index: 2147483647;
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; font-size: 20px; border: none; cursor: pointer;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s;
    `;
    btn.onmouseover = () => { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseout = () => { btn.style.transform = 'scale(1)'; };
    btn.onclick = toggleSettingsPanel;

    document.body.appendChild(btn);
  }

  function toggleSettingsPanel() {
    if (settingsPanelEl && settingsPanelEl.style.display !== 'none') {
      settingsPanelEl.style.display = 'none';
    } else {
      renderSettingsPanel();
    }
  }

  function renderSettingsPanel() {
    if (!settingsPanelEl) {
      settingsPanelEl = document.createElement('div');
      settingsPanelEl.id = `${APPID}-settings-panel`;
      settingsPanelEl.style.cssText = `
        position: fixed; bottom: 135px; right: 20px; z-index: 2147483647;
        width: 320px; max-height: 80vh; overflow-y: auto;
        background: #181825; color: #cdd6f4; border-radius: 12px;
        padding: 16px; border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 8px 32px rgba(0,0,0,0.5); font-family: system-ui, sans-serif;
      `;
      document.body.appendChild(settingsPanelEl);
    }

    const activeTheme = getActiveTheme();

    settingsPanelEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-weight:bold; font-size:15px; color:#89b4fa;">${t('settings_title')}</span>
        <button id="${APPID}-lang-btn" style="background:#313244; color:#a6adc8; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;">
          ${t('lang_switch')}
        </button>
      </div>

      <div style="background:#1e1e2e; padding:10px; border-radius:8px; margin-bottom:12px; font-size:13px;">
        <span style="color:#a6adc8;">${t('applied_theme')}</span>
        <strong id="${APPID}-applied-theme-name" style="color:#a6e3a1; margin-left:6px;">${activeTheme.name || 'Default'}</strong>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
        <button id="${APPID}-open-presets" style="background:linear-gradient(135deg,#f5c2e7,#cba6f7); color:#11111b; border:none; padding:8px; border-radius:6px; font-weight:bold; cursor:pointer;">
          ${t('presets_btn')}
        </button>
        <button id="${APPID}-open-editor" style="background:#313244; color:#cdd6f4; border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:6px; cursor:pointer;">
          ${t('theme_editor_btn')}
        </button>
        <button id="${APPID}-open-json" style="background:#313244; color:#cdd6f4; border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:6px; cursor:pointer;">
          ${t('json_editor_btn')}
        </button>
      </div>

      <hr style="border:none; border-top:1px solid rgba(255,255,255,0.1); margin:12px 0;">

      <div style="font-size:13px; display:flex; flex-direction:column; gap:10px;">
        <div>
          <label style="display:block; margin-bottom:4px; color:#a6adc8;">${t('icon_size')}</label>
          <input type="number" id="${APPID}-opt-icon-size" value="${config.options.icon_size || 64}" style="width:100%; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px;">
        </div>

        <div>
          <label style="display:block; margin-bottom:4px; color:#a6adc8;">${t('chat_max_width')}</label>
          <input type="number" id="${APPID}-opt-max-width" value="${config.options.chat_content_max_width || ''}" placeholder="Auto" style="width:100%; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px;">
        </div>
      </div>
    `;

    settingsPanelEl.style.display = 'block';

    document.getElementById(`${APPID}-lang-btn`).onclick = () => {
      currentLang = currentLang === 'vi' ? 'en' : 'vi';
      saveConfig();
      renderSettingsPanel();
    };

    document.getElementById(`${APPID}-open-presets`).onclick = openPresetsModal;
    document.getElementById(`${APPID}-open-editor`).onclick = openThemeEditorModal;
    document.getElementById(`${APPID}-open-json`).onclick = openJsonModal;

    document.getElementById(`${APPID}-opt-icon-size`).onchange = (e) => {
      config.options.icon_size = parseInt(e.target.value) || 64;
      saveConfig();
    };

    document.getElementById(`${APPID}-opt-max-width`).onchange = (e) => {
      config.options.chat_content_max_width = e.target.value ? parseInt(e.target.value) : null;
      saveConfig();
    };
  }

  // --- Presets Modal ---
  function openPresetsModal() {
    let modal = document.getElementById(`${APPID}-presets-modal`);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = `${APPID}-presets-modal`;
      modal.style.cssText = `
        position: fixed; inset:0; z-index:100001; background:rgba(0,0,0,0.7);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);
      `;
      document.body.appendChild(modal);
    }

    let presetsHtml = BUILTIN_PRESETS.map((p, idx) => `
      <div style="background:#1e1e2e; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:12px; display:flex; flex-direction:column; justify:space-between;">
        <div>
          <div style="font-weight:bold; font-size:15px; color:#89b4fa; margin-bottom:6px;">${p.name}</div>
          <div style="font-size:12px; color:#a6adc8; margin-bottom:8px;">
            Font: ${p.assistant.font || 'Default'}<br>
            Colors: <span style="color:${p.assistant.textColor}">AI</span> / <span style="color:${p.user.textColor}">User</span>
          </div>
        </div>
        <div style="display:flex; gap:6px; margin-top:8px;">
          <button class="${APPID}-apply-default" data-idx="${idx}" style="flex:1; background:#89b4fa; color:#11111b; border:none; padding:6px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">
            ${t('apply_as_default')}
          </button>
          <button class="${APPID}-add-new" data-idx="${idx}" style="flex:1; background:#a6e3a1; color:#11111b; border:none; padding:6px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">
            ${t('add_as_new')}
          </button>
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div style="background:#181825; color:#cdd6f4; width:640px; max-width:92vw; max-height:85vh; border-radius:12px; padding:20px; overflow-y:auto; border:1px solid rgba(255,255,255,0.15);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0; font-size:18px; color:#f5c2e7;">${t('preset_modal_title')}</h3>
          <button id="${APPID}-close-presets" style="background:none; border:none; color:#a6adc8; font-size:20px; cursor:pointer;">✕</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:12px;">
          ${presetsHtml}
        </div>
      </div>
    `;

    document.getElementById(`${APPID}-close-presets`).onclick = () => { modal.remove(); };

    modal.querySelectorAll(`.${APPID}-apply-default`).forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        config.defaultSet = JSON.parse(JSON.stringify(BUILTIN_PRESETS[idx]));
        saveConfig();
        showToast(t('preset_applied'));
        modal.remove();
      };
    });

    modal.querySelectorAll(`.${APPID}-add-new`).forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        const newTheme = JSON.parse(JSON.stringify(BUILTIN_PRESETS[idx]));
        newTheme.id = `${APPID}-theme-${Date.now()}`;
        config.themeSets.push(newTheme);
        saveConfig();
        showToast(t('preset_applied'));
        modal.remove();
      };
    });
  }

  // --- Theme Editor ---
  function openThemeEditorModal() {
    let modal = document.getElementById(`${APPID}-editor-modal`);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = `${APPID}-editor-modal`;
      modal.style.cssText = `
        position: fixed; inset:0; z-index:100001; background:rgba(0,0,0,0.7);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);
      `;
      document.body.appendChild(modal);
    }

    let activeThemeIndex = -1;

    function renderEditor() {
      const isDefault = activeThemeIndex === -1;
      const targetTheme = isDefault ? config.defaultSet : config.themeSets[activeThemeIndex];

      let optionsThemeHtml = `<option value="-1" ${isDefault ? 'selected' : ''}>Default Theme</option>`;
      config.themeSets.forEach((tTheme, i) => {
        optionsThemeHtml += `<option value="${i}" ${activeThemeIndex === i ? 'selected' : ''}>${tTheme.name || 'Theme ' + (i+1)}</option>`;
      });

      modal.innerHTML = `
        <div style="background:#181825; color:#cdd6f4; width:720px; max-width:94vw; max-height:88vh; border-radius:12px; padding:20px; overflow-y:auto; border:1px solid rgba(255,255,255,0.15); font-family:system-ui, sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="margin:0; font-size:18px; color:#89b4fa;">${t('editor_title')}</h3>
            <button id="${APPID}-close-editor" style="background:none; border:none; color:#a6adc8; font-size:20px; cursor:pointer;">✕</button>
          </div>

          <div style="display:flex; gap:8px; align-items:center; margin-bottom:16px; flex-wrap:wrap;">
            <label style="font-weight:bold;">${t('select_theme')}</label>
            <select id="${APPID}-theme-select" style="background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px 12px; border-radius:6px; flex:1;">
              ${optionsThemeHtml}
            </select>
            <button id="${APPID}-new-theme-btn" style="background:#a6e3a1; color:#11111b; border:none; padding:6px 10px; border-radius:6px; font-weight:bold; cursor:pointer;">${t('new_theme')}</button>
            ${!isDefault ? `<button id="${APPID}-del-theme-btn" style="background:#f38ba8; color:#11111b; border:none; padding:6px 10px; border-radius:6px; font-weight:bold; cursor:pointer;">${t('delete_theme')}</button>` : ''}
          </div>

          ${!isDefault ? `
            <div style="margin-bottom:12px;">
              <label style="display:block; margin-bottom:4px;">${t('rename_theme')}</label>
              <input type="text" id="${APPID}-ed-name" value="${targetTheme.name || ''}" style="width:100%; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px;">
            </div>
            <div style="margin-bottom:12px;">
              <label style="display:block; margin-bottom:4px;">${t('title_patterns')}</label>
              <textarea id="${APPID}-ed-title-pat" style="width:100%; height:40px; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px;">${(targetTheme.matchPatterns || []).join('\n')}</textarea>
            </div>
          ` : ''}

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">
            <div style="background:#1e1e2e; padding:12px; border-radius:8px;">
              <h4 style="margin:0 0 10px 0; color:#89b4fa;">${t('assistant_sec')}</h4>
              
              <label style="display:block; font-size:12px; margin-bottom:2px;">${t('field_name')}</label>
              <input type="text" id="${APPID}-asst-name" value="${targetTheme.assistant?.name || ''}" style="width:100%; background:#313244; color:#fff; border:1px solid #45475a; padding:5px; border-radius:4px; margin-bottom:8px;">
              
              <label style="display:block; font-size:12px; margin-bottom:2px;">${t('field_text_color')}</label>
              <input type="color" id="${APPID}-asst-color" value="${targetTheme.assistant?.textColor || '#00ffcc'}" style="width:100%; height:30px; background:#313244; border:none; border-radius:4px; margin-bottom:8px; cursor:pointer;">
              
              <label style="display:block; font-size:12px; margin-bottom:2px;">${t('field_bubble_bg')}</label>
              <input type="text" id="${APPID}-asst-bg" value="${targetTheme.assistant?.bubbleBackgroundColor || ''}" placeholder="rgba(20,10,35,0.85)" style="width:100%; background:#313244; color:#fff; border:1px solid #45475a; padding:5px; border-radius:4px;">
            </div>

            <div style="background:#1e1e2e; padding:12px; border-radius:8px;">
              <h4 style="margin:0 0 10px 0; color:#f5c2e7;">${t('user_sec')}</h4>
              
              <label style="display:block; font-size:12px; margin-bottom:2px;">${t('field_name')}</label>
              <input type="text" id="${APPID}-user-name" value="${targetTheme.user?.name || ''}" style="width:100%; background:#313244; color:#fff; border:1px solid #45475a; padding:5px; border-radius:4px; margin-bottom:8px;">
              
              <label style="display:block; font-size:12px; margin-bottom:2px;">${t('field_text_color')}</label>
              <input type="color" id="${APPID}-user-color" value="${targetTheme.user?.textColor || '#ff66cc'}" style="width:100%; height:30px; background:#313244; border:none; border-radius:4px; margin-bottom:8px; cursor:pointer;">
              
              <label style="display:block; font-size:12px; margin-bottom:2px;">${t('field_bubble_bg')}</label>
              <input type="text" id="${APPID}-user-bg" value="${targetTheme.user?.bubbleBackgroundColor || ''}" placeholder="rgba(35,10,30,0.85)" style="width:100%; background:#313244; color:#fff; border:1px solid #45475a; padding:5px; border-radius:4px;">
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
            <button id="${APPID}-save-editor" style="background:#89b4fa; color:#11111b; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">
              ${t('save')}
            </button>
          </div>
        </div>
      `;

      document.getElementById(`${APPID}-close-editor`).onclick = () => modal.remove();

      document.getElementById(`${APPID}-theme-select`).onchange = (e) => {
        activeThemeIndex = parseInt(e.target.value);
        renderEditor();
      };

      document.getElementById(`${APPID}-new-theme-btn`).onclick = () => {
        const newTheme = JSON.parse(JSON.stringify(BUILTIN_PRESETS[0]));
        newTheme.id = `${APPID}-theme-${Date.now()}`;
        newTheme.name = `Theme ${config.themeSets.length + 1}`;
        config.themeSets.push(newTheme);
        activeThemeIndex = config.themeSets.length - 1;
        renderEditor();
      };

      if (!isDefault) {
        document.getElementById(`${APPID}-del-theme-btn`).onclick = () => {
          config.themeSets.splice(activeThemeIndex, 1);
          activeThemeIndex = -1;
          renderEditor();
        };
      }

      document.getElementById(`${APPID}-save-editor`).onclick = () => {
        if (!targetTheme.assistant) targetTheme.assistant = {};
        if (!targetTheme.user) targetTheme.user = {};

        targetTheme.assistant.name = document.getElementById(`${APPID}-asst-name`).value;
        targetTheme.assistant.textColor = document.getElementById(`${APPID}-asst-color`).value;
        targetTheme.assistant.bubbleBackgroundColor = document.getElementById(`${APPID}-asst-bg`).value;

        targetTheme.user.name = document.getElementById(`${APPID}-user-name`).value;
        targetTheme.user.textColor = document.getElementById(`${APPID}-user-color`).value;
        targetTheme.user.bubbleBackgroundColor = document.getElementById(`${APPID}-user-bg`).value;

        if (!isDefault) {
          targetTheme.name = document.getElementById(`${APPID}-ed-name`).value;
          targetTheme.matchPatterns = document.getElementById(`${APPID}-ed-title-pat`).value.split('\n').filter(s => s.trim());
        }

        saveConfig();
        modal.remove();
      };
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
        position: fixed; inset:0; z-index:100001; background:rgba(0,0,0,0.7);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background:#181825; color:#cdd6f4; width:680px; max-width:92vw; max-height:85vh; border-radius:12px; padding:20px; overflow-y:auto; border:1px solid rgba(255,255,255,0.15);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="margin:0; font-size:18px; color:#89b4fa;">${t('json_editor_btn')}</h3>
          <button id="${APPID}-close-json" style="background:none; border:none; color:#a6adc8; font-size:20px; cursor:pointer;">✕</button>
        </div>

        <textarea id="${APPID}-json-textarea" style="width:100%; height:320px; background:#1e1e2e; color:#a6e3a1; font-family:monospace; border:1px solid #45475a; padding:10px; border-radius:6px; box-sizing:border-box;">${JSON.stringify(config, null, 2)}</textarea>

        <div style="display:flex; justify-content:space-between; margin-top:12px;">
          <button id="${APPID}-reset-btn" style="background:#f38ba8; color:#11111b; border:none; padding:8px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">${t('reset')}</button>
          <div style="display:flex; gap:8px;">
            <button id="${APPID}-save-json" style="background:#a6e3a1; color:#11111b; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">${t('save')}</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById(`${APPID}-close-json`).onclick = () => modal.remove();

    document.getElementById(`${APPID}-reset-btn`).onclick = () => {
      config = getDefaultConfig();
      saveConfig();
      modal.remove();
    };

    document.getElementById(`${APPID}-save-json`).onclick = () => {
      try {
        const parsed = JSON.parse(document.getElementById(`${APPID}-json-textarea`).value);
        config = parsed;
        saveConfig();
        modal.remove();
      } catch (e) {
        alert('Syntax Error JSON: ' + e.message);
      }
    };
  }

  // --- Keyboard Shortcuts & Init ---
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        showToast('Jump List (Alt+J)');
      }
    });
  }

  function ensureBody(callback) {
    if (document.body) {
      callback();
    } else {
      const interval = setInterval(() => {
        if (document.body) {
          clearInterval(interval);
          callback();
        }
      }, 50);
      document.addEventListener('DOMContentLoaded', () => {
        clearInterval(interval);
        if (document.body) callback();
      }, { once: true });
    }
  }

  async function init() {
    await loadConfig();
    ensureBody(() => {
      applyCurrentTheme();
      createSettingsButton();
      setupKeyboardShortcuts();

      const observer = new MutationObserver(() => {
        applyCurrentTheme();
        createSettingsButton();
      });
      const targetNode = document.querySelector('title') || document.head || document.body || document.documentElement;
      if (targetNode) {
        observer.observe(targetNode, { subtree: true, characterData: true, childList: true });
      }

      setInterval(() => {
        if (document.body) {
          createSettingsButton();
          applyCurrentTheme();
        }
      }, 1500);
    });
  }

  init();
})();
