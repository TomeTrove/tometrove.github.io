import { BookImage, CheckCircle, Circle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ComicSeriesTypePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <BookImage className="h-4 w-4" />
          comic_volume
        </div>
        <p className="text-muted-foreground">
          A complete comic volume containing multiple chapters. Organized collection of chapters in a comic volume
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
                Must be set to <code className="bg-background px-1.5 py-0.5 rounded">&quot;comic_volume&quot;</code>
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">chapters_file</code>
              <p className="text-sm text-muted-foreground mt-1">
                Location of the metadata for volume chapters. See{' '}
                <Link href="/standards/linking" className="text-primary hover:underline">
                  linking standards
                </Link>
                {' '}for path resolution details.
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
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">title</code>
              <p className="text-sm text-muted-foreground mt-1">
                Title of the volume
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
  "chapters_file": "/chapters.json",
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
          <div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
            <div>my-series.tome/</div>
            <div className="ml-4">├── tome.json</div>
            <div className="ml-4">├── chapters.json</div>
            <div className="ml-4">└── chapter_001/</div>
            <div className="ml-8">├── pages.json</div>
            <div className="ml-8">├── page-001.jpg</div>
            <div className="ml-8">└── ... (all pages)</div>
            <div className="ml-4">└── chapter_002/</div>
            <div className="ml-8">└── ...</div>
          </div>
        </div>

        {/* chapters.json Standard */}
        <div>
          <h3 className="text-lg font-semibold mb-4">The chapters_file File Standard</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The chapters metadata file defines the structure and contents of all chapters in that volume. It serves as the index for organizing multiple chapters and their relationships within the volume.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Purpose</h4>
              <p className="text-sm text-muted-foreground">
                The chapters file provides a centralized registry of all chapters within a volume, enabling:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>• Ordering and sequencing of chapters within the volume</li>
                <li>• Chapter metadata aggregation from individual chapter directories</li>
                <li>• Volume-wide navigation and chapter organization</li>
                <li>• Tracking chapter publication and reading progress</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">File Structure</h4>
              <p className="text-sm text-muted-foreground mb-2">
                The chapters file is a JSON array containing objects with the following fields:
              </p>
              <div className="bg-background rounded border p-4 text-xs font-mono space-y-3">
                <div>
                  <div className="text-muted-foreground">{`//`} Path to the page details for this chapter, or a directory containing images in alphabetical order.</div>
                  <span className="text-blue-500">&quot;path&quot;</span><span className="text-muted-foreground">: string (required)</span>
                </div>
                <div>
                  <div className="text-muted-foreground">{`//`} Numeric identifier for ordering chapters within the volume</div>
                  <span className="text-blue-500">&quot;chapter_number&quot;</span><span className="text-muted-foreground">: number | string (required)</span>
                </div>

                <div>
                  <div className="text-muted-foreground">{`//`} Display title for the chapter</div>
                  <span className="text-blue-500">&quot;title&quot;</span><span className="text-muted-foreground">: string (optional)</span>
                </div>

                <div>
                  <div className="text-muted-foreground">{`//`} Chapter publication or release date</div>
                  <span className="text-blue-500">&quot;published_date&quot;</span><span className="text-muted-foreground">: string (optional, ISO 8601)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Example chapters.json</h4>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`[
  {
    "path": "chapter_001/pages.json",
    "chapter_number": 1,
    "title": "The Beginning",
    "published_date": "2023-01-15"
  },
  {
    "path": "chapter_002/pages.json",
    "chapter_number": 2,
    "title": "Rising Action",
    "published_date": "2023-02-01"
  },
  {
    "path": "chapter_003",
    "chapter_number": 3,
    "title": "Climax",
    "published_date": "2023-02-15"
  },
  {
    "path": "chapter_004",
    "chapter_number": 4,
    "title": "Resolution"
  }
]`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Order entries by chapter_number for consistent reading flow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Use consistent directory naming (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-xs">chapter_001</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-xs">chapter_002</code>)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Include title fields for better readability and navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Include published_date for serialized chapters (ISO 8601 format)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Use decimal numbers (1.5, 2.5) for bonus or special chapters between main chapters</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* pages.json Standard */}
        <div>
          <h3 className="text-lg font-semibold mb-4">The Optional Pages Metadata File Standard</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This file is optional because if a directory is specified then the images are just sorted alphabetacally.
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
