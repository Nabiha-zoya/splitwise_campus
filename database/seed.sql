USE splitwise_campus;

-- Seed Sample Users (passwords hashed using bcrypt placeholder)
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

-- Seed Group Members
INSERT INTO group_members (group_id, user_id) VALUES
(1, 1), -- Alice
(1, 2), -- Bob
(1, 3), -- Charlie
(1, 4), -- David
(1, 5); -- Eve

-- Seed Group Budget for current month
INSERT INTO budgets (group_id, amount, budget_month) VALUES
(1, 10000.00, '2026-11-01');

-- Seed Sample Expenses
-- Expense 1: Hotel paid by Alice (2000.00)
INSERT INTO expenses (group_id, paid_by, category_id, description, amount, expense_date) 
VALUES (1, 1, 3, 'Hotel Stay', 2000.00, '2026-11-01');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(1, 1, 400.00),
(1, 2, 400.00),
(1, 3, 400.00),
(1, 4, 400.00),
(1, 5, 400.00);

-- Expense 2: Food paid by Bob (1000.00)
INSERT INTO expenses (group_id, paid_by, category_id, description, amount, expense_date) 
VALUES (1, 2, 1, 'Chinatown Dinner', 1000.00, '2026-11-02');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(2, 1, 200.00),
(2, 2, 200.00),
(2, 3, 200.00),
(2, 4, 200.00),
(2, 5, 200.00);

-- Expense 3: Transport paid by Charlie (500.00)
INSERT INTO expenses (group_id, paid_by, category_id, description, amount, expense_date) 
VALUES (1, 3, 2, 'Local SIM & Taxi', 500.00, '2026-11-03');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(3, 1, 100.00),
(3, 2, 100.00),
(3, 3, 100.00),
(3, 4, 100.00),
(3, 5, 100.00);

-- Expense 4: Tickets paid by David (500.00)
INSERT INTO expenses (group_id, paid_by, category_id, description, amount, expense_date) 
VALUES (1, 4, 6, 'Event Tickets', 500.00, '2026-11-04');

INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES
(4, 1, 100.00),
(4, 2, 100.00),
(4, 3, 100.00),
(4, 4, 100.00),
(4, 5, 100.00);