# agents.md – Active AI Agents & Modules

> **Purpose:** Single source of truth for every AI‑driven component used in Detective: GPT assistants, local CLIs and Codex automation.\
> Each block follows the same template so Codex (ChatGPT) can parse it mechanically.

---

## GPT‑Suspect (🗣️)
**Role:** Generate the suspect’s reply during interrogation and update emotional state.

**Input (JSON):**
```jsonc
{
  "question": "string",                // Player utterance
  "conversationHistory": ["…"],        // Past Q&A turns
  "dossier": { /* victim, timeline */ },
  "evidencePresented": ["ev_knife", "ev_phone"],
  "emotionalState": {
    "tolerancia": 75,
    "paranoia": 1,
    "suggestibility": 0.55
  },
  "timeRemainingMin": 510               // in‑world minutes
}
```

**Prompt / Logic:** `src/prompts/Prompt_Suspect.txt`

**Output (JSON):**
```jsonc
{
  "replyText": "string",               // Spoken answer
  "delta": {                           // Emotional shifts
    "tolerancia": -5,
    "paranoia": 1
  },
  "pressureReaction": "angry" | "nervous" | null
}
```

**Files touched:**
- `src/logic/suspectEngine.ts`
- `src/prompts/Prompt_Suspect.txt`
- `src/screens/Interrogation.tsx`

**Notes:** Must respect current `tolerancia ≤ 0` → force confession; replies under 30 chars should be avoided.

---

## GPT‑Comisario (⚖️)
**Role:** Evaluate the player’s five answers and issue a verdict.

**Input (JSON):**
```jsonc
{
  "guiltAnswer": "string",
  "motiveAnswer": "string",
  "timelineAnswer": "string",
  "evidenceAnswer": "string",
  "contradictionAnswer": "string",
  "playerRank": "detective",
  "reputation": 68,
  "caseMeta": { "slug": "the-stained-cup" }
}
```

**Prompt:** `src/prompts/Prompt_Commander.txt`

**Output (JSON):**
```jsonc
{
  "verdict": "correct" | "incorrect",
  "score": 0,                      // 0‑100 (internal)
  "justification": "string",
  "unlockedAchievements": ["ach_perfect_case"],
  "finalQuote": "string"          // Tone adapts to playerRank
}
```

**Files touched:**
- `src/logic/commissaryEvaluator.ts`
- `src/prompts/Prompt_Commander.txt`
- `src/screens/CommissaryEvaluation.tsx`

**Notes:** Score < 30 triggers `sceneFail` reprimand screen.

---

## GPT‑Narrator (📜)
**Role:** Produce a short narrative recap after the verdict.

**Input:**
```jsonc
{
  "interrogationLog": [ /* condensed */ ],
  "verdict": "correct",
  "score": 78,
  "playerRank": "inspector"
}
```

**Prompt:** `src/prompts/Prompt_Narrator.txt`

**Output:** `{ "summary": "string" }`

**Files touched:** `src/logic/narrator.ts`, `src/screens/CaseResult.tsx`

---

## GPT‑CaseGenerator (🛠️)
**Role:** Offline tool that creates new cases based on minimal seed params.

**Input:**
```jsonc
{ "seedTopic": "break‑in", "narrativeProfile": "thriller", "difficulty": "medium" }
```

**Prompt:** `src/prompts/Prompt_GeneradorCaso.txt`

**Output:** Full case JSON v2.1 (validated against schema).

**Files touched:** `tools/generateCaseFromPrompt.ts`

**Notes:** Used by narrative designers; not exposed to players.

---

## Local QA Validator (🔍)
**Role:** CLI (`validateCase.ts`) that checks any case file against the JSON schema.

**Input:** CLI args (file paths or glob).

**Output:** Console “✓ valid” or list of Ajv errors; exit code 0/1.

**Files touched:** `tools/validateCase.ts`, `docs/schema/detective_case_fields_v2.schema.json`

---

## Codex Automation (🤖)
**Role:** ChatGPT Plus (o3) acting on dev instructions to scaffold components, refactor code, and add tests.

**Input:** Natural‑language task referencing `repo_structure.md` and `screen_flow.md`.

**Output:** Pull‑request style diff or file content to paste.

**Files touched:** any; limited by clear task scope.

**Notes:** Must follow Conventional Commits; run lint & tests locally before final output.

---

> *Keep this file updated whenever a new agent or module is introduced or its contract changes.*

