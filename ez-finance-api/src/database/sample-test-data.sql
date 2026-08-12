-- EZ Finance sample data for testing
-- MySQL database: ez_finance
-- All accounts use password: 123456
--
-- Run after tables are created by migration.

USE ez_finance;

START TRANSACTION;

-- Remove old sample data if this script was run before.
DELETE b
FROM budgets b
JOIN users u ON u.id = b.userId
WHERE u.email IN ('demo@ezfinance.com', 'an@ezfinance.com', 'binh@ezfinance.com');

DELETE t
FROM transactions t
JOIN users u ON u.id = t.userId
WHERE u.email IN ('demo@ezfinance.com', 'an@ezfinance.com', 'binh@ezfinance.com');

DELETE c
FROM categories c
JOIN users u ON u.id = c.userId
WHERE u.email IN ('demo@ezfinance.com', 'an@ezfinance.com', 'binh@ezfinance.com');

DELETE FROM users
WHERE email IN ('demo@ezfinance.com', 'an@ezfinance.com', 'binh@ezfinance.com');

-- Bcrypt hash for password: 123456
SET @password_hash = '$2b$10$v1ID/DRttqT701xaoDIeu.uW2Pv0plmOqQdZ9SiFS8zBZjUPl3EyS';

INSERT INTO users (fullName, email, passwordHash)
VALUES ('Demo User', 'demo@ezfinance.com', @password_hash);
SET @demo_user_id = LAST_INSERT_ID();

INSERT INTO users (fullName, email, passwordHash)
VALUES ('Nguyen Van An', 'an@ezfinance.com', @password_hash);
SET @an_user_id = LAST_INSERT_ID();

INSERT INTO users (fullName, email, passwordHash)
VALUES ('Tran Minh Binh', 'binh@ezfinance.com', @password_hash);
SET @binh_user_id = LAST_INSERT_ID();

-- Categories for Demo User
INSERT INTO categories (name, type, icon, color, userId) VALUES
('Salary', 'INCOME', 'briefcase', '#2E7D32', @demo_user_id),
('Freelance', 'INCOME', 'laptop', '#00897B', @demo_user_id),
('Investment', 'INCOME', 'trending-up', '#1565C0', @demo_user_id),
('Food', 'EXPENSE', 'restaurant', '#FF9800', @demo_user_id),
('Transport', 'EXPENSE', 'car', '#1976D2', @demo_user_id),
('Shopping', 'EXPENSE', 'shopping-bag', '#C2185B', @demo_user_id),
('Bills', 'EXPENSE', 'receipt', '#455A64', @demo_user_id),
('Entertainment', 'EXPENSE', 'film', '#7B1FA2', @demo_user_id),
('Health', 'EXPENSE', 'heart', '#D32F2F', @demo_user_id);

-- Categories for Nguyen Van An
INSERT INTO categories (name, type, icon, color, userId) VALUES
('Salary', 'INCOME', 'briefcase', '#2E7D32', @an_user_id),
('Freelance', 'INCOME', 'laptop', '#00897B', @an_user_id),
('Investment', 'INCOME', 'trending-up', '#1565C0', @an_user_id),
('Food', 'EXPENSE', 'restaurant', '#FF9800', @an_user_id),
('Transport', 'EXPENSE', 'car', '#1976D2', @an_user_id),
('Shopping', 'EXPENSE', 'shopping-bag', '#C2185B', @an_user_id),
('Bills', 'EXPENSE', 'receipt', '#455A64', @an_user_id),
('Health', 'EXPENSE', 'heart', '#D32F2F', @an_user_id);

-- Categories for Tran Minh Binh
INSERT INTO categories (name, type, icon, color, userId) VALUES
('Salary', 'INCOME', 'briefcase', '#2E7D32', @binh_user_id),
('Freelance', 'INCOME', 'laptop', '#00897B', @binh_user_id),
('Food', 'EXPENSE', 'restaurant', '#FF9800', @binh_user_id),
('Transport', 'EXPENSE', 'car', '#1976D2', @binh_user_id),
('Shopping', 'EXPENSE', 'shopping-bag', '#C2185B', @binh_user_id),
('Education', 'EXPENSE', 'book', '#512DA8', @binh_user_id),
('Entertainment', 'EXPENSE', 'film', '#7B1FA2', @binh_user_id);

