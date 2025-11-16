export async function hashPhone(phone: string): Promise<string> {
    const normalizedPhone = phone.replace(/\D/g, "")
    const encoder = new TextEncoder()
    const data = encoder.encode(normalizedPhone)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}
