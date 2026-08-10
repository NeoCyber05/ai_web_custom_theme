const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');

function extractChatWidthHelpers() {
  const startMarker = '  function getChatContentSelector() {';
  const endMarker = '\n\n  // --- Style Injection Engine ---';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const declarations = source.slice(start, end);
  return new Function(
    'APPID',
    'PLATFORMS',
    'CURRENT_PLATFORM',
    'GEMINI_CHAT_CONTENT_SELECTOR',
    'CHATGPT_CHAT_CONTENT_SELECTOR',
    'CSS_VAR_CHAT_MAX_WIDTH',
    'CLASS_MAX_WIDTH_ACTIVE',
    'CHAT_MAX_WIDTH_MIN',
    'CHAT_MAX_WIDTH_MAX',
    `${declarations}
     return {
       getChatContentSelector,
       themeHasStandingImage,
       buildChatContentMaxWidthValue,
       buildChatContentMaxWidthCss
     };`,
  )(
    'ai-theme-custom',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini' },
    'ChatGPT',
    '.conversation-container',
    ':is(.group\\/turn-messages, div[class*="--thread-content-max-width"].grid)',
    '--ai-theme-custom-chat-content-max-width',
    'ai-theme-custom-max-width-active',
    30,
    80,
  );
}

test('builds a clamped chat width value for ChatGPT', () => {
  const helpers = extractChatWidthHelpers();
  const value = helpers.buildChatContentMaxWidthValue(60, 42, false, 1200);
  assert.equal(value, 'min(60vw, 1052px)');
});

test('expands side margins when standing images are active', () => {
  const helpers = extractChatWidthHelpers();
  const withoutStanding = helpers.buildChatContentMaxWidthValue(60, 42, false, 1200);
  const withStanding = helpers.buildChatContentMaxWidthValue(60, 42, true, 1200);
  assert.notEqual(withoutStanding, withStanding);
  assert.match(withStanding, /min\(60vw, 1032px\)/);
});

test('emits platform-scoped max-width CSS', () => {
  const helpers = extractChatWidthHelpers();
  const css = helpers.buildChatContentMaxWidthCss();
  assert.ok(css.includes('body.ai-theme-custom-max-width-active main'));
  assert.ok(css.includes('turn-messages'));
  assert.match(css, /max-width: var\(--ai-theme-custom-chat-content-max-width\) !important/);
  assert.match(css, /margin-inline: auto !important/);
});

test('detects standing images from theme actors', () => {
  const helpers = extractChatWidthHelpers();
  assert.equal(helpers.themeHasStandingImage({ assistant: { standingImageUrl: 'https://x.test/a.png' } }), true);
  assert.equal(helpers.themeHasStandingImage({ user: { standingImage: 'https://x.test/u.png' } }), true);
  assert.equal(helpers.themeHasStandingImage({ assistant: {}, user: {} }), false);
});

test('keeps chat width slider interactive even when website default is selected', () => {
  assert.doesNotMatch(source, /disabled:\s*useDefaultChatWidth/);
  assert.match(source, /chatWidthDefaultToggle\.checked = false/);
});