-- Category variables for Demo User
SELECT id INTO @demo_salary_id FROM categories WHERE userId = @demo_user_id AND name = 'Salary' AND type = 'INCOME' LIMIT 1;
SELECT id INTO @demo_freelance_id FROM categories WHERE userId = @demo_user_id AND name = 'Freelance' AND type = 'INCOME' LIMIT 1;
SELECT id INTO @demo_food_id FROM categories WHERE userId = @demo_user_id AND name = 'Food' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @demo_transport_id FROM categories WHERE userId = @demo_user_id AND name = 'Transport' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @demo_shopping_id FROM categories WHERE userId = @demo_user_id AND name = 'Shopping' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @demo_bills_id FROM categories WHERE userId = @demo_user_id AND name = 'Bills' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @demo_entertainment_id FROM categories WHERE userId = @demo_user_id AND name = 'Entertainment' AND type = 'EXPENSE' LIMIT 1;

-- Category variables for Nguyen Van An
SELECT id INTO @an_salary_id FROM categories WHERE userId = @an_user_id AND name = 'Salary' AND type = 'INCOME' LIMIT 1;
SELECT id INTO @an_investment_id FROM categories WHERE userId = @an_user_id AND name = 'Investment' AND type = 'INCOME' LIMIT 1;
SELECT id INTO @an_food_id FROM categories WHERE userId = @an_user_id AND name = 'Food' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @an_transport_id FROM categories WHERE userId = @an_user_id AND name = 'Transport' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @an_health_id FROM categories WHERE userId = @an_user_id AND name = 'Health' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @an_bills_id FROM categories WHERE userId = @an_user_id AND name = 'Bills' AND type = 'EXPENSE' LIMIT 1;

-- Category variables for Tran Minh Binh
SELECT id INTO @binh_salary_id FROM categories WHERE userId = @binh_user_id AND name = 'Salary' AND type = 'INCOME' LIMIT 1;
SELECT id INTO @binh_freelance_id FROM categories WHERE userId = @binh_user_id AND name = 'Freelance' AND type = 'INCOME' LIMIT 1;
SELECT id INTO @binh_food_id FROM categories WHERE userId = @binh_user_id AND name = 'Food' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @binh_transport_id FROM categories WHERE userId = @binh_user_id AND name = 'Transport' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @binh_shopping_id FROM categories WHERE userId = @binh_user_id AND name = 'Shopping' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @binh_education_id FROM categories WHERE userId = @binh_user_id AND name = 'Education' AND type = 'EXPENSE' LIMIT 1;
SELECT id INTO @binh_entertainment_id FROM categories WHERE userId = @binh_user_id AND name = 'Entertainment' AND type = 'EXPENSE' LIMIT 1;

-- Transactions for Demo User
INSERT INTO transactions (title, amount, type, transactionDate, note, userId, categoryId) VALUES
('Salary August', 15000000.00, 'INCOME', '2026-08-01', 'Monthly salary', @demo_user_id, @demo_salary_id),
('Freelance mobile screen', 2000000.00, 'INCOME', '2026-08-08', 'Freelance project payment', @demo_user_id, @demo_freelance_id),
('Lunch with friends', 50000.00, 'EXPENSE', '2026-08-05', 'Lunch at school', @demo_user_id, @demo_food_id),
('Grocery shopping', 300000.00, 'EXPENSE', '2026-08-07', 'Food for this week', @demo_user_id, @demo_food_id),
('Grab to university', 85000.00, 'EXPENSE', '2026-08-06', 'Transport fee', @demo_user_id, @demo_transport_id),
('New sneakers', 1200000.00, 'EXPENSE', '2026-08-10', 'Shopping demo data', @demo_user_id, @demo_shopping_id),
('Internet bill', 250000.00, 'EXPENSE', '2026-08-02', 'Monthly internet', @demo_user_id, @demo_bills_id),
('Movie ticket', 180000.00, 'EXPENSE', '2026-08-11', 'Weekend movie', @demo_user_id, @demo_entertainment_id),
('Salary July', 15000000.00, 'INCOME', '2026-07-01', 'Previous month salary', @demo_user_id, @demo_salary_id),
('July grocery', 900000.00, 'EXPENSE', '2026-07-12', 'Previous month food', @demo_user_id, @demo_food_id),
('July bills', 1200000.00, 'EXPENSE', '2026-07-20', 'Previous month bills', @demo_user_id, @demo_bills_id),
('Salary June', 14500000.00, 'INCOME', '2026-06-01', 'June salary', @demo_user_id, @demo_salary_id),
('June transport', 650000.00, 'EXPENSE', '2026-06-15', 'June transport', @demo_user_id, @demo_transport_id);

