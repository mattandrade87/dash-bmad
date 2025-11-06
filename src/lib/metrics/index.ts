/**
 * Metrics barrel export
 * Ref: ARCHITECTURAL-REFACTORING-PLAN.md - Phase 1.4
 *
 * Note: invalidateDashboardCache is re-exported from cache module
 * to avoid naming conflicts in main lib/index.ts
 */

export * from "./dashboard";
