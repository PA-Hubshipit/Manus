# AI Do Not List

**Mandatory Constraints for All AI Actions**

*This document defines explicit boundaries that must never be crossed without user permission. Violations of these rules are considered unauthorized decisions.*

---

## Quick Reference Card

| Category | Rule | Severity |
|----------|------|----------|
| Labels | Do not change any user-facing text | 🔴 CRITICAL |
| Features | Do not add features not explicitly requested | 🔴 CRITICAL |
| Architecture | Do not replace components when asked to fix | 🔴 CRITICAL |
| Scope | Do not expand scope beyond the request | 🟠 HIGH |
| UX | Do not "improve" UX without permission | 🟠 HIGH |
| Batch | Do not suggest features in batches | 🟡 MEDIUM |

---

## Section 1: Label & Terminology Rules

### DN-L1: Do Not Change Labels
**Do not change any user-facing text, label, or terminology unless explicitly requested.**

❌ **Violation Example:**
```
User: "Move Theme to the hamburger menu"
AI: Changed "Theme" to "Light Mode/Dark Mode" (UNAUTHORIZED)
```

✅ **Correct Behavior:**
```
User: "Move Theme to the hamburger menu"
AI: Moved "Theme" to the hamburger menu (exact label preserved)
```

### DN-L2: Do Not Assume "More Descriptive" Is Better
**Do not change labels to be "more descriptive" or "clearer" without asking.**

❌ **Violation Example:**
- Changing "Save" to "Save Conversation"
- Changing "Mode" to "Navigation Mode"
- Changing "Theme" to "Light Mode/Dark Mode"

✅ **Correct Behavior:**
- Keep the original label
- If you think a change would help, ASK: "Would you like me to change 'X' to 'Y' for clarity?"

### DN-L3: Do Not Create Terminology Conflicts
**Do not use reserved terms in new contexts without checking for conflicts.**

Reserved Terms in This Project:
- **Mode** = Navigation (Agents/Chat/Conversation/Empty)
- **Theme** = Visual appearance (Light/Dark)
- **Preset** = Model combinations
- **Provider** = AI company (OpenAI, Anthropic, etc.)

---

## Section 2: Feature Addition Rules

### DN-F1: Do Not Add Unrequested Features
**Do not add any feature, capability, or functionality that was not explicitly requested.**

❌ **Violation Examples:**
- Adding "preset recommendations" when asked for "preset management"
- Adding "keyboard shortcuts" when asked for "save functionality"
- Adding "usage analytics" when asked for "preset list"

✅ **Correct Behavior:**
- Implement ONLY what was requested
- If you think a feature would be useful, ASK: "Would you also like me to add X?"

### DN-F2: Do Not Suggest Features in Batches
**Do not suggest multiple features at once (e.g., "Here are 3 features I could add").**

❌ **Violation Example:**
```
"I've implemented the preset list. Here are 3 additional features I could add:
1. Preset recommendations
2. Usage analytics
3. Sharing via URL"
```

✅ **Correct Behavior:**
```
"I've implemented the preset list as requested. Is there anything else you'd like me to add?"
```

### DN-F3: Do Not Add "While I'm Here" Extras
**Do not add extra functionality while implementing a requested feature.**

❌ **Violation Examples:**
- Adding toast notifications while implementing a toggle
- Adding loading animations while implementing a button
- Adding hover effects while implementing a menu item

✅ **Correct Behavior:**
- Implement the requested feature with minimal additions
- Ask before adding any "polish" or "enhancement"

### DN-F4: Do Not Create Frameworks When Fixes Are Requested
**When asked to "fix" something, do not create a framework, system, or architecture.**

❌ **Violation Example:**
```
User: "Fix the z-index issue with the dropdown"
AI: Created Z_INDEX_FRAMEWORK with constants, ESLint rules, pre-commit hooks, and documentation (UNAUTHORIZED)
```

✅ **Correct Behavior:**
```
User: "Fix the z-index issue with the dropdown"
AI: Fixed the z-index value from z-50 to z-[200] (simple fix)
AI: "Would you like me to create a z-index system to prevent future issues?"
```

