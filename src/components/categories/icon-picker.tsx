import { PRESET_ICONS } from "@/lib/validations/category";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  type: "INCOME" | "EXPENSE";
}

export function IconPicker({ value, onChange, type }: IconPickerProps) {
  const icons = PRESET_ICONS[type];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-900 dark:text-white">
        Ícone
      </label>

      {/* Emojis predefinidos */}
      <div className="grid grid-cols-8 gap-2">
        {icons.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={`
              h-12 w-12 rounded-lg border-2 text-2xl transition-all hover:scale-110
              ${
                value === icon
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
              }
            `}
            aria-label={`Selecionar ícone ${icon}`}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Input manual */}
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite um emoji..."
          maxLength={2}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Cole um emoji ou escolha um acima
        </p>
      </div>
    </div>
  );
}
