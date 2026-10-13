import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
const db = getFirestore(app);

async function inspect() {
  console.log('--- Inspecting Categories in Firestore ---');
  const catSnap = await getDocs(collection(db, 'categories'));
  console.log(`Total categories in Firestore: ${catSnap.docs.length}`);
  catSnap.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`  Doc ID: "${doc.id}" | Name: "${data.name}" | Slug: "${data.slug}" | Sort: ${data.sortOrder ?? data.displayOrder}`);
  });

  console.log('\n--- Inspecting Products in Firestore ---');
  const prodSnap = await getDocs(collection(db, 'products'));
  console.log(`Total products in Firestore: ${prodSnap.docs.length}`);
  prodSnap.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`  Doc ID: "${doc.id}" | Name: "${data.name}" | Code: "${data.code || data.productCode}" | Category: "${data.category || data.categoryName}" | Slug: "${data.slug}"`);
  });

  process.exit(0);
}

inspect().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
