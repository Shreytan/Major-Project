'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function ConnectWallet() {
  const { connectWallet, isWalletConnected, walletAddress, isAuthenticated } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // If wallet is already connected and user is authenticated, redirect to dashboard
    if (isWalletConnected && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isWalletConnected, isAuthenticated, router])

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    setError('')
    
    try {
      await connectWallet()
      toast.success('Wallet connected successfully')
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      setError(error.message || 'Failed to connect wallet')
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 card fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Connect your Ethereum wallet to access the marketplace and manage your digital assets.
        </p>
      </div>

      {isWalletConnected ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Wallet Connected</h3>
              <p className="text-sm text-green-700 mt-1">
                Your wallet is connected with address: 
                <span className="font-mono break-all block mt-1">
                  {walletAddress}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <button
          onClick={handleConnectWallet}
          disabled={isConnecting || isWalletConnected}
          className={`w-full py-3 px-4 flex items-center justify-center space-x-2 rounded-lg font-medium transition-all ${isWalletConnected
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 hover-lift'
          }`}
        >
          {isConnecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : isWalletConnected ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Wallet Connected</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span>Connect MetaMask</span>
            </>
          )}
        </button>

        {isWalletConnected && (
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-secondary w-full py-3 px-4 hover-lift"
          >
            Continue to Dashboard
          </button>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have MetaMask installed?{' '}
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Download here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}