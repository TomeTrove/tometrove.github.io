import JSZip from 'jszip';
import { TomeErrorDetails, EPUBMetadata, MetadataMode } from './types';

export async function validateEPUBFile(file: File): Promise<void> {
  if (!file.name.toLowerCase().endsWith('.epub')) {
    const error: TomeErrorDetails = {
      type: 'invalid-file-type',
      message: 'Please select an .epub file',
      details: `File "${file.name}" is not an .epub file`,
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

export async function getEPUBMetadata(zip: JSZip): Promise<EPUBMetadata> {
  try {
    // EPUB structure: Look for container.xml to find the root file
    const containerXmlFile = zip.file('META-INF/container.xml');
    if (!containerXmlFile) {
      throw new Error('No META-INF/container.xml found');
    }

    const containerXmlContent = await containerXmlFile.async('string');

    // Parse container.xml to find the OPF file
    const rootfileMatch = containerXmlContent.match(/rootfile[^>]*full-path="([^"]+)"/);
    if (!rootfileMatch) {
      throw new Error('Could not find root file reference in container.xml');
    }

    const opfPath = rootfileMatch[1];
    const opfFile = zip.file(opfPath);
    if (!opfFile) {
      throw new Error(`OPF file not found at ${opfPath}`);
    }

    const opfContent = await opfFile.async('string');

    // Extract metadata from OPF
    const metadata = parseOPFMetadata(opfContent);

    return metadata;
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'corrupt-zip',
      message: 'Unable to read EPUB file',
      details: error instanceof Error ? error.message : 'The file may be corrupted or is not a valid EPUB',
    };
    throw tomeError;
  }
}

function parseOPFMetadata(opfContent: string): EPUBMetadata {
  // Extract title
  let title = 'Unknown Title';
  const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Extract authors
  const authors: string[] = [];
  const authorMatches = opfContent.matchAll(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/gi);
  for (const match of authorMatches) {
    authors.push(match[1].trim());
  }

  // Extract publisher
  let publisher: string | undefined;
  const publisherMatch = opfContent.match(/<dc:publisher[^>]*>([^<]+)<\/dc:publisher>/i);
  if (publisherMatch) {
    publisher = publisherMatch[1].trim();
  }

  // Extract published date
  let published_date: string | undefined;
  const dateMatch = opfContent.match(/<dc:date[^>]*>([^<]+)<\/dc:date>/i);
  if (dateMatch) {
    published_date = dateMatch[1].trim();
  }

  // Extract description
  let description: string | undefined;
  const descriptionMatch = opfContent.match(/<dc:description[^>]*>([^<]+)<\/dc:description>/i);
  if (descriptionMatch) {
    description = descriptionMatch[1].trim();
  }

  // Extract language
  let language = 'en';
  const languageMatch = opfContent.match(/<dc:language[^>]*>([^<]+)<\/dc:language>/i);
  if (languageMatch) {
    language = languageMatch[1].trim();
  }

  // Extract subjects as tags
  const tags: string[] = [];
  const subjectMatches = opfContent.matchAll(/<dc:subject[^>]*>([^<]+)<\/dc:subject>/gi);
  for (const match of subjectMatches) {
    tags.push(match[1].trim());
  }

  return {
    title,
    authors: authors.length > 0 ? authors : undefined,
    publisher,
    published_date,
    description,
    language,
    tags,
  };
}

export function generateTomeJson(
  metadata: EPUBMetadata,
  tomeType: string,
  metadataMode: MetadataMode,
  opfPath?: string
): Record<string, any> {
  const baseJson: Record<string, any> = {
    type: tomeType,
    title: metadata.title,
    language: metadata.language,
    tags: metadata.tags,
  };

  // Add authors only if provided
  if (metadata.authors && metadata.authors.length > 0) {
    baseJson.authors = metadata.authors;
  }

  // Add optional fields
  if (metadata.description) {
    baseJson.description = metadata.description;
  }
  if (metadata.published_date) {
    baseJson.published_date = metadata.published_date;
  }
  if (metadata.publisher) {
    baseJson.publisher = metadata.publisher;
  }
  if (metadata.layout_direction) {
    baseJson.layout_direction = metadata.layout_direction;
  }

  // Handle metadata reference modes
  if (metadataMode === 'reference' || metadataMode === 'both') {
    if (opfPath) {
      baseJson.metadata_reference = {
        format: 'epub_opf',
        path: opfPath,
      };
    }
  }

  return baseJson;
}

export async function createTomeFromEPUB(
  epubFile: File,
  metadata: EPUBMetadata,
  tomeType: string,
  metadataMode: MetadataMode,
  filename: string
): Promise<{ zip: JSZip; filename: string; json: string; opfPath: string }> {
  try {
    // Load the EPUB file to get its contents
    const epubZip = new JSZip();
    const loadedEpubZip = await epubZip.loadAsync(epubFile);

    // Find OPF path
    const containerXmlFile = loadedEpubZip.file('META-INF/container.xml');
    let opfPath = 'content.opf'; // default

    if (containerXmlFile) {
      const containerXmlContent = await containerXmlFile.async('string');
      const rootfileMatch = containerXmlContent.match(/rootfile[^>]*full-path="([^"]+)"/);
      if (rootfileMatch) {
        opfPath = rootfileMatch[1];
      }
    }

    // Create new ZIP for the tome (preserve EPUB structure)
    const tomeZip = new JSZip();

    // Copy all EPUB files to the tome
    loadedEpubZip.forEach((path: string, file: JSZip.JSZipObject) => {
      if (!file.dir) {
        // We'll skip adding the file content directly and instead add references
        // The EPUB structure should be preserved as-is in the wrapped tome
      }
    });

    // Actually, let's preserve the EPUB as-is inside the tome by copying it
    const epubBlob = await loadedEpubZip.generateAsync({ type: 'blob' });

    // Create the new tome structure:
    // Store the EPUB content directly to preserve it
    loadedEpubZip.forEach((path: string, file: JSZip.JSZipObject) => {
      if (!file.dir) {
        tomeZip.file(path, file.async('arraybuffer'));
      }
    });

    // Generate tome.json
    const tomeJson = generateTomeJson(metadata, tomeType, metadataMode, opfPath);
    const jsonContent = JSON.stringify(tomeJson, null, 2);

    // Add tome.json to root
    tomeZip.file('tome.json', jsonContent);

    return {
      zip: tomeZip,
      filename,
      json: jsonContent,
      opfPath,
    };
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'unknown-error',
      message: 'Failed to create tome from EPUB',
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
    .replace(/\.epub$/i, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50);
}
