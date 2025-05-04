'use client'

import { useState } from 'react'

interface FilterBarProps {
    onFilterChange: (type: string | null) => void
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)

    const itemTypes = [
        'Clothing',
        'Technology',
        'Household Item',
        'Vehicle',
        'Other'
    ]

    const handleFilterClick = (type: string) => {
        if (selectedType === type) {
            setSelectedType(null)
            onFilterChange(null)
        } else {
            setSelectedType(type)
            onFilterChange(type)
        }
    }

    return (
        <div className="overflow-x-auto whitespace-nowrap py-2">
            <div className="flex space-x-2 px-4">
                {itemTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => handleFilterClick(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedType === type
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    )
} 