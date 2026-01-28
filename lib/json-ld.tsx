interface Business {
  id: number
  name: string
  username: string
  location: string
  category: string
  image: string
  description: string
  contact: string
  whatsapp: string
  website: string
  openingHours: string
  openinghours?: string
  facebook: string
  twitter: string
  youtube: string
  instagram: string
  linkedin: string
  tiktok: string
  threads: string
  googleMapUrl: string
  googlemapurl?: string
  brandPrimaryColor: string
  brandprimarycolor?: string
  brandSecondaryColor: string
  brandsecondarycolor?: string
}

export function generateBusinessJsonLd(business: Business) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    image: {
      '@type': 'ImageObject',
      url: business.image,
      description: `${business.name} logo - ${business.category}`,
      contentUrl: business.image,
      width: '1200',
      height: '1200',
      encodingFormat: 'image/jpeg',
    },
    url: `https://sliceblaze.com/${business.username}`,
    telephone: business.contact,
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.location,
    },
    openingHours: business.openingHours || business.openinghours,
    priceRange: '$$',
    sameAs: [
      business.facebook,
      business.instagram,
      business.twitter,
      business.linkedin,
      business.youtube,
      business.tiktok,
      business.threads,
    ].filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function generateWebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sliceblaze',
    url: 'https://sliceblaze.com',
    description: 'Your Business Digital Partner - Transform your business with digital solutions',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://sliceblaze.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function generateOrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sliceblaze',
    url: 'https://sliceblaze.com',
    logo: 'https://sliceblaze.com/logo.png',
    description: 'Sliceblaze empowers businesses with digital solutions including WiFi management, digital menus, QR codes, and comprehensive business profiles.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
