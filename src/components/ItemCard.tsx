'use client'

import { useState } from 'react'

interface ItemCardProps {
    id: string
    name: string
    pictureUrl: string
    itemType: string
    status: string
    ownershipDuration: string
    lastUsedDuration: string
    onStatusChange?: (id: string, newStatus: string) => void
}

export default function ItemCard({
    id,
    name,
    pictureUrl,
    itemType,
    status,
    ownershipDuration,
    lastUsedDuration,
    onStatusChange,
}: ItemCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const handleStatusChange = (newStatus: string) => {
        if (onStatusChange) {
            onStatusChange(id, newStatus)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{pictureUrl}</span>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{itemType}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Owned for:</span>
                        <span className="text-gray-900 dark:text-gray-100">{ownershipDuration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Last used:</span>
                        <span className="text-gray-900 dark:text-gray-100">{lastUsedDuration}</span>
                    </div>
                    {onStatusChange && (
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={() => handleStatusChange('Keep')}
                                className={`px-3 py-1 rounded ${status === 'Keep'
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                    }`}
                            >
                                Keep
                            </button>
                            <button
                                onClick={() => handleStatusChange('Give')}
                                className={`px-3 py-1 rounded ${status === 'Give'
                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                    }`}
                            >
                                Give
                            </button>
                            <button
                                onClick={() => handleStatusChange('Donate')}
                                className={`px-3 py-1 rounded ${status === 'Donate'
                                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                    }`}
                            >
                                Donate
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 