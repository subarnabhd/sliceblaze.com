import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/', '/auth/', '/profile/'],
      },
    ],
    sitemap: 'https://sliceblaze.com/sitemap.xml',
  }
}
