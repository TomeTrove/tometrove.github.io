import { BookImage, CheckCircle, Circle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ComicSeriesTypePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <BookImage className="h-4 w-4" />
          comic_chapter
        </div>
        <p className="text-muted-foreground">
          A full chapter of a comic book.
        </p>
      </div>

      <div className="space-y-8">
        {/* Required Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Required Fields
          </h3>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">type</code>
              <p className="text-sm text-muted-foreground mt-1">
                Must be set to <code className="bg-background px-1.5 py-0.5 rounded">&quot;comic_chapter&quot;</code>
              </p>
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Circle className="h-5 w-5 text-muted-foreground" />
            Optional Fields
          </h3>
          <div className="space-y-4">
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">pages_file</code>
              <p className="text-sm text-muted-foreground mt-1">
                Location of the metadata for pages in the chapter. See{' '}
                <Link href="/standards/linking" className="text-primary hover:underline">
                  linking standards
                </Link>
                {' '}for path resolution details.
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">title</code>
              <p className="text-sm text-muted-foreground mt-1">
                Title of the chapter
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">series_title</code>
              <p className="text-sm text-muted-foreground mt-1">
                Title of the series
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">authors</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of creator names (writers, artists, etc.)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">description</code>
              <p className="text-sm text-muted-foreground mt-1">
                Volume synopsis or overview
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">publisher</code>
              <p className="text-sm text-muted-foreground mt-1">
                Publisher name
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">cover_image</code>
              <p className="text-sm text-muted-foreground mt-1">
                Path to volume cover image
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">total_pages</code>
              <p className="text-sm text-muted-foreground mt-1">
                Total number of pages across all chapters (number)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">volume</code>
              <p className="text-sm text-muted-foreground mt-1">
                Number of the volume this chapter belongs to (number)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">reading_direction</code>
              <p className="text-sm text-muted-foreground mt-1">
                &quot;ltr&quot; (left-to-right) or &quot;rtl&quot; (right-to-left, for manga)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">language</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISO 639-1 language code
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">tags</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of genre/theme tags
              </p>
            </div>
          </div>
        </div>
        {/* Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Example tome.json</h3>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "type": "comic_volume",
  "pages_file": "/pages.json",
  "title": "Super Hero Adventures",
  "authors": ["Jane Artist", "John Writer"],
  "publisher": "Comics Inc",
  "description": "An epic series following heroes across multiple volumes and adventures",
  "cover_image": "pages/page-001.jpg",
  "total_pages": 500,
  "reading_direction": "ltr",
  "language": "en",
  "tags": ["superhero", "action", "adventure", "ongoing"]
}`}</code>
            </pre>
          </div>
        </div>

        {/* File Structure */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Example Directory Structure</h3>
          <h4 className="text-md font-semibold mb-4">Suggested Structure</h4>
          <div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
            <div>chapter.tome/</div>
            <div className="ml-4">├── tome.json</div>
            <div className="ml-4">├── pages.json</div>
            <div className="ml-4">└── pages/</div>
            <div className="ml-8">├── page-001.jpg</div>
            <div className="ml-8">├── page-002.jpg</div>
            <div className="ml-8">└── ... (all pages)</div>
          </div>
          <h4 className="text-md font-semibold mt-4 mb-4">Easy CBZ Structure</h4>
          <div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
            <div>easy-cbz.tome/</div>
            <div className="ml-4">├── tome.json</div>
            <div className="ml-4">├── page-001.jpg</div>
            <div className="ml-4">├── page-002.jpg</div>
            <div className="ml-4">├── page-003.jpg</div>
            <div className="ml-4">├── page-004.jpg</div>
            <div className="ml-4">└── ... (all pages)</div>
          </div>
        </div>

        {/* pages.json Standard */}
        <div>
          <h3 className="text-lg font-semibold mb-4">The Optional pages_file File Standard</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This file is optional, when not specified images are extracted and sorted alphabetacally.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            A Pages Metadata file defines the page structure and metadata for that chapter. It specifies the order of pages, their file paths, and optional metadata like dimensions and page type.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Purpose</h4>
              <p className="text-sm text-muted-foreground">
                The pages file provides explicit control over page ordering and metadata, enabling:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>• Explicit page ordering (overrides alphabetical file sorting)</li>
                <li>• Page metadata storage (dimensions, type, etc.)</li>
                <li>• Support for non-sequential or custom page arrangements</li>
                <li>• Handling of special pages (covers, spreads, bonus content)</li>
              </ul>
            </div>

            
            <div>
              <h4 className="font-semibold text-sm mb-2">File Structure</h4>
              <p className="text-sm text-muted-foreground mb-2">
                The pages file is a JSON array containing page objects. Each object can have the following fields:
              </p>
              <div className="bg-background rounded border p-4 text-xs font-mono space-y-3">
                <div>
                  <div className="text-muted-foreground">{`//`} Path to the page image file relative to chapter directory</div>
                  <span className="text-blue-500">&quot;file&quot;</span><span className="text-muted-foreground">: string (required)</span>
                </div>
                <div>
                  <div className="text-muted-foreground">{`//`} Sequential page number within the chapter</div>
                  <span className="text-blue-500">&quot;page&quot;</span><span className="text-muted-foreground">: number (optional)</span>
                </div>

                <div>
                  <div className="text-muted-foreground">{`//`} Image width in pixels</div>
                  <span className="text-blue-500">&quot;width&quot;</span><span className="text-muted-foreground">: number (optional)</span>
                </div>

                <div>
                  <div className="text-muted-foreground">{`//`} Image height in pixels</div>
                  <span className="text-blue-500">&quot;height&quot;</span><span className="text-muted-foreground">: number (optional)</span>
                </div>

                <div>
                  <div className="text-muted-foreground">{`//`} Page type or classification (cover, story, advertisement, etc.)</div>
                  <span className="text-blue-500">&quot;type&quot;</span><span className="text-muted-foreground">: string (optional)</span>
                </div>

                <div>
                  <div className="text-muted-foreground">{`//`} Alternative text or description for accessibility</div>
                  <span className="text-blue-500">&quot;alt&quot;</span><span className="text-muted-foreground">: string (optional)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Example pages.json</h4>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`[
  {
    "page": 1,
    "file": "pages/page-001.jpg",
    "width": 1024,
    "height": 1536,
    "type": "cover",
    "alt": "Chapter 1 cover art"
  },
  {
    "page": 2,
    "file": "pages/page-002.jpg",
    "width": 1024,
    "height": 1536,
    "type": "story"
  },
  {
    "page": 3,
    "file": "pages/page-003.jpg",
    "width": 1024,
    "height": 1536,
    "type": "story"
  },
  {
    "page": 4,
    "file": "pages/page-004.jpg",
    "width": 1024,
    "height": 1536,
    "type": "story"
  },
  {
    "page": 5,
    "file": "pages/bonus-artwork.jpg",
    "width": 1024,
    "height": 1536,
    "type": "bonus",
    "alt": "Special bonus artwork"
  }
]`}</code>
                </pre>
              </div>
            </div>


            <div>
              <h4 className="font-semibold text-sm mb-2">Page Types Reference</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="border-l-2 border-primary pl-3">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">cover</code>
                  <span className="ml-2">- Chapter cover or title page</span>
                </div>
                <div className="border-l-2 border-muted pl-3">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">story</code>
                  <span className="ml-2">- Main narrative content page</span>
                </div>
                <div className="border-l-2 border-muted pl-3">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">back-matter</code>
                  <span className="ml-2">- End notes, author commentary, or epilogue</span>
                </div>
                <div className="border-l-2 border-muted pl-3">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">advertisement</code>
                  <span className="ml-2">- Advertisement or promotional content</span>
                </div>
                <div className="border-l-2 border-muted pl-3">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">bonus</code>
                  <span className="ml-2">- Special bonus artwork or bonus content</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Include the pages.json file for explicit control over page order and metadata</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Always include <code className="bg-muted px-1.5 py-0.5 rounded text-xs">width</code> and <code className="bg-muted px-1.5 py-0.5 rounded text-xs">height</code> for better rendering performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Use the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">type</code> field to classify pages for better navigation and filtering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Include <code className="bg-muted px-1.5 py-0.5 rounded text-xs">alt</code> text for important pages to improve accessibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Store images in a dedicated <code className="bg-muted px-1.5 py-0.5 rounded text-xs">pages/</code> directory for organization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Use consistent file naming (e.g., page-001.jpg, page-002.jpg) for clarity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
