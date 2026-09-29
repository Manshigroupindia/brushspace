export interface Product {
  id: string;
  name: string;
  slug: string;
  productCode: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  images: string[];
  material: string;
  dimensions: {
    height?: string;
    width?: string;
    diameter?: string;
    weight?: string;
  };
  color: string;
  tags: string[];
  stockStatus: 'in_stock' | 'low_stock' | 'made_to_order' | 'out_of_stock';
  featured: boolean;
  newArrival: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  badge?: string;
  displayOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  image?: string;
  featured: boolean;
  verified: boolean;
  isActive: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  type: 'hero' | 'promo' | 'category' | 'popup';
  title: string;
  subtitle: string;
  badge?: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  secondaryImage?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  announcementBarText: string;
  isAnnouncementBarActive: boolean;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  showroomAddress: string;
  socialInstagram: string;
  socialPinterest: string;
  socialFacebook: string;
  socialYoutube?: string;
}

export interface OrderInquiry {
  id: string;
  customerName?: string;
  customerPhone?: string;
  items: {
    productName: string;
    productCode: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'new' | 'contacted' | 'confirmed' | 'dispatched' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}
