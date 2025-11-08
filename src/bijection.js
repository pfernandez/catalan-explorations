import { fileURLToPath } from 'node:url';
import { dyck, pairs } from './catalan.js';

// Re-export canonical generators so the bijection module stays the single entry-point
// for Dyck words / Catalan trees in other tooling.
export const generateDyckWords = dyck;
export const generateCatalanTrees = pairs;

// === Parse a Dyck word into a tree structure ===
export function dyckToTree(s) {
  if (s.length === 0) return null;
  if (s[0] !== '(') {
    throw new Error(`Invalid Dyck word: ${s}`);
  }

  let balance = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(') balance++;
    else if (char === ')') balance--;
    else throw new Error(`Invalid character in Dyck word: ${char}`);

    if (balance < 0) {
      throw new Error(`Invalid Dyck word: ${s}`);
    }
    if (balance === 0) {
      const left = s.slice(1, i);
      const right = s.slice(i + 1);
      return { left: dyckToTree(left), right: dyckToTree(right) };
    }
  }

  throw new Error(`Invalid Dyck word: ${s}`);
}

// === Render a tree structure back into nested parens ===
export function renderTree(tree) {
  if (tree === null) return '()';
  return `(${renderTree(tree.left)}${renderTree(tree.right)})`;
}

function runCli() {
  const maxN = 4;

  for (let n = 0; n <= maxN; n++) {
    const dyckWords = generateDyckWords(n);
    const catalanTrees = generateCatalanTrees(n);

    console.log(`\n=== n = ${n} ===`);
    console.log(`Dyck words (C${n} = ${dyckWords.length}):`);
    console.log(dyckWords.join(', '));

    console.log(`Catalan trees (C${n} = ${catalanTrees.length}):`);
    console.log(catalanTrees.join(', '));

    console.log(`Bijection (Dyck → Tree):`);
    dyckWords.forEach((word, i) => {
      const tree = dyckToTree(word);
      const rendered = renderTree(tree);
      console.log(`  [${i}] ${word} → ${rendered}`);
    });
  }
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  runCli();
}
