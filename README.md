# Reclaim - Recovery Web Application

A comprehensive, neuroscience-backed web application for overcoming porn addiction with community support, gamification, and practical safeguards.

## Project Overview

Reclaim is a Next.js-based web application that provides users with a structured, engaging path to recovery through:

- **Deep Onboarding**: 10-screen reflective journey to build emotional investment
- **Daily Loop**: Simple 4-tab interface (Home, Community, Learn, Profile)
- **Panic Button**: Immediate intervention system with guided exercises
- **Gamification**: Streaks, XP, badges, and visual growth tracker
- **Community**: Public accountability, leaderboards, and peer support
- **Learning**: Bite-sized lessons backed by neuroscience
- **AI Coach**: Premium personalized support (planned)
- **Blocking Integration**: Cross-device porn blocking (planned)

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion
- **State Management**: Zustand (planned)
- **Database**: PostgreSQL with Prisma ORM (planned)
- **Authentication**: NextAuth.js (planned)
- **Payment**: Stripe integration (planned)
- **AI**: OpenAI API for AI Coach (planned)

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── dashboard/          # Main dashboard page
│   ├── api/               # API routes (planned)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage with onboarding
├── components/
│   ├── common/            # Reusable components
│   ├── onboarding/        # 10-screen onboarding flow
│   ├── dashboard/         # Dashboard tab components
│   ├── panic-button/      # Panic intervention system
│   ├── gamification/      # Streak, XP, badge components
│   ├── community/         # Social features
│   └── blocking/          # Device blocking features
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── auth.ts           # Authentication logic (planned)
│   └── db.ts             # Database client (planned)
├── types/
│   └── index.ts          # TypeScript type definitions
├── hooks/                # Custom React hooks (planned)
└── store/               # Global state management (planned)
```

## Key Features Implemented

### 1. Onboarding Flow (10 Screens)
- Welcome screen with value proposition
- Emotional investment reflection
- Habit pattern assessment
- Trigger identification
- Emotional impact evaluation
- Goal setting (short & long term)
- Identity formation
- Personalized plan summary
- Community introduction
- Pricing with hard paywall

### 2. Dashboard System
- **Home Tab**: Streak display, panic button, daily quests, quick actions
- **Community Tab**: Public posts, leaderboards, social stats
- **Learn Tab**: Educational modules with progress tracking
- **Profile Tab**: User stats, achievements, settings

### 3. Panic Button System
- Large, prominent panic button on home screen
- 3-step intervention flow:
  - Guided breathing exercise
  - Motivational reminders
  - Self-reflection prompt
- Automatic urge logging

### 4. Gamification Elements
- Streak tracking with visual indicators
- XP system with level progression
- Badge/achievement system
- Phoenix visual growth tracker
- Daily quest system

## Design System

### Color Palette
- **Brand Blue**: #4A6FA7 (Primary UI)
- **Success Green**: #2ECC71 (Streaks, positive actions)
- **Achievement Gold**: #F1C40F (XP, badges, rewards)
- **Community Blue**: #3498DB (Social features)
- **Panic Red**: #EC5766 (Panic button, alerts)
- **CTA Orange**: #E67E22 (Call-to-action elements)

### Typography
- **Primary Font**: Poppins (rounded, modern sans-serif)
- **Emphasis**: Clean hierarchy with proper weight distribution
- **Accessibility**: High contrast ratios throughout

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Clone and Install**
```bash
cd /Users/malikyousufadem/Desktop/Projects/Reclaim
npm install
```

2. **Environment Setup**
```bash
cp .env.local .env
# Edit .env with your actual values
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Visit Application**
Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Required environment variables in `.env.local`:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `OPENAI_API_KEY`: For AI Coach feature
- `STRIPE_SECRET_KEY`: For payment processing
- `STRIPE_PUBLISHABLE_KEY`: For client-side Stripe

## Development Status

### ✅ Completed
- Project structure and configuration
- Complete onboarding flow (10 screens)
- Dashboard layout and navigation
- Home tab with streak display and panic button
- Panic button intervention system
- Urge journal modal
- Community tab with mock data
- Learn tab with module system
- Profile tab with achievements
- Responsive design system
- TypeScript type definitions
- Utility functions

### 🚧 In Progress
- API route implementation
- Database schema setup
- Authentication system
- Real data integration

### 📋 Planned
- Stripe payment integration
- AI Coach implementation
- Device blocking features
- Real-time community features
- Push notifications
- Mobile app (React Native)
- Browser extensions

## Business Model

- **Hard Paywall**: $12.99/month or $29.99/year
- **No Freemium**: Committed users only
- **Premium Features**: AI Coach, advanced analytics
- **Target Conversion**: >25% onboarding to paid
- **Target Retention**: >50% at 30 days

## Contributing

This is a private project under development. Future contribution guidelines will be established.

## License

Proprietary - All rights reserved.

---

**Mission**: To build not just a quitting tool, but a thriving recovery community that gives users pride, identity, and belonging—making them less likely to relapse and more likely to share the app with others.
