import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { initialProducts } from '../data/initialProducts';
import { initialCategories } from '../data/initialCategories';
import { initialTestimonials } from '../data/initialTestimonials';
import { initialFAQs } from '../data/initialFAQs';
import { initialBanners } from '../data/initialBanners';
import { initialSettings } from '../data/initialSettings';
import {
  db,
} from '../lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  PRODUCTS_COLLECTION,
  CATEGORIES_COLLECTION,
  BANNERS_COLLECTION,
  TESTIMONIALS_COLLECTION,
  FAQS_COLLECTION,
  SETTINGS_COLLECTION,
  SETTINGS_DOC_ID,
  ORDERS_COLLECTION,
  CUSTOMERS_COLLECTION,
  normalizeProduct,
  normalizeCategory,
  normalizeBanner,
  normalizeTestimonial,
  normalizeFAQ,
  normalizeSettings,
  saveProduct,
  updateProductDoc,
  removeProductDoc,
  saveCategory,
  updateCategoryDoc,
  removeCategoryDoc,
  saveBanner,
  updateBannerDoc,
  removeBannerDoc,
  saveTestimonial,
  updateTestimonialDoc,
  removeTestimonialDoc,
  saveFAQ,
  updateFAQDoc,
  removeFAQDoc,
  saveSettingsDoc,
  updateOrderDocStatus,
  saveCustomerInquiryDoc,
} from '../services/firestore';

interface StoreDataContextType {
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  banners: Banner[];
  settings: StoreSettings;
  orderInquiries: OrderInquiry[];
  customerInquiries: CustomerInquiry[];
  isLoading: boolean;
  metrics: {
    buyNowClicks: number;
    wishlistAdditions: number;
  };
  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductActive: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  toggleProductNewArrival: (id: string) => Promise<void>;
  // Category Actions
  addCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Banner Actions
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<string>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  // Testimonial Actions
  addTestimonial: (item: Omit<Testimonial, 'id'>) => Promise<string>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  // FAQ Actions
  addFAQ: (faq: Omit<FAQItem, 'id'>) => Promise<string>;
  updateFAQ: (id: string, updates: Partial<FAQItem>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  // Settings Actions
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  // Inquiries Actions
  addCustomerInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderInquiry['status']) => Promise<void>;
  // Migration helper
  runOneClickMigration: () => Promise<{ success: boolean; count: number; error?: string }>;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure in-memory state; Cloud Firestore is the sole source of truth
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [orderInquiries, setOrderInquiries] = useState<OrderInquiry[]>([]);
  const [customerInquiries, setCustomerInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Clear legacy CMS localStorage keys so outdated cached items never override Firestore
  useEffect(() => {
    try {
      localStorage.removeItem('brushspace_products');
      localStorage.removeItem('brushspace_categories');
      localStorage.removeItem('brushspace_testimonials');
      localStorage.removeItem('brushspace_faqs');
      localStorage.removeItem('brushspace_banners');
      localStorage.removeItem('brushspace_settings');
      localStorage.removeItem('brushspace_order_inquiries');
      localStorage.removeItem('brushspace_customer_inquiries');
    } catch {
      // ignore
    }
  }, []);

  // Metrics
  const [metrics] = useState<{ buyNowClicks: number; wishlistAdditions: number }>({
    buyNowClicks: 14,
    wishlistAdditions: 28,
  });

  // ==========================================
  // REAL-TIME FIRESTORE SYNCHRONIZATION
  // ==========================================
  useEffect(() => {
    let mounted = true;

    // 1. Settings listener
    const unsubSettings = onSnapshot(
      doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID),
      (snap) => {
        if (!mounted) return;
        if (snap.exists()) {
          setSettings(normalizeSettings(snap.data()));
        }
      },
      (err) => {
        console.warn('Firestore settings listener notice:', err.message);
      }
    );

    // 2. Categories listener
    const unsubCategories = onSnapshot(
      collection(db, CATEGORIES_COLLECTION),
      (snap) => {
        if (!mounted) return;
        const loaded = snap.docs.map((d) => normalizeCategory(d.id, d.data()));
        setCategories(loaded);
      },
      (err) => {
        console.warn('Firestore categories listener notice:', err.message);
      }
    );

    // 3. Products listener
    const unsubProducts = onSnapshot(
      collection(db, PRODUCTS_COLLECTION),
      (snap) => {
        if (!mounted) return;
        const loaded = snap.docs.map((d) => normalizeProduct(d.id, d.data()));
        setProducts(loaded);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Firestore products listener notice:', err.message);
        setIsLoading(false);
      }
    );

    // 4. Banners listener
    const unsubBanners = onSnapshot(
      collection(db, BANNERS_COLLECTION),
      (snap) => {
        if (!mounted) return;
        const loaded = snap.docs.map((d) => normalizeBanner(d.id, d.data()));
        setBanners(loaded);
      },
      (err) => {
        console.warn('Firestore banners listener notice:', err.message);
      }
    );

    // 5. Testimonials listener
    const unsubTestimonials = onSnapshot(
      collection(db, TESTIMONIALS_COLLECTION),
      (snap) => {
        if (!mounted) return;
        const loaded = snap.docs.map((d) => normalizeTestimonial(d.id, d.data()));
        setTestimonials(loaded);
      },
      (err) => {
        console.warn('Firestore testimonials listener notice:', err.message);
      }
    );

    // 6. FAQs listener
    const unsubFAQs = onSnapshot(
      collection(db, FAQS_COLLECTION),
      (snap) => {
        if (!mounted) return;
        const loaded = snap.docs.map((d) => normalizeFAQ(d.id, d.data()));
        setFaqs(loaded);
      },
      (err) => {
        console.warn('Firestore FAQs listener notice:', err.message);
      }
    );

    // 7. Orders listener
    const unsubOrders = onSnapshot(
      collection(db, ORDERS_COLLECTION),
      (snap) => {
        if (!mounted) return;
        const loaded = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            customerName: data.customerName || 'Studio Patron',
            customerPhone: data.phone || data.customerPhone || '',
            items: Array.isArray(data.items)
              ? data.items
              : Array.isArray(data.products)
              ? data.products
              : [],
            totalAmount: Number(data.totalAmount) || 0,
            status: data.status || 'new',
            notes: data.notes || data.message || '',
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as OrderInquiry;
        });
        setOrderInquiries(loaded);
      },
      (err) => {
        console.warn('Firestore orders listener notice:', err.message);
      }
    );

