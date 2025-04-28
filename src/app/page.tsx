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
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex space-x-8">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === tab.href
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-1">
                {pathname === '/' && (
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            <h1 className="text-3xl font-bold text-gray-900">Welcome to Min-Now</h1>
                            <p className="mt-2 text-gray-600">
                                Select a tab above to manage your belongings
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 