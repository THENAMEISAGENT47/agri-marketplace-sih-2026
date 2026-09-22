const http = require('http');

const urls = [
  'http://localhost:3000/farmer/dashboard',
  'http://localhost:3000/farmer/products',
  'http://localhost:3000/farmer/orders',
  'http://localhost:3000/farmer/profile'
];

async function checkUrl(url) {
  const res = await fetch(url);
  const text = await res.text();
  console.log(`\n=== Testing ${url} (Status: ${res.status}) ===`);
  
  // Check if Ramesh Kumar is present
  console.log('Contains "Ramesh Kumar":', text.includes('Ramesh Kumar'));
  console.log('Contains "farmer1@demo.com":', text.includes('farmer1@demo.com'));
  
  // Find all occurrences of buyer1@demo.com
  let idx = 0;
  let matches = [];
  while ((idx = text.indexOf('buyer1@demo.com', idx)) !== -1) {
    const start = Math.max(0, idx - 80);
    const end = Math.min(text.length, idx + 100);
    matches.push(text.slice(start, end).replace(/\s+/g, ' '));
    idx += 'buyer1@demo.com'.length;
  }
  console.log(`Occurrences of "buyer1@demo.com": ${matches.length}`);
  matches.forEach((m, i) => console.log(`  Match ${i+1}: ...${m}...`));

  // Check for hardcoded 4 active lots or 3,900 kg
  console.log('Contains hardcoded "3,900 kg":', text.includes('3,900 kg') || text.includes('3900 kg'));
  console.log('Contains "Amit Sharma":', text.includes('Amit Sharma'));
}

async function run() {
  for (const url of urls) {
    await checkUrl(url);
  }
}

run();
