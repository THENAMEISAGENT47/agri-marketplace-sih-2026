const http = require('http');

function postJSON(path, payload) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => resolve({ error: err.message }));
    req.write(postData);
    req.end();
  });
}

function getJSON(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

(async () => {
  console.log('=== TEST INVENTORY MUTATION PERSISTENCE ===');

  // 1. Add Produce
  const testId = 'prod-test-' + Date.now().toString().slice(-4);
  console.log('\n1. Adding test lot:', testId);
  const addRes = await postJSON('/api/inventory', {
    action: 'add',
    item: {
      product_id: testId,
      farmer_id: 'farmer1',
      product_name: 'Organic Spinach',
      product_variety: 'Palak Hybrid',
      available_quantity: 350,
      unit: 'kg',
      price_per_unit: 30,
      category: 'Vegetables',
      is_available: true,
      quality_grade: 'A'
    }
  });
  console.log('Add Status:', addRes.status, 'Item:', addRes.json?.item?.product_name);

  // 2. Fetch inventory and check presence
  console.log('\n2. Fetching /api/inventory?farmer_id=farmer1');
  const get1 = await getJSON('/api/inventory?farmer_id=farmer1');
  const found1 = get1.json?.find(i => i.product_id === testId);
  console.log('Found added lot:', found1 ? `${found1.product_name} (${found1.available_quantity}kg, available: ${found1.is_available})` : 'NOT FOUND');

  // 3. Hold lot (update availability to false)
  console.log('\n3. Holding lot');
  const holdRes = await postJSON('/api/inventory', {
    action: 'update_availability',
    product_id: testId,
    farmer_id: 'farmer1',
    is_available: false
  });
  console.log('Hold Status:', holdRes.status, 'is_available:', holdRes.json?.item?.is_available);

  // 4. Verify held state
  const get2 = await getJSON('/api/inventory?farmer_id=farmer1');
  const found2 = get2.json?.find(i => i.product_id === testId);
  console.log('Found after hold:', found2 ? `available=${found2.is_available}` : 'NOT FOUND');

  // 5. Release lot (update availability to true)
  console.log('\n5. Releasing lot');
  const releaseRes = await postJSON('/api/inventory', {
    action: 'update_availability',
    product_id: testId,
    farmer_id: 'farmer1',
    is_available: true
  });
  console.log('Release Status:', releaseRes.status, 'is_available:', releaseRes.json?.item?.is_available);

  // 6. Delete lot
  console.log('\n6. Deleting lot');
  const delRes = await postJSON('/api/inventory', {
    action: 'delete',
    product_id: testId,
    farmer_id: 'farmer1'
  });
  console.log('Delete Status:', delRes.status, 'success:', delRes.json?.success);

  // 7. Verify deletion
  const get3 = await getJSON('/api/inventory?farmer_id=farmer1');
  const found3 = get3.json?.find(i => i.product_id === testId);
  console.log('Found after delete:', found3 ? 'STILL PRESENT (FAIL)' : 'CONFIRMED DELETED (SUCCESS)');
})();
