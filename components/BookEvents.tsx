"use client"
import { createBooking } from "@/lib/actions/booking.action"
import posthog from "posthog-js"
import { useState } from "react"

const BookEvents = ({ eventId, slug }: { eventId: string, slug: string }) => {
    const [submitted, setSubmitted] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { success } = await createBooking({ eventId, slug, email })

        if (success) {
            setSubmitted(true)
            posthog.capture('用户预约活动', { eventId, slug, email })
        } else {
            posthog.capture('用户预约活动时发生错误')
        }
    }
    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" value={email}
                            placeholder="Enter your email address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )

            }
        </div>
    )
}

export default BookEvents