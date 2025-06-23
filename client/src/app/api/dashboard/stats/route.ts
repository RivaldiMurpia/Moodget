import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get total spent
    const totalSpentResult = await prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
      },
      _sum: {
        amount: true,
      },
    })
    const totalSpent = totalSpentResult._sum.amount || 0

    // Get monthly average
    const monthlyAverage = totalSpent / 12 // Simplified calculation

    // Get top category
    const topCategoryResult = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId: session.user.id,
      },
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
      take: 1,
    })
    const topCategory = topCategoryResult[0]?.category || "No transactions"

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        amount: true,
        description: true,
        category: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    return NextResponse.json({
      totalSpent,
      monthlyAverage,
      topCategory,
      recentTransactions,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
