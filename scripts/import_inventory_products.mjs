import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
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

// 1. Categories configuration
const CATEGORIES_CONFIG = [
  {
    docId: 'festive',
    id: 'cat-festive',
    name: 'Festive',
    slug: 'festive',
    description: 'Sacred idols, ornate panels, and divine festive accents handcrafted with devotional clay, rhinestones, and ambient illumination.',
    badge: '07 / Festive',
    displayOrder: 7,
    isActive: true,
  },
  {
    docId: 'gift',
    id: 'cat-gift',
    name: 'Gift Décor',
    slug: 'gift',
    description: 'Curated keepsake objects, decorative boxes, and watches for distinctive housewarmings, weddings, and milestones.',
    badge: '06 / Keepsakes',
    displayOrder: 6,
    isActive: true,
  },
  {
    docId: 'paintings',
    id: 'cat-paintings',
    name: 'Paintings',
    slug: 'paintings',
    description: 'Original canvas art, devotional portraits, and artisanal wall pieces rendered in acrylic, oil, and gilded leaf.',
    badge: '08 / Fine Art',
    displayOrder: 8,
    isActive: true,
  },
  {
    docId: '3d-paintings',
    id: 'cat-3d-paintings',
    name: '3-D Paintings',
    slug: '3d-paintings',
    description: 'Multi-dimensional sculptural paintings featuring relief modeling, clay craft, and integrated backlighting.',
    badge: '09 / Dimensional',
    displayOrder: 9,
    isActive: true,
  },
  {
    docId: 'furniture',
    id: 'cat-furniture',
    name: 'Decorative Furniture',
    slug: 'decorative-furniture',
    description: 'Artisan handcrafted corner tables and traditional chowkis uniting functional elegance with sculptural finishes.',
    badge: '10 / Atelier Living',
    displayOrder: 10,
    isActive: true,
  }
];

