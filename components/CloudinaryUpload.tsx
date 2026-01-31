'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CloudinaryUploadProps {
  onUploadComplete: (url: string) => void
  currentImage?: string
  folder?: string
  maxSize?: number // in MB
}

export default function CloudinaryUpload({
  onUploadComplete,
  currentImage,
  folder = 'sliceblaze',
  maxSize = 5,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Delete previous image if exists
      if (preview && preview !== currentImage && currentImage) {
        // Extract publicId from currentImage URL if possible
        const publicIdMatch = currentImage.match(/\/([^/.]+)\.[a-zA-Z]+$/)
        if (publicIdMatch && publicIdMatch[1]) {
          await deleteFromCloudinary(publicIdMatch[1])
        }
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Always upload with a unique name
      const uniqueName = `${Date.now()}-${file.name}`
      const renamedFile = new File([file], uniqueName, { type: file.type })

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', renamedFile)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onUploadComplete(data.url)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview && (
        <div className="relative w-40 h-40 mx-auto">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-lg border-2 border-gray-200"
          />
        </div>
      )}

      {/* Upload Button */}
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="image-upload"
          className={`px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#ED1D33] hover:bg-[#C91828] text-white'
          }`}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </span>
          ) : (
            <span>{preview ? 'Change Image' : 'Upload Image'}</span>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-sm text-gray-500">
          Max size: {maxSize}MB. Formats: JPG, PNG, WebP, GIF
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
