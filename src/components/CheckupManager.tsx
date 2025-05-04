'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckupManagerProps {
    checkupType: 'Keep' | 'Give'
    onClose: () => void
}

export default function CheckupManager({ checkupType, onClose }: CheckupManagerProps) {
    const router = useRouter()
    const [interval, setInterval] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/checkups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    checkup_type: checkupType.toLowerCase(),
                    interval_months: interval
                }),
            })

            if (response.ok) {
                router.refresh()
                onClose()
            }
        } catch (error) {
            console.error('Error setting checkup:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Set {checkupType} Checkup Interval</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Checkup Interval (months)
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setInterval(Math.max(1, interval - 1))}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                -
                            </button>
                            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{interval}</span>
                            <button
                                type="button"
                                onClick={() => setInterval(Math.min(12, interval + 1))}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 