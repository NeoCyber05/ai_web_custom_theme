const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');
const functionStart = source.indexOf('  function initSentinelEngine() {');
const functionEnd = source.indexOf('\n\n  // --- Settings Button Placement', functionStart);

assert.notEqual(functionStart, -1, 'sentinel initializer must exist');
assert.notEqual(functionEnd, -1, 'sentinel initializer boundary must exist');

const functionSource = source.slice(functionStart, functionEnd);

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.id = '';
    this.textContent = '';
  }

  matches(selector) {
    const tag = this.tagName.toLowerCase();
    return selector.includes(tag);
  }

  querySelectorAll() {
    return [];
  }
}

function createHarness(existingInputs = []) {
  const listeners = new Map();
  const observed = [];
  const fallbackObservers = [];
  class FakeMutationObserver {
    constructor(callback) {
      this.callback = callback;
      fallbackObservers.push(this);
    }

    observe(target, options) {
      this.target = target;
      this.options = options;
    }

    disconnect() {}
  }
  const document = {
    head: {
      appendChild(element) {
        document.styleElement = element;
        for (const input of existingInputs) document.dispatchAnimationStart(input);
      },
    },
    documentElement: {},
    body: {},
    styleElement: null,
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    createElement: (tagName) => new FakeElement(tagName),
    dispatchAnimationStart(target) {
      listeners.get('animationstart')?.({
        animationName: 'ai-theme-custom-sentinel-anim',
        target,
      });
    },
    getElementById: () => null,
    querySelectorAll(selector) {
      return selector.includes('input-area-v2') ? existingInputs : [];
    },
  };

  const factory = new Function(
    'document',
    'HTMLElement',
    'CURRENT_PLATFORM',
    'PLATFORMS',
    'APPID',
    'GEMINI_INPUT_AREA_SELECTORS',
    'CHATGPT_INPUT_AREA_SELECTOR',
    'MESSAGE_SELECTOR',
    'getInputAreaSelectors',
    'processMessageElement',
    'observeInputAreaForButtonPlacement',
    'MutationObserver',
    `${functionSource}; return initSentinelEngine;`,
  );
  const initSentinelEngine = factory(
    document,
    FakeElement,
    'Gemini',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini' },
    'ai-theme-custom',
    ['input-area-v2', 'input-container', '.input-area-container'],
    'form[data-type="unified-composer"]',
    'user-query, model-response',
    () => ['input-area-v2', 'input-container', '.input-area-container'],
    () => {},
    (element) => {
      if (!observed.includes(element)) observed.push(element);
    },
    FakeMutationObserver,
  );

  return { document, fallbackObservers, initSentinelEngine, observed };
}

test('observes a Gemini input root that already exists during sentinel setup', () => {
  const input = new FakeElement('input-area-v2');
  const harness = createHarness([input]);

  harness.initSentinelEngine();

  assert.deepEqual(harness.observed, [input]);
});

test('observes a replacement Gemini input root created after setup', () => {
  const firstInput = new FakeElement('input-area-v2');
  const replacementInput = new FakeElement('input-area-v2');
  const harness = createHarness([firstInput]);
  harness.initSentinelEngine();

  harness.document.dispatchAnimationStart(replacementInput);

  assert.deepEqual(harness.observed, [firstInput, replacementInput]);
});

test('registers a body MutationObserver fallback exactly once', () => {
  const harness = createHarness();
  harness.initSentinelEngine();
  harness.initSentinelEngine();
  assert.equal(harness.fallbackObservers.length, 1);
});
