use artdbproject;

-- ============================================
-- CHÈN DỮ LIỆU MẪU (50 SẢN PHẨM)
-- ============================================
START TRANSACTION;

-- ============================================
-- 1. CHÈN LIỆU (MATERIALS)
-- ============================================
INSERT INTO `material` (`materialname`) VALUES
('Sơn dầu'),       -- ID 1
('Acrylic'),               -- ID 2
('Màu nước'), -- ID 3
('Gỗ Tự Nhiên'),         -- ID 4
('Kim loại'),      -- ID 5
('Vải canvas'),   -- ID 6
('Giấy mỹ thuật'),     -- ID 7
('Composite');             -- ID 8

-- ============================================
-- SẢN PHẨM 1: Tranh Trừu Tượng (2 variants)
-- ============================================
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Bình minh rực rỡ', 'Tranh trừu tượng hiện đại mô tả cảnh bình minh với gam màu nóng, sử dụng chất liệu sơn dầu.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product1_thumb_frlue9.jpg', 1, 1, 150);
-- Gán ID sản phẩm
SET @product_id = LAST_INSERT_ID();
-- Gán Danh mục
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES
(@product_id, 1), -- Tranh Trừu Tượng
(@product_id, 2); -- Tranh Trường màu
-- Gán Biến thể
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '60x80cm', 1800000, 10, 1200000),
(@product_id, '70x60cm', 2500000, 5, 1700000);
-- Gán Hình ảnh
SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES
(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777459/product1_variant1_rzkhad.jpg'),
(@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777463/product1_variant2_fmisum.jpg');
-- Gán Màu sắc & Chủ đề
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FF5733'), (@product_id, '#FFC300');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bình minh'), (@product_id, 'Trừu tượng');

-- ============================================
-- SẢN PHẨM 2: Tranh Phong Cảnh (1 variant)
-- ============================================
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Hoàng hôn trên biển', 'Tranh phong cảnh biển buổi chiều tà, chất liệu acrylic trên canvas.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product2_thumb_zbopzv.jpg', 2, 1, 220);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES
(@product_id, 2), -- Tranh Phong Cảnh
(@product_id, 10); -- Tranh Biển
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
('Khung Gỗ Sồi Cổ Điển', 'Khung tranh làm từ gỗ sồi tự nhiên, hoa văn cổ điển, phù hợp với tranh sơn dầu.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product3_thumb_spqhbl.jpg', 4, 1, 80);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES
(@product_id, 5), -- Khung Tranh
(@product_id, 21); -- Khung Gỗ Cổ điển
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
('Thiếu nữ bên hoa Huệ', 'Tranh sơn dầu phục dựng phong cách cổ điển, mô tả thiếu nữ mặc áo dài trắng.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777546/product4_thumb_xv7s3r.jpg', 1, 1, 310);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES
(@product_id, 3), -- Tranh Sơn Dầu
(@product_id, 14); -- Sơn Dầu Chân dung
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
('Góc phố Lập thể', 'Tranh nghệ thuật theo trường phái lập thể, sử dụng chất liệu Acrylic.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777496/product5_thumb_xrrocj.jpg', 2, 1, 120);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES
(@product_id, 4), -- Tranh Nghệ Thuật
(@product_id, 18); -- Tranh Lập Thể
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
('Rừng thông Sương mờ', 'Tranh phong cảnh núi rừng Đà Lạt buổi sớm, chất liệu màu nước.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product6_thumb_pxv9l4.jpg', 3, 1, 180);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 11);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '40x60cm', 700000, 12, 400000),
(@product_id, '60x90cm', 1100000, 7, 700000);
SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777455/product6_variant1_ajtdzr.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#B0D1C5'), (@product_id, '#4E6C50');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Rừng'), (@product_id, 'Sương mờ');