// 2. Inventory data to import (52 products)
const INVENTORY_DATA = [
  // ---------------------------------------------------------
  // CATEGORY: FESTIVE (13 products)
  // ---------------------------------------------------------
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 1,
    name: 'Laxmi Ganesh Big 1',
    sku: 'FES-LXG-BIG-001',
    slug: 'laxmi-ganesh-big-1',
    price: 1649,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 2,
    name: 'Laxmi Ganesh Big 2',
    sku: 'FES-LXG-BIG-002',
    slug: 'laxmi-ganesh-big-2',
    price: 1649,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 3,
    name: 'Laxmi Ganesh Big 3',
    sku: 'FES-LXG-BIG-003',
    slug: 'laxmi-ganesh-big-3',
    price: 1649,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 4,
    name: 'Laxmi Ganesh Medium',
    sku: 'FES-LXG-MED-001',
    slug: 'laxmi-ganesh-medium-24x18',
    price: 1526,
    priceProvided: true,
    dimensions: { raw: '24 × 18' },
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 5,
    name: 'Laxmi Ganesh Medium',
    sku: 'FES-LXG-MED-002',
    slug: 'laxmi-ganesh-medium-18x13',
    price: 1526,
    priceProvided: true,
    dimensions: { raw: '18 × 13' },
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 6,
    name: 'Laxmi Ganesh Small',
    sku: 'FES-LXG-SML-001',
    slug: 'laxmi-ganesh-small-1',
    price: 1115,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 7,
    name: 'Laxmi Ganesh Small',
    sku: 'FES-LXG-SML-002',
    slug: 'laxmi-ganesh-small-2',
    price: 1115,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 8,
    name: 'Laxmi Ganesh Small',
    sku: 'FES-LXG-SML-003',
    slug: 'laxmi-ganesh-small-3',
    price: 1115,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 9,
    name: 'Laxmi Ganesh Statue',
    sku: 'FES-LXG-STA-001',
    slug: 'laxmi-ganesh-statue-882',
    price: 882,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Statue', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 10,
    name: 'Laxmi Ganesh Statue',
    sku: 'FES-LXG-STA-002',
    slug: 'laxmi-ganesh-statue-563',
    price: 563,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Statue', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 11,
    name: 'Laxmi Ganesh Panel',
    sku: 'FES-LXG-PNL-001',
    slug: 'laxmi-ganesh-panel-12x12',
    price: 1193,
    priceProvided: true,
    dimensions: { raw: '12 × 12', height: '12', width: '12' },
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Festive', 'Laxmi Ganesh', 'Panel', 'Wall Accent', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 12,
    name: 'Ganesh',
    sku: 'FES-GANESH-001',
    slug: 'ganesh-12x12-1',
    price: 1267,
    priceProvided: true,
    dimensions: { raw: '12 × 12', height: '12', width: '12' },
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: '',
    tags: ['Festive', 'Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },
  {
    categoryDocId: 'festive',
    categoryName: 'Festive',
    categorySlug: 'festive',
    order: 13,
    name: 'Ganesh',
    sku: 'FES-GANESH-002',
    slug: 'ganesh-12x12-2',
    price: 1267,
    priceProvided: true,
    dimensions: { raw: '12 × 12', height: '12', width: '12' },
    materials: 'Clay, Resin and Hardener, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: '',
    tags: ['Festive', 'Ganesh', 'Devotional Art', 'Handcrafted', 'LED Accent']
  },

  // ---------------------------------------------------------
  // CATEGORY: GIFTS (12 products)
  // Mapping to existing category: Gift Décor (id: cat-gift, slug: gift)
  // ---------------------------------------------------------
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 1,
    name: 'Metal Box / Jewellery Box',
    sku: 'GFT-BOX-001',
    slug: 'metal-box-jewellery-box',
    price: 864,
    priceProvided: true,
    dimensions: {},
    materials: 'Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Metal',
    tags: ['Gift Décor', 'Gifts', 'Jewellery Box', 'Metal Box', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 2,
    name: 'Photo Frames 1',
    sku: 'GFT-FRAME-001',
    slug: 'photo-frames-1',
    price: 896,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay Craft, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Gift Décor', 'Gifts', 'Photo Frame', 'Clay Craft', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 3,
    name: 'Photo Frame 2',
    sku: 'GFT-FRAME-002',
    slug: 'photo-frame-2',
    price: 732,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay Craft, Rhinestones, Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Gift Décor', 'Gifts', 'Photo Frame', 'Clay Craft', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 4,
    name: 'Photo Frames – Rose Flowers 3',
    sku: 'GFT-FRAME-003',
    slug: 'photo-frames-rose-flowers-3',
    price: 765,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay Craft, Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Gift Décor', 'Gifts', 'Photo Frame', 'Rose Flowers', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 5,
    name: 'Photo Frames 4',
    sku: 'GFT-FRAME-004',
    slug: 'photo-frames-4',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Gift Décor', 'Gifts', 'Photo Frame', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 6,
    name: 'Photo Frames 5',
    sku: 'GFT-FRAME-005',
    slug: 'photo-frames-5',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Gift Décor', 'Gifts', 'Photo Frame', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 7,
    name: 'Photo Frames 6',
    sku: 'GFT-FRAME-006',
    slug: 'photo-frames-6',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Gift Décor', 'Gifts', 'Photo Frame', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 8,
    name: 'Photo Frames 7',
    sku: 'GFT-FRAME-007',
    slug: 'photo-frames-7',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Gift Décor', 'Gifts', 'Photo Frame', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 9,
    name: 'Elephant Watch',
    sku: 'GFT-WATCH-001',
    slug: 'elephant-watch',
    price: 965,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Acrylic Colour',
    structure: 'Wooden',
    tags: ['Gift Décor', 'Gifts', 'Watch', 'Elephant', 'Timepiece']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 10,
    name: 'Brass Watch',
    sku: 'GFT-WATCH-002',
    slug: 'brass-watch',
    price: 859,
    priceProvided: true,
    dimensions: {},
    materials: 'Metallic Colours',
    structure: 'Brass',
    tags: ['Gift Décor', 'Gifts', 'Watch', 'Brass', 'Timepiece']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 11,
    name: 'Wooden Box',
    sku: 'GFT-BOX-002',
    slug: 'wooden-box',
    price: 859,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Acrylic Colours',
    structure: 'Wooden',
    tags: ['Gift Décor', 'Gifts', 'Wooden Box', 'Handcrafted', 'Keepsake']
  },
  {
    categoryDocId: 'gift',
    categoryName: 'Gift Décor',
    categorySlug: 'gift',
    order: 12,
    name: 'Bandanwall',
    sku: 'GFT-BANDAN-001',
    slug: 'bandanwall',
    price: 957,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Gift Décor', 'Gifts', 'Bandanwall', 'Wall Accent', 'Traditional']
  },

  // ---------------------------------------------------------
  // CATEGORY: PAINTINGS (21 products)
  // ---------------------------------------------------------
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 1,
    name: 'Canvas Paintings Big 1',
    sku: 'PNT-CANVAS-BIG-001',
    slug: 'canvas-paintings-big-1',
    price: 3695,
    priceProvided: true,
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Canvas Art', 'Large Painting', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 2,
    name: 'Canvas Paintings Big 2',
    sku: 'PNT-CANVAS-BIG-002',
    slug: 'canvas-paintings-big-2',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Canvas Art', 'Large Painting', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 3,
    name: 'Canvas Paintings Big 3',
    sku: 'PNT-CANVAS-BIG-003',
    slug: 'canvas-paintings-big-3',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Canvas Art', 'Large Painting', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 4,
    name: 'Canvas Paintings Small 1',
    sku: 'PNT-CANVAS-SML-001',
    slug: 'canvas-paintings-small-1',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Canvas Art', 'Small Painting', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 5,
    name: 'Canvas Paintings Small 2',
    sku: 'PNT-CANVAS-SML-002',
    slug: 'canvas-paintings-small-2',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Canvas Art', 'Small Painting', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 6,
    name: 'Canvas Paintings Small 3',
    sku: 'PNT-CANVAS-SML-003',
    slug: 'canvas-paintings-small-3',
    price: 0,
    priceProvided: false, // Draft
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Canvas Art', 'Small Painting', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 7,
    name: 'Vinyl Board 1',
    sku: 'PNT-VINYL-001',
    slug: 'vinyl-board-1',
    price: 0,
    priceProvided: false, // Draft
    dimensions: { raw: '12 × 12', height: '12', width: '12' },
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Paintings', 'Vinyl Board', 'Wall Art', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 8,
    name: 'Vinyl Board 2',
    sku: 'PNT-VINYL-002',
    slug: 'vinyl-board-2',
    price: 0,
    priceProvided: false, // Draft
    dimensions: { raw: '12 × 12', height: '12', width: '12' },
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Paintings', 'Vinyl Board', 'Wall Art', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 9,
    name: 'Couple Paintings',
    sku: 'PNT-COUPLE-001',
    slug: 'couple-paintings',
    price: 4689,
    priceProvided: true,
    dimensions: {},
    materials: 'Oil Colour, Rhinestones, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Couple Art', 'Oil Painting', 'Rhinestones', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 10,
    name: 'Dancing Girl',
    sku: 'PNT-DANCE-GIRL-001',
    slug: 'dancing-girl-4678',
    price: 4678,
    priceProvided: true,
    dimensions: {},
    materials: 'Acrylic Colour, Rhinestones, LED Battery Lights',
    structure: 'Canvas on Wooden Board',
    tags: ['Paintings', 'Dancing Girl', 'Figurative Art', 'Rhinestones', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 11,
    name: 'Dancing Girl',
    sku: 'PNT-DANCE-GIRL-002',
    slug: 'dancing-girl-4235',
    price: 4235,
    priceProvided: true,
    dimensions: {},
    materials: 'Acrylic Colour, Rhinestones, LED Battery Lights',
    structure: 'Canvas on Wooden Board',
    tags: ['Paintings', 'Dancing Girl', 'Figurative Art', 'Rhinestones', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 12,
    name: 'Radh Krishna',
    sku: 'PNT-RADH-KRISHNA-001',
    slug: 'radh-krishna',
    price: 9756,
    priceProvided: true,
    dimensions: {},
    materials: 'Acrylic Colour, Rhinestones, LED Battery Lights',
    structure: '',
    tags: ['Paintings', 'Radh Krishna', 'Devotional Painting', 'Rhinestones', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 13,
    name: 'Shree Nath Ji',
    sku: 'PNT-SHREE-NATH-001',
    slug: 'shree-nath-ji',
    price: 8932,
    priceProvided: true,
    dimensions: {},
    materials: 'Acrylic Colours, LED Battery Lights',
    structure: 'Glass',
    tags: ['Paintings', 'Shree Nath Ji', 'Glass Painting', 'Devotional Art', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 14,
    name: 'Tirupati Balaji',
    sku: 'PNT-TIRUPATI-001',
    slug: 'tirupati-balaji',
    price: 6888,
    priceProvided: true,
    dimensions: {},
    materials: 'Thermocol',
    structure: 'Thermocol',
    tags: ['Paintings', 'Tirupati Balaji', 'Devotional Art', 'Thermocol Art']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 15,
    name: 'Jalpari',
    sku: 'PNT-JALPARI-001',
    slug: 'jalpari',
    price: 5689,
    priceProvided: true,
    dimensions: {},
    materials: 'Shell, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Jalpari', 'Mermaid Art', 'Shell Craft', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 16,
    name: 'Madhubani',
    sku: 'PNT-MADHUBANI-001',
    slug: 'madhubani',
    price: 4678,
    priceProvided: true,
    dimensions: {},
    materials: 'Thread, LED Battery Lights',
    structure: 'Canvas',
    tags: ['Paintings', 'Madhubani', 'Folk Art', 'Thread Art', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 17,
    name: 'Rajasthani',
    sku: 'PNT-RAJASTHANI-001',
    slug: 'rajasthani-1',
    price: 3678,
    priceProvided: true,
    dimensions: {},
    materials: 'Marble, Gold Plated, American Zircon, Acrylic Colour, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Paintings', 'Rajasthani', 'Marble Art', 'Gold Plated', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 18,
    name: 'Rajasthani',
    sku: 'PNT-RAJASTHANI-002',
    slug: 'rajasthani-2',
    price: 3678,
    priceProvided: true,
    dimensions: {},
    materials: 'Marble, Gold Plated, American Zircon, Acrylic Colour, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Paintings', 'Rajasthani', 'Marble Art', 'Gold Plated', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 19,
    name: 'Rajasthani',
    sku: 'PNT-RAJASTHANI-003',
    slug: 'rajasthani-3',
    price: 3678,
    priceProvided: true,
    dimensions: {},
    materials: 'Marble, Gold Plated, American Zircon, Acrylic Colour, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Paintings', 'Rajasthani', 'Marble Art', 'Gold Plated', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 20,
    name: 'Rajasthani',
    sku: 'PNT-RAJASTHANI-004',
    slug: 'rajasthani-4',
    price: 3678,
    priceProvided: true,
    dimensions: {},
    materials: 'Marble, Gold Plated, American Zircon, Acrylic Colour, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Paintings', 'Rajasthani', 'Marble Art', 'Gold Plated', 'LED Lighting']
  },
  {
    categoryDocId: 'paintings',
    categoryName: 'Paintings',
    categorySlug: 'paintings',
    order: 21,
    name: 'Dancing Couple',
    sku: 'PNT-DANCE-COUPLE-001',
    slug: 'dancing-couple',
    price: 1567,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Paintings', 'Dancing Couple', 'Figurative Art', 'Clay Craft', 'LED Lighting']
  },

  // ---------------------------------------------------------
  // CATEGORY: 3-D PAINTINGS (4 products)
  // ---------------------------------------------------------
  {
    categoryDocId: '3d-paintings',
    categoryName: '3-D Paintings',
    categorySlug: '3d-paintings',
    order: 1,
    name: 'Lady Painting',
    sku: '3DP-LADY-001',
    slug: 'lady-painting',
    price: 15784,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['3-D Paintings', 'Lady Painting', 'Relief Sculpture', 'Handcrafted', 'LED Lighting']
  },
  {
    categoryDocId: '3d-paintings',
    categoryName: '3-D Paintings',
    categorySlug: '3d-paintings',
    order: 2,
    name: 'Mehandi Artist',
    sku: '3DP-MEHANDI-001',
    slug: 'mehandi-artist',
    price: 15643,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['3-D Paintings', 'Mehandi Artist', 'Relief Sculpture', 'Handcrafted', 'LED Lighting']
  },
  {
    categoryDocId: '3d-paintings',
    categoryName: '3-D Paintings',
    categorySlug: '3d-paintings',
    order: 3,
    name: 'Ladies with Light',
    sku: '3DP-LADIES-LIGHT-001',
    slug: 'ladies-with-light',
    price: 15643,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['3-D Paintings', 'Ladies with Light', 'Relief Sculpture', 'Handcrafted', 'LED Lighting']
  },
  {
    categoryDocId: '3d-paintings',
    categoryName: '3-D Paintings',
    categorySlug: '3d-paintings',
    order: 4,
    name: 'Center Table',
    sku: '3DP-CENTER-TABLE-001',
    slug: 'center-table-3d',
    price: 15232,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Resin and Hardener, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Terracotta',
    tags: ['3-D Paintings', 'Center Table', 'Relief Sculpture', 'Terracotta', 'LED Lighting']
  },

  // ---------------------------------------------------------
  // CATEGORY: DECORATIVE FURNITURE (2 products)
  // ---------------------------------------------------------
  {
    categoryDocId: 'furniture',
    categoryName: 'Decorative Furniture',
    categorySlug: 'decorative-furniture',
    order: 1,
    name: 'Corner Table',
    sku: 'FUR-CORNER-TABLE-001',
    slug: 'corner-table',
    price: 3934,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Decorative Furniture', 'Corner Table', 'Furniture', 'Handcrafted Accent', 'LED Lighting']
  },
  {
    categoryDocId: 'furniture',
    categoryName: 'Decorative Furniture',
    categorySlug: 'decorative-furniture',
    order: 2,
    name: 'Chowki',
    sku: 'FUR-CHOWKI-001',
    slug: 'chowki',
    price: 2667,
    priceProvided: true,
    dimensions: {},
    materials: 'Clay, Glass, Acrylic Colours, Rhinestones, LED Battery Lights',
    structure: 'Wooden',
    tags: ['Decorative Furniture', 'Chowki', 'Traditional Furniture', 'Clay Craft', 'LED Lighting']
  }
];

async function run() {
  console.log('=====================================================');
  console.log('    BULK INVENTORY IMPORT - BRUSHSPACE ATELIER       ');
  console.log('=====================================================\n');

  // Step 0: Authenticate
  console.log('Step 0: Authenticating with Firebase Auth...');
  const userCred = await signInWithEmailAndPassword(auth, "brushspace_admin@brushspace.com", "Brushspace@2026!");
  console.log(`Authenticated successfully as UID: ${userCred.user.uid}\n`);

  // Step 1: Ensure categories exist in Firestore
  console.log('Step 1: Synchronizing categories to Firestore...');
  for (const cat of CATEGORIES_CONFIG) {
    const catRef = doc(db, 'categories', cat.docId);
    await setDoc(catRef, {
      ...cat,
      sortOrder: cat.displayOrder,
      active: cat.isActive,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log(`  ✔ Category ensured: "${cat.name}" (ID: ${cat.docId}, Slug: ${cat.slug})`);
  }

  // Step 2: Read existing products to check for duplicates
  console.log('\nStep 2: Checking existing products in Firestore...');
  const prodSnap = await getDocs(collection(db, 'products'));
  const existingProducts = prodSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  console.log(`Currently ${existingProducts.length} products in Firestore.`);

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
  let skippedCount = 0;
  const createdList = [];
  const categoryCountMap = {};

  console.log('\nStep 3: Processing 52 products across 5 categories...\n');

  for (const item of INVENTORY_DATA) {
    const skuUpper = item.sku.toUpperCase();
    const slugLower = item.slug.toLowerCase();

    // Check duplicate
    if (existingSkus.has(skuUpper) || existingSlugs.has(slugLower)) {
      const match = existingProducts.find(
        (p) =>
          (p.productCode || p.code || '').toUpperCase() === skuUpper ||
          (p.slug || '').toLowerCase() === slugLower
      );
      console.log(`[SKIP - ALREADY EXISTS] [${item.categoryName}] #${item.order} "${item.name}" (SKU: ${item.sku}) -> Doc ID: ${match ? match.id : 'existing'}`);
      skippedCount++;
      categoryCountMap[item.categoryDocId] = (categoryCountMap[item.categoryDocId] || 0) + 1;
      continue;
    }

    // Build short description & full description based ONLY on known facts
    const shortDesc = item.structure
      ? `${item.name} handcrafted with ${item.materials}. Built on a ${item.structure} structure.`
      : `${item.name} handcrafted with ${item.materials}.`;

    const fullDesc = item.structure
      ? `Handcrafted ${item.name} from the ${item.categoryName} collection. Materials & components: ${item.materials}. Base structure: ${item.structure}. Additional specifications, dimensions, and curatorial imagery will be updated soon.`
      : `Handcrafted ${item.name} from the ${item.categoryName} collection. Materials & components: ${item.materials}. Additional specifications, dimensions, and curatorial imagery will be updated soon.`;

    const isPublished = item.priceProvided && item.price > 0;

    const docData = {
      name: item.name,
      slug: item.slug,
      code: item.sku,
      productCode: item.sku,
      price: item.price,
      // compareAtPrice is omitted entirely to prevent undefined values
      shortDescription: shortDesc,
      description: fullDesc,
      category: item.categoryName,
      categoryName: item.categoryName,
      categoryId: item.categoryDocId,
      categorySlug: item.categorySlug,
      subcategory: item.structure ? `${item.structure} Structure` : "",
      material: item.materials,
      structure: item.structure || "",
      color: "",
      dimensions: item.dimensions || {},
      tags: item.tags,
      images: [],
      stockStatus: isPublished ? "in_stock" : "out_of_stock",
      featured: false,
      newArrival: false,
      isActive: isPublished, // Unpublished draft if price was missing
      active: isPublished,
      status: isPublished ? "published" : "draft",
      priceProvided: item.priceProvided,
      creationOrder: item.order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'products'), docData);

    existingSkus.add(skuUpper);
    existingSlugs.add(slugLower);
    createdCount++;
    categoryCountMap[item.categoryDocId] = (categoryCountMap[item.categoryDocId] || 0) + 1;

    const statusBadge = isPublished ? `₹${item.price}` : `[DRAFT - Price Unset]`;
    console.log(`[CREATED] [${item.categoryName}] #${item.order} "${item.name}" | SKU: ${item.sku} | ${statusBadge} -> Doc ID: ${docRef.id}`);

    createdList.push({
      id: docRef.id,
      name: item.name,
      category: item.categoryName,
      sku: item.sku,
      price: item.price,
      isPublished
    });
  }

  // Step 4: Update itemCount for all categories in Firestore
  console.log('\nStep 4: Updating category itemCount counts in Firestore...');
  for (const [catDocId, count] of Object.entries(categoryCountMap)) {
    try {
      await updateDoc(doc(db, 'categories', catDocId), {
        itemCount: count,
        updatedAt: serverTimestamp()
      });
      console.log(`  ✔ categories/${catDocId} itemCount set to ${count}`);
    } catch (e) {
      console.warn(`  Notice for categories/${catDocId}:`, e.message);
    }
  }

  // Step 5: Complete Database Verification
  console.log('\n=====================================================');
  console.log('              FINAL DATABASE VERIFICATION            ');
  console.log('=====================================================');

  const verifySnap = await getDocs(collection(db, 'products'));
  const allFinalProducts = verifySnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  console.log(`Total Products in Firestore Database: ${allFinalProducts.length}`);
  console.log(`New Products Created in this run: ${createdCount}`);
  console.log(`Products Skipped (already existed): ${skippedCount}`);

  // Category breakdown
  const catBreakdown = {};
  for (const p of allFinalProducts) {
    const c = p.category || p.categoryName || 'Unknown';
    catBreakdown[c] = (catBreakdown[c] || 0) + 1;
  }
  console.log('\nProducts per Category in Firestore:');
  for (const [cat, count] of Object.entries(catBreakdown)) {
    console.log(`  • ${cat}: ${count} products`);
  }

  // Verify all 52 inventory items
  console.log('\nVerifying all 52 inventory products individually:');
  let verifiedCount = 0;
  for (const item of INVENTORY_DATA) {
    const found = allFinalProducts.find(
      (p) =>
        (p.productCode || p.code || '').toUpperCase() === item.sku.toUpperCase() ||
        (p.slug || '').toLowerCase() === item.slug.toLowerCase()
    );
    if (found) {
      verifiedCount++;
      const priceStr = found.price > 0 ? `₹${found.price}` : `Unset (Draft)`;
      const activeStr = found.isActive ? 'Active' : 'Draft';
      console.log(`  ✔ [${found.category}] [${found.code || found.productCode}] "${found.name}" | ${priceStr} | ${activeStr} | Doc: ${found.id}`);
    } else {
      console.error(`  ❌ [${item.categoryName}] [${item.sku}] "${item.name}" NOT FOUND!`);
    }
  }

  console.log(`\nInventory Verification Summary: ${verifiedCount} of 52 products verified in Firestore.`);

  process.exit(0);
}

run().catch((err) => {
  console.error('Import error:', err);
  process.exit(1);
});
