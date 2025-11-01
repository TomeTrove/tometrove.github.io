import Link from 'next/link';
import { Archive, BookOpen, CheckCircle, Circle, FileJson, FileImage, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CBZPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <Archive className="h-4 w-4" />
          CBZ to Tome Conversion
        </div>
        <p className="text-muted-foreground">
          Learn how to convert traditional CBZ (Comic Book ZIP) files into modern tome archives for better interoperability and metadata support.
        </p>
      </div>

      <div className="space-y-8">
        {/* Quick Convert Section */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Zap className="h-5 w-5" />
            Want to Convert Your CBZ Files?
          </h2>
          <p className="text-sm text-blue-900 dark:text-blue-100 mb-4">
            Use our automated CBZ Converter tool to transform your CBZ files into standardized comic tome archives!
          </p>
          <Link href="/tools/converters/cbz">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Open CBZ Converter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="bg-muted/50 border rounded-lg p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              CBZ files are standard ZIP archives containing comic book images, typically used by readers like ComiXology and Calibre. While CBZ is a ubiquitous format, it lacks standardized metadata support and reading direction information.
            </p>
            <p className="text-sm text-muted-foreground">
              By converting CBZ files to tome format, you gain:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Structured metadata (authors, publication date, chapter info)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Reading direction support (LTR and RTL)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Optional page-level metadata</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Better archival and organization capabilities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step-by-step Conversion */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Conversion Steps</h2>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 1: Extract CBZ Contents</h3>
              <p className="text-sm text-muted-foreground mb-3">
                CBZ files are ZIP archives. Extract all contents to a working directory:
              </p>
              <div className="bg-background rounded border p-3 text-xs font-mono">
                <div className="text-muted-foreground"># Linux/Mac</div>
                <div className="text-primary">unzip comic.cbz -d comic-extracted/</div>
                <div className="mt-2 text-muted-foreground"># Or use any ZIP tool on Windows</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 2: Organize Image Files</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Move all extracted images into a <code className="bg-background px-1.5 py-0.5 rounded">pages/</code> directory and ensure they are properly ordered:
              </p>
              <div className="bg-background rounded border p-3 text-xs font-mono space-y-1">
                <div>my-chapter/</div>
                <div className="ml-2">├── pages/</div>
                <div className="ml-4">│   ├── page-001.jpg</div>
                <div className="ml-4">│   ├── page-002.jpg</div>
                <div className="ml-4">│   ├── page-003.jpg</div>
                <div className="ml-4">│   └── ...</div>
                <div className="ml-2">└── tome.json</div>
              </div>
              <div className="mt-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  <strong>Tip:</strong> Name files with leading zeros (page-001, page-002) to ensure proper alphabetical sorting.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 3: Create tome.json Metadata</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create a <code className="bg-background px-1.5 py-0.5 rounded">tome.json</code> file with required and optional metadata:
              </p>
              <div className="bg-background rounded border p-3 text-xs font-mono overflow-x-auto">
                <pre>{`{
  "type": "comic_chapter",
  "title": "Chapter Name",
  "chapter_number": 1,
  "comic_title": "Series Title",
  "authors": ["Author Name"],
  "description": "Brief description of the chapter",
  "cover_image": "pages/page-001.jpg",
  "page_count": 25,
  "reading_direction": "ltr",
  "published_date": "2024-01-15",
  "language": "en",
  "tags": ["action", "sci-fi"]
}`}</pre>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 4 (Optional): Create pages.json</h3>
              <p className="text-sm text-muted-foreground mb-3">
                For enhanced functionality, create a <code className="bg-background px-1.5 py-0.5 rounded">pages.json</code> file with page-level metadata:
              </p>
              <div className="bg-background rounded border p-3 text-xs font-mono overflow-x-auto">
                <pre>{`[
  {
    "page": 1,
    "file": "pages/page-001.jpg",
    "width": 800,
    "height": 1200,
    "type": "cover"
  },
  {
    "page": 2,
    "file": "pages/page-002.jpg",
    "width": 800,
    "height": 1200,
    "type": "story"
  }
]`}</pre>
              </div>
            </div>

            {/* Step 5 */}
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 5: Create Tome Archive</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Compress the directory into a .tome file (which is a ZIP archive with a different extension):
              </p>
              <div className="bg-background rounded border p-3 text-xs font-mono space-y-2">
                <div className="text-muted-foreground"># Linux/Mac</div>
                <div className="text-primary">zip -r my-chapter.tome my-chapter/</div>
                <div className="mt-2 text-muted-foreground"># Or rename a .zip file to .tome</div>
                <div className="text-primary">zip -r my-chapter.zip my-chapter/ && mv my-chapter.zip my-chapter.tome</div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Structure */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileImage className="h-5 w-5 text-primary" />
            Final Directory Structure
          </h2>
          <div className="bg-muted/50 border rounded-lg p-6">
            <div className="bg-background rounded border p-4 text-xs font-mono space-y-1">
              <div className="text-muted-foreground">my-chapter.tome (ZIP archive)</div>
              <div className="ml-2">├── tome.json</div>
              <div className="ml-2">├── pages.json (optional)</div>
              <div className="ml-2">└── pages/</div>
              <div className="ml-4">    ├── page-001.jpg</div>
              <div className="ml-4">    ├── page-002.jpg</div>
              <div className="ml-4">    ├── page-003.jpg</div>
              <div className="ml-4">    └── ... (all pages)</div>
            </div>
          </div>
        </div>

        {/* Metadata Reference */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Metadata Reference
          </h2>
          <div className="bg-muted/50 border rounded-lg p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              The metadata fields available for your tome depend on the content type you choose. The Tome format supports different type standards, each with its own set of required and optional fields.
            </p>
            <p className="text-sm text-muted-foreground font-semibold">
              Select your content type below to view the complete metadata specification:
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {/* Comic Series Type */}
              <Link href="/standards/types/comic_series">
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold">Comic Series</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    For complete comic series with multiple volumes and chapters. Includes volume and chapter organization metadata.
                  </p>
                  <div className="flex items-center text-primary text-xs font-semibold">
                    View Specification
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </div>
                </div>
              </Link>

              {/* Comic Volume Type */}
              <Link href="/standards/types/comic_volume">
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold">Comic Volume</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    For individual volumes or collected graphic novels. Perfect for published manga volumes or comic collections.
                  </p>
                  <div className="flex items-center text-primary text-xs font-semibold">
                    View Specification
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </div>
                </div>
              </Link>

              {/* Comic Chapter Type */}
              <Link href="/standards/types/comic_chapter">
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold">Comic Chapter</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    For individual chapters or standalone comic stories. Ideal for webcomics and serialized releases.
                  </p>
                  <div className="flex items-center text-primary text-xs font-semibold">
                    View Specification
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Automation Tips */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Automation Tips</h2>
          <div className="bg-muted/50 border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Batch Processing</h3>
              <p className="text-sm text-muted-foreground mb-3">
                For converting multiple CBZ files, consider:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Writing a shell script to automate extraction and renaming</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Using Python to parse CBZ metadata (if available) and generate tome.json</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Leveraging tools like ComicTagger to extract existing metadata</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Some CBZ files may contain metadata in XML or JSON within the archive. Extract and adapt this metadata when creating your tome.json file.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
          <div className="space-y-3">
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Use Consistent Naming</p>
              <p className="text-sm text-muted-foreground">
                Name page files consistently with leading zeros: page-001.jpg, page-002.jpg, etc.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Preserve Original Metadata</p>
              <p className="text-sm text-muted-foreground">
                Include author names, publication dates, and language information if available from the original CBZ.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Set Reading Direction</p>
              <p className="text-sm text-muted-foreground">
                Correctly set reading_direction based on the comic origin: &quot;ltr&quot; for Western comics, &quot;rtl&quot; for manga.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Optimize Image Quality</p>
              <p className="text-sm text-muted-foreground">
                Consider re-compressing images if the original CBZ is using excessive quality. Balance file size with readability.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Optional Page Metadata</p>
              <p className="text-sm text-muted-foreground">
                Create pages.json for better reader integration, especially if you have information about double-spreads or special pages.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Why Convert to .Tome Format?</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Converting your CBZ files to .tome format unlocks modern features while maintaining full compatibility with existing comic readers:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Benefit 1 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Standardized Metadata
                </h3>
                <p className="text-sm text-muted-foreground">
                  Move beyond CBZ&apos;s lack of metadata standards. Define authors, publication dates, reading direction, and chapter information in a structured, discoverable format.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Reading Direction Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explicitly define left-to-right or right-to-left reading direction. No more guessing for manga or international comics.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Better Organization
                </h3>
                <p className="text-sm text-muted-foreground">
                  Store chapter and volume information directly in metadata. Build searchable comic libraries with proper hierarchical organization.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Future-Proof Format
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use a versioned standard that&apos;s built to last. Preserve your comics for decades with a documented, extensible format specification.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Enhanced Reader Integration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Optional pages.json enables page-level metadata. Mark special pages (covers, double-spreads) and provide richer reading experiences.
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Unified Library Format
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mix comics (CBZ) and books (EPUB) in the same standardized archive format. Manage your entire digital media collection uniformly.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/standards/types/comic_chapter">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Comic Type Standard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
