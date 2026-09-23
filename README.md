# AgriMarketplace — Smart India Hackathon 2026

A digital agricultural procurement marketplace for connecting farmers/FPOs with buyers and coordinating supplier discovery, multi-supplier fulfilment, orders, inventory and logistics.

> **PS 26033**  
> **Theme:** Agriculture, FoodTech & Rural Development  
> **Category:** Software  
> **Team:** Krishi Innovators

## Problem

Agricultural procurement can involve multiple intermediary layers between producers and buyers. This can reduce transparency, fragment supply, and make large-volume procurement harder for buyers and small producers.

AgriMarketplace provides a digital coordination layer for:

- Direct farmer/FPO listings
- Buyer requirements
- Supplier matching
- Multi-supplier allocation
- Order and inventory management
- Demand-forecasting workflows
- Route-optimization workflows

## Prototype capabilities

### Farmers / FPOs
- List produce and inventory
- Manage crop batches
- View allocated orders
- Track earnings and order information
- Maintain producer profiles

### Buyers
- Browse produce listings
- Create bulk procurement requirements
- Run supplier matching
- Place and track orders
- View procurement information

### Platform
- Farmer / FPO / Buyer / Admin roles
- Supabase authentication and PostgreSQL
- Row-Level Security (RLS)
- Supplier matching with transparent scoring
- Demand forecasting workflow
- Route optimization workflow
- Orders and inventory
- Notifications and analytics UI
- English / Hindi interface
- Responsive web experience

## 800 kg tomato scenario

The repository includes a demonstration scenario:

- Buyer requirement: **800 kg tomatoes**
- Ramesh Kumar: **500 kg @ ₹25/kg = ₹12,500**
- Suresh FPO: **300 kg @ ₹22/kg = ₹6,600**
- Combined requirement: **800 kg**

This is prototype/demo data and should not be interpreted as a field-measured economic result.

## Technical stack

### Frontend
- Next.js **16.3.5**
- React **19.2.8**
- TypeScript
- Tailwind CSS v4
- Zustand
- TanStack React Query
- Recharts
- Zod

### Backend / data
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Row-Level Security
- Next.js API routes

### Python services
- FastAPI
- Demand-forecasting service
- Route-optimization service
- Demo fallbacks when Python services are unavailable

### Current intelligence model
The current matching, forecasting and routing implementation is **algorithmic/demo logic**. The repository does not currently claim production-trained ML performance.

## Architecture

```
Users
  ↓
Next.js / React
  ↓
Next.js API Routes
  ↓
Supabase / PostgreSQL
  ↕
Python / FastAPI
  ├─ Demand Forecasting
  └─ Route Optimization
```

## Project structure

```
src/                    Next.js application
src/components/         UI, role and AI components
src/services/           Matching, logistics and analytics
src/lib/                Auth, Supabase, demo and validation helpers
src/types/              Database and API types
python-services/        FastAPI services
supabase/migrations/    Database schema, RLS and seed data
public/                 Static assets
```

## Setup

### Install

```bash
npm install
```

### Environment

Create a local `.env.local` using `.env.example`.

Required variables include:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
DEMAND_FORECASTING_SERVICE_URL
ROUTE_OPTIMIZATION_SERVICE_URL
NODE_ENV
```

Never commit local environment files or real credentials.

### Database

Run the migrations in order:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_seed_data.sql
```

### Optional Python services

```bash
cd python-services/demand-forecasting
pip install -r requirements.txt
python main.py
```

and:

```bash
cd python-services/route-optimization
pip install -r requirements.txt
python main.py
```

### Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Current status

### Implemented / demonstrated
- Marketplace
- Farmer/FPO portal
- Buyer portal
- Admin portal
- Authentication
- Role-based access
- Supplier matching
- Multi-supplier allocation
- Demand forecasting workflow
- Route optimization workflow
- Orders and inventory
- Analytics and notification UI
- English / Hindi interface

### Future deployment work
- Payment gateway integration
- Production ML training and validation
- Live routing-provider integration
- Production-grade external market/weather integrations
- Native mobile application
- Full production realtime notification infrastructure

## Planned technologies not currently implemented

The current repository does **not** contain active implementations for:

- SQLite offline-sync architecture
- OpenAI chatbot APIs
- OpenWeatherMap
- OpenRouteService / Google Maps production routing
- XGBoost
- Random Forest
- A specialized linear-regression price prediction model

Treat these as future architecture ideas unless they are added to the codebase.

## Security notes

- Environment files are ignored by Git.
- Supabase service-role access is intended for server-side use.
- RLS policies are included in the database migrations.
- Input validation uses Zod.
- The public seed data is demo data and should not be replaced with real personal information.

## Official ecosystem references

- e-NAM — National Agriculture Market
- AGMARKNET — Agricultural Marketing Information Network
- data.gov.in — Government of India open-data platform

## Repository

https://github.com/THENAMEISAGENT47/agri-marketplace-sih-2026

## Development commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Built for **Smart India Hackathon 2026** by **Krishi Innovators**.