-- Transactions for Nguyen Van An
INSERT INTO transactions (title, amount, type, transactionDate, note, userId, categoryId) VALUES
('Salary August', 12000000.00, 'INCOME', '2026-08-01', 'Monthly salary', @an_user_id, @an_salary_id),
('Stock dividend', 500000.00, 'INCOME', '2026-08-03', 'Investment income', @an_user_id, @an_investment_id),
('Breakfast', 45000.00, 'EXPENSE', '2026-08-04', 'Breakfast near office', @an_user_id, @an_food_id),
('Family dinner', 420000.00, 'EXPENSE', '2026-08-09', 'Dinner with family', @an_user_id, @an_food_id),
('Bus pass', 300000.00, 'EXPENSE', '2026-08-02', 'Monthly bus pass', @an_user_id, @an_transport_id),
('Medicine', 400000.00, 'EXPENSE', '2026-08-06', 'Health expense', @an_user_id, @an_health_id),
('Electricity bill', 650000.00, 'EXPENSE', '2026-08-12', 'Monthly electricity', @an_user_id, @an_bills_id),
('Salary July', 12000000.00, 'INCOME', '2026-07-01', 'Previous month salary', @an_user_id, @an_salary_id),
('July food', 1100000.00, 'EXPENSE', '2026-07-15', 'Previous month food', @an_user_id, @an_food_id);

-- Transactions for Tran Minh Binh
INSERT INTO transactions (title, amount, type, transactionDate, note, userId, categoryId) VALUES
('Salary August', 18000000.00, 'INCOME', '2026-08-01', 'Monthly salary', @binh_user_id, @binh_salary_id),
('Freelance backend API', 3500000.00, 'INCOME', '2026-08-05', 'Backend project payment', @binh_user_id, @binh_freelance_id),
('Coffee meeting', 75000.00, 'EXPENSE', '2026-08-03', 'Coffee with team', @binh_user_id, @binh_food_id),
('Lunch', 90000.00, 'EXPENSE', '2026-08-04', 'Lunch at company', @binh_user_id, @binh_food_id),
('Taxi', 220000.00, 'EXPENSE', '2026-08-06', 'Airport taxi', @binh_user_id, @binh_transport_id),
('Laptop accessories', 1600000.00, 'EXPENSE', '2026-08-07', 'Keyboard and mouse', @binh_user_id, @binh_shopping_id),
('Online course', 1500000.00, 'EXPENSE', '2026-08-08', 'Programming course', @binh_user_id, @binh_education_id),
('Concert ticket', 700000.00, 'EXPENSE', '2026-08-11', 'Entertainment', @binh_user_id, @binh_entertainment_id),
('Salary July', 17500000.00, 'INCOME', '2026-07-01', 'Previous month salary', @binh_user_id, @binh_salary_id),
('July shopping', 2400000.00, 'EXPENSE', '2026-07-18', 'Previous month shopping', @binh_user_id, @binh_shopping_id);

-- Budgets for Demo User
INSERT INTO budgets (limitAmount, month, year, userId, categoryId) VALUES
(3000000.00, 8, 2026, @demo_user_id, @demo_food_id),
(1000000.00, 8, 2026, @demo_user_id, @demo_transport_id),
(2000000.00, 8, 2026, @demo_user_id, @demo_shopping_id),
(1200000.00, 8, 2026, @demo_user_id, @demo_bills_id),
(800000.00, 8, 2026, @demo_user_id, @demo_entertainment_id),
(2500000.00, 7, 2026, @demo_user_id, @demo_food_id),
(1000000.00, 7, 2026, @demo_user_id, @demo_bills_id);

-- Budgets for Nguyen Van An
INSERT INTO budgets (limitAmount, month, year, userId, categoryId) VALUES
(2500000.00, 8, 2026, @an_user_id, @an_food_id),
(900000.00, 8, 2026, @an_user_id, @an_transport_id),
(1000000.00, 8, 2026, @an_user_id, @an_health_id),
(900000.00, 8, 2026, @an_user_id, @an_bills_id),
(2200000.00, 7, 2026, @an_user_id, @an_food_id);

-- Budgets for Tran Minh Binh
INSERT INTO budgets (limitAmount, month, year, userId, categoryId) VALUES
(2800000.00, 8, 2026, @binh_user_id, @binh_food_id),
(1200000.00, 8, 2026, @binh_user_id, @binh_transport_id),
(2500000.00, 8, 2026, @binh_user_id, @binh_shopping_id),
(2000000.00, 8, 2026, @binh_user_id, @binh_education_id),
(1000000.00, 8, 2026, @binh_user_id, @binh_entertainment_id),
(2600000.00, 7, 2026, @binh_user_id, @binh_shopping_id);

COMMIT;

-- Test accounts:
-- demo@ezfinance.com / 123456
-- an@ezfinance.com / 123456
-- binh@ezfinance.com / 123456
--
-- Useful APIs:
-- GET /api/reports/dashboard?month=8&year=2026
-- GET /api/reports/monthly?year=2026
-- GET /api/categories
-- GET /api/budgets?month=8&year=2026

