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
    
    -- Thông tin xác thực (Bắt buộc khi đăng ký)
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    
    -- Thông tin hồ sơ (Có thể cập nhật sau)
    `full_name` VARCHAR(255) NULL,
    `phone_number` VARCHAR(20) NULL,
    
    -- Cột quản lý (Dùng cho Spring Security)
    `enabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `account_non_locked` BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Dấu thời gian
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- OTP
    `otp` VARCHAR(6) NULL,
    `otp_requested_time` TIMESTAMP NULL,
    
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

-- 4. Bảng `addresses` (Địa chỉ)
-- Lưu trữ thông tin địa chỉ chi tiết
CREATE TABLE `addresses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `address_name` VARCHAR(255) NOT NULL, -- Tên gợi nhớ (ví dụ: "Nhà riêng", "Công ty")
    `address` TEXT NOT NULL,               -- Địa chỉ dạng văn bản
    `latitude` DECIMAL(10, 8) NULL,        -- Vĩ độ (Có thể NULL nếu chỉ cần địa chỉ văn bản)
    `longitude` DECIMAL(11, 8) NULL,       -- Kinh độ (Có thể NULL)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- ============================================
-- BẢNG SẢN PHẨM VÀ CÁC THUỘC TÍNH LIÊN QUAN
-- ============================================

-- 5. Bảng `categories` (Danh mục sản phẩm)
CREATE TABLE `categories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` BIGINT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

-- 6. Bảng `material` (Chất liệu)
CREATE TABLE `material`(
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `materialname` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
);

-- 7. Bảng `product` (Sản phẩm chính)
CREATE TABLE `product` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `productname` VARCHAR(255) UNIQUE NOT NULL,
    `description` TEXT NOT NULL,
    `thumbnail` VARCHAR(512) NULL,
    `material_id`  BIGINT NOT NULL,
    `product_status` INT NOT NULL,
    `min_price` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `sales_count` BIGINT NULL DEFAULT 0,
    `view_count` BIGINT NULL DEFAULT 0,
    `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`material_id`) REFERENCES `material`(`id`)
);

-- 8. Bảng trung gian `product_categories`
CREATE TABLE `product_categories` (
    `product_id` BIGINT NOT NULL,
    `categories_id`  BIGINT NOT NULL,
    PRIMARY KEY (`product_id`, `categories_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
    FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`)
);

-- 9. Bảng `product_variants` (Các biến thể của sản phẩm: kích thước, giá)
CREATE TABLE `product_variants` (
    `variant_id` BIGINT NOT NULL AUTO_INCREMENT, -- <<< KHÓA CHÍNH MỚI
    `product_id` BIGINT NOT NULL,
    `dimensions` VARCHAR(20) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stock_quantity`  BIGINT NOT NULL DEFAULT 0,
    `variant_status` INT NOT NULL DEFAULT 1,    
    `cost_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (`variant_id`), -- <<< PK mới
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_product_dimension` (`product_id`, `dimensions`) -- <<< Giữ logic cũ
);

-- 10. Bảng `product_images` (Các hình ảnh chi tiết của sản phẩm)
CREATE TABLE `product_images` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `variant_id` BIGINT NOT NULL,
    `image_url` VARCHAR(512) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`variant_id`) ON DELETE CASCADE
);

