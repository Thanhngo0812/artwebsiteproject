package com.ct08team.artbackendproject.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.ct08team.artbackendproject.DTO.CategoryDTO;
import com.ct08team.artbackendproject.Entity.Category;

public class CategoryMapper {

    private CategoryMapper() {} 

    //enti to dto
    public static CategoryDTO mapToDTO(Category entity) {
        if (entity == null) {
            return null;
        }
        
        CategoryDTO dto = new CategoryDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        
        if (entity.getParent() != null) {
            dto.setParentId(entity.getParent().getId());
        }
        
        return dto;
    }
    // dto to enti
    public static Category mapToEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Category entity = new Category();
        entity.setId(dto.getId()); 
        entity.setName(dto.getName());
        return entity;
    }
  //list dto list to enti list
    public static List<CategoryDTO> mapToDtoList(List<Category> entities) {
        if (entities == null) {
            return List.of(); 
        }

        return entities.stream()
                .map(CategoryMapper::mapToDTO) 
                .collect(Collectors.toList());
    }
    //list enti list to dto list
    public static List<Category> mapToEntityList(List<CategoryDTO> dtos) {
        if (dtos == null) {
            return List.of();
        }
        return dtos.stream()
                .map(CategoryMapper::mapToEntity)
                .collect(Collectors.toList());
    }
}