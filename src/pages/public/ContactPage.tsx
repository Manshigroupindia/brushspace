import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { settings, addCustomerInquiry } = useStoreData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Contact Studio & Showrooms — BRUSHSPACE';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    addCustomerInquiry({
      name,
      email,
      phone,
      subject: subject || 'General Studio Inquiry',
      message,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Your message has been sent to our curatorial team.', 'task_alt');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-surface-container-low px-margin-mobile md:px-gutter-desktop py-16 border-b border-outline-variant/15">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
            Studio Connect
          </span>
          <h1 className="font-display text-display text-on-surface tracking-tight mb-4">
            Connect With Our Curators
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Have questions about dimensions, finish options, bespoke commissioned sets, or studio visits? We are here to assist.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          {/* Left: Contact Info & Showrooms */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Priority Card */}
            <div className="bg-secondary-container/40 p-6 rounded-2xl border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                  Fastest Studio Response
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-medium">
                Direct WhatsApp Channel
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                Connect directly with our atelier styling managers in Mumbai &amp; Delhi for live photos, stock checks, and swift payment links.
              </p>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hello BRUSHSPACE, I have a curatorial inquiry regarding your collections.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                Chat on WhatsApp
              </a>
            </div>

            {/* Studio Info Details */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/15 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold">Email Studio</h4>
                  <a href={`mailto:${settings.contactEmail}`} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                    {settings.contactEmail}
                  </a>
                  <p className="font-label-sm text-label-sm text-outline mt-0.5">Average reply time: within 4 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold">Direct Telephone</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{settings.contactPhone}</p>
                  <p className="font-label-sm text-label-sm text-outline mt-0.5">Mon – Sat, 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold">Atelier Showrooms</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{settings.showroomAddress}</p>
                  <p className="font-label-sm text-label-sm text-outline mt-0.5">Styling consultation visits by prior appointment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Studio Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-outline-variant/20 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2 font-medium">
              Send an Atelier Inquiry
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              Fill out the form below and an interior stylist will get in touch with you promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Kapoor"
                    className="w-full bg-surface text-on-surface px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. radhika@example.com"
                    className="w-full bg-surface text-on-surface px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Phone (WhatsApp preferred)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-surface text-on-surface px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Custom Size / Bulk Styling / Product Inquiry"
                    className="w-full bg-surface text-on-surface px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Your Inquiry or Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about the product pieces or spatial arrangements you are planning..."
                  className="w-full bg-surface text-on-surface px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT INQUIRY'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
