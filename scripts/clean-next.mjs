import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const nextDir = join(process.cwd(), '.next');

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log('Removed .next cache.');
} else {
  console.log('.next cache already clean.');
}

for (const entry of readdirSync(process.cwd(), { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name.startsWith('.next-stale-')) {
    rmSync(join(process.cwd(), entry.name), { recursive: true, force: true });
    console.log(`Removed ${entry.name}.`);
  }
}
