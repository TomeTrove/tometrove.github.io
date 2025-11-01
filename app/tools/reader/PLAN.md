# Tome Reader v2 - Detailed Implementation Plan

## Executive Summary

A unified, content-type-aware reader that normalizes all tome types (comics, EPUB, audiobooks) into a standardized rendering pipeline. All content renders to images, displayed via a universal image viewer with intelligent sidebar navigation and responsive layouts.

## Core Architecture Philosophy

**Instead of**: Trying to handle each content type separately with different rendering logic
**We do**: Normalize all content to images, then use a single image viewer with type-aware configuration

```
Comics (ZIP + images)
       ↓
    Renderer → Image Array → Image Viewer
       ↑
EPUB (ZIP + XHTML) → html2canvas → Rendered Images
       ↑
Audiobook (ZIP + audio + JSON) → Canvas UI → Rendered Images
```

---

## Part 1: Layout System

### 1.1 Desktop Layout

```
┌─────────────────────────────────────────────────┐
│ Header (Title, Mobile Menu Toggle)              │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  Sidebar     │  Main Content Area               │
│              │                                  │
│ - TOC        │  (Images Container)              │
│ - Chapters   │                                  │
│ - Pages      │  - Scrollable                    │
│              │  - Max width: 900px              │
│ - Search     │  - Responsive                    │
│ (future)     │                                  │
│              │  Navigation (Next/Prev)          │
│              │  (floating or in sidebar)        │
└──────────────┴──────────────────────────────────┘
```

### 1.2 Mobile Layout

```
┌──────────────────────────────────┐
│ Header (Title, Menu Toggle ☰)    │
├──────────────────────────────────┤
│                                  │
│  Main Content Area               │
│  (Images Container - Full Width) │
│                                  │
│  - Vertical stacking (comics)    │
│  - Scrollable (EPUB)             │
│                                  │
├──────────────────────────────────┤
│ Navigation (Prev/Next buttons)   │
│ Page indicator                   │
└──────────────────────────────────┘

[Hamburger Menu] Opens Modal:
┌──────────────────────────┐
│ Table of Contents        │
├──────────────────────────┤
│ ► Series Name            │
│   ► Volume 1             │
│     • Chapter 1          │
│     • Chapter 2          │
│   ► Volume 2             │
│ ► About                  │
│ ► Download               │
└──────────────────────────┘
```

### 1.3 Responsive Behavior

| Breakpoint | Sidebar | Menu | Content Width |
|------------|---------|------|---------------|
| < 768px | Hidden | Hamburger | 100% |
| 768-1024px | Visible (collapsible) | Toggle button | 100% - sidebar |
| > 1024px | Visible | Always | Min 900px, max 100% - sidebar |

### 1.4 Content Width Rules

- **Vertical Layout (Comics)**:
  - Mobile: Full viewport width
  - Desktop: Max 900px, centered
  - Images scale to fill width, maintain aspect ratio

- **Horizontal Layout (EPUB/Text)**:
  - Mobile: Full viewport width
  - Desktop: Max 900px, centered
  - Single page visible, height scrollable
  - Reading direction: LTR/RTL respected

---

## Part 2: Content Rendering Pipeline

### 2.1 Unified Rendering Concept

**Key Insight**: Every content type produces the same output—an array of images to display.

```typescript
interface RenderedPage {
  image: HTMLImageElement | Blob | string  // Can be Image object, Blob, or data URL
  width: number
  height: number
  index: number
  metadata?: {
    chapterTitle?: string
    chapterNumber?: number
    pageLabel?: string
    bookmarkable?: boolean
  }
}

interface ContentRenderer {
  renderAllPages(): Promise<RenderedPage[]>
  getMetadata(): TomeMetadata
  getTOC(): TOCEntry[]
  getReadingDirection(): 'ltr' | 'rtl'
  getLayoutDirection(): 'vertical' | 'horizontal'
}
```

### 2.2 Comic Renderer

**Input**: ZIP with images + tome.json + metadata files

