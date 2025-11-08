# Twitter/X Banner Generator - Design Guidelines

## Design Approach

**Selected System:** Linear/Figma-inspired productivity tool aesthetic
- Clean, functional interface prioritizing usability
- Minimal visual noise to keep focus on the canvas
- Professional tool feel with precise controls

## Layout System

**Primary Structure:**
- Split-screen layout: Fixed sidebar (320px-360px width) + flexible canvas area
- Sidebar: Scrollable panel with collapsible sections for controls
- Canvas area: Centered preview with 1500x500px banner at appropriate scale, dark neutral background (#1a1a1a) to highlight the banner
- Top bar: Logo/title, GitHub connection status, download button

**Spacing Primitives:**
Use Tailwind units: 2, 3, 4, 6, 8 for consistent rhythm
- Section padding: p-4 to p-6
- Element spacing: gap-4, space-y-3
- Input groups: space-y-2

## Typography

**Font Stack:**
- Primary: Inter (via Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight

**Hierarchy:**
- Sidebar section titles: text-sm font-semibold uppercase tracking-wide
- Control labels: text-sm font-medium
- Input text: text-sm
- Button text: text-sm font-medium
- Canvas helper text: text-xs

## Component Library

**Sidebar Controls:**
1. **Collapsible Sections** (Background, Text, Icons, GitHub, Export)
   - Click header to expand/collapse
   - Icon indicator for state
   - Smooth transitions

2. **Background Controls:**
   - Solid/Gradient toggle (segmented control)
   - Color picker with hex input
   - Preset gradient chips (grid layout, 4 columns)
   - Custom gradient builder with multiple stops

3. **Text Editor:**
   - Heading/Paragraph type selector
   - Font dropdown (searchable, popular fonts first)
   - Size slider with number input
   - Weight selector (grid of weight options)
   - Color picker
   - Alignment buttons (left/center/right)
   - Position handles (visual x/y inputs)

4. **Icon/Image Controls:**
   - Upload button (prominent, dashed border area)
   - Icon library grid (6x6 grid with search)
   - Active element controls (size, rotation sliders)

5. **GitHub Section:**
   - Connection status indicator
   - "Connect GitHub" primary button (if not connected)
   - "Sync Contributions" secondary button (if connected)
   - Heatmap visibility toggle
   - Opacity slider for heatmap layer

6. **Export Section:**
   - Safe zone toggle switch
   - Download PNG button (primary, full-width)
   - Dimension display: "1500 × 500 px"

**Canvas Area:**
- Banner preview with scale indicator
- Safe zone overlay (semi-transparent guides when toggled)
- Layer panel (minimal, bottom-right corner)
- Zoom controls (bottom-left corner)

**Buttons:**
- Primary: Medium emphasis, rounded corners (rounded-md)
- Secondary: Outlined or ghost style
- Icon buttons: Square, consistent sizing (h-8 w-8)

**Form Inputs:**
- Consistent height (h-9 to h-10)
- Rounded corners (rounded-md)
- Clear focus states
- Labels above inputs

## Navigation & State Management

**Connection Flow:**
- Disconnected state: Prominent "Connect GitHub" call-to-action in GitHub section
- Connected state: User avatar, username, "Disconnect" option
- Loading states: Skeleton loaders for heatmap fetch

**Canvas Interactions:**
- Direct manipulation: Click elements to select, drag to move
- Selection indicators: Bounding box with resize handles
- Delete: Delete key or trash icon
- Undo/Redo: Keyboard shortcuts (Ctrl+Z/Ctrl+Y)

## Responsive Behavior

**Desktop (1280px+):** Full split-screen layout
**Tablet (768px-1279px):** Collapsible sidebar (hamburger toggle), canvas takes priority
**Mobile (<768px):** Stack layout, tabs for Controls/Preview switching

## Accessibility

- All form inputs have visible labels
- Color pickers include hex input fields
- Keyboard navigation support for canvas elements
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons

## Visual Polish

**Minimal Animations:**
- Sidebar collapse/expand: 200ms ease
- Section expand: 150ms ease
- Color picker transitions: 100ms
- No auto-playing or decorative animations

**Key Visual Details:**
- Subtle shadows on canvas for depth (shadow-lg)
- Clean borders between sections (border-neutral-200/10)
- Icon consistency (20px standard size)
- Proper visual hierarchy with whitespace

This design prioritizes efficiency and clarity, making banner creation intuitive while keeping advanced controls accessible. The interface feels professional and tool-like, not promotional.