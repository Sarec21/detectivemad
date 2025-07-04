# Arquitectura Técnica — Detective 🕵️‍♂️  
_Versión 0.1 – julio 2025_

---

## 1. Visión general

Detective es una SPA (Single-Page Application) construida en **React 18 + Vite + TypeScript**.  
La capa de lógica de juego vive en **Zustand** (stores) y en una serie de **CLIs** que generan y validan los casos de interrogatorio.  
Todo el flujo se valida automáticamente en CI (Codex) con **ESLint + Prettier**, **Jest**, **AJV** y un **build de producción**.

Navegador ─▶ React Screens ─▶ Zustand Stores ─▶ OpenAI Agents (local/GPT) ─▶ JSON Case Files

yaml
Copiar código

---

## 2. Estructura de carpetas

src/
screens/ ← pantallas UI (Splash, MainMenu, CaseIntro, Interrogation…)
store/ ← Zustand slices (playerStore, caseStore, suspectStore…)
hooks/ ← hooks reutilizables (useCurrentCase, useDebugToggle…)
components/ ← UI smaller components (TimelinePreview, EvidenceCard…)
router.tsx ← definición de rutas (React Router v6)

tools/
validateCase.js ← CLI AJV para validar casos
generateCase.ts ← (WIP) CLI que genera un caso a partir de un prompt

docs/
design/ ← biblia, flujo de pantallas, descripción de agentes
tech/ ← este documento y otros de arquitectura
schema/ ← detective_case_schema_v2.1.json

public/ ← estáticos globales (favicon, logo.svg)

yaml
Copiar código

---

## 3. Stack principal

| Capa | Tecnología | Motivo |
|------|------------|--------|
| **Bundler / Dev-Server** | Vite 7 | Arranque < 1 s, HMR instantáneo |
| **UI** | React 18 + React Router v6 | Ecosistema maduro, Suspense, rutas anidadas |
| **Estado global** | Zustand 5 | API mínima (20 LOC) sin boilerplate |
| **Tipado** | TypeScript 5 strict | Contratos claros → menos bugs |
| **Lint / Format** | ESLint 8 (Airbnb) + Prettier 3 | Consistencia de estilo |
| **Tests** | Jest 29 + RTL | Foco en comportamiento del usuario |
| **Validación JSON** | AJV 8 | Garantiza que cada caso cumpla el esquema |
| **CI** | Codex Tasks | Instala → lint → test → validate → build |

---

## 4. Flujo de datos y stores

[React Screen] ◀─ uses ─▶ usePlayerStore { rank, reputation, xp }
▲
│ setCurrentCase()
▼
useCaseStore { currentCase, loading }
▲
│ changes tolerance, paranoia…
▼
useSuspectStore { tolerance, suggestibility }

yaml
Copiar código

1. El *Router* establece `/case/:slug/*`.  
2. `CaseIntro` llama `setCurrentCase(slug)` que carga el JSON en `caseStore`.  
3. `InterrogationScreen` consume `suspectStore` para mostrar barras de tolerancia y enviar prompts al agente GPT.  
4. Al cerrar, `CommissaryEvaluation` escribe en `evaluationStore` y pasa a `CaseResultScreen`.

---

## 5. CLIs (Consola de Codex)

| Comando | Propósito |
|---------|-----------|
| `pnpm validate:case <path>` | Valida un archivo de caso con AJV v2.1 |
| `pnpm generate:case <prompt>` | (WIP) Genera un caso desde un prompt + OpenAI |

---

## 6. Pipeline CI (Codex)

```bash
corepack enable && corepack prepare pnpm@10 --activate
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm validate:case docs/cases/demo_case.json
pnpm build
Pasa en main y en cualquier rama de feature para evitar merges rotos.

7. Convenciones
Commits: Conventional Commits (feat:, fix:, docs:…).

Ramas: feature/<tema>, bugfix/<tema>, hotfix/<tema>.

Imports absolutos: usa @/ alias (config tsconfig + vite).

Nombres de IDs JSON:

Timeline: tl_ab12, Evidence: ev_cd34.

Sin espacios, sólo alfanum y guion bajo.

8. Roadmap técnico
MVP pantallas completo (rama pantallas).

Integrar OpenAI SDK detrás de un flag .env.

Persistencia local (IndexedDB) para progreso y stats.

Cargar casos remotos desde GitHub Raw o S3.

Diseño final UI + Animaciones (Framer Motion).

Dockerfile production-ready.

Feel free to update this doc as the architecture evolves.

yaml
Copiar código

---

### Próximos pasos

1. Crea la carpeta si no existe:  
   ```powershell
   mkdir -Force docs\tech
