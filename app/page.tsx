import Link from 'next/link';
import { FileArchive, BookOpen, FileCode, Package, Layers, CheckCircle, FileImage, History, Shield, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Link href={`/`}>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <FileArchive className="h-6 w-6 text-primary-foreground" />
              </div>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Tome Trove</h1>
              <p className="text-sm text-muted-foreground">Tools for working with .tome files</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
              <FileArchive className="h-4 w-4" />
              <span>Introducing the .tome file format</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              A Standard for Structured Archives
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Built for preservating the stories you care about.
            </p>
          </div>
        </section>

        {/* The Story Behind Your Stories Section */}
        <section className="bg-muted/50 border-y">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-center">The Story Behind Your Stories</h3>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Imagine your entire collection—comics, books, audiobooks—all in one place, with complete context and history preserved.
              </p>

              <div className="space-y-6">
                {/* Real Problem: Metadata Loss */}
                <div className="bg-card rounded-lg p-6 border">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <History className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Lost History: When Files Are Shared</h4>
                      <p className="text-sm text-muted-foreground">
                        When stories are shared as bare CBZ files or MP3 folders, their history disappears. Translators lose credit. Publishers&apos; information vanishes. Years later, you can&apos;t remember who created the work or what edition you have. Small indie creators and fan translators are forgotten when their work lives on only as shared files.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Search className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Invisible Collections: No Discovery</h4>
                      <p className="text-sm text-muted-foreground">
                        Your collection sits as scattered files across devices and platforms. Manga in one app, comics as CBZ files, audiobooks as folders. You can&apos;t search across it all. You can&apos;t find that series translated by your favorite translator. Your archive is invisible—just files, no meaning.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Protective: Build an Archive That Lasts</h4>
                      <p className="text-sm text-muted-foreground">
                        With .tome, your collection becomes intentional. Every story carries its history—artists, translators, publishers, your own notes. Even when files are shared, the metadata travels with them, preserving creator attribution and ensuring your collection tells the complete story.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Preservation Matters Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">Why Preservation Matters (For Collectors)</h3>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Good preservation isn&apos;t just about keeping files. It&apos;s about keeping the story behind those files—the creators, the context, the meaning.
            </p>

            <div className="space-y-8">
              {/* What Good Preservation Looks Like */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What Good Preservation Looks Like
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-lg p-6 border">
                    <h5 className="font-semibold mb-2 text-sm">Unified Organization</h5>
                    <p className="text-sm text-muted-foreground">
                      One standard for all story types—comics, books, audiobooks. No more juggling different apps and formats.
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-6 border">
                    <h5 className="font-semibold mb-2 text-sm">Preserved History</h5>
                    <p className="text-sm text-muted-foreground">
                      Artists, translators, publishers, edition info—all attached to every story. The context that made it special stays with it.
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-6 border">
                    <h5 className="font-semibold mb-2 text-sm">Discoverability</h5>
                    <p className="text-sm text-muted-foreground">
                      Search across your entire collection. Find all manga by [translator], all audiobooks with [narrator], all books in [series].
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-6 border">
                    <h5 className="font-semibold mb-2 text-sm">Accessibility & Ownership</h5>
                    <p className="text-sm text-muted-foreground">
                      Your archive is truly yours. Readable in any ZIP tool, metadata is human-readable JSON, future-proof and accessible.
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-6 border md:col-span-2">
                    <h5 className="font-semibold mb-2 text-sm">Flexibility</h5>
                    <p className="text-sm text-muted-foreground">
                      Add your own context. Personal ratings, reading order, why you love each story. Your archive reflects your collection, not just what the format allows.
                    </p>
                  </div>
                </div>
              </div>

              {/* How .tome Enables This */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileArchive className="h-5 w-5 text-primary" />
                  How .tome Enables This
                </h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="font-medium text-sm mb-2">Standardized Metadata Across All Types</p>
                    <p className="text-sm text-muted-foreground">
                      No more format fragmentation. Comics, books, and audiobooks all use the same metadata standard, making your entire collection searchable and organized.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-2">Self-Describing Format</p>
                    <p className="text-sm text-muted-foreground">
                      Both humans and machines can understand your archive immediately. Open any .tome file in a ZIP tool, read the JSON metadata directly.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-2">Some Wrap, Some Enhance</p>
                    <p className="text-sm text-muted-foreground">
                      Some types wrap existing formats with standardized metadata. Others (like audiobooks) create entirely new structures with rich features: chapters, timestamps, subtitle support, timed bookmarks.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-2">Universal Reader + Format Compatibility</p>
                    <p className="text-sm text-muted-foreground">
                      Your files stay compatible with original format readers, but also work with a universal .tome reader that handles all types. Best of both worlds.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-2">Creator Attribution Built In</p>
                    <p className="text-sm text-muted-foreground">
                      Designed specifically so small creators and translators get proper attribution even when files are shared. Their story comes with the file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is .tome Section - Reframed */}
        <section className="bg-muted/50 border-y">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-8 text-center">What is a .tome file?</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg p-6 border">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">ZIP Archive Foundation</h4>
                  <p className="text-sm text-muted-foreground">
                    Built on proven, lasting technology anyone can access. No proprietary formats, just reliable ZIP.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileCode className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Metadata Standard</h4>
                  <p className="text-sm text-muted-foreground">
                    Preserve the story behind your stories—artists, translators, publishers, your own context and notes.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Multi-File Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep entire series together with clear relationships and complete structure—volumes, chapters, pages all linked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">Examples: Stories Worth Keeping</h3>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              See how .tome preserves your collection with rich metadata and unified organization.
            </p>

            <div className="space-y-8">
              {/* Example 1: Manga Collector */}
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <FileImage className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Example: The Manga Collector</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete metadata: original artist, translator (with credit), color pages indicator, volume/chapter structure. Search your collection: "Find all series translated by [name]". Preserved history: edition information, publication dates, your reading notes.
                    </p>
                    <p className="text-xs text-primary">→ For detailed specification, see our <Link href="/standards/types/comic_series" className="underline">Comic Series Type Standard</Link></p>
                  </div>
                </div>
              </div>

              {/* Example 2: Audiobook Listener */}
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Example: The Audiobook Library</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Structured chapters with timestamps, narrator information, subtitle support. Timed bookmarks for favorite moments, episode descriptions. Unified with your books and comics in the same standard.
                    </p>
                    <p className="text-xs text-primary">→ For detailed specification, see our <Link href="/standards/types/audio_book" className="underline">Audiobook Type Standard</Link></p>
                  </div>
                </div>
              </div>

              {/* Example 3: Mixed Collector */}
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Example: The Mixed Collector</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comics, books, and audiobooks all with consistent metadata structure. One universal reader for all .tome files. Your entire collection searchable and organized in one place.
                    </p>
                    <p className="text-xs text-primary">→ Explore all supported types in our <Link href="/standards/types" className="underline">Type Standards</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Existing Formats Fall Short */}
        <section className="bg-muted/50 border-y">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-center">Why Existing Formats Fall Short</h3>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Each format has limitations for collectors who want unified, searchable, metadata-rich archives.
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-card rounded-lg p-6 border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-blue-500" />
                    CBZ & Scattered Files
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    No metadata standard, loses creator attribution when shared, no discoverability. When your favorite indie comic gets shared as a CBZ, the translator's name is gone.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    EPUB
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Built for formatted text, not designed for comics or audiobooks. Overly complex XML-based structure makes it hard to work with.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-orange-500" />
                    MP3 Folders & Format Fragmentation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    No relationship structure, no metadata layer, collection is invisible. Different standards for different types means no unified discovery or organization.
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <p className="text-sm"><strong>.tome solves this with unified metadata AND content-specific enhancements</strong></p>
              </div>
            </div>
          </div>
        </section>


        {/* Call-to-Action Section */}
        <section className="bg-primary/5 border-y">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h3 className="text-2xl font-bold">Start Your Preservation Journey Today</h3>
              <p className="text-muted-foreground">
                Your stories—and the people who created them—deserve proper attribution and organization. Protect your collection from metadata loss. Build a unified archive you can search, organize, and share with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg">
                    Explore All Tools
                  </Button>
                </Link>
                <Link href="/standards">
                  <Button size="lg" variant="outline">
                    Learn More About Standards
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
