# Biblia 3.0 – Detective

## Índice

1. Visión & Principios
2. Plantilla de Caso (resumen)
3. Sistema Emocional del Sospechoso
4. Interfaz Dossier & Pistas
5. Interrogatorio & Tolerancia
6. Variedad Narrativa & Tonos
7. Sistema de Fallo y Reintentos
8. Progresión: rangos, logros, cartas
9. Evaluación del Comisario
10. Checklist QA + Validación
11. Apéndice A: JSON schema
12. Apéndice B: Naming & Convenciones

---

## 1. Visión & Principios

### 1.1 Objetivo del juego

- Simular interrogatorios realistas con un único sospechoso por caso.
- Permitir que el jugador descubra la verdad gestionando **lógica y emociones**.

### 1.2 Principios de diseño

| Principio                        | Descripción                                                                                                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Coherencia narrativa**         | Todas las acciones y reacciones deben justificar la personalidad y el pasado del sospechoso.                   |
| **Transparencia de reglas**      | Variables clave (`tolerancia`, `suggestibility`, `presión`) se exponen de forma temática sin romper inmersión. |
| **Aprendizaje basado en pistas** | Cada pista tiene un propósito claro; se evita "relleno" que frustre al jugador.                                |
| **Equilibrio emoción/lógica**    | Se recompensa tanto la deducción racional como la gestión emocional del interrogatorio.                        |
| **Rejugabilidad**                | El sistema de variedad narrativa y perfiles únicos garantiza casos distintos cada partida.                     |
| **Accesibilidad**                | Textos claros, interfaz sencilla, opciones inclusivas (modo daltónico, tipografías amigables).                 |

### 1.3 Alcance inicial

- **Un sospechoso** por caso.
- Interrogatorio en **una única sala** virtual.
- Duración objetivo por caso: **20‑30 min** de juego.

### 1.4 Flujo de alto nivel (MVP)

```
Jugador lee dossier → Interrogatorio (turnos) → Evaluación Comisario → Cierre & Logros
```

### 1.5 Decisiones y TODO (actualizado)

**Debug Toggle**

- Botón visible en esquina superior durante builds de desarrollo.
- Muestra valores numéricos internos.

**Progresión por Fases & Rangos**

- El juego se divide en **fases**. Cada fase contiene un conjunto de casos principales + secundarios.
- Al completar **todos los casos de la fase**, el jugador asciende de rango.

| Fase | Rango             | Desbloqueo principal                                    |
| ---- | ----------------- | ------------------------------------------------------- |
| 1    | Agente            | Acceso a la sala de interrogatorios básica              |
| 2    | Detective         | Acceso a pruebas de laboratorio y misiones secundarias  |
| 3    | Inspector         | Nuevos tipos de contradicción y tolerancia dinámica     |
| 4    | Subcomisario      | Casos de alta complejidad + sistema de presión avanzada |
| —    | Comisario (final) | Desbloquea el final especial y créditos                 |

**Tabla de puntuación pública**

- Cada caso otorga una calificación (Perfecto / Bien / Aceptable / Fallido).
- Esa calificación se traduce en **puntos** guardados en `playerProfile.score`.
- Habrá una tabla global (online o local compartible) para comparación.

**Ramas secundarias**

- Número de misiones secundarias por fase aún **por decidir**.
- Se definirá cuando fijemos cuántos casos principales necesita cada fase.

**Persistencia**

- `playerProfile.json` guardará: `currentPhase`, `currentRank`, `casesSolved`, `score`, `cardsUnlocked` (placeholder).

**TODO**

- Prototipo de indicadores temáticos.
- Especificar número máximo de casos por fase (principales + secundarios).
- Diseñar componente UI `DebugToggle`.

### TODO

- Prototipo UI del botón Debug (posible esquina inferior‑derecha).
- Diseñar diagrama de flujo para la selección dinámica de casos.
- Definir curva de XP por caso → rango.
- Establecer esquema de `playerProfile.json` inicial.

### TODO inmediato

1. Definir *flag* `debugHUD` en `gameSettings` para alternar vista numérica ↔ temática.
2. Diseñar maqueta de indicadores temáticos (colores, textos, iconos).
3. Especificar flujo de “Modo Historia” y cómo se selecciona/re‑intenta un caso.
4. Diseñar esquema de rangos: nombre, requisitos, beneficios.
5. Decidir si los valores numéricos afectan IA aunque no se muestren.

## 2‑12. [PLACEHOLDER]

*(Secciones vacías que completaremos una a una tras validar el punto 1).*

---

## 2. Plantilla de Caso (resumen)

