'use client';

import { useCallback, useState } from 'react';
import { Upload, FileArchive, FilePlus } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';
import { Button } from './ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onCreateNew?: () => void;
  disabled?: boolean;
}

export function FileUploader({ onFileSelect, onCreateNew, disabled }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const tomeFile = files.find((file) => file.name.toLowerCase().endsWith('.tome'));

      if (tomeFile) {
        setSelectedFile(tomeFile);
        onFileSelect(tomeFile);
      }
    },
    [onFileSelect, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg p-12 text-center transition-all',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="tome-file-input"
        className="hidden"
        accept=".tome"
        onChange={handleFileInput}
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          'rounded-full p-4 transition-colors',
          isDragging ? 'bg-primary/10' : 'bg-muted'
        )}>
          {selectedFile ? (
            <FileArchive className="h-12 w-12 text-primary" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        {selectedFile ? (
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-foreground">
              {isDragging ? 'Drop your .tome file here' : 'Drag & drop your .tome file'}
            </p>
            <p className="text-sm text-muted-foreground">or</p>
            <div className="flex items-center justify-center gap-3">
              <label
                htmlFor="tome-file-input"
                className={cn(
                  'inline-flex items-center justify-center px-6 py-2 rounded-md text-sm font-medium',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  'cursor-pointer transition-colors',
                  disabled && 'pointer-events-none opacity-50'
                )}
              >
                Choose File
              </label>
              {onCreateNew && (
                <Button
                  variant="outline"
                  onClick={onCreateNew}
                  disabled={disabled}
                  className="gap-2"
                >
                  <FilePlus className="h-4 w-4" />
                  Create New
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedFile && !disabled && (
        <button
          onClick={() => {
            setSelectedFile(null);
            const input = document.getElementById('tome-file-input') as HTMLInputElement;
            if (input) input.value = '';
          }}
          className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
