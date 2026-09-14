# AgriMarketplace - Smart India Hackathon 2026

A digital agricultural marketplace that directly connects farmers/FPOs with consumers and bulk buyers, reducing unnecessary intermediaries and increasing earnings for everyone in the supply chain.

## 🌾 Problem Statement (PS 26033)

Multiple intermediaries reduce farmers' earnings and increase consumer prices. This platform eliminates middlemen by creating direct connections between farmers and buyers.

## ✨ Key Features

### For Farmers/FPOs
- **Direct Selling**: List products directly to buyers without intermediaries
- **Smart Pricing**: AI-powered demand forecasting for optimal pricing
- **Order Management**: Track orders and manage deliveries
- **Earnings Dashboard**: View total earnings and order history
- **Location-Based**: Buyers can find farmers by location

### For Buyers
- **Direct Sourcing**: Buy directly from farmers at better prices
- **Smart Matching**: AI-powered supplier matching for requirements
- **Price Comparison**: Compare prices across multiple farmers
- **Order Tracking**: Real-time order status and tracking
- **Bulk Orders**: Support for large quantity orders

### Platform Features
- **AI Demand Forecasting**: Predict future demand for better planning
- **Route Optimization**: Efficient logistics planning and cost savings
- **Real-time Analytics**: Platform impact metrics and insights
- **Admin Dashboard**: User management and platform oversight

## 🚀 Tech Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with agricultural theme
- **Supabase**: Authentication, database, and real-time features
- **React Query**: Data fetching and caching
- **Zustand**: State management
- **Recharts**: Data visualization

### Backend
- **Supabase PostgreSQL**: Primary database with RLS
- **Supabase Auth**: Authentication and user management
- **Next.js API Routes**: Business logic and API endpoints

### AI/ML Services (Python)
- **FastAPI**: AI microservices
- **scikit-learn**: Demand forecasting models
- **Custom algorithms**: Route optimization and matching

## 📁 Project Structure

```
agri-marketplace/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/             # Authentication pages
│   │   ├── register/          # Registration pages
│   │   ├── marketplace/       # Public marketplace
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── farmer/            # Farmer-specific components
│   │   ├── buyer/             # Buyer-specific components
│   │   ├── admin/             # Admin-specific components
│   │   └── shared/            # Shared components
│   ├── lib/
│   │   ├── supabase/          # Supabase client setup
│   │   ├── validation/        # Zod schemas
│   │   └── utils.ts           # Helper functions
│   ├── services/
│   │   ├── matching/          # Matching engine logic
│   │   ├── logistics/         # Logistics calculations
│   │   └── analytics/         # Analytics calculations
│   ├── types/                 # TypeScript type definitions
│   └── hooks/                 # Custom React hooks
├── python-services/           # AI microservices
│   ├── demand-forecasting/    # Demand forecasting service
│   └── route-optimization/    # Route optimization service
├── supabase/
│   ├── migrations/            # Database migrations
│   └── seed-data/             # Demo data scripts
└── public/                    # Static assets
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your Project URL, anon key, and service role key

### Step 3: Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AgriMarketplace
DEMAND_FORECASTING_SERVICE_URL=http://localhost:8001
ROUTE_OPTIMIZATION_SERVICE_URL=http://localhost:8002
NODE_ENV=development
```

### Step 4: Set Up Database
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_data.sql`

### Step 5: (Optional) Set Up Python AI Services

The AI services have built-in demo fallbacks, so they work without Python. For full functionality:

```bash
# Install Python dependencies
cd python-services/demand-forecasting
pip install -r requirements.txt

cd ../route-optimization
pip install -r requirements.txt

# Start services (in separate terminals)
cd python-services/demand-forecasting
python main.py  # Runs on port 8001

cd python-services/route-optimization
python main.py  # Runs on port 8002
```

**Note:** The Next.js application will automatically use demo fallbacks if these services are not running.

### Step 6: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Demo Credentials

The seed data includes demo accounts for testing:

- **Farmer**: farmer1@demo.com / demo123
- **Buyer**: buyer1@demo.com / demo123
- **Admin**: admin@demo.com / demo123

## 📊 Demo Scenario

The platform includes a complete demo scenario:

1. **Farmer lists 500kg of tomatoes** - Available in marketplace
2. **Buyer needs 800kg** - Can browse and search products
3. **Multiple suitable farmers** - System shows matching suppliers
4. **Matching engine** - Recommends best combination
5. **AI demand forecast** - Shows expected tomato demand
6. **Order placement** - Buyer can place orders
7. **Logistics optimization** - Generates delivery plan
8. **Farmer dashboard** - Shows orders and earnings
9. **Buyer tracking** - Shows order status and tracking
10. **Admin analytics** - Platform impact metrics

## 🎯 Current Implementation Status

### ✅ Completed
- Project setup with Next.js, TypeScript, Tailwind CSS
- Database schema with 11 tables and proper relationships
- Row-Level Security (RLS) policies
- Demo seed data (3 farmers, 2 buyers, 8 products, sample orders)
- Reusable UI component library
- Landing page with platform overview
- Authentication pages (login/register)
- Marketplace page with product browsing
- **Authentication system** with Supabase integration
- **Farmer dashboard** with product management, orders, and profile
- **Buyer dashboard** with orders, profile, and savings tracking
- **AI Matching engine** with transparent scoring and supplier combinations
- **AI Demand forecasting service** (Python FastAPI with demo fallback)
- **AI Route optimization service** (Python FastAPI with demo fallback)
- **AI Services UI components** integrated into buyer dashboard
- Responsive design for mobile, tablet, and desktop

### � In Progress
- Admin dashboard with user management and platform analytics
- Real-time order tracking with live updates
- Notification system for order events

### 📋 Planned
- Payment integration
- Advanced analytics with charts
- Mobile app (React Native)
- Integration with real routing APIs (OSRM/Google Maps)
- Production ML models for demand forecasting

## 🔒 Security Features

- Row-Level Security (RLS) for database access
- Role-based access control (farmer, buyer, admin)
- Secure password hashing
- Input validation with Zod schemas
- Environment variable protection
- API route protection

## 📈 Platform Impact

The platform aims to deliver:
- **25% increase** in farmer earnings
- **30% reduction** in consumer prices  
- **40% savings** in logistics costs
- **2-3 intermediaries** eliminated from supply chain

## 🤝 Contributing

This is a Smart India Hackathon 2026 project. For contributions, please follow the standard Git workflow:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is created for Smart India Hackathon 2026.

## 🙏 Acknowledgments

- Smart India Hackathon 2026
- Supabase for the excellent backend services
- Next.js team for the amazing framework
- All contributors and team members

## 📞 Support

For questions or support during the hackathon, please contact the team through the official SIH channels.

---

**Built with ❤️ for Smart India Hackathon 2026**