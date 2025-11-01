'use client';

import { useMemo } from 'react';
import { PanelLeftClose, PanelLeft, Upload } from 'lucide-react';
import { FileTree } from './FileTree';
import { Button } from './ui/button';
import { buildFileTree } from '@/lib/fileTree';
import type { FileNode } from '@/lib/types';
import JSZip from 'jszip';

interface FileBrowserSidebarProps {
  zip: JSZip | null;
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onUploadClick?: () => void;
}

export function FileBrowserSidebar({
  zip,
  selectedPath,
  onFileSelect,
  isOpen,
  onToggle,
  onUploadClick,
}: FileBrowserSidebarProps) {
  const fileTree = useMemo(() => {
    if (!zip) return null;
    return buildFileTree(zip);
  }, [zip]);

  if (!isOpen) {
    return (
      <div className="border-r bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="m-2"
          title="Show file browser"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 border-r bg-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-semibold px-2">Files</h3>
        <div className="flex items-center gap-1">
          {onUploadClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onUploadClick}
              className="h-8 w-8"
              title="Upload file to archive"
            >
              <Upload className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
            title="Hide file browser"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto">
        {fileTree ? (
          <FileTree
            root={fileTree}
            selectedPath={selectedPath}
            onFileSelect={onFileSelect}
          />
        ) : (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No files loaded
          </div>
        )}
      </div>
    </div>
  );
}
