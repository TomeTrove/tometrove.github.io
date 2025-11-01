'use client';

import type { RenderedPage } from '../renderers/BaseRenderer';
import type { ContentRenderer } from '../renderers/BaseRenderer';
import type JSZip from 'jszip';
import { PageImage } from './PageImage';

interface HorizontalLayoutProps {
  pages: RenderedPage[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  zip: JSZip | null;
  renderer: ContentRenderer;
}

export function HorizontalLayout({
  pages,
  currentPageIndex,
  zip,
  renderer,
}: HorizontalLayoutProps) {
  const currentPage = pages[currentPageIndex];

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No page to display</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-black flex justify-center">
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          padding: '20px',
        }}
      >
        <PageImage
          page={currentPage}
          zip={zip}
          renderer={renderer}
          isVisible={true}
        />
      </div>
    </div>
  );
}
