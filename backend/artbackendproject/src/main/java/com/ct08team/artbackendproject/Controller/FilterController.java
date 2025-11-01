package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.Filter.ProductFilterOptionsDTO;
import com.ct08team.artbackendproject.DTO.Filter.ProductFilterRequestDTO;
import com.ct08team.artbackendproject.Service.Filter.FilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/filters")
public class FilterController {

    @Autowired
    private FilterService filterService;

    @GetMapping("/products")
    public ResponseEntity<ProductFilterOptionsDTO> getInitialFilters() {
        return ResponseEntity.ok(filterService.getInitialFilterOptions());
    }

    @PostMapping("/products-dynamic")
    public ResponseEntity<ProductFilterOptionsDTO> getDynamicFilters(@RequestBody ProductFilterRequestDTO currentFilter) {
        return ResponseEntity.ok(filterService.getDynamicFilterOptions(currentFilter));
    }
}
