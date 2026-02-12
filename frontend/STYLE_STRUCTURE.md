# Frontend Style Structure

## Overview
The styles have been reorganized into page-specific CSS files for better maintainability and clarity. Each page now has its own dedicated stylesheet.

## File Structure

```
CSIC/frontend/src/
├── index.css                          # Global styles, utilities, and base components
├── styles/
│   ├── variables.css                  # CSS variables and theme colors
│   ├── login.css                      # Login page styles
│   └── signup.css                     # Signup page styles
├── pages/
│   ├── Landing.css                    # Landing page (Navbar + Hero)
│   ├── Login.jsx                      # Uses styles/login.css
│   ├── Signup.jsx                     # Uses styles/signup.css
│   ├── UserDashboard.css              # User dashboard desktop styles
│   ├── UserDashboard.mobile.css       # User dashboard mobile styles
│   ├── UserDashboard.jsx              # Uses both UserDashboard.css files
│   ├── BusinessPortal.css             # Business portal styles (existing)
│   ├── BusinessPortal.jsx             # Uses BusinessPortal.css
│   ├── BusinessVerifier.css           # Business verifier page styles
│   ├── BusinessVerifier.jsx           # Uses BusinessVerifier.css
│   ├── LiveDemo.css                   # Live demo split view styles
│   └── LiveDemo.jsx                   # Uses LiveDemo.css
```

## What Was Changed

### Deleted Files (Unused/Consolidated)
- ❌ `src/App.css` - Empty file, removed
- ❌ `src/auth.css` - Consolidated into login.css and signup.css
- ❌ `src/styles/common.css` - Moved to index.css
- ❌ `src/styles/components.css` - Moved to page-specific files
- ❌ `src/styles/desktop.css` - Moved to UserDashboard.css
- ❌ `src/styles/mobile.css` - Moved to UserDashboard.mobile.css

### New Files Created
- ✅ `pages/Landing.css` - Navbar and Hero component styles
- ✅ `pages/UserDashboard.css` - Desktop dashboard styles
- ✅ `pages/UserDashboard.mobile.css` - Mobile dashboard styles
- ✅ `pages/BusinessVerifier.css` - Business verifier page styles
- ✅ `pages/LiveDemo.css` - Live demo split view styles

### Updated Files
- ✅ `index.css` - Cleaned up, now contains only global styles and utilities
- ✅ `styles/variables.css` - Kept as is (shared variables)
- ✅ `styles/login.css` - Kept as is
- ✅ `styles/signup.css` - Kept as is
- ✅ `pages/BusinessPortal.css` - Kept as is (already page-specific)

## Import Structure

### Landing Page
```jsx
import './Landing.css';
```

### Login Page
```jsx
import '../styles/login.css';
```

### Signup Page
```jsx
import '../styles/signup.css';
```

### User Dashboard
```jsx
import './UserDashboard.css';
import './UserDashboard.mobile.css';
```

### Business Portal
```jsx
import './BusinessPortal.css';
```

### Business Verifier
```jsx
import './BusinessVerifier.css';
```

### Live Demo
```jsx
import './LiveDemo.css';
```

## Benefits

1. **Better Organization**: Each page has its own dedicated stylesheet
2. **Easier Maintenance**: Changes to one page won't affect others
3. **Reduced Complexity**: No more hunting through multiple shared files
4. **Clearer Dependencies**: Each component explicitly imports what it needs
5. **Smaller Bundle Size**: Only load styles needed for each page
6. **No Duplication**: Removed redundant and unused styles

## Global Styles (index.css)

The `index.css` file now contains only:
- CSS reset and base styles
- Typography
- Common button styles
- Input/form styles
- Card styles
- Badge styles
- Utility classes (flex, spacing, etc.)
- Loading states
- Print styles
- Accessibility features

## Variables (styles/variables.css)

Shared CSS variables remain in `styles/variables.css`:
- Color palette
- Dashboard theme colors
- Spacing scale
- Typography scale
- Border radius values
- Shadow definitions
- Z-index scale
- Animation timings

## Notes

- All inline styles have been removed from components
- Components now use CSS classes instead of inline styles
- Mobile and desktop styles are properly separated
- Responsive breakpoints are consistent across all pages
- All styles follow the same naming conventions
