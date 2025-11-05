"use client";

import { GOAL_CATEGORIES, GoalCategory } from "@/lib/validations/goal";
import { cn } from "@/lib/utils";

interface GoalCategoryPickerProps {
  value: GoalCategory;
  onChange: (category: GoalCategory) => void;
  disabled?: boolean;
}

export function GoalCategoryPicker({
  value,
  onChange,
  disabled,
}: GoalCategoryPickerProps) {
  const categories = Object.entries(GOAL_CATEGORIES) as [
    GoalCategory,
    (typeof GOAL_CATEGORIES)[keyof typeof GOAL_CATEGORIES]
  ][];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories.map(([key, config]) => {
        const isSelected = value === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
              "hover:border-primary/50 hover:bg-accent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected ? "border-primary bg-accent" : "border-border"
            )}
            style={{
              borderColor: isSelected ? config.color : undefined,
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
              style={{
                backgroundColor: `${config.color}${isSelected ? "30" : "20"}`,
              }}
            >
              {config.icon}
            </div>
            <span
              className={cn(
                "text-sm font-medium text-center",
                isSelected && "text-primary"
              )}
            >
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
