
# Memory Stitcher

Memory Stitcher is an AI-powered biographical storytelling platform that helps users preserve and share their life stories through thoughtful interviews and narrative generation.

## Features

### Core Functionality
- 🤖 AI-powered interview system
- 📝 Dynamic story generation
- 👥 Family sharing and collaboration
- 🔒 Privacy controls and data protection

### Subscription Tiers
- **Free Tier**
  - Single-user personal family
  - 5 stories per month
  - Basic story features
  
- **Basic Family Plan**
  - Up to 8 family members
  - Family story sharing
  - Collaborative writing
  - All core features

- **Premium Family Plan**
  - Up to 20 family members
  - Priority support
  - Advanced analytics
  - Priority AI processing

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Tanstack Query for data fetching
- React Router for navigation

### Backend (Supabase)
- PostgreSQL database
- Row Level Security (RLS)
- Real-time subscriptions
- Edge Functions
- File storage
- Authentication

### Third-party Integrations
- OpenAI for AI interviewer
- Stripe for payments
- Email verification

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm or Bun package manager
- Supabase account
- OpenAI API key
- Stripe account (for payments)

### Environment Variables
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd memorystitcher
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Start the development server
```bash
npm run dev
# or
bun dev
```

### Project Structure
```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── families/       # Family management components
│   ├── profile/        # Profile components
│   ├── stories/        # Story creation components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
├── lib/               # Utility functions and helpers
└── pages/             # Route components

supabase/
├── functions/         # Edge Functions
└── migrations/        # Database migrations
```

## Security

- Row Level Security (RLS) policies protect data access
- Secure authentication flow with email verification
- Protected story access based on family membership
- Data encryption at rest

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

