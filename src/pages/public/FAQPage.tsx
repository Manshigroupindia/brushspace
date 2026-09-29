import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../context/StoreDataContext';

export const FAQPage: React.FC = () => {
  const { faqs, isLoading } = useStoreData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']);

  useEffect(() => {
    document.title = 'Studio FAQs & Ordering Inquiries — BRUSHSPACE';
    window.scrollTo(0, 0);
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs
    .filter((f) => f.isActive)
    .filter((f) => (selectedCategory === 'all' ? true : f.category === selectedCategory))
    .sort((a, b) => a.order - b.order);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-surface-container-low px-margin-mobile md:px-gutter-desktop py-16 border-b border-outline-variant/15">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
            Collector Assistance
          </span>
          <h1 className="font-display text-display text-on-surface tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our direct studio ordering process, white-glove packaging, transit insurance, and bespoke dimensions.
          </p>
        </div>
      </section>

      {/* Main FAQ Container */}
      <section className="w-full max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-on-secondary-fixed text-surface'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {isLoading && faqs.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-container rounded-xl p-6 border border-outline-variant/15 space-y-2">
                <div className="h-4 bg-surface-variant rounded w-2/3"></div>
                <div className="h-3 bg-surface-variant/50 rounded w-full"></div>
              </div>
            ))
          ) : (
            filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-surface rounded-xl overflow-hidden transition-all duration-200 border border-outline-variant/15 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <span
                    className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 font-body-md text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
        </div>
      </section>
    </div>
  );
};
