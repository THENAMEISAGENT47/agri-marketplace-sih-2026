# Environment Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready (2-3 minutes)
4. Go to Project Settings → API
5. Copy the following values:
   - Project URL
   - anon public key
   - service_role key (from the bottom section)

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the project root with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AgriMarketplace

# AI Services Configuration
DEMAND_FORECASTING_SERVICE_URL=http://localhost:8001
ROUTE_OPTIMIZATION_SERVICE_URL=http://localhost:8002

# Node Environment
NODE_ENV=development
```

Replace the placeholder values with your actual Supabase credentials.

## Step 3: Database Setup

### Option A: Using Supabase Dashboard (Recommended for Demo)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_data.sql`

### Option B: Using Supabase CLI (For Production)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push migrations:
   ```bash
   supabase db push
   ```

## Step 4: Set Up Python AI Services (Optional for Demo)

The AI services have built-in demo fallbacks, so they work without Python. For full functionality:

### Install Python Dependencies

```bash
# Navigate to demand forecasting service
cd python-services/demand-forecasting
pip install -r requirements.txt

# Navigate to route optimization service
cd ../route-optimization
pip install -r requirements.txt
```

### Start the Services

**Demand Forecasting Service (Port 8001):**
```bash
cd python-services/demand-forecasting
python main.py
```

**Route Optimization Service (Port 8002):**
```bash
cd python-services/route-optimization
python main.py
```

**Note:** The Next.js application will automatically use demo fallbacks if these services are not running.

## Step 5: Start the Next.js Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 6: Verify Database Setup

After running the migrations, verify the setup:

1. Check that all tables are created in the Table Editor
2. Verify that seed data is present (3 farmers, 2 buyers, 8 products, etc.)
3. Test the authentication system with demo credentials:
   - Farmer: farmer1@demo.com / demo123
   - Buyer: buyer1@demo.com / demo123
   - Admin: admin@demo.com / demo123

## Important Notes

- Never commit `.env.local` to version control
- The `.env.example` file shows the required environment variables
- Service role key should only be used server-side (API routes)
- Anon key is safe to use in client-side code
- The seed data includes a complete demo scenario (800kg tomato order)
- Passwords in seed data are simple hashes for demo purposes only
- In production, use proper password hashing (bcrypt)
- Python AI services are optional - the app uses demo fallbacks if not running
- For SIH demonstration, you can run the app without Python services