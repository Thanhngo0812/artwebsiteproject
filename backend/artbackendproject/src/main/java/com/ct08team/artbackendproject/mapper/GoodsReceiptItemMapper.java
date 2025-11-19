package com.ct08team.artbackendproject.mapper;

import com.ct08team.artbackendproject.DTO.Inventory.GoodsReceiptItemDTO;
import com.ct08team.artbackendproject.Entity.inventory.GoodsReceiptItem;
import com.ct08team.artbackendproject.Entity.inventory.GoodsReceipt;
import com.ct08team.artbackendproject.Entity.product.ProductVariant;

import java.util.ArrayList;
import java.util.List;

public class GoodsReceiptItemMapper {

    private GoodsReceiptItemMapper() {}

    public static GoodsReceiptItemDTO toDto(GoodsReceiptItem item) {
        if (item == null) return null;
        GoodsReceiptItemDTO dto = new GoodsReceiptItemDTO();
        dto.setId(item.getId());
        if (item.getGoodsReceipt() != null) dto.setReceiptId(item.getGoodsReceipt().getId());
        if (item.getProductVariant() != null) {
            dto.setVariantId(item.getProductVariant().getId());
            if (item.getProductVariant().getProduct() != null)
                dto.setProductName(item.getProductVariant().getProduct().getProductName());
            dto.setVariantDimensions(item.getProductVariant().getDimensions());
        }
        dto.setQuantity(item.getQuantity());
        dto.setImportPrice(item.getImportPrice());
        return dto;
    }

    public static GoodsReceiptItem toEntity(GoodsReceiptItemDTO dto) {
        if (dto == null) return null;
        GoodsReceiptItem item = new GoodsReceiptItem();
        item.setId(dto.getId());
        if (dto.getReceiptId() != null) {
            GoodsReceipt gr = new GoodsReceipt();
            gr.setId(dto.getReceiptId());
            item.setGoodsReceipt(gr);
        }
        if (dto.getVariantId() != null) {
            ProductVariant pv = new ProductVariant();
            pv.setId(dto.getVariantId());
            item.setProductVariant(pv);
        }
        item.setQuantity(dto.getQuantity());
        item.setImportPrice(dto.getImportPrice());
        return item;
    }

    public static List<GoodsReceiptItemDTO> toDtoList(List<GoodsReceiptItem> items) {
        if (items == null) return new ArrayList<>();
        List<GoodsReceiptItemDTO> list = new ArrayList<>();
        for (GoodsReceiptItem it : items) list.add(toDto(it));
        return list;
    }

    public static List<GoodsReceiptItem> toEntityList(List<GoodsReceiptItemDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        List<GoodsReceiptItem> list = new ArrayList<>();
        for (GoodsReceiptItemDTO d : dtos) list.add(toEntity(d));
        return list;
    }
}