-- SP 7
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Cánh đồng lúa chín', 'Tranh đồng quê Việt Nam mùa gặt, sơn dầu trên canvas.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777497/product7_thumb_w3bp6d.jpg', 1, 1, 250);
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
('Phố cổ Hội An về đêm', 'Tranh thành phố cổ với ánh đèn lồng, chất liệu acrylic.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777497/product8_thumb_qb7kye.jpg', 2, 1, 300);
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
('Vịnh Hạ Long', 'Tranh sơn dầu phong cảnh Vịnh Hạ Long hùng vĩ.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777497/product9_thumb_wovsmy.jpg', 1, 1, 190);
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
('Suối trong rừng', 'Tranh màu nước cảnh suối và rừng cây.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product10_thumb_ghigsi.jpg', 3, 1, 110);
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
('Vũ điệu của màu sắc', 'Tranh trừu tượng hành động, thể hiện sự ngẫu hứng.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product11_thumb_uvsrzg.jpg', 2, 1, 130);
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
('Hình học Giao thoa', 'Tranh trừu tượng hình học với các khối màu sắc nét.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product12_thumb_qpoquw.jpg', 2, 1, 90);
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
('Nỗi buồn Trữ tình', 'Tranh trừu tượng trữ tình, gam màu lạnh.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777498/product13_thumb_qxcvnm.jpg', 1, 1, 160);
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
('Khoảng lặng Màu Vàng', 'Tranh trường màu (color field) với sắc vàng chủ đạo.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777499/product14_thumb_f7kbak.jpg', 1, 1, 75);
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
('Hỗn mang Có Sắp đặt', 'Tranh trừu tượng hành động, canvas.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777535/product15_thumb_vohox3.jpg', 6, 1, 105);
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
('Tĩnh vật Bình hoa Cúc', 'Tranh sơn dầu tĩnh vật, phong cách cổ điển.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777544/product16_thumb_zrbpgq.jpg', 1, 1, 280);
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
('Chân dung Bác Giáp', 'Tranh sơn dầu chân dung tả thực, thể hiện nếp nhăn thời gian.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777545/product17_thumb_wrf4e3.jpg', 1, 1, 210);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 14);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '40x50cm', 5500000, 2, 4000000);
SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777459/product17_variant1_buxg5l.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1762777458/product17_variant1_1_lhlx3w.jpg');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Chân dung'), (@product_id, 'Tả thực');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E5B296'), (@product_id, '#F0F1F2');

COMMIT;
-- SP 18

-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khỏa thân Hiện đại', 'Tranh sơn dầu hiện đại, đường nét táo bạo.', '/images/product/sp18_thumb.jpg', 1, 1, 150);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 16);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '90x120cm', 6000000, 3, 4200000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp18_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#D4AF37'), (@product_id, '#2C2A2A');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Hiện đại'), (@product_id, 'Khỏa thân');

-- -- SP 19
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tĩnh vật Giỏ trái cây', 'Tranh sơn dầu tĩnh vật, ánh sáng cổ điển.', '/images/product/sp19_thumb.jpg', 1, 1, 170);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 15);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '50x70cm', 2000000, 7, 1300000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp19_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#DB4437'), (@product_id, '#34A853');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Tĩnh vật'), (@product_id, 'Trái cây');

-- -- SP 20
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Chân dung Tự họa', 'Tranh sơn dầu hiện đại, phong cách tự họa.', '/images/product/sp20_thumb.jpg', 1, 1, 85);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 14), (@product_id, 16);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '40x40cm', 1500000, 5, 1000000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp20_v1.jpg');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Chân dung'), (@product_id, 'Hiện đại');

-- -- ============================================
-- -- SẢN PHẨM 21 - 25 (Nhóm Nghệ Thuật)
-- -- ============================================

-- -- SP 21
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Đêm đầy sao (Van Gogh)', 'Tranh phục dựng theo trường phái Ấn tượng, sơn dầu.', '/images/product/sp21_thumb.jpg', 1, 1, 450);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 17);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '60x90cm', 3800000, 7, 2500000),
-- (@product_id, '80x120cm', 5000000, 3, 3500000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp21_v1.jpg'), (@variant2_id, '/images/product/sp21_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4285F4'), (@product_id, '#F4B400');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Ấn tượng'), (@product_id, 'Van Gogh');

-- -- SP 22
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Sự bền bỉ của Ký ức (Dali)', 'Tranh phục dựng Siêu thực, chất liệu Acrylic.', '/images/product/sp22_thumb.jpg', 2, 1, 320);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 19);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '50x70cm', 2300000, 10, 1500000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp22_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#A67B5B'), (@product_id, '#5E8B7E');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Siêu thực'), (@product_id, 'Dali');

