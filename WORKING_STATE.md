# Working State Documentation

**Last Verified Working:** January 3, 2026

## Current Working Configuration

### Site Functionality ✅
All features are working correctly:
- ✅ Orange/yellow name button with dropdown menu
- ✅ Category buttons expand to show projects
- ✅ Project selection displays images
- ✅ Image navigation (click left/right, swipe on mobile)
- ✅ Resume overlay displays correctly
- ✅ All styling matches original design

### Critical Files (DO NOT MODIFY WITHOUT BACKUP)

#### `/app/page.tsx`
- Main portfolio page component
- React state management for categories, projects, dropdown, resume
- Event handlers for toggleCategory, handleProjectClick, navigateImage
- **Key point:** Uses `'use client'` directive at top

#### `/app/page.module.css`
- Complete styling for the portfolio
- **Critical styles:**
  - `.name` - Orange background (#FFAF00) with white text for "Kendall Wood" button
  - `.profileSection` - Has `border-bottom: 1px solid black` for line under profile
  - All buttons use `font-family: 'Times New Roman', serif` and `font-size: 12px`
  - No bubble styling on category/project buttons (background: none)

#### `/data/projects.ts`
- Portfolio content data structure
- Categories: Print, UX/UI, Digital, Product, Video
- Project order and image paths

### Design Specifications

**Typography:**
- Primary font: Times New Roman, serif
- Font size: 12px throughout
- Blue links: rgb(0, 0, 255)
- Orange accent: #FFAF00

**Layout:**
- Mobile-first design: 393px width
- Clean, minimal interface
- Black borders for separation

**Interactive Elements:**
- Name button: Orange background (#FFAF00), white text
- Category buttons: Blue, underlined, expand inline to show projects
- Project buttons: Black text, turn orange + italic on hover/selection
- Dropdown menu: White background, black border, appears below name

### Dev Server Commands

**Start dev server:**
```bash
cd /Users/parsons/Desktop/byme/business-card
npm run dev
```

**Clear cache and restart (if buttons stop working):**
```bash
pkill -f "next dev"
rm -rf .next
npm run dev
```

**Access:**
- Local: http://localhost:3000
- Network: http://192.168.1.86:3000 (for mobile testing)
- QR Code page: http://localhost:3000/qr

### Git Repository

**Remote:** https://github.com/kendall-wood/business-card-portfolio.git

**Working commits:**
- `2cd37a8` - Initial commit with fully working portfolio site
- Use this commit as restore point if needed: `git checkout 2cd37a8 -- app/page.module.css app/page.tsx data/projects.ts`

### Troubleshooting

**If buttons stop working:**
1. Kill all dev servers: `pkill -f "next dev"`
2. Clear Next.js cache: `rm -rf .next`
3. Restart dev server: `npm run dev`
4. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

**If styling breaks:**
1. Check git diff: `git diff app/page.module.css`
2. Restore from working commit: `git checkout 2cd37a8 -- app/page.module.css`
3. Verify `.name` class has orange background and white text
4. Verify `.profileSection` has border-bottom

**If projects don't display:**
1. Check browser console for errors
2. Verify `/data/projects.ts` is properly formatted
3. Check image paths in `/public/images/` directory

### Additional Pages

**QR Code Page** (`/app/qr/page.tsx`)
- Generates QR code for mobile access
- Points to local network IP: 192.168.1.86:3000
- Black background with centered QR code

### Package Dependencies

**Core dependencies:**
- next: ^14.2.5
- react: ^18.3.1
- react-dom: ^18.3.1
- qrcode.react: ^4.2.0

**Dev dependencies:**
- @types/node: ^20
- @types/react: ^18
- typescript: ^5

### Notes for Future Development

1. **Before making changes:** 
   - Commit current working state
   - Create a backup branch
   - Test changes incrementally

2. **When adding new features:**
   - Maintain Times New Roman typography
   - Keep 12px font size consistency
   - Test button interactions after changes
   - Clear `.next` cache if behavior seems off

3. **Git LFS is configured for:**
   - Large image files (*.png, *.jpg, *.jpeg, *.gif, *.mp4, *.mov)
   - PDF files (*.pdf)

4. **DO NOT:**
   - Remove `'use client'` directive from page.tsx
   - Change state management structure
   - Modify core styling without testing
   - Skip clearing cache when restoring files

