import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const frontendDist = path.join(rootDir, 'frontend', 'dist');
const adminDist = path.join(rootDir, 'admin', 'dist');
const adminTarget = path.join(frontendDist, 'admin');

if (!fs.existsSync(frontendDist)) {
  throw new Error('Missing frontend/dist. Run the frontend build first.');
}

if (!fs.existsSync(adminDist)) {
  throw new Error('Missing admin/dist. Run the admin build first.');
}

fs.rmSync(adminTarget, { recursive: true, force: true });
fs.cpSync(adminDist, adminTarget, { recursive: true });

console.log('Merged admin build into frontend/dist/admin');
