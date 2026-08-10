const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const userscriptPath = path.join(__dirname, '..', 'AI-Theme-Custom.user.js');
const source = fs.readFileSync(userscriptPath, 'utf8').replace(/\r\n/g, '\n');

function extractFunction(name, endMarker) {
  const startMarker = `  ${name}`;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, `${name} must exist`);
  assert.notEqual(end, -1, `${name} boundary must exist`);
  return source.slice(start, end);
}

test('initializes the theme once and delegates future placement to the sentinel', async () => {
  const initSource = extractFunction('async function init() {', '\n\n  init();');
  let applyCount = 0;
  let placementCount = 0;
  let inputObserverCount = 0;
  let sentinelCount = 0;
  let intervalCount = 0;
  let observerCount = 0;

  class UnexpectedObserver {
    constructor() {
      observerCount += 1;
    }
    observe() {}
  }

  const factory = new Function(
    'initSentinelEngine',
    'loadConfig',
    'ensureBody',
    'applyCurrentTheme',
    'ensureSettingsButtonPlacement',
    'observeInputAreaForButtonPlacement',
    'MutationObserver',
    'setInterval',
    'document',
    `${initSource}; return init;`,
  );

  const init = factory(
    () => { sentinelCount += 1; },
    async () => {},
    (callback) => callback(),
    () => { applyCount += 1; },
    () => { placementCount += 1; },
    () => { inputObserverCount += 1; },
    UnexpectedObserver,
    () => { intervalCount += 1; },
    { body: {} },
  );

  await init();

  assert.equal(sentinelCount, 1);
  assert.equal(applyCount, 1);
  assert.equal(placementCount, 1);
  assert.equal(inputObserverCount, 1);
  assert.equal(observerCount, 0);
  assert.equal(intervalCount, 0);
});

test('coalesces repeated settings-button placement requests into one animation frame', () => {
  const lifecycleStart = '  // --- Settings Button Lifecycle ---';
  const lifecycleEnd = '\n\n  // --- Settings Panel ---';
  const start = source.indexOf(lifecycleStart);
  const end = source.indexOf(lifecycleEnd, start);
  assert.notEqual(start, -1, 'settings-button lifecycle block must exist');
  assert.notEqual(end, -1, 'settings-button lifecycle boundary must exist');

  const block = source.slice(start + lifecycleStart.length, end);
  const queuedFrames = [];
  let placementCount = 0;
  const factory = new Function(
    'requestAnimationFrame',
    'ensureSettingsButtonPlacement',
    `${block}; return scheduleSettingsButtonPlacement;`,
  );
  const schedule = factory(
    (callback) => {
      queuedFrames.push(callback);
      return queuedFrames.length;
    },
    () => { placementCount += 1; },
  );

  schedule();
  schedule();
  schedule();

  assert.equal(queuedFrames.length, 1);
  assert.equal(placementCount, 0);

  queuedFrames.shift()();
  assert.equal(placementCount, 1);

  schedule();
  assert.equal(queuedFrames.length, 1);
});

test('keeps the settings panel state declaration outside its section comment', () => {
  assert.match(
    source,
    /\/\/ --- Settings Panel ---\n  let settingsPanelEl = null;/,
  );
});