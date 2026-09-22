const http = require('http');

async function verifyMarketplace() {
  console.log('=== MARKETPLACE GRID & DEMO BADGE AUDIT ===');

  const res = await fetch('http://localhost:3000/marketplace');
  console.log('GET /marketplace status:', res.status);
  const html = await res.text();

  // 1. Verify DemoModeIndicator / floating badge is removed
  const hasDemoModeBadge = html.includes('fixed bottom-4 right-4') || html.includes('DEMO MODE · SIH Demo Guide');
  console.log('Has floating DEMO MODE badge:', hasDemoModeBadge, '(Expected: false)');

  // 2. Verify grid classes
  const has4ColGrid = html.includes('2xl:grid-cols-4');
  console.log('Has 2xl:grid-cols-4 class in HTML:', has4ColGrid, '(Expected: true)');

  const hasOrphanHack = html.includes('last-child:nth-child(3n+1)');
  console.log('Has orphan-column spanning hack:', hasOrphanHack, '(Expected: false)');

  // 3. Verify container expansion
  const hasContainerMaxW = html.includes('2xl:max-w-[1600px]');
  console.log('Has 2xl:max-w-[1600px] container:', hasContainerMaxW, '(Expected: true)');

  console.log('=== AUDIT COMPLETE ===');
}

verifyMarketplace().catch(console.error);
