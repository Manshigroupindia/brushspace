import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

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

const PRODUCTS_TO_CREATE = [
  {
    order: 1,
    name: "Cindrella",
    sku: "VV-CINDRELLA-001",
    slug: "cindrella",
    altSlugs: ["cindrella-artistic-decorative-vase"],
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Cindrella", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 2,
    name: "Loving Birds",
    sku: "VV-LOVING-BIRDS-001",
    slug: "loving-birds",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Loving Birds", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 3,
    name: "Owl",
    sku: "VV-OWL-001",
    slug: "owl",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Owl", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 4,
    name: "Black-Golden Leaves",
    sku: "VV-BLACK-GOLDEN-LEAVES-001",
    slug: "black-golden-leaves",
    color: "Black & Gold",
    tags: ["Vases & Vessels", "Decorative Piece", "Black-Golden Leaves", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 5,
    name: "Black-Golden Leaves",
    sku: "VV-BLACK-GOLDEN-LEAVES-002",
    slug: "black-golden-leaves-2",
    color: "Black & Gold",
    tags: ["Vases & Vessels", "Decorative Piece", "Black-Golden Leaves", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 6,
    name: "Burgundy",
    sku: "VV-BURGUNDY-001",
    slug: "burgundy",
    color: "Burgundy",
    tags: ["Vases & Vessels", "Decorative Piece", "Burgundy", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 7,
    name: "Black Leaves",
    sku: "VV-BLACK-LEAVES-001",
    slug: "black-leaves",
    color: "Black",
    tags: ["Vases & Vessels", "Decorative Piece", "Black Leaves", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 8,
    name: "Black-Golden Beads",
    sku: "VV-BLACK-GOLDEN-BEADS-001",
    slug: "black-golden-beads",
    color: "Black & Gold",
    tags: ["Vases & Vessels", "Decorative Piece", "Black-Golden Beads", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 9,
    name: "Rust",
    sku: "VV-RUST-001",
    slug: "rust",
    color: "Rust",
    tags: ["Vases & Vessels", "Decorative Piece", "Rust", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 10,
    name: "Forest",
    sku: "VV-FOREST-001",
    slug: "forest",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Forest", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 11,
    name: "Mirror Mosaic 1",
    sku: "VV-MIRROR-MOSAIC-1-001",
    slug: "mirror-mosaic-1",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Mirror Mosaic", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 12,
    name: "Mirror Mosaic 2",
    sku: "VV-MIRROR-MOSAIC-2-001",
    slug: "mirror-mosaic-2",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Mirror Mosaic", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 13,
    name: "Mirror Mosaic Shimmer 3",
    sku: "VV-MIRROR-MOSAIC-SHIMMER-3-001",
    slug: "mirror-mosaic-shimmer-3",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Mirror Mosaic Shimmer", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 14,
    name: "Bonsai 1",
    sku: "VV-BONSAI-1-001",
    slug: "bonsai-1",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Bonsai", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 15,
    name: "Bonsai 2",
    sku: "VV-BONSAI-2-001",
    slug: "bonsai-2",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Bonsai", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 16,
    name: "Bonsai 3",
    sku: "VV-BONSAI-3-001",
    slug: "bonsai-3",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Bonsai", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 17,
    name: "White Printed",
    sku: "VV-WHITE-PRINTED-001",
    slug: "white-printed",
    color: "White",
    tags: ["Vases & Vessels", "Decorative Piece", "White Printed", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 18,
    name: "Red Printed",
    sku: "VV-RED-PRINTED-001",
    slug: "red-printed",
    color: "Red",
    tags: ["Vases & Vessels", "Decorative Piece", "Red Printed", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 19,
    name: "Green Yellow",
    sku: "VV-GREEN-YELLOW-001",
    slug: "green-yellow",
    color: "Green & Yellow",
    tags: ["Vases & Vessels", "Decorative Piece", "Green Yellow", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 20,
    name: "Green-Pink Leaves",
    sku: "VV-GREEN-PINK-LEAVES-001",
    slug: "green-pink-leaves",
    color: "Green & Pink",
    tags: ["Vases & Vessels", "Decorative Piece", "Green-Pink Leaves", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 21,
    name: "Black-Red Flowers",
    sku: "VV-BLACK-RED-FLOWERS-001",
    slug: "black-red-flowers",
    color: "Black & Red",
    tags: ["Vases & Vessels", "Decorative Piece", "Black-Red Flowers", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 22,
    name: "Shell",
    sku: "VV-SHELL-001",
    slug: "shell",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Shell", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 23,
    name: "Stand",
    sku: "VV-STAND-001",
    slug: "stand",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Stand", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 24,
    name: "Tray 1",
    sku: "VV-TRAY-1-001",
    slug: "tray-1",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Tray", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 25,
    name: "Tray 2",
    sku: "VV-TRAY-2-001",
    slug: "tray-2",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Tray", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 26,
    name: "Bag Shape",
    sku: "VV-BAG-SHAPE-001",
    slug: "bag-shape",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Bag Shape", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 27,
    name: "Rose Flower",
    sku: "VV-ROSE-FLOWER-001",
    slug: "rose-flower",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Rose Flower", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 28,
    name: "Bamboo",
    sku: "VV-BAMBOO-001",
    slug: "bamboo",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Bamboo", "Home Décor", "Tabletop Accent"]
  },
  {
    order: 29,
    name: "Peacock",
    sku: "VV-PEACOCK-001",
    slug: "peacock",
    color: "",
    tags: ["Vases & Vessels", "Decorative Piece", "Peacock", "Home Décor", "Tabletop Accent"]
  }
];

async function run() {
  console.log('=====================================================');
  console.log('       BULK PRODUCT CREATION - VASES & VESSELS       ');
  console.log('=====================================================\n');

  // 0. Authenticate as admin so Firestore write rules allow the operation
  console.log('Step 0: Authenticating with Firebase Auth...');
  const userCred = await signInWithEmailAndPassword(auth, "brushspace_admin@brushspace.com", "Brushspace@2026!");
  console.log(`Authenticated successfully as UID: ${userCred.user.uid}\n`);

  // 1. Fetch existing products from Firestore
  console.log('Step 1: Reading existing products from Firestore...');
  const snapshot = await getDocs(collection(db, 'products'));
  const existingProducts = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  console.log(`Found ${existingProducts.length} existing products in database.`);

  const existingSkus = new Set(
    existingProducts
      .map((p) => (p.productCode || p.code || '').toUpperCase())
      .filter(Boolean)
  );
  const existingSlugs = new Set(
    existingProducts
      .map((p) => (p.slug || '').toLowerCase())
      .filter(Boolean)
  );

  let createdCount = 0;
  let alreadyExistedCount = 0;
  const createdList = [];
  const existedList = [];

  console.log('\nStep 2: Processing 29 products in sequential order...\n');

  for (const item of PRODUCTS_TO_CREATE) {
    const skuUpper = item.sku.toUpperCase();
    const slugLower = item.slug.toLowerCase();
    const altSlugsLower = (item.altSlugs || []).map((s) => s.toLowerCase());

    const isExistingSku = existingSkus.has(skuUpper);
    const isExistingSlug =
      existingSlugs.has(slugLower) || altSlugsLower.some((s) => existingSlugs.has(s));

    if (isExistingSku || isExistingSlug) {
      const match = existingProducts.find(
        (p) =>
          (p.productCode || p.code || '').toUpperCase() === skuUpper ||
          (p.slug || '').toLowerCase() === slugLower ||
          altSlugsLower.includes((p.slug || '').toLowerCase())
      );
      console.log(`[SKIP - ALREADY EXISTS] #${item.order} "${item.name}" (SKU: ${item.sku}) -> Doc ID: ${match ? match.id : 'existing'}`);
      alreadyExistedCount++;
      existedList.push({
        order: item.order,
        name: item.name,
        sku: item.sku,
        docId: match ? match.id : 'unknown',
        existingSlug: match ? match.slug : item.slug
      });
      continue;
    }

    // Construct clean product payload for Firestore
    const docData = {
      name: item.name,
      slug: item.slug,
      code: item.sku,
      productCode: item.sku,
      price: 0,
      shortDescription: "Decorative home décor piece from the Vases & Vessels collection.",
      description: "Product details and specifications will be updated soon.",
      category: "Vases & Vessels",
      categoryName: "Vases & Vessels",
      categoryId: "vases",
      categorySlug: "vases",
      subcategory: "",
      material: "",
      color: item.color || "",
      dimensions: {},
      tags: item.tags,
      images: [],
      stockStatus: "in_stock",
      featured: false,
      newArrival: false,
      isActive: true,
      active: true,
      creationOrder: item.order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'products'), docData);

    existingSkus.add(skuUpper);
    existingSlugs.add(slugLower);

    console.log(`[CREATED] #${item.order} "${item.name}" (SKU: ${item.sku}) -> Doc ID: ${docRef.id}`);
    createdCount++;
    createdList.push({
      order: item.order,
      name: item.name,
      sku: item.sku,
      docId: docRef.id,
      slug: item.slug
    });
  }

  // 3. Update category itemCount in Firestore
  const totalCategoryProducts = alreadyExistedCount + createdCount;
  try {
    await updateDoc(doc(db, 'categories', 'vases'), {
      itemCount: totalCategoryProducts,
      updatedAt: serverTimestamp()
    });
    console.log(`\nUpdated categories/vases itemCount to ${totalCategoryProducts}.`);
  } catch (err) {
    console.warn('Note: Could not update category itemCount (non-critical):', err.message);
  }

  // 4. Verification step: Read all products back from Firestore
  console.log('\n=====================================================');
  console.log('                DATABASE VERIFICATION                ');
  console.log('=====================================================');
  const verifySnap = await getDocs(collection(db, 'products'));
  const allCurrentProducts = verifySnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  console.log(`Total products now in Firestore: ${allCurrentProducts.length}`);
  console.log(`Products created in this run: ${createdCount}`);
  console.log(`Products that already existed: ${alreadyExistedCount}`);

  // Verify all 29 are present
  console.log('\nVerifying each of the 29 products in the database:');
  let verifiedCount = 0;
  for (const item of PRODUCTS_TO_CREATE) {
    const skuUpper = item.sku.toUpperCase();
    const slugLower = item.slug.toLowerCase();
    const altSlugsLower = (item.altSlugs || []).map((s) => s.toLowerCase());

    const found = allCurrentProducts.find(
      (p) =>
        (p.productCode || p.code || '').toUpperCase() === skuUpper ||
        (p.slug || '').toLowerCase() === slugLower ||
        altSlugsLower.includes((p.slug || '').toLowerCase())
    );

    if (found) {
      verifiedCount++;
      const cat = found.category || found.categoryName;
      console.log(`  ✔ #${item.order} [${found.code || found.productCode}] ${found.name} -> Cat: "${cat}" | Slug: "${found.slug}" | ID: ${found.id}`);
    } else {
      console.error(`  ❌ #${item.order} [${item.sku}] ${item.name} NOT FOUND!`);
    }
  }

  console.log(`\nVerification Summary: ${verifiedCount} of 29 products verified in database.`);

  process.exit(0);
}

run().catch((err) => {
  console.error('Bulk creation error:', err);
  process.exit(1);
});
