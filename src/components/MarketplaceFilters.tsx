'use client'

import { useState } from 'react'
import { Filter, SortAsc, SortDesc, X } from 'lucide-react'
import { MarketplaceFilters } from '@/types'

interface MarketplaceFiltersProps {
  filters: MarketplaceFilters
  onFiltersChange: (filters: MarketplaceFilters) => void
  categories: string[]
}

export default function MarketplaceFilters({ filters, onFiltersChange, categories }: MarketplaceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'all' ? '' : category
    })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max]
    })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating
    })
  }

  const handleSortChange = (sortBy: MarketplaceFilters['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      priceRange: [0, 10],
      rating: 0,
      sortBy: 'date',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = filters.category || filters.priceRange[1] < 10 || filters.rating > 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600 pulse" />
          <h3 className="text-lg font-semibold text-gray-900 slide-up">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 hover-lift"
            >
              <X className="w-4 h-4 pulse" />
              <span>Clear all</span>
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-secondary text-sm hover-lift hover-glow"
          >
            {isOpen ? 'Hide' : 'Show'} Filters
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-6 fade-in slide-up">
          {/* Category Filter */}
          <div className="fade-in delay-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-2 text-sm rounded-lg transition-colors hover-lift ${
                  !filters.category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors hover-lift ${
                    filters.category === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${index < 4 ? `delay-${(index + 1) * 100}` : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="fade-in delay-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range (ETH): {filters.priceRange[0]} - {filters.priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(parseFloat(e.target.value), filters.priceRange[1])}
                className="flex-1 hover-lift"
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(filters.priceRange[0], parseFloat(e.target.value))}
                className="flex-1 hover-lift"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="fade-in delay-300">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Minimum Rating: {filters.rating}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={filters.rating}
              onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
              className="w-full hover-lift"
            />
          </div>

          {/* Sort Options */}
          <div className="fade-in delay-400">
            <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
            <div className="flex items-center space-x-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as MarketplaceFilters['sortBy'])}
                className="input-field text-sm hover-lift"
              >
                <option value="date">Date</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="downloads">Downloads</option>
              </select>
              <button
                onClick={() => handleSortChange(filters.sortBy)}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover-lift"
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4 pulse" />
                ) : (
                  <SortDesc className="w-4 h-4 pulse" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}