import crypto from 'crypto';
import { ethers } from 'ethers';

export class CryptoUtils {
  /**
   * Generate random string
   */
  static generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate UUID v4
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Hash string using SHA256
   */
  static hashString(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Validate Ethereum wallet address
   */
  static isValidEthereumAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate Ethereum transaction hash
   */
  static isValidTransactionHash(hash: string): boolean {
    const regex = /^0x[a-fA-F0-9]{64}$/;
    return regex.test(hash);
  }

  /**
   * Format Ethereum address for display
   */
  static formatEthereumAddress(address: string): string {
    if (!this.isValidEthereumAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Convert Wei to ETH
   */
  static weiToEth(wei: string | number): string {
    return ethers.formatEther(wei.toString());
  }

  /**
   * Convert ETH to Wei
   */
  static ethToWei(eth: string | number): string {
    return ethers.parseEther(eth.toString()).toString();
  }

  /**
   * Generate file hash for integrity verification
   */
  static generateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Encrypt sensitive data
   */
  static encrypt(text: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const keyBuffer = crypto.pbkdf2Sync(key, 'salt', 100000, 32, 'sha256');
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedText: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedData = textParts.join(':');
    const keyBuffer = crypto.pbkdf2Sync(key, 'salt', 100000, 32, 'sha256');
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
