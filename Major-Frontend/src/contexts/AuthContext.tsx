'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { WalletState } from '@/lib/wallet'
import { UserProfile } from '@/types'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  walletState: WalletState
  isWalletConnected: boolean
  walletAddress: string | null
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  resetPassword: (email: string) => Promise<void>
  verifyResetToken: (token: string) => Promise<boolean>
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
  walletManager?: any
}

export function AuthProvider({ children, walletManager }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
  })
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if user is logged in via localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser) as UserProfile
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string, remember: boolean = false) => {
    setIsLoading(true)
    try {
      // Get stored users from localStorage
      const storedUsers = localStorage.getItem('registeredUsers')
      const users = storedUsers ? JSON.parse(storedUsers) : {}
      
      // Check if user exists and password matches
      if (!users[email]) {
        throw new Error('User not found. Please sign up first.')
      }
      
      if (users[email].password !== password) {
        throw new Error('Invalid password. Please try again.')
      }
      
      // Create user profile from stored data
      const mockUser: UserProfile = {
        address: users[email].address || '0x0000000000000000000000000000000000000000',
        username: users[email].username,
        email: email,
        totalEarnings: users[email].totalEarnings || 0,
        totalPurchases: users[email].totalPurchases || 0,
        totalSales: users[email].totalSales || 0,
        joinDate: users[email].joinDate,
      }

      // Store current user session in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      setUser(mockUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, username: string, password: string) => {
    setIsLoading(true)
    try {
      // Get existing users from localStorage
      const storedUsers = localStorage.getItem('registeredUsers')
      const users = storedUsers ? JSON.parse(storedUsers) : {}
      
      // Check if user already exists
      if (users[email]) {
        throw new Error('User with this email already exists. Please log in instead.')
      }
      
      // Create new user data
      const userData = {
        username: username,
        password: password, // In a real app, this would be hashed
        address: '0x0000000000000000000000000000000000000000',
        totalEarnings: 0,
        totalPurchases: 0,
        totalSales: 0,
        joinDate: new Date().toISOString(),
      }
      
      // Store user credentials
      users[email] = userData
      localStorage.setItem('registeredUsers', JSON.stringify(users))
      
      // Create user profile for current session
      const mockUser: UserProfile = {
        address: userData.address,
        username: username,
        email: email,
        totalEarnings: userData.totalEarnings,
        totalPurchases: userData.totalPurchases,
        totalSales: userData.totalSales,
        joinDate: userData.joinDate,
      }

      // Store current user session in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      setUser(mockUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user')
    
    setUser(null)
    setIsAuthenticated(false)
    
    // Also disconnect wallet if connected
    if (walletState.isConnected) {
      disconnectWallet()
    }
    
    // Redirect to home page
    router.push('/')
  }
  
  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful password reset request
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, your backend would send a reset email with a token
      console.log(`Password reset requested for ${email}`)
      return Promise.resolve()
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Verify reset token function
  const verifyResetToken = async (token: string) => {
    try {
      // In a real app, you would make an API call to your backend to verify the token
      // For demo purposes, we'll simulate a valid token
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // For demo purposes, consider any token valid
      return true
    } catch (error) {
      console.error('Verify token error:', error)
      return false
    }
  }

  // Confirm password reset function
  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful password reset
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(`Password reset confirmed with token ${token}`)
      return Promise.resolve()
    } catch (error) {
      console.error('Confirm reset error:', error)
      throw error
    }
  }

  const connectWallet = async () => {
    try {
      // Import walletManager dynamically to avoid SSR issues
      const { walletManager: wm } = await import('@/lib/wallet')
      const newState = await wm.connect()
      setWalletState(newState)
      
      // If user is authenticated, update their wallet address
      if (isAuthenticated && user) {
        const updatedUser = { ...user, address: newState.address || '' }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return newState
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    }
  }

  const disconnectWallet = async () => {
    try {
      // Import walletManager dynamically to avoid SSR issues
      const { walletManager: wm } = await import('@/lib/wallet')
      const newState = await wm.disconnect()
      setWalletState(newState)
      
      // If user is authenticated, update their wallet address
      if (isAuthenticated && user) {
        const updatedUser = { ...user, address: null }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return newState
    } catch (error) {
      console.error('Wallet disconnection error:', error)
      throw error
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    walletState,
    isWalletConnected: walletState.isConnected,
    walletAddress: walletState.address,
    login,
    signup,
    logout,
    resetPassword,
    verifyResetToken,
    confirmPasswordReset,
    connectWallet,
    disconnectWallet,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}