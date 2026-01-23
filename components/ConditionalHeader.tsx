'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()

  // Hide header on login, register, and admin pages
  const hideHeaderRoutes = ['/login', '/register', '/admin']

  const shouldShowHeader = !hideHeaderRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (!shouldShowHeader) {
    return null
  }

  return <Header />
}
