'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Upload, 
  ExternalLink,
  Copy
} from 'lucide-react'
import { Transaction } from '@/types'
import toast from 'react-hot-toast'

interface TransactionHistoryProps {
  transactions: Transaction[]
  onTransactionClick?: (transaction: Transaction) => void
}

export default function TransactionHistory({ transactions, onTransactionClick }: TransactionHistoryProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'purchase' | 'sale'>('all')

  const filteredTransactions = transactions.filter(tx => {
    if (selectedType === 'all') return true
    return tx.type === selectedType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'purchase' ? (
      <Download className="w-4 h-4 text-blue-500" />
    ) : (
      <Upload className="w-4 h-4 text-green-500" />
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-4 fade-in">
      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 slide-up">
        {[
          { id: 'all', label: 'All Transactions', count: transactions.length },
          { id: 'purchase', label: 'Purchases', count: transactions.filter(t => t.type === 'purchase').length },
          { id: 'sale', label: 'Sales', count: transactions.filter(t => t.type === 'sale').length }
        ].map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id as any)}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors hover-lift ${
              selectedType === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3 slide-up delay-100">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer hover-lift scale-in"
              onClick={() => onTransactionClick?.(transaction)}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="pulse">{getStatusIcon(transaction.status)}</div>
                  <div className="pulse">{getTypeIcon(transaction.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {transaction.dataSetTitle}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full pulse ${
                        transaction.type === 'purchase' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>
                        {transaction.type === 'purchase' ? 'From' : 'To'}: {shortenAddress(transaction.counterparty)}
                      </span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`font-semibold ${getStatusColor(transaction.status)}`}>
                      {transaction.amount} ETH
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {transaction.status}
                    </p>
                  </div>
                  
                  {transaction.txHash && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(transaction.txHash!)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 hover-lift"
                        title="Copy transaction hash"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${transaction.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-gray-600 hover-lift"
                        title="View on Etherscan"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 fade-in">
            <div className="text-gray-400 mb-4">
              <Clock className="w-12 h-12 mx-auto pulse" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 slide-up">No transactions found</h3>
            <p className="text-gray-600 slide-up delay-100">
              {selectedType === 'all' 
                ? 'You haven\'t made any transactions yet.'
                : `You haven't made any ${selectedType}s yet.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}