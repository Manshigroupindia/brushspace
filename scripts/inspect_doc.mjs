import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function inspectDoc() {
  const pSnap = await getDoc(doc(db, 'products', 'ocfi8oXgCInBg0qndwaQ'));
  console.log('Product ocfi8oXgCInBg0qndwaQ data:');
  console.log(JSON.stringify(pSnap.data(), null, 2));

  const cSnap = await getDoc(doc(db, 'categories', 'vases'));
  console.log('\nCategory vases data:');
  console.log(JSON.stringify(cSnap.data(), null, 2));
  process.exit(0);
}

inspectDoc().catch(err => {
  console.error(err);
  process.exit(1);
});
