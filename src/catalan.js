#!/usr/bin/env node

function generate(n) {
  if (n === 0) return ['()'];
  const result = [];
  for (let k = 0; k < n; k++) {
    const lefts = generate(k);
    const rights = generate(n - 1 - k);
    for (const left of lefts) {
      for (const right of rights) {
        result.push(`(${left}${right})`);
      }
    }
  }
  return result;
}

function catalanPyramid(maxN = 3) {
  for (let n = 0; n <= maxN; n++) {
    const forms = generate(n);
    console.log(`n=${n}: ${forms.join(' ')}`);
  }
}

// If called directly from command line with argument
const maxN = process.argv[2] ? parseInt(process.argv[2], 10) : 3;
catalanPyramid(maxN);

