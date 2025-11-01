import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { loadTomeFile, updateTomeJson, downloadTome, createNewTome } from '@/lib/tomeHandler';
import { validateJsonString } from '@/lib/utils';
import type { TomeErrorDetails } from '@/lib/types';

export function useTomeFile() {
  const [currentZip, setCurrentZip] = useState<JSZip | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<string>('');
  const [originalJsonContent, setOriginalJsonContent] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [error, setError] = useState<TomeErrorDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const { json, zip, filename: loadedFilename } = await loadTomeFile(file);

      setCurrentZip(zip);
      setFilename(loadedFilename);
      setJsonContent(json);
      setOriginalJsonContent(json);
      setIsModified(false);
      setIsValid(true);
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
      // Reset state on error
      setCurrentZip(null);
      setFilename(null);
      setJsonContent('');
      setOriginalJsonContent('');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateJson = useCallback((value: string) => {
    setJsonContent(value);
    setIsModified(value !== originalJsonContent);

    const validation = validateJsonString(value);
    setIsValid(validation.valid);
  }, [originalJsonContent]);

  const saveChanges = useCallback(() => {
    if (!currentZip || !isValid) return false;

    try {
      const updatedZip = updateTomeJson(currentZip, jsonContent);
      setCurrentZip(updatedZip);
      setOriginalJsonContent(jsonContent);
      setIsModified(false);
      setError(null);
      return true;
    } catch (err) {
      if (err && typeof err === 'object' && 'type' in err) {
        setError(err as TomeErrorDetails);
      }
      return false;
    }
  }, [currentZip, jsonContent, isValid]);

  const download = useCallback(async () => {
    if (!currentZip || !filename || !isValid) return false;

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
  }, [currentZip, filename, isValid]);

  const reset = useCallback(() => {
    setJsonContent(originalJsonContent);
    setIsModified(false);
    setIsValid(true);
    setError(null);
  }, [originalJsonContent]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createNew = useCallback((newFilename: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { json, zip, filename: createdFilename } = createNewTome(newFilename);

      setCurrentZip(zip);
      setFilename(createdFilename);
      setJsonContent(json);
      setOriginalJsonContent(json);
      setIsModified(false);
      setIsValid(true);
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

  return {
    // State
    currentZip,
    filename,
    jsonContent,
    isValid,
    isModified,
    error,
    isLoading,
    // Actions
    loadFile,
    updateJson,
    saveChanges,
    download,
    reset,
    clearError,
    createNew,
  };
}
