import { preview } from 'vite';

const urlsToTest = [
  '/',
  '/product/black-leaves',
  '/shop',
  '/product/mirror-mosaic-1',
  '/product/photo-frames-1',
  '/category/vases',
  '/category/paintings'
];

async function run() {
  console.log('🚀 Starting Vite preview server on port 4188...');
  const server = await preview({ preview: { port: 4188 } });

  console.log('\n================ METADATA VALIDATION REPORT ================');
  let allPassed = true;

  for (const path of urlsToTest) {
    const res = await fetch(`http://localhost:4188${path}`);
    const html = await res.text();

    const getMeta = (prop, attr = 'property') => {
      const regex = new RegExp(`<meta\\s+[^>]*(?:${attr}|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i');
      const match = html.match(regex);
      return match ? match[1] : null;
    };

    const getTitle = () => {
      const match = html.match(/<title>([^<]*)<\/title>/i);
      return match ? match[1] : null;
    };

    const title = getTitle();
    const ogUrl = getMeta('og:url');
    const ogType = getMeta('og:type');
    const ogTitle = getMeta('og:title');
    const ogDesc = getMeta('og:description');
    const ogImage = getMeta('og:image');
    const ogSiteName = getMeta('og:site_name');
    const ogLocale = getMeta('og:locale');
    const twCard = getMeta('twitter:card', 'name');
    const twTitle = getMeta('twitter:title', 'name');
    const twDesc = getMeta('twitter:description', 'name');
    const twImage = getMeta('twitter:image', 'name');

    console.log(`\nURL: https://www.brushspace.in${path}`);
    console.log(`  HTTP Response: ${res.status}`);
    console.log(`  <title>: ${title}`);
    console.log(`  og:url: ${ogUrl}`);
    console.log(`  og:type: ${ogType}`);
    console.log(`  og:title: ${ogTitle}`);
    console.log(`  og:description: ${ogDesc ? ogDesc.substring(0, 70) + '...' : 'NULL'}`);
    console.log(`  og:image: ${ogImage}`);
    console.log(`  og:site_name: ${ogSiteName} | og:locale: ${ogLocale}`);
    console.log(`  twitter:card: ${twCard}`);
    console.log(`  twitter:title: ${twTitle}`);
    console.log(`  twitter:image: ${twImage}`);

    const checks = [
      { name: 'og:url', val: ogUrl },
      { name: 'og:type', val: ogType },
      { name: 'og:title', val: ogTitle },
      { name: 'og:description', val: ogDesc },
      { name: 'og:image', val: ogImage },
      { name: 'og:site_name', val: ogSiteName },
      { name: 'og:locale', val: ogLocale },
      { name: 'twitter:card', val: twCard },
      { name: 'twitter:title', val: twTitle },
      { name: 'twitter:description', val: twDesc },
      { name: 'twitter:image', val: twImage }
    ];

    const missing = checks.filter(c => !c.val || c.val.trim().length === 0);
    if (missing.length > 0) {
      console.error(`  ❌ FAILED: Missing or empty tags: ${missing.map(m => m.name).join(', ')}`);
      allPassed = false;
    } else {
      console.log('  ✅ PASSED: All Open Graph and Twitter tags present and non-empty');
    }
  }

  await server.close();

  if (!allPassed) {
    console.error('\n❌ VALIDATION FAILED: Some URLs failed metadata checks.');
    process.exit(1);
  }

  console.log('\n================ ALL TESTED URLS PASSED VALIDATION! ================');
  process.exit(0);
}

run().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
