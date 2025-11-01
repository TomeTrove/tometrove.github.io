import { BookMarked, CheckCircle, Circle, Layers, AlertCircle } from 'lucide-react';

export default function EpubTypePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <BookMarked className="h-4 w-4" />
          epub
        </div>
        <p className="text-muted-foreground">
          A wrapped EPUB file with minimal metadata overhead. Fully compatible with EPUB readers and software.
          A .tome file with type "epub" can be read identically to an .epub file.
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              The "epub" tome type allows EPUB files to be wrapped in the .tome format with minimal overhead.
              It requires only a single mandatory field in <code className="bg-muted px-1.5 py-0.5 rounded">tome.json</code>:
              the <code className="bg-muted px-1.5 py-0.5 rounded">type</code> field set to <code className="bg-muted px-1.5 py-0.5 rounded">"epub"</code>.
            </p>
            <p>
              All EPUB content (mimetype, META-INF/, OEBPS/, and original metadata files) is preserved unchanged.
              This means a .tome file with type "epub" is drop-in compatible with any EPUB reader software.
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Use Cases</h3>
          <div className="space-y-3">
            <div className="border-l-2 border-primary pl-4">
              <h4 className="font-medium">Standardize EPUB Distribution</h4>
              <p className="text-sm text-muted-foreground">
                Wrap EPUB files in the .tome standard for consistent metadata handling across your library
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h4 className="font-medium">Enhanced Metadata</h4>
              <p className="text-sm text-muted-foreground">
                Optionally add structured metadata to tome.json while preserving the original EPUB package
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h4 className="font-medium">Format Agnostic Collections</h4>
              <p className="text-sm text-muted-foreground">
                Store EPUBs, CBZs, and other content in a unified .tome format with consistent metadata standards
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h4 className="font-medium">Backward Compatible Archive</h4>
              <p className="text-sm text-muted-foreground">
                Protect EPUB files from format obsolescence by wrapping them in a standardized archive that documents their type
              </p>
            </div>
          </div>
        </div>

        {/* File Structure */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            File Structure
          </h3>
          <div className="bg-muted/50 border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-4">
              An EPUB .tome archive contains the complete EPUB structure plus a single tome.json file:
            </p>
            <div className="bg-background rounded border p-4 text-sm font-mono space-y-1">
              <div>my-book.tome/</div>
              <div className="ml-4">├── <span className="text-primary">tome.json</span></div>
              <div className="ml-4">├── mimetype</div>
              <div className="ml-4">├── META-INF/</div>
              <div className="ml-8">│   ├── container.xml</div>
              <div className="ml-8">│   ├── package.opf</div>
              <div className="ml-8">│   └── ...(other EPUB metadata)</div>
              <div className="ml-4">├── OEBPS/</div>
              <div className="ml-8">│   ├── content.opf</div>
              <div className="ml-8">│   ├── toc.ncx</div>
              <div className="ml-8">│   ├── book.html</div>
              <div className="ml-8">│   ├── images/</div>
              <div className="ml-8">│   └── ...(all EPUB content)</div>
              <div className="ml-4">└── ...(any other EPUB files)</div>
            </div>
          </div>
        </div>

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
                Must be set to <code className="bg-background px-1.5 py-0.5 rounded">&quot;epub&quot;</code>
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
          <p className="text-sm text-muted-foreground mb-4">
            Additional metadata can be optionally included in tome.json for enhanced searchability and organization.
            All of these fields are completely optional:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">title</code>
              <p className="text-sm text-muted-foreground mt-1">
                The book title (can override or supplement EPUB metadata)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">authors</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of author names
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">description</code>
              <p className="text-sm text-muted-foreground mt-1">
                Brief summary or synopsis
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">publisher</code>
              <p className="text-sm text-muted-foreground mt-1">
                Publisher name
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">published_date</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISO 8601 date (e.g., &quot;2024-01-15&quot;)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">language</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISO 639-1 language code (e.g., &quot;en&quot;, &quot;es&quot;, &quot;ja&quot;)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">tags</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of genre/category tags
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">metadata_reference</code>
              <p className="text-sm text-muted-foreground mt-1">
                Reference to EPUB OPF metadata file (e.g., <code className="bg-background px-1.5 py-0.5 rounded">{'{"format":"epub_opf","path":"OEBPS/content.opf"}'}</code>)
              </p>
            </div>
          </div>
        </div>

        {/* Metadata Handling */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Metadata Handling Modes
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            When creating an EPUB .tome file, you can choose how metadata is handled:
          </p>
          <div className="space-y-4">
            <div className="bg-muted/50 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Extracted with Reference</h4>
              <p className="text-sm text-muted-foreground">
                Metadata is parsed from the EPUB OPF file and included directly in tome.json for easy access,
                plus a reference to the OPF file is included. This provides the convenience of extracted metadata
                while preserving a link to the authoritative source. Best for tools that want to access metadata
                without XML parsing while maintaining a reference to the original.
              </p>
            </div>
            <div className="bg-muted/50 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Reference Only</h4>
              <p className="text-sm text-muted-foreground">
                Only a reference to the EPUB OPF file is included in tome.json. Metadata is not duplicated,
                keeping the source of truth in the original EPUB metadata. This minimizes tome.json size and is ideal
                when metadata should not be modified separately from the original EPUB.
              </p>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div>
          <h3 className="text-lg font-semibold mb-4">EPUB Compatibility</h3>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              A .tome file with <code className="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">type: "epub"</code> is fully compatible with EPUB software.
              Since the internal file structure is identical to an EPUB (with only the addition of tome.json), you can rename
              <code className="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">file.tome</code> to <code className="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">file.epub</code> and open it in any EPUB reader.
            </p>
          </div>
        </div>

        {/* Examples */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Examples</h3>

          <div className="space-y-6">
            {/* Minimal Example */}
            <div>
              <h4 className="font-semibold mb-2">Minimal (Required Only)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The absolute minimum tome.json for an EPUB type:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`{
  "type": "epub"
}`}</code>
                </pre>
              </div>
            </div>

            {/* With Extracted Metadata */}
            <div>
              <h4 className="font-semibold mb-2">With Extracted Metadata</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Metadata extracted from EPUB OPF file:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{`{
  "type": "epub",
  "title": "The Great Adventure",
  "authors": ["Jane Smith"],
  "description": "An epic journey through time and space.",
  "publisher": "Adventure Press",
  "published_date": "2024-01-15",
  "language": "en",
  "tags": ["fantasy", "adventure"]
}`}</code>
                </pre>
              </div>
            </div>

            {/* With Reference */}
            <div>
              <h4 className="font-semibold mb-2">With Metadata Reference</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Includes reference to original EPUB OPF file:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
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

            {/* With Extracted and Reference */}
            <div>
              <h4 className="font-semibold mb-2">With Extracted Metadata and Reference (Recommended)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Combines extracted metadata with reference to original source (default mode):
              </p>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
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
      </div>
    </div>
  );
}
