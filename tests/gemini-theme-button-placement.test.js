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
    this.onmouseover = null;
    this.onmouseout = null;
    this.onfocus = null;
    this.onblur = null;
    this._connectedRoot = false;
  }

  get parentElement() {
    return this.parentNode;
  }

  get nextElementSibling() {
    if (!this.parentNode) return null;
    const index = this.parentNode.children.indexOf(this);
    return this.parentNode.children[index + 1] || null;
  }

  get isConnected() {
    return this._connectedRoot || Boolean(this.parentNode?.isConnected);
  }

  contains(node) {
    return this === node || this.children.some((child) => child.contains(node));
  }

  querySelector(selector) {
    if (selector === ':scope > .model-picker-container') {
      return this.children.find((child) => child.className === 'model-picker-container') || null;
    }
    return null;
  }

  insertBefore(node, referenceNode) {
    node.remove();
    const index = this.children.indexOf(referenceNode);
    if (index === -1) throw new Error('reference node is not a child');
    this.children.splice(index, 0, node);
    node.parentNode = this;
    return node;
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

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
}

function walk(root) {
  return [root, ...root.children.flatMap(walk)];
}

function createHarness({ withModelPicker = true } = {}) {
  const body = new FakeElement('body');
  body._connectedRoot = true;
  let createButtonCount = 0;

  const trailingActions = new FakeElement('div');
  trailingActions.className = 'trailing-actions-wrapper';
  body.appendChild(trailingActions);

  const modelPicker = new FakeElement('div');
  modelPicker.className = 'model-picker-container';
  if (withModelPicker) trailingActions.appendChild(modelPicker);

  const micActions = new FakeElement('div');
  micActions.className = 'input-buttons-wrapper-bottom';
  trailingActions.appendChild(micActions);

  const document = {
    body,
    createElement: (tagName) => {
      if (tagName === 'button') createButtonCount += 1;
      return new FakeElement(tagName);
    },
    createElementNS: (_ns, tagName) => new FakeElement(tagName),
    createTextNode: (text) => {
      const node = new FakeElement('#text');
      node.textContent = String(text);
      return node;
    },
    getElementById: (id) => walk(body).find((element) => element.id === id) || null,
    querySelector: (selector) => {
      if (selector.includes('trailing-actions-wrapper')) return trailingActions;
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
    return [
      'input-area-v2 .trailing-actions-wrapper',
      '.trailing-actions-wrapper',
      'input-container .input-buttons-wrapper-bottom',
      '.input-area-container .trailing-actions-wrapper',
    ];
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
    'Gemini',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
    'ai-theme-custom',
    'M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z',
    [
      'input-area-v2 .trailing-actions-wrapper',
      '.trailing-actions-wrapper',
      'input-container .input-buttons-wrapper-bottom',
      '.input-area-container .trailing-actions-wrapper',
    ],
    'form[data-type="unified-composer"] div[class*="[grid-area:trailing]"]',
    h,
    mount,
    queryFirstElement,
    getAnchorSelectors,
    () => {},
    (key) => (key === 'aria_settings' ? 'AI Theme Custom' : key),
  );

  return {
    body,
    document,
    ensurePlacement,
    getCreateButtonCount: () => createButtonCount,
    micActions,
    modelPicker,
    trailingActions,
  };
}

test('places the theme button immediately before Gemini model picker', () => {
  const harness = createHarness();

  harness.ensurePlacement();

  const themeButton = harness.document.getElementById('ai-theme-custom-settings-btn');
  assert.deepEqual(
    harness.trailingActions.children,
    [themeButton, harness.modelPicker, harness.micActions],
  );
});

test('uses the reference trailing-actions anchor even when model picker markup differs', () => {
  const harness = createHarness({ withModelPicker: false });

  harness.ensurePlacement();

  const themeButton = harness.document.getElementById('ai-theme-custom-settings-btn');
  assert.deepEqual(harness.trailingActions.children, [themeButton, harness.micActions]);
});

test('does not duplicate the Gemini theme button after repeated placement', () => {
  const harness = createHarness();

  harness.ensurePlacement();
  harness.ensurePlacement();

  const matchingButtons = walk(harness.body)
    .filter((element) => element.id === 'ai-theme-custom-settings-btn');
  assert.equal(matchingButtons.length, 1);
});

test('renders a filled Material palette icon with an accessible label', () => {
  const harness = createHarness();

  harness.ensurePlacement();

  const themeButton = harness.document.getElementById('ai-theme-custom-settings-btn');
  const svg = themeButton.children[0];
  assert.equal(svg.tagName, 'SVG');
  assert.equal(svg.attributes.viewBox, '0 -960 960 960');
  assert.equal(svg.attributes.fill, 'currentColor');
  assert.equal(themeButton.attributes['aria-label'], 'AI Theme Custom');
});

test('keeps one button instance while Gemini replaces the input anchor', () => {
  const harness = createHarness();

  harness.ensurePlacement();
  const originalButton = harness.document.getElementById('ai-theme-custom-settings-btn');
  harness.trailingActions.remove();

  harness.ensurePlacement();
  harness.body.appendChild(harness.trailingActions);
  harness.ensurePlacement();

  const restoredButton = harness.document.getElementById('ai-theme-custom-settings-btn');
  assert.equal(restoredButton, originalButton);
  assert.equal(harness.getCreateButtonCount(), 1);
  assert.equal(restoredButton.parentElement, harness.trailingActions);
});
