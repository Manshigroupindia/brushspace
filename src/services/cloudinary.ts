export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'f3nn4gbc';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'brushspace';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '636282116583959';

/**
 * Upload an image (File, Blob, or URL string) to Cloudinary via unsigned upload preset
 */
export async function uploadImage(
  file: File | Blob | string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('api_key', API_KEY);

  if (folder) {
    formData.append('folder', folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || `Upload failed with status ${response.status}`;
      throw new Error(`Cloudinary upload error: ${message}`);
    }

    const data = await response.json();

    return {
      url: data.url,
      secureUrl: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error: any) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}
