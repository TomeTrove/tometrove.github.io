import { FileJson, Archive, Headphones, Lightbulb, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StandardsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Introduction Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <Lightbulb className="h-4 w-4" />
          Introduction
        </div>
        <h1 className="text-3xl font-bold mb-4">Tome Standards</h1>
        <p className="text-lg text-muted-foreground">
          A unified format for packaging rich media collections with flexible structure and standardized metadata.
        </p>
      </div>

      <div className="space-y-8">
        {/* Core Philosophy */}
        <div className="border rounded-lg p-6 bg-muted/30">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Core Philosophy
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-2">Self-Describing Format</p>
              <p>
                The Tome format is built on a simple, flexible principle:
              </p>
              <div className="bg-background rounded-lg border border-primary/20 p-4 ml-4 mt-2">
                <p className="font-semibold text-foreground mb-2">
                  <code className="bg-primary/10 px-2 py-1 rounded">tome.json</code> is the only required or standardized file.
                </p>
                <p className="text-sm">
                  All other files should be explicitly specified within the manifest, with naming flexible and customizable to your needs.
                </p>
              </div>
              <p className="mt-3">
                This approach ensures that every Tome file is self-describing while allowing creators maximum freedom in how they organize and name their content.
              </p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">Cascading Parsing</p>
              <p>
                Parsing one metadata file provides direction and context for future parsing operations. This hierarchical approach creates a guided navigation through your content:
              </p>
              <div className="bg-background rounded-lg border border-primary/20 p-4 ml-4 mt-2 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span className="text-sm"><code className="bg-primary/10 px-1.5 py-0.5 rounded">tome.json</code> defines the content type and metadata locations</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span className="text-sm">Type-specific manifests (e.g., <code className="bg-primary/10 px-1.5 py-0.5 rounded">volumes.json</code>) provide structure and paths to nested content</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span className="text-sm">Each nested manifest (e.g., <code className="bg-primary/10 px-1.5 py-0.5 rounded">chapters.json</code>) guides parsing of the next level</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span className="text-sm">Leaf-level manifests (e.g., <code className="bg-primary/10 px-1.5 py-0.5 rounded">pages.json</code>) define the actual media content</span>
                </div>
              </div>
              <p className="mt-3">
                This cascading design eliminates ambiguity: each file you parse tells you exactly where to look next, creating a deterministic path through your media hierarchy.
              </p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Goals
          </h2>

          <div className="space-y-4">
            {/* Goal 1: CBZ Standardization */}
            <div className="border rounded-lg p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-4">
                <Archive className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Standardize CBZ Metadata</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Establish a consistent metadata format for Comic Book ZIP files, moving beyond the fragmented standards that currently exist. CBZ files often lack standardized metadata, making it difficult to manage large collections.
                  </p>
                  <Link href="/standards/cbz">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Goal 2: Format Unification */}
            <div className="border rounded-lg p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-4">
                <Archive className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Unify Media Storage Across Formats</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain compatibility with existing ZIP-based formats (EPUB, CBZ, etc.) while providing a unified approach to metadata storage and media organization. Enable seamless conversion and interoperability between different media types.
                  </p>
                </div>
              </div>
            </div>

            {/* Goal 3: Rich Audiobooks */}
            <div className="border rounded-lg p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-4">
                <Headphones className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Enable Rich Audiobooks</h3>
                  <p className="text-sm text-muted-foreground">
                    Go beyond simple MP3 collections. Store synchronized subtitles, chapter markers, reading time estimates, and other audiobook-specific metadata to create engaging, interactive audio experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="border rounded-lg p-6 bg-primary/5">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Getting Started
          </h2>
          <p className="text-muted-foreground mb-4">
            Learn about the structure and requirements for creating Tome files:
          </p>
          <Link href="/standards/file-structure">
            <Button className="gap-2">
              View File Structure Standards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
