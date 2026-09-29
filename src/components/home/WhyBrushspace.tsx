import React from 'react';

export const WhyBrushspace: React.FC = () => {
  const pillars = [
    {
      icon: 'architecture',
      title: 'Thoughtful Design',
      desc: 'Sculptural silhouettes tailored for modern architecture and understated interior palettes.',
    },
    {
      icon: 'grain',
      title: 'Beautiful Details',
      desc: 'Tactile clay, delicate glass beads, and brass leaf finishes executed with patient artisan care.',
    },
    {
      icon: 'aspect_ratio',
      title: 'Made For Your Space',
      desc: 'Versatile scale proportioned for low credenzas, dining tables, architectural alcoves & mantels.',
    },
    {
      icon: 'support_agent',
      title: 'Easy Direct Ordering',
      desc: 'Seamless studio support, bespoke packaging, and personal updates on dispatch.',
    },
  ];

  return (
    <section className="w-full bg-surface-container py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 font-semibold">
            The Studio Standard
          </p>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Why Brushspace</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-surface p-8 rounded-xl flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-outline-variant/15"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[26px]">{pillar.icon}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-medium">
                {pillar.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
