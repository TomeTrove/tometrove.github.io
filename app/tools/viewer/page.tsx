'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Eye, ArrowLeft, FileArchive, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileBrowserSidebar } from '@/components/FileBrowserSidebar';
import { JsonEditor } from '@/components/JsonEditor';
import { ImagePreview } from '@/components/ImagePreview';
import { loadTomeFromStorage, clearTomeStorage } from '@/lib/tomeStorage';
import { loadTomeFile } from '@/lib/tomeHandler';
import { getLanguageFromExtension, isImageFile } from '@/lib/fileTree';
import type { OpenFile } from '@/lib/types';
import JSZip from 'jszip';

export default function ViewerPage() {
  const [currentZip, setCurrentZip] = useState<JSZip | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [openFile, setOpenFile] = useState<OpenFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load tome from IndexedDB on mount
  useEffect(() => {
    async function loadPreview() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await loadTomeFromStorage();

        if (data) {
          setCurrentZip(data.zip);
          setFilename(data.filename);

          // Auto-open tome.json if it exists
          const tomeJsonFile = data.zip.file('tome.json');
          if (tomeJsonFile) {
            const content = await tomeJsonFile.async('string');
            setOpenFile({
              path: 'tome.json',
              content,
              originalContent: content,
              isModified: false,
              isValid: true,
              language: 'json',
              fileType: 'text',
            });
            setCurrentFilePath('tome.json');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    }

    loadPreview();
  }, []);

  const handleFileClick = useCallback(async (path: string) => {
    if (!currentZip) return;

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
          content: '',
          originalContent: '',
          isModified: false,
          isValid: true,
          language: 'image',
          fileType: 'image',
          imageData,
        };
      } else {
        // Load text file as string
        const file = currentZip.file(path);
        if (!file) {
          throw new Error(`File not found: ${path}`);
        }
        const content = await file.async('string');

        newFile = {
          path,
          content,
          originalContent: content,
          isModified: false,
          isValid: true,
          language,
          fileType: 'text',
        };
      }

      setOpenFile(newFile);
      setCurrentFilePath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open file');
    } finally {
      setIsLoading(false);
    }
  }, [currentZip]);

  const handleClearPreview = useCallback(async () => {
    await clearTomeStorage();
    setCurrentZip(null);
    setFilename(null);
    setOpenFile(null);
    setCurrentFilePath(null);
  }, []);

  const handleOpenFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const { json, zip, filename: loadedFilename } = await loadTomeFile(file);

      setCurrentZip(zip);
      setFilename(loadedFilename);

      // Auto-open tome.json
      setOpenFile({
        path: 'tome.json',
        content: json,
        originalContent: json,
        isModified: false,
        isValid: true,
        language: 'json',
        fileType: 'text',
      });
      setCurrentFilePath('tome.json');
    } catch (err: any) {
      setError(err?.message || 'Failed to load tome file');
      setCurrentZip(null);
      setFilename(null);
      setOpenFile(null);
      setCurrentFilePath(null);
    } finally {
      setIsLoading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  if (isLoading && !currentZip) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Tome Viewer</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentZip) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={"/tools"}>
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                <h1 className="text-2xl font-bold">Tome Viewer</h1>
              </div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6 text-center">
            <div className="inline-flex h-20 w-20 rounded-full bg-muted items-center justify-center mb-4">
              <FileArchive className="h-10 w-10 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No Preview Available</h2>
              <p className="text-muted-foreground">
                Open a preview from the editor or upload a .tome file to view
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleOpenFileDialog} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload .tome File
              </Button>
              <Link href="/tools/editor">
                <Button>
                  Go to Editor
                </Button>
              </Link>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".tome"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/tools`}>
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary-foreground" />
                </div>
              </Link>
              <h1 className="text-2xl font-bold">Tome Viewer</h1>
              {filename && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {filename}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenFileDialog} className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Different File</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearPreview} className="gap-2">
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Close Preview</span>
              </Button>
              <Link href="/tools/editor">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Editor</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Browser Sidebar */}
        <FileBrowserSidebar
          zip={currentZip}
          selectedPath={currentFilePath}
          onFileSelect={handleFileClick}
          isOpen={true}
          onToggle={() => {}}
        />

        {/* Viewer Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}

            {openFile ? (
              <div className="flex-1 overflow-hidden">
                {openFile.fileType === 'image' && openFile.imageData ? (
                  <ImagePreview
                    imageData={openFile.imageData}
                    filename={openFile.path}
                  />
                ) : (
                  <JsonEditor
                    value={openFile.content}
                    onChange={() => {}} // Read-only
                    readOnly={true}
                  />
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a file from the sidebar to view</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-3">
          <p className="text-xs text-muted-foreground text-center">
            Read-only preview mode. Return to the editor to make changes.
          </p>
        </div>
      </footer>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".tome"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
