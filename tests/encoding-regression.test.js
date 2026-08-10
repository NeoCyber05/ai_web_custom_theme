const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const files = [
  'AI-Theme-Custom.user.js',
  'README.md',
  'tests/theme-library.test.js',
];
const mojibake = /(?:[\u0080-\u009f]|\u00c3|\u00c2|\u00c4|\u00c6|\u00e1\u00ba|\u00e1\u00bb|\u00f0\u0178|\u00e2[\u0080-\u00bf\u2000-\u206f]|\u00ef[\u0080-\u00bf])/u;

for (const relativePath of files) {
  test(`${relativePath} contains human-readable UTF-8 text`, () => {
    const content = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
    assert.doesNotMatch(content, mojibake);
  });
}