-- -- SP 23
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Mona Lisa (Da Vinci)', 'Tranh phục dựng Phục Hưng, sơn dầu chất lượng cao.', '/images/product/sp23_thumb.jpg', 1, 1, 500);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 20);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '53x77cm', 8000000, 2, 6000000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp23_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4E4B3C'), (@product_id, '#8B4513');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Phục Hưng'), (@product_id, 'Chân dung');

-- -- SP 24
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Những cô gái Avignon (Picasso)', 'Tranh phục dựng Lập thể, sơn dầu.', '/images/product/sp24_thumb.jpg', 1, 1, 180);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 18);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '100x100cm', 7500000, 3, 5000000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp24_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E6A99C'), (@product_id, '#5E8B7E');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Lập thể'), (@product_id, 'Picasso');

-- -- SP 25
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Ấn tượng Mặt trời mọc (Monet)', 'Tranh phục dựng Ấn tượng, acrylic.', '/images/product/sp25_thumb.jpg', 2, 1, 290);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 17);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '60x80cm', 2600000, 8, 1700000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp25_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FF5733'), (@product_id, '#AECBFA');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Ấn tượng'), (@product_id, 'Phong cảnh');

-- -- ============================================
-- -- SẢN PHẨM 26 - 30 (Nhóm Khung Tranh)
-- -- ============================================

-- -- SP 26
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khung Kim loại Hiện đại (Vàng)', 'Khung kim loại mạ vàng, thiết kế thanh mảnh, hiện đại.', '/images/product/sp26_thumb.jpg', 5, 1, 140);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 22);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '30x40cm', 350000, 40, 250000),
-- (@product_id, '50x70cm', 500000, 30, 350000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp26_v1.jpg'), (@variant2_id, '/images/product/sp26_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#D4AF37');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Hiện đại');

-- -- SP 27
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khung Composite Trắng', 'Khung tranh composite, màu trắng, phong cách tối giản.', '/images/product/sp27_thumb.jpg', 8, 1, 200);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 23);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, 'A4 (21x30cm)', 150000, 100, 90000),
-- (@product_id, 'A3 (30x42cm)', 220000, 80, 140000),
-- (@product_id, 'A2 (42x60cm)', 300000, 50, 200000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- SET @variant3_id = @variant1_id + 2;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES
-- (@variant1_id, '/images/product/sp27_v1.jpg'),
-- (@variant2_id, '/images/product/sp27_v2.jpg'),
-- (@variant3_id, '/images/product/sp27_v3.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FFFFFF');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Tối giản');

-- -- SP 28
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khung Gỗ Thông Đơn giản', 'Khung gỗ thông tự nhiên, không sơn, mộc mạc.', '/images/product/sp28_thumb.jpg', 4, 1, 160);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 24);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '30x30cm', 180000, 50, 120000),
-- (@product_id, '40x40cm', 240000, 40, 160000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp28_v1.jpg'), (@variant2_id, '/images/product/sp28_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FCE3B1');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Mộc');

-- -- SP 29
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khung Kim loại Đen (Slim)', 'Khung kim loại màu đen, viền mỏng, phong cách Scandinavian.', '/images/product/sp29_thumb.jpg', 5, 1, 190);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 22);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '50x70cm', 480000, 35, 320000),
-- (@product_id, '60x90cm', 600000, 25, 400000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp29_v1.jpg'), (@variant2_id, '/images/product/sp29_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#000000');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Hiện đại');

-- -- SP 30
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khung Gỗ Walnut Cao cấp', 'Khung gỗ óc chó (Walnut) cổ điển, bản dày.', '/images/product/sp30_thumb.jpg', 4, 1, 110);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 21);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '60x80cm', 1200000, 15, 800000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp30_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#5E4534');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Cao cấp');

-- -- ============================================
-- -- SẢN PHẨM 31 - 40 (Nhóm Chất liệu khác)
-- -- ============================================

-- -- SP 31
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Bản in Canvas Trừu tượng Xanh', 'Bản in nghệ thuật (art print) trên canvas, chủ đề trừu tượng.', '/images/product/sp31_thumb.jpg', 6, 1, 95);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 8);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '40x60cm', 350000, 50, 200000),
-- (@product_id, '60x90cm', 500000, 40, 300000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp31_v1.jpg'), (@variant2_id, '/images/product/sp31_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4285F4'), (@product_id, '#AECBFA');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bản in'), (@product_id, 'Trừu tượng');

-- -- SP 32
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Màu nước Hoa Mẫu đơn', 'Tranh màu nước gốc, vẽ hoa mẫu đơn trên giấy mỹ thuật.', '/images/product/sp32_thumb.jpg', 3, 1, 175);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '30x40cm', 800000, 1, 500000); -- Hàng gốc (Original)
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp32_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E87A90'), (@product_id, '#34A853');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Hoa'), (@product_id, 'Màu nước');

-- -- SP 33
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Bản in Giấy mỹ thuật (Art Print) - Tối giản', 'Bản in trên giấy mỹ thuật, hình học tối giản.', '/images/product/sp33_thumb.jpg', 7, 1, 115);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 8);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, 'A4 (21x30cm)', 120000, 60, 70000),
-- (@product_id, 'A3 (30x42cm)', 180000, 40, 110000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp33_v1.jpg'), (@variant2_id, '/images/product/sp33_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#000000'), (@product_id, '#FFFFFF');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bản in'), (@product_id, 'Tối giản');

-- -- SP 34
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Acrylic Mini (Để bàn)', 'Tranh acrylic vẽ trên canvas nhỏ, có kèm giá đỡ.', '/images/product/sp34_thumb.jpg', 2, 1, 90);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '15x15cm', 250000, 30, 150000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp34_v1.jpg');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Mini'), (@product_id, 'Để bàn');

-- -- SP 35
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Bản in Canvas Phong cảnh Núi', 'Bản in canvas cảnh núi tuyết hùng vĩ.', '/images/product/sp35_thumb.jpg', 6, 1, 140);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 11);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '50x70cm', 450000, 30, 280000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp35_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FFFFFF'), (@product_id, '#6F8FAF');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bản in'), (@product_id, 'Núi');

-- -- SP 36
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Lụa (Bản in)', 'Bản in trên chất liệu lụa, tranh đông hồ.', '/images/product/sp36_thumb.jpg', 7, 1, 165); -- Giả định giấy mỹ thuật = lụa
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '40x60cm', 600000, 20, 400000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp36_v1.jpg');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Truyền thống'), (@product_id, 'Đông hồ');

-- -- SP 37
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Sơn dầu Biển (Cỡ nhỏ)', 'Tranh sơn dầu gốc, cảnh biển.', '/images/product/sp37_thumb.jpg', 1, 1, 130);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 10);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '30x40cm', 900000, 5, 600000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp37_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#0077B6'), (@product_id, '#E0E1DD');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Biển'), (@product_id, 'Sơn dầu');

