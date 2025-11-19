package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.Inventory.GoodsReceiptDTO;
import com.ct08team.artbackendproject.Service.Inventory.GoodsReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/goods-receipts")
public class GoodsReceiptController {

    @Autowired
    private GoodsReceiptService goodsReceiptService;

    @PostMapping
    public ResponseEntity<GoodsReceiptDTO> createGoodsReceipt(@RequestBody GoodsReceiptDTO goodsReceiptDTO) {
        GoodsReceiptDTO createdGoodsReceipt = goodsReceiptService.createGoodsReceipt(goodsReceiptDTO);
        return new ResponseEntity<>(createdGoodsReceipt, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GoodsReceiptDTO>> getAllGoodsReceipts() {
        List<GoodsReceiptDTO> goodsReceipts = goodsReceiptService.getAllGoodsReceipts();
        return ResponseEntity.ok(goodsReceipts);
    }
}