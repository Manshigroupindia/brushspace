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

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'BRUSHSPACE — Artistic Home Décor & Curated Objects';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full">
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
