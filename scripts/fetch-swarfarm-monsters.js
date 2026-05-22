#!/usr/bin/env node
/**
 * fetch-swarfarm-monsters.js
 *
 * Fetches all monsters from the SWARFARM public API,
 * compares with the local monsters.json,
 * and generates entries for the monsters-patch.json (missing ones, no image).
 *
 * Usage:
 *   node scripts/fetch-swarfarm-monsters.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const projectRoot   = path.resolve(__dirname, '..');
const monstersPath  = path.join(projectRoot, 'frontend', 'src', 'assets', 'data', 'monsters.json');
const patchPath     = path.join(projectRoot, 'frontend', 'src', 'assets', 'data', 'monsters-patch.json');

// Map SWARFARM element names → our short codes
const ELEM_MAP = {
  'Fire':    'f',
  'Water':   'w',
  'Wind':    'n',
  'Light':   'l',
  'Dark':    'd',
  'fire':    'f',
  'water':   'w',
  'wind':    'n',
  'light':   'l',
  'dark':    'd',
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 sw-siege-tracker/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function fetchAllMonsters() {
  const all = [];
  let url = 'https://swarfarm.com/api/v2/monsters/?format=json&page_size=250';
  let page = 1;

  while (url) {
    process.stdout.write(`\r  Fetching page ${page}... (${all.length} so far)`);
    const data = await fetchJson(url);
    all.push(...data.results);
    url = data.next;
    page++;
    // small delay to be polite to the API
    if (url) await new Promise(r => setTimeout(r, 300));
  }
  console.log(`\r  Fetched ${all.length} total monsters from SWARFARM.       `);
  return all;
}

async function main() {
  // ── Load local data ───────────────────────────────────────────────────────
  const localMonsters = JSON.parse(fs.readFileSync(monstersPath, 'utf8'));
  const existingPatch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));

  const localIds  = new Set(localMonsters.map(m => m.id));
  const patchIds  = new Set(existingPatch.map(m => m.id));
  const knownIds  = new Set([...localIds, ...patchIds]);

  console.log(`Local monsters.json : ${localMonsters.length} entries`);
  console.log(`Existing patch      : ${existingPatch.length} entries`);
  console.log('Fetching SWARFARM API...');

  // ── Fetch from API ────────────────────────────────────────────────────────
  const swMonsters = await fetchAllMonsters();

  // ── Filter: only obtainable, non-fusion-food, with com2us_id ─────────────
  // Keep base (natural, non-awakened) forms that are obtainable
  const candidates = swMonsters.filter(m =>
    m.com2us_id &&
    m.obtainable &&
    !m.fusion_food &&
    !m.homunculus
  );

  console.log(`Obtainable non-fusion monsters with com2us_id: ${candidates.length}`);

  // ── Find missing ──────────────────────────────────────────────────────────
  const missing = candidates.filter(m => !knownIds.has(m.com2us_id));

  console.log(`Missing from our data: ${missing.length}`);

  if (missing.length === 0) {
    console.log('Nothing to add. monsters-patch.json is already complete.');
    return;
  }

  // ── Build new patch entries ───────────────────────────────────────────────
  const newEntries = missing.map(m => ({
    id:   m.com2us_id,
    name: m.name,
    elem: ELEM_MAP[m.element] || m.element.toLowerCase()[0],
    nat:  m.natural_stars,
  }));

  // Sort by name for readability
  newEntries.sort((a, b) => a.name.localeCompare(b.name));

  // ── Merge with existing patch ─────────────────────────────────────────────
  const merged = [...existingPatch, ...newEntries];

  fs.writeFileSync(patchPath, JSON.stringify(merged, null, 2), 'utf8');

  console.log(`\nAdded ${newEntries.length} new monsters to monsters-patch.json`);
  console.log('First 20 added:');
  newEntries.slice(0, 20).forEach(m =>
    console.log(`  [${m.id}] ${m.name.padEnd(25)} elem=${m.elem}  nat=${m.nat}`)
  );

  // ── Check for Legolas / Valaska ───────────────────────────────────────────
  const targets = newEntries.filter(m =>
    /legolas|valaska|lamiella|moogwang/i.test(m.name)
  );
  if (targets.length > 0) {
    console.log('\nTargeted monsters found:');
    targets.forEach(m =>
      console.log(`  ✓ [${m.id}] ${m.name} — elem=${m.elem}, nat=${m.nat}`)
    );
  }

  // ── Summary of all added ──────────────────────────────────────────────────
  const summaryPath = path.join(projectRoot, 'scripts', 'missing-monsters.txt');
  const lines = newEntries.map(m => `${m.id}\t${m.name}\t${m.elem}\t${m.nat}`);
  fs.writeFileSync(summaryPath, ['id\tname\telem\tnat', ...lines].join('\n'), 'utf8');
  console.log(`\nFull list saved to: scripts/missing-monsters.txt`);
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
