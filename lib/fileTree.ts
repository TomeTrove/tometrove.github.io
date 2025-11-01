import JSZip from 'jszip';
import type { FileNode } from './types';

/**
 * Get file extension from path
 */
function getExtension(path: string): string {
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Check if a file is an image based on extension
 */
export function isImageFile(path: string): boolean {
  const extension = getExtension(path);
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  return imageExtensions.includes(extension);
}

/**
 * Check if a file is editable based on extension
 */
export function isEditableFile(path: string): boolean {
  const extension = getExtension(path);
  const editableExtensions = ['json', 'jsonc', 'json5', 'txt', 'md'];
  return editableExtensions.includes(extension);
}

/**
 * Check if a file can be previewed (images, editable text files, etc.)
 */
export function isPreviewableFile(path: string): boolean {
  return isEditableFile(path) || isImageFile(path);
}

/**
 * Get Monaco Editor language from file extension
 */
export function getLanguageFromExtension(path: string): string {
  const extension = getExtension(path);
  const languageMap: Record<string, string> = {
    json: 'json',
    jsonc: 'json',
    json5: 'json',
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    jsx: 'javascript',
    md: 'markdown',
    txt: 'plaintext',
    html: 'html',
    css: 'css',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
  };
  return languageMap[extension] || 'plaintext';
}

/**
 * Build a file tree from ZIP entries
 */
export function buildFileTree(zip: JSZip): FileNode {
  const root: FileNode = {
    name: 'root',
    path: '',
    type: 'folder',
    children: [],
    isEditable: false,
  };

  // Get all files and directories
  const entries: Array<{ path: string; file: JSZip.JSZipObject }> = [];

  zip.forEach((relativePath, file) => {
    entries.push({ path: relativePath, file });
  });

  // Sort entries to ensure parent directories are created before children
  entries.sort((a, b) => a.path.localeCompare(b.path));

  // Build tree
  entries.forEach(({ path, file }) => {
    // Skip empty paths or root
    if (!path || path === '/') return;

    // Remove trailing slash for directories
    const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
    if (!cleanPath) return;

    const parts = cleanPath.split('/').filter(Boolean);
    let currentNode = root;

    // Navigate/create tree structure
    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join('/');

      // Find or create child node
      let child = currentNode.children?.find((c) => c.name === part);

      if (!child) {
        const isDirectory = file.dir || !isLastPart;
        child = {
          name: part,
          path: currentPath,
          type: isDirectory ? 'folder' : 'file',
          children: isDirectory ? [] : undefined,
          isEditable: !isDirectory && isPreviewableFile(currentPath),
          extension: !isDirectory ? getExtension(currentPath) : undefined,
        };

        // Add size for files (using type assertion to access internal property)
        if (!isDirectory && (file as any)._data) {
          child.size = (file as any)._data.uncompressedSize;
        }

        if (!currentNode.children) {
          currentNode.children = [];
        }
        currentNode.children.push(child);
      }

      if (child.type === 'folder') {
        currentNode = child;
      }
    });
  });

  // Sort children: folders first, then files, alphabetically within each group
  const sortChildren = (node: FileNode) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortChildren);
    }
  };

  sortChildren(root);

  return root;
}

/**
 * Find a node in the tree by path
 */
export function findNodeByPath(root: FileNode, path: string): FileNode | null {
  if (root.path === path) return root;

  if (root.children) {
    for (const child of root.children) {
      const found = findNodeByPath(child, path);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Get all file paths from tree (flattened)
 */
export function getAllFilePaths(node: FileNode): string[] {
  const paths: string[] = [];

  if (node.type === 'file') {
    paths.push(node.path);
  }

  if (node.children) {
    for (const child of node.children) {
      paths.push(...getAllFilePaths(child));
    }
  }

  return paths;
}

/**
 * Check if path is a descendant of parent path
 */
export function isDescendantOf(path: string, parentPath: string): boolean {
  if (parentPath === '') return true; // root contains everything
  return path.startsWith(parentPath + '/');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
