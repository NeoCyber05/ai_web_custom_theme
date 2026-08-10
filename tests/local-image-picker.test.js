const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8');

test('supports picking local images and converting them to data URLs', () => {
  assert.match(source, /async function imageFileToDataUrl\(/);
  assert.match(source, /function pickLocalImageFile\(/);
  assert.match(source, /fileInput\.type = 'file'/);
  assert.match(source, /fileInput\.accept = 'image\/\*'/);
  assert.match(source, /createImageFieldRow\(/);
  assert.match(source, /IMAGE_MAX_WIDTH_BG/);
});

test('exposes pick-image labels in i18n', () => {
  assert.match(source, /pick_image:/);
  assert.match(source, /pick_image_processing:/);
});
