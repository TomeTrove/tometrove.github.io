import JSZip from 'jszip';
import { TomeFile, TomeErrorDetails, TomeJsonTemplate, TomeTemplate } from './types';
import { prepareTemplateTomeJson } from './templateHandler';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const TOME_JSON_PATH = 'tome.json';

function getTomeJsonTemplate(): TomeJsonTemplate {
  return {
    name: '',
    version: '1.0.0',
    description: '',
    author: '',
    created: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  };
}

export async function loadTomeFile(file: File): Promise<{ json: string; zip: JSZip; filename: string }> {
  // Validate file extension
  if (!file.name.toLowerCase().endsWith('.tome')) {
    const error: TomeErrorDetails = {
      type: 'invalid-file-type',
      message: 'Please select a .tome file',
      details: `File "${file.name}" is not a .tome file`,
    };
    throw error;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const error: TomeErrorDetails = {
      type: 'file-too-large',
      message: 'File size exceeds maximum limit',
      details: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
    throw error;
  }

  try {
    // Load ZIP file
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);

    // Check if tome.json exists at root
    const tomeJsonFile = loadedZip.file(TOME_JSON_PATH);
    if (!tomeJsonFile) {
      const error: TomeErrorDetails = {
        type: 'missing-tome-json',
        message: 'tome.json not found in archive root',
        details: 'The .tome file must contain a tome.json file at the root level',
      };
      throw error;
    }

    // Extract tome.json content
    const jsonContent = await tomeJsonFile.async('string');

    // Validate JSON
    try {
      JSON.parse(jsonContent);
    } catch (parseError) {
      const error: TomeErrorDetails = {
        type: 'invalid-json',
        message: 'tome.json contains invalid JSON',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
      };
      throw error;
    }

    return {
      json: jsonContent,
      zip: loadedZip,
      filename: file.name,
    };
  } catch (error) {
    // If error is already a TomeErrorDetails, re-throw it
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }

    // Otherwise, it's a ZIP loading error
    const tomeError: TomeErrorDetails = {
      type: 'corrupt-zip',
      message: 'Unable to read .tome file',
      details: 'The file may be corrupted or is not a valid ZIP archive',
    };
    throw tomeError;
  }
}

export function updateTomeJson(zip: JSZip, newJsonContent: string): JSZip {
  // Validate JSON before updating
  try {
    JSON.parse(newJsonContent);
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'invalid-json',
      message: 'Cannot save invalid JSON',
      details: error instanceof Error ? error.message : 'Unknown parsing error',
    };
    throw tomeError;
  }

  // Update tome.json in the ZIP
  zip.file(TOME_JSON_PATH, newJsonContent);
  return zip;
}

export async function downloadTome(zip: JSZip, filename: string): Promise<void> {
  try {
    // Generate the ZIP file as a blob
    const blob = await zip.generateAsync({ type: 'blob' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
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

export function createNewTome(filename: string, template?: TomeTemplate): { json: string; zip: JSZip; filename: string } {
  try {
    // Create new ZIP archive
    const zip = new JSZip();

    let jsonContent: string;

    if (template) {
      // Use provided template
      const tomeJson = prepareTemplateTomeJson(template);
      jsonContent = JSON.stringify(tomeJson, null, 2);

      // Add tome.json to the archive
      zip.file(TOME_JSON_PATH, jsonContent);

      // Add all template files to the archive
      template.files.forEach((file) => {
        zip.file(file.path, file.content);
      });
    } else {
      // Use default simple template
      const simpleTemplate = getTomeJsonTemplate();
      jsonContent = JSON.stringify(simpleTemplate, null, 2);

      // Add tome.json to the archive
      zip.file(TOME_JSON_PATH, jsonContent);
    }

    return {
      json: jsonContent,
      zip,
      filename,
    };
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'unknown-error',
      message: 'Failed to create new .tome file',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    throw tomeError;
  }
}

export async function readFileFromZip(zip: JSZip, path: string): Promise<string> {
  try {
    const file = zip.file(path);
    if (!file) {
      throw new Error(`File not found: ${path}`);
    }

    const content = await file.async('string');
    return content;
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'unknown-error',
      message: 'Failed to read file from archive',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    throw tomeError;
  }
}

export function updateFileInZip(zip: JSZip, path: string, content: string): JSZip {
  try {
    zip.file(path, content);
    return zip;
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'unknown-error',
      message: 'Failed to update file in archive',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    throw tomeError;
  }
}

export async function addFileToZip(zip: JSZip, path: string, file: File): Promise<JSZip> {
  try {
    // Check if file already exists
    const existingFile = zip.file(path);
    if (existingFile) {
      throw new Error(`File already exists at path: ${path}`);
    }

    // Read file content
    const content = await file.arrayBuffer();

    // Add file to ZIP
    zip.file(path, content);

    return zip;
  } catch (error) {
    const tomeError: TomeErrorDetails = {
      type: 'unknown-error',
      message: 'Failed to add file to archive',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    throw tomeError;
  }
}

export function fileExistsInZip(zip: JSZip, path: string): boolean {
  return zip.file(path) !== null;
}
