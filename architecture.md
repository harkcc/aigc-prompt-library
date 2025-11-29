# Project Architecture

This document tracks the purpose of each file in the project.

## Root Directory
- `AIGC-design-document.md`: Project design specification and roadmap.
- `progress.md`: Tracks the completion status of project phases.
- `architecture.md`: This file.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `next.config.js`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `postcss.config.js`: PostCSS configuration.

## Source Directory (`src/`)

### `src/app/` (Next.js App Router)
- `layout.tsx`: Root layout component with Header.
- `page.tsx`: Homepage component (Waterfall grid).
- `template/[id]/page.tsx`: Prompt detail page.

### `src/components/`
#### `src/components/layout/`
- `Header.tsx`: Main navigation header.

#### `src/components/ui/` (Atomic Components)
- `Card.tsx`: Reusable card component with black border style.
- `Button.tsx`: Reusable button component with variants.
- `Badge.tsx`: Reusable badge/tag component.

#### `src/components/business/` (Business Logic Components)
- `VariableTag.tsx`: Component to display and interact with prompt variables.
- `PromptParser.tsx`: Component that parses text and renders VariableTags.
- `PromptCard.tsx`: The main card component displaying a prompt with image and details.

### `src/lib/` (Utilities)
- `types.ts`: TypeScript interfaces for the project.
- `utils.ts`: Utility functions (e.g., `cn` for class merging).
- `parser-utils.ts`: Logic for parsing prompt strings.

### `src/styles/`
- `globals.css`: Global styles and Tailwind directives.
