import JSZip from 'jszip';
import { ContentRenderer, RenderedPage, TOCEntry } from './BaseRenderer';
import type { TomeMetadata } from '../page';

export class AudiobookRenderer extends ContentRenderer {
  constructor(metadata: TomeMetadata, zip: JSZip) {
    super(metadata, zip);
  }

  async renderAllPages(): Promise<RenderedPage[]> {
    try {
      // TODO: Implement audiobook rendering
      // For now, return a placeholder
      this.pages = [{
        image: '',
        width: 900,
        height: 600,
        index: 0,
        metadata: {
          chapterTitle: 'Audiobook Rendering (Coming Soon)',
        },
      }];

      return this.pages;
    } catch (err) {
      throw new Error(`Failed to render audiobook pages: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  getTOC(): TOCEntry[] {
    // TODO: Extract TOC from audiobook chapters metadata
    return [{
      id: 'root',
      title: this.metadata.title || 'Audiobook',
      pageIndex: 0,
    }];
  }

  getLayoutDirection(): 'vertical' | 'horizontal' {
    // Audiobook always uses horizontal layout
    return 'horizontal';
  }
}
