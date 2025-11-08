import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  loadDefinitions,
  evaluateExpression,
  treeToString,
} from '../src/sk.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadDefinitions(join(__dirname, '../programs/sk-basis.lisp'));

function evaluateFocus(expr) {
  const { focus } = evaluateExpression(expr, env);
  return treeToString(focus);
}

test('I returns its argument', () => {
  assert.equal(evaluateFocus('(I a)'), 'a');
});

test('K exposes its first argument at the focus', () => {
  assert.equal(evaluateFocus('((K a) b)'), 'a');
});
