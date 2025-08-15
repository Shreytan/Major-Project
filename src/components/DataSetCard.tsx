'use client'

import { useState } from 'react'
import { Star, Download, Eye, DollarSign, Clock, Tag, FileText } from 'lucide-react'
import { DataSet } from '@/types'
import toast from 'react-hot-toast'

interface DataSetCardProps {
  dataSet: DataSet
  onPurchase: (dataSet: DataSet) => void
  isConnected: boolean
}

export default function DataSetCard({ dataSet, onPurchase, isConnected }: DataSetCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      await onPurchase(dataSet)
      toast.success(`Successfully purchased ${dataSet.title}`)
    } catch (error) {
      toast.error('Purchase failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="card hover-lift hover-glow transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {dataSet.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {dataSet.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {dataSet.tags && dataSet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {dataSet.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover-lift"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {dataSet.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{dataSet.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 hover-lift">
            <Download className="w-4 h-4" />
            <span>{dataSet.downloads.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1 hover-lift">
            <Eye className="w-4 h-4" />
            <span>{dataSet.views.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1 hover-lift">
            <FileText className="w-4 h-4" />
            <span>{dataSet.fileSize}</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 text-yellow-500 hover-lift">
          <Star className="w-4 h-4 fill-current pulse" />
          <span className="font-medium">{dataSet.rating}</span>
        </div>
      </div>

      {/* Seller Info */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-2 hover-lift">
          <span className="text-gray-500">Seller:</span>
          <span className="font-mono text-gray-700">{dataSet.seller}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500 hover-lift">
          <Clock className="w-4 h-4" />
          <span>{formatDate(dataSet.createdAt)}</span>
        </div>
      </div>

      {/* Price and Action */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 hover-lift">
          <DollarSign className="w-4 h-4 text-primary-600 pulse" />
          <span className="font-semibold text-gray-900">{dataSet.price} ETH</span>
        </div>
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="btn-primary text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift hover-glow"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Purchase</span>
          )}
        </button>
      </div>
    </div>
  )
}