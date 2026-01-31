import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const fileEntry = formData.get('file')
    const folderEntry = formData.get('folder')
    const file = fileEntry instanceof File ? fileEntry : null
    const folder = typeof folderEntry === 'string' ? folderEntry : 'sliceblaze'
    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }
    const result = await uploadToCloudinary(file, folder)
    return NextResponse.json({ url: result.url })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 500 })
  }
}
