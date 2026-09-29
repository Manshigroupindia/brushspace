import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadToCloudinary } from './uploadAssetsToCloudinary.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to extract objects from typescript data files
function extractDataFromTs(filePath, varName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Match export const <varName> = [ ... ] or { ... }
  const regex = new RegExp(`export const ${varName}(?::\\s*[A-Za-z0-9_\\[\\]]+)?\\s*=\\s*([\\s\\S]*?);\\s*(?:export|$)`, 'm');
  const match = content.match(regex);
  if (!match) {
    throw new Error(`Could not find ${varName} in ${filePath}`);
  }
  // Safe evaluation of JS object literal
  const fn = new Function('DEFAULT_WHATSAPP_NUMBER', `return (${match[1]});`);
  return fn('919876543210');
}

async function run() {
  console.log('=== STARTING CLOUDINARY ASSET MIGRATION ===');

  const srcDataDir = path.join(__dirname, '..', 'src', 'data');
  const products = extractDataFromTs(path.join(srcDataDir, 'initialProducts.ts'), 'initialProducts');
  const categories = extractDataFromTs(path.join(srcDataDir, 'initialCategories.ts'), 'initialCategories');
  const banners = extractDataFromTs(path.join(srcDataDir, 'initialBanners.ts'), 'initialBanners');
  const testimonials = extractDataFromTs(path.join(srcDataDir, 'initialTestimonials.ts'), 'initialTestimonials');
  const faqs = extractDataFromTs(path.join(srcDataDir, 'initialFAQs.ts'), 'initialFAQs');
  const settings = extractDataFromTs(path.join(srcDataDir, 'initialSettings.ts'), 'initialSettings');

  console.log(`Loaded ${products.length} products, ${categories.length} categories, ${banners.length} banners, ${testimonials.length} testimonials.`);

  // 1. Categories
  console.log('\n--- Migrating Categories to Cloudinary ---');
  for (const cat of categories) {
    if (cat.image) {
      cat.image = await uploadToCloudinary(cat.image, 'brushspace/categories', `cat_${cat.slug}`);
    }
  }

  // 2. Banners
  console.log('\n--- Migrating Banners to Cloudinary ---');
  for (const banner of banners) {
    if (banner.image) {
      banner.image = await uploadToCloudinary(banner.image, 'brushspace/banners', `banner_${banner.id}`);
    }
    if (banner.secondaryImage) {
      banner.secondaryImage = await uploadToCloudinary(banner.secondaryImage, 'brushspace/banners', `banner_${banner.id}_sec`);
    }
  }

  // 3. Products
  console.log('\n--- Migrating Products to Cloudinary ---');
  for (const prod of products) {
    if (Array.isArray(prod.images)) {
      const newImages = [];
      for (let i = 0; i < prod.images.length; i++) {
        const img = prod.images[i];
        const newImg = await uploadToCloudinary(img, 'brushspace/products', `prod_${prod.slug}_${i + 1}`);
        newImages.push(newImg);
      }
      prod.images = newImages;
    }
  }

  // 4. Testimonials
  console.log('\n--- Migrating Testimonials to Cloudinary ---');
  for (const t of testimonials) {
    if (t.image) {
      t.image = await uploadToCloudinary(t.image, 'brushspace/testimonials', `test_${t.id}`);
    }
  }

  // 5. Settings
  console.log('\n--- Migrating Settings to Cloudinary ---');
  if (settings.logoUrl) {
    settings.logoUrl = await uploadToCloudinary(settings.logoUrl, 'brushspace/site', 'logo');
  }

  // Save migrated data to json
  const outPath = path.join(__dirname, 'migrated_data.json');
  fs.writeFileSync(
    outPath,
    JSON.stringify({ products, categories, banners, testimonials, faqs, settings }, null, 2),
    'utf-8'
  );

  console.log(`\n=== MIGRATION COMPLETE! Saved migrated data to ${outPath} ===`);
}

run().catch(console.error);
