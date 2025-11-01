'use client';

import Link from 'next/link';
import { Archive, ArrowLeft, BookMarked, FileArchive, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.includes("/editor")) return children;
  if (pathname.includes("/viewer")) return children;
  if (pathname.includes("/reader")) return children;

  const converterInfo = {
    cbz: {
      title: 'CBZ to Tome Converter',
      description: 'Convert your CBZ (comic book archive) files to Tome format',
      icon: Archive,
    },
    epub: {
      title: 'EPUB to Tome Converter',
      description: 'Convert your EPUB files to Tome format while preserving original content',
      icon: BookMarked,
    },
  };

  // Determine which converter we're in
  let currentConverter = '';
  if (pathname.includes('/converters/cbz')) {
    currentConverter = 'cbz';
  } else if (pathname.includes('/converters/epub')) {
    currentConverter = 'epub';
  }

  const info = converterInfo[currentConverter as keyof typeof converterInfo];
  const IconComponent = info?.icon || Zap;

  
  if (pathname == "/tools") return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <FileArchive className="h-6 w-6 text-primary-foreground" />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Tools</h1>
                <p className="text-sm text-muted-foreground">Tome Trove Utilities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Bar */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link href="/tools">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <IconComponent className="h-6 w-6 text-primary-foreground" />
                </div>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold truncate">{info?.title}</h1>
                <p className="text-sm text-muted-foreground truncate">{info?.description}</p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
