import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const unitTestDirectory = join(scriptDirectory, '../tests/unit');

const testFiles = readdirSync(unitTestDirectory)
  .filter((fileName) => fileName.endsWith('.test.js'))
  .map((fileName) => join(unitTestDirectory, fileName));

const result = spawnSync(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
