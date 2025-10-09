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

CREATE TABLE `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
);

-- Chèn dữ liệu ban đầu cho các quyền
INSERT INTO `roles` (name) VALUES ('ROLE_USER');
INSERT INTO `roles` (name) VALUES ('ROLE_ADMIN');


-- ============================================
-- 2. Bảng `users`
-- ============================================
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `account_non_locked` BOOLEAN NOT NULL DEFAULT TRUE, -- Lưu ý: JPA tự động chuyển camelCase `accountNonLocked` thành snake_case `account_non_locked`
    PRIMARY KEY (`id`)
);


-- ============================================
-- 3. Bảng trung gian `user_roles`
-- ============================================
CREATE TABLE `user_roles` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
);


-- ====================== product
CREATE TABLE material(
	`id` BIGINT NOT NULL AUTO_INCREMENT,
    `materialname` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
);
CREATE TABLE `product` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `productname` VARCHAR(255) UNIQUE NOT NULL,
    `material_id`  BIGINT NOT NULL,
	`description` TEXT NOT NULL,
    `product_status` INT NOT NULL, 
    PRIMARY KEY (`id`),
    FOREIGN KEY (`material_id`) REFERENCES `material`(`id`)
);

CREATE TABLE `product_colors` (
    `product_id` BIGINT NOT NULL,
    `hex_code` CHAR(7) NOT NULL,
    PRIMARY KEY (`product_id`, `hex_code`)
);

CREATE TABLE `product_categories` (
    `product_id` BIGINT NOT NULL,
    `categories_id`  BIGINT NOT NULL,
    PRIMARY KEY (`product_id`, `categories_id`),
	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`)
);

CREATE TABLE `product_variants` (
    `product_id` BIGINT NOT NULL,
    `dimensions` VARCHAR(20) NOT NULL,
	`price` DECIMAL(10, 2) NOT NULL,
    `stock_quantity`  BIGINT NOT NULL DEFAULT 0,
    `variant_status` INT NOT NULL DEFAULT 1, 
    PRIMARY KEY (`product_id`,`dimensions`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

ALTER TABLE `product`
ADD COLUMN `thumbnail` VARCHAR(512) NULL 
AFTER `description`;

CREATE TABLE `product_images` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `image_url` VARCHAR(512) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);
