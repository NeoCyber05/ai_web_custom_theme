const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');

function extractInputThemeHelper() {
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
     return typeof buildInputThemeCss === 'function' ? buildInputThemeCss : null;`,
  );
  return factory(
    'ai-theme-custom',
    { CHATGPT: 'ChatGPT', GEMINI: 'Gemini', CLAUDE: 'Claude' },
  );
}

test('targets only the native ChatGPT composer surface and editor', () => {
  const buildInputThemeCss = extractInputThemeHelper();
  assert.equal(typeof buildInputThemeCss, 'function');

  const css = buildInputThemeCss(
    'ChatGPT',
    {
      backgroundColor: '#160b24',
      textColor: '#00ffcc',
    },
    "'Cascadia Code', monospace",
  );

  assert.match(css, /form\[data-type="unified-composer"\] div\[style\*="border-radius"\]/);
  assert.match(css, /div\.ProseMirror#prompt-textarea/);
  assert.match(css, /background-color: transparent !important/);
  assert.match(css, /font-family: 'Cascadia Code', monospace !important/);
  assert.doesNotMatch(css, /(^|,\s*)form(?:,|\s*\{)/m);
  assert.doesNotMatch(css, /\[contenteditable="true"\]/);
  assert.doesNotMatch(css, /(^|,\s*)textarea(?:,|\s*\{)/m);
});

test('targets only the native Claude composer shell and ProseMirror editor', () => {
  const buildInputThemeCss = extractInputThemeHelper();
  assert.equal(typeof buildInputThemeCss, 'function');

  const css = buildInputThemeCss(
    'Claude',
    {
      backgroundColor: '#160b24',
      textColor: '#00ffcc',
    },
    "'Inter', sans-serif",
  );

  assert.match(css, /fieldset:has\(\[data-testid="chat-input"\]\)/);
  assert.match(css, /div\.ProseMirror\[data-testid="chat-input"\]/);
  assert.match(css, /background-color: transparent !important/);
  assert.match(css, /font-family: 'Inter', sans-serif !important/);
  assert.doesNotMatch(css, /(^|,\s*)textarea(?:,|\s*\{)/m);
});

test('targets only the native Gemini input shell and rich editor', () => {
  const buildInputThemeCss = extractInputThemeHelper();
  assert.equal(typeof buildInputThemeCss, 'function');

  const css = buildInputThemeCss(
    'Gemini',
    {
      backgroundColor: '#160b24',
      textColor: '#00ffcc',
    },
    "'Segoe UI', sans-serif",
  );

  assert.match(css, /input-area-v2/);
  assert.match(css, /rich-textarea \.ql-editor/);
  assert.match(css, /background-color: transparent !important/);
  assert.match(css, /font-family: 'Segoe UI', sans-serif !important/);
  assert.doesNotMatch(css, /\[contenteditable="true"\]/);
  assert.doesNotMatch(css, /(^|,\s*)textarea(?:,|\s*\{)/m);
});