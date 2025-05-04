// src/components/CategoryBadge.js
import React from 'react';

const getCategoryColor = (categoryName) => {
  if (!categoryName) return 'bg-secondary';
  
  switch (categoryName.toLowerCase()) {
    case 'music':
      return 'bg-primary';
    case 'technology':
      return 'bg-info';
    case 'business':
      return 'bg-success';
    case 'food':
      return 'bg-warning';
    case 'sports':
      return 'bg-danger';
    case 'art':
      return 'bg-purple'; // Add this custom color in your CSS
    default:
      return 'bg-secondary';
  }
};

const CategoryBadge = ({ category }) => {
  if (!category || !category.name) return null;
  
  const bgClass = getCategoryColor(category.name);
  
  return (
    <span className={`badge ${bgClass} me-1 mb-1`}>
      {category.name}
    </span>
  );
};

export default CategoryBadge;