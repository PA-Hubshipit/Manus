/**
 * Dropdown Template - Standard Dropdown Component Pattern
 * ========================================================
 * 
 * This template demonstrates the correct way to build dropdown components
 * using our centralized z-index system.
 * 
 * COPY THIS FILE when creating new dropdown components.
 * 
 * KEY POINTS:
 * 1. Import Z_CLASS from @/lib/z-index
 * 2. Use Z_CLASS.DROPDOWN for dropdown menus
 * 3. Use Z_CLASS.POPOVER for tooltips and popovers
 * 4. NEVER use arbitrary z-index values
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Z_CLASS } from '@/lib/z-index';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownTemplateProps {
  /** Trigger button content */
  trigger: React.ReactNode;
  /** Dropdown items */
  items: DropdownItem[];
  /** Alignment of dropdown relative to trigger */
  align?: 'left' | 'right' | 'center';
  /** Width of dropdown */
  width?: 'auto' | 'trigger' | number;
  /** Whether the dropdown is inside a modal */
  inModal?: boolean;
}

// =============================================================================
// ALIGNMENT CLASSES
// =============================================================================

const ALIGN_CLASSES = {
  left: 'left-0',
  right: 'right-0',
  center: 'left-1/2 -translate-x-1/2',
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DropdownTemplate - A properly layered dropdown component.
 * 
 * @example
 * ```tsx
 * <DropdownTemplate
 *   trigger={<Button>Open Menu</Button>}
 *   items={[
 *     { id: '1', label: 'Option 1', onClick: () => console.log('1') },
 *     { id: '2', label: 'Option 2', onClick: () => console.log('2') },
 *   ]}
 * />
 * ```
 */
export function DropdownTemplate({
  trigger,
  items,
  align = 'left',
  width = 'auto',
  inModal = false,
}: DropdownTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Calculate width style
  const getWidthStyle = (): React.CSSProperties => {
    if (width === 'auto') return {};
    if (width === 'trigger') return { minWidth: '100%' };
    return { width: `${width}px` };
  };

  // Choose z-index based on context
  // If inside a modal, use POPOVER (higher than DROPDOWN) to ensure visibility
  const dropdownZClass = inModal ? Z_CLASS.POPOVER : Z_CLASS.DROPDOWN;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute top-full mt-1 ${ALIGN_CLASSES[align]}
            bg-popover text-popover-foreground
            border border-border rounded-md shadow-lg
            py-1 min-w-[8rem]
            animate-in fade-in-0 zoom-in-95
            ${dropdownZClass}
          `}
          style={getWidthStyle()}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item) => (
            <button
              key={item.id}
              className={`
                w-full px-3 py-2 text-left text-sm
                flex items-center gap-2
                hover:bg-accent hover:text-accent-foreground
                focus:bg-accent focus:text-accent-foreground
                focus:outline-none
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick?.();
                  setIsOpen(false);
                }
              }}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// TOOLTIP TEMPLATE
// =============================================================================

export interface TooltipTemplateProps {
  /** Content to show in tooltip */
  content: React.ReactNode;
  /** Element that triggers the tooltip */
  children: React.ReactNode;
  /** Position of tooltip */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing tooltip (ms) */
  delay?: number;
}

/**
 * TooltipTemplate - A properly layered tooltip component.
 * 
 * @example
 * ```tsx
 * <TooltipTemplate content="This is a tooltip">
 *   <Button>Hover me</Button>
 * </TooltipTemplate>
 * ```
 */
export function TooltipTemplate({
  content,
  children,
  position = 'top',
  delay = 200,
}: TooltipTemplateProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`
            absolute ${positionClasses[position]}
            bg-popover text-popover-foreground
            px-2 py-1 rounded text-sm
            shadow-md whitespace-nowrap
            animate-in fade-in-0 zoom-in-95
            ${Z_CLASS.POPOVER}
          `}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// USAGE EXAMPLES (for documentation)
// =============================================================================

/**
 * Example: Basic Dropdown
 * 
 * ```tsx
 * function MyComponent() {
 *   return (
 *     <DropdownTemplate
 *       trigger={
 *         <Button variant="outline">
 *           Options <ChevronDown className="ml-2 h-4 w-4" />
 *         </Button>
 *       }
 *       items={[
 *         { id: 'edit', label: 'Edit', icon: <Edit className="h-4 w-4" /> },
 *         { id: 'delete', label: 'Delete', icon: <Trash className="h-4 w-4" /> },
 *       ]}
 *     />
 *   );
 * }
 * ```
 * 
 * Example: Dropdown Inside Modal
 * 
 * ```tsx
 * function ModalWithDropdown() {
 *   return (
 *     <ModalTemplate isOpen={true} onClose={() => {}} title="Modal">
 *       {// Use inModal={true} for proper z-index layering}
 *       <DropdownTemplate
 *         trigger={<Button>Select Option</Button>}
 *         items={options}
 *         inModal={true}
 *       />
 *     </ModalTemplate>
 *   );
 * }
 * ```
 */

export default DropdownTemplate;
