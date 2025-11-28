# CSS Templates

## Purpose

This directory contains CSS templates for custom styles beyond Tailwind CSS.

## Contents

**`custom-template.css`** - Custom styles and overrides

## What's Included

### CSS Variables
- Color scheme (light/dark mode)
- Spacing scale
- Typography scale
- Border radius
- Shadows

### Dark Mode
- Automatic via `prefers-color-scheme`
- Manual toggle support
- Smooth transitions

### Custom Components
- Loading spinners
- Toast notifications
- Modal dialogs
- Progress bars

### Animations
- Fade in/out
- Slide in/out
- Pulse
- Spin

### Print Styles
- Clean print layout
- Hide interactive elements
- Optimize for paper

## Usage

The custom CSS is loaded after Tailwind CSS:

```html
<link href="https://cdn.tailwindcss.com" rel="stylesheet">
<link href="css/custom.css" rel="stylesheet">
```

## Dark Mode

Dark mode is implemented using CSS variables:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --text-primary: #ffffff;
  }
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}
```

## Customization

To customize styles:

1. Edit CSS variables in `:root`
2. Add custom component styles
3. Override Tailwind utilities if needed
4. Test in light and dark mode

## Best Practices

### Do's ✅
- Use CSS variables for theming
- Support dark mode
- Keep specificity low
- Use semantic class names
- Optimize for performance

### Don'ts ❌
- Don't override Tailwind unnecessarily
- Don't use `!important` excessively
- Don't hardcode colors
- Don't forget print styles
- Don't ignore accessibility

## Related Documentation

- **Web App Templates**: `../../README.md`
- **Quality Standards**: `../../../../05-QUALITY-STANDARDS.md`

