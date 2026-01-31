import { NextRequest, NextResponse } from 'next/server'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const { publicId } = await req.json()
    if (!publicId) {
      return NextResponse.json({ error: 'Missing publicId' }, { status: 400 })
    }
    await deleteFromCloudinary(publicId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Delete failed' }, { status: 500 })
  }
}
