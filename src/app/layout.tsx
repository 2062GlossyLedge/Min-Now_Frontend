import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Min-Now',
    description: 'Min-Now encourages minimalism in your life',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    )
}