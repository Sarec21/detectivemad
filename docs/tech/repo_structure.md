# repo\_structure.md

> **Purpose**: Canonical folder layout and mandatory config files for the Detective game repository. This file is the single source of truth for Codex and human contributors when adding or moving files.

## 1. Root layout

```text
.
├── README.md                # project overview (to be written)
├── repo_structure.md        # this file
├── Biblia_3.0.md            # design bible (imported)
├── package.json             # npm scripts + deps
├── tsconfig.json            # TypeScript compiler options
├── vite.config.ts           # Vite bundler config
├── .eslintrc.cjs            # ESLint (Airbnb + Prettier)
├── .prettierrc.json         # Prettier formatting rules
├── scripts/                 # one‑off dev tasks (optional)
├── tools/                   # permanent CLI tools (validate, generate)
├── public/                  # static assets (evidence demo, favicon)
└── src/                     # application source code
```

> **NOTE**: `scripts/` is for ad‑hoc developer helpers (e.g. migration scripts) that aren’t shipped; `tools/` holds versioned CLI utilities used by CI (e.g. `validateCase.ts`).

## 2. `src/` detailed tree

```text
src/
├── components/      # pure presentational React components (UI only)
├── screens/         # route‑level views (compose components + hooks)
├── logic/           # game mechanics (tolerance calc, score, evaluators)
├── store/           # Zustand global state slices
├── hooks/           # reusable React hooks (e.g. useGameState)
├── utils/           # generic helpers (date, string, etc.)
├── prompts/         # .txt templates (NOT bundled in front-end build)
└── index.tsx        # app entrypoint
```

**UI vs Logic separation**

- `components/` **never** import from `logic/`; they only receive props.
- `logic/` holds pure functions, no React.
- `screens/` glue both worlds.

... Naming & casing

| Folder / File     | Style                   | Example                                  |
| ----------------- | ----------------------- | ---------------------------------------- |
| React component   | PascalCase              | `CaseScreen.tsx`                         |
| Functions / utils | camelCase               | `calculateScore.ts`                      |
| JSON data file    | kebab-case              | `broken-cup.json`                        |
| Test files        | camelCase + `.test.ts`  | `emotionEngine.test.ts`                  |
| IDs in JSON       | `^ev_`, `^tl_`, `^ach_` | `ev_keycard`, `tl_arrive`, `ach_perfect` |

## 3. NPM scripts (package.json)

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint --ext .ts,.tsx src",
    "format": "prettier --write .",
    "test": "jest",
    "validate:case": "ts-node tools/validateCase.ts",
    "generate:case": "ts-node tools/generateCaseFromPrompt.ts"
  }
}
```

## 4. Environment variables (`.env`)

| Var                        | Purpose                           |
| -------------------------- | --------------------------------- |
| `VITE_OPENAI_ASSISTANT_ID` | Custom assistant ID for GPT calls |
| `VITE_OPENAI_API_KEY`      | API key (never commit real key)   |
| `VITE_GPT_MODEL`           | default model ("gpt-4o")          |
| `VITE_MODE`                | "local" or "gpt"                  |

## 5. CI / CD

- GitHub Actions workflow `ci.yml` will run `npm ci`, `lint`, `test`, and `validate:case` on every PR.
- Deploy preview via Vercel (to be configured).

## 6. File addition rules for Codex

1. **Never** create files outside the paths defined above.
2. New React components → `/src/components` or `/src/screens` as PascalCase.
3. New pure logic modules → `/src/logic`.
4. Prompt templates (.txt) → `/src/prompts`.
5. JSON cases → `/data/cases`, **must** pass `validate:case`.
6. Tests accompany the module they test in `/src/tests`.

## 7. Migration notes

- Legacy docs merged into `docs/`.
- Old redundant templates removed.

> **Last updated:** 2025‑06‑29

