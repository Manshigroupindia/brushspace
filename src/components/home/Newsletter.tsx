import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Welcome to the Brushspace Circle.', 'mark_email_read');
    setEmail('');
  };

  return (
    <section className="w-full bg-surface-container-high py-space-xl border-t border-outline-variant/15">
      <div className="max-w-3xl mx-auto px-margin-mobile text-center">
        <span className="material-symbols-outlined text-primary text-[32px] mb-2">mail</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">Stay Inspired.</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto mb-8 leading-relaxed">
          Receive quarterly studio dispatches, preview early limited batch drops, and explore home styling essays.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-grow px-4 py-3 rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/20"
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-lg bg-on-secondary-fixed hover:bg-primary text-surface font-label-md text-label-md uppercase tracking-wider transition-colors shadow-sm shrink-0"
          >
            SUBSCRIBE
          </button>
        </form>

        <p className="font-label-sm text-label-sm text-on-surface-variant/70 mt-3">
          We respect your space. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};
