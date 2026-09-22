async function verifyLogin() {
  const res = await fetch('http://localhost:3000/login');
  console.log('Login HTTP Status:', res.status);
  const html = await res.text();
  console.log('Contains Welcome Back:', html.includes('Welcome Back') || html.includes('वापसी पर स्वागत'));
  console.log('Contains Agricultural Supply Network:', html.includes('Agricultural Supply Network'));
  console.log('Contains Nashik Cluster:', html.includes('Nashik Cluster'));
  console.log('Contains Pune Agri Hub:', html.includes('Pune Agri Hub'));
  console.log('Contains farmer1@demo.com:', html.includes('farmer1@demo.com'));
  console.log('Contains buyer1@demo.com:', html.includes('buyer1@demo.com'));
  console.log('Contains email input:', html.includes('type="email"'));
  console.log('Contains password input:', html.includes('type="password"'));
  console.log('Contains submit button:', html.includes('type="submit"'));
  console.log('Contains DIRECT FARMGATE tag:', html.includes('DIRECT FARMGATE'));
  console.log('Contains SMART MATCHING tag:', html.includes('SMART MATCHING'));
  console.log('Contains MARKET ACCESS tag:', html.includes('MARKET ACCESS'));
}

verifyLogin().catch(console.error);
