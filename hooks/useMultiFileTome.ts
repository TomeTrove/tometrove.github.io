import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { loadTomeFile, downloadTome, createNewTome, readFileFromZip, updateFileInZip, addFileToZip, fileExistsInZip } from '@/lib/tomeHandler';
import { validateJsonString } from '@/lib/utils';
import { getLanguageFromExtension, isImageFile } from '@/lib/fileTree';
import type { TomeErrorDetails, OpenFile } from '@/lib/types';
import { getTemplateById } from '@/lib/templateHandler';

export function useMultiFileTome() {
  const [currentZip, setCurrentZip] = useState<JSZip | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<Map<string, OpenFile>>(new Map());
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [error, setError] = useState<TomeErrorDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setCurrentZip(null);
    setFilename(null);
    setOpenFiles(new Map());
    setCurrentFilePath(null);
    
    try {
      const { json, zip, filename: loadedFilename } = await loadTomeFile(file);

      setCurrentZip(zip);
      setFilename(loadedFilename);

      // Auto-open tome.json
      const tomeJsonFile: OpenFile = {
        path: 'tome.json',
        content: json,
        originalContent: json,
        isModified: false,
        isValid: true,
        language: 'json',
        fileType: 'text',
      };

      const newOpenFiles = new Map();
      newOpenFiles.set('tome.json', tomeJsonFile);
      setOpenFiles(newOpenFiles);
      setCurrentFilePath('tome.json');

      return true;
    } catch (err) {
      if (err && typeof err === 'object' && 'type' in err) {
        setError(err as TomeErrorDetails);
      } else {
        setError({
          type: 'unknown-error',
          message: 'An unexpected error occurred',
          details: err instanceof Error ? err.message : 'Unknown error',
        });
      }
      setCurrentZip(null);
      setFilename(null);
      setOpenFiles(new Map());
      setCurrentFilePath(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openFileByPath = useCallback(async (path: string) => {
    if (!currentZip) return;

    // If already open, just switch to it
    if (openFiles.has(path)) {
      setCurrentFilePath(path);
      return;
    }

    // Load file from ZIP
    setIsLoading(true);
    try {
      const isImage = isImageFile(path);
      const language = getLanguageFromExtension(path);

      let newFile: OpenFile;

      if (isImage) {
        // Load image as ArrayBuffer
        const file = currentZip.file(path);
        if (!file) {
          throw new Error(`File not found: ${path}`);
        }
        const imageData = await file.async('arraybuffer');

        newFile = {
          path,
          content: '', // Empty content for images
          originalContent: '',
          isModified: false,
          isValid: true,
          language: 'image',
          fileType: 'image',
          imageData,
        };
      } else {
        // Load text file as string
        const content = await readFileFromZip(currentZip, path);

        newFile = {
          path,
          content,
          originalContent: content,
          isModified: false,
          isValid: language === 'json' ? validateJsonString(content).valid : true,
          language,
          fileType: 'text',
        };
      }

      const newOpenFiles = new Map(openFiles);
      newOpenFiles.set(path, newFile);
      setOpenFiles(newOpenFiles);
      setCurrentFilePath(path);
    } catch (err) {
      setError({
        type: 'unknown-error',
        message: 'Failed to open file',
        details: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentZip, openFiles]);

  const updateFileContent = useCallback((path: string, content: string) => {
    const file = openFiles.get(path);
    if (!file) return;

    const validation = file.language === 'json' ? validateJsonString(content) : { valid: true };

    const updatedFile: OpenFile = {
      ...file,
      content,
      isModified: content !== file.originalContent,
      isValid: validation.valid,
    };

    const newOpenFiles = new Map(openFiles);
    newOpenFiles.set(path, updatedFile);
    setOpenFiles(newOpenFiles);
  }, [openFiles]);

  const saveFile = useCallback((path: string) => {
    if (!currentZip) return false;

    const file = openFiles.get(path);
    if (!file || !file.isValid) return false;

    try {
      updateFileInZip(currentZip, path, file.content);

      // Mark as saved
      const updatedFile: OpenFile = {
        ...file,
        originalContent: file.content,
        isModified: false,
      };

      const newOpenFiles = new Map(openFiles);
      newOpenFiles.set(path, updatedFile);
      setOpenFiles(newOpenFiles);

      return true;
    } catch (err) {
      setError({
        type: 'unknown-error',
        message: 'Failed to save file',
        details: err instanceof Error ? err.message : 'Unknown error',
      });
      return false;
    }
  }, [currentZip, openFiles]);

  const saveAllFiles = useCallback(() => {
    if (!currentZip) return false;

    try {
      const newOpenFiles = new Map(openFiles);

      openFiles.forEach((file, path) => {
        if (file.isModified && file.isValid) {
          updateFileInZip(currentZip, path, file.content);
          newOpenFiles.set(path, {
            ...file,
            originalContent: file.content,
            isModified: false,
          });
        }
      });

      setOpenFiles(newOpenFiles);
      setError(null);
      return true;
    } catch (err) {
      setError({
        type: 'unknown-error',
        message: 'Failed to save files',
        details: err instanceof Error ? err.message : 'Unknown error',
      });
      return false;
    }
  }, [currentZip, openFiles]);

  const download = useCallback(async () => {
    if (!currentZip || !filename) return false;

    setIsLoading(true);
    try {
      await downloadTome(currentZip, filename);
      setError(null);
      return true;
    } catch (err) {
      if (err && typeof err === 'object' && 'type' in err) {
        setError(err as TomeErrorDetails);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentZip, filename]);

  const createNew = useCallback(async (newFilename: string, templateId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Load template if templateId is provided
      let template = undefined;
      if (templateId) {
        template = await getTemplateById(templateId);
      }

      const { json, zip, filename: createdFilename } = createNewTome(newFilename, template || undefined);

      setCurrentZip(zip);
      setFilename(createdFilename);

      // Open tome.json by default
      const tomeJsonFile: OpenFile = {
        path: 'tome.json',
        content: json,
        originalContent: json,
        isModified: false,
        isValid: true,
        language: 'json',
        fileType: 'text',
      };

      const newOpenFiles = new Map();
      newOpenFiles.set('tome.json', tomeJsonFile);

      // Auto-open all template files
      if (template && template.files.length > 0) {
        for (const templateFile of template.files) {
          const openFile: OpenFile = {
            path: templateFile.path,
            content: templateFile.content,
            originalContent: templateFile.content,
            isModified: false,
            isValid: templateFile.language === 'json' ? validateJsonString(templateFile.content).valid : true,
            language: templateFile.language,
            fileType: 'text',
          };
          newOpenFiles.set(templateFile.path, openFile);
        }
      }

      setOpenFiles(newOpenFiles);
      setCurrentFilePath('tome.json');

      return true;
    } catch (err) {
      if (err && typeof err === 'object' && 'type' in err) {
        setError(err as TomeErrorDetails);
      } else {
        setError({
          type: 'unknown-error',
          message: 'Failed to create new .tome file',
          details: err instanceof Error ? err.message : 'Unknown error',
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCurrentFile = useCallback((): OpenFile | null => {
    if (!currentFilePath) return null;
    return openFiles.get(currentFilePath) || null;
  }, [currentFilePath, openFiles]);

  const hasUnsavedChanges = useCallback((): boolean => {
    return Array.from(openFiles.values()).some(file => file.isModified);
  }, [openFiles]);

  const renameFile = useCallback((newFilename: string) => {
    setFilename(newFilename);
  }, []);

  const uploadFile = useCallback(async (file: File, destinationPath: string): Promise<boolean> => {
    if (!currentZip) {
      setError({
        type: 'unknown-error',
        message: 'No .tome file loaded',
        details: 'Please load or create a .tome file first',
      });
      return false;
    }

    // Check if file already exists
    if (fileExistsInZip(currentZip, destinationPath)) {
      setError({
        type: 'unknown-error',
        message: 'File already exists',
        details: `A file already exists at path: ${destinationPath}`,
      });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addFileToZip(currentZip, destinationPath, file);

      // Force re-render of file tree by updating zip reference
      const updatedZip = await currentZip.generateAsync({ type: 'arraybuffer' });
      const newZip = await new JSZip().loadAsync(updatedZip);
      setCurrentZip(newZip);

      return true;
    } catch (err) {
      if (err && typeof err === 'object' && 'type' in err) {
        setError(err as TomeErrorDetails);
      } else {
        setError({
          type: 'unknown-error',
          message: 'Failed to upload file',
          details: err instanceof Error ? err.message : 'Unknown error',
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentZip]);

  return {
    // State
    currentZip,
    filename,
    openFiles,
    currentFilePath,
    error,
    isLoading,
    // Actions
    loadFile,
    openFileByPath,
    updateFileContent,
    saveFile,
    saveAllFiles,
    download,
    createNew,
    clearError,
    renameFile,
    uploadFile,
    // Helpers
    getCurrentFile,
    hasUnsavedChanges,
  };
}
