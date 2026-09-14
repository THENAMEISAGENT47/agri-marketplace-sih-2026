# AgriMarketplace - Project Rules and Setup

## Project Overview

This is a Smart India Hackathon 2026 project (PS 26033) - a digital agricultural marketplace connecting farmers directly with buyers.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage), Next.js API Routes
- **AI/ML**: Python FastAPI services for demand forecasting and route optimization
- **State Management**: Zustand, React Query
- **Validation**: Zod schemas

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Database Setup

1. Create Supabase project at supabase.com
2. Run migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_data.sql`

## Environment Variables

Required variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `DEMAND_FORECASTING_SERVICE_URL`
- `ROUTE_OPTIMIZATION_SERVICE_URL`

## Key Architecture Decisions

1. **Supabase for Everything**: Using Supabase for auth, database, and real-time features
2. **Row-Level Security**: All database access protected by RLS policies
3. **Component Library**: Reusable UI components in `src/components/ui/`
4. **Type Safety**: Full TypeScript with database types in `src/types/database.ts`
5. **Modular Services**: Business logic separated in `src/services/`

## Database Schema

11 core tables:
- `users` - Authentication and roles
- `farmers` - Farmer/FPO profiles
- `buyers` - Buyer profiles
- `products` - Product listings
- `orders` - Order management
- `order_items` - Order-product relationships
- `logistics_routes` - Delivery routes
- `route_stops` - Multi-stop details
- `demand_history` - Historical demand data
- `demand_forecasts` - AI predictions
- `platform_analytics` - Platform metrics
- `notifications` - User notifications

## Demo Data

Seed data includes:
- 3 farmers (Ramesh Kumar, Suresh FPO, Priya Singh)
- 2 buyers (Amit Sharma, Restaurant Green)
- 8 products (tomatoes, onions, potatoes, carrots, etc.)
- 1 sample order (800kg tomatoes)
- Demand history and forecasts
- Platform analytics

Demo credentials:
- Farmer: farmer1@demo.com / demo123
- Buyer: buyer1@demo.com / demo123
- Admin: admin@demo.com / demo123

## Important Notes

1. **SIH Demonstration**: All features must work end-to-end for live demo
2. **No Fake Functionality**: Every button must have real implementation
3. **Agricultural Theme**: UI designed for Indian government/SIH context
4. **Security First**: Never expose secrets, use RLS, validate inputs
5. **Incremental Development**: Test each module before moving to next

## Next Steps for Development

1. Implement real Supabase authentication
2. Create farmer dashboard with product management
3. Create buyer dashboard with order management
4. Implement matching engine API
5. Build Python AI services
6. Create admin dashboard
7. Add real-time features
8. Implement logistics optimization

## File Structure Guidelines

- **Components**: Place in appropriate `src/components/` subdirectory
- **API Routes**: All in `src/app/api/` with proper REST structure
- **Types**: Database types in `src/types/database.ts`, API types in `src/types/api.ts`
- **Services**: Business logic in `src/services/`
- **Hooks**: Custom React hooks in `src/hooks/`

## Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments only where useful
- Avoid unnecessary dependencies

## Testing Before Deployment

- Verify database connections
- Test authentication flow
- Check RLS policies
- Test API endpoints
- Verify responsive design
- Test demo scenario end-to-end