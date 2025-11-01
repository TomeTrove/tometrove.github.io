'use client';

import { AlertCircle, XCircle } from 'lucide-react';
import { TomeErrorDetails } from '@/lib/types';

interface ErrorDisplayProps {
  error: TomeErrorDetails;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-destructive">{error.message}</h3>
          {error.details && (
            <p className="text-sm text-destructive/80">{error.details}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-destructive/60 hover:text-destructive transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
