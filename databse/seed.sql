CREATE DATABASE IF NOT EXISTS online_exam_db;
USE online_exam_db;

INSERT INTO users (name, email, password, role, active)
VALUES
('Admin', 'admin@exam.com', '$2a$10$HASH', 'admin', 1);
