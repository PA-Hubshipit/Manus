/**
 * Modal Template - Standard Modal Component Pattern
 * ==================================================
 * 
 * This template demonstrates the correct way to build modal components
 * using our centralized z-index system.
 * 
 * COPY THIS FILE when creating new modal components.
 * 
 * KEY POINTS:
 * 1. Import Z_CLASS from @/lib/z-index
 * 2. Use Z_CLASS.MODAL_BACKDROP for the backdrop
 * 3. Use Z_CLASS.MODAL for the modal content
 * 4. Use Z_CLASS.NESTED_MODAL for modals inside modals
 * 5. NEVER use arbitrary z-index values
 */

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Z_CLASS } from '@/lib/z-index';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ModalTemplateProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content */
  children: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Whether this is a nested modal (inside another modal) */
  isNested?: boolean;
  /** Maximum width of the modal */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

// =============================================================================
// WIDTH MAPPING
// =============================================================================

const MAX_WIDTH_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ModalTemplate - A properly layered modal component.
 * 
 * @example
 * ```tsx
 * <ModalTemplate
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="My Modal"
 * >
 *   <p>Modal content goes here</p>
 * </ModalTemplate>
 * ```
 */
export function ModalTemplate({
  isOpen,
  onClose,
  title,
  children,
  footer,
  isNested = false,
  maxWidth = 'lg',
}: ModalTemplateProps) {
  // Don't render if not open
  if (!isOpen) return null;

  // Choose z-index based on whether this is a nested modal
  const backdropZClass = isNested ? Z_CLASS.MODAL : Z_CLASS.MODAL_BACKDROP;
  const contentZClass = isNested ? Z_CLASS.NESTED_MODAL : Z_CLASS.MODAL;

  return (
    <>
      {/* Backdrop - Click to close */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${backdropZClass}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - Centered */}
      <div
        className={`fixed inset-0 flex items-center justify-center p-4 ${contentZClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Content */}
        <div
          className={`
            bg-card text-card-foreground
            rounded-lg shadow-xl
            w-full ${MAX_WIDTH_CLASSES[maxWidth]}
            max-h-[90vh] flex flex-col
            animate-in fade-in-0 zoom-in-95
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>

          {/* Footer - Optional */}
          {footer && (
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// =============================================================================
// USAGE EXAMPLES (for documentation)
// =============================================================================

/**
 * Example: Basic Modal
 * 
 * ```tsx
 * function MyComponent() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
 *       
 *       <ModalTemplate
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         title="Basic Modal"
 *         footer={
 *           <>
 *             <Button variant="outline" onClick={() => setIsOpen(false)}>
 *               Cancel
 *             </Button>
 *             <Button onClick={handleSubmit}>
 *               Submit
 *             </Button>
 *           </>
 *         }
 *       >
 *         <p>This is the modal content.</p>
 *       </ModalTemplate>
 *     </>
 *   );
 * }
 * ```
 * 
 * Example: Nested Modal (Confirmation Dialog)
 * 
 * ```tsx
 * function ParentModal({ isOpen, onClose }) {
 *   const [showConfirm, setShowConfirm] = useState(false);
 *   
 *   return (
 *     <ModalTemplate isOpen={isOpen} onClose={onClose} title="Parent Modal">
 *       <Button onClick={() => setShowConfirm(true)}>Delete Item</Button>
 *       
 *       {// Nested modal uses isNested={true} for higher z-index}
 *       <ModalTemplate
 *         isOpen={showConfirm}
 *         onClose={() => setShowConfirm(false)}
 *         title="Confirm Delete"
 *         isNested={true}
 *         maxWidth="sm"
 *       >
 *         <p>Are you sure you want to delete this item?</p>
 *       </ModalTemplate>
 *     </ModalTemplate>
 *   );
 * }
 * ```
 */

export default ModalTemplate;
