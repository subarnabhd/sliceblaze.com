'use client'

import Link from 'next/link'

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: '🏢',
      title: 'Professional Business Profiles',
      description: 'Create a stunning digital presence for your business with fully customizable profiles.',
      features: [
        'Custom branding with logo and colors',
        'Multiple image galleries',
        'Business hours and contact info',
        'Social media integration',
        'SEO-optimized pages'
      ],
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: '📖',
      title: 'Smart Digital Menus',
      description: 'Showcase your products and services with beautiful, easy-to-manage digital menus.',
      features: [
        'Unlimited menu items',
        'Categories and subcategories',
        'Image uploads for items',
        'Price management',
        'Real-time updates'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📶',
      title: 'WiFi QR Code Generator',
      description: 'Share your WiFi credentials securely with customers using QR codes.',
      features: [
        'Instant QR code generation',
        'Multiple WiFi networks',
        'Secure credential storage',
        'Print-ready designs',
        'Easy customer access'
      ],
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: '🔍',
      title: 'Enhanced Discoverability',
      description: 'Get found by local customers actively searching for businesses like yours.',
      features: [
        'Category-based listings',
        'Search optimization',
        'Location-based discovery',
        'Featured placements',
        'Analytics tracking'
      ],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Perfect experience across all devices - phones, tablets, and desktops.',
      features: [
        'Responsive layouts',
        'Touch-optimized interface',
        'Fast loading times',
        'App-like experience',
        'Cross-browser support'
      ],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '⚡',
      title: 'Instant Real-Time Updates',
      description: 'Make changes to your business information and see them live immediately.',
      features: [
        'Live editing interface',
        'No delays or waiting',
        'Bulk updates support',
        'Version history',
        'Auto-save functionality'
      ],
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  const additionalFeatures = [
    { icon: '🎨', title: 'Custom Themes', description: 'Choose from multiple themes or create your own' },
    { icon: '📊', title: 'Analytics Dashboard', description: 'Track views, clicks, and customer engagement' },
    { icon: '🔒', title: 'Secure & Private', description: 'Your data is encrypted and protected' },
    { icon: '💬', title: 'Customer Reviews', description: 'Collect and display customer testimonials' },
    { icon: '📧', title: 'Email Notifications', description: 'Stay informed about updates and activities' },
    { icon: '🌐', title: 'Multi-language', description: 'Support for multiple languages' },
    { icon: '🔗', title: 'Custom URLs', description: 'Get your own branded web address' },
    { icon: '⭐', title: 'Priority Support', description: '24/7 customer support for all users' }
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-[#ED1D33] to-red-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-6">
              <span className="text-lg">🚀</span>
              ALL FEATURES
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Powerful Tools for
              <br />
              Modern Businesses
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto mb-10">
              Everything you need to create, manage, and grow your digital presence - all in one platform.
            </p>
            <Link
              href="/add-business"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#ED1D33] text-lg font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 transform duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Free Today
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to help your business succeed online
            </p>
          </div>

          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Feature Content */}
                <div className="flex-1">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br ${feature.gradient} text-white mb-6 shadow-xl`}>
                    <span className="text-5xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-[#ED1D33] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Feature Visual */}
                <div className="flex-1">
                  <div className={`relative rounded-3xl overflow-hidden shadow-2xl group`}>
                    <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className="relative bg-white p-10 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
                      <div className="flex items-center justify-center mb-8">
                        <div className={`w-32 h-32 rounded-3xl bg-linear-to-br ${feature.gradient} flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-7xl">{feature.icon}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-3 bg-linear-to-r from-gray-200 to-gray-100 rounded-full w-4/5 mx-auto"></div>
                        <div className="h-3 bg-linear-to-r from-gray-200 to-gray-100 rounded-full w-full mx-auto"></div>
                        <div className="h-3 bg-linear-to-r from-gray-200 to-gray-100 rounded-full w-3/5 mx-auto"></div>
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-3">
                        <div className={`h-16 rounded-xl bg-linear-to-br ${feature.gradient} opacity-20`}></div>
                        <div className={`h-16 rounded-xl bg-linear-to-br ${feature.gradient} opacity-30`}></div>
                        <div className={`h-16 rounded-xl bg-linear-to-br ${feature.gradient} opacity-20`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Features Grid */}
      <div className="py-24 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              And Much More...
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Additional features to enhance your business presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#ED1D33] group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#ED1D33] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-linear-to-r from-[#ED1D33] to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-red-100 mb-10">
            Join hundreds of businesses already growing with SliceBlaze
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add-business"
              className="px-10 py-5 bg-white text-[#ED1D33] text-lg font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform duration-300"
            >
              Create Your Profile
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 bg-transparent border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white hover:text-[#ED1D33] transition-all shadow-xl"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
