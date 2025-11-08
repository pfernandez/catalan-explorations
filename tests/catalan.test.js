import assert from 'node:assert/strict';
import { dyck, pairs, motzkin } from '../src/catalan.js';

const catalanNumbers = [1, 1, 2, 5, 14, 42];
const motzkinNumbers = [1, 1, 2, 4, 9, 21];

function verifySequence(generator, expectedCounts, description) {
  expectedCounts.forEach((count, n) => {
    const produced = generator(n);
    assert.equal(
      produced.length,
      count,
      `${description} count mismatch at n=${n}`,
    );
    // Ensure results are unique to guard against accidental duplicates.
    assert.equal(
      new Set(produced).size,
      produced.length,
      `${description} duplicates detected at n=${n}`,
    );
  });
}

verifySequence(dyck, catalanNumbers, 'dyck');
verifySequence(pairs, catalanNumbers, 'pairs');
verifySequence(motzkin, motzkinNumbers, 'motzkin');

// Spot-check a few canonical forms to ensure ordering/base-cases stay stable.
assert.deepEqual(dyck(0), ['']);
assert.deepEqual(pairs(0), ['()']);
assert.deepEqual(motzkin(2), ['((()))', '(()())']);

console.log('Catalan generators ok for n = 0..5');
