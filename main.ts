// Spotlight @crisxai5 — make.fun entry program (Node 22, standard library only).
//
// The entry IS the X post: this repo only hands the house the post's address.
// main.ts copies POST.json from the repository root to /output/POST.json,
// where the gate scorer reads it. That is the program's whole job.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Deterministic by design: no network, no clock, no files outside the repo.
// Two runs write byte-identical output, as the grader requires.

const src = join(BOT_DIR, 'POST.json');
const dst = join(OUTPUT_DIR, 'POST.json');

// Read + parse first so a malformed POST.json fails loudly instead of
// silently copying a broken address into the output.
const raw = readFileSync(src, 'utf8');
const parsed = JSON.parse(raw) as { url?: unknown };
if (typeof parsed.url !== 'string' || !parsed.url.startsWith('https://')) {
  console.error('POST.json must hold {"url": "https://x.com/<handle>/status/<id>"}');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(src, dst);
