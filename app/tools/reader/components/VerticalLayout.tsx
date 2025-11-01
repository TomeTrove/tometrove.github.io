'use client';

import { useEffect, useRef } from 'react';
import type { RenderedPage } from '../renderers/BaseRenderer';
import type { ContentRenderer } from '../renderers/BaseRenderer';
import type JSZip from 'jszip';
import { PageImage } from './PageImage';

interface VerticalLayoutProps {
  pages: RenderedPage[];
  currentPageIndex: number;
  zip: JSZip | null;
  renderer: ContentRenderer;
}

export function VerticalLayout({
  pages,
  currentPageIndex,
  zip,
  renderer,
}: VerticalLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Scroll to current page when it changes
  useEffect(() => {
    const currentPageElement = pageRefs.current[currentPageIndex];
    if (currentPageElement && containerRef.current) {
      currentPageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPageIndex]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      <div className="flex flex-col items-center bg-black">
        {pages.map((page, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) pageRefs.current[index] = el;
            }}
            className="w-full flex justify-center"
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <PageImage
              page={page}
              zip={zip}
              renderer={renderer}
              isVisible={Math.abs(index - currentPageIndex) <= 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
