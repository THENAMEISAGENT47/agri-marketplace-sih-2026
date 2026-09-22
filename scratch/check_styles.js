const fs = require('fs');
const path = require('path');

function getFiles(dir, extList = ['.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extList));
    } else if (extList.includes(path.extname(file))) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles(path.resolve('src'));
const issues = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const relPath = path.relative(process.cwd(), f);
  
  // 1. Check bg-white without dark:bg
  const bgWhiteMatches = [...content.matchAll(/className=["']([^"']*\bbg-white\b[^"']*)["']/g)];
  bgWhiteMatches.forEach(m => {
    if (!m[1].includes('dark:bg-') && !m[1].includes('dark:')) {
      issues.push({
        file: relPath,
        type: 'bg-white without dark:bg',
        snippet: m[1]
      });
    }
  });

  // 2. Check text-black / text-neutral-900 without dark:text
  const textDarkMatches = [...content.matchAll(/className=["']([^"']*\b(text-black|text-neutral-900|text-gray-900)\b[^"']*)["']/g)];
  textDarkMatches.forEach(m => {
    if (!m[1].includes('dark:text-') && !m[1].includes('bg-white') && !m[1].includes('bg-yellow') && !m[1].includes('bg-amber')) {
      issues.push({
        file: relPath,
        type: 'Dark text without dark:text on potential dark bg',
        snippet: m[1]
      });
    }
  });
});

console.log('Total styling contrast warnings:', issues.length);
issues.slice(0, 15).forEach(i => console.log(`[${i.type}] ${i.file} -> ${i.snippet.slice(0, 60)}`));
