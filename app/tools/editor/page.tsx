'use client';

import { useCallback, useState, useRef } from 'react';
import { FilePlus, Upload, ChevronDown, Eye } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { JsonEditor } from '@/components/JsonEditor';
import { ImagePreview } from '@/components/ImagePreview';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ActionBar } from '@/components/ActionBar';
import { CreateTomeDialog } from '@/components/CreateTomeDialog';
import { UploadFileDialog } from '@/components/UploadFileDialog';
import { FileBrowserSidebar } from '@/components/FileBrowserSidebar';
import { Button } from '@/components/ui/button';
import { useMultiFileTome } from '@/hooks/useMultiFileTome';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/components/ui/toast';
import { prettifyJson } from '@/lib/utils';
import { saveTomeToStorage } from '@/lib/tomeStorage';
import { getAbsoluteUrl } from '@/lib/pathUtils';
import Link from 'next/link';

export default function Home() {
  const {
    currentZip,
    filename,
    currentFilePath,
    error,
    isLoading,
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
    getCurrentFile,
    hasUnsavedChanges,
  } = useMultiFileTome();

  const { showToast, ToastComponent } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRenamingFile, setIsRenamingFile] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFile = getCurrentFile();
  const jsonContent = currentFile?.content || '';
  const isValid = currentFile?.isValid ?? true;
  const isModified = currentFile?.isModified ?? false;

  const handleFileSelect = useCallback(async (file: File) => {
    await loadFile(file);
    setIsSidebarOpen(true);
  }, [loadFile]);

  const handleFileClick = useCallback((path: string) => {
    openFileByPath(path);
  }, [openFileByPath]);

  const handleJsonChange = useCallback((value: string) => {
    if (currentFilePath) {
      updateFileContent(currentFilePath, value);
    }
  }, [currentFilePath, updateFileContent]);

  const handleSave = useCallback(() => {
    if (!currentZip || !currentFilePath || !isValid || !isModified) return;
    saveFile(currentFilePath);
  }, [currentZip, currentFilePath, isValid, isModified, saveFile]);

  const handleDownload = useCallback(async () => {
    if (!currentZip || !filename) return;

    // Save all modified files before download
    if (hasUnsavedChanges()) {
      saveAllFiles();
    }

    await download();
  }, [currentZip, filename, hasUnsavedChanges, saveAllFiles, download]);

  const handleReset = useCallback(() => {
    if (!isModified || !currentFilePath) return;
    // Reset by reopening the file
    openFileByPath(currentFilePath);
  }, [isModified, currentFilePath, openFileByPath]);

  const handleFormat = useCallback(() => {
    if (!currentZip || !currentFilePath) return;
    const formatted = prettifyJson(jsonContent);
    updateFileContent(currentFilePath, formatted);
  }, [currentZip, currentFilePath, jsonContent, updateFileContent]);

  const handleCreateNew = useCallback((newFilename: string, templateId: string) => {
    createNew(newFilename, templateId);
    setIsSidebarOpen(true);
  }, [createNew]);

  const handleOpenCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
    setShowHeaderDropdown(false);
  }, []);

  const handleOpenTomeFile = useCallback(() => {
    fileInputRef.current?.click();
    setShowHeaderDropdown(false);
  }, []);

  const handleTomeFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [handleFileSelect]);

  const handleRenameStart = useCallback(() => {
    if (filename) {
      setRenameValue(filename.replace('.tome', ''));
      setIsRenamingFile(true);
    }
  }, [filename]);

  const handleRenameConfirm = useCallback(() => {
    if (renameValue.trim()) {
      const newFilename = renameValue.trim().endsWith('.tome')
        ? renameValue.trim()
        : renameValue.trim() + '.tome';
      renameFile(newFilename);
      setIsRenamingFile(false);
    }
  }, [renameValue, renameFile]);

  const handleRenameCancel = useCallback(() => {
    setIsRenamingFile(false);
    setRenameValue('');
  }, []);

  const handleOpenUploadDialog = useCallback(() => {
    setIsUploadDialogOpen(true);
  }, []);

  const handleUpload = useCallback(async (file: File, path: string) => {
    const success = await uploadFile(file, path);
    if (success) {
      showToast('File uploaded successfully', 'success');
    }
  }, [uploadFile, showToast]);

  const handlePreview = useCallback(async () => {
    if (!currentZip || !filename) return;

    try {
      // Auto-save all modified files
      if (hasUnsavedChanges()) {
        saveAllFiles();
      }

      // Save to IndexedDB
      await saveTomeToStorage(currentZip, filename);

      // Open viewer in new tab with basePath support
      const viewerUrl = getAbsoluteUrl('/tools/viewer');
      window.open(viewerUrl, '_blank');

      showToast('Opening preview...', 'success');
    } catch (error) {
      showToast('Failed to open preview', 'error');
      console.error('Preview error:', error);
    }
  }, [currentZip, filename, hasUnsavedChanges, saveAllFiles, showToast]);

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onDownload: handleDownload,
    onReset: handleReset,
    onFormat: handleFormat,
  });

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Link href={`/tools`}>
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">T</span>
                  </div>
                </Link>
                <h1 className="text-2xl font-bold">Tome Editor</h1>
              </div>
              {filename && !isRenamingFile ? (
                <button
                  onClick={handleRenameStart}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                  title="Click to rename"
                >
                  {filename}
                </button>
              ) : filename && isRenamingFile ? (
                <div className="flex items-center gap-2 hidden sm:flex">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameConfirm();
                      if (e.key === 'Escape') handleRenameCancel();
                    }}
                    onBlur={handleRenameConfirm}
                    className="text-sm px-2 py-1 border rounded bg-background"
                    autoFocus
                  />
                  <span className="text-sm text-muted-foreground">.tome</span>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {currentZip && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  disabled={isLoading}
                  className="gap-2"
                  title="Preview in viewer (opens in new tab)"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
              )}
              <div className="relative">
                <div className="flex gap-0">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleOpenCreateDialog}
                    disabled={isLoading}
                    className="gap-2 rounded-r-none"
                  >
                    <FilePlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create New</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowHeaderDropdown(!showHeaderDropdown)}
                    disabled={isLoading}
                    className="rounded-l-none border-l border-primary-foreground/20 px-2"
                    aria-label="More options"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {showHeaderDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowHeaderDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg z-20">
                      <div className="py-1">
                        <button
                          onClick={handleOpenCreateDialog}
                          disabled={isLoading}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FilePlus className="h-4 w-4" />
                          <span>Create New .tome</span>
                        </button>
                        <button
                          onClick={handleOpenTomeFile}
                          disabled={isLoading}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Open Existing .tome</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hidden file input for opening tome files */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".tome"
              onChange={handleTomeFileChange}
              className="hidden"
            />
          </div>
        </div>
      </header>

      {/* Create New Dialog */}
      <CreateTomeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateNew}
      />

      {/* Upload File Dialog */}
      <UploadFileDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUpload}
      />

      {/* Toast Notifications */}
      {ToastComponent}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!currentZip ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
              {error && (
                <ErrorDisplay error={error} onDismiss={clearError} />
              )}
              <FileUploader
                onFileSelect={handleFileSelect}
                onCreateNew={handleOpenCreateDialog}
                disabled={isLoading}
              />
              <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>A .tome file is a ZIP archive containing a tome.json file at the root.</p>
                <p>Upload your .tome file to edit the JSON content directly in your browser.</p>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground">
                <p className="font-semibold mb-2">Keyboard Shortcuts:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><kbd className="px-2 py-1 bg-background rounded">Ctrl/Cmd + S</kbd> Save</div>
                  <div><kbd className="px-2 py-1 bg-background rounded">Ctrl/Cmd + D</kbd> Download</div>
                  <div><kbd className="px-2 py-1 bg-background rounded">Ctrl/Cmd + Shift + F</kbd> Format</div>
                  <div><kbd className="px-2 py-1 bg-background rounded">Ctrl/Cmd + Shift + R</kbd> Reset</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* File Browser Sidebar */}
            <FileBrowserSidebar
              zip={currentZip}
              selectedPath={currentFilePath}
              onFileSelect={handleFileClick}
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              onUploadClick={handleOpenUploadDialog}
            />

            {/* Editor Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {currentFile?.fileType !== 'image' && (
                  <ActionBar
                    filename={currentFilePath || filename}
                    isModified={isModified}
                    isValid={isValid}
                    onSave={handleSave}
                    onDownload={handleDownload}
                    onReset={handleReset}
                    onFormat={handleFormat}
                    disabled={isLoading}
                  />
                )}
              

              <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
                {error && (
                  <ErrorDisplay error={error} onDismiss={clearError} />
                )}

                {currentFile ? (
                  <div className="flex-1 overflow-hidden">
                    {currentFile.fileType === 'image' && currentFile.imageData ? (
                      <ImagePreview
                        imageData={currentFile.imageData}
                        filename={currentFile.path}
                      />
                    ) : (
                      <JsonEditor
                        value={jsonContent}
                        onChange={handleJsonChange}
                        readOnly={isLoading}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <p>Select a file from the sidebar to edit</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-3">
          <p className="text-xs text-muted-foreground text-center">
            All processing happens locally in your browser. Your files are never uploaded to a server.
          </p>
        </div>
      </footer>
    </div>
  );
}
