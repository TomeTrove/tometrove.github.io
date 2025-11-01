import { FileArchive, FolderTree, FileJson, CheckCircle } from 'lucide-react';

export default function FileStructurePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <FolderTree className="h-4 w-4" />
          File Structure
        </div>
        <p className="text-muted-foreground">
          Understanding the .tome file structure and organization requirements.
        </p>
      </div>

      <div className="space-y-8">
        {/* Archive Format */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileArchive className="h-5 w-5 text-primary" />
            Archive Format
          </h2>
          <div className="bg-muted/50 border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-3">
              A .tome file is a standard ZIP archive with a <code className="bg-background px-1.5 py-0.5 rounded">.tome</code> extension.
              It can be opened, created, and manipulated using any ZIP-compatible tool.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Compatible with all major ZIP libraries and tools</li>
              <li>Can use compression (recommended) or store files uncompressed</li>
              <li>Maximum file size limited only by ZIP64 format (16 exabytes)</li>
            </ul>
          </div>
        </div>

        {/* Required Files */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Required Files
          </h2>
          <div className="bg-muted/50 border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-3">
              <FileJson className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <code className="text-sm font-mono bg-background px-2 py-1 rounded">tome.json</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Must be located at the root of the archive. This file contains the metadata and type information
                  for the tome. At minimum, it must include a <code className="bg-background px-1.5 py-0.5 rounded">type</code> field.
                </p>
              </div>
            </div>
            <div className="mt-4 bg-background rounded border p-3">
              <pre className="text-xs font-mono overflow-x-auto">
                <code>{`{
  "type": "book"
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Directory Structure */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-primary" />
            Directory Structure
          </h2>
          <div className="bg-muted/50 border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-4">
              The internal structure is flexible and can be organized however you prefer. Common patterns include:
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Flat Structure</h4>
                <div className="bg-background rounded border p-3 text-xs font-mono">
                  <div>my-book.tome/</div>
                  <div className="ml-4">├── tome.json</div>
                  <div className="ml-4">├── content.html</div>
                  <div className="ml-4">├── cover.jpg</div>
                  <div className="ml-4">└── styles.css</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Organized Structure</h4>
                <div className="bg-background rounded border p-3 text-xs font-mono">
                  <div>my-comic.tome/</div>
                  <div className="ml-4">├── tome.json</div>
                  <div className="ml-4">├── pages.json</div>
                  <div className="ml-4">├── pages/</div>
                  <div className="ml-8">│   ├── cover.jpg</div>
                  <div className="ml-8">│   ├── page-001.jpg</div>
                  <div className="ml-8">│   └── page-002.jpg</div>
                  <div className="ml-4">└── metadata/</div>
                  <div className="ml-8">    └── info.txt</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Naming */}
        <div>
          <h2 className="text-xl font-semibold mb-4">File Naming Best Practices</h2>
          <div className="bg-muted/50 border rounded-lg p-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Use lowercase filenames for better cross-platform compatibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Use hyphens (-) or underscores (_) instead of spaces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Keep filenames under 255 characters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Avoid special characters that may cause issues (/, \, :, *, ?, &quot;, &lt;, &gt;, |)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Use descriptive names that indicate content (e.g., &quot;chapter-01.html&quot; instead of &quot;c1.html&quot;)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
