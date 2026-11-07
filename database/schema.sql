-- Create Database
CREATE DATABASE IF NOT EXISTS splitwise_campus;
USE splitwise_campus;

-- 1. Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Groups Table
CREATE TABLE Groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. Group_Members Table (Many-to-Many relationship)
CREATE TABLE Group_Members (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. Categories Table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- 5. Expenses Table
CREATE TABLE Expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    paid_by INT NOT NULL,
    category_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (paid_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE RESTRICT
);

-- 6. Expense_Splits Table
CREATE TABLE Expense_Splits (
    split_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    user_id INT NOT NULL,
    share_amount DECIMAL(10, 2) NOT NULL CHECK (share_amount >= 0),
    UNIQUE (expense_id, user_id),
    FOREIGN KEY (expense_id) REFERENCES Expenses(expense_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 7. Settlements Table
CREATE TABLE Settlements (
    settlement_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    paid_by INT NOT NULL,
    received_by INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    settlement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (paid_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 8. Budgets Table
CREATE TABLE Budgets (
    budget_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    budget_month DATE NOT NULL,
    UNIQUE (group_id, budget_month),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id) ON DELETE CASCADE
);

-- Performance Indexes
CREATE INDEX idx_expenses_group_date ON Expenses(group_id, expense_date);
CREATE INDEX idx_splits_user_expense ON Expense_Splits(user_id, expense_id);
CREATE INDEX idx_settlements_group_date ON Settlements(group_id, settlement_date);