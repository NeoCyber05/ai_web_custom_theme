const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');

function extractApplyCurrentTheme() {
  const start = source.indexOf('  function applyCurrentTheme() {');
  const end = source.indexOf('\n  // --- Sentinel Engine for SPA Instant DOM Detection ---', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return source.slice(start, end);
}

function extractGetWindowBackgroundSelector() {
  const start = source.indexOf('  function getWindowBackgroundSelector() {');
  const end = source.indexOf('\n\n  const CURRENT_PLATFORM = detectPlatform();', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const declarations = source.slice(start, end);
  const factory = new Function(
    'CURRENT_PLATFORM',
    'PLATFORMS',
    `${declarations}
     return typeof getWindowBackgroundSelector === 'function' ? getWindowBackgroundSelector : null;`,
  );
  return factory;
}

test('ChatGPT window background uses a scoped scroll-root selector', () => {
  const getWindowBackgroundSelector = extractGetWindowBackgroundSelector()(
    'ChatGPT',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
  );
  const selector = getWindowBackgroundSelector();
  assert.match(selector, /div\[data-scroll-root\]/);
  assert.match(selector, /div:has\(> main#main\)/);
  assert.doesNotMatch(selector, /['"`][^'"`]*\.flex-1/);
  assert.match(extractApplyCurrentTheme(), /getWindowBackgroundSelector\(\)/);
});

test('Claude window background targets main chat shell only', () => {
  const getWindowBackgroundSelector = extractGetWindowBackgroundSelector()(
    'Claude',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
  );
  assert.equal(getWindowBackgroundSelector(), ':is(main, [data-testid="chat-page"])');
});

test('Gemini window background targets bard-sidenav-content only', () => {
  const getWindowBackgroundSelector = extractGetWindowBackgroundSelector()(
    'Gemini',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
  );
  assert.equal(getWindowBackgroundSelector(), 'bard-sidenav-content');
});

test('protects the ChatGPT composer from inherited background images', () => {
  const fn = extractApplyCurrentTheme();
  assert.match(
    fn,
    /form\[data-type="unified-composer"\], form\[data-type="unified-composer"\] \*/,
  );
  assert.match(fn, /background-image: none !important/);
});

test('protects the Claude composer from inherited background images', () => {
  const fn = extractApplyCurrentTheme();
  assert.match(
    fn,
    /fieldset:has\(\[data-testid="chat-input"\]\), fieldset:has\(\[data-testid="chat-input"\]\) \*/,
  );
  assert.match(fn, /CURRENT_PLATFORM === PLATFORMS\.CLAUDE/);
});
