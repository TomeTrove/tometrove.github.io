'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft,Archive, FileCode, FolderTree, Link as LinkIcon, ChevronRight, BookOpen, FileImage, Headphones, BookImage, Menu, X, BookMarked, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StandardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [typesExpanded, setTypesExpanded] = useState(true);

  const isActive = (path: string) => pathname === path;

  const sidebarContent = (
    <>
      {/* Introduction */}
      <Link href="/standards">
        <button
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            isActive('/standards')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <Lightbulb className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">Introduction</span>
        </button>
      </Link>

      {/* File Structure */}
      <Link href="/standards/file-structure">
        <button
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            isActive('/standards/file-structure')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <FolderTree className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">File Structure</span>
        </button>
      </Link>

      {/* Linking & Paths */}
      <Link href="/standards/linking">
        <button
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            isActive('/standards/linking')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <LinkIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">Linking & Paths</span>
        </button>
      </Link>

      {/* Type Standards - Expandable */}
      <div className="mt-2">
        <button
          onClick={() => setTypesExpanded(!typesExpanded)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-accent transition-colors"
        >
          <FileCode className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1 text-left">Type Standards</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${typesExpanded ? 'rotate-90' : ''}`} />
        </button>

        {typesExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            <Link href="/standards/types/epub">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/standards/types/epub')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <BookMarked className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm">epub</span>
              </button>
            </Link>

            <Link href="/standards/types/book">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/standards/types/book')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm">book</span>
              </button>
            </Link>

            <Link href="/standards/types/book_chapter">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/standards/types/book_chapter')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm">book_chapter</span>
              </button>
            </Link>

            <Link href="/standards/types/audio_book">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/standards/types/audio_book')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <Headphones className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm">audio_book</span>
              </button>
            </Link>

            <Link href="/standards/types/comic_series">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/standards/types/comic_series')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <BookImage className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm">comic_series</span>
              </button>
            </Link>
            <Link href="/standards/types/comic_volume">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/standards/types/comic_volume')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <BookImage className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm">comic_volume</span>
              </button>
            </Link>

            <Link href="/standards/types/comic_chapter">
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/standards/types/comic_chapter')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <BookImage className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-sm">comic_chapter</span>
              </button>
            </Link>
          </div>
        )}
        {/* Format Conversion Guides - Expandable */}
        <div className="mt-2">
          <button
            onClick={() => setTypesExpanded(!typesExpanded)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-accent transition-colors"
          >
            <FileCode className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium flex-1 text-left">Format Conversion</span>
            <ChevronRight className={`h-4 w-4 transition-transform ${typesExpanded ? 'rotate-90' : ''}`} />
          </button>

          {typesExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="/standards/cbz">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/standards/cbz')
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <Archive className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm">Replacing CBZs</span>
                </button>
              </Link>

              <Link href="/standards/epub-converting">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/standards/epub-converting')
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <BookMarked className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm">Replacing EPUBs</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/`}>
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <FileCode className="h-5 w-5 text-primary-foreground" />
              </div>
              </Link>
              <h1 className="text-2xl font-bold">Tome Standards</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden"
              >
                {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-card overflow-y-auto">
          <nav className="p-4 space-y-1">
            {sidebarContent}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-[73px] bottom-0 w-64 bg-card border-r z-50 overflow-y-auto lg:hidden">
              <nav className="p-4 space-y-1">
                {sidebarContent}
              </nav>
            </aside>
          </>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center">
            These standards are recommendations. Feel free to extend or customize them for your needs.
          </p>
        </div>
      </footer>
    </div>
  );
}
