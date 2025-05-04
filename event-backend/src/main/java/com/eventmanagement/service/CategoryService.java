package com.eventmanagement.service;

import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Category;
import com.eventmanagement.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    
    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
    
    @Transactional
    public Category createCategory(Category category) {
        Optional<Category> existingCategory = categoryRepository.findByNameIgnoreCase(category.getName());
        if (existingCategory.isPresent()) {
            throw new IllegalStateException("Category already exists with name: " + category.getName());
        }
        return categoryRepository.save(category);
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        if (!category.getEvents().isEmpty()) {
            throw new IllegalStateException("Cannot delete category used by events");
        }
        categoryRepository.delete(category);
    }
}
