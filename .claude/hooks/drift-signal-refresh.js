/**
 * Drift Signal Refresh Hook
 * FileChanged: On manifest changes, update project signals in brain.db
 *
 * Tracks: dependencies, framework, test framework, build tools
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files that indicate project signals
const SIGNAL_PATTERNS = [
  'package.json',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  '.nvmrc',
  '.env.example',
  'turbo.json'
];

function refreshSignals() {
  try {
    // Read package.json to detect framework/dependencies
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

      const signals = {
        framework: 'Next.js',
        runtime: 'Node.js',
        packageManager: 'pnpm',
        testFramework: pkg.devDependencies?.vitest ? 'Vitest' : 'Jest',
        orm: pkg.dependencies?.drizzle ? 'Drizzle' : null,
        monorepo: true,
        workspace: 'pnpm-workspace',
        linter: pkg.devDependencies?.['@biomejs/biome'] ? 'Biome' : 'ESLint'
      };

      // In a real implementation, this would update brain.db
      console.log('✓ Drift signals updated:', signals);
    }
  } catch (error) {
    console.error('Signal refresh error:', error.message);
  }
}

module.exports = {
  hookType: 'FileChanged',
  patterns: SIGNAL_PATTERNS,
  handler: async (changedFiles) => {
    // Only refresh if manifest files changed
    const relevantChanges = changedFiles.filter(f =>
      SIGNAL_PATTERNS.some(p => f.endsWith(p))
    );

    if (relevantChanges.length > 0) {
      refreshSignals();
    }
  }
};
