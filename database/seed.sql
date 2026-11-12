USE splitwise_campus;

-- Seed Sample Users
INSERT INTO users (name, email, password_hash) VALUES
('Ananya', 'ananya@campus.edu', '$2b$10$SampleHashAnanya123'),
('Ashika', 'ashika@campus.edu', '$2b$10$SampleHashAshika123'),
('Shreya', 'shreya@campus.edu', '$2b$10$SampleHashShreya123'),
('Swasthi', 'swasthi@campus.edu', '$2b$10$SampleHashSwasthi123'),
('Deeksha', 'deeksha@campus.edu', '$2b$10$SampleHashDeeksha123'),
('Zoya', 'zoya@campus.edu', '$2b$10$SampleHashZoya123');

-- Seed Sample Group
INSERT INTO `groups` (group_name, created_by) VALUES
('Goa College Trip', 1);

-- Seed Group Members (All 6 Students)
INSERT INTO group_members (group_id, user_id) VALUES
(1, 1), -- Ananya
(1, 2), -- Ashika
(1, 3), -- Shreya
(1, 4), -- Swasthi
(1, 5), -- Deeksha
(1, 6); -- Zoya

-- Seed Group Budget for November 2026
INSERT INTO budgets (group_id, amount, budget_month) VALUES
(1, 10000.00, '2026-11-01');

-- Expense 1: Hotel paid by Ananya (₹2000)
INSERT INTO expenses
(group_id, paid_by, category_id, description, amount, expense_date)
VALUES (1, 1, 3, 'Hotel Stay', 2000.00, '2026-11-01');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(1, 1, 333.34), -- Ananya
(1, 2, 333.34), -- Ashika
(1, 3, 333.33), -- Shreya
(1, 4, 333.33), -- Swasthi
(1, 5, 333.33), -- Deeksha
(1, 6, 333.33); -- Zoya

-- Expense 2: Food paid by Ashika (₹1000)
INSERT INTO expenses
(group_id, paid_by, category_id, description, amount, expense_date)
VALUES (1, 2, 1, 'Chinatown Dinner', 1000.00, '2026-11-02');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(2, 1, 166.67), -- Ananya
(2, 2, 166.67), -- Ashika
(2, 3, 166.67), -- Shreya
(2, 4, 166.67), -- Swasthi
(2, 5, 166.66), -- Deeksha
(2, 6, 166.66); -- Zoya

-- Expense 3: Transport paid by Shreya (₹500)
INSERT INTO expenses
(group_id, paid_by, category_id, description, amount, expense_date)
VALUES (1, 3, 2, 'Local SIM & Taxi', 500.00, '2026-11-03');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(3, 1, 83.34), -- Ananya
(3, 2, 83.34), -- Ashika
(3, 3, 83.33), -- Shreya
(3, 4, 83.33), -- Swasthi
(3, 5, 83.33), -- Deeksha
(3, 6, 83.33); -- Zoya

-- Expense 4: Tickets paid by Swasthi (₹500)
INSERT INTO expenses
(group_id, paid_by, category_id, description, amount, expense_date)
VALUES (1, 4, 6, 'Event Tickets', 500.00, '2026-11-04');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(4, 1, 83.34), -- Ananya
(4, 2, 83.34), -- Ashika
(4, 3, 83.33), -- Shreya
(4, 4, 83.33), -- Swasthi
(4, 5, 83.33), -- Deeksha
(4, 6, 83.33); -- Zoya