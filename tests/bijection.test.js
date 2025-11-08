import assert from 'node:assert/strict';
import {
  generateDyckWords,
  generateCatalanTrees,
  dyckToTree,
  renderTree,
} from '../src/bijection.js';

const sortStrings = (list) => [...list].sort();

function checkBijection(n) {
  const dyckWords = generateDyckWords(n);
  const treesFromDyck = dyckWords.map((word) => renderTree(dyckToTree(word)));

  assert.equal(new Set(treesFromDyck).size, dyckWords.length, `Dyck map is not injective for n=${n}`);

  const catalanTrees = generateCatalanTrees(n);
  assert.deepEqual(
    sortStrings(treesFromDyck),
    sortStrings(catalanTrees),
    `Tree enumerations differ for n=${n}`,
  );
}

for (let n = 0; n <= 5; n += 1) {
  checkBijection(n);
}

console.log('Bijection tests passed for n = 0..5');
