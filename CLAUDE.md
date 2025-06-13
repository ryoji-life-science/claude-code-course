# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language

**必ずやり取りは日本語で回答するようにして** - Always respond in Japanese when working in this repository.

## Project Structure

This is a Claude Code learning repository containing multiple Next.js projects organized numerically:

- `01-landing-page/` - Claude Code Academy landing page (static marketing site)
- `02-task-manager/` - Task management app with CRUD operations
- `03-*` - Future projects follow this numbering pattern

Each project is a standalone Next.js 15 application with TypeScript and Tailwind CSS.

## Development Commands

### Per-Project Commands
Navigate to specific project folder first:
```bash
cd 01-landing-page  # or 02-task-manager
npm run dev         # Start development server with Turbopack
npm run build       # Production build
npm run start       # Start production server
npm run lint        # Run ESLint
```

Development server runs on `http://localhost:3000` by default.

## Architecture Overview

### Landing Page (01-landing-page)
- Single-page marketing site with sectioned content
- Static components with responsive design
- Uses semantic HTML sections with id-based navigation
- Tailwind utility classes for styling
- No client-side state management

### Task Manager (02-task-manager)
- Client-side React application (`'use client'` directive)
- Local state management with React hooks (useState, useEffect)
- Browser localStorage for data persistence
- TypeScript interfaces for type safety:
  - `Task` interface with id, text, completed, createdAt
  - `FilterType` union type for filtering states
- CRUD operations through state mutations
- Real-time filtering and statistics calculation

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack (via `--turbopack` flag)
- **Linting**: ESLint with Next.js config

## Data Patterns

### Task Manager Data Flow
1. Initial load: Read from localStorage via useEffect
2. State updates: Modify tasks array via setState
3. Side effects: Auto-save to localStorage on tasks change
4. Filtering: Computed from current tasks array, not stored

### Component Patterns
- Functional components with hooks
- Conditional rendering for empty states
- Event handlers for user interactions
- Inline styles using Tailwind classes
- Japanese language UI text

## Project Naming Convention

New projects should follow the format: `0X-project-name/` where X is the next sequential number.

## Git Workflow

Refer to `GIT_WORKFLOW.md` for detailed Git operation guidelines. Key reminders:
- Commit immediately after implementing any feature
- Push at the end of each work session
- Use descriptive commit messages in Japanese
- Follow the established commit message templates