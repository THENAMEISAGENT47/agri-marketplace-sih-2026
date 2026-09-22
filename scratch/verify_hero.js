async function verifyHero() {
  const res = await fetch('http://localhost:3000');
  console.log('Homepage HTTP Status:', res.status);
  const html = await res.text();
  
  // 1. Check hero background image presence
  const hasHeroImg = html.includes('home-hero.png') || html.includes('home-hero');
  console.log('Hero image present in SSR:', hasHeroImg);
  
  // 2. Check TextEffect and copy
  console.log('Heading "Buy better. Sell directly." present:', html.includes('Buy better. Sell directly.'));
  console.log('Proof badge present:', html.includes('DIRECT FARMGATE TO INSTITUTIONAL BUYER') || html.includes('hero.proof_badge'));
  console.log('Browse Marketplace CTA present:', html.includes('Browse Marketplace') || html.includes('browse_marketplace'));
  console.log('Sell Produce CTA present:', html.includes('Sell Produce') || html.includes('btn_sell_produce'));
  
  // 3. Extract hero HTML snippet
  const heroIndex = html.indexOf('id="hero"');
  if (heroIndex !== -1) {
    const heroSnippet = html.slice(heroIndex, heroIndex + 4000);
    console.log('\n--- Hero HTML Snippet ---\n', heroSnippet);
  }
  
  // 4. Test image fetch directly
  const imgRes = await fetch('http://localhost:3000/images/home-hero.png');
  console.log('\nDirect image /images/home-hero.png fetch status:', imgRes.status);
  console.log('Image content-type:', imgRes.headers.get('content-type'));
  console.log('Image content-length:', imgRes.headers.get('content-length'));
}

verifyHero().catch(console.error);
