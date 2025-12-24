# ChatControlBox Redesign Notes

## Current Implementation (Redesigned)

The ChatControlBox has been redesigned with the following features:

### Container
- Dark gray background: `bg-zinc-800`
- Rounded corners: `rounded-2xl`
- Subtle border: `border border-zinc-700/50`
- Margin: `mx-2 mb-2`

### Control Buttons Row (Top)
- Hamburger menu icon (Menu)
- Plus button (New Chat)
- **Blue pill button** for Models: `bg-blue-500 hover:bg-blue-400 text-white rounded-full`
- AI Bot icon (Synthesizer) - blue when active
- Settings gear icon
- Floppy disk save icon
- **Gray pill button** for Presets: `bg-zinc-600 hover:bg-zinc-500 rounded-full`

### Input Row (Bottom)
- Light gray background: `bg-zinc-200`
- Rounded pill shape: `rounded-full`
- Paperclip icon (attach files)
- Plug icon (connectors)
- Text input with dark text: `text-zinc-800`
- Microphone icon (voice input)

### Key Design Elements
1. **No horizontal separator** between rows
2. **Tight vertical spacing**: `space-y-2`
3. **Ultra-compact icons**: `h-5 w-5` for buttons, `h-4 w-4` for input icons
4. **High contrast**: Light input bar against dark container

## Comparison to Reference Design
- ✅ Dark gray container background
- ✅ Blue solid pill button for Models
- ✅ Light/white input bar
- ✅ Rounded pill shape for input
- ✅ Gear icon for settings
- ✅ Floppy disk for save
- ✅ Bot/AI icon for synthesis
- ✅ Presets button with lighter background
