# Xandeum pNode Analytics Platform

A comprehensive analytics dashboard for Xandeum pNodes, designed to help stakers make informed delegation decisions.

## Features

- Real-time pNode performance monitoring
- Network analytics and health overview
- Staker decision tools with comparison tables
- Operator insights and earnings analytics
- Dark mode with light mode toggle
- Responsive design (mobile, tablet, desktop)

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Recharts for data visualization
- React Query for data fetching
- Zustand for state management

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/              # Next.js App Router pages
components/       # React components
lib/              # Utilities and API clients
hooks/            # Custom React hooks
stores/           # Zustand state management
types/            # TypeScript type definitions
```

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_XANDEUM_RPC_URL=your_rpc_url_here
```

## License

MIT

