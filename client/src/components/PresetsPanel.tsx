import { Button } from '@/components/ui/button';
import { MODEL_PRESETS } from '@/lib/ai-providers';

interface PresetsPanelProps {
  onApplyPreset: (models: string[]) => void;
}

export function PresetsPanel({ onApplyPreset }: PresetsPanelProps) {
  const presets = Object.entries(MODEL_PRESETS).map(([key, preset]) => ({
    id: key,
    name: preset.name,
    models: preset.models
  }));

  return (
    <div className="p-3 md:p-4 border-b border-border bg-muted/50">
      <div className="mb-3 p-3 bg-background rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Quick Presets</h3>
        </div>
        <div className="space-y-2">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => onApplyPreset(preset.models)}
              className="w-full justify-start text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