> Esta sección resume la **versión 2.1** del esquema `detective_case_fields_v2`. Mostramos qué partes ve el jugador, qué partes usa GPT en segundo plano y qué sirve solo para QA.

### 2.1  Visibilidad pública vs interna

| Bloque       | Visible al jugador | Descripción breve                                                                        |
| ------------ | ------------------ | ---------------------------------------------------------------------------------------- |
| `dossier`    | Sí (UI inicial)    | Información básica del caso: víctima, lugar, fecha, contexto.                            |
| `suspect`    | Parcial            | Nombre, foto, perfil público; stats emocionales **NO** se muestran (solo en modo Debug). |
| `timeline`   | Resumido           | Orden de eventos clave; detalles completos solo en modo Debug.                           |
| `evidence`   | Sí                 | Lista de pruebas que el jugador puede presentar.                                         |
| `truth`      | No                 | Versión real de los hechos, usada por evaluadores.                                       |
| `keyPhrases` | No                 | Frases que disparan contradicciones; ocultas al jugador.                                 |
| `falseLead`  | No                 | Anzuelos narrativos para confundir al jugador.                                           |
| `meta`       | No                 | Datos de QA (versión, autor, fecha, `qaPassed`).                                         |

### 2.2  Campos obligatorios (v2.1)

```json
{
  "id": "string | unique",
  "version": "2.1",
  "dossier": { /* ... */ },
  "suspect": {
    "name": "string",
    "suggestibility": 0.0,
    "tolerancia": 0,
    "paranoia": 0,
    "foto": "url"
  },
  "timeline": [ /* eventos */ ],
  "evidence": [ /* pruebas */ ],
  "keyPhrases": [ "..." ],
  "falseLead": [ "..." ],
  "truth": { /* confesión final */ },
  "meta": { "qaPassed": false }
}
```

### 2.3  Campos internos (GPT‑only)

- `contradictionMatrix`: mapeo evento ↔ keyPhrase ↔ evidencia.
- `emotionScripts`: tabla de reacciones según `suggestibility` y `tolerancia`.
- `judgementWeights`: pesos para el Comisario (guilt, motive, timeline…).

### 2.4  QA & Validación

- JSON debe pasar **schema v2.1**.
- `qaPassed` se marca **true** tras ejecutar `validateCase.ts`.
- Cada keyPhrase debe existir exactamente 1 vez en `timeline` o `evidence`.

### 2.5 Decisiones y TODO (cerrado)

| Pregunta                             | Decisión | Notas                                                                           |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------- |
| ¿Campo `difficulty` explícito?       | **No**   | Derivado de rango/fase y variables internas.                                    |
| ¿Campo `locale`?                     | **Sí**   | `meta.locale` (ISO‑639‑1).                                                      |
| ¿Tags de género?                     | **No**   | Género narrativo se controla con `meta.narrativeProfile`.                       |
| `requiredRank` en `meta`             | **Sí**   | Filtra casos por rango: `agente`, `detective`, `inspector`, `subcomisario`.     |
| Eventos del timeline ocultos         | **Sí**   | Añadir `hidden:boolean` o `revealCondition:string` en cada `timeline.events[]`. |
| Guardar `narrativeProfile` en `meta` | **Sí**   | Controla tono para prompts; no se muestra al jugador.                           |

---

---

## 3. Sistema Emocional del Sospechoso

(Resumen basado en `SistemaEmocionalSospechoso.txt`)

### 3.1 Variables principales

| Variable         | Rango   | Paso mínimo | Descripción                                                                              | Visible al jugador                    |
| ---------------- | ------- | ----------- | ---------------------------------------------------------------------------------------- | ------------------------------------- |
| `tolerancia`     | 0 – 100 | 1           | Aguante emocional antes de colapsar. Al llegar ≤ 0 → confesión forzada o cierre fallido. | Indicador temático / Debug numérico   |
| `paranoia`       | 0 – 5   | 1           | Nivel de desconfianza; modifica el peso de preguntas directas.                           | Solo frases ("Te esquiva la mirada…") |
| `suggestibility` | 0 – 1   | 0.05        | Facilidad para aceptar contradicciones lógicas.                                          | No (solo Debug)                       |

### 3.2 Eventos que modifican las variables

| Evento (acción del jugador)                | Δ tolerancia | Δ paranoia | Notas                                                         |
| ------------------------------------------ | ------------ | ---------- | ------------------------------------------------------------- |
| Presentar evidencia correcta con keyPhrase |  –10         |  –1        | Si `suggestibility > 0.6` → impacto extra –5 tolerancia.      |
| Presentar evidencia incorrecta             |  –5          |  +1        | Si sospechoso en "Borde" (<25 tol.) → penaliza doble.         |
| Descubrir contradicción mayor              |  –20         |  –2        | Puede detonar `pressureReaction` especial (colapso nervioso). |
| Repetir prueba irrelevante                 |  –0          |  +1        | Añadido en parche v2.1 (dup check).                           |

