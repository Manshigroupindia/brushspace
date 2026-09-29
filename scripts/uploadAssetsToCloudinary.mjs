import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUD_NAME = 'f3nn4gbc';
const UPLOAD_PRESET = 'brushspace';

// Cache file to ensure idempotency (don't re-upload already uploaded URLs)
const MAPPING_FILE = path.join(__dirname, 'cloudinary_mapping.json');
let mapping = {};

if (fs.existsSync(MAPPING_FILE)) {
  try {
    mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  } catch (err) {
    mapping = {};
  }
}

async function uploadToCloudinary(imageUrl, folder = 'brushspace/general', publicId = null) {
  if (!imageUrl || typeof imageUrl !== 'string') return imageUrl;
  // If already a Cloudinary URL, return as is
  if (imageUrl.includes('res.cloudinary.com')) return imageUrl;
  // If already in mapping cache, return cached Cloudinary URL
  if (mapping[imageUrl]) {
    console.log(`[CACHED] ${imageUrl.slice(0, 50)}... -> ${mapping[imageUrl]}`);
    return mapping[imageUrl];
  }

  const formData = new FormData();
  formData.append('file', imageUrl);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) formData.append('folder', folder);
  if (publicId) formData.append('public_id', publicId);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
    console.log(`[UPLOADING] ${imageUrl.slice(0, 60)}...`);
    const res = await fetch(endpoint, { method: 'POST', body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn(`[WARN] Failed to upload ${imageUrl.slice(0, 50)}:`, err?.error?.message || res.statusText);
      return imageUrl; // fallback to original if remote host fails
    }
    const data = await res.json();
    const secureUrl = data.secure_url;
    mapping[imageUrl] = secureUrl;
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');
    console.log(`[SUCCESS] -> ${secureUrl}`);
    return secureUrl;
  } catch (err) {
    console.warn(`[WARN] Cloudinary upload network error for ${imageUrl.slice(0, 50)}:`, err.message);
    return imageUrl;
  }
}

export { uploadToCloudinary, mapping, MAPPING_FILE };