-- -- SP 38
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Bản in Art Print - Chân dung Sư tử', 'Bản in giấy mỹ thuật, hình sư tử.', '/images/product/sp38_thumb.jpg', 7, 1, 210);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, 'A3 (30x42cm)', 200000, 50, 120000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp38_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#000000'), (@product_id, '#D4AF37');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Động vật'), (@product_id, 'Bản in');

-- -- SP 39
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Acrylic Hoa Sen', 'Tranh acrylic vẽ hoa sen trên canvas.', '/images/product/sp39_thumb.jpg', 2, 1, 180);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '50x50cm', 1200000, 10, 750000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp39_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E87A90'), (@product_id, '#34A853');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Hoa sen'), (@product_id, 'Tĩnh vật');

-- -- SP 40
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Bản in Canvas - Bản đồ Thế giới Cổ', 'Bản in canvas, thiết kế bản đồ cổ.', '/images/product/sp40_thumb.jpg', 6, 1, 230);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '60x90cm', 550000, 25, 350000),
-- (@product_id, '80x120cm', 750000, 15, 500000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp40_v1.jpg'), (@variant2_id, '/images/product/sp40_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#A67B5B'), (@product_id, '#FCE3B1');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bản đồ'), (@product_id, 'Vintage');

-- -- ============================================
-- -- SẢN PHẨM 41 - 50 (Nhóm Tổng hợp)
-- -- ============================================

-- -- SP 41
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Trừu tượng Hình học (Bản in)', 'Bản in giấy mỹ thuật, thiết kế hình học.', '/images/product/sp41_thumb.jpg', 7, 1, 88);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 8);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, 'A3 (30x42cm)', 190000, 40, 110000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp41_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#DB4437'), (@product_id, '#000000');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Hình học'), (@product_id, 'Bản in');

