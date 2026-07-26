// ==UserScript==
// @name         AI Prompt Deck
// @namespace    https://github.com/ai-prompt-deck
// @version      2.0.1
// @license      MIT
// @description  1-Click Prompt & Text Snippet manager for ChatGPT, Gemini, and Claude. Features EN/VI multilingual support, category manager, and JSON import/export.
// @icon         data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff9800'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E
// @author       AI Prompt Team
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://gemini.google.com/*
// @match        https://claude.ai/*
// @include      *://chatgpt.com/*
// @include      *://chat.openai.com/*
// @include      *://gemini.google.com/*
// @include      *://claude.ai/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  const APPID = 'ai-prompt-deck';
  const STORAGE_KEY = `${APPID}-config`;

  // --- i18n Dictionary ---
  const I18N = {
    vi: {
      lang_switch: 'English',
      panel_title: 'Nút Prompt Nhanh (AI Prompt Deck)',
      add_btn: 'Thêm Nút Mới',
      edit_btn: 'Quản Lý',
      close: 'Đóng',
      btn_label: 'Nhãn nút (Tên):',
      btn_content: 'Nội dung Prompt:',
      btn_category: 'Danh mục:',
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      import_export: 'Import / Export JSON',
      placeholder_prompt: 'Nhập nội dung prompt bạn hay dùng...',
      inserted_toast: 'Đã chèn prompt thành công!',
      default_cat: 'Chung'
    },
    en: {
      lang_switch: 'Tiếng Việt',
      panel_title: 'AI Prompt Deck',
      add_btn: 'Add New Button',
      edit_btn: 'Manage',
      close: 'Close',
      btn_label: 'Button Label:',
      btn_content: 'Prompt Content:',
      btn_category: 'Category:',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      import_export: 'Import / Export JSON',
      placeholder_prompt: 'Type your frequently used prompt here...',
      inserted_toast: 'Prompt inserted successfully!',
      default_cat: 'General'
    }
  };

  let currentLang = 'vi';
  function t(key) {
    return I18N[currentLang]?.[key] || I18N['en']?.[key] || key;
  }

  // --- Default Presets ---
  function getDefaultButtons() {
    return [
      { id: 'btn-1', label: 'Fix Code Bug', content: 'Hãy kiểm tra và tìm lỗi sai trong đoạn mã nguồn dưới đây, sau đó giải thích nguyên nhân và đưa ra bản sửa lỗi tối ưu:\n\n', category: 'Coding' },
      { id: 'btn-2', label: 'Summarize', content: 'Hãy tóm tắt lại nội dung dưới đây thành các ý chính ngắn gọn, súc tích và dễ hiểu:\n\n', category: 'General' },
      { id: 'btn-3', label: 'Translate EN', content: 'Please translate the following text into natural, fluent English:\n\n', category: 'Translation' },
      { id: 'btn-4', label: 'Refine Writing', content: 'Hãy viết lại đoạn văn bản dưới đây theo phong cách chuyên nghiệp, trôi chảy và hấp dẫn hơn:\n\n', category: 'Writing' }
    ];
  }

  let config = {
    language: 'vi',
    buttons: getDefaultButtons()
  };

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
        config = Object.assign({ language: 'vi', buttons: getDefaultButtons() }, parsed);
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
      renderQuickBar();
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
        position: fixed; bottom: 20px; left: 20px;
        background: rgba(24, 24, 37, 0.92); color: #fff;
        padding: 8px 16px; border-radius: 8px; font-size: 13px;
        border: 1px solid rgba(255,152,0,0.3); z-index: 2147483647;
        box-shadow: 0 4px 14px rgba(0,0,0,0.4); backdrop-filter: blur(8px);
        transition: opacity 0.3s ease; opacity: 0; pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  }

  // --- Insert Text into Textarea ---
  function insertTextToInput(text) {
    const selectors = [
      '#prompt-textarea',
      'textarea',
      '[contenteditable="true"]',
      'div[role="textbox"]',
      'p[data-placeholder]',
      'div.ProseMirror'
    ];

    let targetEl = null;
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        targetEl = el;
        break;
      }
    }

    if (!targetEl) {
      alert('Không tìm thấy ô nhập liệu trên trang!');
      return;
    }

    targetEl.focus();

    if (targetEl.tagName === 'TEXTAREA' || targetEl.tagName === 'INPUT') {
      const start = targetEl.selectionStart || 0;
      const end = targetEl.selectionEnd || 0;
      const val = targetEl.value;
      targetEl.value = val.substring(0, start) + text + val.substring(end);
      targetEl.selectionStart = targetEl.selectionEnd = start + text.length;
      targetEl.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (targetEl.isContentEditable) {
      try {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          targetEl.innerText += text;
        }
      } catch (e) {
        targetEl.innerText += text;
      }
      targetEl.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }

    showToast(t('inserted_toast'));
  }

  // --- Quick Bar UI ---
  let quickBarEl = null;

  function createToggleBtn() {
    if (document.getElementById(`${APPID}-toggle-btn`)) return;

    const btn = document.createElement('button');
    btn.id = `${APPID}-toggle-btn`;
    btn.innerHTML = '✏️';
    btn.title = 'AI Prompt Deck';
    btn.style.cssText = `
      position: fixed; bottom: 85px; left: 20px; z-index: 2147483647;
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: #fff; font-size: 20px; border: none; cursor: pointer;
      box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s;
    `;
    btn.onmouseover = () => { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseout = () => { btn.style.transform = 'scale(1)'; };
    btn.onclick = toggleQuickBar;

    document.body.appendChild(btn);
  }

  function toggleQuickBar() {
    if (quickBarEl && quickBarEl.style.display !== 'none') {
      quickBarEl.style.display = 'none';
    } else {
      renderQuickBar();
    }
  }

  function renderQuickBar() {
    if (!quickBarEl) {
      quickBarEl = document.createElement('div');
      quickBarEl.id = `${APPID}-quick-bar`;
      quickBarEl.style.cssText = `
        position: fixed; bottom: 135px; left: 20px; z-index: 2147483647;
        width: 320px; max-height: 75vh; overflow-y: auto;
        background: #181825; color: #cdd6f4; border-radius: 12px;
        padding: 14px; border: 1px solid rgba(255,152,0,0.3);
        box-shadow: 0 8px 32px rgba(0,0,0,0.5); font-family: system-ui, sans-serif;
      `;
      document.body.appendChild(quickBarEl);
    }

    let buttonsHtml = config.buttons.map(b => `
      <button class="${APPID}-prompt-item" data-id="${b.id}" style="
        background: #2a2b3d; color: #ffb74d; border: 1px solid rgba(255,183,77,0.2);
        padding: 8px 12px; border-radius: 8px; text-align: left; cursor: pointer;
        font-weight: 500; font-size: 13px; transition: background 0.2s;
        display: flex; justify-content: space-between; align-items: center;
      ">
        <span>${b.label}</span>
        <span style="font-size: 10px; color: #a6adc8; background: #1e1e2e; padding: 2px 6px; border-radius: 4px;">${b.category || 'General'}</span>
      </button>
    `).join('');

    quickBarEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-weight:bold; font-size:14px; color:#ffb74d;">${t('panel_title')}</span>
        <button id="${APPID}-lang-btn" style="background:#313244; color:#a6adc8; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:11px;">
          ${t('lang_switch')}
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px;">
        ${buttonsHtml}
      </div>

      <div style="display:flex; gap:6px; margin-top:10px;">
        <button id="${APPID}-add-btn" style="flex:1; background:#ff9800; color:#11111b; border:none; padding:7px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">
          ${t('add_btn')}
        </button>
        <button id="${APPID}-manage-btn" style="background:#313244; color:#cdd6f4; border:1px solid rgba(255,255,255,0.1); padding:7px 12px; border-radius:6px; cursor:pointer; font-size:12px;">
          ${t('edit_btn')}
        </button>
      </div>
    `;

    quickBarEl.style.display = 'block';

    document.getElementById(`${APPID}-lang-btn`).onclick = () => {
      currentLang = currentLang === 'vi' ? 'en' : 'vi';
      saveConfig();
    };

    quickBarEl.querySelectorAll(`.${APPID}-prompt-item`).forEach(btn => {
      btn.onclick = (e) => {
        const id = btn.getAttribute('data-id');
        const item = config.buttons.find(b => b.id === id);
        if (item) {
          insertTextToInput(item.content);
        }
      };
    });

    document.getElementById(`${APPID}-add-btn`).onclick = () => openEditModal();
    document.getElementById(`${APPID}-manage-btn`).onclick = () => openManageModal();
  }

  // --- Add / Edit Button Modal ---
  function openEditModal(existingItem = null) {
    let modal = document.getElementById(`${APPID}-edit-modal`);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = `${APPID}-edit-modal`;
      modal.style.cssText = `
        position: fixed; inset:0; z-index:2147483647; background:rgba(0,0,0,0.7);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background:#181825; color:#cdd6f4; width:450px; max-width:92vw; border-radius:12px; padding:18px; border:1px solid rgba(255,152,0,0.3); font-family:system-ui, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="margin:0; color:#ffb74d;">${existingItem ? t('edit_btn') : t('add_btn')}</h4>
          <button id="${APPID}-close-edit" style="background:none; border:none; color:#a6adc8; font-size:18px; cursor:pointer;">✕</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
          <div>
            <label style="display:block; margin-bottom:4px; color:#a6adc8;">${t('btn_label')}</label>
            <input type="text" id="${APPID}-in-label" value="${existingItem?.label || ''}" placeholder="Fix Code Bug" style="width:100%; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px; box-sizing:border-box;">
          </div>

          <div>
            <label style="display:block; margin-bottom:4px; color:#a6adc8;">${t('btn_category')}</label>
            <input type="text" id="${APPID}-in-cat" value="${existingItem?.category || 'General'}" placeholder="Coding, Writing..." style="width:100%; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px; box-sizing:border-box;">
          </div>

          <div>
            <label style="display:block; margin-bottom:4px; color:#a6adc8;">${t('btn_content')}</label>
            <textarea id="${APPID}-in-content" placeholder="${t('placeholder_prompt')}" style="width:100%; height:120px; background:#1e1e2e; color:#fff; border:1px solid #45475a; padding:6px; border-radius:4px; box-sizing:border-box;">${existingItem?.content || ''}</textarea>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px;">
          <button id="${APPID}-save-btn-item" style="background:#ff9800; color:#11111b; border:none; padding:7px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">
            ${t('save')}
          </button>
        </div>
      </div>
    `;

    document.getElementById(`${APPID}-close-edit`).onclick = () => modal.remove();

    document.getElementById(`${APPID}-save-btn-item`).onclick = () => {
      const label = document.getElementById(`${APPID}-in-label`).value.trim();
      const category = document.getElementById(`${APPID}-in-cat`).value.trim() || 'General';
      const content = document.getElementById(`${APPID}-in-content`).value;

      if (!label || !content) {
        alert('Vui lòng nhập đầy đủ tên nhãn và nội dung prompt!');
        return;
      }

      if (existingItem) {
        existingItem.label = label;
        existingItem.category = category;
        existingItem.content = content;
      } else {
        config.buttons.push({
          id: `btn-${Date.now()}`,
          label,
          category,
          content
        });
      }

      saveConfig();
      modal.remove();
    };
  }

  // --- Manage Buttons Modal ---
  function openManageModal() {
    let modal = document.getElementById(`${APPID}-manage-modal`);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = `${APPID}-manage-modal`;
      modal.style.cssText = `
        position: fixed; inset:0; z-index:2147483647; background:rgba(0,0,0,0.7);
        display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);
      `;
      document.body.appendChild(modal);
    }

    function renderList() {
      let itemsHtml = config.buttons.map((b, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#1e1e2e; padding:8px 12px; border-radius:6px; border:1px solid #313244;">
          <div>
            <strong>${b.label}</strong> <span style="font-size:11px; color:#a6adc8;">(${b.category})</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="${APPID}-edit-item" data-idx="${idx}" style="background:#89b4fa; color:#11111b; border:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">Edit</button>
            <button class="${APPID}-del-item" data-idx="${idx}" style="background:#f38ba8; color:#11111b; border:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">${t('delete')}</button>
          </div>
        </div>
      `).join('');

      modal.innerHTML = `
        <div style="background:#181825; color:#cdd6f4; width:520px; max-width:92vw; max-height:80vh; border-radius:12px; padding:18px; overflow-y:auto; border:1px solid rgba(255,152,0,0.3); font-family:system-ui, sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h4 style="margin:0; color:#ffb74d;">${t('edit_btn')}</h4>
            <button id="${APPID}-close-manage" style="background:none; border:none; color:#a6adc8; font-size:18px; cursor:pointer;">✕</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
            ${itemsHtml}
          </div>
        </div>
      `;

      document.getElementById(`${APPID}-close-manage`).onclick = () => modal.remove();

      modal.querySelectorAll(`.${APPID}-edit-item`).forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(btn.getAttribute('data-idx'));
          openEditModal(config.buttons[idx]);
        };
      });

      modal.querySelectorAll(`.${APPID}-del-item`).forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(btn.getAttribute('data-idx'));
          config.buttons.splice(idx, 1);
          saveConfig();
          renderList();
        };
      });
    }

    renderList();
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

  // --- Init ---
  async function init() {
    await loadConfig();
    ensureBody(() => {
      createToggleBtn();
    });
  }

  init();
})();
