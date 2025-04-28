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
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{pictureUrl}</span>
                    <div>
                        <h3 className="text-lg font-semibold">{name}</h3>
                        <p className="text-sm text-gray-500">{itemType}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Owned for:</span>
                        <span>{ownershipDuration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last used:</span>
                        <span>{lastUsedDuration}</span>
                    </div>
                    {onStatusChange && (
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={() => handleStatusChange('Keep')}
                                className={`px-3 py-1 rounded ${status === 'Keep'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                Keep
                            </button>
                            <button
                                onClick={() => handleStatusChange('Give')}
                                className={`px-3 py-1 rounded ${status === 'Give'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                Give
                            </button>
                            <button
                                onClick={() => handleStatusChange('Donate')}
                                className={`px-3 py-1 rounded ${status === 'Donate'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
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