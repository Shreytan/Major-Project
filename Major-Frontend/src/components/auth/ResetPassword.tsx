'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { confirmPasswordReset, verifyResetToken } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  
  useEffect(() => {
    // Verify the token when component mounts
    const checkToken = async () => {
      if (!token) {
        setIsTokenValid(false)
        return
      }
      
      try {
        const isValid = await verifyResetToken(token)
        setIsTokenValid(isValid)
        if (!isValid) {
          toast.error('Invalid or expired password reset link')
        }
      } catch (error) {
        console.error('Token verification error:', error)
        setIsTokenValid(false)
        toast.error('Failed to verify reset link')
      }
    }
    
    checkToken()
  }, [token, verifyResetToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (!token) {
      toast.error('Reset token is missing')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await confirmPasswordReset(token, password)
      setIsSuccess(true)
      toast.success('Password has been reset successfully')
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while verifying token
  if (isTokenValid === null) {
    return (
      <div className="w-full max-w-md mx-auto p-6 card fade-in">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  // Show error if token is invalid
  if (isTokenValid === false) {
    return (
      <div className="w-full max-w-md mx-auto p-6 card fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600">
            The password reset link is invalid or has expired.
          </p>
        </div>
        
        <div className="text-center">
          <Link 
            href="/forgot-password"
            className="btn-primary inline-block py-2 px-4 hover-lift"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    )
  }

  // Show success message after password reset
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-6 card fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Complete</h2>
          <p className="text-gray-600">
            Your password has been successfully reset.
          </p>
        </div>
        
        <div className="text-center">
          <Link 
            href="/login"
            className="btn-primary inline-block py-2 px-4 hover-lift"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Show password reset form
  return (
    <div className="w-full max-w-md mx-auto p-6 card fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              placeholder="Enter new password"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pl-10"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-2 px-4 hover-lift"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  )
}