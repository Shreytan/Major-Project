'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { 
  Shield, 
  Database, 
  Zap, 
  Users, 
  TrendingUp, 
  Lock,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { walletManager, WalletState } from '@/lib/wallet'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
  })

  const handleConnect = async () => {
    try {
      const newState = await walletManager.connect()
      setWalletState(newState)
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      const newState = await walletManager.disconnect()
      setWalletState(newState)
    } catch (error) {
      console.error('Disconnection error:', error)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'End-to-end encryption and blockchain-based verification for all data transactions.',
    },
    {
      icon: Database,
      title: 'Tokenized Data',
      description: 'Trade data assets via smart contracts with full ownership control.',
    },
    {
      icon: Users,
      title: 'Decentralized Network',
      description: 'No central authority - data is stored securely across distributed nodes.',
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Integrated with MetaMask for seamless crypto payments and transactions.',
    },
    {
      icon: TrendingUp,
      title: 'Market Analytics',
      description: 'Real-time market data and analytics for informed trading decisions.',
    },
    {
      icon: Lock,
      title: 'Privacy Control',
      description: 'Complete control over data sharing with advanced privacy features.',
    },
  ]

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Data Sets', value: '50K+' },
    { label: 'Transactions', value: '100K+' },
    { label: 'Total Volume', value: '$2M+' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation
        isConnected={walletState.isConnected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        userAddress={walletState.address}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Decentralized
              <span className="text-primary-600 block">Data Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A blockchain-powered platform for secure data sharing and tokenization. 
              Buy, sell, and trade datasets with complete ownership control and privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2">
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={handleConnect}
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BlockMarketAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of data trading with our cutting-edge blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Trading Data?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already monetizing their data assets 
            in a secure, decentralized marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BlockMarketAI</span>
              </div>
              <p className="text-gray-400">
                The future of decentralized data trading.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BlockMarketAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 