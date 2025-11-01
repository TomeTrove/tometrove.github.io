'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TOCEntry } from '../renderers/BaseRenderer';

interface SidebarProps {
  toc: TOCEntry[];
  currentPageIndex: number;
  onNavigate: (entry: TOCEntry) => void;
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ toc, currentPageIndex, onNavigate, open }: SidebarProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root']));

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderTOCEntry = (entry: TOCEntry, level: number = 0): React.ReactNode => {
    const isExpanded = expandedIds.has(entry.id);
    const hasChildren = entry.children && entry.children.length > 0;
    const isCurrent = currentPageIndex === entry.pageIndex;

    return (
      <div key={entry.id}>
        <button
          onClick={() => {
            onNavigate(entry);
            if (hasChildren) {
              toggleExpand(entry.id);
            }
          }}
          className={`
            w-full text-left px-3 py-2 rounded-md transition-colors
            ${isCurrent
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'hover:bg-muted text-sm'
            }
            flex items-center gap-2
          `}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {hasChildren && (
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 transition-transform ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(entry.id);
              }}
            />
          )}
          {!hasChildren && <div className="h-4 w-4 flex-shrink-0" />}
          <span className="truncate">{entry.title}</span>
        </button>

        {hasChildren && isExpanded && (
          <div>
            {entry.children!.map((child) => renderTOCEntry(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r bg-card overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="font-semibold text-sm mb-4">Table of Contents</h2>
          <div className="space-y-1">
            {toc.map((entry) => renderTOCEntry(entry))}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Modal */}
      {open && (
        <aside className="fixed inset-0 z-50 md:hidden bg-card border-r w-64 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="font-semibold text-sm mb-4">Table of Contents</h2>
            <div className="space-y-1">
              {toc.map((entry) => renderTOCEntry(entry))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
