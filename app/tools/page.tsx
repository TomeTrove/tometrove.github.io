import Link from 'next/link';
import { Edit, Eye, Zap, BookMarked, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-[1200px]">
      {/* General Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">General</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Editor */}
              <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors flex">
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Edit className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tome Editor</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and edit .tome files with support for multiple files, metadata management, and rich content organization.
                    </p>
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Multi-file project support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Metadata editor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>File tree navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>JSON validation</span>
                    </li>
                  </ul>
                  <div className='flex-1'></div>
                  <Link href="/tools/editor">
                    <Button className="w-full">Open Editor</Button>
                  </Link>
                </div>
              </div>

              {/* Viewer */}
              <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors flex">
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tome Viewer</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse and preview .tome file contents with file tree navigation.
                    </p>
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>File tree navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Image preview</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>JSON viewing</span>
                    </li>
                  </ul>
                  <div className='flex-1'></div>
                  <Link href="/tools/viewer">
                    <Button className="w-full">View Tomes</Button>
                  </Link>
                </div>
              </div>

              {/* Reader */}
              <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors flex">
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-cyan-500 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tome Reader</h3>
                    <p className="text-sm text-muted-foreground">
                      Full-featured canvas-based reader with zoom, pan, and responsive layouts.
                    </p>
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Canvas rendering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Zoom & pan gestures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Lazy loading</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Responsive layouts</span>
                    </li>
                  </ul>
                  <div className='flex-1'></div>
                  <Link href="/tools/reader">
                    <Button className="w-full">Read Tomes</Button>
                  </Link>
                </div>
              </div>
        </div>
      </div>

      {/* Converters Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Converters</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CBZ Converter */}
              <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors flex">
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">CBZ Converter</h3>
                    <p className="text-sm text-muted-foreground">
                      Convert CBZ (comic book archive) files to .tome format with comprehensive metadata support.
                    </p>
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Multi-type support (chapter, volume, series)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Reading direction support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Page-level metadata</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Live preview</span>
                    </li>
                  </ul>
                  <div className='flex-1'></div>

                  <Link href="/tools/converters/cbz">
                    <Button className="w-full">Open Converter</Button>
                  </Link>
                </div>
              </div>

              {/* EPUB Converter */}
              <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors flex">
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center">
                      <BookMarked className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">EPUB Converter</h3>
                    <p className="text-sm text-muted-foreground">
                      Wrap EPUB files in .tome format while preserving full EPUB compatibility.
                    </p>
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Non-destructive wrapping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Metadata extraction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Flexible metadata handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Custom type selection</span>
                    </li>
                  </ul>
                  <div className='flex-1'></div>

                  <Link href="/tools/converters/epub">
                    <Button className="w-full">Open Converter</Button>
                  </Link>
                </div>
              </div>
        </div>
      </div>

      {/* Scrapers Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Scrapers</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Web Scraper */}
              <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors flex">
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-orange-500 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 text-xs font-medium">
                      Coming Soon
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Web Scraper</h3>
                    <p className="text-sm text-muted-foreground">
                      Extract content from websites and convert them into structured .tome archives.
                    </p>
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>URL-based content extraction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Markdown conversion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Asset preservation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Batch processing</span>
                    </li>
                  </ul>
                  <div className='flex-1'></div>

                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
