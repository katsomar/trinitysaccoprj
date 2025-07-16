CREATE DATABASE IF NOT EXISTS trinity_sacco;

USE trinity_sacco;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    role ENUM('manager', 'saver'),
    password VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    icon VARCHAR(255),
    created_by INT,
    interest_rate FLOAT,
    period_days INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE group_members (
    user_id INT,
    group_id INT,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE deposits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount FLOAT,
    method ENUM('MTN', 'Airtel', 'Bank', 'Cash'),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    group_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE withdrawals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount FLOAT,
    method ENUM('MTN', 'Airtel', 'Bank', 'Cash'),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approve_date TIMESTAMP NULL,
    group_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('deposit', 'withdrawal'),
    amount FLOAT,
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    group_id INT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE verifications (
    user_id INT PRIMARY KEY,
    type ENUM('email', 'identity'),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    doc_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deposit_id INT,
    file_path VARCHAR(255),
    date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deposit_id) REFERENCES deposits(id)
);
