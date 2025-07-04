# Detective – Narrative Interrogation Game (MVP)

> *“Pull the truth out clean — without breaking them.”*

A single‑suspect interrogation game built with **React + TypeScript + Vite**.  
The player studies a dossier, interrogates the suspect in timed turns, then presents a final hypothesis to the Comisario (GPT Commander) who delivers a dramatic verdict.

---

## Features (MVP)

- 🗃️ **Dossier UI** with timeline & evidence (Markdown notes, drag‑to-present).
- 🗣️ **Dynamic interrogation** driven by emotional variables (tolerance, paranoia, suggestibility).
- ⏳ **24 h fictional timer** with optional cooldown pauses.
- 🎯 **Comisario evaluation**: GPT scores the player via five structured answers.
- 🏅 **Rank & reputation** system across phases and cases.
- 🛠️ **Debug HUD** (`Ctrl / ⌘ + D`) to inspect state in dev builds.

---

## Requirements

| Tool       | Version |
| ---------- | ------- |
| **Node.js**| ≥ 18 (LTS recommended) |
| **npm**    | comes with Node (default package manager) |
| *(Optional)* **pnpm** | ≥ 8 (`npm i -g pnpm`) — faster installs |

---

## Installation

```bash
# 1 – Clone repo
git clone https://github.com/your-org/detective.git
cd detective

# 2 – Install dependencies (npm default)
npm install
# or, if you prefer:
# pnpm install

# 3 – Copy env vars
cp .env.example .env          # add your OpenAI key if needed
```

---

## Running the app

```bash
# Local-only mode (mock AI)
npm run dev -- --mode local

# GPT-connected mode (requires OPENAI key)
npm run dev -- --mode gpt
```

---

### NPM scripts

| Script               | What it does |
| -------------------- | ------------ |
| `npm run dev`        | Starts Vite dev server (`localhost:5173`). |
| `npm run build`      | Production build into `dist/`. |
| `npm run preview`    | Local preview of production build. |
| `npm run test`       | Runs Jest unit tests. |
| `npm run lint`       | ESLint + Prettier check. |
| `npm run format`     | Formats codebase with Prettier. |
| `npm run validate:case` | Validates all JSON cases against schema (`tools/validateCase.ts`). |
| `npm run generate:case` | CLI to create a new case from prompt (`tools/generateCaseFromPrompt.ts`). |

---

## Folder layout (tl;dr)

See **repo_structure.md** for the canonical, always-up-to-date map.

```text
src/
  components/   # presentational UI
  screens/      # route-level views
  store/        # Zustand state slices
  logic/        # pure game mechanics
  hooks/        # reusable React hooks
  prompts/      # .txt templates injected into GPT
  utils/        # helpers

data/
  cases/        # JSON cases (must pass schema)

docs/
  schema/       # detective_case_v2.1.schema.json
  ...
```

---

## Dev workflow

1. Create a feature branch from `dev`.  
2. Code → **commit using Conventional Commits** (`feat:`, `fix:`, `docs:`…).  
3. `npm run lint && npm run test && npm run validate:case`.  
4. Open a PR → GitHub CI runs the same checks.  
5. After merge, CI deploys preview to Vercel.

---

## Documentation

- **Biblia 3.0** – full design bible.  
- **detective_case_fields_v2.schema.json** – machine-readable case schema.  
- **screen_flow.md** – canonical UI map.  
- **repo_structure.md** – folder & naming rules.  
- **agents.md** – contracts for every GPT / local agent.

---

## Contributing & coding style

- ESLint config: **Airbnb + Prettier** (`singleQuote`, `semi`).  
  `npm run lint -- --fix` before committing.  
- Unit tests live next to code (`something.test.ts[x]`).  
- Comments explaining narrative logic can be in Spanish; code and docs in English.  
- Never call the OpenAI API directly from UI components; go through helpers in `/logic/`.

---

## License

© 2025 Detective Team – released under the **MIT License** (see `LICENSE` file).

