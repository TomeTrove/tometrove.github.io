'use client';

import { useMemo } from 'react';
import { FileTreeItem } from './FileTreeItem';
import type { FileNode } from '@/lib/types';

interface FileTreeProps {
  root: FileNode;
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
}

export function FileTree({ root, selectedPath, onFileSelect }: FileTreeProps) {
  // Only show children, not the root itself
  const nodes = useMemo(() => root.children || [], [root]);

  if (nodes.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground text-center">
        No files in archive
      </div>
    );
  }

  return (
    <div className="py-2">
      {nodes.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          level={0}
          selectedPath={selectedPath}
          onSelect={onFileSelect}
        />
      ))}
    </div>
  );
}
