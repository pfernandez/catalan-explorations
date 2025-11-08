import { fileURLToPath } from 'node:url';

// === Generate all Dyck words (well-formed parentheses strings) ===
export function generateDyckWords(n) {
  const result = [];

  function backtrack(currentString, openCount, closeCount) {
    if (currentString.length === 2 * n) {
      result.push(currentString);
      return;
    }
    if (openCount < n) {
      backtrack(currentString + '(', openCount + 1, closeCount);
    }
    if (closeCount < openCount) {
      backtrack(currentString + ')', openCount, closeCount + 1);
    }
  }

  backtrack("", 0, 0);
  return result;
}

// === Generate all Catalan binary trees (explicit structural form) ===
export function generateCatalanTrees(n) {
  if (n === 0) return ['()'];
  const result = [];
  for (let i = 0; i < n; i++) {
    const left = generateCatalanTrees(i);
    const right = generateCatalanTrees(n - 1 - i);
    for (const l of left) {
      for (const r of right) {
        result.push(`(${l}${r})`);
      }
    }
  }
  return result;
}

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
