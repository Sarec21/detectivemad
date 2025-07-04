#!/usr/bin/env node
/* eslint-disable no-console */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

/**
 * AJV configurado para:
 *  • mostrar todos los errores (allErrors)
 *  • permitir tipos unión (allowUnionTypes)
 *  • NO validar el propio esquema (validateSchema: false)
 *    → así evitamos depender del meta-schema draft-2020-12.
 */
const ajv = new Ajv({
  allErrors: true,
  allowUnionTypes: true,
  validateSchema: false
});

// ---------- Carga del esquema v2.1 ----------
const schemaPath = path.resolve(
  process.cwd(),
  'docs',
  'schema',
  'detective_case_schema_v2.1.json'
);
const schemaJson = JSON.parse(readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schemaJson);

// ---------- CLI ----------
const fileArg = process.argv[2];
if (!fileArg) {
  console.error('❌  Debes indicar la ruta de un caso JSON');
  console.error('Uso: pnpm validate:case docs/cases/mi_caso.json');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), fileArg);
let caseJson;

try {
  caseJson = JSON.parse(readFileSync(filePath, 'utf8'));
} catch (err) {
  console.error(`💥  No se pudo leer o parsear ${fileArg}:`, err);
  process.exit(1);
}

const ok = validate(caseJson);

if (ok) {
  console.log(`✅  Caso válido: ${fileArg}`);
  process.exit(0);
}

console.error(`❌  Caso inválido (${validate.errors.length} errores):`);
validate.errors.forEach((e) =>
  console.error(`  • ${e.instancePath || '(raíz)'} ${e.message}`)
);
process.exit(2);
