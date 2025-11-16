import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const runtime = 'nodejs'

async function hashPhone(phone: string): Promise<string> {
  const normalizedPhone = phone.replace(/\D/g, "")
  const encoder = new TextEncoder()
  const data = encoder.encode(normalizedPhone)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

async function encryptPhone(phone: string): Promise<string> {
  // Simple base64 encoding - replace with proper encryption if needed
  const normalizedPhone = phone.replace(/\D/g, "")
  return Buffer.from(normalizedPhone).toString('base64')
}

export async function POST(request: NextRequest) {
  try {
    let { phone, phoneNumber, pin, name, email, question1, question2, question3 } = await request.json();

    // Handle both 'phone' and 'phoneNumber' fields
    const phoneValue = phone || phoneNumber;

    // Normalize phone: remove all non-digits including '+'
    const normalizedPhone = phoneValue?.replace(/\D/g, "") || "";

    if (!normalizedPhone || !pin || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    // Validate PIN - must be exactly 6 digits
    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be exactly 6 digits" }, { status: 400 });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
    }

    const hashedPhone = await hashPhone(normalizedPhone);
    const encryptedPhone = await encryptPhone(normalizedPhone);

    // Check for existing user by hashed_phone
    const existingUser = await prisma.users.findFirst({
      where: { hashed_phone: hashedPhone },
    });

    // Hash PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Prepare metadata with onboarding answers if provided
    const metadata = (question1 || question2 || question3) ? {
      onboarding: {
        question1: question1 || null,
        question2: question2 || null,
        question3: question3 || null,
        completedAt: new Date().toISOString()
      }
    } : null;

    if (existingUser) {
      // Check if email is being changed and if it's already taken by another user
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.users.findUnique({
          where: { email: email }
        });
        if (emailExists && emailExists.id !== existingUser.id) {
          return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
      }

      // User exists (partial registration from FastAPI) - update to complete profile
      const updatedUser = await prisma.users.update({
        where: { id: existingUser.id },
        data: {
          name,
          pin: hashedPin,
          encrypted_phone: encryptedPhone,
          email: email || existingUser.email,
          metadata: metadata || existingUser.metadata,
        },
      });

      return NextResponse.json(
        { success: true, message: "Profile completed successfully", userId: updatedUser.id, isNewUser: false },
        { status: 200 }
      );
    } else {
      // Check if email already exists
      if (email) {
        const emailExists = await prisma.users.findUnique({
          where: { email: email }
        });
        if (emailExists) {
          return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
      }

      // User doesn't exist - create new user
      const user = await prisma.users.create({
        data: {
          id: randomUUID(),
          name,
          hashed_phone: hashedPhone,
          encrypted_phone: encryptedPhone,
          pin: hashedPin,
          email: email || null,
          role: 1, // Default user role
          metadata: metadata,
        },
      });

      return NextResponse.json(
        { success: true, message: "User registered successfully", userId: user.id, isNewUser: true },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
