import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type {
  Product,
  Category,
  Testimonial,
  FAQItem,
  Banner,
  StoreSettings,
  OrderInquiry,
  CustomerInquiry,
} from '../types';

// Helper to convert Firestore Timestamps to ISO string
function formatTimestamp(ts: any): string {
  if (!ts) return new Date().toISOString();
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (ts.toDate && typeof ts.toDate === 'function') return ts.toDate().toISOString();
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
}

// ==========================================
// PRODUCTS
// ==========================================
export const PRODUCTS_COLLECTION = 'products';

export function normalizeProduct(id: string, data: any): Product {
  const images = Array.isArray(data.images)
    ? data.images.map((img: any) => (typeof img === 'string' ? img : img.url || img.secureUrl || ''))
    : data.image
    ? [data.image]
    : [];

  return {
    id,
    name: data.name || '',
    slug: data.slug || id,
    productCode: data.productCode || data.code || `BS-${id.slice(0, 6).toUpperCase()}`,
    price: Number(data.price) || 0,
    compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
    shortDescription: data.shortDescription || '',
    description: data.description || '',
    category: data.categoryName || data.category || 'Vases',
    subcategory: data.subcategory || '',
    images,
    material: data.material || 'Ceramic / Terracotta',
    dimensions: data.dimensions || {
      height: '25 cm',
      width: '15 cm',
      diameter: '12 cm',
      weight: '1.2 kg',
    },
    color: data.color || 'Natural',
    tags: Array.isArray(data.tags) ? data.tags : [],
    stockStatus: data.stockStatus || 'in_stock',
    featured: data.featured ?? false,
    newArrival: data.newArrival ?? false,
    isActive: data.active ?? data.isActive ?? true,
    createdAt: formatTimestamp(data.createdAt),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => normalizeProduct(d.id, d.data()));
}

