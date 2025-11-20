package com.ct08team.artbackendproject.Service.Product;

import com.ct08team.artbackendproject.DAO.CategoryRepository;
import com.ct08team.artbackendproject.DAO.MaterialRepository;
import com.ct08team.artbackendproject.DAO.ProductRepository;
import com.ct08team.artbackendproject.DTO.ProductAdminDTO;
import com.ct08team.artbackendproject.DTO.ProductCreateDTO;
import com.ct08team.artbackendproject.DTO.ProductDetailDTO;
import com.ct08team.artbackendproject.DTO.ProductListDTO;
import com.ct08team.artbackendproject.DTO.Filter.ProductFilterRequestDTO;
import com.ct08team.artbackendproject.Entity.product.*;
import com.ct08team.artbackendproject.Service.Filter.FilterService;
import com.ct08team.artbackendproject.Service.Promotion.PromotionCalculationService;
import com.ct08team.artbackendproject.Service.Storage.StorageService;
import com.ct08team.artbackendproject.Specification.ProductAdminSpecification;
import com.ct08team.artbackendproject.Specification.ProductSpecification;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private   CategoryRepository categoryRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PromotionCalculationService promotionCalculationService;
    // --- Logic danh mục đã được chuyển sang FilterService ---
    @Autowired
    private FilterService filterService; // Inject FilterService
    @Autowired
    private StorageService storageService; // (File này giờ đã dùng Cloudinary)
    /**
     * API mới: Lấy chi tiết sản phẩm theo ID
     * Dùng cho trang ProductDetail
    */

    @Transactional(readOnly = true)
    public List<ProductListDTO> searchProducts(String keyword, int limit) {
        String searchKeyword = "%" + keyword.toLowerCase() + "%";
        
        List<Product> products = productRepository.searchByKeyword(
            searchKeyword, 
            org.springframework.data.domain.PageRequest.of(0, limit)
        );
        
        return products.stream()
                .map(this::convertToProductListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDetailDTO getProductDetail(Long id) {
        try {

            Optional<Product> productOpt = productRepository.findByIdWithDetails(id);
            
            if (!productOpt.isPresent()) {
                return null;
            }
            
            Product p = productOpt.get();
            
            productRepository.findByIdWithVariants(id).ifPresent(productWithVariants -> {
                p.setVariants(productWithVariants.getVariants());
            });

            productRepository.findByIdWithColors(id).ifPresent(productWithColors -> {
                p.setColors(productWithColors.getColors());
            });
            
            // Build DTO
            ProductDetailDTO dto = new ProductDetailDTO();
            dto.id = p.getId();
            dto.productName = p.getProductName();
            dto.productname = p.getProductName();
            dto.description = p.getDescription();
            dto.thumbnail = p.getThumbnail();
            dto.minPrice = p.getMinPrice();
            dto.productStatus = p.getProductStatus();

            dto.originalPrice = p.getMinPrice();
            Optional<BigDecimal> promoPriceOpt = promotionCalculationService.calculateBestPromotionPrice(p);
            dto.promotionalPrice = promoPriceOpt.orElse(null);

            // Categories
            dto.categories = p.getCategories() == null ? List.of() :
                p.getCategories().stream()
                    .map(c -> new ProductDetailDTO.CategoryDTO(c.getId(), c.getName()))
                    .collect(Collectors.toList());

            // Variants
            dto.variants = p.getVariants() == null ? List.of() :
                p.getVariants().stream()
                    .filter(v -> v.getVariantStatus() == 1)
                    .map(v -> new ProductDetailDTO.VariantDTO(
                        v.getId(),
                        v.getDimensions(),
                        v.getPrice() == null ? 0.0 : v.getPrice().doubleValue(),
                        v.getStockQuantity()
                    ))
                    .collect(Collectors.toList());

            List<ProductDetailDTO.ImageDTO> imgs = new ArrayList<>();
            if (p.getVariants() != null) {
                for (var variant : p.getVariants()) {
                    var images = variant.getImages();
                    if (images != null && !images.isEmpty()) {
                        for (var img : images) {
                            imgs.add(new ProductDetailDTO.ImageDTO(img.getImageUrl()));
                        }
                    }
                }
            }
            
            // Fallback: Dùng thumbnail nếu không có ảnh
            if (imgs.isEmpty() && p.getThumbnail() != null) {
                imgs.add(new ProductDetailDTO.ImageDTO(p.getThumbnail()));
            }
            dto.images = imgs;
            System.out.println("   - Images: " + dto.images.size());

            if (p.getMaterial() != null) {
                // (Giả sử Entity Material của bạn có hàm .getId() và .getMaterialname())
                dto.material = new ProductDetailDTO.MaterialDTO(
                        p.getMaterial().getId(),
                        p.getMaterial().getMaterialName()
                );
            }

            System.out.println("   - Material: " + (dto.material != null ? dto.material.name : "null"));
            // ✅ Colors
            dto.colors = p.getColors() == null ? List.of() :
                p.getColors().stream()
                    .map(productColor -> new ProductDetailDTO.ColorDTO(productColor.getHexCode()))
                    .collect(Collectors.toList());
            System.out.println("   - Colors: " + dto.colors.size());
            dto.topics = p.getTopics() == null ? List.of() :
                    p.getTopics().stream()
                            // (Giả sử Entity ProductTopic có hàm .getTopicName())
                            .map(productTopic -> new ProductDetailDTO.TopicDTO(productTopic.getTopicName()))
                            .collect(Collectors.toList());
            System.out.println("   - Topics: " + dto.topics.size());
            System.out.println("✅ [ProductService] DTO created successfully");
            return dto;
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Could not fetch product: " + e.getMessage(), e);
        }
    }

    /**
     * API mới: Lấy sản phẩm theo category (dùng cho related products)
     */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        // Gọi hàm Repository vừa viết ở trên
        // Tham số thứ 2 là 1 (để chỉ lấy sản phẩm Active)
        Page<Product> page = productRepository.findByCategoryIdAndProductStatus(categoryId, 1, pageable);

        return page.map(this::convertToProductListDTO);
    }
    /**
     * API 3: Lấy danh sách sản phẩm (ĐÃ CẬP NHẬT)
     */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> searchProducts(ProductFilterRequestDTO filter, Pageable pageable) {
        // --- BƯỚC MỚI: GỌI FILTERSERVICE ĐỂ MỞ RỘNG IDS ---
        // Lấy danh sách ID gốc từ DTO (ví dụ: [1])
        List<Long> originalCategoryIds = filter.getCategories();

        // Mở rộng nó (ví dụ: [1, 6, 7, 8, 9]) bằng cách gọi FilterService
        List<Long> expandedCategoryIds = filterService.expandCategoryIds(originalCategoryIds);

        // Đặt lại danh sách đã mở rộng vào DTO
        filter.setCategories(expandedCategoryIds);
        // --- HẾT BƯỚC MỚI ---

        // 1. Xây dựng bộ lọc (WHERE)
        // Specification sẽ nhận DTO đã cập nhật
        Specification<Product> spec = ProductSpecification.build(filter);
        Specification<Product> statusSpec = (root, query, cb) -> cb.equal(root.get("productStatus"), 1);
        Specification<Product> finalSpec = spec.and(statusSpec);
        // 2. Tự động áp dụng phân trang VÀ sắp xếp
        Page<Product> productPage = productRepository.findAll(finalSpec, pageable);

        // 3. Chuyển đổi sang DTO để trả về
        return productPage.map(this::convertToProductListDTO);
    }

    /**
     * API: Lấy sản phẩm nổi bật
     * Tính điểm dựa trên view_count và sales_count
     */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> getFeaturedProducts(Pageable pageable) {
        // CHỈNH SỬA: Chỉ lấy danh sách status = 1 từ DB để giảm tải bộ nhớ
        // Thay vì findAll().stream().filter(...)
        List<Product> activeProducts = productRepository.findByProductStatus(1);
        System.out.println(activeProducts.get(0).getViewCount());
        // Tính điểm và sắp xếp (Logic giữ nguyên)
        List<Product> sortedProducts = activeProducts.stream()
                .sorted((p1, p2) -> {
                    double score1 = p1.getViewCount() * 0.3 + p1.getSalesCount() * 0.7;
                    double score2 = p2.getViewCount() * 0.3 + p2.getSalesCount() * 0.7;
                    return Double.compare(score2, score1);
                })
                .collect(Collectors.toList());

        // Phân trang thủ công (Giữ nguyên)
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), sortedProducts.size());

        // Fix lỗi index nếu start lớn hơn size list (tránh exception)
        if (start > sortedProducts.size()) {
            return Page.empty(pageable);
        }

        List<Product> pageContent = sortedProducts.subList(start, end);

        List<ProductListDTO> dtoList = pageContent.stream()
                .map(this::convertToProductListDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, sortedProducts.size());
    }

    /**
     * Sản phẩm mới nhất: Sắp xếp theo ID giảm dần
     */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> getNewestProducts(Pageable pageable) {
        // CHỈNH SỬA: Chỉ tìm status = 1
        // Repository tự động sắp xếp nếu trong Pageable có sort (ví dụ: id, desc)
        // Nếu pageable chưa có sort, bạn nên thêm default sort ở Controller hoặc tại đây
        Page<Product> productPage = productRepository.findByProductStatus(1, pageable);
        return productPage.map(this::convertToProductListDTO);
    }

    /**
     * Lấy danh sách sản phẩm theo IDs (dùng cho sản phẩm đã xem)
     */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> getProductsByIds(List<Long> ids, Pageable pageable) {
        if (ids == null || ids.isEmpty()) {
            return Page.empty(pageable);
        }

        // Lấy sản phẩm theo thứ tự trong danh sách IDs
        List<Product> products = ids.stream()
                .map(id -> productRepository.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .filter(p -> p.getProductStatus() == 1)
                .collect(Collectors.toList());

        // Áp dụng phân trang
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), products.size());
        List<Product> pageContent = products.subList(start, end);

        List<ProductListDTO> dtoList = pageContent.stream()
                .map(this::convertToProductListDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, products.size());
    }

    // --- 2. API CHO ADMIN (ProductAdmin.jsx) ---

    /**
     * API: GET /api/v1/admin/products/search
     * Tìm kiếm đơn giản (dùng @RequestParam) cho Admin
     */
    @Transactional(readOnly = true)
    public Page<ProductAdminDTO> searchProductsAdmin(
            Long id, String productName, Long categoryId, Long materialId,
            Integer status, BigDecimal minPrice, BigDecimal maxPrice,
            Pageable pageable) {

        // =======================================================
        // SỬA: Thay thế TODO bằng logic Specification
        // =======================================================

        // 1. Tạo Specification từ file ProductAdminSpecification
        Specification<Product> spec = ProductAdminSpecification.build(
                id, productName, categoryId, materialId, status, minPrice, maxPrice
        );
// Yêu cầu kết quả phải có status là 0 HOẶC 1
        Specification<Product> mandatoryStatusSpec = (root, query, criteriaBuilder) -> {
            Predicate status0 = criteriaBuilder.equal(root.get("productStatus"), 0);
            Predicate status1 = criteriaBuilder.equal(root.get("productStatus"), 1);
            return criteriaBuilder.or(status0, status1);
        };

        // 3. Gộp 2 Specification lại
        // Lấy các filter của admin (filterSpec) VÀ điều kiện bắt buộc (mandatoryStatusSpec)
        Specification<Product> finalSpec = spec.and(mandatoryStatusSpec);

        // 4. Gọi repository với Specification cuối cùng đã gộp
        Page<Product> productPage = productRepository.findAll(finalSpec, pageable);
        // 2. Gọi repository với Specification

        // 3. Chuyển đổi Page<Product> sang Page<ProductAdminDTO>
        // (Hàm 'new ProductAdminDTO(product)' sẽ tự động map)
        return productPage.map(ProductAdminDTO::new);
        // =======================================================
        // KẾT THÚC SỬA
        // =======================================================
    }

    // =======================================================
    // MỚI: Thêm các hàm bị thiếu cho Admin (Delete và Toggle)
    // =======================================================

    /**
     * API: PUT /api/v1/admin/products/{id}/status
     * Ẩn/Hiện sản phẩm
     */
    @Transactional
    public void toggleProductStatus(Long productId, Integer newStatus) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        // CSDL của bạn dùng 'product_status' (Integer)
        product.setProductStatus(newStatus);
        productRepository.save(product);
    }

    /**
     * API: DELETE /api/v1/admin/products/{id}
     * Xóa sản phẩm
     */
    @Transactional
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId);
        }
        productRepository.deleteById(productId);
    }


    //add product
    @Transactional(rollbackFor = Exception.class)
    public ProductAdminDTO createProduct(
            ProductCreateDTO dto,
            MultipartFile thumbnailFile,
            List<MultipartFile> variantFiles) throws Exception {

        // 1. Tạo Product (Entity) chính
        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setProductStatus(0); // SỬA: Mặc định là 0 (Ẩn)

        // 2. Upload và Gán Thumbnail (NẾU CÓ)
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            String thumbnailUrl = storageService.uploadFile(thumbnailFile); // <-- Dùng Cloudinary
            product.setThumbnail(thumbnailUrl);
        }

        // 3. Lấy (Fetch) và Gán Material
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Material ID: " + dto.getMaterialId()));
        product.setMaterial(material);

        // 4. Lấy (Fetch) và Gán Categories
        Set<Category> categories = new HashSet<>();
        if (dto.getCategories() != null) {
            for (ProductCreateDTO.CategoryRef catRef : dto.getCategories()) {
                Category cat = categoryRepository.findById(catRef.getId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID: " + catRef.getId()));
                categories.add(cat);
            }
        }
        product.setCategories(categories);

        // 5. Gán Topics (Dùng @OneToMany(cascade=ALL))
        if (dto.getTopics() != null) {
            for (ProductCreateDTO.TopicRef topicRef : dto.getTopics()) {
                ProductTopic topic = new ProductTopic();
                topic.setTopicName(topicRef.getTopicName());
                product.addTopic(topic); // Dùng helper method
            }
        }

        // 6. Gán Colors (Dùng @OneToMany(cascade=ALL))
        if (dto.getColors() != null) {
            for (ProductCreateDTO.ColorRef colorRef : dto.getColors()) {
                ProductColor color = new ProductColor();
                color.setHexCode(colorRef.getHexCode());
                product.addColor(color); // Dùng helper method
            }
        }

        // 7. Gán Variants (Cascade)
        // MỚI: Dùng Iterator để duyệt danh sách file phẳng
        Iterator<MultipartFile> fileIterator = (variantFiles != null) ? variantFiles.iterator() : null;

        if (dto.getVariants() != null) {
            for (ProductCreateDTO.VariantCreateDTO variantDTO : dto.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setDimensions(variantDTO.getDimensions());
                variant.setPrice(BigDecimal.ZERO); // SỬA: Mặc định 0
                variant.setCostPrice(BigDecimal.ZERO); // SỬA: Mặc định 0
                variant.setStockQuantity(0L); // SỬA: Mặc định 0
                variant.setVariantStatus(variantDTO.getVariantStatus());

                // 8. Upload và Gán Images cho Variant (dùng imageCount)
                if (variantDTO.getImageCount() != null && fileIterator != null) {
                    for (int i = 0; i < variantDTO.getImageCount(); i++) {
                        if (!fileIterator.hasNext()) {
                            // Lỗi: React báo gửi 5 ảnh nhưng backend chỉ nhận được 3?
                            throw new RuntimeException("Lỗi map file: Số lượng file không khớp (imageCount).");
                        }
                        MultipartFile imgFile = fileIterator.next();

                        String imgUrl = storageService.uploadFile(imgFile); // Tải file lên Cloudinary
                        ProductImage image = new ProductImage();
                        image.setImageUrl(imgUrl); // Gán URL
                        variant.addImage(image); // Dùng helper method
                    }
                }

                product.addVariant(variant); // Dùng helper method
            }
        }

        // 9. LƯU (Do Cascade=ALL, tất cả sẽ được lưu)
        Product savedProduct = productRepository.save(product);

        // 10. Trả về DTO (cho Admin Table)
        // (Lưu ý: Trigger CSDL sẽ tự cập nhật min_price)
        return new ProductAdminDTO(savedProduct);
    }
     /* === HÀM HELPER ĐÃ ĐƯỢC CẬP NHẬT ===
     * Hàm helper để chuyển đổi Product Entity sang ProductListDTO.
     * @param product Entity sản phẩm lấy từ DB
     * @return DTO rút gọn để hiển thị danh sách
     */
    private ProductListDTO convertToProductListDTO(Product product) {
        // 1. Lấy giá gốc
        BigDecimal originalPrice = product.getMinPrice();

        // 2. Gọi service mới để tính giá khuyến mãi
        Optional<BigDecimal> promoPriceOpt = promotionCalculationService.calculateBestPromotionPrice(product);
        List<String> hexCodes = product.getColors() // Lấy List<ProductColor>
                .stream()           // Bắt đầu stream
                .map(ProductColor::getHexCode) // Trích xuất chuỗi hexCode
                .collect(Collectors.toList()); // Thu thập thành List<String>
        // 3. Trả về DTO mới
        return new ProductListDTO(
                product.getId(),
                product.getProductName(),
                product.getThumbnail(),
                originalPrice,              // Luôn là giá gốc
                promoPriceOpt.orElse(null) , // Giá khuyến mãi (hoặc null nếu không có)
                hexCodes
        );
    }

    @Transactional(readOnly = true)
    public Page<ProductListDTO> getFeaturedProductsWithSort(Pageable pageable, String sortParam) {
        List<Product> activeProducts = productRepository.findByProductStatus(1);
        
        // Tính điểm featured
        List<Product> sortedProducts = activeProducts.stream()
                .sorted((p1, p2) -> {
                    double score1 = p1.getViewCount() * 0.3 + p1.getSalesCount() * 0.7;
                    double score2 = p2.getViewCount() * 0.3 + p2.getSalesCount() * 0.7;
                    return Double.compare(score2, score1);
                })
                .limit(20)
                .collect(Collectors.toList());
        
        // Áp dụng sort nếu có
        if (sortParam != null && !sortParam.isEmpty()) {
            sortedProducts = applySortToList(sortedProducts, sortParam);
        }
        
        return paginateProducts(sortedProducts, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProductListDTO> getNewestProductsWithSort(Pageable pageable, String sortParam) {
        Pageable top20 = PageRequest.of(0, 20, Sort.by("id").descending());
        Page<Product> newestPage = productRepository.findByProductStatus(1, top20);
        List<Product> newestProducts = newestPage.getContent();
        
        // Áp dụng sort nếu có
        if (sortParam != null && !sortParam.isEmpty()) {
            newestProducts = applySortToList(newestProducts, sortParam);
        }
        
        return paginateProducts(newestProducts, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProductListDTO> getFeaturedProductsWithFilter(
            ProductFilterRequestDTO filter, 
            Pageable pageable,
            String sortParam) {
        
        List<Product> activeProducts = productRepository.findByProductStatus(1);
        
        List<Product> sortedProducts = activeProducts.stream()
                .sorted((p1, p2) -> {
                    double score1 = p1.getViewCount() * 0.3 + p1.getSalesCount() * 0.7;
                    double score2 = p2.getViewCount() * 0.3 + p2.getSalesCount() * 0.7;
                    return Double.compare(score2, score1);
                })
                .limit(20)
                .collect(Collectors.toList());
        
        List<Product> filteredProducts = applyFilters(sortedProducts, filter);

        if (sortParam != null && !sortParam.isEmpty()) {
            filteredProducts = applySortToList(filteredProducts, sortParam);
        }
        
        return paginateProducts(filteredProducts, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProductListDTO> getNewestProductsWithFilter(
            ProductFilterRequestDTO filter, 
            Pageable pageable,
            String sortParam) {
        

        Pageable top20 = PageRequest.of(0, 20, Sort.by("id").descending());
        Page<Product> newestPage = productRepository.findByProductStatus(1, top20);
        List<Product> newestProducts = newestPage.getContent();

        List<Product> filteredProducts = applyFilters(newestProducts, filter);
        
        if (sortParam != null && !sortParam.isEmpty()) {
            filteredProducts = applySortToList(filteredProducts, sortParam);
        }

        return paginateProducts(filteredProducts, pageable);
    }


    private List<Product> applyFilters(List<Product> products, ProductFilterRequestDTO filter) {
        return products.stream()
            .filter(product -> {
                // Filter by categories
                if (filter.getCategories() != null && !filter.getCategories().isEmpty()) {
                    List<Long> expandedCategoryIds = filterService.expandCategoryIds(filter.getCategories());
                    boolean hasCategory = product.getCategories().stream()
                        .anyMatch(cat -> expandedCategoryIds.contains(cat.getId()));
                    if (!hasCategory) return false;
                }
                
                // Filter by materials
                if (filter.getMaterials() != null && !filter.getMaterials().isEmpty()) {
                    if (!filter.getMaterials().contains(product.getMaterial().getId())) {
                        return false;
                    }
                }
                
                // Filter by price range
                if (filter.getPriceRange() != null) {
                    BigDecimal minPrice = filter.getPriceRange().getMinPrice();
                    BigDecimal maxPrice = filter.getPriceRange().getMaxPrice();
                    if (product.getMinPrice().compareTo(minPrice) < 0 || 
                        product.getMinPrice().compareTo(maxPrice) > 0) {
                        return false;
                    }
                }
                
                // Filter by colors
                if (filter.getColors() != null && !filter.getColors().isEmpty()) {
                    boolean hasColor = product.getColors().stream()
                        .anyMatch(color -> filter.getColors().contains(color.getHexCode()));
                    if (!hasColor) return false;
                }
                
                // Filter by dimensions
                if (filter.getDimensions() != null && !filter.getDimensions().isEmpty()) {
                    boolean hasDimension = product.getVariants().stream()
                        .anyMatch(variant -> filter.getDimensions().contains(variant.getDimensions()));
                    if (!hasDimension) return false;
                }
                
                // Filter by topics
                if (filter.getTopics() != null && !filter.getTopics().isEmpty()) {
                    boolean hasTopic = product.getTopics().stream()
                        .anyMatch(topic -> filter.getTopics().contains(topic.getTopicName()));
                    if (!hasTopic) return false;
                }
                
                // Filter by product name
                if (filter.getProductName() != null && !filter.getProductName().isEmpty()) {
                    if (!product.getProductName().toLowerCase()
                            .contains(filter.getProductName().toLowerCase())) {
                        return false;
                    }
                }
                
                return true;
            })
            .collect(Collectors.toList());
    }


    private Page<ProductListDTO> paginateProducts(List<Product> products, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), products.size());
        
        if (start > products.size()) {
            return Page.empty(pageable);
        }
        
        List<Product> pageContent = products.subList(start, end);
        List<ProductListDTO> dtoList = pageContent.stream()
            .map(this::convertToProductListDTO)
            .collect(Collectors.toList());
        
        return new PageImpl<>(dtoList, pageable, products.size());
    }

    private List<Product> applySortToList(List<Product> products, String sortParam) {
        if (sortParam == null || sortParam.isEmpty()) {
            return products;
        }
        
        String[] sortParts = sortParam.split(",");
        String field = sortParts[0];
        boolean isAscending = sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1]);
        
        return products.stream()
            .sorted((p1, p2) -> {
                int result = 0;
                switch (field) {
                    case "productName":
                        result = p1.getProductName().compareTo(p2.getProductName());
                        break;
                    case "minPrice":
                        result = p1.getMinPrice().compareTo(p2.getMinPrice());
                        break;
                    case "salesCount":
                        result = Long.compare(p1.getSalesCount(), p2.getSalesCount());
                        break;
                    case "createdAt":
                    case "id":
                        result = p1.getId().compareTo(p2.getId());
                        break;
                    default:
                        result = 0;
                }
                return isAscending ? result : -result;
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductListDTO> getOnSaleProductsWithSort(Pageable pageable, String sortParam) {
        List<Product> activeProducts = productRepository.findByProductStatus(1);
        
        // Lọc các sản phẩm có khuyến mãi
        List<Product> onSaleProducts = activeProducts.stream()
                .filter(product -> {
                    Optional<BigDecimal> promoPriceOpt = promotionCalculationService.calculateBestPromotionPrice(product);
                    return promoPriceOpt.isPresent() && 
                           promoPriceOpt.get().compareTo(product.getMinPrice()) < 0;
                })
                .limit(20)
                .collect(Collectors.toList());
        
        // Áp dụng sort nếu có
        if (sortParam != null && !sortParam.isEmpty()) {
            onSaleProducts = applySortToList(onSaleProducts, sortParam);
        }
        
        return paginateProducts(onSaleProducts, pageable);
    }

    /**
     * Lấy sản phẩm khuyến mãi có filter
     */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> getOnSaleProductsWithFilter(
            ProductFilterRequestDTO filter, 
            Pageable pageable,
            String sortParam) {
        
        List<Product> activeProducts = productRepository.findByProductStatus(1);
        
        // Lọc sản phẩm có khuyến mãi
        List<Product> onSaleProducts = activeProducts.stream()
                .filter(product -> {
                    Optional<BigDecimal> promoPriceOpt = promotionCalculationService.calculateBestPromotionPrice(product);
                    return promoPriceOpt.isPresent() && 
                           promoPriceOpt.get().compareTo(product.getMinPrice()) < 0;
                })
                .limit(20)
                .collect(Collectors.toList());
        
        // Áp dụng filter
        List<Product> filteredProducts = applyFilters(onSaleProducts, filter);

        // Áp dụng sort
        if (sortParam != null && !sortParam.isEmpty()) {
            filteredProducts = applySortToList(filteredProducts, sortParam);
        }
        
        return paginateProducts(filteredProducts, pageable);
    }
}