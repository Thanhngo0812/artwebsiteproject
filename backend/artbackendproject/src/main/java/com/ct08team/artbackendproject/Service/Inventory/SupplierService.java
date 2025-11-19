package com.ct08team.artbackendproject.Service.Inventory;

import com.ct08team.artbackendproject.DAO.Inventory.SupplierRepository;
import com.ct08team.artbackendproject.DTO.Inventory.SupplierDTO;
import com.ct08team.artbackendproject.Entity.inventory.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;


    public SupplierDTO createSupplier(SupplierDTO supplierDTO) {
        Supplier supplier = com.ct08team.artbackendproject.mapper.SupplierMapper.toEntity(supplierDTO);
        Supplier savedSupplier = supplierRepository.save(supplier);
        return com.ct08team.artbackendproject.mapper.SupplierMapper.toDto(savedSupplier);
    }

    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
            .map(com.ct08team.artbackendproject.mapper.SupplierMapper::toDto)
            .collect(Collectors.toList());
    }

    public SupplierDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return com.ct08team.artbackendproject.mapper.SupplierMapper.toDto(supplier);
    }

    public SupplierDTO updateSupplier(Long id, SupplierDTO supplierDTO) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        existingSupplier.setName(supplierDTO.getName());
        existingSupplier.setContactPerson(supplierDTO.getContactPerson());
        existingSupplier.setEmail(supplierDTO.getEmail());
        existingSupplier.setPhoneNumber(supplierDTO.getPhoneNumber());
        existingSupplier.setAddress(supplierDTO.getAddress());

        Supplier updatedSupplier = supplierRepository.save(existingSupplier);
        return com.ct08team.artbackendproject.mapper.SupplierMapper.toDto(updatedSupplier);
    }

    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        supplierRepository.deleteById(id);
    }
}
