'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserProfile from '@/components/auth/UserProfile'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const { isAuthenticated, isLoading, connectWallet, disconnectWallet, isWalletConnected, walletAddress } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Don't render the profile if not authenticated and being redirected
  if (!isAuthenticated && !isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        isConnected={isWalletConnected}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        userAddress={walletAddress || ''}
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Your Profile
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <UserProfile />
          )}
        </div>
      </div>
    </div>
  )
}