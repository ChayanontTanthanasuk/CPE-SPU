# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Build & Dev Commands

```bash
bun dev          # Start Vite dev server with HMR
bun run build    # TypeScript check + Vite production build
bun run lint     # ESLint across the project
bun run preview  # Preview production build locally
bun test         # Run Vitest tests
```

Package manager is **bun**. Pre-commit hook runs `bun lint-staged` (prettier + eslint --fix on staged `.ts/.tsx/.js/.jsx` files).

## Architecture

React 19 + TypeScript SPA using the TanStack ecosystem (Router, Query, Form, Table) with Radix UI + Tailwind CSS v4 for UI, and Zod for validation. i18next provides Thai/English translations.

### Path alias

`@/*` maps to `./src/*`

### Source layout

```
src/
├── app/
│   ├── router/
│   │   └── routes/       ← File-based routes (auto-generates routeTree.gen.ts)
│   ├── App.tsx
│   └── types.d.ts
├── features/             ← Feature modules (self-contained, no cross-imports)
├── shared/
│   ├── components/
│   │   └── ui/           ← Radix+Tailwind primitives (do not edit)
│   ├── hooks/
│   └── lib/
├── infra/
│   └── http/             ← HTTP client with interceptor chain
├── i18n/
│   ├── th.json
│   └── en.json
└── styles/
    └── globals.css
```

### Routing

TanStack Router with **file-based routing** in `src/app/router/routes/`. Route tree is auto-generated (`routeTree.gen.ts` — do not edit). Auto code-splitting is enabled.

### Feature Module Convention

```
src/features/{feature-name}/
├── pages/       ← Route components (lazy-loaded)
├── views/       ← Presentational containers
├── components/  ← Feature-specific UI
├── hooks/       ← Custom hooks
├── schemas/     ← Zod schemas
├── constants/   ← Column defs, form layouts, query keys
└── types.d.ts   ← TypeScript types (always use `export type`)
```

## Code Style

- Prettier: 2-space indent, single quotes, trailing commas
- ESLint: import ordering (alphabetical with newline between groups), unused vars with `_` prefix
- `src/shared/components/ui/**` is excluded from ESLint (generated components — do not edit)
- Pre-commit hook: `bun lint-staged`

## Rules

- No cross-feature imports — use `src/shared/` for shared code
- Do not edit `routeTree.gen.ts` — auto-generated
- Do not edit files in `src/shared/components/ui/` — generated Radix+Tailwind primitives
- i18n keys for all user-facing text — add to `src/i18n/th.json` and `src/i18n/en.json`