export async function saveProduct(product: Omit<Product, 'id' | 'createdAt'> & { id?: string }): Promise<string> {
  const { id, ...data } = product;
  const docData = {
    ...data,
    code: product.productCode,
    active: product.isActive,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(docRef, { ...docData, createdAt: serverTimestamp() }, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...docData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

export async function updateProductDoc(id: string, updates: Partial<Product>): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const data: any = { ...updates, updatedAt: serverTimestamp() };
  if (updates.isActive !== undefined) data.active = updates.isActive;
  if (updates.productCode !== undefined) data.code = updates.productCode;
  await updateDoc(docRef, data);
}

export async function removeProductDoc(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

// ==========================================
// CATEGORIES
// ==========================================
export const CATEGORIES_COLLECTION = 'categories';

export function normalizeCategory(id: string, data: any): Category {
  return {
    id,
    name: data.name || '',
    slug: data.slug || id,
    description: data.description || '',
    image: data.image || '',
    badge: data.badge || '',
    displayOrder: Number(data.sortOrder ?? data.displayOrder ?? 0),
    isActive: data.active ?? data.isActive ?? true,
    itemCount: data.itemCount,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => normalizeCategory(d.id, d.data()));
}

export async function saveCategory(category: Omit<Category, 'id'> & { id?: string }): Promise<string> {
  const { id, ...data } = category;
  const docData = {
    ...data,
    sortOrder: category.displayOrder,
    active: category.isActive,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await setDoc(docRef, { ...docData, createdAt: serverTimestamp() }, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...docData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

export async function updateCategoryDoc(id: string, updates: Partial<Category>): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  const data: any = { ...updates, updatedAt: serverTimestamp() };
  if (updates.isActive !== undefined) data.active = updates.isActive;
  if (updates.displayOrder !== undefined) data.sortOrder = updates.displayOrder;
  await updateDoc(docRef, data);
}

export async function removeCategoryDoc(id: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}

// ==========================================
// BANNERS
// ==========================================
export const BANNERS_COLLECTION = 'banners';

export function normalizeBanner(id: string, data: any): Banner {
  return {
    id,
    type: data.type || 'hero',
    title: data.title || '',
    subtitle: data.subtitle || '',
    badge: data.badge || '',
    buttonText: data.buttonText || '',
    buttonUrl: data.buttonUrl || data.buttonLink || '',
    image: data.image || '',
    secondaryImage: data.secondaryImage,
    isActive: data.active ?? data.isActive ?? true,
    startDate: data.startDate,
    endDate: data.endDate,
  };
}

export async function fetchBanners(): Promise<Banner[]> {
  const colRef = collection(db, BANNERS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => normalizeBanner(d.id, d.data()));
}

export async function saveBanner(banner: Omit<Banner, 'id'> & { id?: string }): Promise<string> {
  const { id, ...data } = banner;
  const docData = {
    ...data,
    buttonLink: banner.buttonUrl,
    active: banner.isActive,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    const docRef = doc(db, BANNERS_COLLECTION, id);
    await setDoc(docRef, { ...docData, createdAt: serverTimestamp() }, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, BANNERS_COLLECTION), {
      ...docData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

export async function updateBannerDoc(id: string, updates: Partial<Banner>): Promise<void> {
  const docRef = doc(db, BANNERS_COLLECTION, id);
  const data: any = { ...updates, updatedAt: serverTimestamp() };
  if (updates.isActive !== undefined) data.active = updates.isActive;
  if (updates.buttonUrl !== undefined) data.buttonLink = updates.buttonUrl;
  await updateDoc(docRef, data);
}

export async function removeBannerDoc(id: string): Promise<void> {
  await deleteDoc(doc(db, BANNERS_COLLECTION, id));
}

// ==========================================
// TESTIMONIALS
// ==========================================
export const TESTIMONIALS_COLLECTION = 'testimonials';

export function normalizeTestimonial(id: string, data: any): Testimonial {
  return {
    id,
    name: data.name || '',
    location: data.location || '',
    rating: Number(data.rating) || 5,
    review: data.review || data.message || '',
    image: data.image || '',
    featured: data.featured ?? false,
    verified: data.verified ?? true,
    isActive: data.active ?? data.isActive ?? true,
  };
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const colRef = collection(db, TESTIMONIALS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => normalizeTestimonial(d.id, d.data()));
}

export async function saveTestimonial(t: Omit<Testimonial, 'id'> & { id?: string }): Promise<string> {
  const { id, ...data } = t;
  const docData = {
    ...data,
    message: t.review,
    active: t.isActive,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await setDoc(docRef, { ...docData, createdAt: serverTimestamp() }, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), {
      ...docData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

export async function updateTestimonialDoc(id: string, updates: Partial<Testimonial>): Promise<void> {
  const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
  const data: any = { ...updates, updatedAt: serverTimestamp() };
  if (updates.isActive !== undefined) data.active = updates.isActive;
  if (updates.review !== undefined) data.message = updates.review;
  await updateDoc(docRef, data);
}

export async function removeTestimonialDoc(id: string): Promise<void> {
  await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
}

// ==========================================
// FAQS
// ==========================================
export const FAQS_COLLECTION = 'faqs';

export function normalizeFAQ(id: string, data: any): FAQItem {
  return {
    id,
    question: data.question || '',
    answer: data.answer || '',
    category: data.category || 'General',
    order: Number(data.sortOrder ?? data.order ?? 0),
    isActive: data.active ?? data.isActive ?? true,
  };
}

export async function fetchFAQs(): Promise<FAQItem[]> {
  const colRef = collection(db, FAQS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => normalizeFAQ(d.id, d.data()));
}

export async function saveFAQ(faq: Omit<FAQItem, 'id'> & { id?: string }): Promise<string> {
  const { id, ...data } = faq;
  const docData = {
    ...data,
    sortOrder: faq.order,
    active: faq.isActive,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    const docRef = doc(db, FAQS_COLLECTION, id);
    await setDoc(docRef, { ...docData, createdAt: serverTimestamp() }, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, FAQS_COLLECTION), {
      ...docData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

export async function updateFAQDoc(id: string, updates: Partial<FAQItem>): Promise<void> {
  const docRef = doc(db, FAQS_COLLECTION, id);
  const data: any = { ...updates, updatedAt: serverTimestamp() };
  if (updates.isActive !== undefined) data.active = updates.isActive;
  if (updates.order !== undefined) data.sortOrder = updates.order;
  await updateDoc(docRef, data);
}

export async function removeFAQDoc(id: string): Promise<void> {
  await deleteDoc(doc(db, FAQS_COLLECTION, id));
}

// ==========================================
// SETTINGS
// ==========================================
export const SETTINGS_COLLECTION = 'settings';
export const SETTINGS_DOC_ID = 'global';

export function normalizeSettings(data: any): StoreSettings {
  if (!data) {
    return {
      brandName: 'BRUSHSPACE',
      tagline: 'Artistic Décor',
      logoUrl: '',
      faviconUrl: '/favicon.svg',
      announcementBarText: 'Artful décor for beautiful spaces. Handcrafted pieces for modern interiors • Complimentary styling consultation',
      isAnnouncementBarActive: true,
      whatsappNumber: '919876543210',
      contactEmail: 'concierge@brushspace.com',
      contactPhone: '+91 98765 43210',
      showroomAddress: 'Brushspace Atelier, Galleria Estate, Mumbai 400001',
      socialInstagram: 'https://instagram.com/brushspace',
      socialPinterest: 'https://pinterest.com/brushspace',
      socialFacebook: 'https://facebook.com/brushspace',
    };
  }

  return {
    brandName: data.siteName || data.brandName || 'BRUSHSPACE',
    tagline: data.siteDescription || data.tagline || 'Artistic Décor',
    logoUrl: data.logo || data.logoUrl || '',
    faviconUrl: data.favicon || data.faviconUrl || '/favicon.svg',
    announcementBarText: data.announcementText || data.announcementBarText || '',
    isAnnouncementBarActive: data.isAnnouncementBarActive ?? true,
    whatsappNumber: data.whatsappNumber || '919876543210',
    contactEmail: data.email || data.contactEmail || 'concierge@brushspace.com',
    contactPhone: data.phone || data.contactPhone || '+91 98765 43210',
    showroomAddress: data.address || data.showroomAddress || '',
    socialInstagram: data.instagram || data.socialInstagram || '',
    socialPinterest: data.pinterest || data.socialPinterest || '',
    socialFacebook: data.facebook || data.socialFacebook || '',
    socialYoutube: data.youtube || data.socialYoutube || '',
  };
}

export async function fetchSettings(): Promise<StoreSettings> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return normalizeSettings(snapshot.data());
  }
  return normalizeSettings(null);
}

export async function saveSettingsDoc(settings: Partial<StoreSettings>): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  const data: any = {
    ...settings,
    siteName: settings.brandName,
    siteDescription: settings.tagline,
    logo: settings.logoUrl,
    favicon: settings.faviconUrl,
    announcementText: settings.announcementBarText,
    email: settings.contactEmail,
    phone: settings.contactPhone,
    address: settings.showroomAddress,
    instagram: settings.socialInstagram,
    pinterest: settings.socialPinterest,
    facebook: settings.socialFacebook,
    youtube: settings.socialYoutube || (settings as any).youtube || '',
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, data, { merge: true });
}

// ==========================================
// ORDERS / WHATSAPP INQUIRIES
// ==========================================
export const ORDERS_COLLECTION = 'orders';

export async function fetchOrders(): Promise<OrderInquiry[]> {
  const colRef = collection(db, ORDERS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerName: data.customerName || 'Direct Studio Patron',
      customerPhone: data.phone || data.customerPhone || '',
      items: Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.products)
        ? data.products.map((p: any) => ({
            productName: p.name || p.productName || 'Artisan Piece',
            productCode: p.code || p.productCode || 'BS-DEC',
            price: Number(p.price) || 0,
            quantity: Number(p.quantity) || 1,
          }))
        : [],
      totalAmount: Number(data.totalAmount) || 0,
      status: data.status || 'new',
      notes: data.notes || data.message || '',
      createdAt: formatTimestamp(data.createdAt),
    };
  });
}

export async function saveOrderDoc(order: Omit<OrderInquiry, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    customerName: order.customerName || 'Direct Studio Patron',
    products: order.items,
    source: 'WhatsApp Buy Now',
    status: order.status || 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOrderDocStatus(id: string, status: OrderInquiry['status']): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
}

// ==========================================
// CUSTOMER CONTACT INQUIRIES
// ==========================================
export const CUSTOMERS_COLLECTION = 'customers';

export async function fetchCustomers(): Promise<CustomerInquiry[]> {
  const colRef = collection(db, CUSTOMERS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      message: data.message || '',
      subject: data.subject || 'Design Consultation Inquiry',
      status: data.status || 'pending',
      createdAt: formatTimestamp(data.createdAt),
    };
  });
}

export async function saveCustomerInquiryDoc(inquiry: Omit<CustomerInquiry, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), {
    ...inquiry,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}
