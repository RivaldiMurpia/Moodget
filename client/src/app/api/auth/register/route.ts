import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create default categories for the user
    const defaultCategories = [
      "Food & Dining",
      "Shopping",
      "Transportation",
      "Bills & Utilities",
      "Entertainment",
      "Health & Wellness",
      "Travel",
      "Other",
    ];

    await prisma.category.createMany({
      data: defaultCategories.map((name) => ({
        name,
        userId: user.id,
      })),
    });

    // Create default emotional tags
    const defaultTags = [
      "Happy",
      "Stressed",
      "Impulsive",
      "Rewarding",
      "Necessary",
      "Regretful",
    ];

    await prisma.tag.createMany({
      data: defaultTags.map((name) => ({
        name,
        userId: user.id,
      })),
    });

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
