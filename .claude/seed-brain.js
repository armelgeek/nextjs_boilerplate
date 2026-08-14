#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '.drift-brain.db'));

// Seed decisions (architecture & tech choices already made)
const decisions = [
  {
    question: "Backend framework for API server?",
    answer: "NestJS with TypeScript",
    domain: "api",
    confidence: 0.95,
    locked: 1
  },
  {
    question: "Frontend for admin panel?",
    answer: "Vite + TypeScript",
    domain: "ui",
    confidence: 0.95,
    locked: 1
  },
  {
    question: "ORM for database?",
    answer: "Drizzle ORM with PostgreSQL",
    domain: "database",
    confidence: 0.95,
    locked: 1
  },
  {
    question: "Project structure?",
    answer: "Separate apps: mooz-backend (NestJS) and mooz-mobile (Vite admin)",
    domain: "infra",
    confidence: 0.95,
    locked: 1
  }
];

// Seed learnings (patterns in Mooz)
const learnings = [
  {
    pattern: "nestjs-drizzle-integration",
    problem: "NestJS + Drizzle ORM setup and service patterns",
    solution: "Define services in src/modules/*/[name].service.ts, inject db, use drizzle queries",
    domains: "api,database",
    confidence: 0.85
  },
  {
    pattern: "recipe-redo-operations",
    problem: "Need to support recipe testing and bulk redo operations",
    solution: "Recipe service with batch methods, drizzle transactions for consistency",
    domains: "api,database",
    confidence: 0.8
  },
  {
    pattern: "separate-app-build",
    problem: "Backend and frontend are separate npm projects",
    solution: "Run npm install and npm run dev separately in each app directory",
    domains: "infra",
    confidence: 0.9
  }
];

// Seed conventions
const conventions = [
  {
    key: "import-style",
    value: JSON.stringify({
      style: "relative imports",
      reason: "not a monorepo, each app independent"
    })
  },
  {
    key: "app-structure",
    value: JSON.stringify({
      backend: "mooz-backend (NestJS + Drizzle + PostgreSQL)",
      frontend: "mooz-mobile (Vite + TS admin panel)"
    })
  },
  {
    key: "database-workflow",
    value: JSON.stringify({
      edit: "mooz-backend/src/database/schema.ts",
      generate: "npm run db:generate",
      apply: "npm run db:push"
    })
  },
  {
    key: "naming-convention",
    value: JSON.stringify({
      files: "kebab-case",
      classes: "PascalCase",
      functions: "camelCase",
      database_tables: "snake_case"
    })
  }
];

try {
  // Insert decisions
  const insertDecision = db.prepare(`
    INSERT INTO decisions (id, question, answer, domain, confidence, locked)
    VALUES (lower(hex(randomblob(8))), ?, ?, ?, ?, ?)
  `);

  decisions.forEach(d => {
    insertDecision.run(d.question, d.answer, d.domain, d.confidence, d.locked);
  });
  console.log(`✓ Seeded ${decisions.length} decisions`);

  // Insert learnings
  const insertLearning = db.prepare(`
    INSERT INTO learnings (id, pattern, problem, solution, domains, confidence)
    VALUES (lower(hex(randomblob(8))), ?, ?, ?, ?, ?)
  `);

  learnings.forEach(l => {
    insertLearning.run(l.pattern, l.problem, l.solution, l.domains, l.confidence);
  });
  console.log(`✓ Seeded ${learnings.length} learnings`);

  // Insert conventions
  const insertConvention = db.prepare(`
    INSERT OR REPLACE INTO conventions (key, value, scope)
    VALUES (?, ?, 'project')
  `);

  conventions.forEach(c => {
    insertConvention.run(c.key, c.value);
  });
  console.log(`✓ Seeded ${conventions.length} conventions`);

  db.close();
  console.log("\n✅ Mooz Brain initialized with project knowledge!");
  process.exit(0);
} catch (e) {
  console.error('❌ Error seeding brain:', e.message);
  db.close();
  process.exit(1);
}
