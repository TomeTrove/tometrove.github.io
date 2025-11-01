'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { ImageContainer } from './ImageContainer';
import { NavigationControls } from './NavigationControls';
import type { ContentRenderer, RenderedPage, TOCEntry } from '../renderers/BaseRenderer';
import type { TomeMetadata } from '../page';

interface ReaderLayoutProps {
  renderer: ContentRenderer;
  metadata: TomeMetadata;
}

export function ReaderLayout({ renderer, metadata }: ReaderLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renderedPages, setRenderedPages] = useState<RenderedPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [toc, setToc] = useState<TOCEntry[]>([]);
  const [isRenderingPages, setIsRenderingPages] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);

  const layoutDirection = renderer.getLayoutDirection();
  const readingDirection = renderer.getReadingDirection();

  // Render all pages on mount
  useEffect(() => {
    async function renderPages() {
      setIsRenderingPages(true);
      setRenderError(null);

      try {
        const pages = await renderer.renderAllPages();
        setRenderedPages(pages);

        const tableOfContents = renderer.getTOC();
        setToc(tableOfContents);
      } catch (err) {
        setRenderError(err instanceof Error ? err.message : 'Failed to render pages');
      } finally {
        setIsRenderingPages(false);
      }
    }

    renderPages();
  }, [renderer]);

  const handlePageChange = useCallback((newIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(newIndex, renderedPages.length - 1));
    setCurrentPageIndex(clampedIndex);

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [renderedPages.length]);

  const handleTOCClick = useCallback((entry: TOCEntry) => {
    handlePageChange(entry.pageIndex);
  }, [handlePageChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (layoutDirection === 'horizontal') {
        if (e.key === 'ArrowRight' && readingDirection === 'ltr') {
          handlePageChange(currentPageIndex + 1);
        } else if (e.key === 'ArrowLeft' && readingDirection === 'ltr') {
          handlePageChange(currentPageIndex - 1);
        } else if (e.key === 'ArrowLeft' && readingDirection === 'rtl') {
          handlePageChange(currentPageIndex + 1);
        } else if (e.key === 'ArrowRight' && readingDirection === 'rtl') {
          handlePageChange(currentPageIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, layoutDirection, readingDirection, handlePageChange]);

  if (isRenderingPages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Rendering pages...</p>
        </div>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded max-w-md">
          <p className="font-semibold mb-2">Rendering Error</p>
          <p className="text-sm">{renderError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        toc={toc}
        currentPageIndex={currentPageIndex}
        onNavigate={handleTOCClick}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Image Container */}
        <ImageContainer
          pages={renderedPages}
          currentPageIndex={currentPageIndex}
          layoutDirection={layoutDirection}
          onPageChange={handlePageChange}
          zip={renderer.getZip?.() || null}
          renderer={renderer}
        />

        {/* Navigation Controls */}
        {renderedPages.length > 0 && (
          <NavigationControls
            currentPage={currentPageIndex}
            totalPages={renderedPages.length}
            onPageChange={handlePageChange}
            readingDirection={readingDirection}
            layoutDirection={layoutDirection}
          />
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
