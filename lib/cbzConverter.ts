import JSZip from 'jszip';
import { TomeErrorDetails } from './types';

const SUPPORTED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'];

export interface CBZImage {
  path: string;
  name: string;
  data: ArrayBuffer;
  extension: string;
}

export interface CBZMetadata {
  title: string;
  // comic_chapter fields
  chapter_number?: number;
  comic_title?: string;
  // comic_volume fields
  series?: string;
  volume_number?: number;
  // comic_series fields (uses chapter_number and volume_number)
  // common fields
  authors?: string[];
  description?: string;
  publisher?: string;
  published_date?: string;
  reading_direction: 'ltr' | 'rtl';
  layout_direction?: 'horizontal' | 'vertical';
  language: string;
  tags: string[];
}

export async function validateCBZFile(file: File): Promise<void> {
  if (!file.name.toLowerCase().endsWith('.cbz')) {
    const error: TomeErrorDetails = {
      type: 'invalid-file-type',
      message: 'Please select a .cbz file',
      details: `File "${file.name}" is not a .cbz file`,
    };
    throw error;
  }

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  if (file.size > MAX_FILE_SIZE) {
    const error: TomeErrorDetails = {
      type: 'file-too-large',
      message: 'File size exceeds maximum limit',
      details: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
    throw error;
  }
}

export async function extractImagesFromCBZ(file: File): Promise<CBZImage[]> {
  try {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);

    const images: CBZImage[] = [];

    // Iterate through all files in the archive
    loadedZip.forEach((path: string, file: JSZip.JSZipObject) => {
      if (!file.dir) {
        const extension = path.split('.').pop()?.toLowerCase();

        if (extension && SUPPORTED_IMAGE_EXTENSIONS.includes(extension)) {
          images.push({
            path,
            name: path.split('/').pop() || path,
            data: new ArrayBuffer(0), // Will be populated on demand
            extension,
          });
        }
      }
    });

    if (images.length === 0) {
      const error: TomeErrorDetails = {
        type: 'unknown-error',
        message: 'No images found in CBZ file',
        details: 'The CBZ file must contain at least one image file (PNG, JPG, GIF, WebP, BMP)',
      };
      throw error;
    }

    // Sort images by path to ensure consistent ordering
    images.sort((a, b) => a.path.localeCompare(b.path));

    // Load image data
    const imagesToReturn: CBZImage[] = [];
    for (const image of images) {
      const fileData = loadedZip.file(image.path);
      if (fileData) {
        const data = await fileData.async('arraybuffer');
        imagesToReturn.push({
          ...image,
          data,
        });
      }
    }

    return imagesToReturn;
  } catch (error) {
    // If error is already a TomeErrorDetails, re-throw it
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }

    const tomeError: TomeErrorDetails = {
      type: 'corrupt-zip',
      message: 'Unable to read .cbz file',
      details: 'The file may be corrupted or is not a valid ZIP archive',
    };
    throw tomeError;
  }
}

export async function getImageThumbnail(imageData: ArrayBuffer): Promise<string> {
  const blob = new Blob([imageData]);
  return URL.createObjectURL(blob);
}

export function generateTomeJson(
  metadata: CBZMetadata,
  tomeType: 'comic_chapter' | 'comic_volume' | 'comic_series',
  pageCount: number
): Record<string, any> {
  const baseJson: Record<string, any> = {
    type: tomeType,
    title: metadata.title,
    reading_direction: metadata.reading_direction,
    language: metadata.language,
    tags: metadata.tags,
  };

  // Add layout_direction if provided
  if (metadata.layout_direction) {
    baseJson.layout_direction = metadata.layout_direction;
  }

  // Add authors only if provided
  if (metadata.authors && metadata.authors.length > 0) {
    baseJson.authors = metadata.authors;
  }

  // Add optional common fields
  if (metadata.description) {
    baseJson.description = metadata.description;
  }
  if (metadata.published_date) {
    baseJson.published_date = metadata.published_date;
  }

  // Add type-specific fields
  if (tomeType === 'comic_volume') {
    baseJson.cover_image = 'pages/page-001.jpg';
    baseJson.page_count = pageCount;
    if (metadata.series) {
      baseJson.series = metadata.series;
    }
    if (metadata.volume_number !== undefined) {
      baseJson.volume_number = metadata.volume_number;
    }
    if (metadata.publisher) {
      baseJson.publisher = metadata.publisher;
    }
  } else if (tomeType === 'comic_chapter') {
    baseJson.cover_image = 'pages/page-001.jpg';
    baseJson.page_count = pageCount;
    baseJson.comic_title = metadata.comic_title || '';
    if (metadata.chapter_number !== undefined) {
      baseJson.chapter_number = metadata.chapter_number;
    }
  } else if (tomeType === 'comic_series') {
    baseJson.cover_image = 'pages/page-001.jpg';
    baseJson.total_pages = pageCount;
    if (metadata.publisher) {
      baseJson.publisher = metadata.publisher;
    }
  }

  return baseJson;
}

export async function createTomeFromCBZ(
  images: CBZImage[],
  metadata: CBZMetadata,
  tomeType: 'comic_chapter' | 'comic_volume' | 'comic_series',
  filename: string
): Promise<{ zip: JSZip; filename: string; json: string }> {
  try {
    const zip = new JSZip();

    // Create pages directory
    const pagesFolder = zip.folder('pages');
    if (!pagesFolder) {
      throw new Error('Failed to create pages folder');
    }

    // Add all images to pages folder
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const paddedNumber = String(i + 1).padStart(3, '0');
      const newFilename = `page-${paddedNumber}.${image.extension}`;
      pagesFolder.file(newFilename, image.data);
    }

    // Generate tome.json
    const tomeJson = generateTomeJson(metadata, tomeType, images.length);
    const jsonContent = JSON.stringify(tomeJson, null, 2);

    // Add tome.json to root
    zip.file('tome.json', jsonContent);

    return {
      zip,
      filename,
      json: jsonContent,
    };
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'unknown-error',
      message: 'Failed to create tome from CBZ',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    throw tomeError;
  }
}

export async function downloadTomeFile(zip: JSZip, filename: string): Promise<void> {
  if (filename.trim() == ".tome") filename = "unknown.tome"
  if (!filename.endsWith('.tome')) filename = `${filename}.tome`

  try {
    const blob = await zip.generateAsync({ type: 'blob' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    console.log("Link", link.download)
     document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'unknown-error',
      message: 'Failed to download file',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    throw tomeError;
  }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\.cbz$/i, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50);
}
