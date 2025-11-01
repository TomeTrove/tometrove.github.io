import { Headphones, CheckCircle, Circle, FileText } from 'lucide-react';

export default function AudioBookTypePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <Headphones className="h-4 w-4" />
          audio_book
        </div>
        <p className="text-muted-foreground">
          An audiobook with audio files and optional chapter markers. Perfect for narrated books, podcast series, or audio dramas.
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
                Must be set to <code className="bg-background px-1.5 py-0.5 rounded">&quot;audio_book&quot;</code>
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">title</code>
              <p className="text-sm text-muted-foreground mt-1">
                The audiobook title
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
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">authors</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of author names
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">narrators</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of narrator/voice actor names
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">description</code>
              <p className="text-sm text-muted-foreground mt-1">
                Brief summary of the audiobook
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">duration</code>
              <p className="text-sm text-muted-foreground mt-1">
                Total duration in seconds (number)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">cover_image</code>
              <p className="text-sm text-muted-foreground mt-1">
                Path to cover art image
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">published_date</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISO 8601 date when published
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">language</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISO 639-1 language code
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">isbn</code>
              <p className="text-sm text-muted-foreground mt-1">
                ISBN of the original book (if applicable)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">series</code>
              <p className="text-sm text-muted-foreground mt-1">
                Series name if part of a series
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">series_number</code>
              <p className="text-sm text-muted-foreground mt-1">
                Position in the series (number)
              </p>
            </div>
            <div className="border-l-2 border-muted pl-4">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">tags</code>
              <p className="text-sm text-muted-foreground mt-1">
                Array of genre/category tags
              </p>
            </div>
          </div>
        </div>

        {/* Additional Files */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Additional Files
          </h3>
          <div className="bg-muted/50 border rounded-lg p-6">
            <h4 className="font-semibold mb-3">chapters.json (optional)</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Define chapter markers and audio file segments. Each chapter object can contain:
            </p>
            <div className="space-y-2 mb-4">
              <div className="border-l-2 border-primary pl-3">
                <code className="text-sm font-mono bg-background px-1.5 py-0.5 rounded">title</code>
                <span className="text-sm text-muted-foreground ml-2">(required) - Chapter title</span>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <code className="text-sm font-mono bg-background px-1.5 py-0.5 rounded">file</code>
                <span className="text-sm text-muted-foreground ml-2">(required) - Path to audio file</span>
              </div>
              <div className="border-l-2 border-muted pl-3">
                <code className="text-sm font-mono bg-background px-1.5 py-0.5 rounded">start_time</code>
                <span className="text-sm text-muted-foreground ml-2">(optional) - Start timestamp in seconds</span>
              </div>
              <div className="border-l-2 border-muted pl-3">
                <code className="text-sm font-mono bg-background px-1.5 py-0.5 rounded">duration</code>
                <span className="text-sm text-muted-foreground ml-2">(optional) - Chapter duration in seconds</span>
              </div>
              <div className="border-l-2 border-muted pl-3">
                <code className="text-sm font-mono bg-background px-1.5 py-0.5 rounded">chapter_number</code>
                <span className="text-sm text-muted-foreground ml-2">(optional) - Sequential chapter number</span>
              </div>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
                Show chapters.json example
              </summary>
              <div className="mt-3 bg-background rounded border p-3 text-xs font-mono overflow-x-auto">
                <div>[</div>
                <div className="ml-2">{'{'}</div>
                <div className="ml-4">&quot;chapter_number&quot;: 1,</div>
                <div className="ml-4">&quot;title&quot;: &quot;Prologue&quot;,</div>
                <div className="ml-4">&quot;file&quot;: &quot;audio/chapter-01.mp3&quot;,</div>
                <div className="ml-4">&quot;start_time&quot;: 0,</div>
                <div className="ml-4">&quot;duration&quot;: 1820</div>
                <div className="ml-2">{'},'},</div>
                <div className="ml-2">{'{'}</div>
                <div className="ml-4">&quot;chapter_number&quot;: 2,</div>
                <div className="ml-4">&quot;title&quot;: &quot;Chapter 1: The Beginning&quot;,</div>
                <div className="ml-4">&quot;file&quot;: &quot;audio/chapter-02.mp3&quot;,</div>
                <div className="ml-4">&quot;start_time&quot;: 0,</div>
                <div className="ml-4">&quot;duration&quot;: 2145</div>
                <div className="ml-2">{'}'}</div>
                <div>]</div>
              </div>
            </details>
          </div>
        </div>

        {/* Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Example</h3>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "type": "audio_book",
  "title": "The Great Adventure",
  "authors": ["John Doe"],
  "narrators": ["Jane Smith"],
  "description": "An epic tale of courage and discovery.",
  "duration": 43200,
  "cover_image": "cover.jpg",
  "published_date": "2024-03-01",
  "language": "en",
  "isbn": "978-0-123456-78-9",
  "tags": ["fantasy", "adventure"]
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