### 3.3 `pressureReactions`

- Tabla interna `pressureReactions[]` con pares **umbral→respuesta**.
- Estructura ejemplo:

```json
{
  "threshold": 40,
  "reactionId": "nervous_laugh",
  "playerVisible": "El sospechoso ríe con nerviosismo y mira al suelo."
}
```

- Se evalúa tras cada acción que cambie tolerancia o paranoia.

### 3.4 Visibilidad al jugador

| Momento                   | UI estándar                            | Modo Debug                           |
| ------------------------- | -------------------------------------- | ------------------------------------ |
| Inicio del interrogatorio | Solo barra "confianza" + tono (color). | Muestra valores numéricos.           |
| Tras cada reacción        | Reproduce texto `playerVisible`.       | Además log interno en consola React. |
| Fin del turno             | No se muestran cifras.                 | Overlay con tabla de variables.      |

### 3.5 Fórmulas base

```ts
// Cambio de tolerancia
newTol = clamp(tol - deltaTol, 0, 100);

// Penalización repetición prueba
if (isDuplicate && suspect.suggestibility < 0.3) {
  newTol -= 5;
}
```

*Las constantes (****\`\`****\*\* para afinado centralizado.*

### 3.6 Decisiones finales

| Tema                    | Decisión                                                                                                  | Notas                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Rango inicial           | Variable por caso (`suspect.initialStates`).                                                              | —                                          |
| Tiempo & cooldown       | 24 h ficticias; cada turno consume 30 min.Máx. **3 pausas empáticas** por caso (cada una +5 tol, −1 par). | `suspect.pauseCount` controla el uso.      |
| Tiempo agotado          | Al llegar a 0 h → se fuerza la **resolución del caso** ante el Comisario.                                 | —                                          |
| Suggestibility dinámica | Cada error grave (evidencia repetida) ↓ `suggestibility` 0.05                                             | Refuerza riesgo de presión mal gestionada. |
| QA de límites           | Tests aseguran `tolerancia` ∈ [0, 100] y nunca < −20.Paranoia ≥ 0.                                        | Scripts QA.                                |
| i18n reacciones         | `pressureReactions` almacenará `{locale:{code,text}}`.                                                    | Facilita traducción.                       |
|                         |                                                                                                           |                                            |

###

---

## 4. Interfaz Dossier & Pistas

(Basado en `DossierExplicacion.txt`)

### 4.1 Estructura general visibilidad

| Bloque             | Visible                | Descripción                                                                                |
| ------------------ | ---------------------- | ------------------------------------------------------------------------------------------ |
| `victimProfile`    | Sí                     | Nombre, edad, causa de muerte, foto (blur si 18+).                                         |
| `contextClues`     | Sí                     | Resumen textual del escenario inicial (lugar, fecha, hallazgos preliminares).              |
| `baselineTimeline` | Sí                     | Línea temporal de hechos **confirmados** antes del interrogatorio.                         |
| `evidenceList`     | Sí (pestaña Evidencia) | Objetos/documents que el jugador puede presentar. Cada item→ modal con foto + descripción. |
| `suspectNotes`     | Solo Debug             | Inconsistencias conocidas para QA.                                                         |
| `hiddenEvidence`   | Interno                | Ítems «locked» hasta que se revelen mediante `timeline.events[].hidden=false`.             |

### 4.2 Tipos y slots de evidencia

| Tipo          | Extensión                  | Slot máximo por caso | Presentable al sospechoso       |
| ------------- | -------------------------- | -------------------- | ------------------------------- |
| Documento     | `.pdf`, `.txt`, screenshot | 8                    | Sí                              |
| Imagen        | `.jpg`, `.png`             | 6                    | Sí                              |
| Audio         | `.mp3` (≤ 30 s)            | 4                    | No (solo playback para jugador) |
| Objeto físico | `meta{ photo+desc }`       | 4                    | Sí                              |

➡ `evidenceList[]` contiene: `id`, `type`, `title`, `desc`, `file`, `relevance(0‒2)`, `presentable:boolean`.

### 4.3 Acciones del jugador con el dossier

1. **Inspeccionar** → Abre modal (foto + texto largo).
2. **Presentar** → Envía `presentEvidence(id)` a la lógica del interrogatorio.
3. **Combinar (futuro)** → `combineEvidence(idA,idB)` crea “evidencia compuesta”. *NO MVP*.

### 4.4 Lógica UI

- Barra lateral izquierda: pestañas *Resumen*, *Línea Tiempo*, *Evidencia*.
- Card compacto por evidencia (ribbon de color según `relevance`: 0 gris, 1 amarillo, 2 rojo).
- Botón **Debug** muestra `suspectNotes` + ids ocultos.

### 4.5 Reglas QA

- IDs únicos (regex `^e[0-9]{3}$`).
- Máx. 18 evidencias → validador rechaza caso con más.
- Cada evidencia `relevance>0` debe aparecer al menos una vez en `pressureReactions` o `timeline`.

### 4.6 Decisiones (actualizado)

| Pregunta                                        | Decisión      | Notas                                                                        |
| ----------------------------------------------- | ------------- | ---------------------------------------------------------------------------- |
| ¿Permitir anotaciones Markdown sobre evidencia? | **Sí**        | Campo `notesMarkdown` por jugador (persistente local).                       |
| ¿Contador de evidencia sin presentar?           | **No**        | —                                                                            |
| ¿`combineEvidence` ahora o expansión?           | **Expansión** | Funcionalidad reservada para update futuro.                                  |
| ¿`baselineTimeline` máx. 6 hitos visibles?      | **Sí**        | Máximo 6 eventos confirmados en el dossier inicial; los demás `hidden:true`. |
| ¿Flag `isCore` para evidencia clave?            | **Sí**        | Campo booleano; obligatorio presentar para final perfecto.                   |

**Nota sobre \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\***\`\`\
El límite sugerido (6 hitos) busca que la UI no se sature en la vista inicial. Pueden existir más eventos, mostrados en un dropdown o pestaña "Eventos detallados".

- Opción A: mostrar solo 6 confirmados y desplazar el resto a “Detalles”.
- Opción B: sin límite, con scroll interno.\
  Necesitamos decidir cuál prioriza mejor la claridad sin ocultar datos importantes.

---

## 5. Interrogatorio & Tolerancia

### 5.1 Flujo de turno

1. **Pregunta del jugador** (`askQuestion`)
2. **Evaluación interna**
   - Analiza `keyPhrases` y evidencia citada.
   - Ajusta variables emocionales según reglas de §3.
3. **Respuesta del sospechoso** (`suspectReply`)
   - Condicionada por `tolerancia`, `paranoia`, `suggestibility` y `pressureReactions`.
4. **Actualización de estado**
   - Se registra en `interrogationLog[]` (para replay y QA).
   - Se descuenta tiempo: −30 min / turno.
5. **Chequeo de fin de bucle**
   - Tiempo ≤ 0 h ➜ resolución forzada.
   - Tolerancia ≤ 0 ➜ colapso ➜ confesión o cierre fallido.
   - El jugador pulsa **Pausa empática** ➜ §3 rules.

### 5.2 Tabla de modificadores base

| Acción del jugador               | Requisito                       | Δ Tolerancia | Δ Paranoia | Δ Suggestibility |
| -------------------------------- | ------------------------------- | ------------ | ---------- | ---------------- |
| Presentar evidencia **correcta** | Contiene `keyPhrases` alineadas | −15          | +2         | −0.02            |
| Presentar evidencia irrelevante  | No contiene `keyPhrases`        | −10          | +4         | −0.05            |
| Pregunta abierta coherente       | Incluye tema del `timeline`     | −8           | +1         | 0                |
| Pregunta repetida                | Ya en `interrogationLog`        | −12          | +3         | −0.05            |
| Pausa empática                   | Usa 30 min                      | +5           | −1         | 0                |

> **Nota:** Valores editables por caso; si no se define, se aplican estos defaults.

### 5.3 `pressureReactions` (resumen)

- **Defensive**: dispara si paranoia ≥ 7 ⇒ contesta evasivo, no baja tolerancia.
- **Emotional Burst**: tolerancia ≤ 20 y pregunta incisiva ⇒ revela información extra (evento hidden) pero −5 tolerancia residual.
- **Confessional Drift**: suggestibility ≥ 0.7 y evidencia correcta ⇒ +10 tolerancia buffer, desbloquea `isCore` clue.

### 5.4 Puntos de salida del interrogatorio

| Condición                        | Pantalla siguiente                                    |
| -------------------------------- | ----------------------------------------------------- |
| `tolerancia ≤ 0`                 | **Confesión forzada / cierre fallido** (según flags). |
| `timeLeft ≤ 0`                   | **Resolución con Comisario**.                         |
| Jugador pulsa **Resolver ahora** | Salta directo a Comisario (costo: +10 paranoia).      |

### 5.5 Validación QA

- Asegurar que cada turno añade entrada a `interrogationLog[]`.
- Ninguna variable sale de rango (§3 guardrails).
- Event ID citado en evidencia debe existir en dossier.

### 5.6 Decisiones (parciales)

| Pregunta                                          | Decisión                | Notas                                                                  |
| ------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| Coste emocional al pulsar “Resolver ahora”        | **Sin coste emocional** | Solo consume el tiempo restante y salta a fase Comisario.              |
| `interrogationLog` completo guardado para replays | **Solo en modo Debug**  | Guardado local; no se persiste en perfil de producción.                |
| Pista contextual tras 3 turnos sin progreso       | **No**                  | No se ofrecerán pistas automáticas; el jugador debe deducir sin ayuda. |

---

## 6. Variedad Narrativa & Tonos

(Basado en `Sistema de Variedad Narrativa entre Casos.txt`)

### 6.1 Perfiles narrativos disponibles

| Code           | Nombre visible | Descripción / atmósfera                        | Uso sugerido                                         |
| -------------- | -------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `thriller`     | Thriller       | Ritmo alto, giros bruscos, peligro inminente.  | Casos principales de rangos medios.                  |
| `noir`         | Noir clásico   | Oscuro, cínico, callejón lluvioso, moral gris. | Casos donde el sospechoso no es claramente culpable. |
| `procedural`   | Policial       | Realismo forense, foco en evidencia y método.  | Tutoriales, primeros rangos.                         |
| `psychologic`  | Psicológico    | Juego mental, manipulación, pasado traumático. | Rangos altos; suspect alta paranoia.                 |
| `supernatural` | Sobrenatural   | Elementos inexplicables, tensión mística.      | Casos especiales opcionales.                         |
| `comedy`       | Comedia negra  | Humor ácido, situaciones absurdas.             | Misiones secundarias ligeras.                        |

> **Nota**: Para añadir un nuevo perfil, actualizar esta tabla y el enumerado permitido en el esquema JSON (`meta.narrativeProfile`).

### 6.2 Impacto en otros sistemas

- **Prompts GPT**: se inyecta `<tone={{narrativeProfile}}>` para guiar estilo de respuesta.
- **UI Temática**: paleta de colores y música ambiente (futuro) pueden cambiar según perfil.
- **Sistema Emocional**: ciertos perfiles aplican modificadores (ej.: `psychologic` inicia paranoia +1).

### 6.3 QA & validación

- `meta.narrativeProfile` **obligatorio** en cada caso.
- Valor debe pertenecer a la lista de códigos.
- Tests automáticos revisan coherencia con variables iniciales (ej.: `supernatural` no debe tener victimProfile demasiado “mundano”).

### 6.4 Decisiones (cerrado)

| Pregunta                                            | Decisión                | Notas                                                                        |
| --------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| ¿Uno o dos perfiles por caso?                       | **Solo un perfil**      | `meta.narrativeProfile` será único.                                          |
| ¿Paleta de colores por perfil?                      | **No**                  | La UI mantiene tema neutro; evitamos "arcade psicodélico".                   |
| Perfil `supernatural` y flag `allowUnreliableClues` | \*\*Se elimina \*\*\`\` | Nos quedamos con thriller, noir, forensic, comedy, political, psychological. |

---

## 7. Sistema de Fallo y Reintentos

(Resumen basado en `Propuesta Detallada del Sistema de Fallo del Jugador.txt`)

### 7.1 Condiciones de fallo

| # | Trigger                                           | Descripción                                                | Consecuencia inmediata                                               |
| - | ------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| 1 | **Agotar tiempo**                                 | Reloj llega a 0 h sin resolución                           | Paso forzado a fase Comisario → evaluación automática con nota baja. |
| 2 | **Colapso emocional**                             | `tolerancia ≤ −20` y no hay confesión                      | Cierre abrupto → fallo narrativo.                                    |
| 3 | **Hipótesis incorrecta**                          | Jugador acusa y Comisario determina *veredicto: incorrect* | Caso marcado como fallido.                                           |
| 4 | **Evidencia clave no presentada** (`isCore=true`) | Jugador cierra caso sin mostrar X piezas                   | Evaluación parcial (máx. ★★).                                        |

### 7.2 Reglas de reintento

| Aspecto                            | Valor por defecto                                 | Notas                                                        |
| ---------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| Nº máximo de reintentos por caso   | **∞** (sin límite)                                | Repetir afecta métricas (ver abajo).                         |
| Cool‑down antes de reintentar      | **Inmediato**                                     | En futuro se podría forzar espera (expansión).               |
| Qué conserva el jugador            | Dossier completo, notas, evidencias desbloqueadas | Mantiene progreso narrativo.                                 |
| ¿Reseteo de variables emocionales? | **Sí**                                            | `tolerancia` y `paranoia` vuelven al valor inicial del caso. |

### 7.3 Impacto en puntuación y progresión

| Métrica                        | Primer intento               | Reintento 2‑∞           |
| ------------------------------ | ---------------------------- | ----------------------- |
| `careerPoints`                 | 100 %                        | 70 % del total (−30 %). |
| XP de rango                    | 100 %                        | 70 %.                   |
| Logros                         | Solo si acierta a la primera | No concede logros.      |
| Cartas desbloqueables (futuro) | Sí                           | No                      |

### 7.4 QA & Guardrails

- Test unitario confirma que **nunca** se pueda aprobar un caso con `isCore` faltante.
- Validar que `careerPoints ≥ 0` y no supera valor máximo del caso.
- Un caso no puede quedar “sin estado”: o `passed`, o `failed`, o `partial`.

### 7.5 Decisiones finales

| Pregunta                            | Decisión                     | Notas                                                                   |
| ----------------------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| Penalty stacking (XP por reintento) | **Sí**                       | Primer reintento 70 % XP → segundo 60 % → tercero 50 %.                 |
| Contador de fallos visible en UI    | **Sí**                       | `caseFailures` se muestra en Historial y resumen de caso.               |
| Epílogo al colapso emocional        | **Sí**                       | Pantalla especial: Comisario enfadado regaña al jugador (`sceneFail`).  |
| Modo Historia / casos enlazados     | **Sin diferencias visibles** | Se puntúan igual; el jugador deduce conexiones narrativas por sí mismo. |

---

## 8. Progresión de Rango, Logros & Cartas

### 8.1 Rangos oficiales

| Rango            | Código         | Requisito para ascender                  | Desbloqueos                                     |
| ---------------- | -------------- | ---------------------------------------- | ----------------------------------------------- |
| **Agente**       | `agent`        | Completar Fase 1 (3 casos)               | Acceso a Dossier completo + pausa empática.     |
| **Detective**    | `detective`    | Fase 2 resuelta (4 casos, ≥ 1 perfecto)  | Casos con perfil *noir*, 2ª pausa empática.     |
| **Inspector**    | `inspector`    | Fase 3 resuelta (5 casos, ≥ 2 perfectos) | Casos *political*, combo de evidencia (futuro). |
| **Subcomisario** | `subcomisario` | Fase 4 resuelta (5 casos, ≥ 3 perfectos) | Acceso a casos finales del arco principal.      |
| **Comisario**    | `comisario`    | Completar caso final (rango máximo)      | Desenlace final + créditos.                     |

### 8.2 XP y puntos de carrera

- Cada caso otorga **100 XP base** si se resuelve perfecto.
- Restas de XP:
  - Final correcto pero no perfecto → −20 XP.
  - Reintento (1º, 2º, 3º) → penalty stacking (70 % / 60 % / 50 %).
- Al ascender, XP se reinicia a 0 para la nueva fase; se guarda total histórico en `careerPoints`.

### 8.3 Logros globales

| ID                  | Condición                         | Recompensa                      |
| ------------------- | --------------------------------- | ------------------------------- |
| `perfect_streak_3`  | 3 casos perfectos seguidos        | +50 XP bonus, icono distintivo. |
| `speed_runner`      | Caso resuelto con > 6 h restantes | +20 XP, carta placeholder.      |
| `cold_case_cracker` | Resolver un caso tras 3 fallos    | Trofeo visual, +10 reputación.  |

> **Nota**: Se añaden al array `profile.achievements[]`. Campo `cardsUnlocked[]` reservado, sin lógica activa aún.

### 8.4 Persistencia y guardado

```json
{
  "profile": {
    "currentRank": "detective",
    "xp": 40,
    "careerPoints": 340,
    "caseFailures": 1,
    "achievements": ["perfect_streak_3"],
    "cardsUnlocked": []
  }
}
```

- Guardado en `localStorage` al finalizar cada caso. - Migraciones futuras: versiónado `profile.version`.

### 8.5 Preguntas abiertas / TODO

| Pregunta                                                         | Estado    | Comentario                                  |
| ---------------------------------------------------------------- | --------- | ------------------------------------------- |
| ¿Añadimos reputación separada de XP?                             | Pendiente | Podría influir en reacciones del Comisario. |
| ¿Cartas se otorgan solo por logros o también por hitos de rango? | Pendiente | Decidir antes de activar fase 2 de cartas.  |
| Límite de logros visibles en UI                                  | Pendiente | Evitar saturación; quizá top 10 recientes.  |

### 8.6 Decisiones finales

| Pregunta                                                         | Decisión             | Notas                                                                           |
| ---------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| ¿Añadimos reputación separada de XP?                             | **Sí**               | Campo `reputation` (0‑100) en `playerProfile`; afecta reacciones del Comisario. |
| ¿Cartas se otorgan solo por logros o también por hitos de rango? | **Pendiente**        | Se definirá en la fase 2 de sistema de cartas.                                  |
| Límite de logros visibles en UI                                  | **Top 10 recientes** | Paginación o botón "Ver todos" para evitar saturación.                          |

---

## 9. Evaluación del Comisario

(Basado en `Judge.md` y `InformeDecisionesFinal.txt`)

### 9.1 Input requerido

```json
{
  "guiltAnswer": "string",
  "motiveAnswer": "string",
  "timelineAnswer": "string",
  "evidenceAnswer": "string",
  "contradictionAnswer": "string"
}
```

En modo GPT, estos campos los completa el jugador en un formulario UI; en modo Local se simula con valores de ejemplo para test.

### 9.2 Salida esperada (Comisario → UI)

```json
{
  "verdict": "correct" | "partial" | "wrong",
  "score": 0‑100,
  "justification": "string",
  "unlockedAchievements": ["string"],
  "finalQuote": "string"
}
```

- \`\` determina si el caso se marca perfecto, resuelto o fallido.
- \`\` se mapea a estrellas (★ 1‑5) y XP.

### 9.3 Fórmula de puntuación (simplificada)

| Criterio                 | Peso | Descripción                                 |
| ------------------------ | ---- | ------------------------------------------- |
| Guilt correct            | +40  | El sospechoso identificado es correcto.     |
| Motive correct           | +20  | Motivo coincide.                            |
| Timeline exacto          | +15  | Orden completo y sin huecos.                |
| Evidencia clave citada   | +15  | Al menos una evidencia `isCore` presentada. |
| Contradiction uso óptimo | +10  | Cita la contradicción más fuerte.           |

Penalizaciones: −10 por cada reintento, −5 si `tolerancia` llegó a 0.

### 9.4 Reacciones del Comisario (ejemplos)

| Score  | Tono     | Frase ejemplo                                                                           |
| ------ | -------- | --------------------------------------------------------------------------------------- |
| 90‑100 | Elogio   | "Excelente trabajo, Inspector. Has desenmascarado al culpable sin dejar cabos sueltos." |
| 70‑89  | Positivo | "Caso cerrado, pero aún veo margen de mejora."                                          |
| 50‑69  | Neutro   | "Aceptaremos tu informe, aunque no me convence del todo."                               |
| <50    | Crítico  | "Has pasado por alto puntos esenciales. Vuelve a estudiarlo."                           |

### 9.5 UI de cierre

1. Animación breve (sellado de informe).
2. Pantalla de puntuación con barras y estrellas.
3. Botón "Continuar" (siguiente caso) o "Reintentar" (si quedan intentos).
4. Mostrar logros y cartas desbloqueadas.

### 9.6 QA & tests automáticos

- Validar que `verdict` corresponde a score (≥90 ⇒ correct, 60‑89 ⇒ partial, <60 ⇒ wrong).
- JSON output debe incluir todos los campos, aunque vacíos.
- Si `unlockedAchievements.length > 0`, debe existir traducción en todos los locales.

### 9.7 Decisiones finales

| Pregunta                                  | Decisión          | Notas                                                                                |
| ----------------------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| ¿Mostrar score numérico o estrella A‑S‑C? | **No se muestra** | El score se usa internamente; la UI solo muestra veredicto y reacción del Comisario. |
| ¿`finalQuote` cambia según rango actual?  | **Sí**            | El prompt del Comisario adapta tono y respeto al rango del jugador.                  |
| ¿Escena especial si score < 30?           | **Sí**            | Se dispara pantalla "Fracaso grave" con scolding y pérdida extra de reputación.      |

---

## 10. Checklist QA + Validación

> Esta lista se ejecuta en cada *pull request* y antes de publicar un nuevo caso.

### 10.1 Casos (`/data/casos/*.json`)

-

### 10.2 Lógica / Código

-

### 10.3 UI / UX

-

### 10.4 Integración GPT

-

### 10.5 Publicación

-

---

## Appendix A – `detective_case_fields_v2.schema.json`

> *Machine‑readable JSON Schema used by **`validateCase.ts`*

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://detective-game.dev/schemas/case_v2.1.json",
  "title": "Detective Case v2.1",
  "type": "object",
  "required": ["meta", "dossier", "suspect", "timeline", "truth"],
  "properties": {
    "meta": {
      "type": "object",
      "required": ["id", "locale", "narrativeProfile", "requiredRank"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-z0-9\-]+$" },
        "version": { "type": "string", "const": "2.1" },
        "locale": { "type": "string", "pattern": "^[a-z]{2}$" },
        "narrativeProfile": {
          "type": "string",
          "enum": ["thriller", "noir", "forensic", "comedy", "political", "psychological"]
        },
        "requiredRank": {
          "type": "string",
          "enum": ["agent", "detective", "inspector", "subcommissioner", "commissioner"]
        },
        "qaPassed": { "type": "boolean" }
      }
    },
    "dossier": {
      "type": "object",
      "required": ["victimProfile", "contextClues", "baselineTimeline", "evidenceList"],
      "properties": {
        "baselineTimeline": {
          "type": "array",
          "maxItems": 6,
          "items": { "$ref": "#/defs/timelineEvent" }
        },
        "evidenceList": {
          "type": "array",
          "items": { "$ref": "#/defs/evidenceItem" }
        }
      }
    },
    "suspect": {
      "type": "object",
      "required": ["name", "initialStates", "pressureReactions"],
      "properties": {
        "initialStates": {
          "type": "object",
          "properties": {
            "tolerance": { "type": "integer", "minimum": 0, "maximum": 100 },
            "paranoia": { "type": "integer", "minimum": 0, "maximum": 2 },
            "suggestibility": { "type": "number", "minimum": 0, "maximum": 1 }
          }
        }
      }
    },
    "timeline": {
      "type": "object",
      "required": ["events"],
      "properties": {
        "events": {
          "type": "array",
          "items": { "$ref": "#/defs/timelineEvent" }
        }
      }
    },
    "truth": { "type": "string", "minLength": 40 }
  },
  "defs": {
    "timelineEvent": {
      "type": "object",
      "required": ["id", "timestamp", "description"],
      "properties": {
        "id": { "type": "string", "pattern": "^tl_[A-Za-z0-9]{4,}$" },
        "hidden": { "type": "boolean", "default": false },
        "description": { "type": "string" },
        "timestamp": { "type": "string" }
      }
    },
    "evidenceItem": {
      "type": "object",
      "required": ["id", "type", "label", "keyPhrases"],
      "properties": {
        "id": { "type": "string", "pattern": "^ev_[A-Za-z0-9]{4,}$" },
        "type": { "type": "string", "enum": ["document", "image", "audio", "video", "object"] },
        "isCore": { "type": "boolean", "default": false },
        "label": { "type": "string" },
        "keyPhrases": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

> **Example minimal case** (excerpt)

```json5
{
  "meta": { "id": "stained-cup", "locale": "en", "narrativeProfile": "thriller", "requiredRank": "agent" },
  "dossier": {
    "victimProfile": { "name": "John Doe" },
    "contextClues": "A bloody cup was found…",
    "baselineTimeline": [],
    "evidenceList": []
  },
  "suspect": {
    "name": "Alex Smith",
    "initialStates": { "tolerance": 80, "paranoia": 1, "suggestibility": 0.5 },
    "pressureReactions": []
  },
  "timeline": { "events": [] },
  "truth": "Alex hit John…"
}
```

Run validation:

```bash
npm run validate:case data/cases/the-stained-cup.json
```

---

## Appendix B – Naming & Conventions

### Folder structure

```
src/
  components/     # React components (PascalCase)
  screens/        # High‑level views (PascalCase)
  logic/          # Pure TS modules (camelCase)
  utils/          # Helpers (camelCase)
  store/          # Zustand slices
  prompts/        # .txt prompt templates

data/cases/       # kebab‑case JSON files
public/evidence/  # assets
```

### File naming

| Context    | Style             | Example                  |
| ---------- | ----------------- | ------------------------ |
| Component  | PascalCase        | `CaseScreen.tsx`         |
| Logic/Util | camelCase         | `calculateScore.ts`      |
| JSON data  | kebab‑case        | `the-stained-cup.json`   |
| Tests      | suffix `.test.ts` | `calculateScore.test.ts` |

### ID prefixes

| Entity         | Prefix | Regex                   |
| -------------- | ------ | ----------------------- |
| Evidence       | `ev_`  | `^ev_[A-Za-z0-9]{4,}$`  |
| Timeline event | `tl_`  | `^tl_[A-Za-z0-9]{4,}$`  |
| Achievement    | `ach_` | `^ach_[A-Za-z0-9]{4,}$` |

### Code style

- **ESLint**: Airbnb + Prettier (single quotes, semi).
- **Commits**: Conventional Commits in English (`feat:`, `fix:`, `docs:`).
- **Imports**: absolute from `src/`.

### Git branches

- `main` → stable.
- `dev` → integration.
- feature branches: `feat/<short-topic>`.

### Testing

- Jest + React Testing Librar
