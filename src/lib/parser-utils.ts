/**
 * Segment types for the prompt parser
 */
export type PromptSegment = 
  | { type: 'text'; content: string }
  | { type: 'variable'; content: string };

/**
 * Parses a raw prompt string into segments.
 * Matches content inside square brackets [CONTENT] as variables.
 * 
 * Example: "Create a [style] image of [subject]"
 * Returns: [
 *   { type: 'text', content: 'Create a ' },
 *   { type: 'variable', content: 'style' },
 *   { type: 'text', content: ' image of ' },
 *   { type: 'variable', content: 'subject' }
 * ]
 */
export function parsePrompt(raw: string): PromptSegment[] {
  if (!raw) return [];

  // Regex to match text inside square brackets
  const regex = /\[(.*?)\]/g;
  const segments: PromptSegment[] = [];
  
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    // Add the text before the match
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: raw.slice(lastIndex, match.index),
      });
    }

    // Add the variable (content inside brackets)
    segments.push({
      type: 'variable',
      content: match[1], // capture group 1
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < raw.length) {
    segments.push({
      type: 'text',
      content: raw.slice(lastIndex),
    });
  }

  return segments;
}
