# screen_flow.md

> **Purpose:** Canonical UI/UX map for the Detective MVP. All routes assume **React Router v6** with `<BrowserRouter>` as the app wrapper.

## Global routing & dev helpers
- **Case route pattern**: `/case/:slug/(intro|dossier|interrogation|evaluation|result)` where `:slug` is the kebab‑case ID from `meta.slug` (e.g. `the-stained-cup`).
- **DebugPanel**: overlay toggled by `Ctrl + D` (Windows/Linux) or `⌘ + D` (macOS) and by a small ⚙ icon visible only in development builds.

---

## Screen list

| # | Component (React) | Path | Key state slices (Zustand) | Emits events |
|---|-------------------|------|---------------------------|--------------|
| 1 | `SplashScreen.tsx` | `/` | `appStore.mode`, `settingsStore.theme` | `initApp()` |
| 2 | `MainMenu.tsx` | `/menu` | `playerStore.rango`, `playerStore.reputation` | `navigateToCaseSelect()` |
| 3 | `CaseSelect.tsx` | `/cases` | `caseStore.available`, `playerStore.rango`, `playerStore.caseFailures` | `startCase(slug)` |
| 4 | `CaseIntro.tsx` | `/case/:slug/intro` | `caseStore.current` | `goToDossier()` |
| 5 | `DossierScreen.tsx` | `/case/:slug/dossier` | `caseStore.current` | `startInterrogation()` |
| 6 | `InterrogationScreen.tsx` | `/case/:slug/interrogation` | `gameStore.timer`, `suspectStore.*`, `caseStore.current` | `askQuestion()`, `pauseInterrogation()`, `resolveNow()` |
| 7 | `CommissaryEvaluation.tsx` | `/case/:slug/evaluation` | `evaluationStore.inputs`, `caseStore.current`, `playerStore.rango` | `submitEvaluation()` |
| 8 | `CaseResultScreen.tsx` | `/case/:slug/result` | `evaluationStore.result`, `playerStore.*` | `returnToMenu()`, `retryCase()` |
| 9 | `PlayerProfile.tsx` | `/profile` | `playerStore.*`, `achievementStore.top10` | Tabs: **Achievements** (default) / **Statistics** |
| 10 | `DebugPanel.tsx` *(overlay)* | `/debug` (internal) | `suspectStore.*`, `gameStore.timer`, `debugStore.log` | `toggleDebug()` |

---

## Notes
- **UI separation**: visual components live in `/src/components/`; each screen is a wrapper in `/src/screens/` importing UI fragments and hooks.
- **Hooks folder**: common hooks (`useGameState.ts`, `useTimer.ts`) reside in `/src/hooks/`.
- **Logic isolation**: business rules in `/src/logic/` (e.g. `calculateScore.ts`).
- **Store**: Zustand slices under `/src/store/` (`playerStore.ts`, `suspectStore.ts`).
- **Tests**: each screen gets `*.test.tsx` in `/tests/screens/`.

With this map Codex can scaffold routes, navigation, and state wiring without ambiguity.

