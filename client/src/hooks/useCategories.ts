/**
 * useCategories Hook
 * 
 * Centralized state management for the Category system.
 * This hook provides a single source of truth for categories across the app.
 * 
 * Usage:
 * ```tsx
 * const { 
 *   categories,           // All categories (built-in + custom)
 *   addCategory,          // Add a new custom category
 *   updateCategory,       // Update an existing custom category
 *   deleteCategory,       // Delete a custom category
 *   getCategoryById,      // Get a specific category by ID
 *   getDefaultCategory,   // Get the "Uncategorized" category
 * } = useCategories();
 * ```
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Category,
  DEFAULT_CATEGORIES,
  CATEGORIES_STORAGE_KEY,
  BUILT_IN_CATEGORY_IDS,
  generateCategoryId,
  sortCategories,
  canDeleteCategory,
  canEditCategory,
} from '@/types/category';

interface UseCategoriesReturn {
  /** All categories (built-in + custom), sorted by order */
  categories: Category[];
  
  /** Only custom categories (user-created) */
  customCategories: Category[];
  
  /** Only built-in categories */
  builtInCategories: Category[];
  
  /** Add a new custom category */
  addCategory: (category: Omit<Category, 'id' | 'isBuiltIn' | 'createdAt'>) => Category;
  
  /** Update an existing custom category (built-in categories cannot be updated) */
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'isBuiltIn' | 'createdAt'>>) => boolean;
  
  /** Delete a custom category (built-in categories cannot be deleted) */
  deleteCategory: (id: string) => boolean;
  
  /** Get a category by its ID */
  getCategoryById: (id: string) => Category | undefined;
  
  /** Get the default "Uncategorized" category */
  getDefaultCategory: () => Category;
  
  /** Check if a category can be edited */
  canEdit: (category: Category) => boolean;
  
  /** Check if a category can be deleted */
  canDelete: (category: Category) => boolean;
  
  /** Reorder categories (for drag-drop) */
  reorderCategories: (categoryIds: string[]) => void;
  
  /** Loading state */
  isLoading: boolean;
}

/**
 * Load categories from localStorage, merging with defaults
 */
function loadCategories(): Category[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      const customCategories: Category[] = JSON.parse(stored);
      // Merge built-in categories with custom ones
      return sortCategories([...DEFAULT_CATEGORIES, ...customCategories]);
    }
  } catch (error) {
    console.error('Failed to load categories from localStorage:', error);
  }
  return sortCategories([...DEFAULT_CATEGORIES]);
}

/**
 * Save custom categories to localStorage
 * (Built-in categories are not saved as they're always loaded from defaults)
 */
function saveCategories(categories: Category[]): void {
  try {
    const customCategories = categories.filter(cat => !cat.isBuiltIn);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customCategories));
  } catch (error) {
    console.error('Failed to save categories to localStorage:', error);
  }
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loaded = loadCategories();
    setCategories(loaded);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever categories change (after initial load)
  useEffect(() => {
    if (!isLoading) {
      saveCategories(categories);
    }
  }, [categories, isLoading]);

  // Memoized filtered lists
  const customCategories = useMemo(
    () => categories.filter(cat => !cat.isBuiltIn),
    [categories]
  );

  const builtInCategories = useMemo(
    () => categories.filter(cat => cat.isBuiltIn),
    [categories]
  );

  // Add a new custom category
  const addCategory = useCallback((
    categoryData: Omit<Category, 'id' | 'isBuiltIn' | 'createdAt'>
  ): Category => {
    const newCategory: Category = {
      ...categoryData,
      id: generateCategoryId(),
      isBuiltIn: false,
      createdAt: Date.now(),
    };

    setCategories(prev => sortCategories([...prev, newCategory]));
    return newCategory;
  }, []);

  // Update an existing custom category
  const updateCategory = useCallback((
    id: string,
    updates: Partial<Omit<Category, 'id' | 'isBuiltIn' | 'createdAt'>>
  ): boolean => {
    let updated = false;

    setCategories(prev => {
      const category = prev.find(cat => cat.id === id);
      
      // Can only update custom categories
      if (!category || category.isBuiltIn) {
        return prev;
      }

      updated = true;
      return sortCategories(
        prev.map(cat => 
          cat.id === id ? { ...cat, ...updates } : cat
        )
      );
    });

    return updated;
  }, []);

  // Delete a custom category
  const deleteCategory = useCallback((id: string): boolean => {
    let deleted = false;

    setCategories(prev => {
      const category = prev.find(cat => cat.id === id);
      
      // Can only delete custom categories
      if (!category || category.isBuiltIn) {
        return prev;
      }

      deleted = true;
      return prev.filter(cat => cat.id !== id);
    });

    return deleted;
  }, []);

  // Get category by ID
  const getCategoryByIdFn = useCallback((id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

  // Get default (Uncategorized) category
  const getDefaultCategoryFn = useCallback((): Category => {
    return categories.find(cat => cat.id === BUILT_IN_CATEGORY_IDS.UNCATEGORIZED)
      || DEFAULT_CATEGORIES.find(cat => cat.id === BUILT_IN_CATEGORY_IDS.UNCATEGORIZED)!;
  }, [categories]);

  // Reorder categories
  const reorderCategories = useCallback((categoryIds: string[]): void => {
    setCategories(prev => {
      const reordered = categoryIds.map((id, index) => {
        const category = prev.find(cat => cat.id === id);
        if (category) {
          return { ...category, order: index };
        }
        return null;
      }).filter((cat): cat is Category => cat !== null);

      // Add any categories that weren't in the reorder list
      const remainingCategories = prev.filter(
        cat => !categoryIds.includes(cat.id)
      );

      return sortCategories([...reordered, ...remainingCategories]);
    });
  }, []);

  return {
    categories,
    customCategories,
    builtInCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById: getCategoryByIdFn,
    getDefaultCategory: getDefaultCategoryFn,
    canEdit: canEditCategory,
    canDelete: canDeleteCategory,
    reorderCategories,
    isLoading,
  };
}

export default useCategories;
