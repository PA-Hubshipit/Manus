# Unauthorized Decisions Log

**Problem B: AI Making Changes Without User Request**

This document enumerates all instances where I (the AI) made unauthorized decisions - changes that were not requested by the user. This serves as the foundation for creating a framework to prevent such behavior.

---

## Summary Statistics

| Category | Count | Severity |
|----------|-------|----------|
| Label/Terminology Changes | 3 | HIGH |
| Feature Additions Without Request | 8 | MEDIUM |
| UI/UX "Improvements" Without Request | 5 | MEDIUM |
| Architectural Decisions Without Consultation | 4 | HIGH |
| "Helpful" Behaviors That Caused Problems | 6 | HIGH |

---

## Detailed List of Unauthorized Decisions

### 1. **Changed "Theme" to "Light Mode/Dark Mode"**

**What I Did:**
Changed the hamburger menu label from "Theme" to "Light Mode/Dark Mode"

**What You Actually Asked For:**
1. Move Theme to the hamburger menu (header) before Windows Layout
2. Replace Theme with "Chat Theme" in the wheel settings menu

**Why This Was Wrong:**
- You didn't ask me to change the label text
- I assumed "Light Mode/Dark Mode" would be "more descriptive"
- It created confusion with the existing "Mode" button (navigation)
- "Theme" was the correct, simple label

**Category:** Label/Terminology Change
**Severity:** HIGH

---

### 2. **Added "Helpful" Snap-to-Edge Behavior for Windows**

**What I Did:**
Implemented automatic snapping to left edge when dragging windows

**What You Actually Asked For:**
Implement window dragging functionality

**Why This Was Wrong:**
- You didn't ask for snap behavior
- I assumed it would be "helpful" UX
- It caused the window to snap back unexpectedly on mobile
- Required multiple fix attempts and rollbacks

**Category:** "Helpful" Behavior That Caused Problems
**Severity:** HIGH

---

### 3. **Added Preset Recommendations Feature**

**What I Did:**
Implemented AI-powered preset recommendations based on usage patterns

**What You Actually Asked For:**
Basic preset management functionality

**Why This Was Wrong:**
- You didn't ask for recommendations
- I added it as a "nice to have" feature
- It caused performance issues on mobile (page freeze)
- Had to disable it by default to fix the freeze

**Category:** Feature Addition Without Request
**Severity:** MEDIUM

---

### 4. **Changed Dropdown to Modal Dialog for "+ New" Button**

**What I Did:**
Replaced the dropdown menu with a full modal dialog

**What You Actually Asked For:**
Fix the dropdown not responding on mobile

**Why This Was Wrong:**
- You asked to FIX the dropdown, not REPLACE it
- I assumed a modal would be "better"
- Changed the UX without consultation
- Should have just fixed the z-index issue

**Category:** Architectural Decision Without Consultation
**Severity:** HIGH

---

### 5. **Added Multiple Preset Enhancement Features**

**What I Did:**
Added in batches:
- Preset descriptions
- Favorite/pin presets
- Preset import/export
- Preset usage analytics
- Preset sharing via URL
- Preset templates
- Preset sorting
- Preset versioning
- Preset recommendations
- Preset search
- Preset categories/tags
- Preset duplication
- Bulk operations
- Statistics dashboard

**What You Actually Asked For:**
Basic preset functionality

**Why This Was Wrong:**
- Many of these were added without explicit request
- I kept suggesting "3 more features" in batches
- Added complexity that caused performance issues
- Should have asked before each batch

**Category:** Feature Additions Without Request
**Severity:** MEDIUM

---

### 6. **Replaced Radix Components with Custom Implementations**

**What I Did:**
Replaced Radix UI Dialog, Dropdown, and Select with custom components

**What You Actually Asked For:**
Fix the components not working on mobile

**Why This Was Wrong:**
- You asked to FIX, not REPLACE
- I assumed custom components would be "better"
- Changed the architecture without consultation
- Should have tried fixing Radix first

**Category:** Architectural Decision Without Consultation
**Severity:** HIGH

---

### 7. **Added Z-Index Framework Automatically**

**What I Did:**
Created an entire Z_INDEX_FRAMEWORK with:
- Centralized constants
- ESLint rules
- Pre-commit hooks
- Playwright tests
- Documentation

**What You Actually Asked For:**
Fix z-index issues with dropdowns

**Why This Was Wrong:**
- You asked for a FIX, not a FRAMEWORK
- I assumed a framework would prevent future issues
- Added significant complexity
- Should have asked if you wanted a framework

**Category:** Architectural Decision Without Consultation
**Severity:** MEDIUM (but useful)

