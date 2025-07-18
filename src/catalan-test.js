function generateCatalan(n) {
  if (n === 0) return [''];  // Empty string for null subtree
  const res = [];
  for (let i = 0; i < n; i++) {
    const left = generateCatalan(i);
    const right = generateCatalan(n - 1 - i);
    for (const l of left) {
      for (const r of right) {
        res.push(`(${l}${r})`);
      }
    }
  }
  return res;
}

const maxN = 3;
for (let n = 0; n <= maxN; n++) {
  const forms = generateCatalan(n).map(f => f.replace(/•/g, '()'));
  console.log(`n=${n}: ${forms.join(' ')}`);
}
