// src/server.ts

import app from './app';
import { connectDatabase } from '@/config/database';
import dotenv from 'dotenv';

dotenv.config();
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
}

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDatabase();
    console.log('✅ Database connected successfully');

   app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 Health check available at /health`);
  console.log(`📡 API Base URL: ${process.env.API_PREFIX || '/api/v1'}`);
});

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();
