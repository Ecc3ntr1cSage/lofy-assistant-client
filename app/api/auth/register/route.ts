import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function hashPhone(phone: string): string {
  const normalizedPhone = phone.replace(/\D/g, "");
  return crypto.createHash("sha256").update(normalizedPhone).digest("hex");
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

    const hashedPhone = hashPhone(normalizedPhone);

    // Check for existing user
    const existingUser = await prisma.users.findUnique({
      where: { hashed_phone: hashedPhone },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    const user = await prisma.users.create({
      data: {
        name,
        hashed_phone: hashedPhone,
        pin: hashedPin,
        // Add other fields if your schema supports them
        // email: email || null,
        // You might want to store onboarding answers in a separate table
      },
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully", userId: user.id, isNewUser: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
