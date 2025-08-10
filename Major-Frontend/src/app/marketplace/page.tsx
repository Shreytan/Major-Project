'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Search } from 'lucide-react'
import { walletManager, WalletState } from '@/lib/wallet'
import { DataSet, MarketplaceFilters } from '@/types'
import DataSetCard from '@/components/DataSetCard'
import MarketplaceFiltersComponent from '@/components/MarketplaceFilters'
import UploadDataSet from '@/components/UploadDataSet'
import toast from 'react-hot-toast'

const mockDataSets: DataSet[] = [
  {
    id: '1',
    title: 'E-commerce Customer Behavior Dataset',
    description: 'Comprehensive dataset containing customer purchase patterns, browsing behavior, and transaction history from a major e-commerce platform.',
    price: 0.5,
    category: 'E-commerce',
    rating: 4.8,
    downloads: 1247,
    views: 5432,
    seller: '0x1234...5678',
    createdAt: '2024-01-15',
    fileSize: '2.3 GB',
    tags: ['customer-behavior', 'e-commerce', 'analytics']
  },
  {
    id: '2',
    title: 'Healthcare Patient Records (Anonymized)',
    description: 'Anonymized patient records dataset for medical research and AI training. Includes demographics, diagnoses, and treatment outcomes.',
    price: 1.2,
    category: 'Healthcare',
    rating: 4.9,
    downloads: 892,
    views: 3210,
    seller: '0x8765...4321',
    createdAt: '2024-01-14',
    fileSize: '1.8 GB',
    tags: ['healthcare', 'medical', 'anonymized']
  },
  {
    id: '3',
    title: 'Financial Market Trading Data',
    description: 'Real-time and historical trading data from major stock exchanges including price movements, volume, and market indicators.',
    price: 0.8,
    category: 'Finance',
    rating: 4.7,
    downloads: 1563,
    views: 6789,
    seller: '0x9876...5432',
    createdAt: '2024-01-13',
    fileSize: '4.1 GB',
    tags: ['finance', 'trading', 'market-data']
  },
  {
    id: '4',
    title: 'IoT Sensor Data Collection',
    description: 'Sensor data from various IoT devices including temperature, humidity, motion, and environmental readings.',
    price: 0.3,
    category: 'Technology',
    rating: 4.5,
    downloads: 756,
    views: 2341,
    seller: '0x5432...8765',
    createdAt: '2024-01-12',
    fileSize: '856 MB',
    tags: ['iot', 'sensors', 'environmental']
  },
  {
    id: '5',
    title: 'Social Media Sentiment Analysis',
    description: 'Large-scale sentiment analysis dataset from social media platforms with labeled emotional content.',
    price: 0.6,
    category: 'Technology',
    rating: 4.6,
    downloads: 1023,
    views: 4123,
    seller: '0x6543...9876',
    createdAt: '2024-01-11',
    fileSize: '1.2 GB',
    tags: ['sentiment', 'social-media', 'nlp']
  },
  {
    id: '6',
    title: 'Transportation Traffic Patterns',
    description: 'Urban traffic data including vehicle counts, congestion patterns, and route optimization metrics.',
    price: 0.4,
    category: 'Transportation',
    rating: 4.4,
    downloads: 634,
    views: 1892,
    seller: '0x7654...1234',
    createdAt: '2024-01-10',
    fileSize: '1.5 GB',
    tags: ['transportation', 'traffic', 'urban-planning']
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
  const [dataSets, setDataSets] = useState<DataSet[]>(mockDataSets)
  const [filteredDataSets, setFilteredDataSets] = useState<DataSet[]>(mockDataSets)
  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: '',
    priceRange: [0, 10],
    rating: 0,
    sortBy: 'date',
    sortOrder: 'desc'
  })

  const categories = Array.from(new Set(mockDataSets.map(ds => ds.category)))

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
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Successfully purchased ${dataSet.title} for ${dataSet.price} ETH`)
    } catch (error) {
      toast.error('Purchase failed. Please try again.')
    }
  }

  const handleUpload = async (dataSetData: Omit<DataSet, 'id' | 'downloads' | 'views' | 'rating' | 'createdAt'>) => {
    const newDataSet: DataSet = {
      ...dataSetData,
      id: (dataSets.length + 1).toString(),
      downloads: 0,
      views: 0,
      rating: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setDataSets([newDataSet, ...dataSets])
    setFilteredDataSets([newDataSet, ...filteredDataSets])
  }

  // Filter and sort datasets
  useEffect(() => {
    let filtered = dataSets.filter(dataSet => {
      const matchesSearch = dataSet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dataSet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dataSet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = !filters.category || dataSet.category === filters.category
      const matchesPrice = dataSet.price >= filters.priceRange[0] && dataSet.price <= filters.priceRange[1]
      const matchesRating = dataSet.rating >= filters.rating
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })

    // Sort datasets
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sortBy) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'downloads':
          aValue = a.downloads
          bValue = b.downloads
          break
        case 'date':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    setFilteredDataSets(filtered)
  }, [dataSets, searchTerm, filters])

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
          <div className="flex items-center justify-between mb-8 fade-in">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 slide-up">Data Marketplace</h1>
              <p className="text-gray-600 slide-up delay-100">Discover and purchase high-quality datasets</p>
            </div>
            <div className="slide-in-right">
              <UploadDataSet onUpload={handleUpload} isConnected={walletState.isConnected} />
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 slide-up delay-200 hover-lift">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pulse" />
              <input
                type="text"
                placeholder="Search datasets by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="slide-up delay-300">
            <MarketplaceFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />
          </div>

          {/* Results Count */}
          <div className="mb-6 fade-in delay-400">
            <p className="text-gray-600">
              Showing {filteredDataSets.length} of {dataSets.length} datasets
            </p>
          </div>

          {/* Datasets Grid */}
          {filteredDataSets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDataSets.map((dataSet, index) => (
                <div key={dataSet.id} className={`scale-in delay-${(index % 5) * 100}`}>
                  <DataSetCard
                    dataSet={dataSet}
                    onPurchase={handlePurchase}
                    isConnected={walletState.isConnected}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 fade-in">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto bounce" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 slide-up delay-100">No datasets found</h3>
              <p className="text-gray-600 slide-up delay-200">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}