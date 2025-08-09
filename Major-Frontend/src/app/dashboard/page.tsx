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
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  type: 'purchase' | 'sale'
  dataSetTitle: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  counterparty: string
}

interface DataSet {
  id: string
  title: string
  description: string
  price: number
  downloads: number
  earnings: number
  status: 'active' | 'inactive'
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    dataSetTitle: 'E-commerce Customer Behavior Dataset',
    amount: 0.5,
    date: '2024-01-15',
    status: 'completed',
    counterparty: '0x1234...5678'
  },
  {
    id: '2',
    type: 'sale',
    dataSetTitle: 'Healthcare Patient Records',
    amount: 1.2,
    date: '2024-01-14',
    status: 'completed',
    counterparty: '0x8765...4321'
  },
  {
    id: '3',
    type: 'purchase',
    dataSetTitle: 'Financial Market Trading Data',
    amount: 0.8,
    date: '2024-01-13',
    status: 'pending',
    counterparty: '0x9876...5432'
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
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-8">Please connect your wallet to access your dashboard</p>
              <button onClick={handleConnect} className="btn-primary">
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your data assets and transactions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'purchases', label: 'My Purchases' },
                  { id: 'sales', label: 'My Sales' },
                  { id: 'settings', label: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {mockTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(transaction.status)}
                            <div>
                              <p className="font-medium text-gray-900">{transaction.dataSetTitle}</p>
                              <p className="text-sm text-gray-500">
                                {transaction.type === 'purchase' ? 'Purchased from' : 'Sold to'} {transaction.counterparty}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.amount} ETH
                            </p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Data Sets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockMyDataSets.map((dataSet) => (
                        <div key={dataSet.id} className="card">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{dataSet.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              dataSet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {dataSet.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{dataSet.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{dataSet.downloads} downloads</span>
                            <span className="font-medium text-gray-900">{dataSet.earnings} ETH earned</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'purchases' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
                  <div className="space-y-3">
                    {mockTransactions.filter(t => t.type === 'purchase').map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium text-gray-900">{transaction.dataSetTitle}</p>
                            <p className="text-sm text-gray-500">Purchased from {transaction.counterparty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.amount} ETH
                          </p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'sales' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales History</h3>
                  <div className="space-y-3">
                    {mockTransactions.filter(t => t.type === 'sale').map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium text-gray-900">{transaction.dataSetTitle}</p>
                            <p className="text-sm text-gray-500">Sold to {transaction.counterparty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.amount} ETH
                          </p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="card">
                      <h4 className="font-medium text-gray-900 mb-2">Wallet Address</h4>
                      <p className="text-sm text-gray-600 font-mono">{walletState.address}</p>
                    </div>
                    <div className="card">
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