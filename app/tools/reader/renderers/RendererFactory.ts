import JSZip from 'jszip';
import { ContentRenderer } from './BaseRenderer';
import { ComicRenderer } from './ComicRenderer';
import { EpubRenderer } from './EpubRenderer';
import { AudiobookRenderer } from './AudiobookRenderer';
import type { TomeMetadata } from '../page';

export class RendererFactory {
  static async create(metadata: TomeMetadata, zip: JSZip): Promise<ContentRenderer> {
    const type = metadata.type;

    if (type.startsWith('comic_')) {
      return new ComicRenderer(metadata, zip);
    }

    if (type === 'epub') {
      return new EpubRenderer(metadata, zip);
    }

    if (type === 'audio_book') {
      return new AudiobookRenderer(metadata, zip);
    }

    throw new Error(`Unsupported tome type: ${type}`);
  }
}
