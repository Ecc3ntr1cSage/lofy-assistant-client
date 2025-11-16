// Example client-side login component
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginExample() {
    const [phone, setPhone] = useState("")
    const [pin, setPin] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Call our custom login API
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, pin }),
            })

            const data = await response.json()

            if (response.ok) {
                // Console log the token from cookies
                const cookies = document.cookie.split(';')
                const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
                const token = authCookie ? authCookie.split('=')[1] : null

                console.log("🔐 Auth Token:", token)
                console.log("👤 User Data:", data.user)
                console.log("✅ Login Successful:", data.message)

                // Also sign in with NextAuth for proper session management
                const result = await signIn("credentials", {
                    phone,
                    pin,
                    redirect: false,
                })

                if (result?.ok) {
                    console.log("🎭 NextAuth Session Created")
                    // Redirect or update UI
                }
            } else {
                console.error("❌ Login Error:", data.error)
            }
        } catch (error) {
            console.error("💥 Network Error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                </label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Enter your phone number"
                    required
                />
            </div>

            <div>
                <label htmlFor="pin" className="block text-sm font-medium">
                    PIN
                </label>
                <input
                    type="password"
                    id="pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Enter your PIN"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>
        </form>
    )
}
