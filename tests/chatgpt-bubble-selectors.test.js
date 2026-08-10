const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');

function extractBubbleHelpers() {
  const startMarker = '  // --- Theme Preview & CSS Helpers ---';
  const endMarker = '\n\n  // --- Built-in Presets ---';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, 'theme helper block must exist');
  assert.notEqual(end, -1, 'theme helper block boundary must exist');

  const declarations = source.slice(start + startMarker.length, end);
  const factory = new Function(
    'APPID',
    'PLATFORMS',
    `${declarations}
     return {
       buildBubbleSelectors: typeof buildBubbleSelectors === 'function' ? buildBubbleSelectors : null,
       buildBubbleSurfaceCss: typeof buildBubbleSurfaceCss === 'function' ? buildBubbleSurfaceCss : null,
       buildBubbleTextCss: typeof buildBubbleTextCss === 'function' ? buildBubbleTextCss : null,
       buildBubbleRules: typeof buildBubbleRules === 'function' ? buildBubbleRules : null,
       buildBubbleThemeCss: typeof buildBubbleThemeCss === 'function' ? buildBubbleThemeCss : null,
       buildChatGptRichContentCss: typeof buildChatGptRichContentCss === 'function' ? buildChatGptRichContentCss : null,
     };`,
  );
  return factory(
    'ai-theme-custom',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
  );
}

function extractApplyCurrentTheme() {
  const start = source.indexOf('  function applyCurrentTheme() {');
  const end = source.indexOf('\n  // --- Sentinel Engine for SPA Instant DOM Detection ---', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return source.slice(start, end);
}

test('matches AI-UX-Customizer ChatGPT bubble surface and text selectors', () => {
  const { buildBubbleSelectors } = extractBubbleHelpers();
  assert.equal(typeof buildBubbleSelectors, 'function');

  const selectors = buildBubbleSelectors('ChatGPT');
  assert.equal(selectors.mode, 'split');
  assert.match(selectors.userSurface, /div\.user-message-bubble-color/);
  assert.match(selectors.userSurface, /div\.overflow-hidden:has\(img\)/);
  assert.match(selectors.assistantSurface, /div:has\(> \.markdown\)/);
  assert.match(selectors.userText, /\.whitespace-pre-wrap/);
  assert.match(selectors.assistantText, /\.markdown/);
  assert.doesNotMatch(selectors.assistantSurface, /\[data-message-author-role="assistant"\]$/);
  assert.doesNotMatch(selectors.userSurface, /model-response/);
});

test('keeps Gemini bubble selectors isolated from ChatGPT DOM', () => {
  const { buildBubbleSelectors } = extractBubbleHelpers();
  const selectors = buildBubbleSelectors('Gemini');

  assert.equal(selectors.mode, 'combined');
  assert.match(selectors.assistant, /model-response \.markdown/);
  assert.match(selectors.user, /user-query \.query-text/);
  assert.doesNotMatch(selectors.assistant, /data-message-author-role/);
});

test('reserves ChatGPT margin space for side avatars', () => {
  const fn = extractApplyCurrentTheme();
  assert.match(fn, /\[data-message-author-role="user"\], \[data-message-author-role="assistant"\], \.user-turn, \.agent-turn/);
});

test('splits ChatGPT bubble surface and text styling like AI-UX-Customizer', () => {
  const {
    buildBubbleSurfaceCss,
    buildBubbleTextCss,
    buildBubbleRules,
    buildChatGptRichContentCss,
  } = extractBubbleHelpers();

  const surfaceCss = buildBubbleSurfaceCss({
    bubbleBackgroundColor: 'rgba(8, 21, 32, 0.94)',
    bubblePadding: 12,
    bubbleBorderRadius: 14,
    bubbleMaxWidth: 92,
    textColor: '#62f6e8',
  }, 'ChatGPT');
  const textCss = buildBubbleTextCss({
    textColor: '#62f6e8',
    font: "'Cascadia Code', monospace",
  });

  assert.match(surfaceCss, /background-color: rgba\(8, 21, 32, 0\.94\) !important/);
  assert.match(surfaceCss, /max-width: 100% !important/);
  assert.match(surfaceCss, /overflow-x: auto !important/);
  assert.match(surfaceCss, /box-sizing: border-box !important/);
  assert.doesNotMatch(surfaceCss, /max-width: 92%/);
  assert.doesNotMatch(surfaceCss, /color: #62f6e8/);

  assert.match(textCss, /color: #62f6e8 !important/);
  assert.match(textCss, /font-family: 'Cascadia Code', monospace !important/);
  assert.doesNotMatch(textCss, /background-color:/);

  const richContentCss = buildChatGptRichContentCss({
    assistantText: '[data-message-author-role="assistant"] .markdown',
  }, { textColor: '#62f6e8' });
  assert.match(richContentCss, /table-layout: auto !important/);
  assert.match(richContentCss, /width: max-content !important/);
  assert.match(richContentCss, /overflow-x: auto !important/);

  const rules = buildBubbleRules('ChatGPT', {
    textColor: '#62f6e8',
    bubbleBackgroundColor: 'rgba(8, 21, 32, 0.94)',
    bubblePadding: 12,
    bubbleBorderRadius: 14,
    bubbleMaxWidth: 92,
    font: "'Cascadia Code', monospace",
  }, {
    textColor: '#62f6e8',
    bubbleBackgroundColor: 'rgba(8, 21, 32, 0.94)',
    bubblePadding: 12,
    bubbleBorderRadius: 14,
    bubbleMaxWidth: 92,
    font: "'Cascadia Code', monospace",
  });

  assert.match(rules, /div\.user-message-bubble-color/);
  assert.match(rules, /div:has\(> \.markdown\)/);
  assert.match(rules, /\[data-message-author-role="assistant"\] \.markdown/);
  assert.match(rules, /margin-left: auto !important/);
  assert.match(rules, /margin-right: auto !important/);
  assert.match(rules, /table-layout: auto !important/);

  const applyFn = extractApplyCurrentTheme();
  assert.match(applyFn, /buildBubbleRules\(CURRENT_PLATFORM, user, asst\)/);
});
