# Ticket Flow — Frontend

Customer-facing and staff interface for an internal maintenance request system.

Built with React, Vite, and Tailwind CSS. Authentication is handled by Firebase.

## Tech stack

- **React** — UI library
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **Firebase** — authentication (client SDK)
- **React Router v7** — routing

## Prerequisites

- Node.js 18+
- A running instance of the [Ticket Flow backend](https://github.com/almalki/ticket-flow-backend)
- Firebase project with Authentication enabled

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Firebase values are found in **Firebase Console → Project settings → Your apps → SDK setup and configuration**.

### 3. Start the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Pages

### Public (no login required)

| Path | Description |
|---|---|
| `/` | Landing page |
| `/submit` | Submit a maintenance request |
| `/track` | Track a request by email and reference number |

### Staff (login required)

| Path | Description |
|---|---|
| `/login` | Staff login |
| `/dashboard` | All tickets table |
| `/tickets/:id` | Ticket detail — messages, replies, actions |
| `/agents` | Manage agents — admin only |
| `/categories` | Manage categories — admin only |
