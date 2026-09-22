const fs = require('fs');
const path = require('path');

function getFiles(dir, extList = ['.ts', '.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extList));
    } else {
      if (extList.includes(path.extname(file))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

// 1. Read LanguageContext translations
const langContextPath = path.resolve('src/contexts/LanguageContext.tsx');
const langContent = fs.readFileSync(langContextPath, 'utf8');
const keyMatches = [...langContent.matchAll(/'([^']+)'\s*:\s*\{\s*en\s*:/g)];
const definedKeys = new Set(keyMatches.map(m => m[1]));

console.log('Total defined keys in LanguageContext:', definedKeys.size);

// 2. Find all t('key') calls in src
const allSrcFiles = getFiles(path.resolve('src'));
const usedKeys = new Map();

allSrcFiles.forEach(file => {
  if (file === langContextPath) return;
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/\bt\(\s*['"]([^'"]+)['"]\s*\)/g)];
  matches.forEach(m => {
    const k = m[1];
    if (!usedKeys.has(k)) usedKeys.set(k, []);
    usedKeys.get(k).push(path.relative(process.cwd(), file));
  });
});

console.log('Total unique t() calls in codebase:', usedKeys.size);

const missingFromContext = [];
for (const [key, files] of usedKeys.entries()) {
  if (!definedKeys.has(key)) {
    missingFromContext.push({ key, files });
  }
}

console.log('Missing from LanguageContext (raw keys!):', missingFromContext.length);
missingFromContext.forEach(m => console.log('  MISSING KEY:', m.key, 'used in:', m.files.join(', ')));

if (missingFromContext.length > 0) {
  process.exit(1);
} else {
  console.log('ALL KEYS VERIFIED! 0 missing keys.');
}
