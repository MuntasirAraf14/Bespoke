import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Kills any process currently listening on the given port (Windows only).
 * Silently ignores errors if nothing is on that port.
 */
function freePort(port) {
  try {
    const result = execSync(
      `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();

    if (result) {
      const pids = [...new Set(result.split(/\r?\n/).map(p => p.trim()).filter(Boolean))];
      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' });
          console.log(`  Freed port ${port} (killed PID ${pid})`);
        } catch {
          // already dead
        }
      }
    }
  } catch {
    // port was already free
  }
}

const rootDir = path.resolve(__dirname, '..');

const services = [
  {
    name: 'Backend',
    command: 'npm',
    args: ['run', 'server'],
    cwd: path.join(rootDir, 'backend'),
    color: '\x1b[35m', // Magenta
  },
  {
    name: 'Frontend',
    command: 'npm',
    args: ['run', 'dev'],
    cwd: path.join(rootDir, 'frontend'),
    color: '\x1b[36m', // Cyan
  },
  {
    name: 'Admin',
    command: 'npm',
    args: ['run', 'dev'],
    cwd: path.join(rootDir, 'admin'),
    color: '\x1b[33m', // Yellow
  }
];

const children = [];

function log(service, text) {
  const reset = '\x1b[0m';
  const prefix = `${service.color}[${service.name}]${reset}`;
  const lines = text.toString().split('\n');
  for (const line of lines) {
    if (line.trim()) {
      console.log(`${prefix} ${line}`);
    }
  }
}

// Free any ports that might already be in use before starting
console.log('Checking for processes on required ports...');
freePort(4000); // Backend
freePort(5173); // Frontend
freePort(5174); // Admin

// Start all services
for (const service of services) {
  console.log(`Starting ${service.name}...`);
  const child = spawn(service.command, service.args, {
    cwd: service.cwd,
    shell: true,
  });

  child.stdout.on('data', (data) => log(service, data));
  child.stderr.on('data', (data) => log(service, data));

  child.on('close', (code) => {
    console.log(`[${service.name}] process exited with code ${code}`);
    cleanupAndExit();
  });

  child.on('error', (err) => {
    console.error(`[${service.name}] failed to start:`, err);
  });

  children.push(child);
}

let isCleaningUp = false;
function cleanupAndExit() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log('\nShutting down all services...');
  
  for (const child of children) {
    if (child && !child.killed) {
      try {
        // On Windows, taskkill is more reliable for tree killing spawned shell processes
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', child.pid, '/f', '/t'], { shell: true });
        } else {
          child.kill('SIGTERM');
        }
      } catch (e) {
        // Ignore error if already dead
      }
    }
  }
  process.exit(0);
}

// Handle termination signals
process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);
process.on('exit', cleanupAndExit);
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in runner:', err);
  cleanupAndExit();
});