**Process**:
1. Read tome.json
2. Extract page list from chapters.json or image directory
3. Sort images by filename/page number
4. Create RenderedPage for each image (path only, lazy load)
5. Extract TOC from volumes/chapters metadata

**Output**:
- `RenderedPage[]` with image paths
- `TOCEntry[]` from tome structure
- `layoutDirection`: vertical or horizontal (from metadata)

**Special Handling**:
- Pages can be lazy-loaded (don't render until visible)
- Images already optimized
- Metadata from JSON files becomes page metadata

### 2.3 EPUB Renderer

**Input**: ZIP with XHTML + OPF + CSS

**Process**:
1. Extract OPF metadata (title, author, cover, etc.)
2. Parse EPUB spine for reading order
3. For each XHTML file in spine:
   - Extract `<body>` content
   - Inject EPUB CSS (or default stylesheet)
   - Create temporary DOM element with content + styles
   - Render to canvas using html2canvas
   - Determine page height (continuous or chunked)
   - Convert canvas to image/blob
   - Store as RenderedPage
4. Extract or generate TOC from EPUB spine
5. Extract reading direction from OPF metadata

**Output**:
- `RenderedPage[]` with rendered canvas images
- `TOCEntry[]` from EPUB spine/TOC
- `layoutDirection`: horizontal (always)
- Cover image in metadata

**Considerations**:
- EPUB can have multiple chapters per HTML file
- May need to chunk large HTML files into multiple pages
- CSS cascading can be complex—use html2canvas carefully
- Some fonts may not render (use system fallbacks)

### 2.4 Audiobook Renderer

**Input**: ZIP with audio files + tome.json with chapter metadata + cover image

**Process**:
1. Load audio metadata from JSON
2. Load cover image
3. For each chapter/timestamp section:
   - Create canvas (900px width, aspect ratio)
   - Draw cover image (background, 50% opacity)
   - Draw chapter title (large, centered)
   - Draw current time range
   - Draw "Now Playing" indicator
   - Draw chapter duration
   - Convert canvas to image
   - Store as RenderedPage
4. Create timeline/bookmarks at chapter boundaries
5. Return audio file reference

**Output**:
- `RenderedPage[]` with rendered UI images (one per chapter)
- Audio blob/file reference
- Chapter timeline with timestamps
- TOC from chapters metadata
- `layoutDirection`: horizontal

**Special Handling**:
- Don't actually render 1 image per second—render per chapter
- Audio file stays in memory (separate from image array)
- Timeline used for chapter jumping, not page scrolling

---

## Part 3: Component Architecture

### 3.1 Main Reader Component

```
ReaderPage (page.tsx)
├─ Load tome from storage
├─ Create renderer from metadata
├─ Render all pages
└─ Pass to ReaderLayout

ReaderLayout
├─ Header
│  ├─ Title
│  ├─ Menu toggle (mobile)
│  └─ Settings (future)
├─ Main Container
│  ├─ Sidebar (TOC Navigation)
│  │  └─ Collapsible on mobile
│  └─ ContentArea
│     ├─ ImageContainer (images in vertical/horizontal layout)
│     └─ NavigationControls (prev/next, page input)
└─ MobileMenu (modal overlay on mobile)
```

### 3.2 Component: ReaderLayout

**Props**:
```typescript
interface ReaderLayoutProps {
  tomeTitle: string
  renderedPages: RenderedPage[]
  currentPageIndex: number
  onPageChange: (index: number) => void
  toc: TOCEntry[]
  readingDirection: 'ltr' | 'rtl'
  layoutDirection: 'vertical' | 'horizontal'
}
```

**Responsibilities**:
- Manage layout state (sidebar open/closed)
- Route props to child components
- Handle responsive breakpoints
- Manage keyboard shortcuts

### 3.3 Component: Sidebar / TOC Navigation

**Props**:
```typescript
interface SidebarProps {
  toc: TOCEntry[]
  currentPageIndex: number
  onNavigate: (pageIndex: number) => void
  open: boolean
  onToggle: () => void
}
```

**Features**:
- Hierarchical display (series → volumes → chapters → pages)
- Current location highlighted
- Click to jump
- Expandable/collapsible sections
- Search (future)

### 3.4 Component: ImageContainer

**Props**:
```typescript
interface ImageContainerProps {
  pages: RenderedPage[]
  currentPageIndex: number
  layoutDirection: 'vertical' | 'horizontal'
  onPageChange: (index: number) => void
}
```

**Vertical Layout**:
- Stack images end-to-end
- No gaps
- Scroll through all images as one continuous document
- Lazy load images as they approach viewport

**Horizontal Layout**:
- Show single page
- Fill container width, maintain aspect ratio
- Height scrollable if page taller than viewport
- Preload previous/next pages

### 3.5 Component: NavigationControls

**Props**:
```typescript
interface NavigationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (index: number) => void
  readingDirection: 'ltr' | 'rtl'
}
```

**Features**:
- Previous/Next buttons (direction-aware)
- Page input field
- Current / Total display
- Keyboard shortcut indicators (tooltip)

---

## Part 4: Renderer Factory & Type Handling

### 4.1 Factory Pattern

```typescript
class RendererFactory {
  static create(metadata: TomeMetadata, zip: JSZip): ContentRenderer {
    switch (metadata.type) {
      case 'comic_series':
      case 'comic_volume':
      case 'comic_chapter':
        return new ComicRenderer(metadata, zip);

      case 'epub':
        return new EpubRenderer(metadata, zip);

      case 'audio_book':
        return new AudiobookRenderer(metadata, zip);

      default:
        throw new Error(`Unsupported tome type: ${metadata.type}`);
    }
  }
}
```

### 4.2 Base Renderer Class

```typescript
abstract class BaseRenderer implements ContentRenderer {
  protected metadata: TomeMetadata;
  protected zip: JSZip;
  protected pages: RenderedPage[] = [];
  protected toc: TOCEntry[] = [];

  constructor(metadata: TomeMetadata, zip: JSZip) {
    this.metadata = metadata;
    this.zip = zip;
  }

  abstract renderAllPages(): Promise<RenderedPage[]>;
  abstract getTOC(): TOCEntry[];

  getMetadata(): TomeMetadata { return this.metadata; }
  getReadingDirection(): 'ltr' | 'rtl' {
    return this.metadata.layout_direction === 'rtl' ? 'rtl' : 'ltr';
  }

  abstract getLayoutDirection(): 'vertical' | 'horizontal';
}
```

### 4.3 Comic Renderer Implementation

```typescript
class ComicRenderer extends BaseRenderer {
  async renderAllPages(): Promise<RenderedPage[]> {
    // Extract image list from ZIP
    const images = this.zip.file(/.+\.(jpg|png|gif|webp|bmp)$/i);

    // Create RenderedPage for each image
    this.pages = images.map((file, index) => ({
      image: file.name,  // Store path, don't load yet
      width: 0,          // Will be determined on load
      height: 0,
      index,
      metadata: {
        pageLabel: `Page ${index + 1}`
      }
    }));

    return this.pages;
  }

  getTOC(): TOCEntry[] {
    // Extract from chapters.json in the ZIP
    const chaptersFile = this.zip.file('chapters.json');
    if (chaptersFile) {
      return JSON.parse(chaptersFile.asText());
    }
    return [];
  }

  getLayoutDirection(): 'vertical' | 'horizontal' {
    return this.metadata.layout_direction === 'horizontal' ? 'horizontal' : 'vertical';
  }
}
```

### 4.4 EPUB Renderer Implementation

```typescript
class EpubRenderer extends BaseRenderer {
  async renderAllPages(): Promise<RenderedPage[]> {
    // 1. Parse OPF
    const opf = await this.parseOPF();

    // 2. Get spine (reading order)
    const spine = opf.spine.itemref.map(ref => ref.idref);

    // 3. Render each XHTML file in spine
    for (const itemId of spine) {
      const item = opf.manifest[itemId];
      const xhtmlFile = this.zip.file(item.href);
      const html = await xhtmlFile.async('string');

      // Render HTML to canvas
      const canvas = await this.renderHtmlToCanvas(html);
      const image = canvas.toDataURL();

      this.pages.push({
        image,
        width: canvas.width,
        height: canvas.height,
        index: this.pages.length,
        metadata: {
          chapterTitle: item.title
        }
      });
    }

    return this.pages;
  }

  private async renderHtmlToCanvas(html: string): Promise<HTMLCanvasElement> {
    // Use html2canvas to render HTML to canvas
    // Handle CSS, fonts, etc.
    const element = document.createElement('div');
    element.innerHTML = html;
    element.style.width = '900px';
    element.style.padding = '20px';

    const canvas = await html2canvas(element, {
      width: 900,
      backgroundColor: '#ffffff'
    });

    return canvas;
  }

  getTOC(): TOCEntry[] {
    // Extract from EPUB TOC or generate from spine
    // Implementation varies by EPUB version
    return this.toc;
  }

  getLayoutDirection(): 'vertical' | 'horizontal' {
    return 'horizontal';  // EPUB always horizontal
  }
}
```

### 4.5 Audiobook Renderer Implementation

```typescript
class AudiobookRenderer extends BaseRenderer {
  private audioFile!: Blob;
  private chapters!: Chapter[];

  async renderAllPages(): Promise<RenderedPage[]> {
    // 1. Load audio file
    const audioPath = this.metadata.audio_file;
    this.audioFile = await this.zip.file(audioPath).async('blob');

    // 2. Load chapters metadata
    this.chapters = this.metadata.chapters || [];

    // 3. Render one "page" per chapter
    for (const chapter of this.chapters) {
      const canvas = await this.renderChapterPage(chapter);
      const image = canvas.toDataURL();

      this.pages.push({
        image,
        width: 900,
        height: 600,
        index: this.pages.length,
        metadata: {
          chapterTitle: chapter.title,
          duration: chapter.duration,
          timestamp: chapter.start_time
        }
      });
    }

    return this.pages;
  }

  private async renderChapterPage(chapter: Chapter): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // Draw background (cover image at 50% opacity)
    // Draw chapter title
    // Draw "Now Playing" indicator
    // Draw duration

    return canvas;
  }

  getTOC(): TOCEntry[] {
    return this.chapters.map((ch, idx) => ({
      id: `chapter-${idx}`,
      title: ch.title,
      pageIndex: idx
    }));
  }

  getLayoutDirection(): 'vertical' | 'horizontal' {
    return 'horizontal';  // Audiobook UI always horizontal
  }
}
```

---

## Part 5: Image Container & Display Logic

### 5.1 Vertical Layout (Comics)

**Rendering Strategy**:
```
All images stacked end-to-end in single container
Container height = sum of all image heights
Normal scrolling through document
```

**Implementation**:
```typescript
<div className="vertical-layout">
  {pages.map((page, idx) => (
    <img
      key={idx}
      src={getImageUrl(page)}
      style={{
        width: '100%',
        maxWidth: '900px',
        height: 'auto',
        display: 'block'
      }}
      loading="lazy"
    />
  ))}
</div>
```

**Performance**:
- Lazy load images as they approach viewport
- Unload images far from viewport to save memory
- Use IntersectionObserver to detect visibility

### 5.2 Horizontal Layout (EPUB)

**Rendering Strategy**:
```
Single page shown at a time
Page width fills container (max 900px)
Height scrollable if content taller than viewport
Navigate to next page via Next button or scroll end
```

**Implementation**:
```typescript
<div className="horizontal-layout" style={{ width: '900px', height: 'auto' }}>
  <img
    src={getImageUrl(pages[currentPageIndex])}
    style={{
      width: '100%',
      height: 'auto',
      display: 'block'
    }}
  />
</div>
```

**Performance**:
- Only render current page + next page
- Unload previous pages
- Preload next 2 pages

### 5.3 Lazy Loading Strategy

**For Vertical**:
```typescript
const visiblePages = new Set();
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      visiblePages.add(entry.target.dataset.index);
      loadImage(entry.target.dataset.index);
    } else {
      visiblePages.delete(entry.target.dataset.index);
      unloadImage(entry.target.dataset.index);
    }
  });
}, { rootMargin: '100px' });
```

**For Horizontal**:
```typescript
// Load current page + next 2 pages
loadImages([currentPageIndex, currentPageIndex + 1, currentPageIndex + 2]);
// Unload pages outside this range
```

---

## Part 6: State & Data Flow

### 6.1 Page-Level State

```typescript
interface ReaderState {
  // Loading
  isLoading: boolean;
  loadingProgress: number;

  // Content
  tomeZip: JSZip | null;
  tomeMetadata: TomeMetadata | null;
  renderer: ContentRenderer | null;

  // Rendering
  renderedPages: RenderedPage[];

  // Navigation
  currentPageIndex: number;

  // UI
  sidebarOpen: boolean;
  error: string | null;
}
```

### 6.2 Data Flow

```
User loads tome
  ↓
page.tsx loads ZIP + metadata
  ↓
RendererFactory creates appropriate renderer
  ↓
Renderer.renderAllPages() processes content
  ↓
RenderedPage[] returned
  ↓
ReaderLayout displays with appropriate layout
  ↓
ImageContainer renders images (lazy-loaded)
  ↓
Navigation controls allow page jumping
  ↓
Sidebar shows TOC, allows section jumping
```

### 6.3 Event Handlers

**Page Change**:
```typescript
const handlePageChange = (newIndex: number) => {
  setCurrentPageIndex(newIndex);
  // Scroll to position (for both layouts)
  // Preload adjacent pages
  // Update sidebar highlight
};
```

**Sidebar Navigation**:
```typescript
const handleTOCClick = (entry: TOCEntry) => {
  handlePageChange(entry.pageIndex);
  // Close sidebar on mobile
};
```

**Keyboard Navigation**:
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' && layoutDirection === 'horizontal') {
    handlePageChange(Math.min(currentPageIndex + 1, totalPages - 1));
  }
  if (e.key === 'ArrowLeft' && layoutDirection === 'horizontal') {
    handlePageChange(Math.max(currentPageIndex - 1, 0));
  }
};
```

---

## Part 7: Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-2)
- [ ] ReaderLayout component
- [ ] Sidebar / TOC Navigation
- [ ] ImageContainer (vertical + horizontal)
- [ ] NavigationControls
- [ ] Basic state management

### Phase 2: Rendering Pipeline (Weeks 2-3)
- [ ] ContentRenderer interface + BaseRenderer
- [ ] ComicRenderer implementation
- [ ] EpubRenderer (html2canvas integration)
- [ ] Audiobook Renderer (basic UI rendering)

### Phase 3: Integration & Polish (Week 3-4)
- [ ] Wire renderers to UI
- [ ] Lazy loading implementation
- [ ] Responsive design refinement
- [ ] Keyboard shortcuts
- [ ] Error handling

### Phase 4: Testing & Optimization (Week 4)
- [ ] Performance optimization
- [ ] Memory management
- [ ] Cross-browser testing
- [ ] Accessibility
- [ ] Documentation

### Phase 5: Future Enhancements
- [ ] Search (EPUB)
- [ ] Bookmarks & progress
- [ ] Font customization (EPUB)
- [ ] Audio playback controls (audiobook)
- [ ] Annotations

---

## Part 8: Technical Decisions

### 8.1 html2canvas for EPUB

**Decision**: Use html2canvas for EPUB rendering
**Rationale**:
- Handles CSS rendering well
- Works in browser (no server-side rendering needed)
- Already familiar technology
- Covers most EPUB styling

**Trade-offs**:
- Some complex CSS may not render perfectly
- Performance for very large EPUB files
- Font loading can be finicky

**Alternatives Considered**:
- Server-side rendering (Puppeteer): requires backend
- Pandoc conversion: requires backend
- Custom HTML parser: too much work, less reliable

### 8.2 Image-Based Rendering

**Decision**: All content renders to images (including EPUB)
**Rationale**:
- Unified pipeline for all content types
- Single image viewer handles everything
- Easy to implement lazy loading
- Consistent experience across content types
- Easy to cache rendered images

**Trade-offs**:
- EPUB loses text selectability
- Can't search in rendered EPUB
- Takes more memory (canvas images)
- Slower initial render for EPUB

**When to Reconsider**:
- If search/highlighting becomes important
- If file size becomes prohibitive

### 8.3 Lazy Loading vs Full Render

**Decision**: Lazy load vertical layout, render all horizontal on demand
**Rationale**:
- Vertical layout: infinite scroll, need efficient memory use
- Horizontal layout: discrete pages, safe to preload adjacent

**Implementation**:
- Vertical: IntersectionObserver + render on demand
- Horizontal: Render current + next 2 pages

---

## Part 9: File Structure

```
app/tools/reader/
├── page.tsx                          # Main page, loads tome
├── layout.tsx                        # Layout wrapper
│
├── components/
│   ├── ReaderLayout.tsx             # Main layout component
│   ├── Sidebar/
│   │   ├── index.tsx                # Sidebar wrapper
│   │   ├── TOCNavigation.tsx        # TOC tree display
│   │   └── TOCEntry.tsx             # Single TOC item
│   ├── ImageContainer/
│   │   ├── index.tsx                # Container wrapper
│   │   ├── VerticalLayout.tsx       # Vertical stacking
│   │   └── HorizontalLayout.tsx     # Single page view
│   └── NavigationControls.tsx       # Prev/Next, page input
│
├── renderers/
│   ├── BaseRenderer.ts              # Abstract base class
│   ├── RendererFactory.ts           # Factory pattern
│   ├── ComicRenderer.ts             # Comics
│   ├── EpubRenderer.ts              # EPUB
│   └── AudiobookRenderer.ts         # Audiobooks
│
├── utils/
│   ├── layoutCalculator.ts          # Layout math
│   ├── imageLoader.ts               # Image loading & caching
│   └── tocBuilder.ts                # TOC generation
│
└── hooks/
    ├── useReaderState.ts            # State management
    ├── useImagePreload.ts           # Preloading logic
    └── useKeyboardNavigation.ts      # Keyboard handlers
