import { Metadata } from 'next'
import { getBusinessByUsername } from '@/lib/supabase'

type Props = {
  params: Promise<{ username: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  
  try {
    const business = await getBusinessByUsername(username)
    
    if (!business) {
      return {
        title: 'Business Not Found',
        description: 'The business you are looking for does not exist.',
      }
    }

    const businessUrl = `https://sliceblaze.com/${business.username}`
    const imageUrl = business.image || '/sample.svg'
    
    return {
      title: `${business.name} - ${business.category}`,
      description: business.description || `${business.name} - ${business.category} located at ${business.location}. Contact us for services and more information.`,
      keywords: [
        business.name,
        business.category,
        business.location,
        'business profile',
        'contact',
        'services',
        business.username,
      ],
      authors: [{ name: business.name }],
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: businessUrl,
        siteName: 'Sliceblaze',
        title: `${business.name} - ${business.category}`,
        description: business.description || `${business.name} - ${business.category} located at ${business.location}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: business.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${business.name} - ${business.category}`,
        description: business.description || `${business.name} - ${business.category} located at ${business.location}`,
        images: [imageUrl],
      },
      alternates: {
        canonical: businessUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Business Profile',
      description: 'View business profile on Sliceblaze',
    }
  }
}

export default async function UsernameLayout({ children }: Props) {
  // Params is awaited in generateMetadata, just return children
  return <>{children}</>
}
