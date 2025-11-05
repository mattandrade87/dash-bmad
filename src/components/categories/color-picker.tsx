import { PRESET_COLORS } from "@/lib/validations/category";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-900 dark:text-white">
        Cor
      </label>

      {/* Paleta predefinida */}
      <div className="grid grid-cols-5 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="relative h-10 w-full rounded-lg border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: value === color ? "#000" : "transparent",
            }}
            aria-label={`Selecionar cor ${color}`}
          >
            {value === color && (
              <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
            )}
          </button>
        ))}
      </div>

      {/* Input manual (hex) */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <div
          className="h-10 w-10 rounded-lg border-2 border-gray-300 dark:border-gray-700"
          style={{ backgroundColor: value }}
        />
      </div>

      {/* Validação visual */}
      {!value.match(/^#[0-9A-F]{6}$/i) && value && (
        <p className="text-xs text-red-600">
          Formato inválido. Use #RRGGBB (ex: #FF5733)
        </p>
      )}
    </div>
  );
}
