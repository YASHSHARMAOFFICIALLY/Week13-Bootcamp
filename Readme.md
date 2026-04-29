# LearnTrack

LearnTrack is a full-stack learning progress platform. Users can create an account, sign in, submit solved problem IDs, and view course completion progress from a dashboard.

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT, bcrypt

## Project Structure

```text
.
├── backend/    # Express API, Prisma schema, seed script
├── frontend/   # Next.js app
└── Readme.md
```

## Features

- User sign up and sign in
- Password hashing with bcrypt
- JWT-based authenticated API requests
- Course and problem seed data
- Problem submission tracking
- Course progress calculation
- Dashboard for progress display
- Basic API security with Helmet, CORS headers, and rate limiting

## Requirements

- Node.js
- npm
- PostgreSQL database

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="replace-with-a-secure-secret"
PORT=3000
FRONTEND_ORIGIN="http://localhost:3001"
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Backend Setup

```bash
cd backend
npm install
npm run prisma:generate
npx prisma db push
npm run seed
npm run dev
```

The API runs on `http://localhost:3000` by default.

## Deploy Backend on Render

Create a new **Web Service** on Render and connect this repository.

Use these settings:

```text
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

Add these Render environment variables:

```env
DATABASE_URL="your-render-postgres-external-or-internal-url"
JWT_SECRET="replace-with-a-secure-production-secret"
NODE_ENV="production"
FRONTEND_ORIGIN="https://your-frontend-domain.com"
```

Render automatically provides the `PORT` environment variable, so you do not need to set it manually.

For the first deployment, create the database tables before starting the app:

```bash
cd backend
npx prisma db push
npm run seed
```

You can run those commands from Render Shell after the service is deployed, or run them locally against the same `DATABASE_URL`.

After deployment, test the backend health endpoint:

```http
GET https://your-render-service.onrender.com/health
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev -- -p 3001
```

The app runs on `http://localhost:3001`.

## API Routes

### Health

```http
GET /health
```

Returns server status.

### Auth

```http
POST /auth/signup
```

Request body:

```json
{
  "name": "Demo User",
  "username": "demo",
  "email": "demo@example.com",
  "password": "password123"
}
```

```http
POST /auth/signin
```

Request body:

```json
{
  "username": "demo",
  "password": "password123"
}
```

Successful sign in returns a JWT token and user details.

### Submit Problem

```http
POST /submit
Authorization: Bearer <token>
```

Request body:

```json
{
  "problemId": 1
}
```

Creates an accepted submission and updates course progress.

### Progress

```http
GET /progress
Authorization: Bearer <token>
```

Returns the signed-in user's course progress.

## Seed Data

The seed script creates two courses:

- JavaScript Foundations
- Data Structures Basics

Each course includes three practice problems. After seeding, submit problem IDs from the database through the dashboard to update progress.

## Useful Scripts

Backend:

```bash
npm run dev              # Start API in watch mode
npm run build            # Compile TypeScript
npm start                # Run compiled API
npm run prisma:generate  # Generate Prisma client
npm run seed             # Seed courses and problems
```

Frontend:

```bash
npm run dev      # Start Next.js dev server
npm run build    # Build production frontend
npm start        # Start production frontend
```

## Development Notes

- The backend defaults to port `3000`.
- The frontend should run on port `3001` during local development because the backend CORS default allows `http://localhost:3001`.
- Authenticated frontend requests store the JWT in `localStorage` under `learning_token`.
- Prisma client output is configured at `backend/src/generated/prisma`.
