# Shell App - Central Launcher

**Technology:** React + Webpack  
**Port:** 3000

## Purpose

The shell app serves as the central launcher and dashboard for the entire e-commerce platform. It provides a unified entry point to navigate to all other applications.

## Responsibilities

- Display application cards for Admin, Seller, and Storefront apps
- Provide navigation via direct links or embedded iframes
- Show application status (running/stopped)
- Central authentication entry point
- Unified branding and navigation

## Navigation Methods

### Option 1: Direct Links (Recommended)

Opens each app in a new tab/window. Better performance and user experience.

```typescript
<a href="http://localhost:3001" target="_blank">
  Open Admin Dashboard
</a>
```

### Option 2: Embedded Iframes

Keeps user within shell app. Use when unified experience is required.

```typescript
<iframe src="http://localhost:3001" title="Admin Dashboard" width="100%" height="800px" />
```

## Structure

```
shell-app/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── AppCard.tsx      # Card component for each app
│   │   ├── AppLauncher.tsx  # Grid of app cards
│   │   └── Navbar.tsx       # Top navigation
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── webpack.config.js        # Webpack configuration
├── .babelrc                 # Babel configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Running

```bash
# Development
npm run dev

# Build
npm run build

# Start dev server
npm start
```

## Port

- Development: http://localhost:3000
- Production: Configurable via environment variables
