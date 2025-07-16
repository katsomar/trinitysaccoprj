USE trinity_sacco;

-- Insert dummy users
INSERT INTO users (name, email, phone, role, password, verified) VALUES
('John Manager', 'manager@example.com', '1234567890', 'manager', 'hashed_password_1', TRUE),
('Jane Saver', 'saver@example.com', '0987654321', 'saver', 'hashed_password_2', TRUE);

-- Insert dummy groups
INSERT INTO groups (name, icon, created_by, interest_rate, period_days) VALUES
('Savings Group A', NULL, 1, 1.5, 30),
('Savings Group B', NULL, 1, 2.0, 60);

-- Insert dummy group members
INSERT INTO group_members (user_id, group_id) VALUES
(2, 1);

-- Insert dummy deposits
INSERT INTO deposits (user_id, amount, method, group_id) VALUES
(2, 500.00, 'MTN', 1);

-- Insert dummy withdrawals
INSERT INTO withdrawals (user_id, amount, method, status, group_id) VALUES
(2, 200.00, 'Airtel', 'pending', 1);

-- Insert dummy transactions
INSERT INTO transactions (user_id, type, amount, description) VALUES
(2, 'deposit', 500.00, 'Initial deposit'),
(2, 'withdrawal', 200.00, 'Requested withdrawal');

-- Insert dummy chats
INSERT INTO chats (sender_id, group_id, message) VALUES
(2, 1, 'Hello, when will the withdrawal be approved?');
