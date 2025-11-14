import { notFound } from "next/navigation"
import { Suspense } from "react"

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const request = await fetch(`${BASE_URL}/api/events/${slug}`)
    const { data } = await request.json()

    if (!data) return notFound()
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <h1>{data.slug}</h1>
            </Suspense>
        </main>
    )
}

export default EventDetailsPage