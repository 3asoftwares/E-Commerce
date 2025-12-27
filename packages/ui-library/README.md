# UI Library

Shared React component library for the e-commerce platform.

## Purpose

Provides a consistent design system and reusable components across all micro-frontend applications.

## Components

### Layout Components

- Container: Responsive container
- Grid: Responsive grid system
- Stack: Flexbox stack layout
- Divider: Visual separator

### Form Components

- Button: Button with variants
- Input: Text input field
- TextArea: Multi-line text input
- Select: Dropdown select
- Checkbox: Checkbox input
- Radio: Radio button
- Switch: Toggle switch
- Label: Form label
- FormField: Complete form field with label and error

### Data Display

- Card: Content container
- Badge: Status badge
- Tag: Label tag
- Avatar: User avatar
- Table: Data table
- List: List component
- Empty State: No data placeholder

### Feedback

- Alert: Alert messages
- Toast/Notification: Toast notifications
- Spinner/Loader: Loading indicators
- Progress Bar: Progress indicator
- Skeleton: Loading skeleton

### Navigation

- Tabs: Tab navigation
- Breadcrumb: Breadcrumb navigation
- Pagination: Pagination controls
- Menu/Dropdown: Dropdown menu

### Overlay

- Modal/Dialog: Modal dialog
- Drawer: Side drawer
- Tooltip: Tooltip
- Popover: Popover

### Typography

- Heading: Heading components (h1-h6)
- Text: Text component
- Link: Link component

## Theming

- Color system (primary, secondary, etc.)
- Typography scale
- Spacing system
- Breakpoints
- Shadows and elevation
- Border radius

## Usage

All apps import components from this package:

```
import { Button, Card, Input } from '@e-commerce/ui-library';
```

## Development

Use Storybook for component development and documentation.
