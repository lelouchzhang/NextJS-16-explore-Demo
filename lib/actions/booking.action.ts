'use server'

import Booking from "@/database/booking.model"
import connectToDatabase from "../mongodb"

export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
    try {
        await connectToDatabase()

        const booking = (await Booking.create({ eventId, slug, email }))

        return { success: true }
    } catch (error) {
        console.log(`createBooking error: `, error)
        return { success: false }
    }
}