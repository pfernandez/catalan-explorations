import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadDefinitions, evaluateExpression } from '../src/graph/evaluator.js';
import { serializeGraph } from '../src/graph/serializer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadDefinitions(join(__dirname, '../programs/sk-basis.lisp'));

test('identity returns its argument', () => {
  const { graph, rootId } = evaluateExpression('(I z)', env);
  assert.equal(serializeGraph(graph, rootId), 'z');
});

test('K discards the second argument', () => {
  const { graph, rootId } = evaluateExpression('((K a) b)', env);
  assert.equal(serializeGraph(graph, rootId), 'a');
});

test('TRUE selects the first argument', () => {
  const { graph, rootId } = evaluateExpression('((TRUE a) b)', env);
  assert.equal(serializeGraph(graph, rootId), 'a');
});

test('FALSE selects the second argument', () => {
  const { graph, rootId } = evaluateExpression('((FALSE a) b)', env);
  assert.equal(serializeGraph(graph, rootId), 'b');
});

test('LEFT returns its left operand', () => {
  const { graph, rootId } = evaluateExpression('((LEFT foo) bar)', env);
  assert.equal(serializeGraph(graph, rootId), 'foo');
});

test('RIGHT returns its right operand', () => {
  const { graph, rootId } = evaluateExpression('((RIGHT foo) bar)', env);
  assert.equal(serializeGraph(graph, rootId), 'bar');
});

test('SELF returns its argument', () => {
  const { graph, rootId } = evaluateExpression('(SELF z)', env);
  assert.equal(serializeGraph(graph, rootId), 'z');
});

test('S duplicates the context structure', () => {
  const { graph, rootId } = evaluateExpression('(((S a) b) c)', env);
  assert.equal(serializeGraph(graph, rootId), '((a c) (b c))');
});

test('B threads arguments (B K SELF a -> K (SELF a))', () => {
  const { graph, rootId } = evaluateExpression('(((B K) SELF) a)', env);
  assert.equal(serializeGraph(graph, rootId), '((() (() #1)) ((() #0) a))');
});

test('trace snapshots capture re-entry links', () => {
  const snapshots = [];
  evaluateExpression('(I a)', env, {
    tracer: snapshot => snapshots.push(snapshot),
  });
  assert.ok(
    snapshots.some(snap => Array.isArray(snap.graph.links) && snap.graph.links.length > 0),
    'expected at least one snapshot with re-entry links',
  );
});
