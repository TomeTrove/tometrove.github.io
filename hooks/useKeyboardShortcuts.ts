import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSave?: () => void;
  onDownload?: () => void;
  onReset?: () => void;
  onFormat?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onDownload,
  onReset,
  onFormat,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Ctrl/Cmd + S: Save
      if (isCtrlOrCmd && event.key === 's') {
        event.preventDefault();
        onSave?.();
      }

      // Ctrl/Cmd + D: Download
      if (isCtrlOrCmd && event.key === 'd') {
        event.preventDefault();
        onDownload?.();
      }

      // Ctrl/Cmd + R: Reset (only if Shift is also pressed)
      if (isCtrlOrCmd && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        onReset?.();
      }

      // Ctrl/Cmd + Shift + F: Format
      if (isCtrlOrCmd && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        onFormat?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave, onDownload, onReset, onFormat]);
}
