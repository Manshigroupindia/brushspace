import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, terminate } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');

const BASE_URL = 'https://www.brushspace.in';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg';
const SITE_NAME = 'Brushspace';
const LOCALE = 'en_IN';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBI2RQPmj_N4Fo9YHuV2aPu0mLXj6jK7KU",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "brushspace-17bf4.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "brushspace-17bf4",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "brushspace-17bf4.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1046513833436",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:1046513833436:web:6b6d0b135f1ae492836b19",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-01TCS5LLC0"
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanImageUrl(img) {
  if (!img) return DEFAULT_IMAGE;
  let url = String(img).trim();
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  if (!url.startsWith('http')) return `https://${url}`;
  return url;
}

function buildMetaBlock(meta) {
  const url = meta.url.startsWith('http') ? meta.url : `${BASE_URL}${meta.url.startsWith('/') ? '' : '/'}${meta.url}`;
  const title = meta.title || 'BRUSHSPACE — Artistic Home Décor & Curated Objects';
  const description = meta.description || 'Discover handcrafted vases, decorative trees, trays, mirror mosaic and floral home décor pieces designed to add warmth and quiet beauty to modern spaces.';
  const image = cleanImageUrl(meta.image);
  const type = meta.type || 'website';
  const imageType = image.endsWith('.png') ? 'image/png' : image.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  const imageWidth = meta.imageWidth || '1200';
  const imageHeight = meta.imageHeight || '630';

  let productTags = '';
  if (type === 'product' && meta.price) {
    productTags = `
    <meta property="product:price:amount" content="${escapeHtml(meta.price)}" />
    <meta property="product:price:currency" content="INR" />
    <meta property="product:availability" content="in stock" />`;
  }

  return `<!-- METADATA_START -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />

    <!-- Open Graph Metadata -->
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="${escapeHtml(LOCALE)}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="${escapeHtml(imageWidth)}" />
    <meta property="og:image:height" content="${escapeHtml(imageHeight)}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:image:type" content="${escapeHtml(imageType)}" />${productTags}

    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(url)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
    <!-- METADATA_END -->`;
}

function replaceMeta(html, meta) {
  const metaBlock = buildMetaBlock(meta);
  const regex = /<!-- METADATA_START -->[\s\S]*?<!-- METADATA_END -->/;
  if (regex.test(html)) {
    return html.replace(regex, metaBlock);
  }
  // Fallback: replace title and description and inject before </head>
  const cleanHtml = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][\s\S]*?>/i, '');
  return cleanHtml.replace('</head>', `  ${metaBlock}\n  </head>`);
}

function writePage(routePath, htmlContent) {
  const cleanRoute = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  
  if (!cleanRoute) {
    // Root index.html
    fs.writeFileSync(templatePath, htmlContent, 'utf8');
    return;
  }

  // 1. Directory based index.html (/shop/index.html)
  const dirPath = path.join(distDir, cleanRoute);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent, 'utf8');

  // 2. Clean URL html file (/shop.html)
  const filePath = path.join(distDir, `${cleanRoute}.html`);
  const parentDir = path.dirname(filePath);
  fs.mkdirSync(parentDir, { recursive: true });
  fs.writeFileSync(filePath, htmlContent, 'utf8');
}

