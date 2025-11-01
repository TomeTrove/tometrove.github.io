import { TomeTemplate, TemplateConfig } from './types';

let cachedTemplates: TomeTemplate[] | null = null;

/**
 * Load templates from the configuration file
 */
export async function loadTemplates(): Promise<TomeTemplate[]> {
  if (cachedTemplates) {
    return cachedTemplates;
  }

  try {
    const response = await fetch('/config/templates.json');
    if (!response.ok) {
      throw new Error(`Failed to load templates: ${response.statusText}`);
    }

    const config: TemplateConfig = await response.json();
    cachedTemplates = config.templates;
    return cachedTemplates;
  } catch (error) {
    console.error('Error loading templates:', error);
    // Return a default basic template as fallback
    return [{
      id: 'basic',
      name: 'Basic',
      description: 'Simple tome with minimal metadata',
      tomeJson: {
        name: '',
        version: '1.0.0',
        description: '',
        author: '',
        created: '',
      },
      files: [],
    }];
  }
}

/**
 * Get a specific template by ID
 */
export async function getTemplateById(id: string): Promise<TomeTemplate | null> {
  const templates = await loadTemplates();
  return templates.find(template => template.id === id) || null;
}

/**
 * Get the default template (basic)
 */
export async function getDefaultTemplate(): Promise<TomeTemplate> {
  const templates = await loadTemplates();
  return templates.find(template => template.id === 'basic') || templates[0];
}

/**
 * Prepare template tome.json with current date
 */
export function prepareTemplateTomeJson(template: TomeTemplate): any {
  const tomeJson = { ...template.tomeJson };

  // Set created date to current date if it's empty
  if ('created' in tomeJson && !tomeJson.created) {
    const today = new Date();
    tomeJson.created = today.toISOString().split('T')[0];
  }

  return tomeJson;
}

/**
 * Clear the template cache (useful for development/testing)
 */
export function clearTemplateCache(): void {
  cachedTemplates = null;
}
