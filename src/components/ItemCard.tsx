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
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-4 cursor-pointer group"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{pictureUrl}</span>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{itemType}</p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-gray-500 dark:text-gray-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors"
                >
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">Owned for:</span>
                        <span className="text-gray-900 dark:text-gray-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{ownershipDuration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">Last used:</span>
                        <span className="text-gray-900 dark:text-gray-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{lastUsedDuration}</span>
                    </div>
                    {onStatusChange && (
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange('Keep');
                                }}
                                className={`px-3 py-1 rounded ${status === 'Keep'
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-700 dark:hover:text-teal-300'
                                    }`}
                            >
                                Keep
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange('Give');
                                }}
                                className={`px-3 py-1 rounded ${status === 'Give'
                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-700 dark:hover:text-teal-300'
                                    }`}
                            >
                                Give
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange('Donate');
                                }}
                                className={`px-3 py-1 rounded ${status === 'Donate'
                                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-700 dark:hover:text-teal-300'
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