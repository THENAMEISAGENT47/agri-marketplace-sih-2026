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
        resolve({
          status: res.statusCode,
          body: data.length > 500 ? data.slice(0, 500) + '...' : data
        });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message });
    });

    req.write(postData);
    req.end();
  });
}

(async () => {
  console.log('--- TEST 1: Flat coordinates { lat, lng } ---');
  const res1 = await postJSON('/api/ai/route-optimization', {
    pickup_locations: [
      {
        farmer_id: 'farmer1',
        farmer_name: 'Ramesh Kumar',
        location: { lat: 19.0760, lng: 72.8777 },
        quantity: 500
      }
    ],
    delivery_location: {
      lat: 19.0330,
      lng: 73.0297,
      buyer_id: 'buyer1'
    }
  });
  console.log('Status 1:', res1.status);
  console.log('Body 1:', res1.body);

  console.log('\n--- TEST 2: Nested coordinates { location: { lat, lng } } ---');
  const res2 = await postJSON('/api/ai/route-optimization', {
    pickup_locations: [
      {
        farmer_id: 'farmer1',
        farmer_name: 'Ramesh Kumar',
        location: { lat: 19.0760, lng: 72.8777 },
        quantity: 500
      }
    ],
    delivery_location: {
      location: { lat: 19.0330, lng: 73.0297 },
      buyer_id: 'buyer1'
    }
  });
  console.log('Status 2:', res2.status);
  console.log('Body 2:', res2.body);

  console.log('\n--- TEST 3: Malformed payload (should return 400, no 500 TypeError) ---');
  const res3 = await postJSON('/api/ai/route-optimization', {
    pickup_locations: [
      {
        farmer_id: 'farmer1'
      }
    ],
    delivery_location: {
      buyer_id: 'buyer1'
    }
  });
  console.log('Status 3:', res3.status);
  console.log('Body 3:', res3.body);
})();
