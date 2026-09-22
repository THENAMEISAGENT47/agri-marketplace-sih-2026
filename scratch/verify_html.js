const http = require('http');

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  const home = await fetchUrl('/');
  console.log('Homepage status:', home.status);
  console.log('Homepage has "Buy better":', home.data.includes('Buy better'));
  console.log('Homepage has "Sell directly":', home.data.includes('Sell directly'));
  console.log('Homepage has "Market Insights":', home.data.includes('Market Insights') || home.data.includes('Direct Market Insights'));
  console.log('Homepage has "How It Works":', home.data.includes('How It Works'));
  console.log('Homepage has "Farmers":', /farmers/i.test(home.data));
  console.log('Homepage has "About Us":', home.data.includes('About Us') || home.data.includes('About AgriMarketplace'));
  console.log('Homepage has "Chhattisgarh":', home.data.includes('Chhattisgarh'));

  const market = await fetchUrl('/marketplace');
  console.log('Marketplace status:', market.status);
  console.log('Marketplace has Ragi:', market.data.includes('Ragi'));
  console.log('Marketplace has Foxtail Millet:', market.data.includes('Foxtail Millet'));
  console.log('Marketplace has Kodo Millet:', market.data.includes('Kodo Millet'));
  console.log('Marketplace has Little Millet:', market.data.includes('Little Millet'));
  console.log('Marketplace has ₹37/kg:', market.data.includes('37'));
  console.log('Marketplace has ₹26/kg:', market.data.includes('26'));
  console.log('Marketplace has Demo Reference Price:', market.data.includes('Demo Reference Price'));
  console.log('Marketplace has Harvested/Expected:', market.data.includes('Harvested') || market.data.includes('Expected'));
}
verify();
