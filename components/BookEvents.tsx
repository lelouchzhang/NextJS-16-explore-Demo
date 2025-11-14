"use client"
import { useState } from "react"

const BookEvents = ({ eventId, slug }: { eventId: string, slug: string }) => {
    const [submitted, setSubmitted] = useState(false)
    const [email, setEmail] = useState('')
    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={() => { }}>
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