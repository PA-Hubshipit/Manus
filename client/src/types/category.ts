/**
 * =============================================================================
 * CATEGORY SYSTEM - DESIGN DOCUMENTATION
 * =============================================================================
 * 
 * This file defines the Category system for organizing presets in the Multi-AI
 * Chat application. The design was established through a brainstorming session
 * to determine the best approach for managing preset categories.
 * 
 * =============================================================================
 * DESIGN DECISIONS (from brainstorming session)
 * =============================================================================
 * 
 * QUESTION 1: Is "Uncategorized" a real category or just null?
 * DECISION: Option B - "Uncategorized" is a built-in category that always exists
 *           and cannot be deleted. This provides a consistent fallback.
 * 
 * QUESTION 2: Can users rename built-in categories?
 * DECISION: Option A - No, built-in categories have fixed names. Users can only
 *           edit custom categories they create.
 * 
 * QUESTION 3: What happens when a category is deleted?
 * DECISION: Ask user to choose between:
 *           - Move presets to another category (user selects which one)
 *           - Move presets to "Uncategorized"
 * 
 * =============================================================================
 * CORE DEFINITION
 * =============================================================================
 * 
 * A Category is a user-defined organizational container that groups related
 * presets together based on their intended purpose, workflow, or context.
 * 
 * WHAT A CATEGORY IS:
 * - A grouping mechanism: Organizes presets into logical buckets
 * - A visual identifier: Color/icon helps users quickly identify preset types
 * - A filter criterion: Users can filter presets by category
 * - User-customizable: Users can create, edit, delete their own categories
 * - Single-assignment: Each preset belongs to ONE category (not multiple)
 * 
 * WHAT A CATEGORY IS NOT:
 * - Not a tag: Tags are multiple, flexible labels; category is singular, structured
 * - Not a folder: No nesting/hierarchy (keeps it simple)
 * - Not required: Presets default to "Uncategorized" if not set
 * - Not shared: Categories are per-user, not global
 * 
 * =============================================================================
 * CATEGORY VS TAGS COMPARISON
 * =============================================================================
 * 
 * | Aspect              | Category                    | Tags                      |
 * |---------------------|-----------------------------| --------------------------|
 * | Quantity per preset | One                         | Many                      |
 * | Purpose             | Primary organization        | Secondary attributes      |
 * | UI representation   | Dropdown selector           | Free-form input           |
 * | Filtering           | "Show all Coding presets"   | "Show presets with Python"|
 * | Example             | "Coding"                    | ["python", "backend"]     |
 * 
 * REAL-WORLD ANALOGY:
 * Think of it like email:
 * - Category = Folder (Inbox, Work, Personal) — one per email
 * - Tags = Labels (Urgent, Follow-up, Project-X) — multiple per email
 * 
 * =============================================================================
 * ARCHITECTURE
 * =============================================================================
 * 
 * Categories are managed centrally through "Categories Settings" in the Settings
 * menu. This creates a single source of truth for categories across the app.
 * 
 * Settings Wheel Menu
 * ├── Presets Setting
 * ├── Categories Setting    ← Category management lives here
 * ├── Theme
 * ├── Language
 * └── Export Data
 * 
 * DATA FLOW:
 * 
 * Categories Settings (Source)
 *         │
 *         ▼
 *    localStorage
 *         │
 *         ├──► Preset Creation Form (dropdown reads categories)
 *         │
 *         ├──► Quick Presets Panel (filter by category)
 *         │
 *         ├──► Presets Management Modal (category column)
 *         │
 *         └──► Future: Analytics by category
 * 
 * =============================================================================
 * RULES SUMMARY
 * =============================================================================
 * 
 * 1. "Uncategorized" always exists — It's the fallback category
 * 2. Built-in categories can't be renamed or deleted — Only custom categories can
 * 3. Custom categories are fully editable — Name, color, icon, description
 * 4. Deleting a category requires user decision — Choose destination for presets
 * 5. Every preset has exactly one category — Defaults to "Uncategorized" if not set
 * 
 * =============================================================================
 */

/**
 * Represents a category for organizing presets.
 * Categories provide primary organization while tags offer secondary attributes.
 */
export interface Category {
  /** Unique identifier - UUID for custom, slug for built-in (e.g., "coding") */
  id: string;
  
  /** Display name shown in UI */
  name: string;
  
  /** Hex color for visual identification (e.g., "#3B82F6") */
  color: string;
  
  /** Optional emoji or icon name for visual enhancement */
  icon?: string;
  
  /** Optional description explaining the category's purpose */
  description?: string;
  
  /** If true, category cannot be deleted or renamed */
  isBuiltIn: boolean;
  
