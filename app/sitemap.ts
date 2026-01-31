import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sliceblaze.com'

  // Static public pages (user-facing only)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/add-business`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Check if supabase is available
  if (!supabase) {
    console.warn('Supabase client not initialized. Sitemap will only include static pages.')
    return staticPages
  }

  try {
    // Fetch all active businesses
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('username, updated_at, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching businesses for sitemap:', error)
      return staticPages
    }

    const businessPages: MetadataRoute.Sitemap = businesses
      ? businesses.map((business) => ({
          url: `${baseUrl}/${business.username}`,
          lastModified: new Date(business.updated_at || business.created_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      : []

    console.log(`Sitemap generated with ${businessPages.length} businesses`)
    return [...staticPages, ...businessPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
