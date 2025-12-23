/**
 * Component Templates
 * ====================
 * 
 * This directory contains template components that demonstrate
 * the correct patterns for building UI components with proper
 * z-index layering.
 * 
 * WHEN TO USE THESE TEMPLATES:
 * - Creating new modal dialogs
 * - Creating new dropdown menus
 * - Creating new tooltips or popovers
 * - Any component that needs to appear above other content
 * 
 * HOW TO USE:
 * 1. Copy the relevant template file
 * 2. Rename it to match your component
 * 3. Customize the content and behavior
 * 4. Keep the z-index classes from Z_CLASS
 */

export { ModalTemplate, type ModalTemplateProps } from './ModalTemplate';
export { 
  DropdownTemplate, 
  TooltipTemplate,
  type DropdownTemplateProps,
  type DropdownItem,
  type TooltipTemplateProps,
} from './DropdownTemplate';
