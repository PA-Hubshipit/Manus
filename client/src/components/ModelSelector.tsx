import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { AI_PROVIDERS } from '@/lib/ai-providers';

interface ModelSelectorProps {
  selectedModels: string[];
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onToggleModel: (provider: string, model: string) => void;
  onAddModel: () => void;
  getProviderColor: (provider?: string) => string;
}

export function ModelSelector({
  selectedModels,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  onToggleModel,
  onAddModel,
  getProviderColor
}: ModelSelectorProps) {
  return (
    <div className="p-3 md:p-4 border-b border-border bg-muted/50">
      {/* Selected Models */}
      {selectedModels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedModels.map(modelKey => {
            const [provider, model] = modelKey.split(':');
            return (
              <div
                key={modelKey}
                className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-background rounded-full text-xs md:text-sm"
              >
                <div className={`w-2 h-2 rounded-full ${getProviderColor(provider)}`} />
                <span className="truncate max-w-[120px]">{model}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => onToggleModel(provider, model)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Model Selection Dropdowns */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase px-3 mb-3">Add Models</h3>
        
        {/* Provider Dropdown */}
        <div className="px-3">
          <label className="text-xs font-medium mb-2 block">Select Provider</label>
          <Select value={selectedProvider} onValueChange={(value) => {
            onProviderChange(value);
            onModelChange(''); // Reset model when provider changes
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a provider" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${provider.color}`} />
                    {provider.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Dropdown */}
        {selectedProvider && (
          <div className="px-3">
            <label className="text-xs font-medium mb-2 block">Select Model</label>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a model" />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS[selectedProvider as keyof typeof AI_PROVIDERS]?.models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Add Button */}
        {selectedProvider && selectedModel && (
          <div className="px-3">
            <Button
              onClick={onAddModel}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {selectedModel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
