import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './global.css'
import { ThemeProvider } from '../components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Min-Now',
    description: 'A minimalist approach to managing your belongings',
    icons: {
        icon: '/MinNowLightLogo.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-white dark:bg-black`}>
                <ThemeProvider>
                    <main className="min-h-screen">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    )
}