```

---

## Part 10: Success Criteria

### Must Have
- [ ] Comics render in vertical layout
- [ ] EPUB renders to images
- [ ] Responsive layout (mobile/desktop)
- [ ] Sidebar with TOC
- [ ] Page navigation works
- [ ] No build errors
- [ ] No console errors on normal use

### Should Have
- [ ] Lazy loading works
- [ ] Keyboard shortcuts
- [ ] Reading direction respected
- [ ] Smooth scrolling
- [ ] Good performance

### Nice to Have
- [ ] Search (EPUB)
- [ ] Bookmarks
- [ ] Progress saving
- [ ] Animations

---

## Part 11: Assumptions & Constraints

### Assumptions
- EPUB files follow standard structure (OPF, spine, etc.)
- Comic images are in consistent format
- Audio files are small enough to fit in memory
- Audiobooks have chapter metadata
- Max tome size: 500MB (reasonable for browser)

### Constraints
- Browser-based rendering (no backend)
- Single-tab reading (no sync across tabs)
- No offline support (yet)
- File size limits (ZIP extraction in JS)

### Browser Limitations
- CORS restrictions for external resources
- Canvas size limitations (~67MP)
- Memory limits (varies by browser)
- Font loading issues in html2canvas

---

## Next Steps

1. Review this plan with team
2. Identify any missing pieces
3. Prioritize features
4. Assign implementation tasks
5. Set up development branches
6. Begin Phase 1 implementation
