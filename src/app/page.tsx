import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome to Min-Now</h1>
            <p className="mb-4">A minimalist approach to your daily tasks</p>
            <Link
                href="/calculator"
                className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
            >
                Go to Calculator
            </Link>
        </div>
    )
} 