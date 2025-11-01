'use client';

import React, { useState, useCallback } from 'react';
import { Upload, ChevronRight, ChevronLeft, Download, AlertCircle, Check } from 'lucide-react';
import {
  validateEPUBFile,
  getEPUBMetadata,
  generateTomeJson,
  createTomeFromEPUB,
  downloadTomeFile,
  sanitizeFilename,
} from '@/lib/epubConverter';
import { TomeErrorDetails, EPUBMetadata, MetadataMode } from '@/lib/types';

type Step = 'upload' | 'configure' | 'preview' | 'download';

interface FormData {
  title: string;
  tomeType: string;
  metadataMode: MetadataMode;
  authors: string[];
  description: string;
  publisher: string;
  published_date: string;
  language: string;
  layout_direction: 'horizontal' | 'vertical';
  tags: string[];
}

const STANDARD_TOME_TYPES = [
  { value: 'epub', label: 'EPUB', description: 'Wrapped EPUB file (default, fully compatible with EPUB readers)' },
  { value: 'book', label: 'Book', description: 'A complete published book' },
  { value: 'book_chapter', label: 'Book Chapter', description: 'A single chapter from a book' },
  { value: 'ebook', label: 'eBook', description: 'Digital book publication' },
];

export default function EPUBConverterPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [tomeType, setTomeType] = useState<string>('epub');
  const [metadataMode, setMetadataMode] = useState<MetadataMode>('extracted');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TomeErrorDetails | null>(null);
  const [generatedTome, setGeneratedTome] = useState<{ zip: any; filename: string; json: string; opfPath: string } | null>(null);
  const [extractedMetadata, setExtractedMetadata] = useState<EPUBMetadata | null>(null);
  const [isCustomType, setIsCustomType] = useState(false);
  const [customTomeType, setCustomTomeType] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    tomeType: 'book',
    metadataMode: 'extracted',
    authors: [],
    description: '',
    publisher: '',
    published_date: '',
    language: 'en',
    layout_direction: 'horizontal',
    tags: [],
  });

  const [authorInput, setAuthorInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setError(null);
      setLoading(true);

      // Validate EPUB file
      await validateEPUBFile(file);

      // Extract metadata
      const epubZip = new (await import('jszip')).default();
      const loadedZip = await epubZip.loadAsync(file);
      const metadata = await getEPUBMetadata(loadedZip);

      setEpubFile(file);
      setExtractedMetadata(metadata);

      // Auto-fill form data from extracted metadata
      setFormData((prev) => ({
        ...prev,
        title: metadata.title,
        authors: metadata.authors || [],
        description: metadata.description || '',
        publisher: metadata.publisher || '',
        published_date: metadata.published_date || '',
        language: metadata.language || 'en',
        tags: metadata.tags || [],
      }));

      setCurrentStep('configure');
    } catch (err) {
      const tomeError = err as TomeErrorDetails;
      setError(tomeError);
      setEpubFile(null);
      setExtractedMetadata(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        authors: [...prev.authors, authorInput.trim()],
      }));
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleMetadataChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateMetadata = (): boolean => {
    if (!formData.title.trim()) {
      setError({
        type: 'unknown-error',
        message: 'Title is required',
      });
      return false;
    }

    setError(null);
    return true;
  };

  const handlePreviewTome = () => {
    if (!validateMetadata()) {
      return;
    }
    setCurrentStep('preview');
  };

  const handleGenerateTome = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!epubFile) {
        throw new Error('No EPUB file selected');
      }

      const selectedTomeType = isCustomType ? customTomeType : tomeType;

      const metadata: EPUBMetadata = {
        title: formData.title,
        authors: formData.authors.length > 0 ? formData.authors : undefined,
        description: formData.description || undefined,
        publisher: formData.publisher || undefined,
        published_date: formData.published_date || undefined,
        language: formData.language,
        layout_direction: formData.layout_direction,
        tags: formData.tags,
      };

      const filename = `${sanitizeFilename(epubFile.name)}.tome`;
      const tome = await createTomeFromEPUB(
        epubFile,
        metadata,
        selectedTomeType,
        metadataMode,
        filename
      );

      setGeneratedTome(tome);
      setCurrentStep('download');
    } catch (err) {
      const tomeError = err as TomeErrorDetails;
      setError(tomeError);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!generatedTome) return;

      setLoading(true);
      setError(null);

      await downloadTomeFile(generatedTome.zip, generatedTome.filename);
      setCurrentStep('download');
    } catch (err) {
      const tomeError = err as TomeErrorDetails;
      setError(tomeError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEpubFile(null);
    setExtractedMetadata(null);
    setGeneratedTome(null);
    setCurrentStep('upload');
    setError(null);
    setTomeType('epub');
    setMetadataMode('extracted');
    setIsCustomType(false);
    setCustomTomeType('');
    setFormData({
      title: '',
      tomeType: 'epub',
      metadataMode: 'extracted',
      authors: [],
      description: '',
      publisher: '',
      published_date: '',
      language: 'en',
      layout_direction: 'horizontal',
      tags: [],
    });
    setAuthorInput('');
    setTagInput('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            currentStep === 'upload' || ['configure', 'preview', 'download'].includes(currentStep)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            {['configure', 'preview', 'download'].includes(currentStep) ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className={`flex-1 h-1 ${
            ['configure', 'preview', 'download'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
          }`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            currentStep === 'configure' || ['preview', 'download'].includes(currentStep)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            {['preview', 'download'].includes(currentStep) ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <div className={`flex-1 h-1 ${
            ['preview', 'download'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
          }`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            currentStep === 'preview' || currentStep === 'download'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            {currentStep === 'download' ? <Check className="w-4 h-4" /> : '3'}
          </div>
          <div className={`flex-1 h-1 ${currentStep === 'download' ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            currentStep === 'download' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            4
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Upload EPUB</span>
          <span>Configure</span>
          <span>Preview</span>
          <span>Download</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">{error.message}</p>
            {error.details && <p className="text-sm text-muted-foreground mt-1">{error.details}</p>}
          </div>
        </div>
      )}

      {/* Step 1: Upload */}
      {currentStep === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById('epub-input')?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Select EPUB File</h3>
            <p className="text-sm text-muted-foreground mb-4">Drag and drop your EPUB file here or click to browse</p>
            <input
              id="epub-input"
              type="file"
              accept=".epub"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">Maximum file size: 500MB</p>
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {currentStep === 'configure' && (
        <div className="space-y-6">
          {/* Tome Type Selection */}
          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Tome Type</h3>
            <div className="space-y-3 mb-4">
              {STANDARD_TOME_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tomeType"
                    value={type.value}
                    checked={!isCustomType && tomeType === type.value}
                    onChange={(e) => {
                      setTomeType(e.target.value);
                      setIsCustomType(false);
                    }}
                    className="w-4 h-4"
                  />
                  <span>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </span>
                </label>
              ))}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tomeType"
                  checked={isCustomType}
                  onChange={() => setIsCustomType(true)}
                  className="w-4 h-4"
                />
                <span>
                  <div className="font-medium">Custom Type</div>
                  <div className="text-sm text-muted-foreground">Specify a custom tome type</div>
                </span>
              </label>
            </div>

            {isCustomType && (
              <input
                type="text"
                value={customTomeType}
                onChange={(e) => setCustomTomeType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                placeholder="Enter custom tome type (e.g., novel, documentation)"
              />
            )}
          </div>

          {/* Metadata Handling Mode */}
          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Metadata Handling</h3>
            <p className="text-sm text-muted-foreground mb-4">Choose how to handle EPUB metadata:</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="metadataMode"
                  value="extracted"
                  checked={metadataMode === 'extracted'}
                  onChange={(e) => setMetadataMode(e.target.value as MetadataMode)}
                  className="w-4 h-4"
                />
                <span>
                  <div className="font-medium">Extracted with Reference</div>
                  <div className="text-sm text-muted-foreground">Extract metadata into tome.json and include reference to OPF source</div>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="metadataMode"
                  value="reference"
                  checked={metadataMode === 'reference'}
                  onChange={(e) => setMetadataMode(e.target.value as MetadataMode)}
                  className="w-4 h-4"
                />
                <span>
                  <div className="font-medium">Reference Only</div>
                  <div className="text-sm text-muted-foreground">Point to EPUB OPF metadata without extracting (minimal tome.json)</div>
                </span>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  placeholder="Book title"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Authors</label>
                <div className="flex gap-2 mt-1 mb-2">
                  <input
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAuthor()}
                    className="flex-1 px-3 py-2 border rounded-lg bg-background"
                    placeholder="Add author name"
                  />
                  <button
                    onClick={handleAddAuthor}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                {formData.authors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.authors.map((author, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {author}
                        <button onClick={() => handleRemoveAuthor(index)} className="hover:text-destructive">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  placeholder="Book synopsis or summary"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => handleMetadataChange('publisher', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                    placeholder="Publisher name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Published Date</label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => handleMetadataChange('published_date', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleMetadataChange('language', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="en">English</option>
                    <option value="ja">Japanese</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                    <option value="zh">Chinese</option>
                    <option value="ko">Korean</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Layout Direction</label>
                  <select
                    value={formData.layout_direction}
                    onChange={(e) => handleMetadataChange('layout_direction', e.target.value as 'horizontal' | 'vertical')}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="horizontal">Horizontal (Books, Manga)</option>
                    <option value="vertical">Vertical (Webtoons)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2 mt-1 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-3 py-2 border rounded-lg bg-background"
                    placeholder="Add tag"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button onClick={() => handleRemoveTag(index)} className="hover:text-destructive">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep('upload')}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 border rounded-lg hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handlePreviewTome}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {currentStep === 'preview' && !generatedTome && (
        <div className="space-y-6">
          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Metadata Summary</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Title:</span> {formData.title}
              </div>
              {formData.authors.length > 0 && (
                <div>
                  <span className="font-medium">Authors:</span> {formData.authors.join(', ')}
                </div>
              )}
              {formData.publisher && (
                <div>
                  <span className="font-medium">Publisher:</span> {formData.publisher}
                </div>
              )}
              {formData.published_date && (
                <div>
                  <span className="font-medium">Published:</span> {formData.published_date}
                </div>
              )}
              <div>
                <span className="font-medium">Language:</span> {formData.language}
              </div>
              <div>
                <span className="font-medium">Layout Direction:</span> {formData.layout_direction}
              </div>
              <div>
                <span className="font-medium">Metadata Mode:</span> {metadataMode}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Tome Type & Configuration</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Type:</span> {isCustomType ? customTomeType : tomeType}
              </div>
              <div>
                <span className="font-medium">Metadata Handling:</span> {metadataMode}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Tome Structure</h3>
            <div className="text-sm space-y-2 font-mono">
              <div>my-book.tome/</div>
              <div className="ml-4">├── tome.json</div>
              <div className="ml-4">├── mimetype</div>
              <div className="ml-4">├── META-INF/</div>
              <div className="ml-8">└── container.xml</div>
              <div className="ml-4">└── [EPUB content preserved]</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep('configure')}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 border rounded-lg hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleGenerateTome}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Tome'}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Download */}
      {currentStep === 'download' && generatedTome && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <Check className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Conversion Successful!</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-4">
              Your EPUB file has been converted to Tome format and is ready for download.
            </p>
            <div className="bg-background/50 rounded p-3 text-left text-xs font-mono">
              <div>File: {generatedTome.filename}</div>
              <div>Type: {isCustomType ? customTomeType : tomeType}</div>
              <div>Metadata Mode: {metadataMode}</div>
            </div>
          </div>

          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Generated tome.json</h3>
            <pre className="bg-background rounded p-4 text-xs overflow-x-auto max-h-64">
              <code>{generatedTome.json}</code>
            </pre>
          </div>

          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Download your .tome file</li>
              <li>Use the Tome Viewer to preview your converted file</li>
              <li>Use the Tome Editor to make any adjustments to metadata or files</li>
              <li>Share your tome with others</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep('preview')}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 border rounded-lg hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {loading ? 'Downloading...' : 'Download Tome'}
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full px-6 py-2 border rounded-lg hover:bg-muted text-center"
          >
            Convert Another File
          </button>
        </div>
      )}
    </div>
  );
}
