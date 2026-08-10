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
    this.style = { cssText: '' };
  }

  appendChild(node) {
    if (node.parentNode) node.remove();
    this.children.push(node);
    node.parentNode = this;
    return node;
  }

  append(...nodes) {
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

function extractPresets() {
  const startMarker = '  const BUILTIN_PRESETS = ';
  const endMarker = '\n\n  // --- Configuration Store ---';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, 'BUILTIN_PRESETS declaration must exist');
  assert.notEqual(end, -1, 'BUILTIN_PRESETS boundary must exist');
  const expression = source.slice(start + startMarker.length, end).trim().replace(/;$/, '');
  return new Function(`return ${expression};`)();
}

function extractThemeHelpers() {
  const startMarker = '  // --- DOM Builders ---';
  const endMarker = '\n\n  // --- Built-in Presets ---';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start === -1 || end === -1) return {};
  const declarations = source.slice(start + startMarker.length, end);

  const fakeDocument = {
    createElement: (tagName) => new FakeElement(tagName),
    createElementNS: (_ns, tagName) => new FakeElement(tagName),
    createTextNode: (text) => {
      const node = new FakeElement('#text');
      node.textContent = String(text);
      return node;
    },
    querySelector: () => null,
  };

  return new Function(
    'APPID',
    'document',
    'Node',
    'HTMLElement',
    'PLATFORMS',
    't',
    `${declarations}
     return {
       buildBubbleThemeCss,
       escapeHtml,
       getPresetPreviewPalette,
       renderPresetCard,
       sanitizePreviewColor
     };`,
  )(
    'ai-theme-custom',
    fakeDocument,
    FakeElement,
    FakeElement,
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini' },
    (key, vars) => (key === 'theme_name_fallback' && vars?.n ? `Theme ${vars.n}` : key),
  );
}

const expectedPresetIds = [
  'preset-native-default',
  'preset-cyberpunk-neon',
  'preset-sakura-blossom',
  'preset-emerald-forest',
  'preset-sunset-vaporwave',
  'preset-deep-space',
  'preset-minimalist-slate',
  'preset-golden-luxe',
  'preset-nordic-frost',
  'preset-dracula-gothic',
  'preset-tokyo-midnight',
];

test('embeds Native plus the ten documented themes in stable order', () => {
  const presets = extractPresets();

  assert.deepEqual(presets.map((preset) => preset.id), expectedPresetIds);
  assert.equal(new Set(presets.map((preset) => preset.id)).size, presets.length);
});

test('gives every designed theme complete applied colors and bubble geometry', () => {
  const [, ...designedPresets] = extractPresets();

  for (const preset of designedPresets) {
    assert.ok(preset.window.backgroundColor, `${preset.id}: window background`);
    assert.ok(preset.inputArea.backgroundColor, `${preset.id}: input background`);
    assert.ok(preset.inputArea.textColor, `${preset.id}: input text`);
    for (const actorName of ['assistant', 'user']) {
      const actor = preset[actorName];
      assert.ok(actor.textColor, `${preset.id}: ${actorName} text`);
      assert.ok(actor.bubbleBackgroundColor, `${preset.id}: ${actorName} bubble`);
      assert.ok(actor.font, `${preset.id}: ${actorName} font`);
      assert.ok(Number.isFinite(actor.bubblePadding), `${preset.id}: ${actorName} padding`);
      assert.ok(Number.isFinite(actor.bubbleBorderRadius), `${preset.id}: ${actorName} radius`);
      assert.ok(Number.isFinite(actor.bubbleMaxWidth), `${preset.id}: ${actorName} width`);
    }
  }
});

test('derives safe preview colors including Native fallbacks', () => {
  const helpers = extractThemeHelpers();
  assert.equal(typeof helpers.getPresetPreviewPalette, 'function');

  const nativePreset = extractPresets()[0];
  assert.deepEqual(helpers.getPresetPreviewPalette(nativePreset), {
    window: '#202124',
    input: '#303134',
    assistantText: '#e8eaed',
    assistantBubble: '#303134',
    userText: '#e8eaed',
    userBubble: '#3c4043',
  });
  assert.equal(helpers.sanitizePreviewColor('red;display:none', '#123456'), '#123456');
});

test('builds designed bubble CSS and leaves Native geometry untouched', () => {
  const helpers = extractThemeHelpers();
  assert.equal(typeof helpers.buildBubbleThemeCss, 'function');

  const [nativePreset, cyberpunk] = extractPresets();
  const css = helpers.buildBubbleThemeCss(cyberpunk.assistant);
  assert.match(css, /padding: 12px/);
  assert.match(css, /border-radius: 14px/);
  assert.match(css, /max-width: 92%/);
  assert.match(css, /font-family:/);
  assert.match(css, /color-mix/);
  assert.equal(helpers.buildBubbleThemeCss(nativePreset.assistant), '');
});

test('renders eleven semantic mini-chat cards and marks the active theme', () => {
  const helpers = extractThemeHelpers();
  assert.equal(typeof helpers.renderPresetCard, 'function');

  const presets = extractPresets();
  const labels = {
    active: 'Đang dùng',
    apply: 'Áp dụng',
    restore: 'Khôi phục giao diện gốc',
    previewAssistant: 'AI · Xem trước giao diện',
    previewUser: 'Bạn · Trông ổn đấy',
  };
  const cards = presets.map((preset, index) => helpers.renderPresetCard(
    preset,
    index,
    'preset-sakura-blossom',
    labels,
  ));

  assert.equal(cards.length, 11);
  assert.equal(cards.filter((card) => card.className.includes('ai-theme-custom-select-preset')).length, 11);
  assert.equal(cards[0].dataset.idx, '0');
  assert.ok(walk(cards[0]).some((node) => node.className === 'ai-theme-custom-palette-dot'));
  assert.ok(walk(cards[0]).some((node) => node.className === 'ai-theme-custom-preview-assistant'));
  assert.ok(walk(cards[0]).some((node) => node.className === 'ai-theme-custom-preview-user'));
  assert.ok(cards.some((card) => card.className.includes('is-active')));
  assert.ok(walk(cards.find((card) => card.className.includes('is-active')))
    .some((node) => node.textContent === 'Đang dùng'));
  assert.equal(cards[0].children.at(-1).textContent, 'Khôi phục giao diện gốc');
});

test('escapes theme names in generated card markup', () => {
  const helpers = extractThemeHelpers();
  assert.equal(typeof helpers.renderPresetCard, 'function');

  const unsafePreset = {
    id: 'unsafe',
    name: '<img src=x onerror=alert(1)>',
    assistant: {},
    user: {},
    window: {},
    inputArea: {},
  };
  const card = helpers.renderPresetCard(
    unsafePreset,
    0,
    '',
    {
      active: 'Active',
      apply: 'Apply',
      restore: 'Restore',
      previewAssistant: 'AI preview',
      previewUser: 'User preview',
    },
  );

  const strong = walk(card).find((node) => node.tagName === 'STRONG');
  assert.equal(strong.textContent, '<img src=x onerror=alert(1)>');
  assert.equal(strong.children.length, 0);
  assert.ok(!walk(card).some((node) => node.tagName === 'IMG'));
});
