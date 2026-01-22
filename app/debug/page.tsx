'use client'

import { useState, useEffect } from 'react'
import { debugGetAllUsers, debugGetUserByEmail, verifyLogin } from '@/lib/supabase'

interface User {
  [key: string]: unknown
}

export default function DebugPage() {
  const [users, setUsers] = useState<User[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [testUsername, setTestUsername] = useState('admin')
  const [testPassword, setTestPassword] = useState('admin123')
  const [testResult, setTestResult] = useState('')
  const [emailTestResult, setEmailTestResult] = useState('')

  const handleFetchUsers = async () => {
    setLoading(true)
    console.log('Fetching all users...')
    const allUsers = await debugGetAllUsers() as User[]
    setUsers(allUsers)
    
    // Extract column names from first user
    if (allUsers && allUsers.length > 0) {
      setColumns(Object.keys(allUsers[0]))
      console.log('Database columns:', Object.keys(allUsers[0]))
    }
    
    setLoading(false)
  }

  const handleTestLogin = async () => {
    setLoading(true)
    console.log(`Testing login: ${testUsername} / ${testPassword}`)
    const result = await verifyLogin(testUsername, testPassword)
    console.log('Test login result:', result)
    setTestResult(result ? `✅ Login successful: ${JSON.stringify(result)}` : '❌ Login failed')
    setLoading(false)
  }

  const handleTestEmailLogin = async () => {
    setLoading(true)
    const email = testUsername.includes('@') ? testUsername : `${testUsername}@example.com`
    console.log(`Testing email lookup: ${email}`)
    const result = await debugGetUserByEmail(email)
    console.log('Email lookup result:', result)
    setEmailTestResult(result ? `✅ User found: ${JSON.stringify(result)}` : '❌ User not found by email')
    setLoading(false)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await debugGetAllUsers() as User[]
      setUsers(allUsers)
      
      if (allUsers && allUsers.length > 0) {
        setColumns(Object.keys(allUsers[0]))
        console.log('Database columns:', Object.keys(allUsers[0]))
      }
    }
    
    void fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Debug Dashboard</h1>

      {/* Database Schema Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Database Schema</h2>
        {columns.length > 0 ? (
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="font-semibold mb-2">Columns in users table:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {columns.map((col) => (
                <div key={col} className="bg-white px-3 py-2 rounded border border-blue-100 font-mono text-sm">
                  {col}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading schema...</p>
        )}
      </div>

      {/* Test Login Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Test Login (Username)</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={testUsername}
            onChange={(e) => setTestUsername(e.target.value)}
            placeholder="Username"
            className="px-4 py-2 border rounded"
          />
          <input
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Password"
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Testing...' : 'Test Username Login'}
          </button>
        </div>
        {testResult && (
          <div className={`p-4 rounded font-mono text-sm ${testResult.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {testResult}
          </div>
        )}
      </div>

      {/* Test Email Login Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Test Lookup by Email</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={testUsername}
            onChange={(e) => setTestUsername(e.target.value)}
            placeholder="Email or username"
            className="px-4 py-2 border rounded flex-1"
          />
          <button
            onClick={handleTestEmailLogin}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? 'Testing...' : 'Test Email Lookup'}
          </button>
        </div>
        {emailTestResult && (
          <div className={`p-4 rounded font-mono text-sm overflow-auto ${emailTestResult.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {emailTestResult}
          </div>
        )}
      </div>

      {/* Users Table Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Users in Database</h2>
          <button
            onClick={handleFetchUsers}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {users.length === 0 ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700">
            <p className="font-semibold">⚠️ No users found in database!</p>
            <p className="mt-2 text-sm">The users table may not exist or may not have any data. Check your Supabase database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((col) => (
                    <th key={col} className="border px-4 py-2 text-left font-semibold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user: User, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 border-b">
                    {columns.map((col) => (
                      <td key={`${idx}-${col}`} className="border px-4 py-2">
                        <div className="font-mono text-xs max-w-xs overflow-auto">
                          {col === 'is_active' ? (
                            <span className={(user[col] as unknown as boolean) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {(user[col] as unknown as boolean) ? '✓ Active' : '✗ Inactive'}
                            </span>
                          ) : col === 'role' ? (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              (user[col] as string) === 'admin' ? 'bg-red-100 text-red-700' :
                              (user[col] as string) === 'owner' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {String(user[col] ?? '—')}
                            </span>
                          ) : (
                            String(user[col] ?? '—')
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
          <p><strong>Total Users:</strong> {users.length}</p>
          <p className="mt-2 text-gray-600">
            Check browser console (F12 → Console tab) for detailed debug logs.
          </p>
        </div>
      </div>
    </div>
  )
}
