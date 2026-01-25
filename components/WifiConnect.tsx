'use client'

import { useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { useEffect } from 'react'

interface WifiNetwork {
  id: number
  ssid: string
  password: string
  security_type: string
  is_hidden: boolean
}

interface WifiConnectProps {
  wifiNetworks: WifiNetwork[]
  brandColor?: string
}

export default function WifiConnect({ wifiNetworks, brandColor = '#ED1D33' }: WifiConnectProps) {
  const [qrCodes, setQrCodes] = useState<{ [key: number]: string }>({})
  const [selectedWifi, setSelectedWifi] = useState<WifiNetwork | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  // Generate QR codes for all WiFi networks
  useEffect(() => {
    const generateQRCodes = async () => {
      const codes: { [key: number]: string } = {}
      for (const wifi of wifiNetworks) {
        const qrData = generateWifiQRString(wifi)
        try {
          const qrCodeUrl = await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          })
          codes[wifi.id] = qrCodeUrl
        } catch (error) {
          console.error('Error generating QR code:', error)
        }
      }
      setQrCodes(codes)
    }

    if (wifiNetworks.length > 0) {
      generateQRCodes()
    }
  }, [wifiNetworks])

  // Generate WiFi QR code string in standard format
  const generateWifiQRString = (wifi: WifiNetwork) => {
    // Standard WiFi QR code format: WIFI:T:WPA;S:ssid;P:password;H:false;;
    const security = wifi.security_type || 'WPA'
    const hidden = wifi.is_hidden ? 'true' : 'false'
    return `WIFI:T:${security};S:${wifi.ssid};P:${wifi.password};H:${hidden};;`
  }

  const handleShowQR = (wifi: WifiNetwork) => {
    setSelectedWifi(wifi)
    setShowPopup(true)
  }

  const handleConnect = (wifi: WifiNetwork) => {
    const wifiString = generateWifiQRString(wifi)
    
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase()
    const isAndroid = userAgent.includes('android')
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isMobile = isAndroid || isIOS

    if (isAndroid) {
      // Android - Try to use WiFi intent
      try {
        // Create WiFi configuration intent URL
        const intentUrl = `intent://wifi/#Intent;scheme=WIFI;S.T=${wifi.security_type};S.S=${encodeURIComponent(wifi.ssid)};S.P=${encodeURIComponent(wifi.password)};B.H=${wifi.is_hidden};end`
        
        // Try to open the intent
        window.location.href = intentUrl
        
        // Fallback: Show QR code popup
        setTimeout(() => {
          setSelectedWifi(wifi)
          setShowPopup(true)
        }, 1000)
      } catch (error) {
        console.error('Error connecting to WiFi:', error)
        // Show QR code as fallback
        setSelectedWifi(wifi)
        setShowPopup(true)
      }
    } else if (isIOS) {
      // iOS - Show QR code (most reliable method)
      setSelectedWifi(wifi)
      setShowPopup(true)
      
      // Also copy password for manual entry
      navigator.clipboard.writeText(wifi.password).catch(() => {
        // Ignore clipboard errors
      })
    } else {
      // Desktop/Other - Copy credentials and show instructions
      const credentials = `WiFi Network: ${wifi.ssid}\nPassword: ${wifi.password}\nSecurity: ${wifi.security_type}`
      
      navigator.clipboard.writeText(credentials).then(() => {
        alert(`WiFi credentials copied to clipboard!\n\nNetwork: ${wifi.ssid}\nPassword: ${wifi.password}\n\nPlease connect manually through your device's WiFi settings.`)
      }).catch(() => {
        alert(`WiFi Network: ${wifi.ssid}\nPassword: ${wifi.password}\nSecurity: ${wifi.security_type}\n\nPlease connect manually through your device's WiFi settings.`)
      })
    }
  }

  if (!wifiNetworks || wifiNetworks.length === 0) {
    return null
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
          Connect WiFi
        </h2>
        <div className="space-y-3">
          {wifiNetworks.map((wifi) => (
            <div
              key={wifi.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <svg
                  className="w-6 h-6 text-gray-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900 block truncate">{wifi.ssid}</span>
                  <span className="text-xs text-gray-500">{wifi.security_type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleShowQR(wifi)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                  title="Show QR Code"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="hidden sm:inline">QR</span>
                </button>
                <button
                  onClick={() => handleConnect(wifi)}
                  style={{ backgroundColor: brandColor }}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-1"
                  title="Connect to WiFi"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Popup */}
      {showPopup && selectedWifi && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedWifi.ssid}
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {qrCodes[selectedWifi.id] && (
              <div className="flex justify-center mb-4">
                <Image
                  src={qrCodes[selectedWifi.id]}
                  alt={`QR Code for ${selectedWifi.ssid}`}
                  width={250}
                  height={250}
                  className="rounded"
                />
              </div>
            )}
            <p className="text-center text-gray-600 text-sm mb-2">
              Scan this QR code with your camera to automatically connect
            </p>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Network:</span> {selectedWifi.ssid}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Password:</span> {selectedWifi.password}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Security:</span> {selectedWifi.security_type}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedWifi.password)
                  alert('Password copied to clipboard!')
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm"
              >
                Copy Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
