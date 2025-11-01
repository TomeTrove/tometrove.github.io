'use client';

import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';

interface ImagePreviewProps {
  imageData: ArrayBuffer;
  filename: string;
}

export function ImagePreview({ imageData, filename }: ImagePreviewProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [zoom, setZoom] = useState<'fit' | 'actual'>('fit');
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; size: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert ArrayBuffer to Blob
      const blob = new Blob([imageData]);
      const url = URL.createObjectURL(blob);
      setImageSrc(url);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          width: img.width,
          height: img.height,
          size: imageData.byteLength,
        });
        setIsLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };
      img.src = url;

      // Cleanup
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, [imageData]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Toolbar */}
      <div className="border-b bg-card px-4 py-2 flex items-center justify-between">
        <div className="text-sm space-y-0.5">
          <p className="font-medium">{filename}</p>
          {imageInfo && (
            <p className="text-xs text-muted-foreground">
              {imageInfo.width} × {imageInfo.height} px • {formatBytes(imageInfo.size)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={zoom === 'fit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setZoom('fit')}
            className="gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Fit</span>
          </Button>
          <Button
            variant={zoom === 'actual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setZoom('actual')}
            className="gap-2"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="hidden sm:inline">100%</span>
          </Button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={filename}
          className={zoom === 'fit' ? 'max-w-full max-h-full object-contain' : 'object-none'}
          style={zoom === 'actual' ? { imageRendering: 'crisp-edges' } : undefined}
        />
      </div>
    </div>
  );
}
