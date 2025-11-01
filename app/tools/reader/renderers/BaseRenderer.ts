import type JSZip from 'jszip';
import type { TomeMetadata } from '../page';

export interface RenderedPage {
  image: string | HTMLImageElement | Blob;
  width: number;
  height: number;
  index: number;
  metadata?: {
    chapterTitle?: string;
    chapterNumber?: number;
    pageLabel?: string;
    bookmarkable?: boolean;
    [key: string]: any;
  };
}

export interface TOCEntry {
  id: string;
  title: string;
  pageIndex: number;
  children?: TOCEntry[];
  href?: string;
}

export abstract class ContentRenderer {
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
  abstract getLayoutDirection(): 'vertical' | 'horizontal';

  getMetadata(): TomeMetadata {
    return this.metadata;
  }

  getReadingDirection(): 'ltr' | 'rtl' {
    return this.metadata.layout_direction === 'rtl' ? 'rtl' : 'ltr';
  }

  getTotalPages(): number {
    return this.pages.length;
  }

  getPage(index: number): RenderedPage | undefined {
    return this.pages[index];
  }

  getPages(): RenderedPage[] {
    return this.pages;
  }

  getZip(): JSZip {
    return this.zip;
  }
}
