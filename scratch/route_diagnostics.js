const http = require('http');
const fs = require('fs');

const routes = [
  '/',
  '/marketplace',
  '/login',
  '/register',
  '/buyer/dashboard',
  '/buyer/matching',
  '/buyer/orders',
  '/buyer/orders/ORD-001',
  '/buyer/route',
  '/farmer/dashboard',
  '/farmer/products',
  '/farmer/orders',
  '/farmer/profile',
  '/admin/dashboard'
];

// Load known translation keys
const langContent = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');
const keyMatches = [...langContent.matchAll(/'([^']+)'\s*:\s*\{/g)].map(m => m[1]);

async function inspectRoute(r) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + r, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for raw translation keys leaked into html text
        const stripped = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        const leakedKeys = keyMatches.filter(k => stripped.includes(k));

        // Look for broken images (src="") or missing src
        const emptyImgMatches = (data.match(/<img[^>]*src=["']["'][^>]*>/gi) || []).length;
        
        // Check for common error strings
        const hasReactError = data.includes('Internal Server Error') || 
                              data.includes('Unhandled Runtime Error') ||
                              data.includes('Minified React error');

        resolve({
          route: r,
          status: res.statusCode,
          length: data.length,
          hasReactError,
          emptyImages: emptyImgMatches,
          leakedKeysCount: leakedKeys.length,
          sampleLeaked: leakedKeys.slice(0, 5)
        });
      });
    }).on('error', err => resolve({ route: r, error: err.message }));
  });
}

(async () => {
  console.log('=== ROUTE SSR AUDIT ===');
  for (const r of routes) {
    const res = await inspectRoute(r);
    console.log(JSON.stringify(res));
  }
})();
