import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  availability?: string;
}

const DEFAULT_TITLE = 'BRUSHSPACE — Artistic Home Décor & Curated Objects';
const DEFAULT_DESCRIPTION =
  'Discover handcrafted vases, decorative trees, trays, mirror mosaic and floral home décor pieces designed to add warmth and quiet beauty to modern spaces.';
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg';
const SITE_NAME = 'Brushspace';
const BASE_URL = 'https://www.brushspace.in';

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  price,
  availability = 'in stock'
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to set/update a meta tag
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set/update canonical link
    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Ensure absolute HTTPS for canonical
    const pageUrl = canonical
      ? canonical.startsWith('http')
        ? canonical
        : `${BASE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`
      : window.location.href;

    // Ensure absolute HTTPS for image
    let imageUrl = image || DEFAULT_IMAGE;
    if (imageUrl.startsWith('//')) {
      imageUrl = `https:${imageUrl}`;
    } else if (imageUrl.startsWith('/')) {
      imageUrl = `${BASE_URL}${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      imageUrl = `https://${imageUrl}`;
    }

    // Standard Meta
    setMetaTag('name', 'description', description);
    setCanonical(pageUrl);

    // Open Graph
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_IN');
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:image:secure_url', imageUrl);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', title);
    setMetaTag('property', 'og:image:type', imageUrl.endsWith('.png') ? 'image/png' : imageUrl.endsWith('.webp') ? 'image/webp' : 'image/jpeg');

    // Product specific Open Graph
    if (type === 'product' && typeof price === 'number' && price > 0) {
      setMetaTag('property', 'product:price:amount', price.toString());
      setMetaTag('property', 'product:price:currency', 'INR');
      setMetaTag('property', 'product:availability', availability);
    }

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:url', pageUrl);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', imageUrl);
    setMetaTag('name', 'twitter:image:alt', title);
  }, [title, description, canonical, image, type, price, availability]);

  return null;
};
