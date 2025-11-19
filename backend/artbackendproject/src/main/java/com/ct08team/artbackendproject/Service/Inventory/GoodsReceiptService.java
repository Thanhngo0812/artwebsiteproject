package com.ct08team.artbackendproject.Service.Inventory;

import com.ct08team.artbackendproject.DAO.Inventory.GoodsReceiptRepository;
import com.ct08team.artbackendproject.DAO.ProductVariantRepository;
import com.ct08team.artbackendproject.DTO.Inventory.GoodsReceiptDTO;
import com.ct08team.artbackendproject.DTO.Inventory.GoodsReceiptItemDTO;
import com.ct08team.artbackendproject.Entity.inventory.GoodsReceipt;
import com.ct08team.artbackendproject.Entity.inventory.GoodsReceiptItem;
import com.ct08team.artbackendproject.Entity.product.ProductVariant;
import com.ct08team.artbackendproject.mapper.GoodsReceiptMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.Objects;

@Service
public class GoodsReceiptService {

    @Autowired
    private GoodsReceiptRepository goodsReceiptRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;
    // Use manual static mapper (no autowired bean)

    private static final AtomicLong counter = new AtomicLong(0);


    @Transactional
    public GoodsReceiptDTO createGoodsReceipt(GoodsReceiptDTO goodsReceiptDTO) {
        GoodsReceipt goodsReceipt = GoodsReceiptMapper.toEntity(goodsReceiptDTO);
        goodsReceipt.setReceiptCode(generateReceiptCode());


        // Attach managed ProductVariant entities to each receipt item so JPA will persist FK correctly.
        // Note: stock/price updates are handled by DB triggers (source-of-truth), so backend must not modify variant stock here.
        if (goodsReceipt.getReceiptItems() != null) {
            for (GoodsReceiptItem item : goodsReceipt.getReceiptItems()) {
                if (item.getProductVariant() == null || item.getProductVariant().getId() == null) {
                    throw new RuntimeException("Product variant id missing in receipt item");
                }
                Long variantId = Objects.requireNonNull(item.getProductVariant().getId(), "Product variant id missing");
                ProductVariant variant = productVariantRepository.findById(variantId)
                        .orElseThrow(() -> new RuntimeException("Product variant not found"));
                // attach the managed variant instance to the item
                item.setProductVariant(variant);
                // ensure back-reference
                item.setGoodsReceipt(goodsReceipt);
            }
        }

        GoodsReceipt savedGoodsReceipt = goodsReceiptRepository.save(goodsReceipt);
        return GoodsReceiptMapper.toDto(savedGoodsReceipt);
    }

    public List<GoodsReceiptDTO> getAllGoodsReceipts() {
        return GoodsReceiptMapper.toDtoList(goodsReceiptRepository.findAll());
    }
    private String generateReceiptCode() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long sequence = counter.incrementAndGet();
        return "PN" + datePart + String.format("%04d", sequence);
    }
    
}
