export interface WalletState {
  isConnected: boolean
  address: string | null
  provider: any | null
  signer: any | null
}

export interface DataSet {
  id: string
  title: string
  description: string
  price: number
  downloads: number
  earnings?: number
  status: string
  category?: string
  rating?: number
  views?: number
  seller?: string
  createdAt?: string
  updatedAt?: string
}

export interface Transaction {
  id: string
  type: 'purchase' | 'sale'
  dataSetTitle: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  counterparty: string
  txHash?: string
}

export interface UserProfile {
  address: string
  username?: string
  email?: string
  avatar?: string
  totalEarnings: number
  totalPurchases: number
  totalSales: number
  joinDate: string
}

export interface MarketplaceFilters {
  category: string
  priceRange: [number, number]
  rating: number
  sortBy: 'price' | 'rating' | 'date' | 'downloads'
  sortOrder: 'asc' | 'desc'
}

export interface SmartContractConfig {
  marketplaceAddress: string
  dataTokenAddress: string
  networkId: number
  networkName: string
} 
