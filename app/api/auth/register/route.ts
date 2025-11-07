import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Zod validation schema matching the Prisma users model
const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  question1: z.string().min(1, "Question 1 is required"),
  question2: z.string().min(1, "Question 2 is required"),
  question3: z.string().min(1, "Question 3 is required"),
  pin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, email, phoneNumber, question1, question2, question3, pin } = validationResult.data;

    // Check if user exists by phone number (Supabase handles the hashing)
    // We'll search by the raw phone number as Supabase will handle the comparison
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { encryptedPhone: phoneNumber },
          { hashedPhone: phoneNumber },
        ],
      },
    });

    // Hash the PIN (acts as password)
    const hashedPin = await bcrypt.hash(pin, 10);

    // Create metadata object with onboarding questions
    const metadata = {
      onboarding: {
        question1: {
          question: "How did you hear about us?",
          answer: question1,
        },
        question2: {
          question: "What is your primary goal?",
          answer: question2,
        },
        question3: {
          question: "Tell us more about your needs",
          answer: question3,
        },
      },
      onboardingCompleted: true,
    };

    let user;
    let isNewUser = false;

    if (existingUser) {
      // Update existing user profile
      user = await prisma.users.update({
        where: { id: existingUser.id },
        data: {
          name,
          email,
          pin: hashedPin,
          metadata,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // Create new user
      isNewUser = true;
      const userId = crypto.randomUUID();

      user = await prisma.users.create({
        data: {
          id: userId,
          name,
          email,
          encryptedPhone: phoneNumber, // Supabase will handle encryption
          hashedPhone: phoneNumber,    // Supabase will handle hashing
          pin: hashedPin,
          role: 1, // Default user role
          metadata,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    }

    return NextResponse.json(
      {
        message: isNewUser ? "Registration successful" : "Profile updated successfully",
        user,
        isNewUser,
      },
      { status: isNewUser ? 201 : 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
