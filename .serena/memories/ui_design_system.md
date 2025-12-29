# UI Design System

## Design Philosophy
Modern, stylish, and professional interface with glass morphism effects and smooth animations.

## Color Palette

### Dark Theme (Primary)
- **Background**: Gradient from slate-950 via blue-950 to slate-900
- **Foreground**: White (#FFFFFF)
- **Primary**: Blue-500 to Blue-600 (oklch based)
- **Accent**: Purple/Green accents
- **Card Background**: White with 5% opacity + backdrop blur
- **Borders**: White with 10% opacity

### Semantic Colors
- **Success**: Green-500
- **Error**: Red-400/Red-500
- **Warning**: Orange-400/Orange-500
- **Info**: Blue-400

## Typography
- **Primary Font**: Geist Sans (variable font)
- **Monospace Font**: Geist Mono (variable font)
- **Heading Sizes**: 
  - H1: 5xl-7xl (responsive)
  - H2: 2xl
  - H3: xl
- **Body**: Base size with gray-300/gray-400 for secondary text

## Layout Components

### Glass Cards
- Background: `rgba(255, 255, 255, 0.05)`
- Backdrop filter: `blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Border radius: 1rem to 1.5rem
- Hover effects: Increased opacity and scale

### Buttons
- **Primary**: Blue-500 to Blue-600 gradient
- **Hover**: Blue-600 to Blue-700 gradient
- **Disabled**: Gray-600 to Gray-700
- **Effects**: 
  - Scale on hover (105%)
  - Shadow glow (blue-500/50)
  - Smooth transitions (300ms)

### Input Fields
- Background: White with 5% opacity
- Border: White with 10% opacity
- Focus: Blue-500 border with ring
- Placeholder: Gray-500
- Padding: 1rem (py-4, px-4)

## Animations

### Custom Keyframes
1. **Shimmer**: Background position animation for loading states
2. **Float**: Vertical translation for floating elements (6s ease-in-out)
3. **Glow**: Opacity pulse for attention-grabbing elements (2s)

### Transition Classes
- **Duration**: 300ms standard
- **Timing**: ease-in-out
- **Hover Scale**: 105% for cards, 110% for icons
- **Active Scale**: 95% for buttons

## Icons
- **Library**: lucide-react
- **Sizes**: 
  - Small: w-4 h-4
  - Medium: w-5 h-5
  - Large: w-6 h-6
  - Extra Large: w-8 h-8
- **Colors**: Context-dependent (blue-400, gray-400, etc.)

## Spacing System
- **Container Max Width**: 7xl (1280px)
- **Section Spacing**: 
  - mb-16 for major sections
  - space-y-6 for card groups
  - gap-4 to gap-6 for grids
- **Card Padding**: p-6 to p-8

## Responsive Breakpoints
- **Mobile**: Base (< 640px)
- **Tablet**: sm: (640px+), md: (768px+)
- **Desktop**: lg: (1024px+), xl: (1280px+)

## Background Effects
- **Animated Gradients**: Multiple floating orbs with blur
- **Grid Pattern**: SVG overlay with 20% opacity
- **Depth**: Layered z-index (background, content, modals)

## Best Practices
1. Always use glass class for card-like components
2. Maintain consistent border-radius (rounded-xl or rounded-2xl)
3. Use group hover states for interactive cards
4. Apply smooth transitions to all interactive elements
5. Keep hover states subtle but noticeable
6. Use backdrop-blur-xl for glass morphism
7. Maintain color consistency across similar components
