'use client';

import React, { useState, useCallback } from 'react';
import { Upload, ChevronRight, ChevronLeft, Download, AlertCircle, Check } from 'lucide-react';
import {
  validateCBZFile,
  extractImagesFromCBZ,
  generateTomeJson,
  createTomeFromCBZ,
  downloadTomeFile,
  sanitizeFilename,
  CBZImage,
  CBZMetadata,
} from '@/lib/cbzConverter';
import { TomeErrorDetails } from '@/lib/types';

type Step = 'upload' | 'metadata' | 'preview' | 'download';

interface FormData {
  title: string;
  series: string;
  volume_number: string;
  chapter_number: string;
  comic_title: string;
  authors: string[];
  description: string;
  publisher: string;
  published_date: string;
  reading_direction: 'ltr' | 'rtl';
  layout_direction: 'horizontal' | 'vertical';
  language: string;
  tags: string[];
}

export default function CBZConverterPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [cbzFile, setCbzFile] = useState<File | null>(null);
  const [images, setImages] = useState<CBZImage[]>([]);
  const [tomeType, setTomeType] = useState<'comic_chapter' | 'comic_volume' | 'comic_series'>('comic_chapter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TomeErrorDetails | null>(null);
  const [generatedTome, setGeneratedTome] = useState<{ zip: any; filename: string; json: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    series: '',
    volume_number: '1',
    chapter_number: '1',
    comic_title: '',
    authors: [],
    description: '',
    publisher: '',
    published_date: '',
    reading_direction: 'ltr',
    layout_direction: 'horizontal',
    language: 'en',
    tags: [],
  });

  const [authorInput, setAuthorInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setError(null);
      setLoading(true);

      // Validate CBZ file
      await validateCBZFile(file);

      // Extract images
      const extractedImages = await extractImagesFromCBZ(file);

      setCbzFile(file);
      setImages(extractedImages);

      // Auto-fill title from filename
      const suggestedTitle = sanitizeFilename(file.name);
      setFormData((prev) => ({
        ...prev,
        title: suggestedTitle.replace(/-/g, ' '),
      }));

      setCurrentStep('metadata');
    } catch (err) {
      const tomeError = err as TomeErrorDetails;
      setError(tomeError);
      setCbzFile(null);
      setImages([]);
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

    if (tomeType === 'comic_chapter' && !formData.comic_title.trim()) {
      setError({
        type: 'unknown-error',
        message: 'Comic title is required for comic_chapter type',
      });
      return false;
    }

    if (tomeType === 'comic_volume' && !formData.series.trim()) {
      setError({
        type: 'unknown-error',
        message: 'Series name is required for comic_volume type',
      });
      return false;
    }

    setError(null);
    return true;
  };

  const handleGenerateTome = async () => {
    try {
      if (!validateMetadata()) {
        return;
      }

      setLoading(true);
      setError(null);
      if (!cbzFile) {
        throw new Error('No CBZ file selected');
      }
      const metadata: CBZMetadata = {
        title: formData.title,
        chapter_number: tomeType === 'comic_chapter' ? parseInt(formData.chapter_number) : undefined,
        comic_title: tomeType === 'comic_chapter' ? formData.comic_title : undefined,
        series: tomeType === 'comic_volume' ? formData.series : undefined,
        volume_number: tomeType === 'comic_volume' ? parseInt(formData.volume_number) : undefined,
        authors: formData.authors,
        description: formData.description,
        publisher: formData.publisher,
        published_date: formData.published_date,
        reading_direction: formData.reading_direction,
        layout_direction: formData.layout_direction,
        language: formData.language,
        tags: formData.tags,
      };

      const filename = `${sanitizeFilename(cbzFile.name)}.tome`;
      const tome = await createTomeFromCBZ(images, metadata, tomeType, filename);

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
    } catch (err) {
      const tomeError = err as TomeErrorDetails;
      setError(tomeError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCbzFile(null);
    setImages([]);
    setGeneratedTome(null);
    setCurrentStep('upload');
    setError(null);
    setFormData({
      title: '',
      series: '',
      volume_number: '1',
      chapter_number: '1',
      comic_title: '',
      authors: [],
      description: '',
      publisher: '',
      published_date: '',
      reading_direction: 'ltr',
      layout_direction: 'horizontal',
      language: 'en',
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
            currentStep === 'upload' || ['metadata', 'preview', 'download'].includes(currentStep)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            {['metadata', 'preview', 'download'].includes(currentStep) ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className={`flex-1 h-1 ${
            ['metadata', 'preview', 'download'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
          }`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            currentStep === 'metadata' || ['preview', 'download'].includes(currentStep)
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
          <span>Upload CBZ</span>
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
            onClick={() => document.getElementById('cbz-input')?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Select CBZ File</h3>
            <p className="text-sm text-muted-foreground mb-4">Drag and drop your CBZ file here or click to browse</p>
            <input
              id="cbz-input"
              type="file"
              accept=".cbz"
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

      {/* Step 2: Configure Metadata */}
      {currentStep === 'metadata' && (
        <div className="space-y-6">
          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Tome Type</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tomeType"
                  value="comic_chapter"
                  checked={tomeType === 'comic_chapter'}
                  onChange={(e) => setTomeType(e.target.value as 'comic_chapter' | 'comic_volume' | 'comic_series')}
                  className="w-4 h-4"
                />
                <span>
                  <div className="font-medium">Comic Chapter</div>
                  <div className="text-sm text-muted-foreground">Single chapter from a webcomic or series</div>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tomeType"
                  value="comic_volume"
                  checked={tomeType === 'comic_volume'}
                  onChange={(e) => setTomeType(e.target.value as 'comic_chapter' | 'comic_volume' | 'comic_series')}
                  className="w-4 h-4"
                />
                <span>
                  <div className="font-medium">Comic Volume</div>
                  <div className="text-sm text-muted-foreground">Complete single volume or standalone book</div>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tomeType"
                  value="comic_series"
                  checked={tomeType === 'comic_series'}
                  onChange={(e) => setTomeType(e.target.value as 'comic_chapter' | 'comic_volume' | 'comic_series')}
                  className="w-4 h-4"
                />
                <span>
                  <div className="font-medium">Comic Series</div>
                  <div className="text-sm text-muted-foreground">Multi-volume collection with chapters.json</div>
                </span>
              </label>
            </div>
          </div>

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
                  placeholder="Comic title"
                />
              </div>

              {tomeType === 'comic_chapter' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Comic Title *</label>
                    <input
                      type="text"
                      value={formData.comic_title}
                      onChange={(e) => handleMetadataChange('comic_title', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                      placeholder="Parent comic series title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Chapter Number</label>
                    <input
                      type="number"
                      value={formData.chapter_number}
                      onChange={(e) => handleMetadataChange('chapter_number', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                      min="1"
                    />
                  </div>
                </>
              )}

              {tomeType === 'comic_volume' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Series</label>
                    <input
                      type="text"
                      value={formData.series}
                      onChange={(e) => handleMetadataChange('series', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                      placeholder="Series name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Volume Number</label>
                    <input
                      type="number"
                      value={formData.volume_number}
                      onChange={(e) => handleMetadataChange('volume_number', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                      min="1"
                    />
                  </div>
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
                </>
              )}

              {tomeType === 'comic_series' && (
                <>
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
                </>
              )}

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

          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  placeholder="Synopsis or summary"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Published Date</label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => handleMetadataChange('published_date', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reading Direction</label>
                  <select
                    value={formData.reading_direction}
                    onChange={(e) => handleMetadataChange('reading_direction', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="ltr">Left to Right</option>
                    <option value="rtl">Right to Left (Manga)</option>
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
              onClick={() => setCurrentStep('preview')}
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
      {currentStep === 'preview' && (
        <div className="space-y-6">
          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Extracted Images ({images.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.slice(0, 8).map((image, index) => (
                <div key={index} className="aspect-square bg-background rounded-lg overflow-hidden border">
                  <img
                    src={URL.createObjectURL(new Blob([image.data]))}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {images.length > 8 && (
                <div className="aspect-square bg-background rounded-lg border flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-semibold">+{images.length - 8}</div>
                    <div className="text-xs text-muted-foreground">more</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Generated tome.json</h3>
            <pre className="bg-background rounded p-4 text-xs overflow-x-auto max-h-64">
              <code>{JSON.stringify(generateTomeJson(
                {
                  title: formData.title,
                  chapter_number: tomeType === 'comic_chapter' ? parseInt(formData.chapter_number) : undefined,
                  comic_title: tomeType === 'comic_chapter' ? formData.comic_title : undefined,
                  series: formData.series,
                  authors: formData.authors,
                  description: formData.description,
                  publisher: formData.publisher,
                  published_date: formData.published_date,
                  reading_direction: formData.reading_direction,
                  language: formData.language,
                  tags: formData.tags,
                },
                tomeType,
                images.length
              ), null, 2)}</code>
            </pre>
          </div>

          <div className="bg-muted/50 border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Tome Structure</h3>
            <div className="text-sm space-y-2 font-mono">
              <div>my-comic.tome/</div>
              <div className="ml-4">├── tome.json</div>
              <div className="ml-4">└── pages/</div>
              {images.slice(0, 3).map((image, index) => (
                <div key={index} className="ml-8">
                  ├── page-{String(index + 1).padStart(3, '0')}.{image.extension}
                </div>
              ))}
              {images.length > 3 && <div className="ml-8">├── ... ({images.length - 3} more pages)</div>}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep('metadata')}
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
              Your CBZ file has been converted to Tome format and is ready for download.
            </p>
            <div className="bg-background/50 rounded p-3 text-left text-xs font-mono">
              <div>File: {generatedTome.filename}</div>
              <div>Type: {tomeType}</div>
              <div>Pages: {images.length}</div>
            </div>
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
