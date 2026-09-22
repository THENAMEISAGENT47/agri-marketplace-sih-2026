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
    } else if (extList.includes(path.extname(file))) {
      results.push(fullPath);
    }
  });
  return results;
}

const langContextPath = path.resolve('src/contexts/LanguageContext.tsx');
const langContent = fs.readFileSync(langContextPath, 'utf8');

// Parse translation objects
const keyMatches = [...langContent.matchAll(/'([^']+)'\s*:\s*\{\s*en\s*:\s*'([^']*)'\s*,\s*hi\s*:\s*'([^']*)'\s*\}/g)];
const translationsMap = new Map();
keyMatches.forEach(m => {
  translationsMap.set(m[1], { en: m[2], hi: m[3] });
});

console.log('Parsed translation entries:', translationsMap.size);

// Scan for untranslated (where hi === en or hi is empty)
const emptyHindi = [];
const identicalHindi = [];
translationsMap.forEach((val, key) => {
  if (!val.hi || val.hi.trim() === '') {
    emptyHindi.push(key);
  } else if (val.hi.toLowerCase() === val.en.toLowerCase() && !key.includes('brand') && !key.includes('logo') && !key.includes('title')) {
    // some brand names might be identical, but check if there are actual words
    identicalHindi.push({ key, val });
  }
});

console.log('Empty Hindi translations:', emptyHindi.length);
if (emptyHindi.length > 0) {
  console.log(emptyHindi);
}

console.log('Identical English and Hindi (potential untranslated):', identicalHindi.length);
identicalHindi.slice(0, 10).forEach(i => console.log('  ', i.key, '->', i.val.en));

// Check t() usage across codebase
const allSrcFiles = getFiles(path.resolve('src'));
const usedKeys = new Set();
allSrcFiles.forEach(file => {
  if (file === langContextPath) return;
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/\bt\(\s*['"]([^'"]+)['"]\s*\)/g)];
  matches.forEach(m => usedKeys.add(m[1]));
});

const usedWithoutHindi = [];
usedKeys.forEach(k => {
  const trans = translationsMap.get(k);
  if (!trans || !trans.hi) {
    usedWithoutHindi.push(k);
  }
});

console.log('Used keys in UI without valid Hindi:', usedWithoutHindi.length);
if (usedWithoutHindi.length > 0) {
  console.log('Sample missing Hindi for used keys:', usedWithoutHindi.slice(0, 10));
}
