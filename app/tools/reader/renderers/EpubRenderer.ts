import JSZip from 'jszip';
import { ContentRenderer, RenderedPage, TOCEntry } from './BaseRenderer';
import type { TomeMetadata } from '../page';

export class EpubRenderer extends ContentRenderer {
  constructor(metadata: TomeMetadata, zip: JSZip) {
    super(metadata, zip);
  }

  async renderAllPages(): Promise<RenderedPage[]> {
    try {
      // TODO: Implement EPUB rendering with html2canvas
      // For now, return a placeholder
      this.pages = [{
        image: '',
        width: 900,
        height: 600,
        index: 0,
        metadata: {
          chapterTitle: 'EPUB Rendering (Coming Soon)',
        },
      }];

      return this.pages;
    } catch (err) {
      throw new Error(`Failed to render EPUB pages: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  getTOC(): TOCEntry[] {
    // TODO: Extract TOC from EPUB manifest/spine
    return [{
      id: 'root',
      title: this.metadata.title || 'EPUB',
      pageIndex: 0,
    }];
  }

  getLayoutDirection(): 'vertical' | 'horizontal' {
    // EPUB always uses horizontal layout
    return 'horizontal';
  }
}
