async function verifyFooter() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  const idx = html.indexOf('id="site-footer"');
  console.log('Found site-footer:', idx !== -1);
  if (idx !== -1) {
    const endIdx = html.indexOf('</footer>', idx);
    const bottomBar = html.slice(endIdx - 1500, endIdx);
    console.log('--- Bottom Bar HTML ---\n', bottomBar);
  }
}

verifyFooter().catch(console.error);
