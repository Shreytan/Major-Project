'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { 
  Download, 
  Upload, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings
} from 'lucide-react'
import { walletManager, WalletState } from '@/lib/wallet'
import { Transaction, DataSet } from '@/types'
import TransactionHistory from '@/components/TransactionHistory'
import toast from 'react-hot-toast'



const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    dataSetTitle: 'E-commerce Customer Behavior Dataset',
    amount: 0.5,
    date: '2024-01-15',
    status: 'completed',
    counterparty: '0x1234...5678',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: '2',
    type: 'sale',
    dataSetTitle: 'Healthcare Patient Records',
    amount: 1.2,
    date: '2024-01-14',
    status: 'completed',
    counterparty: '0x8765...4321',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: '3',
    type: 'purchase',
    dataSetTitle: 'Financial Market Trading Data',
    amount: 0.8,
    date: '2024-01-13',
    status: 'pending',
    counterparty: '0x9876...5432'
  },
  {
    id: '4',
    type: 'sale',
    dataSetTitle: 'IoT Sensor Data Collection',
    amount: 0.3,
    date: '2024-01-12',
    status: 'completed',
    counterparty: '0x5432...8765',
    txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba'
  },
  {
    id: '5',
    type: 'purchase',
    dataSetTitle: 'Social Media Sentiment Analysis',
    amount: 0.6,
    date: '2024-01-11',
    status: 'failed',
    counterparty: '0x6543...9876'
  }
]

const mockMyDataSets: DataSet[] = [
  {
    id: '1',
    title: 'Healthcare Patient Records',
    description: 'Anonymized patient records dataset for medical research.',
    price: 1.2,
    downloads: 892,
    earnings: 1.2,
    status: 'active'
  },
  {
    id: '2',
    title: 'IoT Sensor Data Collection',
    description: 'Sensor data from various IoT devices.',
    price: 0.6,
    downloads: 756,
    earnings: 0.6,
    status: 'active'
  }
]

export default function DashboardPage() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'purchases' | 'sales' | 'settings'>('overview')

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

  const stats = [
    { label: 'Total Purchases', value: '12', icon: Download, color: 'text-blue-600' },
    { label: 'Total Sales', value: '8', icon: Upload, color: 'text-green-600' },
    { label: 'Total Earnings', value: '5.2 ETH', icon: DollarSign, color: 'text-yellow-600' },
    { label: 'Active Listings', value: '3', icon: BarChart3, color: 'text-purple-600' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation
          isConnected={walletState.isConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          userAddress={walletState.address || undefined}
        />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12 fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 slide-up">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-8 slide-up delay-100">Please connect your wallet to access your dashboard</p>
              <button onClick={handleConnect} className="btn-primary hover-lift pulse delay-200">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
             <Navigation
         isConnected={walletState.isConnected}
         onConnect={handleConnect}
         onDisconnect={handleDisconnect}
         userAddress={walletState.address || undefined}
       />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 slide-up">Dashboard</h1>
            <p className="text-gray-600 slide-up delay-100">Manage your data assets and transactions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in delay-200">
            {stats.map((stat, index) => (
              <div key={index} className="card hover-lift scale-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-gray-100 ${stat.color} pulse`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 fade-in delay-300">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'purchases', label: 'My Purchases' },
                  { id: 'sales', label: 'My Sales' },
                  { id: 'settings', label: 'Settings' }
                ].map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm hover-lift ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 slide-in-left">Recent Transactions</h3>
                    <TransactionHistory 
                      transactions={mockTransactions.slice(0, 5)} 
                      onTransactionClick={(transaction) => {
                        console.log('Transaction clicked:', transaction)
                        // Could open a modal with transaction details
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 slide-in-right">My Data Sets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockMyDataSets.map((dataSet, index) => (
                        <div key={dataSet.id} className="card hover-lift scale-in" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{dataSet.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full pulse ${
                              dataSet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {dataSet.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{dataSet.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 hover-lift">{dataSet.downloads} downloads</span>
                            <span className="font-medium text-gray-900 hover-lift">{dataSet.earnings} ETH earned</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'purchases' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 slide-in-left">Purchase History</h3>
                  <TransactionHistory 
                    transactions={mockTransactions.filter(t => t.type === 'purchase')}
                  />
                </div>
              )}

              {activeTab === 'sales' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 slide-in-left">Sales History</h3>
                  <TransactionHistory 
                    transactions={mockTransactions.filter(t => t.type === 'sale')}
                  />
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 slide-in-left">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="card hover-lift slide-in-right delay-100">
                      <h4 className="font-medium text-gray-900 mb-2">Wallet Address</h4>
                      <p className="text-sm text-gray-600 font-mono">{walletState.address}</p>
                    </div>
                    <div className="card hover-lift slide-in-right delay-200">
                      <h4 className="font-medium text-gray-900 mb-2">Network Settings</h4>
                      <p className="text-sm text-gray-600">Currently connected to Ethereum Mainnet</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}