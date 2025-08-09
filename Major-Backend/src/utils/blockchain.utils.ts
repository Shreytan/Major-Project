import { ethers } from 'ethers';
import { CryptoUtils } from './crypto.utils';

export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  blockNumber?: number;
  blockHash?: string;
  timestamp?: number;
}

export class BlockchainUtils {
  private static provider: ethers.JsonRpcProvider | null = null;

  /**
   * Initialize blockchain provider
   */
  static initializeProvider(networkUrl?: string): void {
    const rpcUrl = networkUrl || process.env.ETHEREUM_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Get blockchain provider
   */
  static getProvider(): ethers.JsonRpcProvider {
    if (!this.provider) {
      this.initializeProvider();
    }
    return this.provider!;
  }

  /**
   * Verify transaction on blockchain
   */
  static async verifyTransaction(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      if (!CryptoUtils.isValidTransactionHash(txHash)) {
        throw new Error('Invalid transaction hash format');
      }

      const provider = this.getProvider();
      const tx = await provider.getTransaction(txHash);
      
      if (!tx) {
        return null;
      }

      const receipt = await provider.getTransactionReceipt(txHash);
      
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || '',
        value: ethers.formatEther(tx.value),
        gasPrice: ethers.formatUnits(tx.gasPrice || 0, 'gwei'),
        gasLimit: tx.gasLimit.toString(),
        blockNumber: receipt?.blockNumber,
        blockHash: receipt?.blockHash,
        timestamp: tx.blockNumber ? (await provider.getBlock(tx.blockNumber))?.timestamp : undefined
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return null;
    }
  }

  /**
   * Get transaction status
   */
  static async getTransactionStatus(txHash: string): Promise<'pending' | 'success' | 'failed' | 'not_found'> {
    try {
      const provider = this.getProvider();
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        // Check if transaction exists but is pending
        const tx = await provider.getTransaction(txHash);
        return tx ? 'pending' : 'not_found';
      }
      
      return receipt.status === 1 ? 'success' : 'failed';
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return 'not_found';
    }
  }

  /**
   * Calculate gas fee from transaction
   */
  static async calculateGasFee(txHash: string): Promise<string | null> {
    try {
      const provider = this.getProvider();
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt || !receipt.gasUsed) {
        return null;
      }

      const tx = await provider.getTransaction(txHash);
      if (!tx || !tx.gasPrice) {
        return null;
      }

      const gasFee = receipt.gasUsed * tx.gasPrice;
      return ethers.formatEther(gasFee);
    } catch (error) {
      console.error('Error calculating gas fee:', error);
      return null;
    }
  }

  /**
   * Get current gas prices
   */
  static async getCurrentGasPrices(): Promise<{
    slow: string;
    standard: string;
    fast: string;
  } | null> {
    try {
      const provider = this.getProvider();
      const gasPrice = await provider.getFeeData();
      
      if (!gasPrice.gasPrice) {
        return null;
      }

      const baseGas = gasPrice.gasPrice;
      
      return {
        slow: ethers.formatUnits(baseGas * BigInt(80) / BigInt(100), 'gwei'),
        standard: ethers.formatUnits(baseGas, 'gwei'),
        fast: ethers.formatUnits(baseGas * BigInt(120) / BigInt(100), 'gwei')
      };
    } catch (error) {
      console.error('Error getting gas prices:', error);
      return null;
    }
  }

  /**
   * Validate Ethereum address format
   */
  static isValidAddress(address: string): boolean {
    return CryptoUtils.isValidEthereumAddress(address);
  }

  /**
   * Convert Wei to ETH
   */
  static weiToEth(wei: string | bigint): string {
    return ethers.formatEther(wei);
  }

  /**
   * Convert ETH to Wei
   */
  static ethToWei(eth: string | number): string {
    return ethers.parseEther(eth.toString()).toString();
  }

  /**
   * Get network information
   */
  static async getNetworkInfo(): Promise<{
    chainId: number;
    name: string;
    blockNumber: number;
  } | null> {
    try {
      const provider = this.getProvider();
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      
      return {
        chainId: Number(network.chainId),
        name: network.name,
        blockNumber
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      return null;
    }
  }
}

// Initialize provider on module load
BlockchainUtils.initializeProvider();
