-- Seed Data for SIH 2026 Demo

-- Password: 'demo123' for all users (bcrypt hash)
-- Hash generated using bcrypt with cost factor 10

-- Insert Users
INSERT INTO users (id, email, phone, password_hash, role, is_verified) VALUES
('f123e456-7890-1234-5678-901234567890', 'farmer1@demo.com', '9876543210', '$2b$10$kFTSroCQdwDvQFcUzc.PtucjfENn3f3SvO.7p2kIWL3en4yywtvXe', 'farmer', true),
('f234e567-8901-2345-6789-012345678901', 'farmer2@demo.com', '9876543211', '$2b$10$kFTSroCQdwDvQFcUzc.PtucjfENn3f3SvO.7p2kIWL3en4yywtvXe', 'farmer', true),
('f345e678-9012-3456-7890-123456789012', 'farmer3@demo.com', '9876543212', '$2b$10$kFTSroCQdwDvQFcUzc.PtucjfENn3f3SvO.7p2kIWL3en4yywtvXe', 'farmer', true),
('b456e789-0123-4567-8901-234567890123', 'buyer1@demo.com', '9876543213', '$2b$10$kFTSroCQdwDvQFcUzc.PtucjfENn3f3SvO.7p2kIWL3en4yywtvXe', 'buyer', true),
('b567e890-1234-5678-9012-345678901234', 'buyer2@demo.com', '9876543214', '$2b$10$kFTSroCQdwDvQFcUzc.PtucjfENn3f3SvO.7p2kIWL3en4yywtvXe', 'buyer', true),
('a678e901-2345-6789-0123-456789012345', 'admin@demo.com', '9876543215', '$2b$10$kFTSroCQdwDvQFcUzc.PtucjfENn3f3SvO.7p2kIWL3en4yywtvXe', 'admin', true);

-- Insert Farmers
INSERT INTO farmers (id, user_id, name, type, fpo_name, location_lat, location_lng, address, district, state, pincode, verification_status, total_earnings, rating, total_orders) VALUES
('farmer1', 'f123e456-7890-1234-5678-901234567890', 'Ramesh Kumar', 'individual', NULL, 19.0760, 72.8777, 'Village Road, Nashik', 'Nashik', 'Maharashtra', '422003', 'verified', 150000, 4.5, 25),
('farmer2', 'f234e567-8901-2345-6789-012345678901', 'Suresh FPO', 'fpo', 'Nashik Farmers Cooperative', 19.0860, 72.8877, 'FPO Office, Nashik', 'Nashik', 'Maharashtra', '422004', 'verified', 320000, 4.8, 45),
('farmer3', 'f345e678-9012-3456-7890-123456789012', 'Priya Singh', 'individual', NULL, 19.0960, 72.8977, 'Farm Road, Pune', 'Pune', 'Maharashtra', '411045', 'verified', 95000, 4.2, 18);

-- Insert Buyers
INSERT INTO buyers (id, user_id, name, type, business_name, location_lat, location_lng, address, district, state, pincode, total_savings, total_orders) VALUES
('buyer1', 'b456e789-0123-4567-8901-234567890123', 'Amit Sharma', 'wholesaler', 'Sharma Traders', 19.0330, 73.0297, 'Market Area, Thane', 'Thane', 'Maharashtra', '400601', 45000, 30),
('buyer2', 'b567e890-1234-5678-9012-345678901234', 'Restaurant Green', 'institution', 'Green Kitchen Pvt Ltd', 18.9402, 72.8344, 'Industrial Area, Mumbai', 'Mumbai', 'Maharashtra', '400093', 28000, 15);

-- Insert Products (Tomatoes for the demo scenario)
INSERT INTO products (id, farmer_id, name, category, variety, quantity, unit, price_per_unit, harvest_date, availability_date, is_available, quality_grade, description, min_order_quantity) VALUES
('prod1', 'farmer1', 'Tomatoes', 'Vegetables', 'Roma', 500, 'kg', 25, '2026-09-10', '2026-09-13', true, 'A', 'Fresh Roma tomatoes, perfect for cooking', 50),
('prod2', 'farmer2', 'Tomatoes', 'Vegetables', 'Hybrid', 300, 'kg', 22, '2026-09-11', '2026-09-13', true, 'A', 'High-yield hybrid tomatoes', 30),
('prod3', 'farmer3', 'Tomatoes', 'Vegetables', 'Cherry', 200, 'kg', 35, '2026-09-12', '2026-09-14', true, 'A', 'Sweet cherry tomatoes', 20),
('prod4', 'farmer1', 'Onions', 'Vegetables', 'Red', 400, 'kg', 18, '2026-09-08', '2026-09-13', true, 'A', 'Fresh red onions', 40),
('prod5', 'farmer2', 'Potatoes', 'Vegetables', 'Jyoti', 600, 'kg', 15, '2026-09-09', '2026-09-13', true, 'A', 'Premium Jyoti potatoes', 50),
('prod6', 'farmer3', 'Carrots', 'Vegetables', 'Local', 250, 'kg', 30, '2026-09-10', '2026-09-13', true, 'B', 'Fresh local carrots', 25),
('prod7', 'farmer1', 'Cabbage', 'Vegetables', 'Green', 300, 'kg', 20, '2026-09-11', '2026-09-14', true, 'A', 'Fresh green cabbage', 30),
('prod8', 'farmer2', 'Cauliflower', 'Vegetables', 'Snowball', 200, 'kg', 28, '2026-09-12', '2026-09-14', true, 'A', 'Premium snowball cauliflower', 20);

