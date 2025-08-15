'use client'

import Link from 'next/link'
import ConnectWallet from '@/components/auth/ConnectWallet'

export default function ConnectWalletPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-center text-primary-600">Decentralized</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect Your Wallet
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect your Ethereum wallet to access all features
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <ConnectWallet />
      </div>
    </div>
  )
}