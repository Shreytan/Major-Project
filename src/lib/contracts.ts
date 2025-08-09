import { ethers } from 'ethers'
import { SmartContractConfig } from '@/types'

// Mock contract addresses - in a real app, these would be deployed contract addresses
export const CONTRACT_CONFIG: SmartContractConfig = {
  marketplaceAddress: '0x1234567890123456789012345678901234567890',
  dataTokenAddress: '0x0987654321098765432109876543210987654321',
  networkId: 1, // Ethereum Mainnet
  networkName: 'Ethereum Mainnet'
}

// Mock ABI for marketplace contract
export const MARKETPLACE_ABI = [
  'function listDataset(string memory title, string memory description, uint256 price) external',
  'function purchaseDataset(uint256 datasetId) external payable',
  'function getDataset(uint256 datasetId) external view returns (string memory, string memory, uint256, address, bool)',
  'function getDatasetCount() external view returns (uint256)',
  'function withdrawEarnings() external',
  'event DatasetListed(uint256 indexed datasetId, string title, address indexed seller, uint256 price)',
  'event DatasetPurchased(uint256 indexed datasetId, address indexed buyer, address indexed seller, uint256 price)'
]

// Mock ABI for data token contract
export const DATA_TOKEN_ABI = [
  'function mint(address to, uint256 amount) external',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)'
]

export class ContractManager {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private marketplaceContract: ethers.Contract | null = null
  private dataTokenContract: ethers.Contract | null = null

  constructor(provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner) {
    this.provider = provider
    this.signer = signer
    this.initializeContracts()
  }

  private initializeContracts() {
    if (!this.signer) return

    this.marketplaceContract = new ethers.Contract(
      CONTRACT_CONFIG.marketplaceAddress,
      MARKETPLACE_ABI,
      this.signer
    )

    this.dataTokenContract = new ethers.Contract(
      CONTRACT_CONFIG.dataTokenAddress,
      DATA_TOKEN_ABI,
      this.signer
    )
  }

  async listDataset(title: string, description: string, price: number): Promise<string> {
    if (!this.marketplaceContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const priceInWei = ethers.parseEther(price.toString())
      const tx = await this.marketplaceContract.listDataset(title, description, priceInWei)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (error) {
      console.error('Error listing dataset:', error)
      throw error
    }
  }

  async purchaseDataset(datasetId: number, price: number): Promise<string> {
    if (!this.marketplaceContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const priceInWei = ethers.parseEther(price.toString())
      const tx = await this.marketplaceContract.purchaseDataset(datasetId, {
        value: priceInWei
      })
      const receipt = await tx.wait()
      return receipt.hash
    } catch (error) {
      console.error('Error purchasing dataset:', error)
      throw error
    }
  }

  async getDataset(datasetId: number): Promise<any> {
    if (!this.marketplaceContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const dataset = await this.marketplaceContract.getDataset(datasetId)
      return {
        title: dataset[0],
        description: dataset[1],
        price: ethers.formatEther(dataset[2]),
        seller: dataset[3],
        isActive: dataset[4]
      }
    } catch (error) {
      console.error('Error getting dataset:', error)
      throw error
    }
  }

  async getDatasetCount(): Promise<number> {
    if (!this.marketplaceContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const count = await this.marketplaceContract.getDatasetCount()
      return Number(count)
    } catch (error) {
      console.error('Error getting dataset count:', error)
      throw error
    }
  }

  async withdrawEarnings(): Promise<string> {
    if (!this.marketplaceContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.marketplaceContract.withdrawEarnings()
      const receipt = await tx.wait()
      return receipt.hash
    } catch (error) {
      console.error('Error withdrawing earnings:', error)
      throw error
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.dataTokenContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const balance = await this.dataTokenContract.balanceOf(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
      throw error
    }
  }

  // Mock methods for demo purposes
  async getMockDatasets(): Promise<any[]> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return [
      {
        id: 1,
        title: 'E-commerce Customer Behavior Dataset',
        description: 'Comprehensive dataset containing customer purchase patterns and browsing behavior.',
        price: '0.5',
        seller: '0x1234...5678',
        isActive: true
      },
      {
        id: 2,
        title: 'Healthcare Patient Records (Anonymized)',
        description: 'Anonymized patient records dataset for medical research and AI training.',
        price: '1.2',
        seller: '0x8765...4321',
        isActive: true
      }
    ]
  }
}

export const createContractManager = (provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner): ContractManager => {
  return new ContractManager(provider, signer)
} 