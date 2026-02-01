# Personal Finance App

A modern personal finance management application built with Next.js 15 and Supabase. Track your transactions, manage budgets, save with pots, and monitor recurring bills.

## Features

- **Dashboard** - Overview of your financial health with balance, recent transactions, budgets, and pots
- **Transactions** - View, search, filter, and sort all transactions
- **Budgets** - Create and manage spending budgets by category with visual progress tracking
- **Pots** - Set savings goals and track progress with add/withdraw functionality
- **Recurring Bills** - Monitor upcoming and paid recurring expenses
- **Authentication** - Secure login, signup, and password reset with Supabase Auth

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### 1. Clone the repository

```bash
git clone <repository-url>
cd personal-finance-app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)

2. Run the following SQL in your Supabase SQL Editor to create the database schema:

```sql
-- Balance table
CREATE TABLE IF NOT EXISTS public.balance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current DECIMAL(12, 2) DEFAULT 0 NOT NULL,
  income DECIMAL(12, 2) DEFAULT 0 NOT NULL,
  expenses DECIMAL(12, 2) DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  recurring BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  maximum DECIMAL(12, 2) NOT NULL,
  theme TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, category)
);

-- Pots table
CREATE TABLE IF NOT EXISTS public.pots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) DEFAULT 0 NOT NULL,
  theme TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE public.balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pots ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own balance" ON public.balance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own balance" ON public.balance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own balance" ON public.balance FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own pots" ON public.pots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pots" ON public.pots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pots" ON public.pots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pots" ON public.pots FOR DELETE USING (auth.uid() = user_id);

-- Auto-create balance for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.balance (user_id, current, income, expenses)
  VALUES (NEW.id, 0, 0, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under **API**.

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # Authentication API routes
│   ├── budgets/           # Budgets page
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── pots/              # Pots page
│   ├── recurring-bills/   # Recurring bills page
│   ├── signup/            # Signup page
│   └── transactions/      # Transactions page
├── components/            # React components
│   ├── Budgets/          # Budget-related components
│   ├── Charts/           # Chart components
│   ├── Dashboard/        # Dashboard components
│   ├── Modals/           # Modal dialogs
│   ├── Pots/             # Pot-related components
│   ├── Transactions/     # Transaction components
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts (Auth)
├── data/                 # Static data (fallback)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── constants/        # App constants
│   ├── supabase/         # Supabase client setup
│   └── types.ts          # TypeScript types
└── providers/            # React Query provider
```

## API Routes

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/login`           | User login             |
| POST   | `/api/auth/signup`          | User registration      |
| POST   | `/api/auth/logout`          | User logout            |
| POST   | `/api/auth/forgot-password` | Request password reset |

## Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js. Make sure to:

1. Set the environment variables
2. Run `pnpm build` to create the production build
3. Run `pnpm start` to start the server

### Credential

demo@finance.app
demo123456
