CREATE DATABASE IF NOT EXISTS artdbproject
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Chọn database để làm việc
USE artdbproject;

INSERT INTO categories (name, parent_id) 
VALUES ('Tranh Trừu Tượng', NULL); 
-- Giả sử ID của "Tranh Trừu Tượng" là 7

-- 1. Trừu Tượng Hành động (Action Painting - Jackson Pollock)
INSERT INTO categories (name, parent_id) 
VALUES ('Trừu Tượng Hành động', 1);

-- 2. Tranh Trường màu (Color Field Painting - Mark Rothko)
INSERT INTO categories (name, parent_id) 
VALUES ('Tranh Trường màu', 1);

-- 3. Trừu Tượng Hình học (Geometric Abstraction - Piet Mondrian)
INSERT INTO categories (name, parent_id) 
VALUES ('Trừu Tượng Hình học', 1);

-- 4. Trừu Tượng Trữ tình (Lyrical Abstraction - Wassily Kandinsky)
INSERT INTO categories (name, parent_id) 
VALUES ('Trừu Tượng Trữ tình', 1);
-- 1. Tranh truyền thống
INSERT INTO categories (name, parent_id) VALUES ('Tranh Phong Cảnh', NULL); 

-- 2. Nghệ thuật Hiện đại
INSERT INTO categories (name, parent_id) VALUES ('Tranh Sơn Dầu', NULL); 

