use artdbproject;

-- ============================================
-- CHÈN DỮ LIỆU MẪU (50 SẢN PHẨM) - CẬP NHẬT MÔ TẢ
-- ============================================
START TRANSACTION;
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

COMMIT;

 -- SP 18
 INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
 ('Tĩnh vật Giỏ trái cây', 'Tranh sơn dầu tĩnh vật, ánh sáng cổ điển.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764475544/IMG_20250924_155429_jtcsml.jpg', 1, 1, 170);
 SET @product_id = LAST_INSERT_ID();
 INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 15);
 INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
 (@product_id, '50x70cm', 2000000, 7, 1300000);
 SET @variant1_id = LAST_INSERT_ID();
 INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764475544/IMG_20250924_155429_jtcsml.jpg');
 INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#DB4437'), (@product_id, '#34A853');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Tĩnh vật'), (@product_id, 'Trái cây');

-- -- SP 19
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Chân dung Tự họa', 'Tranh sơn dầu hiện đại, phong cách tự họa.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764475776/IMG_20231009_124142-2_oiquer.jpg', 1, 1, 85);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 3), (@product_id, 14), (@product_id, 16);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '40x40cm', 1500000, 5, 1000000);
SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764475776/IMG_20231009_124142-2_oiquer.jpg');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Chân dung'), (@product_id, 'Hiện đại');

-- -- ============================================
-- -- SẢN PHẨM 21 - 25 (Nhóm Nghệ Thuật)
-- -- ============================================

-- -- SP 20
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Đêm đầy sao (Van Gogh)', 'Tranh phục dựng theo trường phái Ấn tượng, sơn dầu.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764476043/Van_Gogh_-_Starry_Night_-_Google_Art_Project_kln6ff.jpg', 1, 1, 450);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 17);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '60x90cm', 3800000, 7, 2500000),
(@product_id, '80x120cm', 5000000, 3, 3500000);
SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764476051/chuyen-gia-phan-bien-ve-buc-tranh-dem-day-sao-cua-van-gogh-1744167369361667823072-29-0-657-1200-crop-1744167524176737805114_g9zndh.jpg'),(@variant1_id,'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764476049/photo1666855374826-16668553762391887687378_u3fdtr.webp'), (@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764476050/O1CN01oAZTmY1Lt5elbBubF__2775031356.png_540x540_uxakhx.avif');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4285F4'), (@product_id, '#F4B400');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Ấn tượng'), (@product_id, 'Van Gogh');
 
-- -- SP 21
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Sự bền bỉ của Ký ức', 'Tranh phục dựng Siêu thực, chất liệu Acrylic.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764476938/S%E1%BB%B1_dai_d%E1%BA%B3ng_c%E1%BB%A7a_k%C3%BD_%E1%BB%A9c_owengh.jpg', 2, 1, 320);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 19);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '50x70cm', 2300000, 10, 1500000);
SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764476938/S%E1%BB%B1_dai_d%E1%BA%B3ng_c%E1%BB%A7a_k%C3%BD_%E1%BB%A9c_owengh.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#A67B5B'), (@product_id, '#5E8B7E');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Siêu thực'), (@product_id, 'Dali');

-- -- SP 22
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Mona Lisa (Da Vinci)', 'Tranh phục dựng Phục Hưng, sơn dầu chất lượng cao.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764477180/960px-Gioconda__copia_del_Museo_del_Prado_restaurada_q6jx30.jpg', 1, 1, 500);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 20);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '53x77cm', 8000000, 2, 6000000);
SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764477180/960px-Gioconda__copia_del_Museo_del_Prado_restaurada_q6jx30.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764477085/135517-tiet-lo-bi-mat-moi-ve-kiet-tac-mona-lisa_iyn0qb.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4E4B3C'), (@product_id, '#8B4513');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Phục Hưng'), (@product_id, 'Chân dung');

-- -- SP 23
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Những cô gái Avignon (Picasso)', 'Tranh phục dựng Lập thể, sơn dầu.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764477675/Les-Demoiselles-dAvignon-972x1024_c42teg.png', 1, 1, 180);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 18);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '100x100cm', 7500000, 3, 5000000);
SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764477675/Les-Demoiselles-dAvignon-972x1024_c42teg.png'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764477529/tranh-son-dau-nhung-co-nang-o-avignon-homeazvn3-1142_xw987i.webp');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E6A99C'), (@product_id, '#5E8B7E');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Lập thể'), (@product_id, 'Picasso');

-- -- SP 24
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Ấn tượng Mặt trời mọc', 'Tranh phục dựng Ấn tượng, acrylic.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480390/999px-Claude_Monet__Impression__soleil_levant__1872_qzsy0k.jpg', 2, 1, 290);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4), (@product_id, 17);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '60x80cm', 2600000, 8, 1700000);
SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480390/999px-Claude_Monet__Impression__soleil_levant__1872_qzsy0k.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480378/4-95925_thumb_ine7ni.webp');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#FF5733'), (@product_id, '#AECBFA');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Ấn tượng'), (@product_id, 'Phong cảnh');