-- -- SP 42
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Sơn dầu Phong cảnh Đồng quê (Mini)', 'Tranh sơn dầu gốc, cỡ nhỏ.', '/images/product/sp42_thumb.jpg', 1, 1, 122);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 12);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '20x30cm', 700000, 8, 450000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp42_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#34A853'), (@product_id, '#AECBFA');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Đồng quê'), (@product_id, 'Mini');

-- -- SP 43
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khung Composite Đen (A4, A3)', 'Khung composite đen, bản mỏng, hiện đại.', '/images/product/sp43_thumb.jpg', 8, 1, 215);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 23);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, 'A4 (21x30cm)', 150000, 100, 90000),
-- (@product_id, 'A3 (30x42cm)', 220000, 80, 140000);
-- SET @variant1_id = LAST_INSERT_ID();
-- SET @variant2_id = @variant1_id + 1;
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp43_v1.jpg'), (@variant2_id, '/images/product/sp43_v2.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#000000');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Tối giản');

-- -- SP 44
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Màu nước Chân dung (Gốc)', 'Tranh màu nước gốc vẽ chân dung cô gái.', '/images/product/sp44_thumb.jpg', 3, 1, 155);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '40x50cm', 1500000, 1, 900000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp44_v1.jpg');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Chân dung'), (@product_id, 'Màu nước');

-- -- SP 45
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Siêu thực (Bản in Canvas)', 'Bản in canvas một tác phẩm siêu thực.', '/images/product/sp45_thumb.jpg', 6, 1, 100);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 19);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '50x70cm', 480000, 20, 300000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp45_v1.jpg');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Siêu thực'), (@product_id, 'Bản in');

-- -- SP 46
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Sơn dầu Hiện đại (Trừu tượng)', 'Tranh sơn dầu gốc, trừu tượng hiện đại.', '/images/product/sp46_thumb.jpg', 1, 1, 135);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 3), (@product_id, 16);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '80x80cm', 3500000, 3, 2500000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp46_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#C70039'), (@product_id, '#2C2A2A');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Sơn dầu'), (@product_id, 'Trừu tượng');

-- -- SP 47
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Khung Gỗ Thông (Set 3 cái)', 'Set 3 khung gỗ thông tự nhiên, cỡ nhỏ.', '/images/product/sp47_thumb.jpg', 4, 1, 105);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 24);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '13x18cm (Set 3)', 250000, 40, 180000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp47_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FCE3B1');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Set');

-- -- SP 48
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Bản in Art Print - Cặp đôi', 'Bản in giấy mỹ thuật, hình vẽ đường nét (line art) cặp đôi.', '/images/product/sp48_thumb.jpg', 7, 1, 195);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, 'A4 (21x30cm)', 130000, 70, 80000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp48_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#000000'), (@product_id, '#FFFFFF');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Line art'), (@product_id, 'Tình yêu');

-- -- SP 49
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Tranh Acrylic Phong cảnh Thành phố đêm', 'Tranh acrylic gốc, thành phố về đêm.', '/images/product/sp49_thumb.jpg', 2, 1, 145);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 2), (@product_id, 13);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '60x90cm', 2400000, 5, 1600000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp49_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4285F4'), (@product_id, '#F4B400');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Thành phố'), (@product_id, 'Ban đêm');

-- -- SP 50
-- INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
-- ('Bản in Canvas - Tĩnh vật Hiện đại', 'Bản in canvas tĩnh vật hoa, phong cách hiện đại.', '/images/product/sp50_thumb.jpg', 6, 1, 110);
-- SET @product_id = LAST_INSERT_ID();
-- INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 15);
-- INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
-- (@product_id, '50x50cm', 400000, 30, 250000);
-- SET @variant1_id = LAST_INSERT_ID();
-- INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, '/images/product/sp50_v1.jpg');
-- INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E0E1DD'), (@product_id, '#8B4513');
-- INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Tĩnh vật'), (@product_id, 'Hiện đại');

-- -- ============================================
-- -- KẾT THÚC TRANSACTION
-- -- ============================================
-- COMMIT;