import { BookOpen, CheckCircle, Circle } from 'lucide-react';

export default function BookChapterTypePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <BookOpen className="h-4 w-4" />
          book_chapter
        </div>
        <p className="text-muted-foreground">
          A single chapter from a book, typically part of a serialized release or preview. Contains chapter-specific metadata and content.
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
                Must be set to <code className="bg-background px-1.5 py-0.5 rounded">&quot;book_chapter&quot;</code>
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">title</code>
              <p className="text-sm text-muted-foreground mt-1">
                The chapter title (e.g., &quot;Chapter 1: The Beginning&quot;, &quot;Prologue&quot;)
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">content</code>
              <p className="text-sm text-muted-foreground mt-1">
                Path to the chapter content file (e.g., &quot;chapter.html&quot;, &quot;content.md&quot;)
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
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">chapter_number</code>
              <p className="text-sm text-muted-foreground mt-1">
                The sequential number of this chapter (number)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">book_title</code>
              <p className="text-sm text-muted-foreground mt-1">
                Title of the parent book this chapter belongs to
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
                Brief summary or teaser for the chapter
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">cover_image</code>
              <p className="text-sm text-muted-foreground mt-1">
                Path to chapter cover art
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">published_date</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISO 8601 date when the chapter was published
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">language</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISO 639-1 language code (e.g., &quot;en&quot;, &quot;ja&quot;)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">tags</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of descriptive tags
              </p>
            </div>
          </div>
        </div>

        {/* Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Example</h3>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "type": "book_chapter",
  "title": "Chapter 1: The Hero's Journey",
  "chapter_number": 1,
  "book_title": "The Epic Saga",
  "authors": ["Jane Smith"],
  "description": "Our hero embarks on an unexpected adventure.",
  "content": "chapter1.html",
  "cover_image": "covers/chapter1.jpg",
  "published_date": "2024-01-15",
  "language": "en",
  "tags": ["fantasy", "adventure"]
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
