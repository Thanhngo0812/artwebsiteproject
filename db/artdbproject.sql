-- ============================================
-- KHỞI TẠO DATABASE
-- ============================================
DROP DATABASE IF EXISTS artdbproject;

CREATE DATABASE IF NOT EXISTS artdbproject
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Chọn database để làm việc
USE artdbproject;

-- ============================================
-- BẢNG PHÂN QUYỀN VÀ NGƯỜI DÙNG
-- ============================================

-- 1. Bảng `roles` (Quyền)
CREATE TABLE `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
);

-- 2. Bảng `users` (Người dùng)
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `account_non_locked` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`id`)
);

-- 3. Bảng trung gian `user_roles`
CREATE TABLE `user_roles` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
);


-- ============================================
-- BẢNG SẢN PHẨM VÀ CÁC THUỘC TÍNH LIÊN QUAN
-- ============================================

-- 4. Bảng `categories` (Danh mục sản phẩm)
CREATE TABLE `categories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` BIGINT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);


-- 5. Bảng `material` (Chất liệu)
CREATE TABLE `material`(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `materialname` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
);

-- 6. Bảng `product` (Sản phẩm chính)
CREATE TABLE `product` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `productname` VARCHAR(255) UNIQUE NOT NULL,
    `description` TEXT NOT NULL,
    `thumbnail` VARCHAR(512) NULL,
    `material_id`  BIGINT NOT NULL,
    `product_status` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`material_id`) REFERENCES `material`(`id`)
);

-- 7. Bảng trung gian `product_categories`
CREATE TABLE `product_categories` (
    `product_id` BIGINT NOT NULL,
    `categories_id`  BIGINT NOT NULL,
    PRIMARY KEY (`product_id`, `categories_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
    FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`)
);


-- 8. Bảng `product_variants` (Các biến thể của sản phẩm: kích thước, giá)
CREATE TABLE `product_variants` (
    `product_id` BIGINT NOT NULL,
    `dimensions` VARCHAR(20) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stock_quantity`  BIGINT NOT NULL DEFAULT 0,
    `variant_status` INT NOT NULL DEFAULT 1,
    PRIMARY KEY (`product_id`,`dimensions`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

-- 9. Bảng `product_images` (Các hình ảnh chi tiết của sản phẩm)
CREATE TABLE `product_images` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `image_url` VARCHAR(512) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

-- 10. Bảng `product_colors` (Màu sắc của sản phẩm)
CREATE TABLE `product_colors` (
    `product_id` BIGINT NOT NULL,
    `hex_code` CHAR(7) NOT NULL,
    PRIMARY KEY (`product_id`, `hex_code`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);


-- ============================================
-- CHÈN DỮ LIỆU MẪU (INITIAL DATA)
-- ============================================

-- Chèn dữ liệu cho `roles`
INSERT INTO `roles` (name) VALUES ('ROLE_USER');
INSERT INTO `roles` (name) VALUES ('ROLE_ADMIN');

-- Chèn dữ liệu cho `categories`
-- Danh mục cha
INSERT INTO categories (name, parent_id) VALUES ('Tranh Trừu Tượng', NULL); -- Giả sử ID là 1
INSERT INTO categories (name, parent_id) VALUES ('Tranh Phong Cảnh', NULL); -- Giả sử ID là 2
INSERT INTO categories (name, parent_id) VALUES ('Tranh Sơn Dầu', NULL);   -- Giả sử ID là 3

-- Danh mục con của "Tranh Trừu Tượng" (parent_id = 1)
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Hành động', 1);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Trường màu', 1);
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Hình học', 1);
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Trữ tình', 1);