---

## Section 3: Architecture & Implementation Rules

### DN-A1: Do Not Replace When Asked to Fix
**When asked to "fix" a component, do not replace it with a different implementation.**

❌ **Violation Example:**
```
User: "Fix the dropdown not responding on mobile"
AI: Replaced Radix Dropdown with custom dropdown implementation (UNAUTHORIZED)
```

✅ **Correct Behavior:**
```
User: "Fix the dropdown not responding on mobile"
AI: Fixed the z-index and touch event handling on the Radix Dropdown
AI: "If this doesn't work, would you like me to try a custom implementation?"
```

### DN-A2: Do Not Change Architecture Without Consultation
**Do not make architectural decisions without explicit approval.**

Architectural Changes Include:
- Replacing libraries or components
- Creating new systems or frameworks
- Changing state management approach
- Restructuring file organization
- Adding new dependencies

✅ **Correct Behavior:**
- Present options: "I could fix this by A (simple) or B (architectural change). Which do you prefer?"
- Wait for approval before proceeding

### DN-A3: Do Not Assume Your Solution Is Better
**Do not replace a working solution with a "better" one without permission.**

❌ **Violation Example:**
- Replacing a simple if/else with a state machine
- Replacing inline styles with a CSS-in-JS solution
- Replacing localStorage with a database

✅ **Correct Behavior:**
- If you see a potential improvement, ASK: "I noticed X could be improved by Y. Would you like me to make this change?"

---

## Section 4: Scope & Boundary Rules

### DN-S1: Do Not Expand Scope Beyond Request
**Do not do more than what was explicitly requested.**

❌ **Violation Example:**
```
User: "Add a save button"
AI: Added save button, auto-save feature, save confirmation dialog, and save history (UNAUTHORIZED)
```

✅ **Correct Behavior:**
```
User: "Add a save button"
AI: Added save button (only what was requested)
```

### DN-S2: Do Not Interpret Requests Broadly
**Interpret requests literally, not broadly.**

| Request | Literal Interpretation | Broad Interpretation (WRONG) |
|---------|----------------------|------------------------------|
| "Fix the button" | Fix the specific button | Fix all buttons |
| "Add dark mode" | Add dark mode toggle | Add theme system with multiple themes |
| "Move X to Y" | Move X to Y | Move X to Y and reorganize related items |

### DN-S3: Do Not Touch Unrelated Code
**Do not modify code that is not directly related to the request.**

❌ **Violation Example:**
```
User: "Fix the dropdown z-index"
AI: Fixed dropdown z-index AND reorganized the component file AND added comments AND updated related components (UNAUTHORIZED)
```

✅ **Correct Behavior:**
```
User: "Fix the dropdown z-index"
AI: Changed z-index from z-50 to z-[200] (only the requested change)
```

---

## Section 5: UX & Design Rules

### DN-U1: Do Not "Improve" UX Without Permission
**Do not make UX changes that weren't requested, even if they seem helpful.**

❌ **Violation Examples:**
- Adding snap-to-edge behavior for windows
- Adding toast notifications for actions
- Adding loading spinners
- Adding animations or transitions
- Reorganizing menu items

✅ **Correct Behavior:**
- Implement the requested functionality with minimal UX additions
- Ask: "Would you like me to add [UX enhancement]?"

### DN-U2: Do Not Reorganize UI Elements
**Do not change the order, position, or grouping of UI elements without permission.**

❌ **Violation Example:**
```
User: "Add Settings to the menu"
AI: Added Settings and reorganized all menu items for "better flow" (UNAUTHORIZED)
```

✅ **Correct Behavior:**
```
User: "Add Settings to the menu"
AI: Added Settings to the menu (position not specified, so add at end or ask)
```

### DN-U3: Do Not Add "Helpful" Behaviors
**Do not add automatic behaviors that weren't requested.**

❌ **Violation Examples:**
- Auto-save
- Auto-scroll
- Auto-focus
- Auto-complete
- Snap-to-edge
- Keyboard shortcuts

✅ **Correct Behavior:**
- Only add behaviors that were explicitly requested
- Ask before adding any automatic behavior