-- Insert Sample Order (the 800kg tomato order scenario)
INSERT INTO orders (id, buyer_id, status, total_amount, logistics_cost, logistics_savings, intermediary_savings) VALUES
('order1', 'buyer1', 'delivered', 19500, 1200, 800, 2500);

-- Insert Order Items
INSERT INTO order_items (id, order_id, product_id, farmer_id, quantity, unit, price_per_unit, subtotal) VALUES
('item1', 'order1', 'prod1', 'farmer1', 500, 'kg', 25, 12500),
('item2', 'order1', 'prod2', 'farmer2', 300, 'kg', 22, 6600);

-- Insert Logistics Route for the order
INSERT INTO logistics_routes (id, order_id, route_type, total_distance, estimated_duration, route_data, cost) VALUES
('route1', 'order1', 'optimized', 45.5, 120, '{"stops": [{"order": 1, "type": "pickup", "farmer_id": "farmer1", "location": {"lat": 19.0760, "lng": 72.8777}}, {"order": 2, "type": "pickup", "farmer_id": "farmer2", "location": {"lat": 19.0860, "lng": 72.8877}}, {"order": 3, "type": "delivery", "buyer_id": "buyer1", "location": {"lat": 19.0330, "lng": 73.0297}}]}', 1200);

-- Insert Route Stops
INSERT INTO route_stops (id, route_id, stop_order, type, farmer_id, buyer_id, location_lat, location_lng, address, estimated_arrival, status) VALUES
('stop1', 'route1', 1, 'pickup', 'farmer1', NULL, 19.0760, 72.8777, 'Village Road, Nashik', '2026-09-13T09:00:00', 'completed'),
('stop2', 'route1', 2, 'pickup', 'farmer2', NULL, 19.0860, 72.8877, 'FPO Office, Nashik', '2026-09-13T09:45:00', 'completed'),
('stop3', 'route1', 3, 'delivery', NULL, 'buyer1', 19.0330, 73.0297, 'Market Area, Thane', '2026-09-13T11:00:00', 'completed');

-- Insert Demand History (for forecasting)
INSERT INTO demand_history (product_name, date, quantity, region) VALUES
('Tomatoes', '2026-06-01', 4500, 'Maharashtra'),
('Tomatoes', '2026-06-02', 4600, 'Maharashtra'),
('Tomatoes', '2026-06-03', 4550, 'Maharashtra'),
('Tomatoes', '2026-06-04', 4700, 'Maharashtra'),
('Tomatoes', '2026-06-05', 4800, 'Maharashtra'),
('Tomatoes', '2026-06-06', 4750, 'Maharashtra'),
('Tomatoes', '2026-06-07', 4900, 'Maharashtra'),
('Tomatoes', '2026-06-08', 4850, 'Maharashtra'),
('Tomatoes', '2026-06-09', 5000, 'Maharashtra'),
('Tomatoes', '2026-06-10', 5100, 'Maharashtra'),
('Tomatoes', '2026-06-11', 5050, 'Maharashtra'),
('Tomatoes', '2026-06-12', 5200, 'Maharashtra'),
('Tomatoes', '2026-06-13', 5150, 'Maharashtra'),
('Tomatoes', '2026-06-14', 5300, 'Maharashtra'),
('Tomatoes', '2026-06-15', 5250, 'Maharashtra'),
('Onions', '2026-06-01', 3800, 'Maharashtra'),
('Onions', '2026-06-02', 3900, 'Maharashtra'),
('Onions', '2026-06-03', 3850, 'Maharashtra'),
('Onions', '2026-06-04', 4000, 'Maharashtra'),
('Onions', '2026-06-05', 4100, 'Maharashtra'),
('Potatoes', '2026-06-01', 5200, 'Maharashtra'),
('Potatoes', '2026-06-02', 5300, 'Maharashtra'),
('Potatoes', '2026-06-03', 5250, 'Maharashtra'),
('Potatoes', '2026-06-04', 5400, 'Maharashtra'),
('Potatoes', '2026-06-05', 5500, 'Maharashtra');

