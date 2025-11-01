import Link from 'next/link';
import { BookMarked, BookOpen, CheckCircle, FileJson, FileImage, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReplacingEPUBsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <BookMarked className="h-4 w-4" />
          EPUB to Tome Conversion
        </div>
        <p className="text-muted-foreground">
          Learn how to convert EPUB (Electronic Publication) files into .tome format with full EPUB compatibility while adding standardized metadata support.
        </p>
      </div>

      <div className="space-y-8">
        {/* Quick Convert Section */}
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Zap className="h-5 w-5" />
            Want to Convert Your EPUB Files?
          </h2>
          <p className="text-sm text-purple-900 dark:text-purple-100 mb-4">
            Use our automated EPUB Converter tool to transform your EPUB files into .tome format in minutes, with full EPUB reader compatibility!
          </p>
          <Link href="/tools/converters/epub">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Open EPUB Converter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="bg-muted/50 border rounded-lg p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              EPUB (Electronic Publication) files are the standard for eBooks and digital publications. Unlike CBZ files which require restructuring, EPUB files can be wrapped in the .tome format with minimal changes while maintaining full compatibility with any EPUB reader.
            </p>
            <p className="text-sm text-muted-foreground">
              By converting EPUB files to .tome format, you gain:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Standardized metadata organization with optional extraction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Full backward compatibility with EPUB readers (rename .tome to .epub to use)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Flexible metadata handling (extracted, referenced, or both)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Unified format for mixed content libraries (eBooks, comics, projects)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold mt-1">✓</span>
                <span>Non-destructive wrapping preserves all original EPUB content</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Benefits Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Why Convert to .Tome Format?</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Converting your EPUB files to .tome format gives you the best of both worlds: full EPUB compatibility plus standardized metadata organization:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Benefit 1 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Preserve EPUB Compatibility
                </h3>
                <p className="text-sm text-muted-foreground">
                  No restructuring. Your content remains completely intact and fully compatible with any EPUB reader. Simply rename .tome to .epub if needed.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Standardized Metadata
                </h3>
                <p className="text-sm text-muted-foreground">
                  Extract metadata from EPUB's OPF format into a standard JSON structure. Make metadata accessible without parsing complex XML.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Unified Library Format
                </h3>
                <p className="text-sm text-muted-foreground">
                  Store EPUBs alongside CBZ comics in a single standardized format. Manage your entire digital library with consistent metadata handling.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Flexible Metadata Handling
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose how to organize metadata: extract for easy access, reference for single source of truth, or combine both approaches.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Future-Proof Format
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use a versioned standard built to last. Archive your eBooks in a documented format designed for long-term preservation.
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Better Discoverability
                </h3>
                <p className="text-sm text-muted-foreground">
                  Standardized metadata enables better indexing and searching. Build searchable libraries organized by author, title, and tags.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/standards/types/epub">
                <Button variant="outline" className="w-full sm:w-auto">
                  View EPUB Type Standard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Conversion Process */}
        <div>
          <h2 className="text-xl font-semibold mb-4">The Wrapping Process</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 1: Upload Your EPUB</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Select your .epub file. The converter validates the EPUB structure and automatically extracts metadata from the OPF file.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 2: Configure Metadata Handling</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Choose how to handle EPUB metadata:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Extracted with Reference:</strong> Include extracted metadata in tome.json and link to original OPF</li>
                <li><strong className="text-foreground">Reference Only:</strong> Only include link to OPF metadata (minimal tome.json)</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 3: Select Tome Type</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Choose the tome type. The default <code className="bg-background px-1.5 py-0.5 rounded text-xs">epub</code> type ensures full EPUB compatibility, or select <code className="bg-background px-1.5 py-0.5 rounded text-xs">book</code>, <code className="bg-background px-1.5 py-0.5 rounded text-xs">book_chapter</code>, or another type as needed.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-sm mb-2">Step 4: Review & Download</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Preview the generated tome.json and download your wrapped .tome file. All original EPUB content is preserved unchanged.
              </p>
            </div>
          </div>
        </div>

        {/* File Structure */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileImage className="h-5 w-5 text-primary" />
            Final Directory Structure
          </h2>
          <div className="bg-muted/50 border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-4">
              The resulting .tome file contains the complete EPUB structure plus a single tome.json file:
            </p>
            <div className="bg-background rounded border p-4 text-xs font-mono space-y-1">
              <div className="text-muted-foreground">my-book.tome (ZIP archive)</div>
              <div className="ml-2">├── <span className="text-primary">tome.json</span> (standardized metadata)</div>
              <div className="ml-2">├── mimetype (unchanged)</div>
              <div className="ml-2">├── META-INF/ (unchanged)</div>
              <div className="ml-4">│   ├── container.xml</div>
              <div className="ml-4">│   ├── package.opf</div>
              <div className="ml-4">│   └── ...</div>
              <div className="ml-2">├── OEBPS/ (unchanged)</div>
              <div className="ml-4">│   ├── content.opf</div>
              <div className="ml-4">│   ├── toc.ncx</div>
              <div className="ml-4">│   ├── book.html</div>
              <div className="ml-4">│   ├── images/</div>
              <div className="ml-4">│   └── ...</div>
              <div className="ml-2">└── ... (all other EPUB files)</div>
            </div>
          </div>
        </div>

        {/* Example tome.json */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Example tome.json Files
          </h2>
          <div className="space-y-6">
            {/* Minimal Example */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Minimal (Reference Only)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Smallest possible tome.json with reference to OPF metadata:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-xs overflow-x-auto">
                  <code>{`{
  "type": "epub",
  "metadata_reference": {
    "format": "epub_opf",
    "path": "OEBPS/content.opf"
  }
}`}</code>
                </pre>
              </div>
            </div>

            {/* With Extracted Example */}
            <div>
              <h3 className="font-semibold text-sm mb-2">With Extracted Metadata (Recommended)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Extracted metadata with reference to original source:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-xs overflow-x-auto">
                  <code>{`{
  "type": "epub",
  "title": "The Great Adventure",
  "authors": ["Jane Smith"],
  "description": "An epic journey through time and space.",
  "publisher": "Adventure Press",
  "published_date": "2024-01-15",
  "language": "en",
  "tags": ["fantasy", "adventure"],
  "metadata_reference": {
    "format": "epub_opf",
    "path": "OEBPS/content.opf"
  }
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* EPUB Compatibility */}
        <div>
          <h2 className="text-xl font-semibold mb-4">EPUB Reader Compatibility</h2>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">Full Compatibility Guaranteed</h3>
                <p className="text-sm text-green-900 dark:text-green-100 mb-3">
                  A .tome file with <code className="bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded text-xs">type: "epub"</code> is 100% compatible with any EPUB reader software. The added tome.json file doesn't interfere with EPUB processing.
                </p>
              </div>
              <div className="bg-background/50 rounded p-3 border">
                <p className="text-xs font-mono text-muted-foreground">
                  <strong>To use as EPUB:</strong> Simply rename <code className="bg-muted px-1 rounded">my-book.tome</code> to <code className="bg-muted px-1 rounded">my-book.epub</code> and open with any EPUB reader
                </p>
              </div>
              <p className="text-sm text-green-900 dark:text-green-100">
                This makes EPUB .tome files unique: they serve as both standardized archive format AND fully compatible EPUB files.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
          <div className="space-y-3">
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Use Default EPUB Type</p>
              <p className="text-sm text-muted-foreground">
                Select the <code className="bg-background px-1 rounded text-xs">epub</code> tome type for maximum compatibility with existing EPUB readers.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Choose Extracted with Reference</p>
              <p className="text-sm text-muted-foreground">
                The "Extracted with Reference" metadata mode provides the best balance of convenience and source-of-truth preservation.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Keep Original EPUB Metadata Intact</p>
              <p className="text-sm text-muted-foreground">
                The conversion process never modifies the original EPUB metadata files. You can always fall back to using the EPUB directly if needed.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Build Unified Libraries</p>
              <p className="text-sm text-muted-foreground">
                Convert EPUBs alongside your CBZ comics to create a unified .tome library with consistent metadata handling across both formats.
              </p>
            </div>
            <div className="bg-muted/50 border-l-4 border-primary rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Preserve for Long-Term Archival</p>
              <p className="text-sm text-muted-foreground">
                Use .tome format to create format-agnostic archives. The standardized metadata helps ensure your content remains discoverable even if EPUB becomes obsolete.
              </p>
            </div>
          </div>
        </div>

        {/* Type Standards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Learn More</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/standards/types/epub">
              <Button variant="outline" className="w-full">
                EPUB Type Standard
              </Button>
            </Link>
            <Link href="/standards/cbz">
              <Button variant="outline" className="w-full">
                CBZ Conversion Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
