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
ALTER TABLE `product`
ADD COLUMN `min_price` DECIMAL(10, 2) NULL DEFAULT 0.00,
ADD COLUMN `sales_count` BIGINT NULL DEFAULT 0,
ADD COLUMN `view_count` BIGINT NULL DEFAULT 0;

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
-- ============================================
-- BẢNG CHỦ ĐỀ SẢN PHẨM (LƯU TRỰC TIẾP)
-- ============================================


-- 10. Bảng `product_colors` (Màu sắc của sản phẩm)
CREATE TABLE `product_colors` (
    `product_id` BIGINT NOT NULL,
    `hex_code` CHAR(7) NOT NULL,
    PRIMARY KEY (`product_id`, `hex_code`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

-- 11. Bảng `product_topics` (Lưu tên chủ đề trực tiếp)
CREATE TABLE `product_topics` (
    `product_id` BIGINT NOT NULL,
    `topic_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`product_id`, `topic_name`),
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
INSERT INTO categories (name, parent_id) VALUES ('Tranh Nghệ Thuật', NULL);   -- Giả sử ID là 3
INSERT INTO categories (name, parent_id) VALUES ('Khung Tranh', NULL);   -- Giả sử ID là 3

-- Danh mục con của "Tranh Trừu Tượng" (parent_id = 1)
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Hành động', 1);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Trường màu', 1);
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Hình học', 1);
INSERT INTO categories (name, parent_id) VALUES ('Trừu Tượng Trữ tình', 1);
-- Danh mục con của "Tranh Phong Cảnh" (parent_id = 2)
INSERT INTO categories (name, parent_id) VALUES ('Tranh Biển', 2);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Núi Rừng', 2);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Đồng Quê', 2);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Thành Phố (Cityscape)', 2);

-- Danh mục con của "Tranh Sơn Dầu" (parent_id = 3)
INSERT INTO categories (name, parent_id) VALUES ('Sơn Dầu Chân dung', 3);
INSERT INTO categories (name, parent_id) VALUES ('Sơn Dầu Tĩnh vật', 3);
INSERT INTO categories (name, parent_id) VALUES ('Sơn Dầu Hiện đại', 3);

-- Danh mục con của "Tranh Nghệ Thuật" (parent_id = 4)
INSERT INTO categories (name, parent_id) VALUES ('Tranh Ấn Tượng (Impressionism)', 4);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Lập Thể (Cubism)', 4);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Siêu Thực (Surrealism)', 4);
INSERT INTO categories (name, parent_id) VALUES ('Tranh Phục Hưng (Renaissance)', 4);

-- Danh mục con của "Khung Tranh" (parent_id = 5)
INSERT INTO categories (name, parent_id) VALUES ('Khung Gỗ Cổ điển', 5);
INSERT INTO categories (name, parent_id) VALUES ('Khung Kim Loại Hiện đại', 5);
INSERT INTO categories (name, parent_id) VALUES ('Khung Composite', 5);
INSERT INTO categories (name, parent_id) VALUES ('Khung Tranh Đơn Giản', 5);






-- test
-- Chọn database để làm việc
USE artdbproject;

-- ============================================
-- BẢNG PHỤ (CHA)
-- ============================================

-- 1. Chèn `material`
INSERT INTO `material` (materialname) VALUES 
('Sơn Dầu'), -- ID 1
('Vải Canvas'), -- ID 2
('Sơn Mài'), -- ID 3
('Gỗ Tự Nhiên'); -- ID 4

-- ============================================
-- BẢNG `product` (CORE)
-- Chèn 20 sản phẩm với sales_count và view_count ngẫu nhiên
-- min_price sẽ được cập nhật sau
-- ============================================

INSERT INTO `product` (productname, description, thumbnail, material_id, product_status, min_price, sales_count, view_count) VALUES
('Tranh Hoàng Hôn Trên Biển', 'Mô tả chi tiết về tranh sơn dầu hoàng hôn trên biển.', 'https://placehold.co/400x400/FF8C00/FFFFFF?text=Tranh+01', 1, 1, 0, 150, 2500),
('Tranh Rối Rắm Hiện Đại', 'Tranh trừu tượng hiện đại trên vải canvas, thể hiện sự phức tạp của đô thị.', 'https://placehold.co/400x400/003366/FFFFFF?text=Tranh+02', 2, 1, 0, 75, 1200),
('Tranh Làng Quê Mùa Thu', 'Bức tranh sơn mài mô tả cảnh làng quê Việt Nam yên bình vào mùa thu.', 'https://placehold.co/400x400/8B4513/FFFFFF?text=Tranh+03', 3, 1, 0, 220, 3500),
('Khung Tranh Gỗ Sồi Cổ Điển', 'Khung tranh làm từ gỗ sồi tự nhiên, chạm khắc tinh xảo.', 'https://placehold.co/400x400/D2B48C/000000?text=Khung+04', 4, 1, 0, 300, 1500),
('Tranh Sen Bên Cửa Sổ', 'Tranh sơn dầu tĩnh vật, hoa sen trắng bên cửa sổ.', 'https://placehold.co/400x400/FFFFFF/000000?text=Tranh+05', 1, 1, 0, 180, 2800),
('Tranh Phố Cổ Hà Nội', 'Góc phố cổ Hà Nội với gánh hàng rong, vẽ bằng sơn dầu.', 'https://placehold.co/400x400/A52A2A/FFFFFF?text=Tranh+06', 1, 1, 0, 450, 8000),
('Tranh Trừu Tượng Lửa Và Băng', 'Tranh canvas thể hiện sự đối lập giữa nóng và lạnh.', 'https://placehold.co/400x400/B22222/FFFFFF?text=Tranh+07', 2, 1, 0, 90, 1800),
('Tranh Núi Rừng Tây Bắc', 'Phong cảnh núi rừng hùng vĩ của Tây Bắc Việt Nam.', 'https://placehold.co/400x400/228B22/FFFFFF?text=Tranh+08', 2, 1, 0, 120, 2200),
('Tranh Cá Chép Hóa Rồng', 'Tranh sơn mài truyền thống với hình tượng cá chép.', 'https://placehold.co/400x400/FFD700/000000?text=Tranh+09', 3, 1, 0, 50, 900),
('Khung Tranh Kim Loại Hiện Đại', 'Khung kim loại mạ vàng, thiết kế tối giản.', 'https://placehold.co/400x400/C0C0C0/000000?text=Khung+10', 4, 1, 1, 400, 2000),
('Tranh Đồng Quê Buổi Sáng', 'Cảnh đồng quê với sương sớm và người nông dân.', 'https://placehold.co/400x400/90EE90/000000?text=Tranh+11', 1, 1, 0, 30, 750),
('Tranh Thành Phố Về Đêm', 'Cityscape lung linh ánh đèn, vẽ trên canvas.', 'https://placehold.co/400x400/00008B/FFFFFF?text=Tranh+12', 2, 1, 0, 110, 3100),
('Tranh Trừu Tượng Tình Yêu', 'Sử dụng màu sắc nóng thể hiện tình yêu nồng cháy.', 'https://placehold.co/400x400/DC143C/FFFFFF?text=Tranh+13', 2, 1, 0, 250, 5000),
('Tranh Siêu Thực Giấc Mơ', 'Bức tranh sơn dầu theo trường phái siêu thực.', 'https://placehold.co/400x400/4B0082/FFFFFF?text=Tranh+14', 1, 1, 0, 65, 1400),
('Tranh Sơn Dầu Chân Dung Cô Gái', 'Chân dung cô gái Việt Nam mặc áo dài.', 'https://placehold.co/400x400/E6E6FA/000000?text=Tranh+15', 1, 1, 0, 85, 2300),
('Khung Gỗ Composite Trắng', 'Khung tranh composite màu trắng, đơn giản, hiện đại.', 'https://placehold.co/400x400/F5F5F5/000000?text=Khung+16', 4, 1, 0, 500, 2500),
('Tranh Lập Thể Cây Đàn Guitar', 'Tranh sơn dầu phong cách lập thể (Cubism).', 'https://placehold.co/400x400/808000/FFFFFF?text=Tranh+17', 1, 1, 0, 40, 880),
('Tranh Biển Xanh Cát Trắng', 'Bãi biển nhiệt đới với màu xanh trong vắt.', 'https://placehold.co/400x400/00CED1/000000?text=Tranh+18', 2, 1, 0, 130, 2900),
('Tranh Sơn Mài Tứ Quý', 'Bộ tranh sơn mài Tùng Cúc Trúc Mai.', 'https://placehold.co/400x400/800000/FFFFFF?text=Tranh+19', 3, 1, 0, 95, 4000),
('Tranh Trừu Tượng Hình Học Đen Trắng', 'Tranh canvas với các khối hình học đơn giản.', 'https://placehold.co/400x400/000000/FFFFFF?text=Tranh+20', 2, 1, 0, 160, 3300);

-- ============================================
-- BẢNG `product_categories`
-- (Giả định ID categories cha từ 1-5, con từ 6-25)
-- ============================================
-- P1: Phong Cảnh (2), Biển (10)
INSERT INTO product_categories (product_id, categories_id) VALUES (1, 2), (1, 10);
-- P2: Trừu Tượng (1), Hình học (8)
INSERT INTO product_categories (product_id, categories_id) VALUES (2, 1), (2, 8);
-- P3: Phong Cảnh (2), Đồng Quê (12)
INSERT INTO product_categories (product_id, categories_id) VALUES (3, 2), (3, 12);
-- P4: Khung Tranh (5), Gỗ (22)
INSERT INTO product_categories (product_id, categories_id) VALUES (4, 5), (4, 22);
-- P5: Sơn Dầu (3), Tĩnh vật (16)
INSERT INTO product_categories (product_id, categories_id) VALUES (5, 3), (5, 16);
-- P6: Phong Cảnh (2), Thành Phố (13)
INSERT INTO product_categories (product_id, categories_id) VALUES (6, 2), (6, 13);
-- P7: Trừu Tượng (1), Hành động (6)
INSERT INTO product_categories (product_id, categories_id) VALUES (7, 1), (7, 6);
-- P8: Phong Cảnh (2), Núi Rừng (11)
INSERT INTO product_categories (product_id, categories_id) VALUES (8, 2), (8, 11);
-- P9: Sơn Mài (3)
INSERT INTO product_categories (product_id, categories_id) VALUES (9, 3);
-- P10: Khung Tranh (5), Kim Loại (23)
INSERT INTO product_categories (product_id, categories_id) VALUES (10, 5), (10, 23);
-- P11: Phong Cảnh (2), Đồng Quê (12)
INSERT INTO product_categories (product_id, categories_id) VALUES (11, 2), (11, 12);
-- P12: Phong Cảnh (2), Thành Phố (13)
INSERT INTO product_categories (product_id, categories_id) VALUES (12, 2), (12, 13);
-- P13: Trừu Tượng (1), Trữ tình (9)
INSERT INTO product_categories (product_id, categories_id) VALUES (13, 1), (13, 9);
-- P14: Nghệ Thuật (4), Siêu Thực (20)
INSERT INTO product_categories (product_id, categories_id) VALUES (14, 4), (14, 20);
-- P15: Sơn Dầu (3), Chân dung (15)
INSERT INTO product_categories (product_id, categories_id) VALUES (15, 3), (15, 15);
-- P16: Khung Tranh (5), Composite (24)
INSERT INTO product_categories (product_id, categories_id) VALUES (16, 5), (16, 24);
-- P17: Nghệ Thuật (4), Lập Thể (19)
INSERT INTO product_categories (product_id, categories_id) VALUES (17, 4), (17, 19);
-- P18: Phong Cảnh (2), Biển (10)
INSERT INTO product_categories (product_id, categories_id) VALUES (18, 2), (18, 10);
-- P19: Sơn Mài (3)
INSERT INTO product_categories (product_id, categories_id) VALUES (19, 3);
-- P20: Trừu Tượng (1), Hình học (8)
INSERT INTO product_categories (product_id, categories_id) VALUES (20, 1), (20, 8);

-- ============================================
-- BẢNG `product_variants`
-- ( dimensions, price )
-- ============================================
-- P1
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (1, '40x60cm', 500000.00, 20), (1, '60x90cm', 950000.00, 10);
-- P2
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (2, '50x50cm', 700000.00, 15), (2, '70x70cm', 1200000.00, 5);
-- P3
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (3, '60x90cm', 1800000.00, 8), (3, '80x120cm', 2500000.00, 4);
-- P4
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (4, '40x60cm', 300000.00, 50), (4, '50x70cm', 450000.00, 30);
-- P5
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (5, '30x40cm', 400000.00, 12);
-- P6
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (6, '60x90cm', 2200000.00, 7), (6, '80x120cm', 3500000.00, 3);
-- P7
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (7, '50x50cm', 650000.00, 18);
-- P8
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (8, '70x100cm', 1300000.00, 10);
-- P9
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (9, '40x100cm', 30000000.00, 5);
-- P10
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (10, '40x60cm', 600000.00, 40), (10, '60x90cm', 900000.00, 20);
-- P11
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (11, '50x70cm', 900000.00, 10);
-- P12
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (12, '60x90cm', 1400000.00, 10), (12, '80x120cm', 2100000.00, 5);
-- P13
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (13, '50x50cm', 850000.00, 15);
-- P14
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (14, '70x70cm', 1600000.00, 3);
-- P15
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (15, '40x60cm', 1100000.00, 10);
-- P16
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (16, '30x40cm', 150000.00, 100), (16, '40x60cm', 250000.00, 80);
-- P17
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (17, '50x70cm', 1000000.00, 5);
-- P18
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (18, '60x90cm', 1150000.00, 10);
-- P19
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (19, '100x100cm', 5000000.00, 3);
-- P20
INSERT INTO product_variants (product_id, dimensions, price, stock_quantity) VALUES (20, '50x50cm', 550000.00, 20), (20, '70x70cm', 900000.00, 10);

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

DELIMITER ;

DELIMITER //

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

DELIMITER ;

DELIMITER //

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
-- ============================================
-- BẢNG `product_images`
-- ============================================
-- P1
INSERT INTO product_images (product_id, image_url) VALUES (1, 'https://placehold.co/800x800/FF8C00/FFFFFF?text=Chi+Tiet+1-1'), (1, 'https://placehold.co/800x800/4682B4/FFFFFF?text=Chi+Tiet+1-2');
-- P2
INSERT INTO product_images (product_id, image_url) VALUES (2, 'https://placehold.co/800x800/003366/FFFFFF?text=Chi+Tiet+2-1');
-- P3
INSERT INTO product_images (product_id, image_url) VALUES (3, 'https://placehold.co/800x800/8B4513/FFFFFF?text=Chi+Tiet+3-1'), (3, 'https://placehold.co/800x800/FFD700/000000?text=Chi+Tiet+3-2');
-- P4
INSERT INTO product_images (product_id, image_url) VALUES (4, 'https://placehold.co/800x800/D2B48C/000000?text=Chi+Tiet+4-1');
-- P5
INSERT INTO product_images (product_id, image_url) VALUES (5, 'https://placehold.co/800x800/FFFFFF/000000?text=Chi+Tiet+5-1');
-- P6
INSERT INTO product_images (product_id, image_url) VALUES (6, 'https://placehold.co/800x800/A52A2A/FFFFFF?text=Chi+Tiet+6-1'), (6, 'https://placehold.co/800x800/D2691E/FFFFFF?text=Chi+Tiet+6-2');
-- P7
INSERT INTO product_images (product_id, image_url) VALUES (7, 'https://placehold.co/800x800/B22222/FFFFFF?text=Chi+Tiet+7-1'), (7, 'https://placehold.co/800x800/1E90FF/FFFFFF?text=Chi+Tiet+7-2');
-- P15
INSERT INTO product_images (product_id, image_url) VALUES (15, 'https://placehold.co/800x800/E6E6FA/000000?text=Chi+Tiet+15-1');
-- P20
INSERT INTO product_images (product_id, image_url) VALUES (20, 'https://placehold.co/800x800/000000/FFFFFF?text=Chi+Tiet+20-1'), (20, 'https://placehold.co/800x800/FFFFFF/000000?text=Chi+Tiet+20-2');

-- ============================================
-- BẢNG `product_colors`
-- ============================================
INSERT INTO product_colors (product_id, hex_code) VALUES 
(1, '#FF8C00'), (1, '#4682B4'), (1, '#FF0000'), -- P1: Cam, Xanh, Đỏ
(2, '#003366'), (2, '#FFFFFF'), (2, '#000000'), -- P2: Xanh đậm, Trắng, Đen
(3, '#8B4513'), (3, '#FFFF00'), (3, '#FFA500'), -- P3: Nâu, Vàng, Cam
(4, '#D2B48C'), (4, '#8B4513'), -- P4: Gỗ sáng, Gỗ tối
(5, '#FFFFFF'), (5, '#008000'), -- P5: Trắng, Xanh lá
(6, '#A52A2A'), (6, '#D2691E'), (6, '#FFFF00'), -- P6: Nâu đỏ, Sô cô la, Vàng
(7, '#B22222'), (7, '#1E90FF'), -- P7: Đỏ, Xanh
(8, '#228B22'), (8, '#FFFFFF'), (8, '#8B4513'), -- P8: Xanh lá, Trắng, Nâu
(9, '#FFD700'), (9, '#000000'), (9, '#FF0000'), -- P9: Vàng, Đen, Đỏ
(10, '#C0C0C0'), (10, '#FFD700'), -- P10: Bạc, Vàng
(11, '#90EE90'), (11, '#8B4513'), -- P11: Xanh nhạt, Nâu
(12, '#00008B'), (12, '#FFFF00'), (12, '#FFFFFF'), -- P12: Xanh đậm, Vàng, Trắng
(13, '#DC143C'), (13, '#FFC0CB'), -- P13: Đỏ thẫm, Hồng
(14, '#4B0082'), (14, '#ADD8E6'), -- P14: Tím, Xanh nhạt
(15, '#E6E6FA'), (15, '#000000'), -- P15: Tím nhạt, Đen
(16, '#F5F5F5'), (16, '#FFFFFF'), -- P16: Trắng xám, Trắng
(17, '#808000'), (17, '#A52A2A'), -- P17: Olive, Nâu đỏ
(18, '#00CED1'), (18, '#F5DEB3'), (18, '#FFFFFF'), -- P18: Xanh ngọc, Be, Trắng
(19, '#800000'), (19, '#FFD700'), -- P19: Đỏ rượu, Vàng
(20, '#000000'), (20, '#FFFFFF'); -- P20: Đen, Trắng

-- ============================================
-- BẢNG `product_topics`
-- ============================================
INSERT INTO product_topics (product_id, topic_name) VALUES
(1, 'Biển cả'), (1, 'Hoàng hôn'),
(2, 'Hiện đại'), (2, 'Trừu tượng'),
(3, 'Làng quê'), (3, 'Mùa thu'),
(4, 'Cổ điển'), (4, 'Nội thất'),
(5, 'Hoa lá'), (5, 'Tĩnh vật'),
(6, 'Phố cổ'), (6, 'Hoài niệm'),
(7, 'Trừu tượng'), (7, 'Hiện đại'),
(8, 'Thiên nhiên'), (8, 'Núi rừng'),
(9, 'Truyền thống'), (9, 'Tâm linh'),
(10, 'Hiện đại'), (10, 'Nội thất'),
(11, 'Làng quê'), (11, 'Thiên nhiên'),
(12, 'Hiện đại'), (12, 'Thành phố'),
(13, 'Trừu tượng'), (13, 'Tình yêu'),
(14, 'Siêu thực'), (14, 'Giấc mơ'),
(15, 'Chân dung'), (15, 'Tình yêu'),
(16, 'Hiện đại'), (16, 'Nội thất'),
(17, 'Lập thể'), (17, 'Hiện đại'),
(18, 'Biển cả'), (18, 'Thiên nhiên'),
(19, 'Truyền thống'), (19, 'Tâm linh'),
(20, 'Trừu tượng'), (20, 'Hiện đại');