-- Insert Demand Forecasts
INSERT INTO demand_forecasts (product_name, forecast_date, predicted_quantity, confidence_level, trend, region, model_version) VALUES
('Tomatoes', '2026-09-14', 5400, 85, 'increasing', 'Maharashtra', 'v1.0'),
('Tomatoes', '2026-09-15', 5450, 84, 'increasing', 'Maharashtra', 'v1.0'),
('Tomatoes', '2026-09-16', 5500, 83, 'increasing', 'Maharashtra', 'v1.0'),
('Tomatoes', '2026-09-17', 5480, 82, 'increasing', 'Maharashtra', 'v1.0'),
('Tomatoes', '2026-09-18', 5520, 81, 'increasing', 'Maharashtra', 'v1.0'),
('Tomatoes', '2026-09-19', 5550, 80, 'increasing', 'Maharashtra', 'v1.0'),
('Tomatoes', '2026-09-20', 5580, 79, 'increasing', 'Maharashtra', 'v1.0'),
('Onions', '2026-09-14', 4200, 88, 'stable', 'Maharashtra', 'v1.0'),
('Onions', '2026-09-15', 4250, 87, 'stable', 'Maharashtra', 'v1.0'),
('Onions', '2026-09-16', 4230, 86, 'stable', 'Maharashtra', 'v1.0'),
('Potatoes', '2026-09-14', 5600, 90, 'increasing', 'Maharashtra', 'v1.0'),
('Potatoes', '2026-09-15', 5650, 89, 'increasing', 'Maharashtra', 'v1.0'),
('Potatoes', '2026-09-16', 5700, 88, 'increasing', 'Maharashtra', 'v1.0');

-- Insert Platform Analytics
INSERT INTO platform_analytics (date, total_farmers, total_buyers, total_orders, total_produce_traded, total_farmer_earnings, total_buyer_savings, total_logistics_savings, intermediaries_avoided) VALUES
('2026-09-01', 3, 2, 1, 1000, 25000, 5000, 800, 2),
('2026-09-02', 3, 2, 2, 2500, 62500, 12500, 2000, 5),
('2026-09-03', 3, 2, 3, 4000, 100000, 20000, 3200, 8),
('2026-09-04', 3, 2, 4, 5500, 137500, 27500, 4400, 11),
('2026-09-05', 3, 2, 5, 7000, 175000, 35000, 5600, 14),
('2026-09-06', 3, 2, 6, 8500, 212500, 42500, 6800, 17),
('2026-09-07', 3, 2, 7, 10000, 250000, 50000, 8000, 20),
('2026-09-08', 3, 2, 8, 11500, 287500, 57500, 9200, 23),
('2026-09-09', 3, 2, 9, 13000, 325000, 65000, 10400, 26),
('2026-09-10', 3, 2, 10, 14500, 362500, 72500, 11600, 29),
('2026-09-11', 3, 2, 11, 16000, 400000, 80000, 12800, 32),
('2026-09-12', 3, 2, 12, 17500, 437500, 87500, 14000, 35),
('2026-09-13', 3, 2, 13, 19000, 475000, 95000, 15200, 38);

-- Insert Notifications
INSERT INTO notifications (user_id, type, title, message, is_read, related_order_id) VALUES
('f123e456-7890-1234-5678-901234567890', 'order', 'New Order Received', 'You have received a new order for 500kg of tomatoes', false, 'order1'),
('f234e567-8901-2345-6789-012345678901', 'order', 'New Order Received', 'You have received a new order for 300kg of tomatoes', false, 'order1'),
('b456e789-0123-4567-8901-234567890123', 'order', 'Order Delivered', 'Your order for 800kg of tomatoes has been delivered', false, 'order1');

-- Update farmer earnings and buyer savings based on the sample order
UPDATE farmers SET total_earnings = total_earnings + 12500 WHERE id = 'farmer1';
UPDATE farmers SET total_earnings = total_earnings + 6600 WHERE id = 'farmer2';
UPDATE farmers SET total_orders = total_orders + 1 WHERE id IN ('farmer1', 'farmer2');
UPDATE buyers SET total_savings = total_savings + 3300 WHERE id = 'buyer1';
UPDATE buyers SET total_orders = total_orders + 1 WHERE id = 'buyer1';