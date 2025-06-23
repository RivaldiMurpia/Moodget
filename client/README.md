# Emotional Spending Tracker

This is a Next.js project for tracking emotional spending patterns. It allows users to log transactions with categories and emotional tags, visualize spending habits, and gain insights into their emotional spending behavior.

## Features

- User authentication with NextAuth.js and Prisma
- Secure password hashing and user registration
- CRUD API endpoints for transactions, categories, and tags
- Responsive frontend with Tailwind CSS and Shadcn/UI components
- Dashboard with charts for spending by category and emotional state
- Transaction input form with category and emotional tag selection

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL database

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` file with the following variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   ```
4. Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The easiest way to deploy this app is on Vercel. See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.

