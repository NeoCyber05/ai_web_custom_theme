const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.id = '';
    this.className = '';
    this.textContent = '';
    this.attributes = {};
    this.dataset = {};
    this.style = {
      cssText: '',
      _props: {},
      setProperty(name, value) {
        this._props[name] = value;
        this[name] = value;
      },
    };
    this._connectedRoot = false;
  }

  get parentElement() {
    return this.parentNode;
  }

  get isConnected() {
    return this._connectedRoot || Boolean(this.parentNode?.isConnected);
  }

  contains(node) {
    return this === node || this.children.some((child) => child.contains(node));
  }

  appendChild(node) {
    node.remove();
    this.children.push(node);
    node.parentNode = this;
    return node;
  }

  append(...nodes) {
    for (const node of nodes) this.appendChild(node);
  }

  prepend(node) {
    node.remove();
    this.children.unshift(node);
    node.parentNode = this;
  }

  replaceChildren(...nodes) {
    for (const child of [...this.children]) child.remove();
    for (const node of nodes) this.appendChild(node);
  }

  remove() {
    if (!this.parentNode) return;
    const index = this.parentNode.children.indexOf(this);
    if (index >= 0) this.parentNode.children.splice(index, 1);
    this.parentNode = null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'id') this.id = String(value);
  }
}

function walk(root) {
  return [root, ...root.children.flatMap(walk)];
}

test('places the ChatGPT button in the exact trailing grid area instead of the outer grid shell', () => {
  const start = source.indexOf('  function createPaletteIcon() {');
  const end = source.indexOf('\n  // --- Settings Button Lifecycle ---', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const functionSource = source.slice(start, end);

  const body = new FakeElement('body');
  body._connectedRoot = true;
  const gridShell = new FakeElement('div');
  gridShell.className = "[grid-template-areas:'leading_primary_trailing']";
  body.appendChild(gridShell);
  const exactTrailing = new FakeElement('div');
  exactTrailing.className = 'flex [grid-area:trailing]';
  gridShell.appendChild(exactTrailing);
  const nativeControls = new FakeElement('div');
  exactTrailing.appendChild(nativeControls);

  const exactSelector = 'form[data-type="unified-composer"] div[class*="[grid-area:trailing]"]';
  const document = {
    body,
    createElement: (tagName) => new FakeElement(tagName),
    createElementNS: (_ns, tagName) => new FakeElement(tagName),
    createTextNode: (text) => {
      const node = new FakeElement('#text');
      node.textContent = String(text);
      return node;
    },
    getElementById: (id) => walk(body).find((element) => element.id === id) || null,
    querySelector: (selector) => {
      if (selector.includes(',')) return gridShell;
      if (selector === exactSelector) return exactTrailing;
      return null;
    },
  };

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
      else el.setAttribute(key, value === true ? '' : String(value));
    }
    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      el.append(child instanceof FakeElement ? child : document.createTextNode(String(child)));
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
      if (el instanceof FakeElement) return el;
    }
    return null;
  }

  function getAnchorSelectors() {
    return [exactSelector];
  }

  const factory = new Function(
    'document',
    'HTMLElement',
    'Node',
    'CURRENT_PLATFORM',
    'PLATFORMS',
    'APPID',
    'PALETTE_ICON_PATH',
    'GEMINI_ANCHOR_SELECTORS',
    'CHATGPT_ANCHOR_SELECTOR',
    'h',
    'mount',
    'queryFirstElement',
    'getAnchorSelectors',
    'toggleSettingsPanel',
    't',
    `${functionSource}; return ensureSettingsButtonPlacement;`,
  );
  const place = factory(
    document,
    FakeElement,
    FakeElement,
    'ChatGPT',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
    'ai-theme-custom',
    'M480-80',
    [
      'input-area-v2 .trailing-actions-wrapper',
      '.trailing-actions-wrapper',
    ],
    exactSelector,
    h,
    mount,
    queryFirstElement,
    getAnchorSelectors,
    () => {},
    (key) => key,
  );

  place();

  const button = document.getElementById('ai-theme-custom-settings-btn');
  assert.deepEqual(exactTrailing.children, [button, nativeControls]);
  assert.deepEqual(gridShell.children, [exactTrailing]);
});

test('repositions the Gemini button when Angular replaces children inside the input area', () => {
  const startMarker = '  // --- Settings Button Lifecycle ---';
  const endMarker = '\n\n  // --- Settings Panel ---';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const block = source.slice(start + startMarker.length, end);
  assert.match(block, /function observeInputAreaForButtonPlacement/);

  const inputArea = new FakeElement('input-area-v2');
  inputArea._connectedRoot = true;
  const anchor = new FakeElement('div');
  inputArea.appendChild(anchor);
  const button = new FakeElement('button');
  button.id = 'ai-theme-custom-settings-btn';

  const frames = [];
  const observers = [];
  class FakeMutationObserver {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }

    observe(target, options) {
      this.target = target;
      this.options = options;
    }

    disconnect() {}
  }

  const document = {
    querySelector: (selector) => {
      if (selector === 'input-area-v2') return inputArea;
      if (selector === 'input-area-v2 .trailing-actions-wrapper') return anchor;
      return null;
    },
    getElementById: (id) => (button.id === id && button.isConnected ? button : null),
  };
  let placementCount = 0;
  const ensurePlacement = () => {
    placementCount += 1;
    anchor.prepend(button);
  };

  function queryFirstElement(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el instanceof FakeElement) return el;
    }
    return null;
  }

  function getAnchorSelectors() {
    return [
      'input-area-v2 .trailing-actions-wrapper',
      '.trailing-actions-wrapper',
    ];
  }

  function getInputAreaSelectors() {
    return ['input-area-v2', 'input-container', '.input-area-container'];
  }

  const factory = new Function(
    'requestAnimationFrame',
    'ensureSettingsButtonPlacement',
    'MutationObserver',
    'document',
    'HTMLElement',
    'CURRENT_PLATFORM',
    'PLATFORMS',
    'APPID',
    'GEMINI_ANCHOR_SELECTORS',
    'GEMINI_INPUT_AREA_SELECTORS',
    'CHATGPT_ANCHOR_SELECTOR',
    'CHATGPT_INPUT_AREA_SELECTOR',
    'queryFirstElement',
    'getAnchorSelectors',
    'getInputAreaSelectors',
    `${block}; return { observeInputAreaForButtonPlacement };`,
  );
  const lifecycle = factory(
    (callback) => {
      frames.push(callback);
      return frames.length;
    },
    ensurePlacement,
    FakeMutationObserver,
    document,
    FakeElement,
    'Gemini',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
    'ai-theme-custom',
    [
      'input-area-v2 .trailing-actions-wrapper',
      '.trailing-actions-wrapper',
    ],
    ['input-area-v2', 'input-container', '.input-area-container'],
    'form[data-type="unified-composer"] div[class*="[grid-area:trailing]"]',
    'form[data-type="unified-composer"]',
    queryFirstElement,
    getAnchorSelectors,
    getInputAreaSelectors,
  );

  lifecycle.observeInputAreaForButtonPlacement(inputArea);
  assert.equal(observers.length, 1);
  assert.deepEqual(observers[0].options, { childList: true, subtree: true });
  frames.shift()();
  assert.equal(placementCount, 1);

  button.remove();
  observers[0].callback();
  assert.equal(frames.length, 1);
  frames.shift()();

  assert.equal(placementCount, 2);
  assert.equal(button.parentElement, anchor);
});
