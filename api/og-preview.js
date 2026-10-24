const BASE_URL = 'https://www.brushspace.in';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg';
const PROJECT_ID = 'brushspace-17bf4';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  const { type = 'product', slug = '' } = req.query;

  let title = 'BRUSHSPACE — Artistic Home Décor & Curated Objects';
  let description = 'Discover handcrafted vases, decorative trees, trays, mirror mosaic and floral home décor pieces designed to add warmth and quiet beauty to modern spaces.';
  let image = DEFAULT_IMAGE;
  let pageUrl = `${BASE_URL}/`;
  let ogType = type === 'product' ? 'product' : 'website';
  let price = 0;

  try {
    if (type === 'product' && slug) {
      pageUrl = `${BASE_URL}/product/${slug}`;
      const queryPayload = {
        structuredQuery: {
          from: [{ collectionId: 'products' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: slug }
            }
          },
          limit: 1
        }
      };

      const firestoreRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryPayload)
        }
      );

      const data = await firestoreRes.json();
      if (Array.isArray(data) && data[0]?.document?.fields) {
        const fields = data[0].document.fields;
        const name = fields.name?.stringValue || slug.replace(/-/g, ' ');
        const desc = fields.description?.stringValue || fields.shortDescription?.stringValue || '';
        const images = (fields.images?.arrayValue?.values || []).map((v) => v.stringValue).filter(Boolean);
        const prodPrice = Number(fields.price?.integerValue || fields.price?.doubleValue || 0);

        title = `${name} | Brushspace`;
        if (desc && !desc.includes('will be updated soon')) {
          description = desc;
        } else if (fields.shortDescription?.stringValue) {
          description = fields.shortDescription.stringValue;
        } else {
          description = `Handcrafted ${name} from Brushspace. Artfully designed for modern, tranquil living spaces.`;
        }
        if (images.length > 0) {
          image = images[0];
        }
        price = prodPrice;
      }
    } else if (type === 'category' && slug) {
      pageUrl = `${BASE_URL}/category/${slug}`;
      const catRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/categories/${slug}`
      );
      if (catRes.ok) {
        const catData = await catRes.json();
        const f = catData.fields || {};
        const name = f.name?.stringValue || slug.replace(/-/g, ' ').toUpperCase();
        title = `${name} | Brushspace`;
        description = f.description?.stringValue || `Explore handcrafted ${name} pieces from Brushspace atelier.`;
        image = f.image?.stringValue || DEFAULT_IMAGE;
      }
    }
  } catch (err) {
    console.error('Error in og-preview endpoint:', err);
  }

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(pageUrl)}" />

    <!-- Open Graph Metadata -->
    <meta property="og:site_name" content="Brushspace" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:type" content="${escapeHtml(ogType)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:image:type" content="image/jpeg" />
    ${ogType === 'product' && price > 0 ? `
    <meta property="product:price:amount" content="${price}" />
    <meta property="product:price:currency" content="INR" />
    <meta property="product:availability" content="in stock" />` : ''}

    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(pageUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(title)}" />

    <meta http-equiv="refresh" content="0;url=${escapeHtml(pageUrl)}" />
  </head>
  <body>
    <p>Redirecting to <a href="${escapeHtml(pageUrl)}">${escapeHtml(title)}</a>...</p>
    <script>window.location.replace(${JSON.stringify(pageUrl)});</script>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
}
