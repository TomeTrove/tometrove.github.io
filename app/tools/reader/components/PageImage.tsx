'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import type { RenderedPage } from '../renderers/BaseRenderer';
import type { ContentRenderer } from '../renderers/BaseRenderer';
import type JSZip from 'jszip';
import { ComicRenderer } from '../renderers/ComicRenderer';

interface PageImageProps {
  page: RenderedPage;
  zip: JSZip | null;
  renderer: ContentRenderer;
  isVisible: boolean;
}

export function PageImage({
  page,
  zip,
  renderer,
  isVisible,
}: PageImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const loadImage = useCallback(async () => {
    if (!isVisible || imageSrc) return;

    setIsLoading(true);
    setError(null);

    try {
      // If image is a string (path), load from zip
      if (typeof page.image === 'string' && page.image) {
        // Check if this is a ComicRenderer with getImageData method
        if (renderer instanceof ComicRenderer) {
          const blob = await (renderer as any).getImageData(page.image);
          const url = URL.createObjectURL(blob);
          setImageSrc(url);

          // Get image dimensions
          const img = new window.Image();
          img.onload = () => {
            setDimensions({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          };
          img.src = url;
        }
      }
      // If it's already a Blob or HTMLImageElement, convert to URL
      else if (page.image instanceof Blob) {
        const url = URL.createObjectURL(page.image);
        setImageSrc(url);
      }
      // If it's a data URL or similar
      else if (typeof page.image === 'string') {
        setImageSrc(page.image);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
    } finally {
      setIsLoading(false);
    }
  }, [page.image, isVisible, imageSrc, renderer]);

  useEffect(() => {
    loadImage();

    return () => {
      // Cleanup object URLs
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [loadImage, imageSrc]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500 text-sm text-center">
          <p>Failed to load page</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !imageSrc) {
    return (
      <div className="flex items-center justify-center p-4 min-h-64">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs">Loading page {page.index + 1}...</p>
        </div>
      </div>
    );
  }

  // Use img tag instead of next/Image for better control
  return (
    <div className="flex justify-center">
      <img
        src={imageSrc}
        alt={`Page ${page.index + 1}`}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '900px',
          display: 'block',
        }}
        className="object-contain"
      />
    </div>
  );
}
