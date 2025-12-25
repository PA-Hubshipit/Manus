# ChatControlBox Component Documentation

**Version:** 1.0.0  
**Author:** Manus AI  
**Last Updated:** December 25, 2025

---

## Table of Contents

1. [Overview](#1-overview)
2. [Visual Design](#2-visual-design)
3. [AI Prompt for Recreation](#3-ai-prompt-for-recreation)
4. [Icon Behaviors](#4-icon-behaviors)
5. [Responsiveness](#5-responsiveness)
6. [Full Component Code](#6-full-component-code)

---

## 1. Overview

The **ChatControlBox** is a self-contained, reusable React component that provides a complete chat control interface for multi-AI chat applications. It encapsulates all user interaction elements including message composition, model selection, file attachments, voice input, and conversation management within a compact, visually cohesive dark-mode container.

This component is designed to be dropped into any chat interface and immediately provides full functionality without requiring external state management for its internal features. It follows a mobile-first responsive design philosophy and adheres to strict framework compliance for z-index layering, touch event handling, and component architecture patterns.

![ChatControlBox Overview](./images/chatcontrolbox-overview.png)

**Key Characteristics:**

| Attribute | Description |
|-----------|-------------|
| **Design Philosophy** | Ultra-compact dark mode with unified container |
| **Layout Structure** | Two-row stacked layout (Toolbar + Input) |
| **Framework Compliance** | Z_INDEX_FRAMEWORK, RESPONSIVENESS_FRAMEWORK, TECHNICAL_FRAMEWORK |
| **Responsiveness** | Mobile-first with breakpoint at 768px |
| **Self-Contained** | All behaviors built-in, minimal external dependencies |

---

## 2. Visual Design

The ChatControlBox presents a sophisticated dark-mode interface organized into two distinct rows within a unified rectangular container featuring rounded corners and a subtle gray border. The design prioritizes information density while maintaining visual clarity and touch-friendly interaction targets.

### 2.1 Container Structure

The outer container uses a dark zinc background (`bg-zinc-800/95`) with a subtle border (`border-zinc-700/50`) and generous rounded corners (`rounded-2xl`). A backdrop blur effect (`backdrop-blur-sm`) provides depth when overlaying content. Internal padding is kept minimal to achieve the ultra-compact aesthetic.

### 2.2 Row 1: Toolbar

The toolbar row contains seven interactive elements arranged horizontally with consistent spacing. Each element serves a distinct function in conversation management and AI model configuration.

![ChatControlBox Desktop Layout](./images/chatcontrolbox-desktop.png)

| Position | Element | Visual Description |
|----------|---------|-------------------|
| 1 | **Menu Icon** | Three horizontal white lines (hamburger pattern), 20×20px, zinc-400 color with white hover state |
| 2 | **Plus Icon** | White cross/plus symbol, 20×20px, zinc-400 color with white hover state |
| 3 | **Models Pill** | Blue rounded pill (`bg-blue-500`), displays "N Models" text in white, 32px height |
| 4 | **Synthesizer Icon** | Cyan/teal robot head with antenna (`Bot` from Lucide), blue-400 color when models selected, zinc-500 when disabled |
| 5 | **Settings Icon** | White gear/cog symbol, 20×20px, zinc-400 color with white hover state |
| 6 | **Save Icon** | White floppy disk symbol, 20×20px, zinc-400 color (zinc-600 when disabled) |
| 7 | **Presets Button** | Gray rounded pill (`bg-zinc-600`), displays "Presets" text, 32px height |

### 2.3 Row 2: Input Area

The input row features a full-width light gray rounded input field (`bg-zinc-200`) with contextual icons positioned inside the field boundaries on mobile, and partially outside on desktop.

| Position | Element | Visual Description |
|----------|---------|-------------------|
| Left (inside) | **Paperclip Icon** | Gray attachment symbol, 16×16px, zinc-500 color |
| Left (inside) | **Connectors Icon** | Gray USB/plug symbol, 16×16px, zinc-500 color (blue-500 when active) |
| Center | **Text Input** | Light gray textarea with placeholder "Type a message...", auto-growing height (40px to 200px max) |
| Right (inside) | **Microphone Icon** | Gray microphone symbol, 16×16px, zinc-500 color (red-500 with pulse animation when recording) |
| Right (inside/outside) | **Send Arrow** | Gray upward arrow, strokeWidth 2.125, 16×16px on mobile (inside), 20×20px on desktop (outside) |

![ChatControlBox Mobile Layout](./images/chatcontrolbox-mobile.png)

---

## 3. AI Prompt for Recreation

The following prompt can be used to instruct an AI assistant to recreate the ChatControlBox component from scratch. This prompt encompasses all visual, behavioral, and technical requirements.

---

### Complete Recreation Prompt

```
Create a React TypeScript component called ChatControlBox for a multi-AI chat application. This is a self-contained chat control interface with the following specifications:

VISUAL DESIGN:
- Ultra-compact dark mode container with bg-zinc-800/95, border-zinc-700/50, rounded-2xl corners
- Backdrop blur effect for depth
- Two-row stacked layout with no horizontal separator between rows
- Extremely tight vertical spacing (p-3 container padding, gap-2 between rows)

ROW 1 - TOOLBAR (left to right):
1. Menu Icon: Hamburger (3 lines), h-8 w-8 button, zinc-400 hover:white
2. Plus Icon: Plus symbol, h-8 w-8 button, zinc-400 hover:white
3. Models Pill: Blue rounded pill (bg-blue-500), displays "{N} Models" text, h-8 px-4
4. Synthesizer Icon: Bot icon from Lucide, cyan/teal color (blue-400) when enabled, zinc-500 when disabled
5. Settings Icon: Gear/Settings icon, h-8 w-8 button, zinc-400 hover:white, opens dropdown menu
6. Save Icon: Floppy disk/Save icon, h-8 w-8 button, zinc-400 hover:white, disabled when no messages
7. Presets Button: Gray rounded pill (bg-zinc-600), displays "Presets" text, h-8 px-4

ROW 2 - INPUT AREA:
- Full-width light gray rounded input field (bg-zinc-200, rounded-full)
- Auto-growing textarea: min-height 40px, max-height 200px
- Placeholder: "Type a message..." or "Select models to start chatting..."
- Icons positioned inside the input field on mobile, partially outside on desktop

INPUT ICONS:
- Paperclip (left): File attachment trigger, zinc-500 hover:zinc-700
- Connectors/Plug (left on mobile, right on desktop): Opens ConnectorsStore modal
- Microphone (right): Voice-to-text using Web Speech API, red with pulse animation when active
- Send Arrow (right): ArrowUp icon with strokeWidth={2.125}, zinc-500 color, no background

RESPONSIVE BEHAVIOR (breakpoint: 768px):
- Mobile (< 768px): All icons inside input field, Send button inside input (28×28px)
- Desktop (≥ 768px): Paperclip outside input on left, Send button outside input on right (40×40px)

ICON BEHAVIORS:
1. Menu: Opens dropdown with New Chat, Rename, Save, Clear, Analytics, Delete, Recent Conversations, Archive
2. Plus: Creates new chat (calls onNewChat callback)
3. Models: Opens ModelSelector panel with Provider/Model selection
4. Synthesizer: Triggers AI synthesis (only when models selected)
5. Settings: Opens dropdown with Presets Setting, Categories Setting, Chat Theme, Language, Export Data
6. Save: Saves conversation to localStorage
7. Presets: Opens PresetsPanel with Quick Presets
8. Paperclip: Opens file picker for attachments
9. Connectors: Opens ConnectorsStore modal (Browser, Gmail, Calendar integrations)
10. Microphone: Activates Web Speech Recognition API
11. Send: Sends message with attachments (disabled when empty or no models)

STATE MANAGEMENT:
- inputMessage: string (message text)
- attachments: Attachment[] (file attachments)
- isListening: boolean (voice recording state)
- Panel visibility states for all dropdowns/modals
- Use useResponsive() hook for isMobile detection

PROPS INTERFACE:
- messages: Message[]
- onMessagesChange: (messages: Message[]) => void
- selectedModels: string[]
- onModelsChange: (models: string[]) => void
- onSendMessage: (text: string, attachments: Attachment[]) => void
- conversationTitle?: string
- onTitleChange?: (title: string) => void
- isLoading?: boolean
- hideConnectors?: boolean
- hideSynthesizer?: boolean
- hideVoiceInput?: boolean
- placeholder?: string
- onNewChat?: () => void
- onSynthesize?: () => void
- onThemesSettings?: () => void
- template?: ChatWindowTemplate

FRAMEWORK COMPLIANCE:
- Use Z_CLASS constants from @/lib/z-index for all layered elements
- Use useResponsive() hook from @/hooks/useResponsive
- Follow mobile-first touch event handling patterns
- Use Lucide React icons: Menu, Plus, Settings, Save, Paperclip, ArrowUp, Bot, Mic, Plug

KEYBOARD BEHAVIOR:
- Enter sends message on mobile (without Shift)
- Shift+Enter creates newline on all devices
- Textarea auto-grows as user types
```

---

## 4. Icon Behaviors

This section provides a comprehensive description of each interactive element's behavior, including trigger conditions, visual feedback, and resulting actions.

### 4.1 Menu Icon (Hamburger)

The Menu icon serves as the primary navigation control for conversation management operations. When activated, it reveals a dropdown panel containing eight action items organized in a logical hierarchy.

**Trigger:** Single tap/click on the hamburger icon (three horizontal lines)

**Visual Feedback:** Icon color transitions from `zinc-400` to `white` on hover. The dropdown panel appears with a slide-down animation, positioned above the icon with a subtle shadow and border.

**Dropdown Actions:**

| Action | Icon | Description | Condition |
|--------|------|-------------|-----------|
| New Chat | `Plus` | Clears current conversation and resets title | Always enabled |
| Rename Chat | `Edit` | Opens RenameChatDialog modal | Always enabled |
| Save Chat | `Save` | Saves conversation to localStorage | Requires messages |
| Clear Chat | `Trash2` | Clears messages after confirmation | Requires messages |
| Show Analytics | `BarChart` | Opens AnalyticsPanel | Always enabled |
| Delete Chat | `Trash2` | Deletes conversation after confirmation | Always enabled |
| Recent Conversations | `MessageSquare` | Opens SavedConversationsModal | Always enabled |
| Archive | `Archive` | Shows archived conversations | Always enabled |

### 4.2 Plus Icon

The Plus icon provides a quick action for starting a new conversation without navigating through the menu.

**Trigger:** Single tap/click on the plus symbol

**Visual Feedback:** Icon color transitions from `zinc-400` to `white` on hover

**Behavior:** Invokes the `onNewChat` callback if provided. If no callback is provided, the component internally clears the messages array and resets the conversation title to "New Chat". The footer menu is automatically closed if open.

### 4.3 Models Pill

The Models pill displays the current model selection count and provides access to the model configuration panel.

**Trigger:** Single tap/click on the blue pill

**Visual Feedback:** The pill uses `bg-blue-500` with `hover:bg-blue-400` transition. When the ModelSelector panel is open, the pill maintains its active state.

**Behavior:** Toggles the visibility of the ModelSelector panel. When opened, the panel displays available AI providers (OpenAI, Anthropic, Google, etc.) with their respective models. Users can select multiple models for parallel AI responses. The Presets panel is automatically closed when Models panel opens.

**Display Logic:** Shows "0 Models" when no models selected, "1 Model" for single selection, "N Models" for multiple selections.

### 4.4 Synthesizer Icon (Robot Head)

The Synthesizer icon triggers AI-powered synthesis of responses from multiple selected models.

**Trigger:** Single tap/click on the robot/bot icon

**Visual Feedback:** 
- **Enabled state:** `text-blue-400` with `hover:text-blue-300`
- **Disabled state:** `text-zinc-500` with `cursor-not-allowed`

**Behavior:** Invokes the `onSynthesize` callback when clicked. This feature is only available when at least one model is selected. The synthesis function typically combines or summarizes responses from multiple AI models into a unified response.

**Condition:** Disabled when `selectedModels.length === 0`

### 4.5 Settings Icon (Gear)

The Settings icon provides access to application configuration options through a dropdown menu.

**Trigger:** Single tap/click on the gear icon

**Visual Feedback:** Icon color transitions from `zinc-400` to `white` on hover. Dropdown appears with the same styling as the Menu dropdown.

**Dropdown Actions:**

| Action | Icon | Description |
|--------|------|-------------|
| Presets Setting | `Zap` | Opens PresetsManagementModal for creating/editing presets |
| Categories Setting | `FolderOpen` | Opens CategoriesSettingsModal for organizing models |
| Chat Theme | `Palette` | Invokes onThemesSettings callback or shows "coming soon" toast |
| Language | `Globe` | Shows "coming soon" toast (placeholder) |
| Export Data | `Download` | Exports current conversation as JSON file |

### 4.6 Save Icon (Floppy Disk)

The Save icon persists the current conversation to browser localStorage.

**Trigger:** Single tap/click on the floppy disk icon

**Visual Feedback:**
- **Enabled state:** `text-zinc-400` with `hover:text-white`
- **Disabled state:** `text-zinc-600` with `cursor-not-allowed`

**Behavior:** Creates a SavedConversation object containing the conversation ID, title, timestamp, messages array, and selected models. The data is serialized to JSON and stored in localStorage with a unique key (`conversation:{timestamp}`). A success toast notification confirms the save operation.

**Condition:** Disabled when `messages.length === 0`

### 4.7 Presets Button

The Presets button provides quick access to saved model configuration presets.

**Trigger:** Single tap/click on the "Presets" pill

**Visual Feedback:** Button uses `bg-zinc-600` with `hover:bg-zinc-500` transition

**Behavior:** Toggles the visibility of the PresetsPanel. The panel displays Quick Presets that users have saved, allowing one-click application of model configurations. Users can edit or delete presets from this panel. The Models panel is automatically closed when Presets panel opens.

### 4.8 Paperclip Icon (File Attachment)

The Paperclip icon enables file attachment functionality for the chat message.

**Trigger:** Single tap/click on the paperclip icon

**Visual Feedback:** Icon color transitions from `zinc-500` to `zinc-700` on hover

**Behavior:** Opens the browser's native file picker dialog (via hidden `<input type="file" multiple>`). Selected files are converted to Attachment objects containing name, type, size, and File reference. A toast notification confirms the number of files attached. Attachments are displayed as removable chips above the input field.

**Position:** Inside input field on left (mobile), outside input field on left (desktop)

### 4.9 Connectors Icon (Plug)

The Connectors icon provides access to external service integrations.

**Trigger:** Single tap/click on the plug icon

**Visual Feedback:**
- **Default state:** `text-zinc-500` with `hover:text-zinc-700`
- **Active state:** `text-blue-500` when ConnectorsStore is open

**Behavior:** Opens the ConnectorsStore modal which displays available integrations including Browser, Gmail, Calendar, and other services. These connectors extend the chat's capabilities by allowing AI models to access external data sources.

**Position:** Inside input field on left (mobile), inside input field on right (desktop)

### 4.10 Microphone Icon (Voice Input)

The Microphone icon activates voice-to-text functionality using the Web Speech Recognition API.

**Trigger:** Single tap/click on the microphone icon

**Visual Feedback:**
- **Idle state:** `text-zinc-500` with `hover:text-zinc-700`
- **Recording state:** `text-red-500` with `animate-pulse` CSS animation

**Behavior:** 
1. Checks for browser support (`webkitSpeechRecognition` or `SpeechRecognition`)
2. Requests microphone permission via `navigator.mediaDevices.getUserMedia`
3. Initializes SpeechRecognition with continuous mode and interim results
4. Appends transcribed text to the input field
5. Toggles off when clicked again or when speech ends

**Error Handling:** Displays toast notification if speech recognition is not supported or if microphone permission is denied.

### 4.11 Send Arrow (Message Submit)

The Send arrow submits the composed message along with any attachments.

**Trigger:** Single tap/click on the upward arrow icon, or Enter key on mobile

**Visual Feedback:**
- **Enabled state:** `text-zinc-500` with `hover:text-zinc-700`
- **Disabled state:** `opacity-50` with `cursor-not-allowed`

**Behavior:** 
1. Validates that input message is not empty (after trimming whitespace)
2. Validates that at least one model is selected
3. Invokes `onSendMessage` callback with message text and attachments array
4. Clears the input field and attachments
5. Resets textarea height to default (40px)

**Condition:** Disabled when `!inputMessage.trim() || selectedModels.length === 0 || isLoading`

**Icon Styling:** Uses `ArrowUp` from Lucide with `strokeWidth={2.125}` for slightly bolder appearance than default icons.

### 4.12 Message Input (Textarea)

The message input is an auto-growing textarea for composing chat messages.

**Behavior:**
- **Auto-grow:** Height adjusts automatically from 40px minimum to 200px maximum based on content
- **Overflow:** Enables vertical scrolling when content exceeds 200px
- **Keyboard:** Enter sends on mobile, Shift+Enter creates newline on all devices
- **Placeholder:** Dynamic text based on model selection state

**Placeholder Logic:**
- When models selected: "Type a message..."
- When no models selected: "Select models to start chatting..."

---

## 5. Responsiveness

The ChatControlBox implements a mobile-first responsive design with a primary breakpoint at 768px. The component uses the `useResponsive()` hook to detect the current viewport category and conditionally renders layout variations.

### 5.1 Breakpoint Definition

| Viewport | Width | Classification |
|----------|-------|----------------|
| Mobile | < 768px | `isMobile: true` |
| Desktop | ≥ 768px | `isMobile: false` |

### 5.2 Mobile Layout (< 768px)

On mobile devices, the component optimizes for touch interaction and limited screen width.

**Toolbar Row:**
- All seven elements remain visible
- Horizontal spacing reduced (`gap-1` between icons)
- Touch targets maintained at minimum 32×32px

**Input Row:**
- Full-width input field with generous horizontal padding
- **Left side (inside input):** Paperclip icon, Connectors icon
- **Right side (inside input):** Microphone icon, Send arrow
- Send button sized at 28×28px (h-7 w-7)
- Input padding: `pl-10 pr-12` to accommodate internal icons

**Keyboard Behavior:**
- Enter key sends message (no Shift required)
- Optimized for on-screen keyboard interaction

![Mobile Layout Diagram](./images/chatcontrolbox-mobile.png)

### 5.3 Desktop Layout (≥ 768px)

On desktop devices, the component expands to utilize available horizontal space.

**Toolbar Row:**
- All seven elements with increased spacing (`gap-2`)
- Hover states more prominent

**Input Row:**
- **Outside input (left):** Paperclip button in circular container (40×40px, `bg-zinc-700`)
- **Inside input (right):** Microphone icon, Connectors icon
- **Outside input (right):** Send button (40×40px)
- Input padding: `pl-3 pr-16`

**Keyboard Behavior:**
- Enter key does not send (allows multi-line input)
- Shift+Enter creates newline
- Click on Send button required to submit

![Desktop Layout Diagram](./images/chatcontrolbox-desktop.png)

### 5.4 Responsive Implementation

The responsiveness is achieved through conditional rendering based on the `isMobile` boolean from the `useResponsive()` hook:

```tsx
const { isMobile } = useResponsive();

// Conditional icon positioning
{isMobile && (
  <div className="absolute left-2 bottom-2">
    {/* Paperclip and Connectors inside input */}
  </div>
)}

{!isMobile && (
  <button className="shrink-0 h-10 w-10">
    {/* Paperclip outside input */}
  </button>
)}

// Conditional Send button placement
{isMobile && (
  <button className="h-7 w-7">
    <ArrowUp className="h-4 w-4" strokeWidth={2.125} />
  </button>
)}

{!isMobile && (
  <button className="shrink-0 h-10 w-10">
    <ArrowUp className="h-5 w-5" strokeWidth={2.125} />
  </button>
)}
```

### 5.5 Touch Optimization

Mobile touch interactions are optimized through:

1. **Minimum touch targets:** All interactive elements maintain 28×28px minimum size
2. **Touch feedback:** Visual state changes on touch start
3. **Gesture support:** Native scrolling within textarea when content overflows
4. **Keyboard handling:** Enter-to-send reduces tap count for message submission

---

## 6. Full Component Code

The complete ChatControlBox component implementation is available in the project repository at:

```
client/src/components/ChatControlBox/ChatControlBox.tsx
```

### 6.1 File Structure

```
client/src/components/ChatControlBox/
├── ChatControlBox.tsx    # Main component (1066 lines)
├── index.ts              # Export barrel
└── __tests__/
    └── ChatControlBox.test.tsx  # Unit tests (22 passing)
```

### 6.2 Dependencies

| Package | Purpose |
|---------|---------|
| `react` | Core React hooks (useState, useRef, useEffect, useCallback) |
| `lucide-react` | Icon components (Menu, Plus, Settings, Save, etc.) |
| `sonner` | Toast notifications |
| `@/hooks/useResponsive` | Responsive breakpoint detection |
| `@/lib/z-index` | Z-index constants for layering |
| `@/contexts/ThemeContext` | Theme management |

### 6.3 Type Definitions

```typescript
export interface Attachment {
  name: string;
  type: string;
  size: number;
  file: File;
}

export interface Message {
  id: number | string;
  type: 'user' | 'ai' | 'synthesis' | 'typing';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
  rating?: number | null;
  confidence?: number;
  responseTime?: number;
  visible?: boolean;
  sources?: number;
  attachments?: Attachment[];
}

export interface ChatControlBoxProps {
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  conversationTitle?: string;
  onTitleChange?: (title: string) => void;
  isLoading?: boolean;
  hideConnectors?: boolean;
  hideSynthesizer?: boolean;
  hideVoiceInput?: boolean;
  placeholder?: string;
  onNewChat?: () => void;
  onSynthesize?: () => void;
  onThemesSettings?: () => void;
  template?: ChatWindowTemplate;
}
```

### 6.4 Usage Example

```tsx
import { ChatControlBox } from '@/components/ChatControlBox';

function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const handleSendMessage = (text: string, attachments: Attachment[]) => {
    const newMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      attachments
    };
    setMessages(prev => [...prev, newMessage]);
    // Trigger AI response...
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Message list */}
      </div>
      <ChatControlBox
        messages={messages}
        onMessagesChange={setMessages}
        selectedModels={selectedModels}
        onModelsChange={setSelectedModels}
        onSendMessage={handleSendMessage}
        onNewChat={() => setMessages([])}
        onSynthesize={() => console.log('Synthesize')}
      />
    </div>
  );
}
```

---

## Appendix: Image Assets

The following images are included in this documentation:

| File | Description |
|------|-------------|
| `chatcontrolbox-overview.png` | Component overview with annotations |
| `chatcontrolbox-labeled.webp` | Labeled diagram showing all icons and their functions |
| `chatcontrolbox-desktop.png` | Desktop layout mockup with dimensions |
| `chatcontrolbox-mobile.png` | Mobile layout mockup with row labels |

---

*This documentation was generated by Manus AI for the Multi-AI Chat Interface project.*
