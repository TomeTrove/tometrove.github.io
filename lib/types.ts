import JSZip from 'jszip';

export interface TomeFile {
  filename: string;
  zip: JSZip;
  originalFile: File;
}

export interface EditorState {
  jsonContent: string;
  isModified: boolean;
  isValid: boolean;
  error: string | null;
}

export type TomeError =
  | 'invalid-file-type'
  | 'corrupt-zip'
  | 'missing-tome-json'
  | 'invalid-json'
  | 'file-too-large'
  | 'unknown-error';

export interface TomeErrorDetails {
  type: TomeError;
  message: string;
  details?: string;
}

export interface TomeJsonTemplate {
  name: string;
  version: string;
  description: string;
  author: string;
  created: string;
}

export type FileNodeType = 'file' | 'folder';

export interface FileNode {
  name: string;
  path: string;
  type: FileNodeType;
  size?: number;
  children?: FileNode[];
  isEditable: boolean;
  extension?: string;
}

export type FileType = 'text' | 'image' | 'binary';

export interface OpenFile {
  path: string;
  content: string;
  originalContent: string;
  isModified: boolean;
  isValid: boolean;
  language: string; // for monaco editor
  fileType: FileType;
  imageData?: ArrayBuffer; // for image files
}

export interface FileManagementOperation {
  type: 'add' | 'remove' | 'rename';
  path: string;
  newPath?: string; // for rename
  content?: string; // for add
}

export interface TemplateFile {
  path: string;
  content: string;
  language: string;
}

export interface TomeTemplate {
  id: string;
  name: string;
  description: string;
  tomeJson: Record<string, any>;
  files: TemplateFile[];
}

export interface TemplateConfig {
  templates: TomeTemplate[];
}

export interface EPUBMetadata {
  title: string;
  authors?: string[];
  publisher?: string;
  published_date?: string;
  description?: string;
  language: string;
  layout_direction?: 'horizontal' | 'vertical';
  tags: string[];
  cover_image?: string;
}

export type MetadataMode = 'extracted' | 'reference' | 'both';

export type LayoutDirection = 'horizontal' | 'vertical';

export interface CBZMetadata {
  title: string;
  chapter_number?: number;
  comic_title?: string;
  series?: string;
  volume_number?: number;
  authors?: string[];
  description?: string;
  publisher?: string;
  published_date?: string;
  reading_direction: 'ltr' | 'rtl';
  layout_direction?: 'horizontal' | 'vertical';
  language: string;
  tags: string[];
}
