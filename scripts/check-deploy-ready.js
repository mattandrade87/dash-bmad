#!/usr/bin/env node

/**
 * Script para verificar se o projeto está pronto para deploy
 */

const fs = require("fs");
const path = require("path");

const checks = [];

// Verificar arquivos essenciais
const requiredFiles = [
  "package.json",
  "next.config.ts",
  "tsconfig.json",
  "tailwind.config.ts",
  "prisma/schema.prisma",
  "src/lib/auth.ts",
  "src/middleware.ts",
  ".env.example",
];

console.log("🔍 Verificando configuração do projeto...\n");

// 1. Arquivos essenciais
console.log("📁 Arquivos essenciais:");
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? "✅" : "❌"} ${file}`);
  checks.push({ name: file, passed: exists });
});

// 2. Variáveis de ambiente
console.log("\n🔐 Variáveis de ambiente (.env.example):");
const envExample = fs.readFileSync(".env.example", "utf-8");
const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET"];
requiredEnvVars.forEach((envVar) => {
  const exists = envExample.includes(envVar);
  console.log(`  ${exists ? "✅" : "❌"} ${envVar}`);
  checks.push({ name: envVar, passed: exists });
});

// 3. Package.json scripts
console.log("\n📦 Scripts npm:");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const requiredScripts = ["dev", "build", "start", "test"];
requiredScripts.forEach((script) => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`  ${exists ? "✅" : "❌"} ${script}`);
  checks.push({ name: `script:${script}`, passed: !!exists });
});

// 4. Dependências importantes
console.log("\n📚 Dependências críticas:");
const requiredDeps = [
  "next",
  "react",
  "typescript",
  "@prisma/client",
  "next-auth",
  "zustand",
];
const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
requiredDeps.forEach((dep) => {
  const exists = allDeps[dep];
  console.log(
    `  ${exists ? "✅" : "❌"} ${dep} ${exists ? `(${allDeps[dep]})` : ""}`
  );
  checks.push({ name: `dep:${dep}`, passed: !!exists });
});

// 5. Build command
console.log("\n🔨 Build configuration:");
const buildCommand = packageJson.scripts?.build;
const includesPrismaGenerate = buildCommand?.includes("prisma generate");
console.log(
  `  ${includesPrismaGenerate ? "✅" : "⚠️"} Build includes 'prisma generate'`
);
if (!includesPrismaGenerate) {
  console.log('    Recomendado: "build": "prisma generate && next build"');
}

// 6. Postinstall
const hasPostinstall = packageJson.scripts?.postinstall;
console.log(`  ${hasPostinstall ? "✅" : "⚠️"} Postinstall script configured`);
if (!hasPostinstall) {
  console.log('    Recomendado: "postinstall": "prisma generate"');
}

// Resumo
console.log("\n" + "=".repeat(50));
const totalChecks = checks.length;
const passedChecks = checks.filter((c) => c.passed).length;
const percentage = Math.round((passedChecks / totalChecks) * 100);

if (percentage === 100) {
  console.log("✅ PROJETO PRONTO PARA DEPLOY!");
  console.log(`   ${passedChecks}/${totalChecks} verificações passaram`);
} else if (percentage >= 80) {
  console.log("⚠️  PROJETO QUASE PRONTO");
  console.log(
    `   ${passedChecks}/${totalChecks} verificações passaram (${percentage}%)`
  );
  console.log("   Algumas melhorias recomendadas acima");
} else {
  console.log("❌ PROJETO NÃO ESTÁ PRONTO");
  console.log(
    `   ${passedChecks}/${totalChecks} verificações passaram (${percentage}%)`
  );
  console.log("   Corrija os problemas antes de fazer deploy");
}

console.log("=".repeat(50));

// Próximos passos
console.log("\n📋 Próximos passos:");
console.log("  1. Criar banco de dados PostgreSQL (Supabase/Railway/Neon)");
console.log("  2. Configurar variáveis de ambiente no Vercel");
console.log("  3. Conectar repositório GitHub ao Vercel");
console.log("  4. Deploy!");
console.log("\n📖 Documentação: docs/deployment.md");

process.exit(percentage === 100 ? 0 : 1);
