import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

export interface WalletState {
  isConnected: boolean
  address: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
}

export class WalletManager {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  async connect(): Promise<WalletState> {
    try {
      // Detect MetaMask provider
      const ethereum = await detectEthereumProvider()
      
      if (!ethereum) {
        throw new Error('MetaMask not found! Please install MetaMask.')
      }

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found!')
      }

      const account = accounts[0] as string

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(ethereum)
      this.signer = await this.provider.getSigner()

      return {
        isConnected: true,
        address: account,
        provider: this.provider,
        signer: this.signer,
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  async disconnect(): Promise<WalletState> {
    this.provider = null
    this.signer = null

    return {
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not connected')
    }

    const balance = await this.provider.getBalance(address)
    return ethers.formatEther(balance)
  }

  async switchNetwork(chainId: string): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not connected')
    }

    try {
      await this.provider.send('wallet_switchEthereumChain', [
        { chainId },
      ])
    } catch (error: any) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        await this.addNetwork(chainId)
      } else {
        throw error
      }
    }
  }

  private async addNetwork(chainId: string): Promise<void> {
    const networkConfig = this.getNetworkConfig(chainId)
    
    await this.provider?.send('wallet_addEthereumChain', [
      networkConfig,
    ])
  }

  private getNetworkConfig(chainId: string) {
    const networks = {
      '0x1': {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io'],
      },
      '0x5': {
        chainId: '0x5',
        chainName: 'Goerli Testnet',
        nativeCurrency: {
          name: 'Goerli Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://goerli.infura.io/v3/'],
        blockExplorerUrls: ['https://goerli.etherscan.io'],
      },
      '0xaa36a7': {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: {
          name: 'Sepolia Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
      },
    }

    return networks[chainId as keyof typeof networks]
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer
  }
}

export const walletManager = new WalletManager() 