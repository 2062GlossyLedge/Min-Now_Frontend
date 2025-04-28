import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const a = Number(searchParams.get('a'))
    const b = Number(searchParams.get('b'))

    return NextResponse.json({ result: a + b })
} 