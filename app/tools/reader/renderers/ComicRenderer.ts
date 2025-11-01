import JSZip from 'jszip';
import { ContentRenderer, RenderedPage, TOCEntry } from './BaseRenderer';
import type { TomeMetadata } from '../page';

export class ComicRenderer extends ContentRenderer {
  constructor(metadata: TomeMetadata, zip: JSZip) {
    super(metadata, zip);
  }

  async renderAllPages(): Promise<RenderedPage[]> {
    try {
      // Get all image files from the ZIP
      const imageFiles = this.zip.file(/.+\.(jpg|jpeg|png|gif|webp|bmp)$/i);

      if (imageFiles.length === 0) {
        throw new Error('No images found in comic file');
      }

      // Create a RenderedPage for each image
      // Store the file path, we'll load images on demand via lazy loading
      this.pages = imageFiles.map((file, index) => {
        return {
          image: file.name, // Store path, not loaded yet
          width: 0, // Will be determined when image loads
          height: 0,
          index,
          metadata: {
            pageLabel: `Page ${index + 1}`,
          },
        };
      });

      return this.pages;
    } catch (err) {
      throw new Error(`Failed to render comic pages: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  getTOC(): TOCEntry[] {
    // Try to load TOC from chapters.json
    try {
      // First try to find chapters.json in root
      let chaptersFile = this.zip.file('chapters.json');

      if (!chaptersFile) {
        // Try to find it in the first directory level
        const files = this.zip.file(/chapters\.json$/);
        if (files.length > 0) {
          chaptersFile = files[0];
        }
      }

      if (chaptersFile) {
        // For now, return empty TOC - will implement chapter-based TOC later
        return [];
      }

      // If no chapters.json, generate a simple TOC from pages
      return [{
        id: 'root',
        title: this.metadata.title || 'Comic',
        pageIndex: 0,
      }];
    } catch (err) {
      console.warn('Failed to load TOC:', err);
      return [{
        id: 'root',
        title: this.metadata.title || 'Comic',
        pageIndex: 0,
      }];
    }
  }

  getLayoutDirection(): 'vertical' | 'horizontal' {
    // Default to vertical for comics unless specified otherwise
    const direction = this.metadata.layout_direction;
    return direction === 'horizontal' || direction === 'rtl' ? 'horizontal' : 'vertical';
  }

  async getImageData(imagePath: string): Promise<Blob> {
    const imageFile = this.zip.file(imagePath);
    if (!imageFile) {
      throw new Error(`Image not found: ${imagePath}`);
    }
    return imageFile.async('blob');
  }
}
