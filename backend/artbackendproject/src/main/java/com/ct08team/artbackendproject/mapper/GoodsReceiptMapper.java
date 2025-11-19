package com.ct08team.artbackendproject.mapper;

import com.ct08team.artbackendproject.DTO.Inventory.GoodsReceiptDTO;
import com.ct08team.artbackendproject.Entity.inventory.GoodsReceipt;
import com.ct08team.artbackendproject.Entity.inventory.GoodsReceiptItem;
import com.ct08team.artbackendproject.Entity.inventory.Supplier;
import com.ct08team.artbackendproject.Entity.auth.User;

import java.util.ArrayList;
import java.util.List;

public class GoodsReceiptMapper {

    private GoodsReceiptMapper() {}

    public static GoodsReceiptDTO toDto(GoodsReceipt gr) {
        if (gr == null) return null;
        GoodsReceiptDTO dto = new GoodsReceiptDTO();
        dto.setId(gr.getId());
        if (gr.getSupplier() != null) {
            dto.setSupplierId(gr.getSupplier().getId());
            dto.setSupplierName(gr.getSupplier().getName());
        }
        dto.setReceiptCode(gr.getReceiptCode());
        dto.setNote(gr.getNote());
        if (gr.getCreator() != null) {
            dto.setCreatorId(gr.getCreator().getId());
            dto.setCreatorName(gr.getCreator().getFullName());
        }
        dto.setTotalAmount(gr.getTotalAmount());
        dto.setCreatedAt(gr.getCreatedAt());
        dto.setReceiptItems(GoodsReceiptItemMapper.toDtoList(gr.getReceiptItems()));
        return dto;
    }

    public static GoodsReceipt toEntity(GoodsReceiptDTO dto) {
        if (dto == null) return null;
        GoodsReceipt gr = new GoodsReceipt();
        gr.setId(dto.getId());
        if (dto.getSupplierId() != null) {
            Supplier s = new Supplier();
            s.setId(dto.getSupplierId());
            gr.setSupplier(s);
        }
        gr.setReceiptCode(dto.getReceiptCode());
        gr.setNote(dto.getNote());
        if (dto.getCreatorId() != null) {
            User u = new User();
            u.setId(dto.getCreatorId());
            gr.setCreator(u);
        }
        gr.setTotalAmount(dto.getTotalAmount());

        List<GoodsReceiptItem> items = GoodsReceiptItemMapper.toEntityList(dto.getReceiptItems());
        // set back-reference
        if (items != null) {
            for (GoodsReceiptItem it : items) it.setGoodsReceipt(gr);
        }
        gr.setReceiptItems(items);
        return gr;
    }

    public static List<GoodsReceiptDTO> toDtoList(List<GoodsReceipt> list) {
        if (list == null) return new ArrayList<>();
        List<GoodsReceiptDTO> res = new ArrayList<>();
        for (GoodsReceipt g : list) res.add(toDto(g));
        return res;
    }
}