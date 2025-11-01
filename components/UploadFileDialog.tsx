'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UploadFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, path: string) => Promise<void>;
}

export function UploadFileDialog({ open, onOpenChange, onUpload }: UploadFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [destinationPath, setDestinationPath] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');

      // Auto-suggest destination path if empty
      if (!destinationPath) {
        setDestinationPath(file.name);
      }
    }
  };

  const validatePath = (path: string): boolean => {
    if (!path.trim()) {
      setError('Please enter a destination path');
      return false;
    }

    // Check for invalid characters
    if (/[<>:"|?*]/.test(path)) {
      setError('Path contains invalid characters');
      return false;
    }

    // Prevent uploading to reserved names
    if (path.toLowerCase() === 'tome.json') {
      setError('Cannot overwrite tome.json through upload');
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const cleanPath = destinationPath.trim();
    if (!validatePath(cleanPath)) {
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await onUpload(selectedFile, cleanPath);

      // Reset and close
      setSelectedFile(null);
      setDestinationPath('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setDestinationPath('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isUploading) {
      handleUpload();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File to .tome Archive
          </DialogTitle>
          <DialogDescription>
            Select a file and specify where to place it in the archive.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">File</Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-path">Destination Path</Label>
            <Input
              id="destination-path"
              placeholder="e.g., docs/guide.md or images/logo.png"
              value={destinationPath}
              onChange={(e) => {
                setDestinationPath(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Specify the full path including filename and extension
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold text-foreground">Tips:</p>
            <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
              <li>• Use forward slashes (/) to create folder structure</li>
              <li>• Example: &quot;images/logo.png&quot; creates an images folder</li>
              <li>• File will be added immediately to the archive</li>
              <li>• Remember to download the .tome file to save changes</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
