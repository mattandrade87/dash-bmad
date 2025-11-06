/**
 * Main lib barrel export
 * Ref: ARCHITECTURAL-REFACTORING-PLAN.md - Phase 1.4
 *
 * This provides a clean API for importing lib utilities:
 * import { formatCurrency, prisma, requireAuth, cn } from "@/lib"
 */

// Authentication
export * from "./auth";

// Cache
export * from "./cache";

// Database
export * from "./database";

// Formatters
export * from "./formatters";

// Utils
export { cn } from "./utils";
export * from "./utils/csv";
export * from "./utils/recurring";

// Validations
export * from "./validations";

// Metrics (dashboard-specific exports, cache invalidation comes from cache module)
export {
  type DashboardMetrics,
  getDashboardMetrics,
  getCachedCategories,
  getCachedGoals,
  getCachedUnreadAlerts,
} from "./metrics/dashboard";