-- 11. Bảng `product_colors` (Màu sắc của sản phẩm)
CREATE TABLE `product_colors` (
    `product_id` BIGINT NOT NULL,
    `hex_code` CHAR(7) NOT NULL,
    PRIMARY KEY (`product_id`, `hex_code`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

-- 12. Bảng `product_topics` (Lưu tên chủ đề trực tiếp)
CREATE TABLE `product_topics` (
    `product_id` BIGINT NOT NULL,
    `topic_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`product_id`, `topic_name`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

-- ============================================
-- BẢNG ĐƠN HÀNG VÀ CHI TIẾT ĐƠN HÀNG
-- (Mở rộng)
-- ============================================

-- 13. Bảng `orders` (Đơn hàng)
CREATE TABLE `orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
	`latitude` DECIMAL(10, 8) NULL,        -- Vĩ độ (Có thể NULL nếu chỉ cần địa chỉ văn bản)
    `longitude` DECIMAL(11, 8) NULL,       -- Kinh độ (Có thể NULL)
	`address` TEXT NOT NULL,               -- Địa chỉ dạng văn bản
    `subtotal_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Tổng tiền hàng (chưa giảm giá)
    `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Phí vận chuyển
    `discount_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Tổng tiền được giảm
    `total_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- (subtotal + shipping - discount)
    `order_status` VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELED)
    `payment_method` VARCHAR(50) NULL,
    `payment_status` VARCHAR(50) NOT NULL DEFAULT 'UNPAID',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 14. Bảng `order_items` (Chi tiết đơn hàng)
CREATE TABLE `order_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `variant_id` BIGINT NOT NULL, -- Liên kết với biến thể (kích thước/giá) cụ thể
    `quantity` INT NOT NULL,
    `price_at_purchase` DECIMAL(10, 2) NOT NULL, -- Giá của 1 sản phẩm tại thời điểm mua
    `discount_applied` DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Số tiền giảm giá cho riêng mục này
    `cost_price_at_purchase` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`variant_id`) ON DELETE NO ACTION
);

-- ============================================
-- BẢNG QUẢN LÝ KHUYẾN MÃI
-- (Mở rộng)
-- ============================================

-- 15. Bảng `promotions` (Chương trình khuyến mãi)
CREATE TABLE `promotions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL, -- Tên (VD: "Giảm giá Mùa hè", "Coupon VIP 50K")
    `description` TEXT NULL,
    `image_url` VARCHAR(512) NULL, -- <<< CỘT MỚI ĐỂ TRƯNG BÀY
    -- Mã coupon: NẾU NULL, đây là khuyến mãi tự động (SALE). NẾU CÓ GIÁ TRỊ, đây là mã coupon.
    `code` VARCHAR(50) UNIQUE NULL, 
    -- Loại giảm giá: 'PERCENTAGE' (Phần trăm) hoặc 'FIXED_AMOUNT' (Số tiền cố định)
    `type` VARCHAR(20) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL, -- (Lưu 20.00 nếu type='PERCENTAGE', 50000.00 nếu type='FIXED_AMOUNT')
    `start_date` TIMESTAMP NOT NULL,
    `end_date` TIMESTAMP NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    -- Điều kiện áp dụng (cho toàn bộ đơn hàng)
    `min_order_value` DECIMAL(15, 2) DEFAULT 0.00, -- Chỉ áp dụng nếu tổng đơn hàng > giá trị này
    `max_discount_value` DECIMAL(15, 2) NULL, -- (VD: "Giảm 20% TỐI ĐA 100K")
    
    -- Giới hạn sử dụng
    `usage_limit` INT NULL, -- Tổng số lần được phép sử dụng (NULL = không giới hạn)
    `usage_count` INT NOT NULL DEFAULT 0, -- Số lần đã sử dụng
    
    PRIMARY KEY (`id`),
    INDEX `idx_code` (`code`), -- Đánh index cho mã coupon để tìm kiếm nhanh
    INDEX `idx_active_dates` (`is_active`, `start_date`, `end_date`)
);

-- 16. Bảng `promotion_products` (Khuyến mãi áp dụng cho sản phẩm cụ thể)
CREATE TABLE `promotion_products` (
    `promotion_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    PRIMARY KEY (`promotion_id`, `product_id`),
    FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE
);

-- 17. Bảng `promotion_categories` (Khuyến mãi áp dụng cho danh mục cụ thể)
CREATE TABLE `promotion_categories` (
    `promotion_id` BIGINT NOT NULL,
    `categories_id` BIGINT NOT NULL,
    PRIMARY KEY (`promotion_id`, `categories_id`),
    FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);

-- 18. Bảng `order_promotions` (Liên kết Đơn hàng và Khuyến mãi đã dùng)
CREATE TABLE `order_promotions` (
    `order_id` BIGINT NOT NULL,
    `promotion_id` BIGINT NOT NULL,
    `discount_applied_for_this_order` DECIMAL(15, 2) NOT NULL, -- Số tiền thực tế đã giảm cho đơn này
    
    PRIMARY KEY (`order_id`, `promotion_id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`id`) ON DELETE NO ACTION
);

-- ============================================
-- BẢNG QUẢN LÝ THANH TOÁN (VNPAY, MOMO, ...)
-- (Mở rộng)
-- ============================================

