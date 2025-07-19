#!/usr/bin/env node

// --- CLI args ---
const startNArg = process.argv.find(arg => arg.startsWith('--startN='));
const maxNArg = process.argv.find(arg => arg.startsWith('--maxN='));
const startN = startNArg ? parseInt(startNArg.split('=')[1]) : 1;
const maxN = maxNArg ? parseInt(maxNArg.split('=')[1]) : 3 + startN;
const matchArg = process.argv.find(arg => arg.startsWith('--match='));
const matchPattern = matchArg ? matchArg.split('=')[1] : null;
const centered = process.argv.includes('--center');
const stopLeft = process.argv.includes('--stop-left');
const stopRight = process.argv.includes('--stop-right');
const allowDuplicates = true;  //!(stopLeft || stopRight)

console.log(
  'Running simulation...\n', 
  { startN, maxN, matchPattern, centered, stopLeft, stopRight, allowDuplicates },
  '\n'
);

// Colors
const RESET = '\x1b[0m';
const pastelColors = [205, 198, 165, 135, 99];

function append(list, form) {
  return allowDuplicates ? list.push(form) : list.add(form);
}

function colorByPath(form, path) {
  const depth = path.length;
  const idx = Math.min(depth, pastelColors.length - 1);
  const color = `\x1b[38;5;${pastelColors[idx]}m`;
  return `${color}(${RESET}${form}${color})${RESET}`
}

function generateColored(n, path = []) {
  const result = allowDuplicates ? [] : new Set();

  if (n < startN) append(result, '')
  else if (n === startN) append(result, '()')
  else {
    for (let k = 0; k < n; k++) {
      const leftSize = k;
      const rightSize = n - 1 - k;

      if (n > 1) {  // Only apply pruning when n > 1
        if (stopLeft && leftSize === 0) continue;
        if (stopRight && rightSize === 0) continue;
      }

      const lefts = generateColored(leftSize, [...path, 0]);
      const rights = generateColored(rightSize, [...path, 1]);

      for (const left of lefts) {
        for (const right of rights) {
          const form = colorByPath(left + right, path);
          append(result, form)
        }
      }
    }
  }
  return result;
}

function getVisibleLength(str) {
  // Remove ANSI escape codes to measure printable width
  return str.replace(/\x1b\[[0-9;]*m/g, '').length;
}

function catalanPyramidColored() {
  const rows = [];

  for (let n = 0; n <= maxN; n++) {
    const forms = generateColored(n)
    const count = forms.length;
    if (forms.length > 0) {
      const row = `n=${n}, c=${count}: ${forms.join(' ')}`;
      rows.push(row);
    }
  }

  const maxWidth = Math.max(...rows.map(r => getVisibleLength(r)));

  rows.forEach(row => {
    if (centered) {
      const padding = Math.floor((maxWidth - getVisibleLength(row)) / 2);
      console.log(' '.repeat(padding) + row);
    } else {
      console.log(row);
    }
  });
}

catalanPyramidColored();