-- -- ============================================
-- -- SẢN PHẨM 26 - 30 (Nhóm Khung Tranh)
-- -- ============================================

-- -- SP 25
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Khung Kim loại Hiện đại', 'Khung kim loại mạ vàng, thiết kế thanh mảnh, hiện đại.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480624/an4-1_j4ivyc.jpg', 5, 1, 140);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 5), (@product_id, 22);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '30x40cm', 350000, 40, 250000),
(@product_id, '50x70cm', 500000, 30, 350000);
SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480624/an4-1_j4ivyc.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480612/kt28t2.jpg_fsjlbb.webp'), (@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480614/kt28-4.jpg_jzfiiy.webp');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#D4AF37');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Khung tranh'), (@product_id, 'Hiện đại');


-- -- SP 26
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Bản in Canvas Trừu tượng Xanh', 'Bản in nghệ thuật (art print) trên canvas, chủ đề trừu tượng.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480826/ranh-tru%CC%9B%CC%80u-tu%CC%9Bo%CC%9B%CC%A3ng-ma%CC%80u-xanh-ve%CC%83-hie%CC%A3%CC%82n-da%CC%A3i-kho%CC%82%CC%89-lo%CC%9B%CC%81n-1-100x100-1.jpg_wlkra6.webp', 6, 1, 95);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 1), (@product_id, 8);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '40x60cm', 350000, 50, 200000),
(@product_id, '60x90cm', 500000, 40, 300000);
SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480826/ranh-tru%CC%9B%CC%80u-tu%CC%9Bo%CC%9B%CC%A3ng-ma%CC%80u-xanh-ve%CC%83-hie%CC%A3%CC%82n-da%CC%A3i-kho%CC%82%CC%89-lo%CC%9B%CC%81n-1-100x100-1.jpg_wlkra6.webp'), (@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480826/ranh-tru%CC%9B%CC%80u-tu%CC%9Bo%CC%9B%CC%A3ng-ma%CC%80u-xanh-ve%CC%83-hie%CC%A3%CC%82n-da%CC%A3i-kho%CC%82%CC%89-lo%CC%9B%CC%81n-1-100x100-1.jpg_wlkra6.webp'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480828/tranh-kho-lon-2.jpg_ce4i16.webp'), (@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764480833/tranh-tru%CC%9B%CC%80u-tu%CC%9Bo%CC%9B%CC%A3ng-ma%CC%80u-xanh-ve%CC%83-hie%CC%A3%CC%82n-da%CC%A3i-kho%CC%82%CC%89-lo%CC%9B%CC%81n-1.jpg_i5wfxc.webp');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#4285F4'), (@product_id, '#AECBFA');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bản in'), (@product_id, 'Trừu tượng');

-- -- SP 27
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Tranh Màu nước Hoa Mẫu đơn', 'Tranh màu nước gốc, vẽ hoa mẫu đơn trên giấy mỹ thuật.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764481089/IMG_3713-e1721661352167_dtufu6.jpg', 3, 1, 175);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '30x40cm', 800000, 1, 500000); -- Hàng gốc (Original)
SET @variant1_id = LAST_INSERT_ID();
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764481089/IMG_3713-e1721661352167_dtufu6.jpg'),(@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764481092/IMG_3711-1536x1516_c3mfcv.jpg');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#E87A90'), (@product_id, '#34A853');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Hoa'), (@product_id, 'Màu nước');


