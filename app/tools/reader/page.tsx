'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileArchive, Upload, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadTomeFromStorage, clearTomeStorage } from '@/lib/tomeStorage';
import { loadTomeFile } from '@/lib/tomeHandler';
import { ReaderLayout } from './components/ReaderLayout';
import { RendererFactory } from './renderers/RendererFactory';
import type JSZip from 'jszip';
import type { ContentRenderer } from './renderers/BaseRenderer';

export interface TomeMetadata {
  type: string;
  title?: string;
  layout_direction?: 'vertical' | 'horizontal' | 'rtl';
  [key: string]: any;
}

export default function ReaderPage() {
  const [currentZip, setCurrentZip] = useState<JSZip | null>(null);
  const [tomeMetadata, setTomeMetadata] = useState<TomeMetadata | null>(null);
  const [renderer, setRenderer] = useState<ContentRenderer | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load tome from IndexedDB on mount
  useEffect(() => {
    async function loadReader() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await loadTomeFromStorage();

        if (data) {
          setCurrentZip(data.zip);
          setFilename(data.filename);

          // Load and parse tome.json
          const tomeJsonFile = data.zip.file('tome.json');
          if (tomeJsonFile) {
            const content = await tomeJsonFile.async('string');
            const metadata = JSON.parse(content) as TomeMetadata;
            setTomeMetadata(metadata);

            // Create renderer for this content type
            try {
              const rendererInstance = await RendererFactory.create(metadata, data.zip);
              setRenderer(rendererInstance);
            } catch (err) {
              setError(`Failed to initialize renderer: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tome');
      } finally {
        setIsLoading(false);
      }
    }

    loadReader();
  }, []);

  const handleClearReader = useCallback(async () => {
    await clearTomeStorage();
    setCurrentZip(null);
    setTomeMetadata(null);
    setRenderer(null);
    setFilename(null);
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

      const metadata = JSON.parse(json) as TomeMetadata;
      setTomeMetadata(metadata);

      try {
        const rendererInstance = await RendererFactory.create(metadata, zip);
        setRenderer(rendererInstance);
      } catch (err) {
        setError(`Failed to initialize renderer: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load tome file');
      setCurrentZip(null);
      setTomeMetadata(null);
      setRenderer(null);
      setFilename(null);
    } finally {
      setIsLoading(false);
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
                  <Menu className="h-5 w-5 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Tome Reader</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-muted-foreground">Loading reader...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentZip || !tomeMetadata || !renderer) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/tools">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                <h1 className="text-2xl font-bold">Tome Reader</h1>
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
              <h2 className="text-2xl font-bold">No Tome Loaded</h2>
              <p className="text-muted-foreground">
                Open a tome from the editor or upload a .tome file to read
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

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
              <Link href="/tools">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Menu className="h-5 w-5 text-primary-foreground" />
                </div>
              </Link>
              <h1 className="text-2xl font-bold">{tomeMetadata.title || 'Tome Reader'}</h1>
              {filename && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {filename}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenFileDialog} className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearReader} className="gap-2">
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Close</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Reader Content */}
      {error ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded max-w-md">
            <p className="font-semibold mb-2">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <ReaderLayout
          renderer={renderer}
          metadata={tomeMetadata}
        />
      )}

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
