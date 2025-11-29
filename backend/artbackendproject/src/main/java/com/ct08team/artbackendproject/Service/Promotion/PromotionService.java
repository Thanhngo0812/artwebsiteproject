package com.ct08team.artbackendproject.Service.Promotion;

import com.ct08team.artbackendproject.DAO.CategoryRepository;
import com.ct08team.artbackendproject.DAO.ProductRepository;
import com.ct08team.artbackendproject.DAO.PromotionRepository;
import com.ct08team.artbackendproject.DTO.ProductSimpleDTO;
import com.ct08team.artbackendproject.DTO.Promotion.PromotionDTO;
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Product;
import com.ct08team.artbackendproject.Entity.promotion.Promotion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Xử lý logic áp dụng mã coupon
     * (React: handleApplyCoupon)
     */
    @Transactional(readOnly = true)
    public PromotionDTO.ApplyResponse applyCoupon(PromotionDTO.ApplyRequest request) {

        String code = request.getCode().toUpperCase();
        BigDecimal subtotal = request.getSubtotal(); // Lấy Tạm tính

        if (subtotal == null) {
            throw new RuntimeException("Lỗi: Không có Tạm tính (subtotal).");
        }

        // 1. Tìm coupon trong CSDL bằng 'code'
        Optional<Promotion> promoOpt = promotionRepository.findByCode(code);

        if (!promoOpt.isPresent()) {
            throw new RuntimeException("Mã giảm giá không tồn tại.");
        }

        Promotion promo = promoOpt.get();
        Instant now = Instant.now();

        // 2. Kiểm tra các điều kiện
        if (!promo.isActive()) {
            throw new RuntimeException("Mã này đã bị vô hiệu hóa.");
        }
        if (now.isBefore(promo.getStartDate().atZone(ZoneId.systemDefault()).toInstant())) {
            throw new RuntimeException("Mã này chưa đến ngày áp dụng.");
        }
        if (now.isAfter(promo.getEndDate().atZone(ZoneId.systemDefault()).toInstant())) {
            throw new RuntimeException("Mã này đã hết hạn.");
        }
        if (promo.getUsageLimit() != null && promo.getUsageCount() >= promo.getUsageLimit()) {
            throw new RuntimeException("Mã này đã hết lượt sử dụng.");
        }
        // SỬA: Kiểm tra min_order_value (dùng Tạm tính)
        if (promo.getMinOrderValue() != null && subtotal.compareTo(promo.getMinOrderValue()) < 0) {
            throw new RuntimeException(
                    "Đơn hàng chưa đủ điều kiện (tối thiểu " + formatCurrency(promo.getMinOrderValue()) + ")");
        }

        // 3. Tính toán số tiền giảm
        BigDecimal discountAmount;
        String message;
        if ("FIXED_AMOUNT".equals(promo.getType().toString())) {
            discountAmount = promo.getValue();
            message = "Đã áp dụng giảm giá " + formatCurrency(discountAmount);
        } else if ("PERCENTAGE".equals(promo.getType().toString())) {
            // SỬA: Dùng Tạm tính (subtotal) thật
            discountAmount = subtotal.multiply(promo.getValue().divide(new BigDecimal("100")));

            // Kiểm tra max_discount_value
            if (promo.getMaxDiscountValue() != null && discountAmount.compareTo(promo.getMaxDiscountValue()) > 0) {
                discountAmount = promo.getMaxDiscountValue();
            }
            message = "Đã áp dụng giảm giá " + promo.getValue() + "%";
        } else {
            throw new RuntimeException("Loại khuyến mãi không xác định.");
        }

        // 4. Trả về response cho React
        return new PromotionDTO.ApplyResponse(
                promo.getCode(),
                discountAmount,
                message);
    }

    public Page<Promotion> findAll(String keyword, Pageable pageable) {
        // (Nếu có keyword thì search, không thì findAll)
        if (keyword != null && !keyword.isEmpty()) {
            // Bạn cần viết thêm query trong PromotionRepository:
            // findByNameContainingOrCodeContaining
            return promotionRepository.findAll(pageable); // Tạm thời trả về tất cả
        }
        return promotionRepository.findAll(pageable);
    }

    public Promotion findById(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi ID: " + id));
    }

    @Transactional
    public Promotion create(Promotion p) {
        // Validate
        if (p.getStartDate() != null && p.getEndDate() != null && p.getStartDate().isAfter(p.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải trước ngày kết thúc.");
        }
        // (Nếu là coupon, kiểm tra code trùng)
        if (p.getCode() != null && !p.getCode().isEmpty()) {
            if (promotionRepository.findByCode(p.getCode()).isPresent()) {
                throw new RuntimeException("Mã code đã tồn tại.");
            }
            p.setCode(p.getCode().toUpperCase());
        }

        return promotionRepository.save(p);
    }

    @Transactional
    public Promotion update(Long id, Promotion p) {
        Promotion existing = findById(id);

        existing.setName(p.getName());
        existing.setDescription(p.getDescription());
        existing.setImageUrl(p.getImageUrl()); // Cập nhật ảnh
        existing.setCode(p.getCode() != null ? p.getCode().toUpperCase() : null);
        existing.setType(p.getType());
        existing.setValue(p.getValue());
        existing.setStartDate(p.getStartDate());
        existing.setEndDate(p.getEndDate());
        existing.setActive(p.isActive());
        existing.setMinOrderValue(p.getMinOrderValue());
        existing.setMaxDiscountValue(p.getMaxDiscountValue());
        existing.setUsageLimit(p.getUsageLimit());

        return promotionRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        promotionRepository.deleteById(id);
    }

    // (Hàm format tiền tệ giả lập)
    private String formatCurrency(BigDecimal value) {
        // (Bạn nên có một hàm helper chung cho việc này)
        return value.toString() + " ₫";
    }

    /**
     * Lấy danh sách các chương trình Sale tự động đang chạy
     */
    public List<Promotion> getAllActiveSales() {
        return promotionRepository.findAllActiveAutomaticPromotions(LocalDateTime.now());
    }

    /**
     * Lấy chi tiết khuyến mãi theo ID
     */
    public Promotion getPromotionById(Long id) {
        return promotionRepository.findByIdWithProducts(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi với ID: " + id));
    }

    @Transactional(readOnly = true)
    // SỬA: Trả về List<ProductSimpleDTO> thay vì Set<Product>
    public List<ProductSimpleDTO> getProductsByPromotion(Long promoId) {
        Promotion p = findById(promoId);
        // Convert Entity -> DTO để tránh lỗi JSON Loop / Hibernate Proxy
        return p.getProducts().stream()
                .map(ProductSimpleDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addProductToPromotion(Long promoId, Long productId) {
        Promotion p = findById(promoId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // ==============================================================
        // LOGIC MỚI: Kiểm tra sản phẩm đã có trong chương trình khác chưa
        // ==============================================================
        // product.getPromotions() trả về danh sách các chương trình mà sản phẩm đang tham gia
        // Nếu danh sách này không rỗng, nghĩa là nó đã thuộc về một chương trình nào đó
        if (product.getPromotions() != null && !product.getPromotions().isEmpty()) {

            // Kiểm tra xem có phải là chính chương trình này không (tránh lỗi khi add lại chính nó)
            boolean alreadyInThisPromo = product.getPromotions().stream()
                    .anyMatch(promo -> promo.getId().equals(promoId));

            if (alreadyInThisPromo) {
                throw new RuntimeException("Sản phẩm này đã có trong chương trình khuyến mãi này rồi.");
            }

            // Lấy tên chương trình đầu tiên nó đang tham gia để báo lỗi
            String existingPromoName = product.getPromotions().iterator().next().getName();

            // Báo lỗi ngay lập tức, bất kể chương trình kia còn hạn hay không
            throw new RuntimeException("Sản phẩm '" + product.getProductName() +
                    "' hiện đang thuộc chương trình khuyến mãi: '" + existingPromoName +
                    "'. Vui lòng gỡ khỏi chương trình cũ trước.");
        }
        // ==============================================================

        p.getProducts().add(product);
        promotionRepository.save(p);
    }

    @Transactional
    public void removeProductFromPromotion(Long promoId, Long productId) {
        Promotion p = findById(promoId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        p.getProducts().remove(product);
        promotionRepository.save(p);
    }

    // --- QUẢN LÝ DANH MỤC ÁP DỤNG ---
    // (Danh mục thường ít bị lỗi Proxy hơn vì nó đơn giản, nhưng nếu bị thì làm
    // tương tự)

    @Transactional(readOnly = true)
    public Set<Category> getCategoriesByPromotion(Long promoId) {
        Promotion p = findById(promoId);
        // Ép tải dữ liệu (nếu cần thiết để tránh LazyInitializationException bên
        // Controller)
        p.getCategories().size();
        return p.getCategories();
    }

    @Transactional
    public void addCategoryToPromotion(Long promoId, Long categoryId) {
        Promotion p = findById(promoId);
        Category c = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        p.getCategories().add(c);
        promotionRepository.save(p);
    }

    @Transactional
    public void removeCategoryFromPromotion(Long promoId, Long categoryId) {
        Promotion p = findById(promoId);
        Category c = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        p.getCategories().remove(c);
        promotionRepository.save(p);
    }
}