  /** Position in lists/dropdowns (lower = higher priority) */
  order: number;
  
  /** Unix timestamp of when the category was created */
  createdAt: number;
}

/**
 * Built-in category IDs as constants for type safety
 */
export const BUILT_IN_CATEGORY_IDS = {
  CODING: 'coding',
  WRITING: 'writing',
  RESEARCH: 'research',
  PERSONAL: 'personal',
  WORK: 'work',
  UNCATEGORIZED: 'uncategorized',
} as const;

/**
 * Default built-in categories that ship with the app.
 * These cannot be deleted or renamed by users.
 * 
 * | ID            | Name          | Color   | Icon | Deletable | Editable |
 * |---------------|---------------|---------|------|-----------|----------|
 * | coding        | Coding        | Blue    | 💻   | No        | No       |
 * | writing       | Writing       | Green   | ✍️   | No        | No       |
 * | research      | Research      | Yellow  | 🔍   | No        | No       |
 * | personal      | Personal      | Purple  | 👤   | No        | No       |
 * | work          | Work          | Red     | 💼   | No        | No       |
 * | uncategorized | Uncategorized | Gray    | 📁   | No        | No       |
 */
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: BUILT_IN_CATEGORY_IDS.CODING,
    name: 'Coding',
    color: '#3B82F6', // Blue
    icon: '💻',
    description: 'Programming and development tasks',
    isBuiltIn: true,
    order: 0,
    createdAt: 0,
  },
  {
    id: BUILT_IN_CATEGORY_IDS.WRITING,
    name: 'Writing',
    color: '#22C55E', // Green
    icon: '✍️',
    description: 'Content creation and copywriting',
    isBuiltIn: true,
    order: 1,
    createdAt: 0,
  },
  {
    id: BUILT_IN_CATEGORY_IDS.RESEARCH,
    name: 'Research',
    color: '#EAB308', // Yellow
    icon: '🔍',
    description: 'Information gathering and analysis',
    isBuiltIn: true,
    order: 2,
    createdAt: 0,
  },
  {
    id: BUILT_IN_CATEGORY_IDS.PERSONAL,
    name: 'Personal',
    color: '#A855F7', // Purple
    icon: '👤',
    description: 'Personal projects and tasks',
    isBuiltIn: true,
    order: 3,
    createdAt: 0,
  },
  {
    id: BUILT_IN_CATEGORY_IDS.WORK,
    name: 'Work',
    color: '#EF4444', // Red
    icon: '💼',
    description: 'Professional and business tasks',
    isBuiltIn: true,
    order: 4,
    createdAt: 0,
  },
  {
    id: BUILT_IN_CATEGORY_IDS.UNCATEGORIZED,
    name: 'Uncategorized',
    color: '#6B7280', // Gray
    icon: '📁',
    description: 'Presets without a specific category',
    isBuiltIn: true,
    order: 999, // Always at the bottom
    createdAt: 0,
  },
];

/**
 * Available colors for custom categories.
 * Users can select from this palette when creating new categories.
 */
export const CATEGORY_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Gray', value: '#6B7280' },
] as const;

/**
 * Available icons for categories.
 * Users can select from this list when creating new categories.
 */
export const CATEGORY_ICONS = [
  '💻', '✍️', '🔍', '👤', '💼', '📁',
  '🎨', '📊', '🎯', '💡', '🚀', '⚡',
  '🔧', '📝', '🎓', '🌐', '📱', '🤖',
  '📈', '🎮', '🎵', '📷', '✈️', '🏠',
] as const;

/**
 * localStorage key for storing categories
 */
export const CATEGORIES_STORAGE_KEY = 'multi-ai-chat-categories';

/**
 * Helper function to get a category by ID
 */
export function getCategoryById(categories: Category[], id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

/**
 * Helper function to get the default category (Uncategorized)
 */
export function getDefaultCategory(categories: Category[]): Category {
  return categories.find(cat => cat.id === BUILT_IN_CATEGORY_IDS.UNCATEGORIZED) 
    || DEFAULT_CATEGORIES.find(cat => cat.id === BUILT_IN_CATEGORY_IDS.UNCATEGORIZED)!;
}

/**
 * Helper function to check if a category can be edited
 */
export function canEditCategory(category: Category): boolean {
  return !category.isBuiltIn;
}

/**
 * Helper function to check if a category can be deleted
 */
export function canDeleteCategory(category: Category): boolean {
  return !category.isBuiltIn;
}

/**
 * Helper function to sort categories by order
 */
export function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}

/**
 * Generate a unique ID for a new custom category
 */
export function generateCategoryId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
