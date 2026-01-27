import React from 'react'
import Link from 'next/link'

const Features = () => {
  const features = [
    {
      icon: '🏢',
      title: 'Business Profiles',
      description: 'Create stunning digital profiles for your business with customizable themes, logos, and branding.',
      gradient: 'from-red-500/10 to-pink-500/10',
      borderGradient: 'from-red-500 to-pink-500'
    },
    {
      icon: '📖',
      title: 'Digital Menu',
      description: 'Showcase your products and services with beautiful digital menus. Easy to update, always accessible.',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      borderGradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📶',
      title: 'WiFi Sharing',
      description: 'Share your WiFi credentials securely with customers. Generate QR codes for instant connection.',
      gradient: 'from-purple-500/10 to-indigo-500/10',
      borderGradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: '🔍',
      title: 'Easy Discovery',
      description: 'Get found by local customers searching for businesses like yours. Boost your visibility online.',
      gradient: 'from-green-500/10 to-emerald-500/10',
      borderGradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Perfect experience on all devices. Your business profile looks great on phones, tablets, and desktops.',
      gradient: 'from-orange-500/10 to-red-500/10',
      borderGradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '⚡',
      title: 'Instant Updates',
      description: 'Update your business information, menu, and hours instantly. Changes go live immediately.',
      gradient: 'from-yellow-500/10 to-orange-500/10',
      borderGradient: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-100 to-pink-100 text-[#ED1D33] text-sm font-bold rounded-full mb-6">
            <span className="text-lg">?</span>
            POWERFUL FEATURES
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Everything Your Business
            <br />
            <span className="bg-linear-to-r from-[#ED1D33] to-red-600 bg-clip-text text-transparent">
              Needs to Thrive
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business presence with our comprehensive suite of
            digital tools designed for modern entrepreneurs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent overflow-hidden"
            >
              {/* Gradient Border on Hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
              ></div>
              <div className="absolute inset-0.5 bg-white rounded-3xl"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with Background */}
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  <span className="text-5xl">{feature.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#ED1D33] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-base">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center gap-2 text-[#ED1D33] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-24 bg-linear-to-r from-[#ED1D33] to-red-600 rounded-3xl p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white mb-2">
                500+
              </div>
              <div className="text-red-100 font-medium">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white mb-2">
                10k+
              </div>
              <div className="text-red-100 font-medium">Monthly Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white mb-2">
                24/7
              </div>
              <div className="text-red-100 font-medium">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white mb-2">
                100%
              </div>
              <div className="text-red-100 font-medium">Free to Start</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/add-business"
              className="group px-10 py-5 bg-linear-to-r from-[#ED1D33] to-red-600 text-white text-lg font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 hover:scale-105 transform duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your Profile
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/features"
              className="px-10 py-5 bg-white text-gray-700 text-lg font-bold rounded-xl border-2 border-gray-300 hover:border-[#ED1D33] hover:text-[#ED1D33] transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
            >
              View All Features
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features
