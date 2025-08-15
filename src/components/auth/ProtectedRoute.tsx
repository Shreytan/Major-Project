'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireWallet?: boolean
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireWallet = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isWalletConnected, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait until authentication state is determined
    if (isLoading) return

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push('/login')
      return
    }

    // If wallet connection is required but wallet is not connected
    if (requireWallet && !isWalletConnected) {
      router.push('/connect-wallet')
      return
    }
  }, [isAuthenticated, isWalletConnected, isLoading, requireAuth, requireWallet, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If authentication requirements are met, render children
  if (
    (!requireAuth || isAuthenticated) &&
    (!requireWallet || isWalletConnected)
  ) {
    return <>{children}</>
  }

  // This should not be visible as the useEffect should redirect,
  // but it's here as a fallback
  return null
}