const http = require('http');

function getHTML(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

(async () => {
  console.log('=== TEST BUYER ORDER DETAIL FALLBACK ===');
  
  // 1. Valid order
  const valid = await getHTML('/buyer/orders/ORD-001');
  console.log('ORD-001 status:', valid.status);
  console.log('Valid contains ORD-001:', valid.html.includes('ORD-001'));
  console.log('Valid contains not found text:', valid.html.includes('Order not found or still syncing'));

  // 2. Invalid order
  const invalid = await getHTML('/buyer/orders/ORD-9999');
  console.log('\nORD-9999 status:', invalid.status);
  console.log('Invalid contains ORD-9999:', invalid.html.includes('ORD-9999'));
  console.log('Invalid contains not found text:', invalid.html.includes('Order not found or still syncing'));
  console.log('Invalid silently rendered ORD-001:', invalid.html.includes('ORD-001'));
})();
