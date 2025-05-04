'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HomePage() {
    const pathname = usePathname()
    const [checkupStatus, setCheckupStatus] = useState(false)

    const tabs = [
        { name: 'Keep', href: '/keep', icon: '↓' },
        { name: 'Give', href: '/give', icon: '↑' },
        { name: 'Donated', href: '/donated', icon: '🎁' },
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-white dark:bg-gray-900 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex space-x-8">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === tab.href
                                            ? 'border-teal-500 text-gray-900 dark:text-gray-100'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-teal-300 dark:hover:border-teal-600 hover:text-teal-500 dark:hover:text-teal-400'
                                            }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/settings"
                                className="text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-1">
                {pathname === '/' && (
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome to Min-Now</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Select a tab above to manage your belongings
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 