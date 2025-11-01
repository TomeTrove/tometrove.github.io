'use client';

import { Save, Download, RotateCcw, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ActionBarProps {
  filename: string | null;
  isModified: boolean;
  isValid: boolean;
  onSave: () => void;
  onDownload: () => void;
  onReset: () => void;
  onFormat: () => void;
  disabled?: boolean;
}

export function ActionBar({
  filename,
  isModified,
  isValid,
  onSave,
  onDownload,
  onReset,
  onFormat,
  disabled = false,
}: ActionBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b bg-muted/30">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {filename || 'No file loaded'}
          </span>
          {filename && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isModified ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Modified</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Saved</span>
                </>
              )}
              <span className="mx-1">•</span>
              {isValid ? (
                <>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Valid JSON</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 text-destructive" />
                  <span>Invalid JSON</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFormat}
          disabled={disabled || !filename}
        >
          <FileText className="h-4 w-4" />
          Format
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={disabled || !isModified}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={disabled || !filename || !isValid || !isModified}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onDownload}
          disabled={disabled || !filename || !isValid}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