async function fetchProductsAndCategories() {
  console.log('🔄 Fetching products and categories for metadata pre-rendering...');

  // Helper with timeout
  const timeoutPromise = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms));

  // 1. Try Firebase SDK
  try {
    const fetchFirestore = async () => {
      const app = initializeApp(firebaseConfig, `meta-gen-${Date.now()}`);
      const db = getFirestore(app);
      const [catSnap, prodSnap] = await Promise.all([
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'products'))
      ]);
      const categories = catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const products = prodSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      await terminate(db).catch(() => {});
      return { categories, products };
    };

    const result = await Promise.race([fetchFirestore(), timeoutPromise(6000)]);
    if (result.categories.length > 0 && result.products.length > 0) {
      console.log(`✅ Loaded ${result.categories.length} categories and ${result.products.length} products via Firebase SDK`);
      // Update cache
      fs.writeFileSync(
        path.join(__dirname, 'local_catalog_cache.json'),
        JSON.stringify(result, null, 2),
        'utf8'
      );
      return result;
    }
  } catch (err) {
    console.warn('⚠️ Firebase SDK attempt skipped/timed out:', err.message);
  }

  // 2. Try Firestore REST API
  try {
    console.log('🔄 Attempting Firestore REST API...');
    const restFetch = async () => {
      const catRes = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/categories`);
      const catJson = await catRes.json();
      const prodRes = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/products?pageSize=150`);
      const prodJson = await prodRes.json();

      const categories = (catJson.documents || []).map((d) => {
        const f = d.fields || {};
        return {
          id: d.name.split('/').pop(),
          name: f.name?.stringValue || '',
          slug: f.slug?.stringValue || '',
          description: f.description?.stringValue || '',
          image: f.image?.stringValue || '',
          isActive: f.isActive?.booleanValue ?? true,
        };
      });

      const products = (prodJson.documents || []).map((d) => {
        const f = d.fields || {};
        const images = (f.images?.arrayValue?.values || []).map((v) => v.stringValue).filter(Boolean);
        return {
          id: d.name.split('/').pop(),
          name: f.name?.stringValue || '',
          slug: f.slug?.stringValue || '',
          description: f.description?.stringValue || '',
          shortDescription: f.shortDescription?.stringValue || '',
          category: f.category?.stringValue || f.categoryName?.stringValue || '',
          categorySlug: f.categorySlug?.stringValue || '',
          price: Number(f.price?.integerValue || f.price?.doubleValue || 0),
          images,
          isActive: f.isActive?.booleanValue ?? f.active?.booleanValue ?? true,
        };
      });
      return { categories, products };
    };

    const restResult = await Promise.race([restFetch(), timeoutPromise(6000)]);
    if (restResult.categories.length > 0 && restResult.products.length > 0) {
      console.log(`✅ Loaded ${restResult.categories.length} categories and ${restResult.products.length} products via Firestore REST API`);
      return restResult;
    }
  } catch (err) {
    console.warn('⚠️ Firestore REST API fetch skipped/timed out:', err.message);
  }

  // 3. Fallback: local_catalog_cache.json
  const cachePath = path.join(__dirname, 'local_catalog_cache.json');
  if (fs.existsSync(cachePath)) {
    console.log('🔄 Using local_catalog_cache.json fallback...');
    const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    if (cacheData.categories && cacheData.products) {
      console.log(`✅ Loaded ${cacheData.categories.length} categories and ${cacheData.products.length} products from local cache`);
      return cacheData;
    }
  }

  throw new Error('❌ Unable to retrieve catalog data for static metadata pre-rendering');
}

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template ${templatePath} not found! Run "vite build" first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const { categories, products } = await fetchProductsAndCategories();

  let generatedCount = 0;

  // 1. Static Public Pages
  const staticPages = [
    {
      route: '',
      title: 'BRUSHSPACE — Artistic Home Décor & Curated Objects',
      description: 'Discover handcrafted vases, decorative trees, trays, mirror mosaic and floral home décor pieces designed to add warmth and quiet beauty to modern spaces.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/`,
      type: 'website'
    },
    {
      route: 'shop',
      title: 'Shop Handcrafted Décor & Studio Objects | Brushspace',
      description: 'Explore our complete catalog of sculptural vases, ceramic artifacts, metallic trees, and artistic home décor accents.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/shop`,
      type: 'website'
    },
    {
      route: 'categories',
      title: 'Disciplines & Mediums — Curated Categories | Brushspace',
      description: 'Browse handcrafted collections across Vases & Vessels, Paintings, Gift Décor, 3-D Art, Festive Accents, and Decorative Furniture.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/categories`,
      type: 'website'
    },
    {
      route: 'about',
      title: 'About Our Atelier — Story & Philosophy | Brushspace',
      description: 'Learn about Brushspace — an artisan atelier dedicated to slow craft, tactile textures, and timeless living room statement pieces.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/about`,
      type: 'website'
    },
    {
      route: 'contact',
      title: 'Contact Studio & Showrooms | Brushspace',
      description: 'Get in touch with the Brushspace atelier team for bespoke orders, showroom visits, and styling inquiries.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/contact`,
      type: 'website'
    },
    {
      route: 'faq',
      title: 'Studio FAQs & Ordering Inquiries | Brushspace',
      description: 'Frequently asked questions about our handcrafted artifacts, care instructions, pan-India delivery, and custom gifting.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/faq`,
      type: 'website'
    },
    {
      route: 'search',
      title: 'Search Handcrafted Artifacts | Brushspace',
      description: 'Search across our collection of studio handmade vases, paintings, and artistic décor.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/search`,
      type: 'website'
    },
    {
      route: 'wishlist',
      title: 'Saved Artifacts — Wishlist | Brushspace',
      description: 'Review your saved handcrafted home décor items and curated collection.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/wishlist`,
      type: 'website'
    },
    {
      route: 'cart',
      title: 'Your Curated Bag | Brushspace',
      description: 'Review items in your shopping bag and checkout securely via WhatsApp.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/cart`,
      type: 'website'
    },
    {
      route: 'privacy-policy',
      title: 'Privacy Policy | Brushspace',
      description: 'Learn how Brushspace protects collector and visitor data.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/privacy-policy`,
      type: 'website'
    },
    {
      route: 'terms',
      title: 'Terms of Service | Brushspace',
      description: 'Review terms and conditions for purchasing handcrafted decorative pieces from Brushspace.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/terms`,
      type: 'website'
    },
    {
      route: 'shipping-policy',
      title: 'Shipping & Delivery Policy | Brushspace',
      description: 'Learn about our white-glove packaging and pan-India safe shipping standards.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/shipping-policy`,
      type: 'website'
    },
    {
      route: 'return-policy',
      title: 'Returns & Exchanges Policy | Brushspace',
      description: 'Guidelines on transit damage, replacements, and our collector satisfaction guarantee.',
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/return-policy`,
      type: 'website'
    }
  ];

  for (const page of staticPages) {
    const pageHtml = replaceMeta(templateHtml, page);
    writePage(page.route, pageHtml);
    generatedCount++;
  }

  // 2. Category Pages
  for (const cat of categories) {
    if (!cat.slug) continue;
    const catSlug = cat.slug.toLowerCase();
    const catName = cat.name || catSlug.toUpperCase();
    const catDesc = cat.description || `Explore handcrafted ${catName} pieces from the Brushspace studio.`;
    const catImage = cat.image || DEFAULT_IMAGE;

    const pageMeta = {
      title: `${catName} | Brushspace`,
      description: catDesc,
      url: `${BASE_URL}/category/${catSlug}`,
      image: catImage,
      type: 'website'
    };

    const pageHtml = replaceMeta(templateHtml, pageMeta);
    writePage(`category/${catSlug}`, pageHtml);
    generatedCount++;
  }

  // 3. Product Pages
  const activeProducts = products.filter((p) => p.isActive !== false);
  for (const prod of activeProducts) {
    if (!prod.slug) continue;
    const prodSlug = prod.slug.toLowerCase();
    const prodName = prod.name || prodSlug.replace(/-/g, ' ');

    let prodDesc = '';
    if (prod.description && !prod.description.includes('will be updated soon')) {
      prodDesc = prod.description;
    } else if (prod.shortDescription) {
      prodDesc = prod.shortDescription;
    } else if (prod.description) {
      prodDesc = prod.description;
    } else {
      prodDesc = `Handcrafted ${prodName} from Brushspace. Artfully designed for modern, tranquil living spaces.`;
    }

    const prodImage = (prod.images && prod.images.length > 0) ? prod.images[0] : DEFAULT_IMAGE;

    const pageMeta = {
      title: `${prodName} | Brushspace`,
      description: prodDesc,
      url: `${BASE_URL}/product/${prodSlug}`,
      image: prodImage,
      type: 'product',
      price: prod.price > 0 ? prod.price : undefined
    };

    const pageHtml = replaceMeta(templateHtml, pageMeta);
    writePage(`product/${prodSlug}`, pageHtml);
    generatedCount++;
  }

  // 4. Create 404 page
  const notFoundMeta = {
    title: '404 — Space Not Found | Brushspace',
    description: 'The handcrafted object, curation, or page you are looking for has been archived or does not exist.',
    url: `${BASE_URL}/404`,
    image: DEFAULT_IMAGE,
    type: 'website'
  };
  const notFoundHtml = replaceMeta(templateHtml, notFoundMeta);
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

  console.log(`✨ Successfully generated ${generatedCount} static pages with complete Open Graph & Twitter metadata!`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Failed to generate metadata pages:', err);
  process.exit(1);
});
