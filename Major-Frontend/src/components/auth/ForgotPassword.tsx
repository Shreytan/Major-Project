'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await resetPassword(email)
      setIsSubmitted(true)
      toast.success('Password reset instructions sent to your email')
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('Failed to send reset instructions. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 card fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent password reset instructions to <span className="font-medium">{email}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Didn't receive the email? Check your spam folder or
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-primary-600 hover:text-primary-700 ml-1"
            >
              try again
            </button>
          </p>
          
          <div className="text-center">
            <Link 
              href="/login"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 card fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="Enter your email"
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
              Sending...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
        
        <div className="text-center">
          <Link 
            href="/login"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  )
}