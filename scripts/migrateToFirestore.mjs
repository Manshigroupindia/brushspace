import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: "AIzaSyBI2RQPmj_N4Fo9YHuV2aPu0mLXj6jK7KU",
  authDomain: "brushspace-17bf4.firebaseapp.com",
  projectId: "brushspace-17bf4",
  storageBucket: "brushspace-17bf4.firebasestorage.app",
  messagingSenderId: "1046513833436",
  appId: "1:1046513833436:web:6b6d0b135f1ae492836b19",
  measurementId: "G-01TCS5LLC0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (email && password) {
    console.log(`Authenticating as admin ${email}...`);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Admin authenticated successfully!');
    } catch (err) {
      console.error('Authentication error:', err.message);
      process.exit(1);
    }
  } else {
    console.log('Note: No admin credentials provided as CLI arguments.');
    console.log('Usage: node scripts/migrateToFirestore.mjs <admin_email> <admin_password>');
    console.log('Attempting unauthenticated write (will succeed if Firestore rules allow or are in test mode)...');
  }

  const dataFile = path.join(__dirname, 'migrated_data.json');
  if (!fs.existsSync(dataFile)) {
    console.error('migrated_data.json not found! Run node scripts/migrateAllToCloudinary.mjs first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  console.log(`Found ${data.products.length} products, ${data.categories.length} categories, ${data.banners.length} banners.`);

  // 1. Settings
  console.log('\n--- Migrating Settings to Firestore ---');
  await setDoc(doc(db, 'settings', 'global'), {
    ...data.settings,
    siteName: data.settings.brandName,
    siteDescription: data.settings.tagline,
    logo: data.settings.logoUrl,
    favicon: data.settings.faviconUrl,
    announcementText: data.settings.announcementBarText,
    email: data.settings.contactEmail,
    phone: data.settings.contactPhone,
    address: data.settings.showroomAddress,
    instagram: data.settings.socialInstagram,
    pinterest: data.settings.socialPinterest,
    facebook: data.settings.socialFacebook,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  console.log('Settings synced to settings/global');

  // 2. Categories
  console.log('\n--- Migrating Categories to Firestore ---');
  for (const cat of data.categories) {
    const docId = cat.slug || cat.id;
    await setDoc(doc(db, 'categories', docId), {
      ...cat,
      sortOrder: cat.displayOrder,
      active: cat.isActive,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`Category synced: categories/${docId}`);
  }

  // 3. Products
  console.log('\n--- Migrating Products to Firestore ---');
  for (const prod of data.products) {
    const docId = prod.slug || prod.id;
    await setDoc(doc(db, 'products', docId), {
      ...prod,
      code: prod.productCode,
      active: prod.isActive,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`Product synced: products/${docId} (${prod.name})`);
  }

  // 4. Banners
  console.log('\n--- Migrating Banners to Firestore ---');
  for (const ban of data.banners) {
    const docId = ban.id;
    await setDoc(doc(db, 'banners', docId), {
      ...ban,
      buttonLink: ban.buttonUrl,
      active: ban.isActive,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`Banner synced: banners/${docId}`);
  }

  // 5. Testimonials
  console.log('\n--- Migrating Testimonials to Firestore ---');
  for (const t of data.testimonials) {
    const docId = t.id;
    await setDoc(doc(db, 'testimonials', docId), {
      ...t,
      message: t.review,
      active: t.isActive,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`Testimonial synced: testimonials/${docId}`);
  }

  // 6. FAQs
  console.log('\n--- Migrating FAQs to Firestore ---');
  for (const faq of data.faqs) {
    const docId = faq.id;
    await setDoc(doc(db, 'faqs', docId), {
      ...faq,
      sortOrder: faq.order,
      active: faq.isActive,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`FAQ synced: faqs/${docId}`);
  }

  console.log('\n=== FIRESTORE MIGRATION COMPLETED SUCCESSFULLY! ===');
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
