const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const userscriptSource = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');
const functionStart = userscriptSource.indexOf('  function createPaletteIcon() {');
const functionEnd = userscriptSource.indexOf('\n\n  // --- Settings Panel ---', functionStart);

assert.notEqual(functionStart, -1, 'palette icon helper must exist');
assert.notEqual(functionEnd, -1, 'settings-button placement function boundary must exist');

const placementFunctionSource = userscriptSource.slice(functionStart, functionEnd);

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.style = {
      cssText: '',
      _props: {},
      setProperty(name, value) {
        this._props[name] = value;
        this[name] = value;
      },
    };
    this.attributes = {};
    this.dataset = {};
    this.id = '';
    this.className = '';
    this.title = '';
    this.type = '';
    this.textContent = '';
    this.onclick = null;
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

  prepend(node) {
    node.remove();
    this.children.unshift(node);
    node.parentNode = this;
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
    if (name === 'class') this.className = String(value);
  }
}

function walk(root) {
  return [root, ...root.children.flatMap(walk)];
}

test('places the Claude theme button in the composer toolbar row', () => {
  const body = new FakeElement('body');
  body._connectedRoot = true;

  const toolbarRow = new FakeElement('div');
  toolbarRow.className = 'flex-row';
  body.appendChild(toolbarRow);

  const nativeControls = new FakeElement('div');
  toolbarRow.appendChild(nativeControls);

  const claudeAnchorSelector = 'fieldset:has([data-testid="chat-input"]) div.relative.flex.gap-2.w-full.items-center > div.flex-row';
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
      if (selector === claudeAnchorSelector) return toolbarRow;
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
    return [claudeAnchorSelector];
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
    `${placementFunctionSource}; return ensureSettingsButtonPlacement;`,
  );

  const ensurePlacement = factory(
    document,
    FakeElement,
    FakeElement,
    'Claude',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
    'ai-theme-custom',
    'M480-80',
    [],
    '',
    h,
    mount,
    queryFirstElement,
    getAnchorSelectors,
    () => {},
    (key) => key,
  );

  ensurePlacement();

  const themeButton = document.getElementById('ai-theme-custom-settings-btn');
  assert.deepEqual(toolbarRow.children, [themeButton, nativeControls]);
});