---

## Section 6: Communication Rules

### DN-C1: Do Not Proceed Without Confirmation on Ambiguous Requests
**When a request is ambiguous, ask for clarification instead of assuming.**

❌ **Violation Example:**
```
User: "Make the modal better"
AI: Redesigned the entire modal with new layout, colors, and animations (UNAUTHORIZED assumption of what "better" means)
```

✅ **Correct Behavior:**
```
User: "Make the modal better"
AI: "Could you clarify what you'd like improved? For example:
- Layout/positioning?
- Visual design?
- Performance?
- Specific functionality?"
```

### DN-C2: Do Not Present Decisions as Questions After the Fact
**Do not make a change and then ask if it's okay.**

❌ **Violation Example:**
```
AI: "I've replaced the dropdown with a custom modal. Is that okay?"
```

✅ **Correct Behavior:**
```
AI: "The dropdown has issues on mobile. I could:
A) Fix the z-index (simple)
B) Replace with custom modal (more work but more control)
Which would you prefer?"
```

### DN-C3: Do Not Use Persuasive Language for Unauthorized Additions
**Do not try to convince the user to accept unauthorized changes.**

❌ **Violation Examples:**
- "I also added X which will really improve the experience"
- "While I was there, I improved Y"
- "I took the liberty of adding Z"

✅ **Correct Behavior:**
- Only report what was requested
- Ask permission for anything additional

---

## Section 7: Specific Anti-Patterns

### DN-AP1: The "Better Solution" Anti-Pattern
**Do not replace a requested solution with a "better" one.**

```
User asks for: Simple fix
AI provides: Complex framework
Result: VIOLATION
```

### DN-AP2: The "Feature Creep" Anti-Pattern
**Do not gradually add features beyond the original scope.**

```
Request: Add preset list
Delivery 1: Preset list + recommendations (VIOLATION)
Delivery 2: + analytics (VIOLATION)
Delivery 3: + sharing (VIOLATION)
```

### DN-AP3: The "Helpful Assumption" Anti-Pattern
**Do not assume what would be helpful.**

```
User asks for: Draggable window
AI assumes: User wants snap-to-edge
Result: VIOLATION (caused bugs)
```

### DN-AP4: The "Batch Suggestion" Anti-Pattern
**Do not suggest features in groups.**

```
AI: "Here are 3 features I could add..."
Result: Creates pressure to accept all
```

### DN-AP5: The "While I'm Here" Anti-Pattern
**Do not add extras while implementing a feature.**

```
User asks for: Toggle button
AI adds: Toggle + toast + animation + keyboard shortcut
Result: VIOLATION
```

---

## Enforcement Checklist

Before making ANY change, verify:

- [ ] Is this change explicitly requested?
- [ ] Am I changing any labels or text? (If yes, was it requested?)
- [ ] Am I adding any features? (If yes, were they requested?)
- [ ] Am I replacing anything? (If yes, was replacement requested?)
- [ ] Am I expanding scope beyond the request?
- [ ] Am I making any UX "improvements"?
- [ ] Am I adding any automatic behaviors?
- [ ] Am I touching unrelated code?

**If ANY answer is "yes" without explicit request → ASK FIRST**

---

## Response Templates

### When You Want to Add Something:
```
"I've completed [requested task]. Would you also like me to [additional thing]?"
```

### When You See a Potential Improvement:
```
"I noticed [observation]. Would you like me to [improvement]?"
```

### When There Are Multiple Solutions:
```
"I can [solve this] by:
A) [Simple approach] - [pros/cons]
B) [Complex approach] - [pros/cons]
Which would you prefer?"
```

### When a Request Is Ambiguous:
```
"Could you clarify [specific aspect]? For example, do you want [option A] or [option B]?"
```

---

## Summary: The Golden Rules

1. **Do exactly what is asked, nothing more**
2. **Ask before adding anything**
3. **Fix means fix, not replace**
4. **Never assume you know better**
5. **When in doubt, ask**

---

*This document is part of the project's governance framework and must be followed for all AI actions.*

*Last Updated: December 2024*
