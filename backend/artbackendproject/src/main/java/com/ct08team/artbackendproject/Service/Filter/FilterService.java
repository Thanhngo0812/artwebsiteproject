package com.ct08team.artbackendproject.Service.Filter;

import com.ct08team.artbackendproject.DAO.*;
import com.ct08team.artbackendproject.DTO.Filter.*;
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Product;
import com.ct08team.artbackendproject.Specification.ProductSpecification;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FilterService {

    // Inject tất cả Repository cần thiết
    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private MaterialRepository materialRepository;
    @Autowired private ProductVariantRepository variantRepository;
    @Autowired private ProductColorRepository colorRepository;
    @Autowired private ProductTopicRepository topicRepository;

    // --- LOGIC CACHE DANH MỤC ---
    private Map<Long, Set<Long>> categoryChildMap = new HashMap<>();

    @PostConstruct
    public void buildCategoryTreeCache() {
        Map<Long, Set<Long>> map = new HashMap<>();
        List<Category> allCategories = categoryRepository.findAll(); // Giả sử đã Eager Fetch 'parent'

        for (Category category : allCategories) {
            map.computeIfAbsent(category.getId(), k -> new HashSet<>()).add(category.getId());
            Category parent = category.getParent();
            while (parent != null) {
                map.computeIfAbsent(parent.getId(), k -> new HashSet<>()).add(category.getId());
                parent = parent.getParent();
            }
        }
        this.categoryChildMap = map;
    }

    /**
     * Hàm helper MỞ RỘNG DANH SÁCH ID (public để ProductService có thể gọi)
     */
    public List<Long> expandCategoryIds(List<Long> selectedIds) {
        if (selectedIds == null || selectedIds.isEmpty()) {
            return new ArrayList<>();
        }
        Set<Long> allIds = new HashSet<>();
        for (Long id : selectedIds) {
            Set<Long> children = categoryChildMap.getOrDefault(id, Set.of(id));
            allIds.addAll(children);
        }
        return new ArrayList<>(allIds);
    }
    // --- HẾT LOGIC CACHE ---


    /**
     * API 1: Lấy tất cả tùy chọn lọc (khi tải trang lần đầu)
     */
    @Transactional(readOnly = true)
    public ProductFilterOptionsDTO getInitialFilterOptions() {
        ProductFilterOptionsDTO dto = new ProductFilterOptionsDTO();

        dto.setCategories(getCategoryTree()); // Hàm build cây
        dto.setMaterials(materialRepository.findAll().stream()
                .map(m -> new MaterialDTO(m.getId(), m.getMaterialName()))
                .collect(Collectors.toList()));

        // Lấy min/max price từ bảng variants
        BigDecimal minPrice = variantRepository.findMinPrice();
        BigDecimal maxPrice = variantRepository.findMaxPrice();
        dto.setPriceRange(new PriceRangeDTO(minPrice, maxPrice));

        dto.setColors(colorRepository.findDistinctHexCodes());
        dto.setDimensions(variantRepository.findDistinctDimensions());
        dto.setTopics(topicRepository.findDistinctTopicNames());

        return dto;
    }

    /**
     * API 2: Lấy tùy chọn lọc động (khi người dùng click)
     */
    @Transactional(readOnly = true)
    public ProductFilterOptionsDTO getDynamicFilterOptions(ProductFilterRequestDTO currentFilter) {

        // --- BƯỚC 1: MỞ RỘNG CATEGORY IDS ---
        // (Rất quan trọng: Phải mở rộng ID trước khi build specification)
        List<Long> expandedCategoryIds = expandCategoryIds(currentFilter.getCategories());
        currentFilter.setCategories(expandedCategoryIds);
        // --- HẾT ---

        // 2. Tìm tất cả ID sản phẩm khớp với bộ lọc hiện tại
        Specification<Product> spec = ProductSpecification.build(currentFilter);
        List<Long> productIds = productRepository.findAll(spec).stream()
                .map(Product::getId)
                .collect(Collectors.toList());

        ProductFilterOptionsDTO dto = new ProductFilterOptionsDTO();

        // 3. Nếu không có SP nào, trả về các danh sách rỗng
        if (productIds.isEmpty()) {
            dto.setMaterials(List.of());
            dto.setColors(List.of());
            dto.setDimensions(List.of());
            dto.setTopics(List.of());
        } else {
            // 4. Nếu có SP, tìm các tùy chọn CHỈ từ các ID đó
            dto.setMaterials(materialRepository.findDistinctMaterialsByProductIds(productIds));
            dto.setColors(colorRepository.findDistinctHexCodesByProductIds(productIds));
            dto.setDimensions(variantRepository.findDistinctDimensionsByProductIds(productIds));
            dto.setTopics(topicRepository.findDistinctTopicNamesByProductIds(productIds));
        }

        // 5. Luôn trả về cây danh mục và khoảng giá đầy đủ
        dto.setCategories(getCategoryTree());
        dto.setPriceRange(new PriceRangeDTO(variantRepository.findMinPrice(), variantRepository.findMaxPrice()));

        return dto;
    }

    /**
     * Hàm helper để xây dựng cây danh mục (từ các câu trả lời trước)
     */
    private List<CategoryTreeDTO> getCategoryTree() {
        List<Category> allCategories = categoryRepository.findAll();
        Map<Long, CategoryTreeDTO> dtoMap = allCategories.stream()
                .collect(Collectors.toMap(
                        Category::getId,
                        cat -> new CategoryTreeDTO(cat.getId(), cat.getName())
                ));
        List<CategoryTreeDTO> rootCategories = new ArrayList<>();
        for (Category category : allCategories) {
            CategoryTreeDTO currentDTO = dtoMap.get(category.getId());
            if (category.getParent() == null) {
                rootCategories.add(currentDTO);
            } else {
                CategoryTreeDTO parentDTO = dtoMap.get(category.getParent().getId());
                if (parentDTO != null) {
                    parentDTO.getChildren().add(currentDTO);
                }
            }
        }
        return rootCategories;
    }
}
