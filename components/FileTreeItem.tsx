'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileJson,
  FileText,
  File,
} from 'lucide-react';
import type { FileNode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/fileTree';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  selectedPath?: string | null;
  onSelect: (path: string) => void;
}

export function FileTreeItem({
  node,
  level,
  selectedPath,
  onSelect,
}: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isFolder = node.type === 'folder';
  const isSelected = selectedPath === node.path;
  const isTomeJson = node.path === 'tome.json';

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else if (node.isEditable) {
      onSelect(node.path);
    }
  };

  const getIcon = () => {
    if (isFolder) {
      return isExpanded ? (
        <FolderOpen className="h-4 w-4 text-blue-500" />
      ) : (
        <Folder className="h-4 w-4 text-blue-500" />
      );
    }

    if (node.extension === 'json') {
      return <FileJson className="h-4 w-4 text-yellow-500" />;
    }

    if (node.extension === 'txt' || node.extension === 'md') {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }

    return <File className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div>
      {/* Current item */}
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-accent group',
          isSelected && 'bg-accent',
          !node.isEditable && !isFolder && 'cursor-default opacity-60'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {/* Expand/collapse icon for folders */}
        {isFolder && (
          <div className="w-4 h-4">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )}

        {/* File/folder icon */}
        <div className="w-4 h-4">{getIcon()}</div>

        {/* Name */}
        <span
          className={cn(
            'flex-1 text-sm truncate',
            isSelected && 'font-medium',
            isTomeJson && 'text-primary font-medium'
          )}
        >
          {node.name}
        </span>

        {/* Size for files */}
        {!isFolder && node.size !== undefined && (
          <span className="text-xs text-muted-foreground">{formatFileSize(node.size)}</span>
        )}
      </div>

      {/* Children (if folder and expanded) */}
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
