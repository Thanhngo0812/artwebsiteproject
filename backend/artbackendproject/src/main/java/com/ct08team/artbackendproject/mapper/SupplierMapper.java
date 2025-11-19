package com.ct08team.artbackendproject.mapper;

import com.ct08team.artbackendproject.DTO.Inventory.SupplierDTO;
import com.ct08team.artbackendproject.Entity.inventory.Supplier;

public class SupplierMapper {

    private SupplierMapper() {}

    public static SupplierDTO toDto(Supplier supplier) {
        if (supplier == null) return null;
        SupplierDTO dto = new SupplierDTO();
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setContactPerson(supplier.getContactPerson());
        dto.setEmail(supplier.getEmail());
        dto.setPhoneNumber(supplier.getPhoneNumber());
        dto.setAddress(supplier.getAddress());
        dto.setCreatedAt(supplier.getCreatedAt());
        dto.setUpdatedAt(supplier.getUpdatedAt());
        return dto;
    }

    public static Supplier toEntity(SupplierDTO supplierDTO) {
        if (supplierDTO == null) return null;
        Supplier entity = new Supplier();
        entity.setId(supplierDTO.getId());
        entity.setName(supplierDTO.getName());
        entity.setContactPerson(supplierDTO.getContactPerson());
        entity.setEmail(supplierDTO.getEmail());
        entity.setPhoneNumber(supplierDTO.getPhoneNumber());
        entity.setAddress(supplierDTO.getAddress());
        return entity;
    }
}