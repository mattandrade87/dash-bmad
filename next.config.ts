import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // React Compiler desabilitado - ainda experimental e incompatível com React Hook Form
  // Causava warnings em componentes com watch() (transaction-form, category-modal, goal-modal)
  // Referência: ARCHITECTURAL-REFACTORING-PLAN.md - Fase 1.1
  reactCompiler: false,
};

export default nextConfig;
