#!/usr/bin/env node
/**
 * extract-monsters.js
 *
 * Reads sw_siege_tracker.html from the project root (or a path given as
 * the first CLI argument), extracts the RAW array variable, and writes
 * frontend/src/assets/data/monsters.json.
 *
 * RAW array format:  [id, name, elem, nat, imgDataUrl]
 * Output format:     { id, name, elem, nat, img }
 *
 * Usage:
 *   node scripts/extract-monsters.js [path/to/sw_siege_tracker.html]
 */

const fs   = require('fs');
const path = require('path');

// ── Resolve paths ────────────────────────────────────────────────────────────
const projectRoot = path.resolve(__dirname, '..');
const htmlPath    = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(projectRoot, 'sw_siege_tracker.html');
const outputPath  = path.join(
  projectRoot,
  'frontend', 'src', 'assets', 'data', 'monsters.json'
);

// ── Read source file ─────────────────────────────────────────────────────────
if (!fs.existsSync(htmlPath)) {
  console.error(`ERROR: Source file not found: ${htmlPath}`);
  console.error('Pass the path as an argument: node scripts/extract-monsters.js <file>');
  process.exit(1);
}

console.log(`Reading: ${htmlPath}`);
const source = fs.readFileSync(htmlPath, 'utf8');

// ── Extract the RAW variable ──────────────────────────────────────────────────
// Matches:  const RAW = [...];   or   var RAW = [...];   or   let RAW = [...];
// The array may span many lines, so we find the opening bracket and walk to the
// matching closing bracket to handle nested arrays/strings safely.

const varMatch = source.match(/(?:const|var|let)\s+RAW\s*=\s*(\[)/);
if (!varMatch) {
  console.error('ERROR: Could not find a variable named RAW in the source file.');
  process.exit(1);
}

const startIndex = varMatch.index + varMatch[0].length - 1; // position of '['
let depth  = 0;
let inStr  = false;
let strCh  = '';
let escape = false;
let i      = startIndex;

for (; i < source.length; i++) {
  const ch = source[i];

  if (escape) { escape = false; continue; }
  if (ch === '\\' && inStr) { escape = true; continue; }

  if (!inStr && (ch === '"' || ch === "'" || ch === '`')) {
    inStr = true;
    strCh = ch;
    continue;
  }
  if (inStr && ch === strCh) { inStr = false; continue; }
  if (inStr) continue;

  if (ch === '[') { depth++; continue; }
  if (ch === ']') {
    depth--;
    if (depth === 0) break;
  }
}

if (depth !== 0) {
  console.error('ERROR: Could not find the end of the RAW array (unbalanced brackets).');
  process.exit(1);
}

const rawText = source.slice(startIndex, i + 1);

// ── Evaluate the array safely ─────────────────────────────────────────────────
let rawArray;
try {
  // Use Function constructor so we don't need eval in strict mode
  rawArray = (new Function(`return ${rawText};`))();
} catch (err) {
  console.error('ERROR: Failed to parse RAW array:', err.message);
  process.exit(1);
}

if (!Array.isArray(rawArray)) {
  console.error('ERROR: RAW is not an array.');
  process.exit(1);
}

// ── Map to Monster objects ────────────────────────────────────────────────────
// Each entry: [id, name, elem, nat, imgDataUrl]
const monsters = rawArray.map((entry) => {
  if (!Array.isArray(entry) || entry.length < 4) {
    throw new Error(`Unexpected entry format: ${JSON.stringify(entry)}`);
  }
  const [id, name, elem, nat, img] = entry;
  const monster = { id, name, elem, nat };
  // Only include img if it's a non-empty string
  if (img && typeof img === 'string' && img.trim().length > 0) {
    const raw = img.trim();
    monster.img = raw.startsWith('data:') ? raw : `data:image/webp;base64,${raw}`;
  }
  return monster;
});

// ── Validate element values ───────────────────────────────────────────────────
const validElems = new Set(['f', 'w', 'n', 'l', 'd']);
const invalid = monsters.filter(m => !validElems.has(m.elem));
if (invalid.length > 0) {
  console.warn(`WARNING: ${invalid.length} monster(s) have unexpected elem values:`);
  invalid.slice(0, 5).forEach(m =>
    console.warn(`  id=${m.id} name="${m.name}" elem="${m.elem}"`)
  );
}

// ── Write output ──────────────────────────────────────────────────────────────
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(monsters, null, 2), 'utf8');

console.log(`Done! Extracted ${monsters.length} monsters.`);
console.log(`Output: ${outputPath}`);
