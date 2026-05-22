#!/usr/bin/env node
/**
 * fetch-swarfarm-images.js
 *
 * Fetches image_filename + awaken_level for all monsters in our patch/base
 * that don't already have a local image (img field).
 *
 * Generates:
 *   frontend/src/assets/data/monster-images.json  — { com2us_id: imageUrl }
 *   frontend/src/assets/data/awaken-ids.json       — [com2us_id, ...]  (awakened forms)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const CDN = 'https://swarfarm.com/static/herders/images/monsters/';
const projectRoot  = path.resolve(__dirname, '..');
const monstersPath = path.join(projectRoot, 'frontend/src/assets/data/monsters.json');
const patchPath    = path.join(projectRoot, 'frontend/src/assets/data/monsters-patch.json');
const outImages    = path.join(projectRoot, 'frontend/src/assets/data/monster-images.json');
const outAwaken    = path.join(projectRoot, 'frontend/src/assets/data/awaken-ids.json');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'sw-app/1.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

async function fetchPage(url, results = []) {
  const data = await fetchJson(url);
  results.push(...data.results);
  if (data.next) {
    await new Promise(r => setTimeout(r, 250));
    return fetchPage(data.next, results);
  }
  return results;
}

async function main() {
  const base  = JSON.parse(fs.readFileSync(monstersPath, 'utf8'));
  const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));

  // Monsters that already have a local base64 image
  const hasImage = new Set(base.filter(m => m.img).map(m => m.id));

  // All com2us_ids we care about
  const allIds = new Set([...base, ...patch].map(m => m.id));
  const needImageSet = new Set([...allIds].filter(id => !hasImage.has(id)));
  const needImage = needImageSet;

  console.log(`Total monsters: ${allIds.size}`);
  console.log(`Have local image: ${hasImage.size}`);
  console.log(`Need CDN image: ${needImage.size}`);
  console.log('Fetching all SWARFARM monster data (this takes ~2 min)...');

  const all = await fetchPage('https://swarfarm.com/api/v2/monsters/?format=json&page_size=250');
  console.log(`Fetched ${all.length} monsters from SWARFARM`);

  const imageMap = {};
  const awakenIds = [];

  for (const m of all) {
    if (!m.com2us_id) continue;
    if (m.awaken_level > 0) awakenIds.push(m.com2us_id);
    if (needImage.has(m.com2us_id) && m.image_filename) {
      imageMap[m.com2us_id] = CDN + m.image_filename;
    }
  }

  fs.writeFileSync(outImages, JSON.stringify(imageMap, null, 2), 'utf8');
  fs.writeFileSync(outAwaken, JSON.stringify(awakenIds.sort((a,b)=>a-b), null, 2), 'utf8');

  console.log(`monster-images.json: ${Object.keys(imageMap).length} CDN entries`);
  console.log(`awaken-ids.json:     ${awakenIds.length} awakened form IDs`);
}

main().catch(e => { console.error(e); process.exit(1); });
