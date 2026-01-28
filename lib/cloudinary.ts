import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

/**
 * Upload image to Cloudinary
 * @param file - File to upload
 * @param folder - Folder in Cloudinary (e.g., 'businesses', 'categories')
 * @returns Object with secure_url and public_id
 */
export async function uploadToCloudinary(file: File, folder: string = 'sliceblaze') {
  try {
    // Convert File to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary with SEO-friendly settings
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: folder,
      resource_type: 'auto',
      type: 'upload', // Public upload type (not authenticated)
      access_mode: 'public', // Ensure public access for search engines
      use_filename: true, // Use original filename for better SEO
      unique_filename: true, // Add unique identifier to prevent conflicts
      overwrite: false, // Don't overwrite existing files
      invalidate: true, // Invalidate CDN cache on upload
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
        { quality: 'auto:good', fetch_format: 'auto' }, // Auto optimization with good quality
      ],
      // SEO metadata
      context: {
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '), // Generate alt text from filename
        caption: `Image uploaded to ${folder}`,
      },
      // Add tags for better organization and SEO
      tags: [folder, 'sliceblaze', 'business'],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - Public ID of the image
 * @param width - Desired width
 * @param height - Desired height
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    crop?: string
    quality?: string
    format?: string
  }
) {
  const { width, height, crop = 'fill', quality = 'auto:good', format = 'auto' } = options || {}

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format,
    secure: true, // Always use HTTPS
    sign_url: false, // Don't sign URLs (permanent, public URLs)
    type: 'upload', // Public upload type
  })
}

/**
 * Generate SEO-friendly image metadata for Next.js Image component
 * @param url - Cloudinary URL
 * @param alt - Alt text for accessibility and SEO
 * @param businessName - Optional business name for better context
 */
export function getImageMetadata(url: string, alt: string, businessName?: string) {
  return {
    src: url,
    alt: alt || 'Business image',
    // Add structured data for Google Images
    itemProp: 'image',
    loading: 'lazy' as const,
    // SEO attributes
    title: businessName ? `${alt} - ${businessName}` : alt,
  }
}
