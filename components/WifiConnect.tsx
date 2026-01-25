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
    // Generate WiFi connection string and copy to clipboard
    const wifiString = generateWifiQRString(wifi)
    
    // For mobile devices, try to copy the password
    navigator.clipboard.writeText(wifi.password).then(() => {
      alert(`WiFi Password copied to clipboard!\nSSID: ${wifi.ssid}\nPassword: ${wifi.password}`)
    }).catch(() => {
      alert(`WiFi Details:\nSSID: ${wifi.ssid}\nPassword: ${wifi.password}`)
    })
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
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-gray-600"
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
                <span className="font-medium text-gray-900">{wifi.ssid}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShowQR(wifi)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  QR
                </button>
                <button
                  onClick={() => handleConnect(wifi)}
                  style={{ backgroundColor: brandColor }}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity"
                >
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
            <p className="text-center text-gray-600 text-sm">
              Scan this QR code with your phone to connect to WiFi
            </p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Password:</span> {selectedWifi.password}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
