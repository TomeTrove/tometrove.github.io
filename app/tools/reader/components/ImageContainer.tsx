'use client';

import { useEffect, useState, useRef } from 'react';
import { VerticalLayout } from './VerticalLayout';
import { HorizontalLayout } from './HorizontalLayout';
import type { RenderedPage } from '../renderers/BaseRenderer';
import type { ContentRenderer } from '../renderers/BaseRenderer';
import type JSZip from 'jszip';

interface ImageContainerProps {
  pages: RenderedPage[];
  currentPageIndex: number;
  layoutDirection: 'vertical' | 'horizontal';
  onPageChange: (index: number) => void;
  zip: JSZip | null;
  renderer: ContentRenderer;
}

export function ImageContainer({
  pages,
  currentPageIndex,
  layoutDirection,
  onPageChange,
  zip,
  renderer,
}: ImageContainerProps) {
  if (pages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No pages to display</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      {layoutDirection === 'vertical' ? (
        <VerticalLayout
          pages={pages}
          currentPageIndex={currentPageIndex}
          zip={zip}
          renderer={renderer}
        />
      ) : (
        <HorizontalLayout
          pages={pages}
          currentPageIndex={currentPageIndex}
          onPageChange={onPageChange}
          zip={zip}
          renderer={renderer}
        />
      )}
    </div>
  );
}
