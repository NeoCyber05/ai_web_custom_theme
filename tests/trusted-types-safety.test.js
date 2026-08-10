const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8');

test('userscript never assigns HTML via innerHTML/outerHTML/insertAdjacentHTML', () => {
  assert.doesNotMatch(source, /\.innerHTML\s*=/);
  assert.doesNotMatch(source, /\.outerHTML\s*=/);
  assert.doesNotMatch(source, /insertAdjacentHTML\s*\(/);
});

test('userscript builds UI through createElement/createElementNS helpers', () => {
  assert.match(source, /function h\(/);
  assert.match(source, /function mount\(/);
  assert.match(source, /document\.createElementNS/);
  assert.match(source, /host\.replaceChildren/);
});
