# Kendall Wood - Portfolio

A mobile portfolio website built with Next.js.

## Features

- Mobile-first design (393px × 852px viewport)
- Expandable/collapsible category navigation
- Project selection with image carousel
- Swipe and click navigation for project images
- Live time display
- Name dropdown menu with external links

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app directory with pages and styles
- `/data` - Portfolio data structure
- `/public` - Static assets (images)

## Adding Project Images

1. Add your project images to `/public`
2. Update the `src` field in `/data/projects.ts` to point to your images
3. Each project can have multiple images - they'll be displayed in a carousel

## Deployment

This project can be easily deployed to:
- Vercel (recommended for Next.js)
- GitHub Pages
- Any static hosting service

Build for production:
```bash
npm run build
```




