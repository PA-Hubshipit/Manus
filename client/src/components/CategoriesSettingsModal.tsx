/**
 * CategoriesSettingsModal
 * 
 * A modal for managing preset categories. This is the central place where
 * categories are created, edited, and deleted.
 * 
 * Features:
 * - View all categories (built-in and custom)
 * - Create new custom categories with name, color, and icon
 * - Edit custom categories (built-in categories cannot be edited)
 * - Delete custom categories with reassignment dialog
 * 
 * Access: Settings Menu → Categories Setting
 */

import { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2, Check, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCategories from '@/hooks/useCategories';
import {
  Category,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  BUILT_IN_CATEGORY_IDS,
} from '@/types/category';

interface CategoriesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditingCategory {
  id: string | null; // null means creating new
  name: string;
  color: string;
  icon: string;
  description: string;
}

interface DeleteConfirmation {
  category: Category;
  targetCategoryId: string;
}

export default function CategoriesSettingsModal({
  isOpen,
  onClose,
}: CategoriesSettingsModalProps) {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    canEdit,
    canDelete,
  } = useCategories();

  // State for editing/creating
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEditingCategory(null);
      setShowColorPicker(false);
      setShowIconPicker(false);
      setDeleteConfirmation(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Start creating a new category
  const handleStartCreate = () => {
    setEditingCategory({
      id: null,
      name: '',
      color: CATEGORY_COLORS[0].value,
      icon: '📁',
      description: '',
    });
  };

  // Start editing an existing category
  const handleStartEdit = (category: Category) => {
    if (!canEdit(category)) return;
    setEditingCategory({
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon || '📁',
      description: category.description || '',
    });
  };

  // Save the category (create or update)
  const handleSave = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    if (editingCategory.id === null) {
      // Creating new category
      const maxOrder = Math.max(...categories.map(c => c.order), 0);
      addCategory({
        name: editingCategory.name.trim(),
        color: editingCategory.color,
        icon: editingCategory.icon,
        description: editingCategory.description.trim() || undefined,
        order: maxOrder + 1,
      });
    } else {
      // Updating existing category
      updateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
        color: editingCategory.color,
        icon: editingCategory.icon,
        description: editingCategory.description.trim() || undefined,
      });
    }

    setEditingCategory(null);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingCategory(null);
    setShowColorPicker(false);
    setShowIconPicker(false);
  };

  // Start delete confirmation
  const handleStartDelete = (category: Category) => {
    if (!canDelete(category)) return;
    setDeleteConfirmation({
      category,
      targetCategoryId: BUILT_IN_CATEGORY_IDS.UNCATEGORIZED,
    });
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmation) return;
    
    // TODO: Move presets to target category before deleting
    // This will be implemented when we update the preset system
    
    deleteCategory(deleteConfirmation.category.id);
    setDeleteConfirmation(null);
  };

  // Get categories for reassignment (excluding the one being deleted)
  const getReassignmentCategories = () => {
    if (!deleteConfirmation) return [];
    return categories.filter(c => c.id !== deleteConfirmation.category.id);
  };

  return (
    <div 
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Categories Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Manage your preset categories. Built-in categories cannot be edited or deleted.
          </p>

          {/* Category List */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border/50"
              >
                {/* Color indicator */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                
                {/* Icon */}
                <span className="text-lg flex-shrink-0">{category.icon || '📁'}</span>
                
                {/* Name and description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {category.name}
                    </span>
                    {category.isBuiltIn && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        Built-in
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {!category.isBuiltIn && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit category"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartDelete(category)}
                      className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Category Button */}
          {!editingCategory && (
            <button
              onClick={handleStartCreate}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/30 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          )}

          {/* Edit/Create Form */}
          {editingCategory && (
            <div className="p-4 rounded-lg border border-primary/50 bg-accent/20 space-y-4">
              <h3 className="font-medium text-foreground">
                {editingCategory.id === null ? 'Create New Category' : 'Edit Category'}
              </h3>

              {/* Name input */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Name</label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })}
                  placeholder="Category name"
                  className="bg-background"
                />
              </div>

              {/* Description input */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Description (Optional)</label>
                <Input
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    description: e.target.value,
                  })}
                  placeholder="Brief description"
                  className="bg-background"
                />
              </div>

              {/* Color picker */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Color</label>
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors w-full"
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: editingCategory.color }}
                    />
                    <span className="text-sm text-foreground">
                      {CATEGORY_COLORS.find(c => c.value === editingCategory.color)?.name || 'Custom'}
                    </span>
                  </button>
                  
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 p-2 rounded-lg border border-border bg-popover shadow-lg z-10 grid grid-cols-6 gap-1">
                      {CATEGORY_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            setEditingCategory({
                              ...editingCategory,
                              color: color.value,
                            });
                            setShowColorPicker(false);
                          }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                            editingCategory.color === color.value
                              ? 'border-foreground'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Icon picker */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Icon</label>
                <div className="relative">
                  <button
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors w-full"
                  >
                    <span className="text-lg">{editingCategory.icon}</span>
                    <span className="text-sm text-foreground">Select icon</span>
                  </button>
                  
                  {showIconPicker && (
                    <div className="absolute top-full left-0 mt-1 p-2 rounded-lg border border-border bg-popover shadow-lg z-10 grid grid-cols-6 gap-1">
                      {CATEGORY_ICONS.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => {
                            setEditingCategory({
                              ...editingCategory,
                              icon: icon,
                            });
                            setShowIconPicker(false);
                          }}
                          className={`w-8 h-8 rounded flex items-center justify-center text-lg hover:bg-accent transition-colors ${
                            editingCategory.icon === icon
                              ? 'bg-accent ring-2 ring-primary'
                              : ''
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={!editingCategory.name.trim()}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingCategory.id === null ? 'Create' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[450] flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Delete Category "{deleteConfirmation.category.name}"?
            </h3>
            
            <p className="text-sm text-muted-foreground">
              What would you like to do with presets in this category?
            </p>

            <div className="space-y-2">
              {/* Option: Move to another category */}
              <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={deleteConfirmation.targetCategoryId !== BUILT_IN_CATEGORY_IDS.UNCATEGORIZED}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">
                    Move to another category
                  </span>
                  <select
                    value={deleteConfirmation.targetCategoryId}
                    onChange={(e) => setDeleteConfirmation({
                      ...deleteConfirmation,
                      targetCategoryId: e.target.value,
                    })}
                    className="mt-2 w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
                  >
                    {getReassignmentCategories().map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              {/* Option: Move to Uncategorized */}
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={deleteConfirmation.targetCategoryId === BUILT_IN_CATEGORY_IDS.UNCATEGORIZED}
                  onChange={() => setDeleteConfirmation({
                    ...deleteConfirmation,
                    targetCategoryId: BUILT_IN_CATEGORY_IDS.UNCATEGORIZED,
                  })}
                />
                <span className="text-sm font-medium text-foreground">
                  Move to Uncategorized
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => setDeleteConfirmation(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="destructive"
                className="flex-1"
              >
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
