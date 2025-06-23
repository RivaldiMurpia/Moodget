import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { transactionDate: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { amount, description, categoryId, tagIds, transactionDate } = await req.json();
    
    // Validate required fields
    if (!amount || !description || !categoryId || !transactionDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        categoryId: parseInt(categoryId),
        transactionDate: new Date(transactionDate),
        userId: session.user.id,
        tags: {
          create: tagIds?.map((tagId: number) => ({
            tag: {
              connect: { id: tagId }
            }
          })) || []
        }
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
    });

    return NextResponse.json({ transaction: newTransaction });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
