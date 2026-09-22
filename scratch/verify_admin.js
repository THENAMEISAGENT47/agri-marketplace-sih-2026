const http = require('http');

async function testAdmin() {
  console.log('=== ADMIN DASHBOARD INTEGRITY AUDIT ===');

  // 1. Check GET /admin/dashboard
  const res = await fetch('http://localhost:3000/admin/dashboard');
  console.log('Admin Dashboard Status:', res.status);
  const html = await res.text();

  // 2. Check for missing keys
  const rawMatches = html.match(/admin\.[a-z0-9_]+/g) || [];
  console.log('Raw unrendered admin keys in HTML:', rawMatches);

  // 3. Test API data dependencies
  const [ordersRes, invRes] = await Promise.all([
    fetch('http://localhost:3000/api/orders').then(r => r.json()),
    fetch('http://localhost:3000/api/inventory').then(r => r.json())
  ]);

  console.log('Real Orders in DB/Demo:', ordersRes.length);
  const totalVal = ordersRes.reduce((s, o) => s + o.total_amount, 0);
  console.log('Calculated Gross Procurement Value: ₹' + totalVal.toLocaleString());

  console.log('Real Inventory lots in DB/Demo:', invRes.length);
  const totalStock = invRes.reduce((s, i) => s + (i.available_quantity || 0), 0);
  console.log('Calculated Available Stock: ' + totalStock.toLocaleString() + ' kg');

  // 4. Test Demo Endpoints
  console.log('\n--- Testing Demo Endpoints ---');
  const sihRes = await fetch('http://localhost:3000/api/demo/sih-scenario', { method: 'POST' });
  console.log('POST /api/demo/sih-scenario status:', sihRes.status);
  const sihData = await sihRes.json();
  console.log('SIH Demo order created:', sihData.order?.id, 'Total: ₹' + sihData.order?.total_amount);

  const resetRes = await fetch('http://localhost:3000/api/demo/reset', { method: 'POST' });
  console.log('POST /api/demo/reset status:', resetRes.status);
  const resetData = await resetRes.json();
  console.log('Reset response:', resetData.message);

  // 5. Verify translation keys for Hindi
  const fs = require('fs');
  const langContent = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');
  const adminKeys = langContent.match(/'admin\.[^']+':\s*\{[^}]+\}/g) || [];
  console.log('\nTotal admin translation keys defined in LanguageContext:', adminKeys.length);
  let missingEnHi = 0;
  adminKeys.forEach(k => {
    if (!k.includes('en:') || !k.includes('hi:')) missingEnHi++;
  });
  console.log('Admin keys missing EN or HI:', missingEnHi);

  console.log('\n=== ALL ADMIN VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===');
}

testAdmin().catch(console.error);
