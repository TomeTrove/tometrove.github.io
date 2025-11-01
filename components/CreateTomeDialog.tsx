'use client';

import { useState, useEffect } from 'react';
import { FileArchive } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { TomeTemplate } from '@/lib/types';
import { loadTemplates } from '@/lib/templateHandler';

interface CreateTomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (filename: string, templateId: string) => void;
}

export function CreateTomeDialog({ open, onOpenChange, onCreate }: CreateTomeDialogProps) {
  const [filename, setFilename] = useState('');
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState<TomeTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('basic');
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  // Load templates when dialog opens
  useEffect(() => {
    if (open) {
      loadTemplates()
        .then((loadedTemplates) => {
          setTemplates(loadedTemplates);
          setIsLoadingTemplates(false);
          // Set default template if not already set
          if (!selectedTemplateId && loadedTemplates.length > 0) {
            setSelectedTemplateId(loadedTemplates[0].id);
          }
        })
        .catch((err) => {
          console.error('Failed to load templates:', err);
          setIsLoadingTemplates(false);
        });
    }
  }, [open, selectedTemplateId]);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleCreate = () => {
    // Validate filename
    if (!filename.trim()) {
      setError('Please enter a filename');
      return;
    }

    // Ensure .tome extension
    let finalFilename = filename.trim();
    if (!finalFilename.toLowerCase().endsWith('.tome')) {
      finalFilename += '.tome';
    }

    // Validate filename characters
    if (!/^[a-zA-Z0-9_\-. ]+$/.test(finalFilename.replace('.tome', ''))) {
      setError('Filename contains invalid characters');
      return;
    }

    onCreate(finalFilename, selectedTemplateId);
    setFilename('');
    setError('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFilename('');
    setError('');
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileArchive className="h-5 w-5" />
            Create New .tome File
          </DialogTitle>
          <DialogDescription>
            Create a new .tome file with a pre-populated template. You can edit the JSON content after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              placeholder="my-project.tome"
              value={filename}
              onChange={(e) => {
                setFilename(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The .tome extension will be added automatically if not provided
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
              disabled={isLoadingTemplates || templates.length === 0}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplate && (
              <p className="text-xs text-muted-foreground">
                {selectedTemplate.description}
              </p>
            )}
          </div>

          {selectedTemplate && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-semibold text-foreground">Template includes:</p>
              <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                <li>• tome.json with metadata</li>
                {selectedTemplate.files.map((file) => (
                  <li key={file.path}>• {file.path}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
