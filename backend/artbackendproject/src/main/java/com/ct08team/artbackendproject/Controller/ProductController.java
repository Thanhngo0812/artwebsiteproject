package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.Filter.ProductFilterRequestDTO;
import com.ct08team.artbackendproject.DTO.ProductListDTO;
import com.ct08team.artbackendproject.Service.Product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

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
}