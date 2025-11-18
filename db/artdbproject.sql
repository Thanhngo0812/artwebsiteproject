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
    `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
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
    `customer_name` VARCHAR(255) NULL,
    `customer_phone` VARCHAR(255) NULL,
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


-- CHÈN DỮ LIỆU MẪU (50 SẢN PHẨM) - CẬP NHẬT MÔ TẢ
-- ============================================
START TRANSACTION;

-- ============================================
-- 1. CHÈN LIỆU (MATERIALS)
-- ============================================
INSERT INTO `material` (`materialname`) VALUES
('Sơn dầu'),          -- ID 1
('Acrylic'),          -- ID 2
('Màu nước'),         -- ID 3
('Gỗ Tự Nhiên'),      -- ID 4
('Kim loại'),         -- ID 5
('Vải canvas'),       -- ID 6
('Giấy mỹ thuật'),    -- ID 7
('Composite');        -- ID 8

-- ============================================
-- SẢN PHẨM 1: Tranh Trừu Tượng (2 variants)
-- ============================================
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Bình minh rực rỡ', 
'Tác phẩm trừu tượng hiện đại "Bình minh rực rỡ" là bản giao hưởng của những gam màu nóng đầy năng lượng. Với kỹ thuật sơn dầu đắp nổi, nghệ sĩ đã khéo léo tái hiện khoảnh khắc mặt trời vừa ló dạng, mang lại cảm giác hứng khởi, ấm áp và tràn đầy sức sống cho không gian phòng khách hoặc văn phòng làm việc.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product1_thumb_frlue9.jpg', 1, 1, 150);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 2);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '60x80cm', 1800000, 10, 1200000),
(@product_id, '70x60cm', 2500000, 5, 1700000);

SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777459/product1_variant1_rzkhad.jpg'),
(@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777463/product1_variant2_fmisum.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FF5733'), (@product_id, '#FFC300');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bình minh'), (@product_id, 'Trừu tượng');

-- ============================================
-- SẢN PHẨM 2: Tranh Phong Cảnh (1 variant)
-- ============================================
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Hoàng hôn trên biển', 
'Bức tranh bắt trọn khoảnh khắc hoàng hôn buông xuống mặt biển tĩnh lặng. Sự hòa quyện tinh tế giữa sắc tím, cam đỏ và xanh thẫm của chất liệu Acrylic cao cấp trên nền canvas tạo nên chiều sâu hun hút, gợi lên cảm giác bình yên, thư thái và lãng mạn sau một ngày dài.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product2_thumb_zbopzv.jpg', 2, 1, 220);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 10);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '50x70cm', 950000, 15, 600000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777464/product2_variant1_qowaeg.jpg'),
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777454/product2_variant1_1_s9k82h.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#C70039'), (@product_id, '#FFC300');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Hoàng hôn'), (@product_id, 'Biển');

-- ============================================
-- SẢN PHẨM 3: Khung Tranh (3 variants)
-- ============================================
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Khung Gỗ Sồi Cổ Điển', 
'Được chế tác thủ công từ gỗ sồi tự nhiên nhập khẩu, mẫu khung này sở hữu những đường vân gỗ sang trọng cùng hoa văn chạm khắc tinh xảo theo phong cách cổ điển Châu Âu. Sản phẩm bền bỉ theo thời gian, là lớp áo hoàn hảo để tôn vinh vẻ đẹp của những bức tranh sơn dầu quý giá.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product3_thumb_spqhbl.jpg', 4, 1, 80);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 21);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '40x60cm', 450000, 30, 300000),
(@product_id, '50x70cm', 550000, 25, 350000),
(@product_id, '60x90cm', 700000, 20, 450000);

SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
SET @variant3_id = @variant1_id + 2;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777453/product3_variant1_p6hwlb.jpg'),
(@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777454/product3_variant1_1_zb4dcs.jpg'),
(@variant3_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777455/product3_variant2_deim2b.jpg'),
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777455/product3_variant2_1_tvobps.jpg'),
(@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777454/product3_variant3_ozq5y8.jpg'),
(@variant3_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777454/product3_variant3_1_a5bism.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#59B8CA'), (@product_id, '#121313');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Cổ điển');

-- ============================================
-- SẢN PHẨM 4: Tranh Sơn Dầu Chân dung (1 variant)
-- ============================================
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Thiếu nữ bên hoa Huệ', 
'Tác phẩm sơn dầu phục dựng kiệt tác nghệ thuật Việt Nam, khắc họa vẻ đẹp dịu dàng, đài các của người thiếu nữ trong tà áo dài trắng tinh khôi bên hoa huệ tây. Từng nét cọ mềm mại làm toát lên nét duyên dáng, e ấp và hoài niệm của vẻ đẹp Á Đông truyền thống.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777546/product4_thumb_xv7s3r.jpg', 1, 1, 310);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 14);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '70x100cm', 4500000, 3, 3000000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777455/product4_variant1_c7ccnp.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FFFFFF'), (@product_id, '#34A853');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Chân dung'), (@product_id, 'Cổ điển');

-- ============================================
-- SẢN PHẨM 5: Tranh Lập Thể (1 variant)
-- ============================================
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Góc phố Lập thể', 
'Một cái nhìn độc đáo và táo bạo về phố thị qua lăng kính Lập thể. Sự phân mảnh, sắp xếp lại các khối hình học sắc cạnh kết hợp cùng chất liệu Acrylic rực rỡ tạo nên một không gian đa chiều, thách thức thị giác và kích thích trí tưởng tượng phong phú của người xem.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777496/product5_thumb_xrrocj.jpg', 2, 1, 120);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 18);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '60x80cm', 30000000, 5, 20000000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777454/product5_variant1_egi5el.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4285F4'), (@product_id, '#DB4437');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Lập thể'), (@product_id, 'Thành phố');

-- ============================================
-- SẢN PHẨM 6 - 10 (Nhóm Phong Cảnh)
-- ============================================

-- SP 6
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Rừng thông Sương mờ', 
'Bức tranh màu nước trong trẻo tái hiện khung cảnh rừng thông Đà Lạt chìm trong sương sớm. Những vệt màu loang nhẹ nhàng, tinh tế tạo nên độ mờ ảo, huyền bí, mang lại không khí se lạnh và tĩnh mịch đặc trưng của phố núi mộng mơ.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product6_thumb_pxv9l4.jpg', 3, 1, 180);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 11);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '40x60cm', 700000, 12, 400000),
(@product_id, '60x90cm', 1100000, 7, 700000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777455/product6_variant1_ajtdzr.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#B0D1C5'), (@product_id, '#4E6C50');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Rừng'), (@product_id, 'Sương mờ');

-- SP 7
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Cánh đồng lúa chín', 
'Bức tranh sơn dầu rực rỡ sắc vàng óng ả của cánh đồng lúa chín trải dài bất tận. Hình ảnh làng quê Việt Nam vào mùa gặt hiện lên mộc mạc, no ấm và thanh bình qua từng nét vẽ chân thực, gợi nhớ về những ký ức tuổi thơ êm đềm.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777497/product7_thumb_w3bp6d.jpg', 1, 1, 250);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 12);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '60x80cm', 2800000, 8, 1800000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777454/product7_variant1_s9rzaf.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777455/product7_variant1_1_xuvjnu.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product7_variant1_2_rvy7a4.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product7_variant1_3_xyc1z8.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#F4B400'), (@product_id, '#34A853');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Đồng quê'), (@product_id, 'Mùa gặt');

-- SP 8
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Phố cổ Hội An về đêm', 
'Vẻ đẹp lung linh, huyền ảo của Hội An về đêm được tái hiện sống động qua chất liệu Acrylic. Ánh sáng ấm áp từ những chiếc đèn lồng phản chiếu xuống dòng sông Hoài tạo nên một khung cảnh lãng mạn, đậm chất thơ và hoài cổ, điểm tô cho không gian sống thêm phần ấm cúng.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777497/product8_thumb_qb7kye.jpg', 2, 1, 300);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 13);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '100x80cm', 1600000, 10, 1000000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product8_variant1_tvcbjz.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#DB4437'), (@product_id, '#F4B400');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Phố cổ'), (@product_id, 'Hội An');

-- SP 9
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Vịnh Hạ Long', 
'Tuyệt tác thiên nhiên Vịnh Hạ Long được thu nhỏ trong bức tranh sơn dầu hoành tráng. Những ngọn núi đá vôi sừng sững giữa làn nước xanh ngọc bích được miêu tả tỉ mỉ, toát lên vẻ đẹp hùng vĩ, tráng lệ của di sản thiên nhiên thế giới, mang lại cảm giác khoáng đạt.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777497/product9_thumb_wovsmy.jpg', 1, 1, 190);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 10);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '80x120cm', 3500000, 5, 2500000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product9_variant1_ivm1qm.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4285F4'), (@product_id, '#0F9D58');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Vịnh'), (@product_id, 'Biển');

-- SP 10
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Suối trong rừng', 
'Sự tươi mát của thiên nhiên được gửi gắm trọn vẹn qua bức tranh màu nước tinh tế. Dòng suối róc rách chảy qua những tảng đá rêu phong dưới tán cây xanh mát tạo nên một không gian thư giãn tuyệt đối, giúp gột rửa mọi ưu phiền của cuộc sống bận rộn.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product10_thumb_ghigsi.jpg', 3, 1, 110);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 11);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '50x70cm', 4500000, 20, 3500000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product10_variant1_fme2ah.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#92B4A7'), (@product_id, '#638889');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Suối'), (@product_id, 'Rừng');

-- ============================================
-- SẢN PHẨM 11 - 15 (Nhóm Trừu Tượng)
-- ============================================

-- SP 11
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Vũ điệu của màu sắc', 
'Một tác phẩm bùng nổ cảm xúc thuộc trường phái Trừu tượng hành động (Action Painting). Những vệt màu được vẩy, tạt đầy ngẫu hứng và mạnh mẽ tạo nên một vũ điệu thị giác đầy mê hoặc, thể hiện sự tự do phóng khoáng không giới hạn của tâm hồn nghệ sĩ.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product11_thumb_uvsrzg.jpg', 2, 1, 130);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 6);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '70x70cm', 1900000, 8, 1200000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777457/product11_variant1_1_fdhmwo.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg'), (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777456/product11_variant1_vldbim.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#DB4437'), (@product_id, '#4285F4'), (@product_id, '#F4B400');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Trừu tượng'), (@product_id, 'Hành động');

-- SP 12
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Hình học Giao thoa', 
'Sự cân bằng hoàn hảo giữa các khối hình học cơ bản và mảng màu tương phản mạnh mẽ. Tác phẩm mang phong cách tối giản nhưng hiện đại, tạo điểm nhấn thị giác ấn tượng và mang lại vẻ đẹp ngăn nắp, tinh tế cho không gian kiến trúc đương đại.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product12_thumb_qpoquw.jpg', 2, 1, 90);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 8);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '50x70cm', 1300000, 15, 800000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777457/product12_variant1_iqbklv.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#000000'), (@product_id, '#FFFFFF'), (@product_id, '#FF0000');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Hình học'), (@product_id, 'Tối giản');

-- SP 13
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Nỗi buồn Trữ tình', 
'Tác phẩm trừu tượng trữ tình sử dụng gam màu lạnh chủ đạo, gợi lên những cung bậc cảm xúc sâu lắng và nội tâm. Những đường nét mềm mại, uyển chuyển như những giai điệu buồn man mác, mời gọi người xem chìm đắm vào suy tư và chiêm nghiệm.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product13_thumb_qxcvnm.jpg', 1, 1, 160);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 9);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '80x140cm', 2200000, 6, 1500000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777457/product13_variant1_p7zthy.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777457/product13_variant1_1_mp6opa.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#3C4043'), (@product_id, '#AECBFA');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Trữ tình'), (@product_id, 'Nội tâm');

-- SP 14
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Khoảng lặng Màu Vàng', 
'Đại diện tiêu biểu cho nghệ thuật Trường màu (Color Field), tác phẩm là một mảng màu vàng thuần khiết, ấm áp bao phủ toàn bộ không gian. Bức tranh tạo ra một khoảng lặng thiền định, mang lại cảm giác lạc quan và mở rộng không gian thị giác đến vô tận.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777499/product14_thumb_f7kbak.jpg', 1, 1, 75);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 7);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '220x100cm', 7000000, 12, 4000000),
(@product_id, '100x150cm', 11000000, 7, 7000000);

SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777458/product14_variant2_pkd06m.jpg'),(@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777457/product14_variant1_ppkkpt.jpg')
,(@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777458/product14_variant1_1_uszxw9.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#F4B400'), (@product_id, '#FDE293');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Trường màu'), (@product_id, 'Tối giản');

-- SP 15
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Hỗn mang Có Sắp đặt', 
'Thoạt nhìn như một sự hỗn độn của màu sắc và đường nét, nhưng tác phẩm trừu tượng này lại ẩn chứa một trật tự ngầm đầy tính nghệ thuật. Sự tương phản giữa nóng và lạnh, giữa các lớp màu dày và mỏng trên canvas tạo nên một kết cấu bề mặt phong phú, đầy khiêu khích và tò mò.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777535/product15_thumb_vohox3.jpg', 6, 1, 105);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 6);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '80x100cm', 1700000, 9, 1100000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777458/product15_variant1_u5hydm.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#D94F3D'), (@product_id, '#4A5C4A');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Trừu tượng'), (@product_id, 'Hỗn loạn');

-- ============================================
-- SẢN PHẨM 16 - 20 (Nhóm Sơn Dầu)
-- ============================================

-- SP 16
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Tĩnh vật Bình hoa Cúc', 
'Bức tĩnh vật sơn dầu mang đậm hơi hướng cổ điển, khắc họa vẻ đẹp giản dị nhưng thanh cao của bình hoa cúc vàng. Ánh sáng và bóng đổ được xử lý tinh tế, tạo nên độ khối chân thực và sự tĩnh lặng tuyệt đối, rất hợp để treo tại phòng ăn hoặc góc đọc sách.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777544/product16_thumb_zrbpgq.jpg', 1, 1, 280);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 15);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '50x60cm', 1800000, 10, 1200000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777458/product16_variant1_xcm0ti.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#F4B400'), (@product_id, '#8B4513');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Tĩnh vật'), (@product_id, 'Hoa');

-- SP 17
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Chân dung Bác Giáp', 
'Bức chân dung sơn dầu tả thực khắc họa thần thái uy nghiêm nhưng vô cùng đôn hậu của Đại tướng. Từng nếp nhăn, ánh mắt tinh anh và vầng trán cao được nghệ sĩ chăm chút tỉ mỉ, thể hiện sự kính trọng sâu sắc và ghi dấu ấn thời gian oai hùng lên vị tướng huyền thoại của dân tộc.', 
'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product17_thumb_wrf4e3.jpg', 1, 1, 210);

SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 14);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '40x50cm', 5500000, 2, 4000000);

SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777459/product17_variant1_buxg5l.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777458/product17_variant1_1_lhlx3w.jpg');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Chân dung'), (@product_id, 'Tả thực');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E5B296'), (@product_id, '#F0F1F2');

-- ============-- ============================================
-- LÀM SẠCH DỮ LIỆU CŨ
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `addresses`;
TRUNCATE TABLE `user_roles`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. TẠO 30 USER (USERNAME > 8 KÝ TỰ)
-- Password mặc định là hash của "Password@123" (độ dài > 8)
-- ============================================
INSERT INTO `users` (`username`, `email`, `password`, `full_name`, `phone_number`, `enabled`, `created_at`) VALUES
-- KHÁCH TẠI TP.HCM (User 1-10)
('nguyen_van_an_1990', 'an.nguyen90@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity1', 'Nguyễn Văn An', '0901000001', 1, '2022-01-10'),
('tran_thi_bich_1992', 'bich.tran92@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity2', 'Trần Thị Bích', '0901000002', 1, '2022-02-15'),
('le_van_cuong_dev', 'cuong.dev@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity3', 'Lê Văn Cường', '0901000003', 1, '2022-03-20'),
('pham_thi_dung_design', 'dung.pham@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity4', 'Phạm Thị Dung', '0901000004', 1, '2022-04-05'),
('hoang_van_em_student', 'em.hoang@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity5', 'Hoàng Văn Em', '0901000005', 1, '2022-05-12'),
('do_van_hung_manager', 'hung.do@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity6', 'Đỗ Văn Hùng', '0901000006', 1, '2022-06-18'),
('ngo_thi_giau_ceo', 'giau.ngo@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity7', 'Ngô Thị Giàu', '0901000007', 1, '2022-07-22'),
('vu_van_hai_architect', 'hai.vu@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity8', 'Vũ Văn Hải', '0901000008', 1, '2022-08-30'),
('bui_thi_it_nurse', 'it.bui@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity9', 'Bùi Thị Ít', '0901000009', 1, '2022-09-10'),
('dang_van_j_doctor', 'j.dang@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity0', 'Đặng Văn Hưng', '0901000010', 1, '2022-10-11'),

-- KHÁCH TẠI HÀ NỘI (User 11-20)
('nguyen_thi_kim_hn', 'kim.hn@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity1', 'Nguyễn Thị Kim', '0901000011', 1, '2022-11-01'),
('tran_van_long_sales', 'long.sales@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity2', 'Trần Văn Long', '0901000012', 1, '2022-12-12'),
('le_thi_mai_marketing', 'mai.mkt@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity3', 'Lê Thị Mai', '0901000013', 1, '2023-01-05'),
('pham_van_nam_coder', 'nam.coder@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity4', 'Phạm Văn Nam', '0901000014', 1, '2023-02-14'),
('hoang_thi_oanh_hr', 'oanh.hr@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity5', 'Hoàng Thị Oanh', '0901000015', 1, '2023-03-08'),
('do_van_phuc_driver', 'phuc.driver@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity6', 'Đỗ Văn Phúc', '0901000016', 1, '2023-04-30'),
('ngo_van_quan_army', 'quan.army@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity7', 'Ngô Văn Quân', '0901000017', 1, '2023-05-15'),
('vu_thi_rang_chef', 'rang.chef@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity8', 'Vũ Thị Rạng', '0901000018', 1, '2023-06-20'),
('bui_van_son_artist', 'son.artist@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity9', 'Bùi Văn Sơn', '0901000019', 1, '2023-07-25'),
('dang_thi_tuyet_spa', 'tuyet.spa@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity0', 'Đặng Thị Tuyết', '0901000020', 1, '2023-08-05'),

-- KHÁCH TẠI ĐÀ NẴNG (User 21-30)
('tran_van_uy_tourguide', 'uy.guide@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity1', 'Trần Văn Uy', '0901000021', 1, '2023-09-09'),
('le_thi_van_teacher', 'van.teacher@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity2', 'Lê Thị Vân', '0901000022', 1, '2023-10-20'),
('pham_van_vuong_gym', 'vuong.gym@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity3', 'Phạm Văn Vượng', '0901000023', 1, '2023-11-11'),
('hoang_thi_xuan_bank', 'xuan.bank@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity4', 'Hoàng Thị Xuân', '0901000024', 1, '2023-12-24'),
('do_van_y_photographer', 'y.photo@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity5', 'Đỗ Văn Ý', '0901000025', 1, '2024-01-01'),
('ngo_thi_zen_yoga', 'zen.yoga@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity6', 'Ngô Thị Zến', '0901000026', 1, '2024-02-14'),
('vu_van_anh_logistics', 'anh.logis@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity7', 'Vũ Văn Anh', '0901000027', 1, '2024-03-10'),
('bui_thi_binh_seller', 'binh.sell@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity8', 'Bùi Thị Bình', '0901000028', 1, '2024-04-20'),
('dang_van_cuong_it', 'cuong.it@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity9', 'Đặng Văn Cường', '0901000029', 1, '2024-05-05'),
('nguyen_thi_duyen_acc', 'duyen.acc@gmail.com', '$2a$10$X7.dummyhashverylongstringforsecurity0', 'Nguyễn Thị Duyên', '0901000030', 1, '2024-06-01');

INSERT INTO `user_roles` (`user_id`, `role_id`) SELECT `id`, 1 FROM `users`;

-- ============================================
-- 2. TẠO ĐỊA CHỈ VỚI TOẠ ĐỘ THỰC TẾ (LAT/LONG)
-- ============================================
INSERT INTO `addresses` (`user_id`, `address_name`, `address`, `latitude`, `longitude`, `is_default`) VALUES
-- === TP. HỒ CHÍ MINH (Users 1-10) ===
(1, 'Bitexco Financial Tower', '2 Hải Triều, Bến Nghé, Quận 1, TP.HCM', 10.771589, 106.704416, 1),
(2, 'Landmark 81', '720A Điện Biên Phủ, Bình Thạnh, TP.HCM', 10.795129, 106.721830, 1),
(3, 'Chợ Bến Thành', 'Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM', 10.772109, 106.698263, 1),
(4, 'Sân bay Tân Sơn Nhất', 'Trường Sơn, Phường 2, Tân Bình, TP.HCM', 10.818463, 106.658825, 1),
(5, 'Crescent Mall', '101 Tôn Dật Tiên, Tân Phú, Quận 7, TP.HCM', 10.729330, 106.721534, 1),
(6, 'Aeon Mall Bình Tân', '1 Đường Số 17A, Bình Trị Đông B, Bình Tân, TP.HCM', 10.759926, 106.613905, 1),
(7, 'Đại học Bách Khoa', '268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM', 10.773374, 106.659732, 1),
(8, 'Thảo Cầm Viên', '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, TP.HCM', 10.787558, 106.705276, 1),
(9, 'Dinh Độc Lập', '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP.HCM', 10.776992, 106.695323, 1),
(10, 'Chung cư Masteri Thảo Điền', '159 Xa lộ Hà Nội, Thảo Điền, Quận 2, TP.HCM', 10.801442, 106.740364, 1),

-- === HÀ NỘI (Users 11-20) ===
(11, 'Hồ Gươm (Hoàn Kiếm)', 'Đinh Tiên Hoàng, Hàng Trống, Hoàn Kiếm, Hà Nội', 21.028511, 105.854167, 1),
(12, 'Royal City', '72A Nguyễn Trãi, Thượng Đình, Thanh Xuân, Hà Nội', 21.004027, 105.814433, 1),
(13, 'Lăng Chủ tịch Hồ Chí Minh', '2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội', 21.036779, 105.834648, 1),
(14, 'Sân vận động Mỹ Đình', 'Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội', 21.020436, 105.763031, 1),
(15, 'Aeon Mall Long Biên', '27 Cổ Linh, Long Biên, Hà Nội', 21.026363, 105.903752, 1),
(16, 'Times City', '458 Minh Khai, Vĩnh Phú, Hai Bà Trưng, Hà Nội', 20.995483, 105.867267, 1),
(17, 'Hồ Tây (Phủ Tây Hồ)', 'Đặng Thai Mai, Quảng An, Tây Hồ, Hà Nội', 21.064828, 105.826281, 1),
(18, 'Toà nhà Keangnam', 'Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội', 21.016780, 105.784053, 1),
(19, 'Đại học Quốc Gia HN', '144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 21.037446, 105.783218, 1),
(20, 'Nhà hát lớn Hà Nội', '1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 21.024398, 105.857492, 1),

-- === ĐÀ NẴNG (Users 21-30) ===
(21, 'Cầu Rồng', 'Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng', 16.061118, 108.222684, 1),
(22, 'Bãi biển Mỹ Khê', 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng', 16.062655, 108.246684, 1),
(23, 'Bà Nà Hills (Cổng)', 'Hoà Ninh, Hòa Vang, Đà Nẵng', 16.032236, 108.039604, 1),
(24, 'Sân bay Đà Nẵng', 'Duy Tân, Hòa Thuận Tây, Hải Châu, Đà Nẵng', 16.043923, 108.199385, 1),
(25, 'Ngũ Hành Sơn', '81 Huyền Trân Công Chúa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng', 16.006676, 108.263399, 1),
(26, 'Công viên Châu Á', '1 Phan Đăng Lưu, Hoà Cường Bắc, Hải Châu, Đà Nẵng', 16.039514, 108.227322, 1),
(27, 'Đại học Bách Khoa ĐN', '54 Nguyễn Lương Bằng, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng', 16.075409, 108.153209, 1),
(28, 'Vincom Plaza Đà Nẵng', '910A Ngô Quyền, An Hải Bắc, Sơn Trà, Đà Nẵng', 16.072634, 108.229489, 1),
(29, 'Chùa Linh Ứng', 'Bãi Bụt, Thọ Quang, Sơn Trà, Đà Nẵng', 16.100798, 108.277817, 1),
(30, 'InterContinental Resort', 'Bãi Bắc, Thọ Quang, Sơn Trà, Đà Nẵng', 16.120187, 108.306358, 1);

-- ============================================
-- 3. TẠO 60 ĐƠN HÀNG (GẮN VỚI CÁC USER Ở TRÊN)
-- Vẫn giữ logic thời gian từ 2022-2025
-- ============================================

-- ----- NĂM 2022 (20 Đơn - COMPLETED) -----
INSERT INTO `orders` (`user_id`, `customer_name`, `customer_phone`, `address`, `latitude`, `longitude`, `subtotal_price`, `shipping_fee`, `total_price`, `order_status`, `payment_status`, `created_at`) VALUES
(1, 'Nguyễn Văn An', '0901000001', '2 Hải Triều, Bến Nghé, Quận 1, TP.HCM', 10.771589, 106.704416, 1800000, 30000, 1830000, 'DELIVERED', 'PAID', '2022-01-15 10:00:00'),
(2, 'Trần Thị Bích', '0901000002', '720A Điện Biên Phủ, Bình Thạnh, TP.HCM', 10.795129, 106.721830, 950000, 30000, 980000, 'DELIVERED', 'PAID', '2022-02-20 09:30:00'),
(3, 'Lê Văn Cường', '0901000003', 'Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM', 10.772109, 106.698263, 550000, 30000, 580000, 'DELIVERED', 'PAID', '2022-03-05 14:20:00'),
(4, 'Phạm Thị Dung', '0901000004', 'Trường Sơn, Phường 2, Tân Bình, TP.HCM', 10.818463, 106.658825, 4500000, 50000, 4550000, 'DELIVERED', 'PAID', '2022-03-25 16:00:00'),
(5, 'Hoàng Văn Em', '0901000005', '101 Tôn Dật Tiên, Tân Phú, Quận 7, TP.HCM', 10.729330, 106.721534, 700000, 30000, 730000, 'DELIVERED', 'PAID', '2022-04-10 08:00:00'),
(6, 'Đỗ Văn Hùng', '0901000006', '1 Đường Số 17A, Bình Trị Đông B, Bình Tân, TP.HCM', 10.759926, 106.613905, 2800000, 40000, 2840000, 'DELIVERED', 'PAID', '2022-05-05 11:15:00'),
(7, 'Ngô Thị Giàu', '0901000007', '268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM', 10.773374, 106.659732, 1600000, 35000, 1635000, 'DELIVERED', 'PAID', '2022-06-12 13:45:00'),
(8, 'Vũ Văn Hải', '0901000008', '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, TP.HCM', 10.787558, 106.705276, 3500000, 50000, 3550000, 'DELIVERED', 'PAID', '2022-07-20 15:30:00'),
(9, 'Bùi Thị Ít', '0901000009', '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP.HCM', 10.776992, 106.695323, 4500000, 50000, 4550000, 'DELIVERED', 'PAID', '2022-08-15 09:00:00'),
(10, 'Đặng Văn Hưng', '0901000010', '159 Xa lộ Hà Nội, Thảo Điền, Quận 2, TP.HCM', 10.801442, 106.740364, 1900000, 40000, 1940000, 'DELIVERED', 'PAID', '2022-09-05 10:20:00'),
(11, 'Nguyễn Thị Kim', '0901000011', 'Đinh Tiên Hoàng, Hàng Trống, Hoàn Kiếm, Hà Nội', 21.028511, 105.854167, 1300000, 30000, 1330000, 'DELIVERED', 'PAID', '2022-09-25 14:50:00'),
(12, 'Trần Văn Long', '0901000012', '72A Nguyễn Trãi, Thượng Đình, Thanh Xuân, Hà Nội', 21.004027, 105.814433, 2200000, 40000, 2240000, 'DELIVERED', 'PAID', '2022-10-10 11:10:00'),
(13, 'Lê Thị Mai', '0901000013', '2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội', 21.036779, 105.834648, 7000000, 100000, 7100000, 'DELIVERED', 'PAID', '2022-10-30 16:40:00'),
(14, 'Phạm Văn Nam', '0901000014', 'Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội', 21.020436, 105.763031, 1700000, 35000, 1735000, 'DELIVERED', 'PAID', '2022-11-15 08:30:00'),
(15, 'Hoàng Thị Oanh', '0901000015', '27 Cổ Linh, Long Biên, Hà Nội', 21.026363, 105.903752, 1800000, 30000, 1830000, 'DELIVERED', 'PAID', '2022-11-20 13:00:00'),
(16, 'Đỗ Văn Phúc', '0901000016', '458 Minh Khai, Vĩnh Phú, Hai Bà Trưng, Hà Nội', 20.995483, 105.867267, 5500000, 60000, 5560000, 'DELIVERED', 'PAID', '2022-12-05 10:45:00'),
(17, 'Ngô Văn Quân', '0901000017', 'Đặng Thai Mai, Quảng An, Tây Hồ, Hà Nội', 21.064828, 105.826281, 1800000, 30000, 1830000, 'DELIVERED', 'PAID', '2022-12-12 12:12:00'),
(18, 'Vũ Thị Rạng', '0901000018', 'Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội', 21.016780, 105.784053, 950000, 30000, 980000, 'DELIVERED', 'PAID', '2022-12-20 15:00:00'),
(19, 'Bùi Văn Sơn', '0901000019', '144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 21.037446, 105.783218, 450000, 30000, 480000, 'DELIVERED', 'PAID', '2022-12-25 09:30:00'),
(20, 'Đặng Thị Tuyết', '0901000020', '1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 21.024398, 105.857492, 30000000, 200000, 30200000, 'DELIVERED', 'PAID', '2022-12-30 17:00:00');

-- Items 2022
INSERT INTO `order_items` (`order_id`, `variant_id`, `quantity`, `price_at_purchase`) VALUES
(1, 1, 1, 1800000), (2, 3, 1, 950000), (3, 5, 1, 550000), (4, 7, 1, 4500000), (5, 9, 1, 700000), 
(6, 11, 1, 2800000), (7, 12, 1, 1600000), (8, 13, 1, 3500000), (9, 14, 1, 4500000), (10, 15, 1, 1900000), 
(11, 16, 1, 1300000), (12, 17, 1, 2200000), (13, 18, 1, 7000000), (14, 20, 1, 1700000), (15, 21, 1, 1800000), 
(16, 22, 1, 5500000), (17, 1, 1, 1800000), (18, 3, 1, 950000), (19, 4, 1, 450000), (20, 8, 1, 30000000);

-- ----- NĂM 2023 (20 Đơn) -----
INSERT INTO `orders` (`user_id`, `customer_name`, `customer_phone`, `address`, `latitude`, `longitude`, `subtotal_price`, `shipping_fee`, `total_price`, `order_status`, `payment_status`, `created_at`) VALUES
(21, 'Trần Văn Uy', '0901000021', 'Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng', 16.061118, 108.222684, 1100000, 30000, 1130000, 'DELIVERED', 'PAID', '2023-01-10 10:00:00'),
(22, 'Lê Thị Vân', '0901000022', 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng', 16.062655, 108.246684, 2500000, 40000, 2540000, 'DELIVERED', 'PAID', '2023-02-14 14:00:00'),
(23, 'Phạm Văn Vượng', '0901000023', 'Hoà Ninh, Hòa Vang, Đà Nẵng', 16.032236, 108.039604, 450000, 30000, 480000, 'CANCELED', 'UNPAID', '2023-03-08 09:00:00'),
(24, 'Hoàng Thị Xuân', '0901000024', 'Duy Tân, Hòa Thuận Tây, Hải Châu, Đà Nẵng', 16.043923, 108.199385, 5500000, 50000, 5550000, 'DELIVERED', 'PAID', '2023-04-15 11:00:00'),
(25, 'Đỗ Văn Ý', '0901000025', '81 Huyền Trân Công Chúa, Hoà Hải, Đà Nẵng', 16.006676, 108.263399, 1800000, 30000, 1830000, 'DELIVERED', 'PAID', '2023-05-01 16:00:00'),
(26, 'Ngô Thị Zến', '0901000026', '1 Phan Đăng Lưu, Hoà Cường Bắc, Hải Châu, Đà Nẵng', 16.039514, 108.227322, 700000, 30000, 730000, 'DELIVERED', 'PAID', '2023-06-01 08:30:00'),
(27, 'Vũ Văn Anh', '0901000027', '54 Nguyễn Lương Bằng, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng', 16.075409, 108.153209, 950000, 30000, 980000, 'DELIVERED', 'PAID', '2023-06-15 13:00:00'),
(28, 'Bùi Thị Bình', '0901000028', '910A Ngô Quyền, An Hải Bắc, Sơn Trà, Đà Nẵng', 16.072634, 108.229489, 2800000, 40000, 2840000, 'DELIVERED', 'PAID', '2023-07-20 10:00:00'),
(29, 'Đặng Văn Cường', '0901000029', 'Bãi Bụt, Thọ Quang, Sơn Trà, Đà Nẵng', 16.100798, 108.277817, 3500000, 50000, 3550000, 'DELIVERED', 'PAID', '2023-08-05 15:30:00'),
(30, 'Nguyễn Thị Duyên', '0901000030', 'Bãi Bắc, Thọ Quang, Sơn Trà, Đà Nẵng', 16.120187, 108.306358, 1600000, 35000, 1635000, 'DELIVERED', 'PAID', '2023-09-02 12:00:00'),
(1, 'Nguyễn Văn An', '0901000001', '2 Hải Triều, Bến Nghé, Quận 1, TP.HCM', 10.771589, 106.704416, 550000, 30000, 580000, 'DELIVERED', 'PAID', '2023-09-15 09:45:00'),
(2, 'Trần Thị Bích', '0901000002', '720A Điện Biên Phủ, Bình Thạnh, TP.HCM', 10.795129, 106.721830, 4500000, 50000, 4550000, 'DELIVERED', 'PAID', '2023-10-01 14:20:00'),
(3, 'Lê Văn Cường', '0901000003', 'Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM', 10.772109, 106.698263, 1300000, 30000, 1330000, 'DELIVERED', 'PAID', '2023-10-20 11:10:00'),
(4, 'Phạm Thị Dung', '0901000004', 'Trường Sơn, Phường 2, Tân Bình, TP.HCM', 10.818463, 106.658825, 2200000, 40000, 2240000, 'DELIVERED', 'PAID', '2023-11-11 16:00:00'),
(5, 'Hoàng Văn Em', '0901000005', '101 Tôn Dật Tiên, Tân Phú, Quận 7, TP.HCM', 10.729330, 106.721534, 11000000, 150000, 11150000, 'DELIVERED', 'PAID', '2023-11-25 10:30:00'),
(6, 'Đỗ Văn Hùng', '0901000006', '1 Đường Số 17A, Bình Trị Đông B, Bình Tân, TP.HCM', 10.759926, 106.613905, 1700000, 35000, 1735000, 'DELIVERED', 'PAID', '2023-12-05 08:00:00'),
(7, 'Ngô Thị Giàu', '0901000007', '268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM', 10.773374, 106.659732, 1800000, 30000, 1830000, 'DELIVERED', 'PAID', '2023-12-15 13:40:00'),
(8, 'Vũ Văn Hải', '0901000008', '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, TP.HCM', 10.787558, 106.705276, 1000000, 30000, 1030000, 'DELIVERED', 'PAID', '2023-12-24 17:00:00'),
(9, 'Bùi Thị Ít', '0901000009', '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP.HCM', 10.776992, 106.695323, 5500000, 60000, 5560000, 'DELIVERED', 'PAID', '2023-12-28 09:15:00'),
(10, 'Đặng Văn Hưng', '0901000010', '159 Xa lộ Hà Nội, Thảo Điền, Quận 2, TP.HCM', 10.801442, 106.740364, 1900000, 40000, 1940000, 'DELIVERED', 'PAID', '2023-12-30 11:00:00');

-- Items 2023
INSERT INTO `order_items` (`order_id`, `variant_id`, `quantity`, `price_at_purchase`) VALUES
(21, 6, 2, 550000), (22, 2, 1, 2500000), (23, 4, 1, 450000), (24, 22, 1, 5500000), (25, 1, 1, 1800000),
(26, 5, 1, 700000), (27, 3, 1, 950000), (28, 11, 1, 2800000), (29, 13, 1, 3500000), (30, 12, 1, 1600000),
(31, 5, 1, 550000), (32, 7, 1, 4500000), (33, 16, 1, 1300000), (34, 17, 1, 2200000), (35, 19, 1, 11000000),
(36, 20, 1, 1700000), (37, 21, 1, 1800000), (38, 5, 2, 500000), (39, 22, 1, 5500000), (40, 15, 1, 1900000);

-- ----- NĂM 2024 (15 Đơn) -----
INSERT INTO `orders` (`user_id`, `customer_name`, `customer_phone`, `address`, `latitude`, `longitude`, `subtotal_price`, `shipping_fee`, `total_price`, `order_status`, `payment_status`, `created_at`) VALUES
(11, 'Nguyễn Thị Kim', '0901000011', 'Đinh Tiên Hoàng, Hàng Trống, Hoàn Kiếm, Hà Nội', 21.028511, 105.854167, 950000, 30000, 980000, 'DELIVERED', 'PAID', '2024-01-15 10:00:00'),
(12, 'Trần Văn Long', '0901000012', '72A Nguyễn Trãi, Thượng Đình, Thanh Xuân, Hà Nội', 21.004027, 105.814433, 1800000, 30000, 1830000, 'CANCELED', 'UNPAID', '2024-02-10 09:00:00'),
(13, 'Lê Thị Mai', '0901000013', '2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội', 21.036779, 105.834648, 4500000, 50000, 4550000, 'DELIVERED', 'PAID', '2024-03-05 14:30:00'),
(14, 'Phạm Văn Nam', '0901000014', 'Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội', 21.020436, 105.763031, 2800000, 40000, 2840000, 'DELIVERED', 'PAID', '2024-04-20 11:15:00'),
(15, 'Hoàng Thị Oanh', '0901000015', '27 Cổ Linh, Long Biên, Hà Nội', 21.026363, 105.903752, 550000, 30000, 580000, 'DELIVERED', 'PAID', '2024-05-15 16:00:00'),
(16, 'Đỗ Văn Phúc', '0901000016', '458 Minh Khai, Vĩnh Phú, Hai Bà Trưng, Hà Nội', 20.995483, 105.867267, 700000, 30000, 730000, 'DELIVERED', 'PAID', '2024-06-10 08:45:00'),
(17, 'Ngô Văn Quân', '0901000017', 'Đặng Thai Mai, Quảng An, Tây Hồ, Hà Nội', 21.064828, 105.826281, 1300000, 30000, 1330000, 'DELIVERED', 'PAID', '2024-07-05 13:20:00'),
(18, 'Vũ Thị Rạng', '0901000018', 'Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội', 21.016780, 105.784053, 2200000, 40000, 2240000, 'DELIVERED', 'PAID', '2024-08-12 10:10:00'),
(19, 'Bùi Văn Sơn', '0901000019', '144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 21.037446, 105.783218, 3500000, 50000, 3550000, 'DELIVERED', 'PAID', '2024-09-01 15:00:00'),
(20, 'Đặng Thị Tuyết', '0901000020', '1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 21.024398, 105.857492, 1800000, 30000, 1830000, 'DELIVERED', 'PAID', '2024-09-20 11:40:00'),
(21, 'Trần Văn Uy', '0901000021', 'Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng', 16.061118, 108.222684, 450000, 30000, 480000, 'DELIVERED', 'PAID', '2024-10-05 09:30:00'),
(22, 'Lê Thị Vân', '0901000022', 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng', 16.062655, 108.246684, 5500000, 60000, 5560000, 'DELIVERED', 'PAID', '2024-10-25 14:15:00'),
(23, 'Phạm Văn Vượng', '0901000023', 'Hoà Ninh, Hòa Vang, Đà Nẵng', 16.032236, 108.039604, 950000, 30000, 980000, 'CANCELED', 'UNPAID', '2024-11-10 16:50:00'),
(24, 'Hoàng Thị Xuân', '0901000024', 'Duy Tân, Hòa Thuận Tây, Hải Châu, Đà Nẵng', 16.043923, 108.199385, 1600000, 35000, 1635000, 'DELIVERED', 'PAID', '2024-11-20 08:00:00'),
(25, 'Đỗ Văn Ý', '0901000025', '81 Huyền Trân Công Chúa, Hoà Hải, Đà Nẵng', 16.006676, 108.263399, 1900000, 40000, 1940000, 'DELIVERED', 'PAID', '2024-12-15 12:30:00');

-- Items 2024
INSERT INTO `order_items` (`order_id`, `variant_id`, `quantity`, `price_at_purchase`) VALUES
(41, 3, 1, 950000), (42, 1, 1, 1800000), (43, 7, 1, 4500000), (44, 11, 1, 2800000), (45, 5, 1, 550000),
(46, 9, 1, 700000), (47, 16, 1, 1300000), (48, 17, 1, 2200000), (49, 13, 1, 3500000), (50, 21, 1, 1800000),
(51, 4, 1, 450000), (52, 22, 1, 5500000), (53, 3, 1, 950000), (54, 12, 1, 1600000), (55, 15, 1, 1900000);

-- ----- NĂM 2025 (5 Đơn Mới nhất) -----
INSERT INTO `orders` (`user_id`, `customer_name`, `customer_phone`, `address`, `latitude`, `longitude`, `subtotal_price`, `shipping_fee`, `total_price`, `order_status`, `payment_status`, `created_at`) VALUES
(26, 'Ngô Thị Zến', '0901000026', '1 Phan Đăng Lưu, Hoà Cường Bắc, Hải Châu, Đà Nẵng', 16.039514, 108.227322, 2500000, 40000, 2540000, 'SHIPPED', 'PAID', '2025-01-05 09:00:00'),
(27, 'Vũ Văn Anh', '0901000027', '54 Nguyễn Lương Bằng, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng', 16.075409, 108.153209, 1800000, 30000, 1830000, 'PROCESSING', 'PAID', '2025-01-10 14:20:00'),
(28, 'Bùi Thị Bình', '0901000028', '910A Ngô Quyền, An Hải Bắc, Sơn Trà, Đà Nẵng', 16.072634, 108.229489, 7000000, 100000, 7100000, 'PROCESSING', 'UNPAID', '2025-01-12 10:00:00'),
(29, 'Đặng Văn Cường', '0901000029', 'Bãi Bụt, Thọ Quang, Sơn Trà, Đà Nẵng', 16.100798, 108.277817, 550000, 30000, 580000, 'PENDING', 'UNPAID', '2025-01-14 08:30:00'),
(30, 'Nguyễn Thị Duyên', '0901000030', 'Bãi Bắc, Thọ Quang, Sơn Trà, Đà Nẵng', 16.120187, 108.306358, 30000000, 200000, 30200000, 'PENDING', 'UNPAID', '2025-01-15 11:45:00');

-- Items 2025
INSERT INTO `order_items` (`order_id`, `variant_id`, `quantity`, `price_at_purchase`) VALUES
(56, 2, 1, 2500000), (57, 1, 1, 1800000), (58, 18, 1, 7000000), (59, 5, 1, 550000), (60, 8, 1, 30000000);

COMMIT;