-- 19. Bảng `payment_transactions` (Lịch sử giao dịch)
CREATE TABLE `payment_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    
    `gateway` VARCHAR(50) NOT NULL, -- (VNPAY, MOMO, COD, BANK_TRANSFER)
    `gateway_transaction_code` VARCHAR(255) NULL, -- Mã giao dịch của cổng (ví dụ: vnp_TransactionNo)
    `gateway_bank_code` VARCHAR(50) NULL, -- Mã ngân hàng (ví dụ: VCB, TCB)
    
    `amount` DECIMAL(15, 2) NOT NULL, -- Số tiền của giao dịch này
    `payment_time` TIMESTAMP NULL, -- Thời gian cổng thanh toán báo
    `status` VARCHAR(50) NOT NULL, 
    `raw_data` TEXT NULL, -- Lưu toàn bộ JSON/dữ liệu callback (rất hữu ích để gỡ lỗi)
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
    INDEX `idx_gateway_txn_code` (`gateway_transaction_code`)
);


-- ============================================
-- CHÈN DỮ LIỆU MẪU (INITIAL DATA)
-- ============================================

-- Chèn dữ liệu cho `roles`
INSERT INTO `roles` (name) VALUES ('ROLE_USER');
INSERT INTO `roles` (name) VALUES ('ROLE_ADMIN');


-- ============================================
-- trigger CẬP NHẬT `min_price` TRÊN BẢNG `product`
-- ============================================
DELIMITER //

CREATE TRIGGER trg_update_min_price_after_insert
AFTER INSERT ON product_variants
FOR EACH ROW
BEGIN
    UPDATE product
    SET min_price = (
        SELECT MIN(price)
        FROM product_variants
        WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
END;
//

CREATE TRIGGER trg_update_min_price_after_update
AFTER UPDATE ON product_variants
FOR EACH ROW
BEGIN
    -- Chỉ cập nhật nếu giá (price) THỰC SỰ thay đổi
    IF OLD.price <> NEW.price THEN
        UPDATE product
        SET min_price = (
            SELECT MIN(price)
            FROM product_variants
            WHERE product_id = NEW.product_id
        )
        WHERE id = NEW.product_id;
    END IF;
END;
//

CREATE TRIGGER trg_update_min_price_after_delete
AFTER DELETE ON product_variants
FOR EACH ROW
BEGIN
    UPDATE product
    SET min_price = (
        -- Lấy giá min mới từ các biến thể còn lại
        SELECT MIN(price) 
        FROM product_variants
        WHERE product_id = OLD.product_id
    )
    WHERE id = OLD.product_id;
END;
//

DELIMITER ;

INSERT INTO categories (name, parent_id) VALUES ('Tranh Trừu Tượng', NULL); -- ID 1
INSERT INTO categories (name, parent_id) VALUES ('Tranh Phong Cảnh', NULL); -- ID 2
INSERT INTO categories (name, parent_id) VALUES ('Tranh Sơn Dầu', NULL);    -- ID 3
INSERT INTO categories (name, parent_id) VALUES ('Tranh Nghệ Thuật', NULL); -- ID 4
INSERT INTO categories (name, parent_id) VALUES ('Khung Tranh', NULL);      -- ID 5

-- Danh mục con của "Tranh Trừu Tượng" (parent_id = 1)
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Hành động', 1); -- ID 6
INSERT INTO categories (name, parent_id) VALUES ('Tranh Trường màu', 1); -- ID 7
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Hình học', 1); -- ID 8
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Trữ tình', 1); -- ID 9
-- Danh mục con của "Tranh Phong Cảnh" (parent_id = 2)
INSERT INTO categories (name, parent_id) VALUES ('Tranh Biển', 2); -- ID 10
INSERT INTO categories (name, parent_id) VALUES ('Tranh Núi Rừng', 2); -- ID 11
INSERT INTO categories (name, parent_id) VALUES ('Tranh Đồng Quê', 2); -- ID 12
INSERT INTO categories (name, parent_id) VALUES ('Tranh Thành Phố', 2); -- ID 13

-- Danh mục con của "Tranh Sơn Dầu" (parent_id = 3)
INSERT INTO categories (name, parent_id) VALUES ('Sơn Dầu Chân dung', 3); -- ID 14
INSERT INTO categories (name, parent_id) VALUES ('Sơn Dầu Tĩnh vật', 3); -- ID 15
INSERT INTO categories (name, parent_id) VALUES ('Sơn Dầu Hiện đại', 3); -- ID 16

-- Danh mục con của "Tranh Nghệ Thuật" (parent_id = 4)
INSERT INTO categories (name, parent_id) VALUES ('Tranh Ấn Tượng', 4); -- ID 17
INSERT INTO categories (name, parent_id) VALUES ('Tranh Lập Thể', 4); -- ID 18
INSERT INTO categories (name, parent_id) VALUES ('Tranh Siêu Thực', 4); -- ID 19
INSERT INTO categories (name, parent_id) VALUES ('Tranh Phục Hưng', 4); -- ID 20

-- Danh mục con của "Khung Tranh" (parent_id = 5)
INSERT INTO categories (name, parent_id) VALUES ('Khung Gỗ Cổ điển', 5); -- ID 21
INSERT INTO categories (name, parent_id) VALUES ('Khung Kim Loại Hiện đại', 5); -- ID 22
INSERT INTO categories (name, parent_id) VALUES ('Khung Composite', 5); -- ID 23
INSERT INTO categories (name, parent_id) VALUES ('Khung Tranh Đơn Giản', 5); -- ID 24

