-- -- SP 40
INSERT INTO `product` (`productname`, `description`, `thumbnail`, `material_id`, `product_status`, `view_count`) VALUES
('Bản in Canvas - Bản đồ Thế giới Cổ', 'Bản in canvas, thiết kế bản đồ cổ.', 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764481282/tranh_cac_quoc_gia_tren_the_gioi_1100x_hjhicu.webp', 6, 1, 230);
SET @product_id = LAST_INSERT_ID();
INSERT INTO `product_categories` (`product_id`, `categories_id`) VALUES (@product_id, 4);
INSERT INTO `product_variants` (`product_id`, `dimensions`, `price`, `stock_quantity`, `cost_price`) VALUES
(@product_id, '60x90cm', 550000, 25, 350000),
(@product_id, '80x120cm', 750000, 15, 500000);
SET @variant1_id = LAST_INSERT_ID();
SET @variant2_id = @variant1_id + 1;
INSERT INTO `product_images` (`variant_id`, `image_url`) VALUES (@variant1_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764481282/tranh_cac_quoc_gia_tren_the_gioi_1100x_hjhicu.webp'), (@variant2_id, 'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764481329/tranh-ban-do-va-dong-vat-10147771VT741_1100x_dmuyun.webp');
INSERT INTO `product_colors` (`product_id`, `hex_code`) VALUES (@product_id, '#A67B5B'), (@product_id, '#FCE3B1');
INSERT INTO `product_topics` (`product_id`, `topic_name`) VALUES (@product_id, 'Bản đồ'), (@product_id, 'Vintage');

-- -- ============================================
-- -- KẾT THÚC TRANSACTION
-- -- ============================================
-- COMMIT;
USE artdbproject;
-- 1. Chèn User vào bảng users
INSERT INTO `users` (
    `username`, 
    `email`, 
    `password`, 
    `full_name`, 
    `phone_number`, 
    `enabled`, 
    `account_non_locked`, 
    `created_at`, 
    `updated_at`
) VALUES (
    'ngocongthanhsg0812', 
    'ngocongthanhsg0812@gmail.com', 
    '$2a$10$BeQYx7Wfmu6206PwbJPygu8s/ljPNpPFlkKLAFtUzeVlcYCeSDB7i', 
    'Ngô Công Thành', -- Mình tự điền tên hiển thị dựa trên username
    NULL, 
    TRUE,  -- enabled
    TRUE,  -- account_non_locked
    '2025-11-27 18:31:22', 
    '2025-11-29 09:02:13'
);

-- 2. Lấy ID của user vừa tạo và ID của quyền ADMIN để liên kết
SET @new_user_id = LAST_INSERT_ID();
SET @admin_role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN' LIMIT 1);

-- 3. Cấp quyền ADMIN cho user này
INSERT INTO `user_roles` (`user_id`, `role_id`) 
VALUES (@new_user_id, @admin_role_id);

-- 1. Chèn User vào bảng users
INSERT INTO `users` (
    `username`, 
    `email`, 
    `password`, 
    `full_name`, 
    `phone_number`, 
    `enabled`, 
    `account_non_locked`, 
    `created_at`, 
    `updated_at`
) VALUES (
    'teooclol1',  -- Username tự đặt theo email
    'teooclol1@gmail.com', 
    '$2a$10$BeQYx7Wfmu6206PwbJPygu8s/ljPNpPFlkKLAFtUzeVlcYCeSDB7i', -- Hash mật khẩu giống Admin
    'Teo Oclol',  -- Tên giả định
    NULL, 
    TRUE, 
    TRUE, 
    '2025-11-27 18:31:22', -- Thời gian giống Admin
    '2025-11-29 09:02:13'
);

-- 2. Lấy ID của user vừa tạo và ID của quyền ROLE_USER (Khách hàng)
SET @new_user_id = LAST_INSERT_ID();
SET @user_role_id = (SELECT id FROM roles WHERE name = 'ROLE_USER' LIMIT 1);

-- 3. Cấp quyền ROLE_USER cho user này
INSERT INTO `user_roles` (`user_id`, `role_id`) 
VALUES (@new_user_id, @user_role_id);
-- ============================================
-- 1. SỬA LỖI DEFAULT VALUE TRONG DB (Chạy cái này trước)
-- ============================================
-- Đảm bảo cột discount_amount có giá trị mặc định là 0
ALTER TABLE `orders` MODIFY `discount_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00;

-- Tiện thể sửa luôn bảng order_items để tránh lỗi tương tự tiếp theo
ALTER TABLE `order_items` MODIFY `discount_applied` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- ============================================
-- 2. PROCEDURE ĐÃ FIX LỖI (Chạy lại đoạn này)
-- ============================================
DROP PROCEDURE IF EXISTS generate_mock_data;

DELIMITER //

CREATE PROCEDURE generate_mock_data()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;
    DECLARE k INT DEFAULT 1;
    
    -- Biến cho User
    DECLARE v_user_id BIGINT;
    DECLARE v_ho VARCHAR(50);
    DECLARE v_lot VARCHAR(50);
    DECLARE v_ten VARCHAR(50);
    DECLARE v_full_name VARCHAR(150);
    DECLARE v_username VARCHAR(100);
    DECLARE v_email VARCHAR(100);
    DECLARE v_phone VARCHAR(20);
    DECLARE v_role_user_id BIGINT;

    -- Biến cho Address
    DECLARE v_address_detail VARCHAR(255);
    DECLARE v_street VARCHAR(100);
    DECLARE v_dist VARCHAR(50);
    
    -- Biến cho Order
    DECLARE v_order_id BIGINT;
    DECLARE v_rand_user_id BIGINT;
    DECLARE v_order_date DATETIME;
    DECLARE v_order_status VARCHAR(50);
    DECLARE v_payment_status VARCHAR(50);
    DECLARE v_subtotal DECIMAL(15,2);
    DECLARE v_shipping_fee DECIMAL(15,2);
    DECLARE v_total DECIMAL(15,2);
    
    -- Biến cho Order Item
    DECLARE v_variant_id BIGINT;
    DECLARE v_item_price DECIMAL(10,2);
    DECLARE v_qty INT;
    DECLARE v_num_items INT;

    -- Lấy ID của ROLE_USER
    SELECT id INTO v_role_user_id FROM roles WHERE name = 'ROLE_USER' LIMIT 1;

    -- --------------------------------------------------------
    -- TẠO 30 KHÁCH HÀNG (USERS)
    -- --------------------------------------------------------
    SET i = 1;
    WHILE i <= 30 DO
        SET v_ho = ELT(FLOOR(1 + RAND() * 8), 'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ');
        SET v_lot = ELT(FLOOR(1 + RAND() * 6), 'Văn', 'Thị', 'Minh', 'Ngọc', 'Đức', 'Thanh');
        SET v_ten = ELT(FLOOR(1 + RAND() * 10), 'Tâm', 'Kiệt', 'Sô', 'Pháp', 'Thành', 'Hương', 'Lan', 'Tuấn', 'Hùng', 'Trang');
        SET v_full_name = CONCAT(v_ho, ' ', v_lot, ' ', v_ten);
        
        SET v_username = CONCAT('user', FLOOR(UNIX_TIMESTAMP() + RAND()*10000), i);
        SET v_email = CONCAT('user', FLOOR(UNIX_TIMESTAMP() + RAND()*10000), i, '@gmail.com');
        SET v_phone = CONCAT('09', FLOOR(10000000 + RAND() * 89999999));

        INSERT INTO users (username, email, password, full_name, phone_number, enabled, account_non_locked)
        VALUES (v_username, v_email, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd.g.w1.E.y', v_full_name, v_phone, TRUE, TRUE);
        
        SET v_user_id = LAST_INSERT_ID();
        INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, v_role_user_id);

        SET v_street = ELT(FLOOR(1 + RAND() * 5), 'Nguyễn Huệ', 'Lê Lợi', 'Cách Mạng Tháng 8', 'Điện Biên Phủ', 'Pasteur');
        SET v_dist = ELT(FLOOR(1 + RAND() * 5), 'Quận 1', 'Quận 3', 'Quận 7', 'Thủ Đức', 'Bình Thạnh');
        SET v_address_detail = CONCAT(FLOOR(1 + RAND() * 500), ' ', v_street, ', ', v_dist, ', TP.HCM');

        INSERT INTO addresses (user_id, address_name, address, latitude, longitude, is_default)
        VALUES (v_user_id, 'Nhà riêng', v_address_detail, 10.762622, 106.660172, TRUE);

        SET i = i + 1;
    END WHILE;

    -- --------------------------------------------------------
    -- TẠO 60 ĐƠN HÀNG (ORDERS)
    -- --------------------------------------------------------
    SET j = 1;
    WHILE j <= 60 DO
        SELECT id, address 
        INTO v_rand_user_id, v_address_detail 
        FROM (SELECT u.id, a.address FROM users u JOIN addresses a ON u.id = a.user_id ORDER BY RAND() LIMIT 1) AS tmp;
        
        SET v_order_date = FROM_UNIXTIME(UNIX_TIMESTAMP('2022-01-01 00:00:00') + FLOOR(0 + (RAND() * (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP('2022-01-01 00:00:00')))));
        SET v_order_status = ELT(FLOOR(1 + RAND() * 4), 'DELIVERED', 'DELIVERED', 'SHIPPED', 'CANCELLED');
        
        IF v_order_status = 'DELIVERED' THEN SET v_payment_status = 'PAID';
        ELSEIF v_order_status = 'CANCELLED' THEN SET v_payment_status = 'FAILED';
        ELSE SET v_payment_status = 'PENDING';
        END IF;

        -- [FIX] Đã thêm discount_amount = 0 vào câu lệnh INSERT
        INSERT INTO orders (user_id, address, latitude, longitude, subtotal_price, shipping_fee, discount_amount, total_price, order_status, payment_method, payment_status, created_at, updated_at)
        VALUES (v_rand_user_id, v_address_detail, 10.762622, 106.660172, 0, 0, 0, 0, v_order_status, 'COD', v_payment_status, v_order_date, v_order_date);

        SET v_order_id = LAST_INSERT_ID();

        -- Tạo chi tiết đơn hàng
        SET v_subtotal = 0;
        SET v_num_items = FLOOR(1 + RAND() * 3);
        SET k = 1;
        
        WHILE k <= v_num_items DO
            SELECT variant_id, price INTO v_variant_id, v_item_price FROM product_variants ORDER BY RAND() LIMIT 1;
            SET v_qty = FLOOR(1 + RAND() * 2);

            -- [FIX] Đã thêm discount_applied = 0 vào insert order_items
            INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase, discount_applied, cost_price_at_purchase)
            VALUES (v_order_id, v_variant_id, v_qty, v_item_price, 0, (v_item_price * 0.6));

            SET v_subtotal = v_subtotal + (v_item_price * v_qty);
            SET k = k + 1;
        END WHILE;

        -- Update lại tổng tiền
        SET v_shipping_fee = IF(v_subtotal > 2000000, 0, 30000);
        SET v_total = v_subtotal + v_shipping_fee; -- discount = 0

        UPDATE orders 
        SET subtotal_price = v_subtotal, 
            shipping_fee = v_shipping_fee, 
            total_price = v_total
        WHERE id = v_order_id;

        SET j = j + 1;
    END WHILE;
END //

DELIMITER ;

-- ============================================
-- CHẠY LẠI
-- ============================================
CALL generate_mock_data();


USE artdbproject;

DROP PROCEDURE IF EXISTS create_recent_orders;

DELIMITER //

CREATE PROCEDURE create_recent_orders()
BEGIN
    DECLARE x INT DEFAULT 1;
    
    -- Các biến để lưu thông tin đơn hàng
    DECLARE v_order_id BIGINT;
    DECLARE v_rand_user_id BIGINT;
    DECLARE v_address_detail VARCHAR(255);
    DECLARE v_order_date DATETIME;
    DECLARE v_order_status VARCHAR(50);
    DECLARE v_payment_status VARCHAR(50);
    DECLARE v_subtotal DECIMAL(15,2);
    DECLARE v_shipping_fee DECIMAL(15,2);
    DECLARE v_total DECIMAL(15,2);
    
    -- Các biến để lưu chi tiết sản phẩm
    DECLARE k INT;
    DECLARE v_num_items INT;
    DECLARE v_variant_id BIGINT;
    DECLARE v_item_price DECIMAL(10,2);
    DECLARE v_qty INT;

    -- Lặp 10 lần để tạo 10 đơn
    WHILE x <= 10 DO
        -- 1. Lấy ngẫu nhiên 1 User và địa chỉ của họ
        SELECT id, address INTO v_rand_user_id, v_address_detail 
        FROM (SELECT u.id, a.address FROM users u JOIN addresses a ON u.id = a.user_id ORDER BY RAND() LIMIT 1) AS tmp;

        -- 2. Random ngày giờ từ 24/11/2025 00:00:00 đến 01/12/2025 23:59:59
        SET v_order_date = FROM_UNIXTIME(
            UNIX_TIMESTAMP('2025-11-24 00:00:00') + 
            FLOOR(RAND() * (UNIX_TIMESTAMP('2025-12-01 23:59:59') - UNIX_TIMESTAMP('2025-11-24 00:00:00')))
        );

        -- 3. Logic trạng thái đơn hàng (cho hợp lý với thời gian)
        -- Nếu ngày đặt < ngày hiện tại (29/11) -> Random trạng thái: Đã giao, Đang giao, Đã hủy
        IF v_order_date < NOW() THEN
             SET v_order_status = ELT(FLOOR(1 + RAND() * 3), 'DELIVERED', 'SHIPPED', 'PAID');
        ELSE
        -- Nếu ngày đặt trong tương lai (30/11, 1/12) -> Trạng thái: Chờ xử lý hoặc Đang xử lý
             SET v_order_status = ELT(FLOOR(1 + RAND() * 2), 'PENDING', 'CANCELLED');
        END IF;
        
        -- Logic trạng thái thanh toán
        IF v_order_status = 'DELIVERED' THEN SET v_payment_status = 'PAID';
        ELSEIF v_order_status = 'CANCELLED' THEN SET v_payment_status = 'FAILED';
        ELSE SET v_payment_status = 'PENDING';
        END IF;

        -- 4. Tạo đơn hàng (INSERT orders)
        INSERT INTO orders (user_id, address, latitude, longitude, subtotal_price, shipping_fee, discount_amount, total_price, order_status, payment_method, payment_status, created_at, updated_at)
        VALUES (v_rand_user_id, v_address_detail, 10.762622, 106.660172, 0, 0, 0, 0, v_order_status, 'COD', v_payment_status, v_order_date, v_order_date);
        
        SET v_order_id = LAST_INSERT_ID();

        -- 5. Tạo chi tiết đơn hàng (INSERT order_items)
        SET v_subtotal = 0;
        SET v_num_items = FLOOR(1 + RAND() * 3); -- Mỗi đơn mua 1-3 món
        SET k = 1;
        
        WHILE k <= v_num_items DO
            SELECT variant_id, price INTO v_variant_id, v_item_price FROM product_variants ORDER BY RAND() LIMIT 1;
            SET v_qty = FLOOR(1 + RAND() * 2);

            INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase, discount_applied, cost_price_at_purchase)
            VALUES (v_order_id, v_variant_id, v_qty, v_item_price, 0, (v_item_price * 0.6));

            SET v_subtotal = v_subtotal + (v_item_price * v_qty);
            SET k = k + 1;
        END WHILE;

        -- 6. Cập nhật lại tổng tiền cho đơn hàng
        SET v_shipping_fee = IF(v_subtotal > 2000000, 0, 30000);
        SET v_total = v_subtotal + v_shipping_fee;

        UPDATE orders 
        SET subtotal_price = v_subtotal, 
            shipping_fee = v_shipping_fee, 
            total_price = v_total
        WHERE id = v_order_id;

        SET x = x + 1;
    END WHILE;
END //

DELIMITER ;

-- Chạy Procedure để tạo dữ liệu
CALL create_recent_orders();

-- Xóa Procedure sau khi dùng cho gọn DB
DROP PROCEDURE create_recent_orders;

-- Kiểm tra kết quả
USE artdbproject;

-- =======================================================
-- CẬP NHẬT TÊN VÀ SỐ ĐIỆN THOẠI CHO CÁC ĐƠN HÀNG VỪA TẠO
-- =======================================================
SET SQL_SAFE_UPDATES = 0;
UPDATE orders o
INNER JOIN users u ON o.user_id = u.id
SET 
    o.customer_name = u.full_name,
    o.customer_phone = u.phone_number
WHERE 
    -- Chỉ cập nhật các đơn hàng từ ngày 24/11/2025 trở đi (đợt vừa tạo)
    o.created_at >= '2025-11-24 00:00:00' 
    -- Hoặc an toàn hơn là cập nhật tất cả đơn nào đang bị NULL
    or (o.customer_name IS NULL OR o.customer_phone IS NULL);
SET SQL_SAFE_UPDATES = 1;
-- =======================================================
-- KIỂM TRA LẠI KẾT QUẢ
-- =======================================================
USE artdbproject;

-- ==================================================================
-- 1. CHƯƠNG TRÌNH KHÔNG CODE 1: "Lễ Hội Mua Sắm Cuối Năm"
-- Loại: Giảm 15% trực tiếp
-- Sản phẩm áp dụng: 1, 2, 3 (Tranh bình minh, hoàng hôn)
-- ==================================================================
INSERT INTO promotions (name, description, image_url, code, type, value, start_date, end_date, min_order_value, max_discount_value, usage_limit)
VALUES (
    'Lễ Hội Mua Sắm Cuối Năm 2025', 
    'Săn sale tưng bừng, mừng năm mới tới. Giảm ngay 15% cho các tác phẩm bán chạy nhất năm.', 
    'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764474757/Gemini_Generated_Image_l3gu35l3gu35l3gu_iup5cn.png', 
    NULL, -- Không có code
    'PERCENTAGE', 
    15.00, -- Giảm 15%
    '2025-11-25 00:00:00', 
    '2025-12-31 23:59:59', 
    0,      -- Không yêu cầu tối thiểu
    500000, -- Giảm tối đa 500k
    NULL    -- Không giới hạn số lượng
);

SET @promo1_id = LAST_INSERT_ID();
INSERT INTO promotion_products (promotion_id, product_id) VALUES 
(@promo1_id, 1), (@promo1_id, 2), (@promo1_id, 3);


-- ==================================================================
-- 2. CHƯƠNG TRÌNH KHÔNG CODE 2: "Tuần Lễ Nghệ Thuật Trừu Tượng"
-- Loại: Giảm tiền mặt 200k
-- Sản phẩm áp dụng: 11, 12, 15 (Các tranh trừu tượng)
-- ==================================================================
INSERT INTO promotions (name, description, image_url, code, type, value, start_date, end_date, min_order_value, max_discount_value, usage_limit)
VALUES (
    'Tuần Lễ Black Friday', 
    'Tuần lễ sale to, Không lo về giá. Giảm ngay 200k các sản phẩm trên.', 
    'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764475207/Gemini_Generated_Image_uae94duae94duae9_feihvm.png', 
    NULL, -- Không có code
    'FIXED_AMOUNT', 
    200000.00, -- Giảm 200k
    '2025-11-28 00:00:00', 
    '2025-12-15 23:59:59', 
    1000000, -- Đơn tối thiểu 1 triệu
    NULL, 
    NULL
);

SET @promo2_id = LAST_INSERT_ID();
INSERT INTO promotion_products (promotion_id, product_id) VALUES 
(@promo2_id, 11), (@promo2_id, 12), (@promo2_id, 15);


-- ==================================================================
-- 3. CHƯƠNG TRÌNH KHÔNG CODE 3: "Giáng Sinh An Lành"
-- Loại: Giảm 10%
-- Sản phẩm áp dụng: 4, 5, 14 (Tranh cổ điển, chân dung, lập thể)
-- ==================================================================
INSERT INTO promotions (name, description, image_url, code, type, value, start_date, end_date, min_order_value, max_discount_value, usage_limit)
VALUES (
    'Giáng Sinh An Lành - Rinh Tranh Đẹp', 
    'Ưu đãi mùa lễ hội. Giảm 10% cho các dòng tranh cổ điển làm quà tặng.', 
    'https://res.cloudinary.com/dfcb3zzw9/image/upload/v1764475306/Gemini_Generated_Image_v0ma8hv0ma8hv0ma_tyrtxi.png', 
    NULL, -- Không có code
    'PERCENTAGE', 
    10.00, -- Giảm 10%
    '2025-12-01 00:00:00', 
    '2025-12-25 23:59:59', 
    500000, 
    200000, -- Giảm tối đa 200k
    NULL
);

SET @promo3_id = LAST_INSERT_ID();
INSERT INTO promotion_products (promotion_id, product_id) VALUES 
(@promo3_id, 4), (@promo3_id, 5), (@promo3_id, 14);


-- ==================================================================
-- 4. CHƯƠNG TRÌNH CÓ CODE 1: "Khách Hàng Thân Thiết"
-- Code: ARTLOVER
-- Loại: Giảm 20% (Khá sâu)
-- Sản phẩm áp dụng: 6, 7, 8 (Tranh phong cảnh rừng, lúa, phố cổ)
-- ==================================================================
INSERT INTO promotions (name, description, image_url, code, type, value, start_date, end_date, min_order_value, max_discount_value, usage_limit)
VALUES (
    'Đặc Quyền Art Lover', 
    'Nhập mã ARTLOVER để giảm ngay 20%. Dành riêng cho những tâm hồn yêu thiên nhiên và phong cảnh.', 
    '', 
    'ARTLOVER', -- CÓ CODE
    'PERCENTAGE', 
    20.00, -- Giảm 20%
    '2025-11-20 00:00:00', 
    '2026-01-30 23:59:59', 
    800000, 
    1000000, -- Giảm tối đa 1 triệu
    100 -- Chỉ 100 mã
);

SET @promo4_id = LAST_INSERT_ID();
INSERT INTO promotion_products (promotion_id, product_id) VALUES 
(@promo4_id, 6), (@promo4_id, 7), (@promo4_id, 8);


-- ==================================================================
-- 5. CHƯƠNG TRÌNH CÓ CODE 2: "Chào Đông 2025"
-- Code: HELLO2026
-- Loại: Giảm tiền mặt 500k (Cho đơn hàng lớn)
-- Sản phẩm áp dụng: 9, 10, 13 (Tranh Vịnh Hạ Long, Suối, Tranh khổ lớn)
-- ==================================================================
INSERT INTO promotions (name, description, image_url, code, type, value, start_date, end_date, min_order_value, max_discount_value, usage_limit)
VALUES (
    'Chào Đón Năm Mới 2026', 
    'Mã giảm giá đặc biệt HELLO2026 giảm ngay 500K cho các tác phẩm phong cảnh hùng vĩ.', 
    '', 
    'HELLO2026', -- CÓ CODE
    'FIXED_AMOUNT', 
    500000.00, -- Giảm 500k
    '2025-12-15 00:00:00', 
    '2026-02-15 23:59:59', 
    2500000, -- Chỉ áp dụng đơn trên 2.5 triệu
    NULL, 
    50 -- Chỉ 50 mã
);

SET @promo5_id = LAST_INSERT_ID();
INSERT INTO promotion_products (promotion_id, product_id) VALUES 
(@promo5_id, 9), (@promo5_id, 10), (@promo5_id, 13);


USE artdbproject;
INSERT INTO suppliers (name, contact_person, email, phone_number, address)
VALUES ('Công ty TNHH Nghệ Thuật Việt', 'Nguyễn Văn An', 'nguyenvanan@nghethuatviet.com', '0901234567', '123 Đường Lê Lợi, Quận 1, TP.HCM');
INSERT INTO suppliers (name, contact_person, email, phone_number, address)
VALUES ('Công ty Cổ Phần Tranh Đẹp', 'Trần Thị Bình', 'tranbinhmoi@tranhdep.vn', '0912345678', '456 Nguyễn Huệ, Quận 3, TP.HCM');
INSERT INTO suppliers (name, contact_person, email, phone_number, address)
VALUES ('Xưởng Khung Tranh Hoàng Gia', 'Lê Minh Châu', 'leminhchau@khungtranhhoanggia.com', '0923456789', '789 Cách Mạng Tháng 8, Quận 10, TP.HCM');
INSERT INTO suppliers (name, contact_person, email, phone_number, address)
VALUES ('Nhà Cung Cấp Vật Liệu Mỹ Thuật An Phát', 'Phạm Đức Dũng', 'phamdung@anphat.com.vn', '0934567890', '321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM');
INSERT INTO suppliers (name, contact_person, email, phone_number, address)
VALUES ('Công ty CP Sơn Dầu Đông Á', 'Huỳnh Thị Em', 'huynhem@sondaudenga.vn', '0945678901', '654 Pasteur, Quận 1, TP.HCM');
INSERT INTO suppliers (name, contact_person, email, phone_number, address)
VALUES ('Công ty TNHH Canvas & More', 'Võ Văn Phúc', 'vophuc@canvasmore.com', '0956789012', '987 Hai Bà Trưng, Quận 3, TP.HCM');

-- ===================================
-- DỮ LIỆU PHIẾU NHẬP (10 phiếu)
-- ===================================



INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (1, 'PN20251109001', 'Nhập hàng định kỳ tháng 11', 1, 0.00, '2025-11-09 00:00:00');
SET @receipt1_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (2, 'PN20251121002', 'Nhập canvas và khung theo đơn đặt hàng', 1, 0.00, '2025-11-21 00:00:00');
SET @receipt2_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (5, 'PN20251125003', NULL, 1, 0.00, '2025-11-25 00:00:00');
SET @receipt3_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (5, 'PN20251129004', 'Nhập hàng chuẩn bị cho mùa lễ', 1, 0.00, '2025-11-29 00:00:00');
SET @receipt4_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (1, 'PN20251130005', 'Nhập sản phẩm mới từ nhà cung cấp', 1, 0.00, '2025-11-30 00:00:00');
SET @receipt5_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (6, 'PN20251105006', 'Nhập sản phẩm mới từ nhà cung cấp', 1, 0.00, '2025-11-05 00:00:00');
SET @receipt6_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (2, 'PN20251115007', 'Nhập hàng chuẩn bị cho mùa lễ', 1, 0.00, '2025-11-15 00:00:00');
SET @receipt7_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (3, 'PN20251118008', NULL, 1, 0.00, '2025-11-18 00:00:00');
SET @receipt8_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (3, 'PN20251113009', NULL, 1, 0.00, '2025-11-13 00:00:00');
SET @receipt9_id = LAST_INSERT_ID();

INSERT INTO goods_receipts (supplier_id, receipt_code, note, creator_id, total_amount, created_at)
VALUES (1, 'PN20251104010', 'Nhập sản phẩm mới từ nhà cung cấp', 1, 0.00, '2025-11-04 00:00:00');
SET @receipt10_id = LAST_INSERT_ID();

-- ===================================
-- CHI TIẾT PHIẾU NHẬP
-- ===================================

-- Chi tiết phiếu nhập PN20251109001
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt1_id, 3, 22, 500000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt1_id, 4, 14, 2000000, 4469515);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt1_id, 13, 13, 2000000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt1_id, 14, 10, 300000, 724972);

-- Chi tiết phiếu nhập PN20251121002
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt2_id, 14, 13, 1200000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt2_id, 24, 28, 1500000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt2_id, 3, 9, 3000000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt2_id, 6, 18, 3000000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt2_id, 8, 9, 2000000, NULL);

-- Chi tiết phiếu nhập PN20251125003
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt3_id, 1, 7, 300000, 515547);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt3_id, 13, 13, 3000000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt3_id, 25, 8, 800000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt3_id, 5, 12, 1500000, NULL);

-- Chi tiết phiếu nhập PN20251129004
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt4_id, 30, 25, 1500000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt4_id, 36, 5, 800000, 1259716);

-- Chi tiết phiếu nhập PN20251130005
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt5_id, 34, 20, 800000, 1469898);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt5_id, 20, 26, 300000, 737375);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt5_id, 11, 14, 800000, 1868923);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt5_id, 36, 6, 300000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt5_id, 13, 18, 1200000, 2923568);

-- Chi tiết phiếu nhập PN20251105006
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt6_id, 31, 15, 2000000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt6_id, 36, 29, 800000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt6_id, 26, 10, 1200000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt6_id, 35, 18, 800000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt6_id, 37, 18, 3000000, 5814431);

-- Chi tiết phiếu nhập PN20251115007
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt7_id, 1, 5, 300000, 618726);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt7_id, 24, 17, 2000000, 3127987);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt7_id, 26, 28, 800000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt7_id, 5, 12, 1200000, 2728300);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt7_id, 16, 13, 300000, 547270);

-- Chi tiết phiếu nhập PN20251118008
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt8_id, 5, 28, 2000000, 4640800);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt8_id, 21, 28, 800000, 1844287);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt8_id, 25, 18, 2000000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt8_id, 7, 13, 1500000, NULL);

-- Chi tiết phiếu nhập PN20251113009
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt9_id, 22, 18, 300000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt9_id, 9, 18, 1200000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt9_id, 13, 12, 1200000, NULL);

-- Chi tiết phiếu nhập PN20251104010
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt10_id, 16, 16, 300000, NULL);
INSERT INTO goods_receipt_items (receipt_id, variant_id, quantity, import_price, new_selling_price)
VALUES (@receipt10_id, 25, 16, 1200000, 2832317);

-- ===================================
-- CẬP NHẬT TỔNG GIÁ TRỊ PHIẾU NHẬP
-- ===================================

UPDATE goods_receipts gr
SET total_amount = (
    SELECT SUM(gri.quantity * gri.import_price)
    FROM goods_receipt_items gri
    WHERE gri.receipt_id = gr.id
)
WHERE gr.id > 0;

SET SQL_SAFE_UPDATES = 1;