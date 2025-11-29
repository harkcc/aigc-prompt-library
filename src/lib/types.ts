// Basic types based on the design doc

export type PromptCategory = 'Template' | 'Effect' | 'Tool' | 'Showcase';

export interface Prompt {
  id: string;
  title: string;
  content_raw: string;
  main_image_url: string;
  category: PromptCategory;
  author: string;
  created_at: string;
  parent_id?: string;
}

export interface Collection {
  id: string;
  title: string;
  cover_image: string;
  description: string;
}

export interface VariableDefinition {
  key: string;
  label_cn: string;
  default_value: string;
  color_theme: 'blue' | 'green' | 'yellow' | 'red';
}