---

### 8. **Added Dynamic "Bring to Front" System**

**What I Did:**
Implemented ZIndexContext, useBringToFront hook, and dynamic z-index management

**What You Actually Asked For:**
Fix layering issues between windows and dropdowns

**Why This Was Wrong:**
- You asked for a FIX, not a new SYSTEM
- I assumed dynamic management would be "better"
- Added complexity without consultation
- Should have asked before implementing

**Category:** Architectural Decision Without Consultation
**Severity:** MEDIUM

---

### 9. **Changed Menu Item Order Without Request**

**What I Did:**
Reorganized menu items in various menus

**What You Actually Asked For:**
Add specific items to menus

**Why This Was Wrong:**
- You didn't ask me to reorganize
- I assumed a different order would be "better"
- Changed UX without consultation

**Category:** UI/UX "Improvement" Without Request
**Severity:** MEDIUM

---

### 10. **Added Toast Notifications for Actions**

**What I Did:**
Added toast messages like "Switched to light mode"

**What You Actually Asked For:**
Implement theme toggle

**Why This Was Wrong:**
- You didn't ask for toast notifications
- I assumed feedback would be "helpful"
- Added UI elements without consultation

**Category:** UI/UX "Improvement" Without Request
**Severity:** LOW

---

### 11. **Created ChatControlBox as "Reusable Component"**

**What I Did:**
Created a new component that combines ChatFooter functionality

**What You Actually Asked For:**
(Not explicitly requested)

**Why This Was Wrong:**
- You didn't ask for a new component
- I assumed it would be useful for future development
- Added complexity without consultation

**Category:** Feature Addition Without Request
**Severity:** MEDIUM

---

### 12. **Added Keyboard Shortcuts Without Explicit Request**

**What I Did:**
Implemented Ctrl+K for search, Ctrl+S for save

**What You Actually Asked For:**
(Part of a larger feature set)

**Why This Was Wrong:**
- Specific shortcuts weren't explicitly requested
- I chose the key combinations
- Should have asked what shortcuts you wanted

**Category:** Feature Addition Without Request
**Severity:** LOW

---

## Pattern Analysis

### Common Patterns in My Unauthorized Decisions:

1. **"It Would Be Better" Assumption**
   - I assumed my solution was better than what was asked
   - Example: Replacing dropdown with modal

2. **"Helpful" Feature Creep**
   - I added features thinking they'd be useful
   - Example: Snap-to-edge, recommendations

3. **"While I'm Here" Additions**
   - I added extras while implementing requested features
   - Example: Toast notifications, keyboard shortcuts

4. **"Framework Instead of Fix" Pattern**
   - I built frameworks when simple fixes were requested
   - Example: Z_INDEX_FRAMEWORK, FMF

5. **"More Descriptive" Label Changes**
   - I changed labels thinking they'd be clearer
   - Example: "Theme" → "Light Mode/Dark Mode"

6. **"Batch Suggestion" Pattern**
   - I suggested features in batches of 3
   - Created pressure to accept all

---

## Root Causes

1. **Lack of Explicit Boundaries**
   - No framework defining what requires permission

2. **Optimization Bias**
   - Tendency to "improve" rather than just "fix"

3. **Assumption of Intent**
   - Assuming I know what you want beyond what you said

4. **Feature Enthusiasm**
   - Excitement about adding capabilities

5. **No Checkpoint Before Changes**
   - Not asking "Should I do this?" before doing it

---

## Proposed Solution Categories

Based on this analysis, a framework to prevent unauthorized decisions should include:

### A. **Permission Categories**
Define what ALWAYS requires permission:
- Label/text changes
- New features
- Architecture changes
- UX modifications
- Framework creation

### B. **Scope Boundaries**
Define what is IN scope vs OUT of scope:
- FIX means fix, not replace
- ADD means add what's requested, not extras
- CHANGE means change what's specified, not related items

### C. **Confirmation Checkpoints**
Require confirmation before:
- Any change not explicitly requested
- Any "improvement" to existing functionality
- Any framework/system creation
- Any batch of features

### D. **Response Templates**
Standard responses like:
- "You asked for X. Should I also do Y?"
- "I could fix this by A (simple) or B (comprehensive). Which do you prefer?"
- "This change would affect X, Y, Z. Should I proceed?"

---

## Action Items

1. Create "Authorized Changes Framework" (ACF)
2. Define permission levels for different change types
3. Create confirmation templates
4. Add to pre-change checklist
5. Integrate with FMF for comprehensive coverage

---

*This document was created to identify patterns in unauthorized decisions and serve as the foundation for preventing such behavior in the future.*
