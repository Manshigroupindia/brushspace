import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';

interface FAQAccordionProps {
  limit?: number;
  showViewAllLink?: boolean;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ limit = 5, showViewAllLink = true }) => {
  const { faqs } = useStoreData();
  const [openIds, setOpenIds] = useState<string[]>([]);

  const activeFaqs = faqs.filter((f) => f.isActive).sort((a, b) => a.order - b.order);
  const displayedFaqs = limit ? activeFaqs.slice(0, limit) : activeFaqs;

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full bg-surface-container py-space-xl">
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop">
        <div className="text-center mb-12">
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 font-semibold">
            Studio Inquiries
          </p>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {displayedFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-surface rounded-xl overflow-hidden transition-all duration-200 border border-outline-variant/15"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <span
                    className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showViewAllLink && (
          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1 font-label-md text-label-md text-primary uppercase tracking-widest font-semibold hover:underline"
            >
              VIEW ALL FAQs{' '}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
