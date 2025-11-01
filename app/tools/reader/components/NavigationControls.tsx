'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  readingDirection: 'ltr' | 'rtl';
  layoutDirection: 'vertical' | 'horizontal';
}

export function NavigationControls({
  currentPage,
  totalPages,
  onPageChange,
  readingDirection,
  layoutDirection,
}: NavigationControlsProps) {
  const [inputValue, setInputValue] = useState((currentPage + 1).toString());

  const handlePrevious = () => {
    if (layoutDirection === 'horizontal') {
      if (readingDirection === 'ltr') {
        onPageChange(Math.max(0, currentPage - 1));
      } else {
        onPageChange(Math.min(totalPages - 1, currentPage + 1));
      }
    }
  };

  const handleNext = () => {
    if (layoutDirection === 'horizontal') {
      if (readingDirection === 'ltr') {
        onPageChange(Math.min(totalPages - 1, currentPage + 1));
      } else {
        onPageChange(Math.max(0, currentPage - 1));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const pageNum = parseInt(value, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum - 1);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(inputValue, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum - 1);
      } else {
        setInputValue((currentPage + 1).toString());
      }
      (e.target as HTMLInputElement).blur();
    }
  };

  // Update input when page changes externally
  if (parseInt(inputValue, 10) !== currentPage + 1) {
    setInputValue((currentPage + 1).toString());
  }

  return (
    <div className="border-t bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={layoutDirection === 'vertical' || (readingDirection === 'ltr' && currentPage === 0) || (readingDirection === 'rtl' && currentPage === totalPages - 1)}
            className="gap-2"
          >
            {readingDirection === 'ltr' ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Previous</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Page Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="w-16 px-2 py-1 border rounded text-center text-sm"
              disabled={layoutDirection === 'vertical'}
            />
            <span className="text-sm text-muted-foreground">
              / {totalPages}
            </span>
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={layoutDirection === 'vertical' || (readingDirection === 'ltr' && currentPage === totalPages - 1) || (readingDirection === 'rtl' && currentPage === 0)}
            className="gap-2"
          >
            {readingDirection === 'ltr' ? (
              <>
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Next</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
