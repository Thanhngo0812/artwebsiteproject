package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.Filter.ProductFilterRequestDTO;
import com.ct08team.artbackendproject.DTO.ProductListDTO;
import com.ct08team.artbackendproject.Service.Product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ct08team.artbackendproject.DAO.ProductVariantRepository;
import com.ct08team.artbackendproject.DTO.ProductVariantDTO;
import com.ct08team.artbackendproject.Entity.product.ProductVariant;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductVariantRepository variantRepository;

    @PostMapping("/search")
    public ResponseEntity<Page<ProductListDTO>> searchProducts(
            @RequestBody ProductFilterRequestDTO filter,
            @PageableDefault(size = 20, sort = "productName") Pageable pageable)
    {
        // Frontend sẽ gọi API này, ví dụ:
        // POST /api/products/search?page=0&size=12&sort=minPrice,asc
        //
        // Body sẽ là:
        // { "categories": [1], "topics": ["Mùa thu"] ... }

        Page<ProductListDTO> productPage = productService.searchProducts(filter, pageable);
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<ProductListDTO>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDTO> products = productService.getFeaturedProducts(pageable);
        return ResponseEntity.ok(products);
    }

    // API mới: Sản phẩm mới nhất (theo ID giảm dần)
    @GetMapping("/newest")
    public ResponseEntity<Page<ProductListDTO>> getNewestProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size)
    {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<ProductListDTO> products = productService.getNewestProducts(pageable);
        return ResponseEntity.ok(products);
    }

    // API mới: Lấy thông tin nhiều sản phẩm theo danh sách ID
    @PostMapping("/by-ids")
    public ResponseEntity<Page<ProductListDTO>> getProductsByIds(
            @RequestBody java.util.List<Long> ids,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDTO> products = productService.getProductsByIds(ids, pageable);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/{productId}/variants")
    public ResponseEntity<Page<ProductVariantDTO>> getProductVariants(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        
        // ✅ Gọi Repository với Pageable
        Page<ProductVariant> variantPage = variantRepository.findByProductId(productId, pageable);
        
        if (variantPage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Page<ProductVariantDTO> dtoPage = variantPage.map(v -> 
            new ProductVariantDTO(
                v.getDimensions(),
                v.getPrice().doubleValue(),
                v.getStockQuantity()
            )
        );
        
        return ResponseEntity.ok(dtoPage);
    }
}