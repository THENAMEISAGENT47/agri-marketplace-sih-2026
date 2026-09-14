-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Farmers can view/edit their own profile
CREATE POLICY "Farmers can view own profile" ON farmers
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Farmers can update own profile" ON farmers
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Buyers can view/edit their own profile
CREATE POLICY "Buyers can view own profile" ON buyers
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Buyers can update own profile" ON buyers
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Products: Farmers can manage their own, everyone can view available
CREATE POLICY "Anyone can view available products" ON products
    FOR SELECT USING (is_available = true);

CREATE POLICY "Farmers can view own products" ON products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM farmers 
            WHERE farmers.id = products.farmer_id 
            AND farmers.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Farmers can insert own products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM farmers 
            WHERE farmers.id = products.farmer_id 
            AND farmers.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Farmers can update own products" ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM farmers 
            WHERE farmers.id = products.farmer_id 
            AND farmers.user_id::text = auth.uid()::text
        )
    );

-- Orders: Buyers can view their own, Farmers can view orders for their products
CREATE POLICY "Buyers can view own orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM buyers 
            WHERE buyers.id = orders.buyer_id 
            AND buyers.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Farmers can view relevant orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM order_items 
            WHERE order_items.order_id = orders.id 
            AND order_items.farmer_id IN (
                SELECT id FROM farmers WHERE user_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Buyers can insert orders" ON orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM buyers 
            WHERE buyers.id = orders.buyer_id 
            AND buyers.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Buyers can update own orders" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM buyers 
            WHERE buyers.id = orders.buyer_id 
            AND buyers.user_id::text = auth.uid()::text
        )
    );

-- Order Items
CREATE POLICY "Buyers can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.buyer_id IN (
                SELECT id FROM buyers WHERE user_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Farmers can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM farmers 
            WHERE farmers.id = order_items.farmer_id 
            AND farmers.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "System can insert order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- Logistics Routes
CREATE POLICY "Buyers can view own logistics routes" ON logistics_routes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = logistics_routes.order_id 
            AND orders.buyer_id IN (
                SELECT id FROM buyers WHERE user_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Farmers can view relevant logistics routes" ON logistics_routes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM order_items 
            WHERE order_items.order_id = logistics_routes.order_id 
            AND order_items.farmer_id IN (
                SELECT id FROM farmers WHERE user_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "System can insert logistics routes" ON logistics_routes
    FOR INSERT WITH CHECK (true);

-- Route Stops
CREATE POLICY "Buyers can view own route stops" ON route_stops
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM logistics_routes lr
            JOIN orders o ON o.id = lr.order_id
            WHERE lr.id = route_stops.route_id 
            AND o.buyer_id IN (
                SELECT id FROM buyers WHERE user_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Farmers can view relevant route stops" ON route_stops
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM route_stops rs
            JOIN logistics_routes lr ON lr.id = rs.route_id
            JOIN order_items oi ON oi.order_id = lr.order_id
            WHERE rs.id = route_stops.id 
            AND oi.farmer_id IN (
                SELECT id FROM farmers WHERE user_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "System can insert route stops" ON route_stops
    FOR INSERT WITH CHECK (true);

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Demand tables (public read access for demo purposes)
CREATE POLICY "Anyone can view demand history" ON demand_history
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view demand forecasts" ON demand_forecasts
    FOR SELECT USING (true);

-- Platform analytics (public read access for demo)
CREATE POLICY "Anyone can view platform analytics" ON platform_analytics
    FOR SELECT USING (true);

-- Note: For production, you may want to restrict demand and analytics access to authenticated users only