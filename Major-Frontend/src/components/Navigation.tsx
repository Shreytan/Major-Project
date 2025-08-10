'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wallet, Menu, X, User, Database, Home, LogIn, UserPlus, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface NavigationProps {
  isConnected?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  userAddress?: string
}

export default function Navigation({ 
  isConnected: propIsConnected, 
  onConnect: propOnConnect, 
  onDisconnect: propOnDisconnect, 
  userAddress: propUserAddress 
}: NavigationProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  
  // Use values from AuthContext if available, otherwise use props
  const { 
    isAuthenticated, 
    isWalletConnected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet,
    logout,
    user
  } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleConnect = async () => {
    try {
      // Use context method if available, otherwise use prop
      if (connectWallet) {
        await connectWallet()
      } else if (propOnConnect) {
        await propOnConnect()
      }
      toast.success('Wallet connected successfully!')
    } catch (error) {
      toast.error('Failed to connect wallet')
    }
  }

  const handleDisconnect = () => {
    // Use context method if available, otherwise use prop
    if (disconnectWallet) {
      disconnectWallet()
    } else if (propOnDisconnect) {
      propOnDisconnect()
    }
    toast.success('Wallet disconnected')
  }
  
  const handleLogout = () => {
    if (logout) {
      logout()
      toast.success('Logged out successfully')
      router.push('/')
    }
  }
  
  // Determine if wallet is connected using context or props
  const isWalletActive = isWalletConnected || propIsConnected
  // Use wallet address from context or props
  const activeWalletAddress = walletAddress || propUserAddress || ''

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-lift">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center pulse">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BlockMarketAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 fade-in">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors hover-lift">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-primary-600 transition-colors hover-lift">
              Marketplace
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors hover-lift">
              Dashboard
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors hover-lift">
              About
            </Link>
          </div>

          {/* Authentication & Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4 fade-in">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 slide-in-right">
                {/* Profile Link */}
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover-lift"
                >
                  <User className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username || 'Profile'}
                  </span>
                </Link>
                
                {/* Wallet Status */}
                {isWalletActive && (
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover-lift">
                    <Wallet className="w-4 h-4 text-primary-600 pulse" />
                    <span className="text-sm font-medium text-gray-700">
                      {shortenAddress(activeWalletAddress)}
                    </span>
                  </div>
                )}
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm hover-lift flex items-center space-x-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 slide-in-right">
                <Link 
                  href="/login"
                  className="btn-secondary flex items-center space-x-2 hover-lift"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                
                <Link 
                  href="/signup"
                  className="btn-primary flex items-center space-x-2 hover-lift"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
            
            {/* Wallet Connect/Disconnect (only show if authenticated) */}
            {isAuthenticated && (
              <div>
                {isWalletActive ? (
                  <button
                    onClick={handleDisconnect}
                    className="btn-secondary text-sm hover-lift"
                  >
                    Disconnect Wallet
                  </button>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="btn-primary flex items-center space-x-2 slide-in-right hover-lift"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors hover-lift"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                href="/"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors slide-in-left delay-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/marketplace"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors slide-in-left delay-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors slide-in-left delay-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors slide-in-left delay-400"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Authentication & Wallet Connection */}
              <div className="pt-4 border-t border-gray-200 slide-up delay-500">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {/* Profile Link */}
                    <Link 
                      href="/profile" 
                      className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover-lift"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {user?.username || 'Profile'}
                      </span>
                    </Link>
                    
                    {/* Wallet Status */}
                    {isWalletActive && (
                      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover-lift">
                        <Wallet className="w-4 h-4 text-primary-600 pulse" />
                        <span className="text-sm font-medium text-gray-700">
                          {shortenAddress(activeWalletAddress)}
                        </span>
                      </div>
                    )}
                    
                    {/* Wallet Connect/Disconnect */}
                    {isWalletActive ? (
                      <button
                        onClick={() => {
                          handleDisconnect()
                          setIsMenuOpen(false)
                        }}
                        className="w-full btn-secondary text-sm hover-lift"
                      >
                        Disconnect Wallet
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleConnect()
                          setIsMenuOpen(false)
                        }}
                        className="w-full btn-primary flex items-center justify-center space-x-2 hover-lift"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Connect Wallet</span>
                      </button>
                    )}
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full btn-secondary text-sm hover-lift flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/login"
                      className="w-full btn-secondary flex items-center justify-center space-x-2 hover-lift"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    
                    <Link 
                      href="/signup"
                      className="w-full btn-primary flex items-center justify-center space-x-2 hover-lift"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}