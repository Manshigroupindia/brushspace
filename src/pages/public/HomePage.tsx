import React, { useEffect } from 'react';
import { Hero } from '../../components/home/Hero';
import { CategorySection } from '../../components/home/CategorySection';
import { FeaturedCollection } from '../../components/home/FeaturedCollection';
import { SpotlightSection } from '../../components/home/SpotlightSection';
import { StorySection } from '../../components/home/StorySection';
import { WhyBrushspace } from '../../components/home/WhyBrushspace';
import { TestimonialsSection } from '../../components/home/TestimonialsSection';
import { FAQAccordion } from '../../components/home/FAQAccordion';
import { InstagramShowcase } from '../../components/home/InstagramShowcase';
import { Newsletter } from '../../components/home/Newsletter';
import { SEO } from '../../components/common/SEO';

export const HomePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <SEO
        title="BRUSHSPACE — Artistic Home Décor & Curated Objects"
        description="Discover handcrafted vases, decorative trees, trays, mirror mosaic and floral home décor pieces designed to add warmth and quiet beauty to modern spaces."
        canonical="/"
        image="https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg"
        type="website"
      />
      <Hero />
      <CategorySection />
      <FeaturedCollection />
      <SpotlightSection />
      <StorySection />
      <WhyBrushspace />
      <TestimonialsSection />
      <FAQAccordion limit={5} showViewAllLink={true} />
      <InstagramShowcase />
      <Newsletter />
    </div>
  );
};
