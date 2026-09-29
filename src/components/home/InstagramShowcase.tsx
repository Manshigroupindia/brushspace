import React from 'react';
import { useStoreData } from '../../context/StoreDataContext';

export const InstagramShowcase: React.FC = () => {
  const { settings } = useStoreData();

  const galleryImages = [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Ji6iXZaREQWP-GnkeTs5FtkLCB4cfsr_YpaC8O8rBrbxtAWGFykBGK3MbTsj57PCoQaLoJxXKZoQdlOe2UrhEav5sQ6-kow2RQT34Nh6N0DSnb-DnV3bKCWaIDAfpBSqYJC3tVIcmGQjc2XF5rDokv0gtuKGL5DR3820xfWFuJ9UHhYeoO5Sv9BS9MytQjN8L867dK2BALB9Dtrvsz_YCCHURBWDPNrrVaAeUhM28UW1WxzgGtRF',
      alt: 'Sunlit minimalist living room credenza styled with a sculptural white vase and dried olive branches',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Y7VA55whJsQPpnFjRDW3kHrpiHvztzOOco4p1kUfXFRMimsoeVVi4289DjkIWOhhTOtBTamdazwiU-1k_TdIZ-yHyTi6utkz2ng1t76YGi8S_4QTlCKcN2CsO6ySCjMoRVvnwRAIIqdB_UhMRCUv9kJ2hC5aiwUz4O9Gi_DafAkHUziSPp38CEtb2H_XtfeAlXMBDZvJb6l-i3Ovpxho3HdExfTpmWavq3ztf38evYB5Po3BNBxp',
      alt: 'Travertine bedside table with miniature gilded bonsai tree under soft reading sconce light',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpkFy5Gu8NaumvGeWBVGlXgUEdwhc-FBXvc0WsJDYth2ijtY8X-SceOlDG7guFyXtRCPHN0D3E5RBQYLyexB80m2XKf1ejqXX7ldKbz-G6XGmr6UWSaCaMSoemqteVfXYiICj-0grKASsbVsR58-xs8hnQbCI6-Vu2gOeDrJKpx6TCz1D6XFl2KAN3qq1av6Y98tmldRqwh9olBX7bm9t48r33lEOwZwsTLjPjES99HJcs9mne7G7Z',
      alt: 'Modern dining sideboard featuring mirror mosaic globe reflecting light onto textured off-white limewash backdrop',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGOCGaFDodYxKkKOx23k4GLtxs8xY0SGXMp_nniAlhPx9oyKG8rBK_i1o39Gby94P0VW6GMw8XP9oCbV4YnGRXUNhl5MLMhaUBW3YuDcAvzxDLmmdqQIAqPbV3sE_79LJG-kRZ0Fs1lgFVzGjVlxAQcKrkGneVTjKpNyjfnvmRqdHObJcX4RV7OD1H31ESVOeu2qRm8d2MjSDkqtgjiIeiGzW6-iaGo13s7-d1M405JwPnMViY8WxM',
      alt: 'Architectural curved niche in clay living room holding dark forest embellished vessel and ceramic spheres',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7GBX82nZ1trYO8CbstVHGgSIrW27J0nxhq95QnvxAPUNpsQHibrf1hJB481_9Sv8hFTJrKhW5oKNdM6Gcw1UAA-EzPcGdhmCpObMR94b0ePHZHfQVW0LrsbSc9xUcnKk8hnSwcfPrXlO_GedaqBv5hQfLDEjdHvbw5eJof3ehSPP0LcsN_pBT9a8MmRQL6N3EW5Pac_IsyyPKbnxTTrA6KQl-Pi-H6gauUUMBzT96PoHmSdBYRHqB',
      alt: 'Earthy kitchen island with fluted shell tray holding organic fruits and ceramic cruets',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7zhdTknBK18lf6kTZxwuKpr82FcX3rGhch0dXYTCWPrnkVr4sBMof8Ves6AAnc49vesUobRhzSqkffq9y7UskCiNg-KN1ojnsVfRJdgaZwpZNvSs3mObdlGnnPk8-6leH4Y6-4piXhG9axAXNwN9Ui15pj8k8VGAJpl45NGkazaf2wiutuzRUaD_-4efrpvg8kWFaQHWdhH-uiXcvm_f7s-aHbp0IjhFb-HJVqZyH76LXV7SdCJwQ',
      alt: 'Study desk styling with terracotta loving birds pair on stacked architecture books and bronze lamp',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
        <div>
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-1 font-semibold">
            Living Spaces
          </p>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Follow The Brushspace
          </h2>
        </div>
        <a
          href={settings.socialInstagram}
          target="_blank"
          rel="noreferrer"
          className="mt-3 sm:mt-0 font-label-md text-label-md text-on-surface hover:text-primary transition-colors uppercase tracking-widest font-semibold"
        >
          @brushspace.decor
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {galleryImages.map((img, i) => (
          <a
            key={i}
            href={settings.socialInstagram}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square rounded-lg overflow-hidden bg-surface-container block shadow-sm border border-outline-variant/15"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-on-secondary-fixed/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-surface">
              <span className="material-symbols-outlined text-[24px]">photo_camera</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
