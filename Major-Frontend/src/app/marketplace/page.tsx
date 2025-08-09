'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Search, Star, Download, Eye, DollarSign } from 'lucide-react'
import { walletManager, WalletState } from '@/lib/wallet'
import toast from 'react-hot-toast'

interface DataSet {
  id: string
  title: string
  description: string
  price: number
  category: string
  rating: number
  downloads: number
  views: number
  seller: string
}

const mockDataSets: DataSet[] = [
  {
    id: '1',
    title: 'E-commerce Customer Behavior Dataset',
    description: 'Comprehensive dataset containing customer purchase patterns and browsing behavior.',
    price: 0.5,
    category: 'E-commerce',
    rating: 4.8,
    downloads: 1247,
    views: 5432,
    seller: '0x1234...5678'
  },
  {
    id: '2',
    title: 'Healthcare Patient Records (Anonymized)',
    description: 'Anonymized patient records dataset for medical research and AI training.',
    price: 1.2,
    category: 'Healthcare',
    rating: 4.9,
    downloads: 892,
    views: 3210,
    seller: '0x8765...4321'
  },
  {
    id: '3',
    title: 'Financial Market Trading Data',
    description: 'Real-time and historical trading data from major stock exchanges.',
    price: 0.8,
    category: 'Finance',
    rating: 4.7,
    downloads: 1563,
    views: 6789,
    seller: '0x9876...5432'
  }
]

export default function MarketplacePage() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDataSets, setFilteredDataSets] = useState<DataSet[]>(mockDataSets)

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

  const handlePurchase = async (dataSet: DataSet) => {
    if (!walletState.isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      toast.success(`Successfully purchased ${dataSet.title} for ${dataSet.price} ETH`)
    } catch (error) {
      toast.error('Purchase failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        isConnected={walletState.isConnected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        userAddress={walletState.address}
      />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Marketplace</h1>
            <p className="text-gray-600">Discover and purchase high-quality datasets</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDataSets.map((dataSet) => (
              <div key={dataSet.id} className="card hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {dataSet.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {dataSet.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{dataSet.downloads}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{dataSet.views}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{dataSet.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                    <span className="font-semibold text-gray-900">{dataSet.price} ETH</span>
                  </div>
                  <button
                    onClick={() => handlePurchase(dataSet)}
                    className="btn-primary text-sm"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 