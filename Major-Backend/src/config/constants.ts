export const API_CONFIG = {
  VERSION: '1.0.0',
  PREFIX: process.env.API_PREFIX || '/api/v1',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/blockmarketai',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // File Upload
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '100mb',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  
  // Blockchain
  ETHEREUM_NETWORK: process.env.ETHEREUM_NETWORK || 'sepolia',
  ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
  INFURA_API_KEY: process.env.INFURA_API_KEY || '',
};

export const ALLOWED_FILE_TYPES = [
  'text/csv',
  'application/json',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
  'application/zip',
  'application/sql',
  'application/xml',
  'text/xml'
];

export const DATASET_CATEGORIES = [
  'Healthcare',
  'Finance',
  'E-commerce',
  'Technology',
  'Education',
  'Marketing',
  'Social Media',
  'IoT',
  'Transportation',
  'Entertainment',
  'Sports',
  'Government',
  'Other'
];
