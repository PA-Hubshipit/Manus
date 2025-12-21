import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { MODEL_PRESETS } from '@/lib/ai-providers';
import { CustomPreset } from './PresetsManagementModal';
import { QuickPreset } from '@/lib/quick-presets';

// Define preset categories
const PRESET_CATEGORIES = {
  coding: {
    name: 'Coding',
    presetIds: ['coding'] // matches MODEL_PRESETS keys
  },
  writing: {
    name: 'Writing',
    presetIds: ['creative']
  },
  research: {
    name: 'Research',
    presetIds: ['research']
  },
  general: {
    name: 'General',
    presetIds: ['general', 'fast']
  }
};

interface PresetSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customPresets: CustomPreset[];
  quickPresets: QuickPreset[];
  onAdd: (presets: Array<{ sourceId: string; sourceType: 'built-in' | 'custom'; name: string; models: string[] }>) => void;
  onCreateNew?: () => void;
}

export function PresetSelectionDialog({
  open,
  onOpenChange,
  customPresets,
  quickPresets,
  onAdd,
  onCreateNew
}: PresetSelectionDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['coding', 'writing', 'research', 'general', 'custom']));

  // Get all available presets (built-in + custom)
  const builtInPresets = Object.entries(MODEL_PRESETS).map(([key, preset]) => ({
    id: key,
    name: preset.name,
    models: preset.models,
    type: 'built-in' as const
  }));

  const customPresetsWithType = customPresets.map(preset => ({
    id: preset.id,
    name: preset.name,
    models: preset.models,
    type: 'custom' as const
  }));

  const allPresets = [...builtInPresets, ...customPresetsWithType];

  // Filter out presets already in Quick Presets
  const availablePresets = allPresets.filter(preset => {
    const alreadyInQuick = quickPresets.some(qp => 
      qp.sourceId === preset.id && qp.sourceType === preset.type
    );
    return !alreadyInQuick;
  });

  // Filter by search query
  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return availablePresets;
    const query = searchQuery.toLowerCase();
    return availablePresets.filter(preset => 
      preset.name.toLowerCase().includes(query) ||
      preset.models.some(model => model.toLowerCase().includes(query))
    );
  }, [availablePresets, searchQuery]);

  // Group presets by category
  const presetsByCategory = useMemo(() => {
    const result: Record<string, typeof filteredPresets> = {};
    
    // Initialize categories
    Object.keys(PRESET_CATEGORIES).forEach(cat => {
      result[cat] = [];
    });
    result['custom'] = [];

    filteredPresets.forEach(preset => {
      if (preset.type === 'custom') {
        result['custom'].push(preset);
      } else {
        // Find which category this built-in preset belongs to
        let found = false;
        for (const [catKey, catData] of Object.entries(PRESET_CATEGORIES)) {
          if (catData.presetIds.includes(preset.id)) {
            result[catKey].push(preset);
            found = true;
            break;
          }
        }
        // If not categorized, put in general
        if (!found) {
          result['general'].push(preset);
        }
      }
    });

    return result;
  }, [filteredPresets]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const togglePreset = (presetId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(presetId)) {
      newSelected.delete(presetId);
    } else {
      newSelected.add(presetId);
    }
    setSelectedIds(newSelected);
  };

  const handleAdd = () => {
    const presetsToAdd = allPresets
      .filter(p => selectedIds.has(p.id))
      .map(p => ({
        sourceId: p.id,
        sourceType: p.type,
        name: p.name,
        models: p.models
      }));

    onAdd(presetsToAdd);
    setSelectedIds(new Set());
    setSearchQuery('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    setSearchQuery('');
    onOpenChange(false);
  };

  const handleCreateNew = () => {
    handleClose();
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Presets to Quick Presets</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search presets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Presets List with Categories */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-[300px]">
            {filteredPresets.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                {searchQuery ? 'No presets match your search' : 'All presets are already in Quick Presets'}
              </div>
            ) : (
              <>
                {/* Built-in Categories */}
                {Object.entries(PRESET_CATEGORIES).map(([catKey, catData]) => {
                  const categoryPresets = presetsByCategory[catKey] || [];
                  if (categoryPresets.length === 0) return null;

                  const isExpanded = expandedCategories.has(catKey);
                  const selectedCount = categoryPresets.filter(p => selectedIds.has(p.id)).length;

                  return (
                    <div key={catKey} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(catKey)}
                        className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="font-medium">{catData.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({categoryPresets.length} preset{categoryPresets.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        {selectedCount > 0 && (
                          <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                            {selectedCount} selected
                          </span>
                        )}
                      </button>
                      {isExpanded && (
                        <div className="p-2 space-y-1">
                          {categoryPresets.map(preset => (
                            <button
                              key={preset.id}
                              onClick={() => togglePreset(preset.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                selectedIds.has(preset.id)
                                  ? 'bg-primary/10 border border-primary'
                                  : 'bg-background hover:bg-muted border border-transparent'
                              }`}
                            >
                              <div className="flex-1 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{preset.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({preset.models.length} models)
                                  </span>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                selectedIds.has(preset.id)
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'border-input'
                              }`}>
                                {selectedIds.has(preset.id) && <span className="text-xs">✓</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Custom Presets Category */}
                {(presetsByCategory['custom'] || []).length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory('custom')}
                      className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {expandedCategories.has('custom') ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-medium">Custom Presets</span>
                        <span className="text-xs text-muted-foreground">
                          ({presetsByCategory['custom'].length} preset{presetsByCategory['custom'].length !== 1 ? 's' : ''})
                        </span>
                      </div>
                      {presetsByCategory['custom'].filter(p => selectedIds.has(p.id)).length > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                          {presetsByCategory['custom'].filter(p => selectedIds.has(p.id)).length} selected
                        </span>
                      )}
                    </button>
                    {expandedCategories.has('custom') && (
                      <div className="p-2 space-y-1">
                        {presetsByCategory['custom'].map(preset => (
                          <button
                            key={preset.id}
                            onClick={() => togglePreset(preset.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                              selectedIds.has(preset.id)
                                ? 'bg-primary/10 border border-primary'
                                : 'bg-background hover:bg-muted border border-transparent'
                            }`}
                          >
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{preset.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({preset.models.length} models)
                                </span>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              selectedIds.has(preset.id)
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-input'
                            }`}>
                              {selectedIds.has(preset.id) && <span className="text-xs">✓</span>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Create New Preset Link */}
          {onCreateNew && (
            <div className="border-t pt-3">
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create New Preset
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {selectedIds.size > 0 && (
              <Button onClick={handleAdd}>
                Add {selectedIds.size} {selectedIds.size === 1 ? 'preset' : 'presets'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
