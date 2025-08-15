'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { 
  Shield, 
  Database, 
  Zap, 
  Users, 
  TrendingUp, 
  Lock,
  Globe,
  Code,
  Award
} from 'lucide-react'
import { walletManager, WalletState } from '@/lib/wallet'

export default function AboutPage() {
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
      title: 'Secure & Private',
      description: 'End-to-end encryption ensures your data remains secure and private throughout all transactions.',
    },
    {
      icon: Database,
      title: 'Tokenized Assets',
      description: 'Data is tokenized on the blockchain, providing true ownership and transferability.',
    },
    {
      icon: Users,
      title: 'Decentralized',
      description: 'No central authority controls your data. You maintain complete ownership and control.',
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Smart contracts enable instant, trustless payments in cryptocurrency.',
    },
    {
      icon: TrendingUp,
      title: 'Market Analytics',
      description: 'Real-time market data and analytics help you make informed trading decisions.',
    },
    {
      icon: Lock,
      title: 'Privacy Control',
      description: 'Advanced privacy features give you complete control over data sharing.',
    },
  ]

  const team = [
    {
      name: 'Shreyansh Shukla',
      role: 'Team Leader - Full Stack & Blockchain',
      description: 'Leading the development of the blockchain infrastructure and smart contracts.',
    },
    {
      name: 'Akash Singh',
      role: 'Authentication & User Flow',
      description: 'Responsible for user authentication and seamless user experience.',
    },
    {
      name: 'Purushottam Pandey',
      role: 'Dashboard & Data Management',
      description: 'Building the data management system and user dashboard.',
    },
    {
      name: 'Shivansh Mishra',
      role: 'UI/UX & Responsive Design',
      description: 'Creating beautiful, intuitive user interfaces and responsive designs.',
    },
    {
      name: 'Harshit Dwivedi',
      role: 'Routing & Frontend Components',
      description: 'Developing frontend components and application routing.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation
        isConnected={walletState.isConnected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        userAddress={walletState.address || undefined}
      />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 slide-up">
              About BlockMarketAI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto slide-up delay-100">
              We're building the future of decentralized data trading, where individuals and organizations 
              can securely buy, sell, and trade data assets with complete ownership control.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16 fade-in delay-200">
            <div className="card hover-lift">
              <div className="text-center">
                <Globe className="w-16 h-16 text-primary-600 mx-auto mb-6 pulse" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4 slide-up">Our Mission</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto slide-up delay-100">
                  To democratize data access and create a fair, transparent marketplace where data owners 
                  can monetize their assets while buyers can access high-quality datasets for research, 
                  AI training, and business intelligence.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16 fade-in delay-300">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 slide-up">
              Why Choose BlockMarketAI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`card hover:shadow-lg transition-shadow duration-300 hover-lift fade-in ${index < 6 ? `delay-${(index + 1) * 100}` : ''} ${index % 3 === 0 ? 'slide-in-left' : index % 3 === 2 ? 'slide-in-right' : 'slide-up'}`}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600 pulse" />
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
          </section>

          {/* Technology Section */}
          <section className="mb-16 fade-in delay-400">
            <div className="card hover-lift">
              <div className="text-center mb-8">
                <Code className="w-16 h-16 text-primary-600 mx-auto mb-6 pulse" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4 slide-up">Technology Stack</h2>
                <p className="text-lg text-gray-600 slide-up delay-100">
                  Built with cutting-edge blockchain and web technologies
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center fade-in delay-100 scale-in">
                  <h3 className="font-semibold text-gray-900 mb-2 hover-lift">Frontend</h3>
                  <p className="text-gray-600">React.js, Next.js, Tailwind CSS</p>
                </div>
                <div className="text-center fade-in delay-200 scale-in">
                  <h3 className="font-semibold text-gray-900 mb-2 hover-lift">Blockchain</h3>
                  <p className="text-gray-600">Ethereum, Solidity, Web3.js</p>
                </div>
                <div className="text-center fade-in delay-300 scale-in">
                  <h3 className="font-semibold text-gray-900 mb-2 hover-lift">Backend</h3>
                  <p className="text-gray-600">Node.js, Express.js, MongoDB</p>
                </div>
                <div className="text-center fade-in delay-400 scale-in">
                  <h3 className="font-semibold text-gray-900 mb-2 hover-lift">Security</h3>
                  <p className="text-gray-600">End-to-end encryption, MetaMask</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16 fade-in delay-500">
            <div className="text-center mb-12">
              <Award className="w-16 h-16 text-primary-600 mx-auto mb-6 pulse" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4 slide-up">Our Team</h2>
              <p className="text-lg text-gray-600 slide-up delay-100">
                Meet the talented developers behind BlockMarketAI
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className={`card text-center hover-lift fade-in ${index < 6 ? `delay-${(index + 1) * 100}` : ''} ${index % 3 === 0 ? 'slide-in-left' : index % 3 === 2 ? 'slide-in-right' : 'slide-up'}`}
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-600 pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center fade-in delay-600">
            <div className="card bg-primary-600 text-white hover-glow">
              <h2 className="text-3xl font-bold mb-4 slide-up">Ready to Get Started?</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto slide-up delay-100">
                Join thousands of users who are already trading data assets in our secure, 
                decentralized marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleConnect}
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 hover-lift fade-in delay-200"
                >
                  Connect Wallet
                </button>
                <a
                  href="/marketplace"
                  className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 hover-lift fade-in delay-300"
                >
                  Explore Marketplace
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}