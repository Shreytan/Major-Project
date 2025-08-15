'use client'

import { useState } from 'react'
import { Upload, FileText, DollarSign, Tag, X, Plus } from 'lucide-react'
import { DataSet } from '@/types'
import toast from 'react-hot-toast'

interface UploadDataSetProps {
  onUpload: (dataSet: Omit<DataSet, 'id' | 'downloads' | 'views' | 'rating' | 'createdAt'>) => void
  isConnected: boolean
}

export default function UploadDataSet({ onUpload, isConnected }: UploadDataSetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    fileSize: '',
    tags: [] as string[],
    newTag: ''
  })

  const categories = [
    'E-commerce',
    'Healthcare',
    'Finance',
    'Technology',
    'Education',
    'Transportation',
    'Energy',
    'Agriculture',
    'Entertainment',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const dataSetData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        fileSize: formData.fileSize,
        tags: formData.tags,
        seller: '0x1234...5678', // This would come from wallet
      }

      await onUpload(dataSetData)
      toast.success('Dataset uploaded successfully!')
      resetForm()
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to upload dataset. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      fileSize: '',
      tags: [],
      newTag: ''
    })
  }

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ''
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center space-x-2 hover-lift hover-glow"
      >
        <Upload className="w-4 h-4 pulse" />
        <span>Upload Dataset</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 slide-up">
                <h2 className="text-2xl font-bold text-gray-900">Upload Dataset</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 hover-lift"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="slide-up delay-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dataset Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter dataset title"
                    required
                  />
                </div>

                {/* Description */}
                <div className="slide-up delay-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Describe your dataset..."
                    required
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 slide-up delay-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (ETH) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="input-field pl-10"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* File Size */}
                <div className="slide-up delay-400">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Size
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pulse" />
                    <input
                      type="text"
                      value={formData.fileSize}
                      onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                      className="input-field pl-10"
                      placeholder="e.g., 2.5 MB, 1.2 GB"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="slide-up delay-500">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pulse" />
                      <input
                        type="text"
                        value={formData.newTag}
                        onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="input-field pl-10"
                        placeholder="Add a tag..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-secondary flex items-center space-x-1 hover-lift"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 hover-lift"
                          style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-primary-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 slide-up delay-600">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary hover-lift"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift hover-glow"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 pulse" />
                        <span>Upload Dataset</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}