    // 8. Customers listener
    const unsubCustomers = onSnapshot(
      collection(db, CUSTOMERS_COLLECTION),
      (snap) => {
        if (!mounted) return;
        const loaded = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            message: data.message || '',
            subject: data.subject || 'Design Consultation Inquiry',
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as CustomerInquiry;
        });
        setCustomerInquiries(loaded);
      },
      (err) => {
        console.warn('Firestore customers listener notice:', err.message);
      }
    );

    return () => {
      mounted = false;
      unsubSettings();
      unsubCategories();
      unsubProducts();
      unsubBanners();
      unsubTestimonials();
      unsubFAQs();
      unsubOrders();
      unsubCustomers();
    };
  }, []);

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<string> => {
    const docId = await saveProduct(productData);
    const newProduct: Product = {
      ...productData,
      id: docId,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== docId)]);
    return docId;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    await updateProductDoc(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await removeProductDoc(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductActive = async (id: string): Promise<void> => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    await updateProduct(id, { isActive: !prod.isActive });
  };

  const toggleProductFeatured = async (id: string): Promise<void> => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    await updateProduct(id, { featured: !prod.featured });
  };

  const toggleProductNewArrival = async (id: string): Promise<void> => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    await updateProduct(id, { newArrival: !prod.newArrival });
  };

  // ==========================================
  // CATEGORY ACTIONS
  // ==========================================
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<string> => {
    const docId = await saveCategory(catData);
    const newCat: Category = { ...catData, id: docId };
    setCategories((prev) => [...prev.filter((c) => c.id !== docId), newCat]);
    return docId;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
    await updateCategoryDoc(id, updates);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = async (id: string): Promise<void> => {
    await removeCategoryDoc(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // ==========================================
  // BANNER ACTIONS
  // ==========================================
  const addBanner = async (bannerData: Omit<Banner, 'id'>): Promise<string> => {
    const docId = await saveBanner(bannerData);
    const newBanner: Banner = { ...bannerData, id: docId };
    setBanners((prev) => [...prev.filter((b) => b.id !== docId), newBanner]);
    return docId;
  };

  const updateBanner = async (id: string, updates: Partial<Banner>): Promise<void> => {
    await updateBannerDoc(id, updates);
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBanner = async (id: string): Promise<void> => {
    await removeBannerDoc(id);
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // ==========================================
  // TESTIMONIAL ACTIONS
  // ==========================================
  const addTestimonial = async (tData: Omit<Testimonial, 'id'>): Promise<string> => {
    const docId = await saveTestimonial(tData);
    const newT: Testimonial = { ...tData, id: docId };
    setTestimonials((prev) => [...prev.filter((t) => t.id !== docId), newT]);
    return docId;
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<void> => {
    await updateTestimonialDoc(id, updates);
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTestimonial = async (id: string): Promise<void> => {
    await removeTestimonialDoc(id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // ==========================================
  // FAQ ACTIONS
  // ==========================================
  const addFAQ = async (faqData: Omit<FAQItem, 'id'>): Promise<string> => {
    const docId = await saveFAQ(faqData);
    const newFaq: FAQItem = { ...faqData, id: docId };
    setFaqs((prev) => [...prev.filter((f) => f.id !== docId), newFaq]);
    return docId;
  };

  const updateFAQ = async (id: string, updates: Partial<FAQItem>): Promise<void> => {
    await updateFAQDoc(id, updates);
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFAQ = async (id: string): Promise<void> => {
    await removeFAQDoc(id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // ==========================================
  // SETTINGS ACTIONS
  // ==========================================
  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<void> => {
    await saveSettingsDoc(newSettings);
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // ==========================================
  // INQUIRIES & ORDERS
  // ==========================================
  const addCustomerInquiry = async (
    inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<void> => {
    await saveCustomerInquiryDoc({
      ...inquiryData,
      status: 'pending',
    });
  };

  const updateOrderStatus = async (
    id: string,
    status: OrderInquiry['status']
  ): Promise<void> => {
    await updateOrderDocStatus(id, status);
    setOrderInquiries((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  // ==========================================
  // 1-CLICK AUTHENTICATED MIGRATION TOOL
  // ==========================================
  const runOneClickMigration = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      let count = 0;

      // 1. Settings
      await setDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID), {
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
        updatedAt: serverTimestamp(),
      }, { merge: true });
      count++;

      // 2. Categories
      for (const cat of initialCategories) {
        const docId = cat.slug || cat.id;
        await setDoc(doc(db, CATEGORIES_COLLECTION, docId), {
          ...cat,
          sortOrder: cat.displayOrder,
          active: cat.isActive,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        count++;
      }

      // 3. Products
      for (const prod of initialProducts) {
        const docId = prod.slug || prod.id;
        await setDoc(doc(db, PRODUCTS_COLLECTION, docId), {
          ...prod,
          code: prod.productCode,
          active: prod.isActive,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        count++;
      }

      // 4. Banners
      for (const ban of initialBanners) {
        await setDoc(doc(db, BANNERS_COLLECTION, ban.id), {
          ...ban,
          buttonLink: ban.buttonUrl,
          active: ban.isActive,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        count++;
      }

      // 5. Testimonials
      for (const t of initialTestimonials) {
        await setDoc(doc(db, TESTIMONIALS_COLLECTION, t.id), {
          ...t,
          message: t.review,
          active: t.isActive,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        count++;
      }

      // 6. FAQs
      for (const f of initialFAQs) {
        await setDoc(doc(db, FAQS_COLLECTION, f.id), {
          ...f,
          sortOrder: f.order,
          active: f.isActive,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        count++;
      }

      return { success: true, count };
    } catch (err: any) {
      console.error('Migration error:', err);
      return { success: false, count: 0, error: err.message };
    }
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        categories,
        testimonials,
        faqs,
        banners,
        settings,
        orderInquiries,
        customerInquiries,
        isLoading,
        metrics,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        toggleProductFeatured,
        toggleProductNewArrival,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateSettings,
        addCustomerInquiry,
        updateOrderStatus,
        runOneClickMigration,
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return context;
};
