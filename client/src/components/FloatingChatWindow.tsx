import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Pin, Minus, Maximize2, Minimize2, X, MessageSquare, GripHorizontal } from 'lucide-react';
import { ChatFooter, SavedConversation as SavedConvo } from '@/components/ChatFooter';
import { ModelSelector } from './ModelSelector';
import { PresetsPanel } from './PresetsPanel';
import { SettingsMenu } from './SettingsMenu';
import { PresetEditorModal } from './PresetEditorModal';
import { PresetsManagementModal, CustomPreset } from './PresetsManagementModal';
import { RenameChatDialog } from './RenameChatDialog';
import { AnalyticsPanel } from './AnalyticsPanel';
import { PresetSelectionDialog } from './PresetSelectionDialog';
import { SavedConversationsModal } from './SavedConversationsModal';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { useKeyboardShortcuts, SHORTCUT_KEYS } from '@/hooks/useKeyboardShortcuts';
import { AI_PROVIDERS, MODEL_PRESETS } from '@/lib/ai-providers';
import { QuickPreset, loadQuickPresets, saveQuickPresets, addQuickPresets, updateQuickPreset, removeQuickPreset } from '@/lib/quick-presets';
import { toast } from 'sonner';

interface Attachment {
  name: string;
  type: string;
  size: number;
  file: File;
}

// Using SavedConvo from ChatFooter to avoid type conflicts
// Using CustomPreset from PresetsManagementModal to avoid type conflicts

interface FloatingChatWindowProps {
  id: string;
  initialPosition?: { x: number; y: number };
  onClose: () => void;
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

export function FloatingChatWindow({ 
  id, 
  initialPosition = { x: 50, y: 50 },
  onClose,
  onPositionChange 
}: FloatingChatWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isPinned, setIsPinned] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationTitle, setConversationTitle] = useState(`Chat ${id}`);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [savedConversations, setSavedConversations] = useState<SavedConvo[]>([]);
  const [archivedConversations, setArchivedConversations] = useState<SavedConvo[]>([]);
  const [showPresetEditor, setShowPresetEditor] = useState(false);
  const [editingPreset, setEditingPreset] = useState<CustomPreset | null>(null);
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const lastTapRef = useRef<number>(0);
  const [showPresetsManagement, setShowPresetsManagement] = useState(false);
  const [defaultModels, setDefaultModels] = useState<string[]>([]);
  const [quickPresets, setQuickPresets] = useState<QuickPreset[]>([]);
  const [showPresetSelection, setShowPresetSelection] = useState(false);
  const [editingQuickPresetId, setEditingQuickPresetId] = useState<string | null>(null);
  const [showSavedConversationsModal, setShowSavedConversationsModal] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Load saved conversations and custom presets from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedConversations') || '[]');
    setSavedConversations(saved);
    const archived = JSON.parse(localStorage.getItem('archivedConversations') || '[]');
    setArchivedConversations(archived);
    const presets = JSON.parse(localStorage.getItem('customPresets') || '[]');
    setCustomPresets(presets);
    const quick = loadQuickPresets();
    setQuickPresets(quick);
  }, []);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newPos = { 
      x: position.x + info.offset.x, 
      y: position.y + info.offset.y 
    };
    setPosition(newPos);
    onPositionChange?.(newPos);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    toast.info(isPinned ? 'Window unpinned' : 'Window pinned');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      toast.info('Window maximized');
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    
    if (selectedModels.length === 0) {
      toast.error('Please select at least one AI model');
      return;
    }
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate AI responses
    setTimeout(() => {
      const aiResponses = selectedModels.map((modelKey, index) => {
        const [provider, model] = modelKey.split(':');
        return {
          id: Date.now() + index + 1,
          type: 'assistant',
          content: `This is a simulated response from ${model}. In a real implementation, this would connect to the ${provider} API.`,
          model: model,
          provider: provider,
          timestamp: new Date()
        };
      });
      
      setMessages(prev => [...prev, ...aiResponses]);
      setIsLoading(false);
    }, 1000);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleRename = (newTitle: string) => {
    if (newTitle.trim()) {
      setConversationTitle(newTitle.trim());
      toast.success('Chat renamed');
    }
    setShowRenameDialog(false);
  };

  const renameChat = () => {
    setEditTitleValue(conversationTitle);
    setIsEditingTitle(true);
  };

  const saveConversation = () => {
    if (messages.length === 0) {
      toast.error('No messages to save');
      return;
    }
    
    const newConvo: SavedConvo = {
      id: `convo-${Date.now()}`,
      title: conversationTitle,
      messages: messages,
      models: selectedModels,
      timestamp: new Date().toISOString()
    };
    
    // Auto-archiving logic: if we already have 3 recent conversations, archive the oldest
    let updatedSaved = [...savedConversations];
    let updatedArchived = [...archivedConversations];
    
    if (updatedSaved.length >= 3) {
      // Move the oldest conversation to archive
      const oldest = updatedSaved[updatedSaved.length - 1];
      updatedArchived = [oldest, ...updatedArchived];
      updatedSaved = updatedSaved.slice(0, 2);
    }
    
    updatedSaved = [newConvo, ...updatedSaved];
    
    setSavedConversations(updatedSaved);
    setArchivedConversations(updatedArchived);
    localStorage.setItem('savedConversations', JSON.stringify(updatedSaved));
    localStorage.setItem('archivedConversations', JSON.stringify(updatedArchived));
    toast.success('Conversation saved');
  };

  const clearChat = () => {
    setMessages([]);
    setConversationTitle(`Chat ${id}`);
    toast.info('Chat cleared');
  };

  // Keyboard shortcuts
  const newChat = useCallback(() => {
    setMessages([]);
    setConversationTitle(`Chat ${Date.now()}`);
    toast.info('New chat started');
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useKeyboardShortcuts({
    enabled: true,
    shortcuts: [
      { ...SHORTCUT_KEYS.NEW_CHAT, action: newChat },
      { ...SHORTCUT_KEYS.SAVE_CHAT, action: saveConversation },
      { ...SHORTCUT_KEYS.SEARCH, action: () => setShowSavedConversationsModal(true) },
      { ...SHORTCUT_KEYS.SETTINGS, action: () => setShowSettings(true) },
      { ...SHORTCUT_KEYS.CLEAR_CHAT, action: clearChat },
      { ...SHORTCUT_KEYS.FOCUS_INPUT, action: focusInput },
      { key: '?', action: () => setShowKeyboardHelp(prev => !prev), description: 'Toggle Keyboard Help' },
      { ...SHORTCUT_KEYS.CLOSE, action: () => {
        if (showKeyboardHelp) setShowKeyboardHelp(false);
        else if (showSavedConversationsModal) setShowSavedConversationsModal(false);
        else if (showAnalytics) setShowAnalytics(false);
        else if (showSettings) setShowSettings(false);
        else if (showModelSelector) setShowModelSelector(false);
        else if (showPresets) setShowPresets(false);
      }},
    ],
  });

  const deleteChat = () => {
    setMessages([]);
    setConversationTitle(`Chat ${id}`);
    toast.success('Chat deleted');
  };

  const showAnalyticsPanel = () => {
    setShowAnalytics(true);
  };

  const exportConversation = () => {
    if (messages.length === 0) {
      toast.error('No messages to export');
      return;
    }
    
    const exportData = {
      title: conversationTitle,
      messages: messages,
      models: selectedModels,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversationTitle.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Conversation exported');
  };

  const toggleModel = (providerKey: string, model: string) => {
    const modelKey = `${providerKey}:${model}`;
    setSelectedModels(prev => 
      prev.includes(modelKey) 
        ? prev.filter(m => m !== modelKey)
        : [...prev, modelKey]
    );
  };

  const addModelFromDropdown = () => {
    if (selectedProvider && selectedModel) {
      const modelKey = `${selectedProvider}:${selectedModel}`;
      if (!selectedModels.includes(modelKey)) {
        setSelectedModels(prev => [...prev, modelKey]);
        toast.success(`Added ${selectedModel}`);
      }
      setSelectedProvider('');
      setSelectedModel('');
    }
  };

  const applyPreset = (preset: { name: string; models: string[] }) => {
    setSelectedModels(preset.models);
    setShowPresets(false);
    toast.success(`Applied preset: ${preset.name}`);
  };

  const handleSummarizer = () => {
    if (selectedModels.length === 0) {
      toast.error('Please select at least one AI model');
      return;
    }
    
    const aiResponses = messages.filter(m => m.type === 'assistant');
    if (aiResponses.length === 0) {
      toast.error('No AI responses to synthesize');
      return;
    }
    
    const synthesis = {
      id: Date.now(),
      type: 'assistant',
      content: `**Synthesis of ${aiResponses.length} responses:**\n\n${aiResponses.map(r => r.content).join('\n\n---\n\n')}`,
      model: 'Synthesis',
      timestamp: new Date()
    };
    
    setMessages([...messages, synthesis]);
    toast.success('Synthesis generated');
  };

  const loadConversation = (convo: SavedConvo) => {
    setMessages(convo.messages || []);
    setConversationTitle(convo.title);
    setSelectedModels(convo.models || []);
    toast.success(`Loaded: ${convo.title}`);
  };

  const viewAllSaved = () => {
    setShowSavedConversationsModal(true);
  };

  const handleDeleteSavedConversation = (id: string, isArchived: boolean) => {
    if (isArchived) {
      const updated = archivedConversations.filter(c => c.id !== id);
      setArchivedConversations(updated);
      localStorage.setItem('archivedConversations', JSON.stringify(updated));
    } else {
      const updated = savedConversations.filter(c => c.id !== id);
      setSavedConversations(updated);
      localStorage.setItem('savedConversations', JSON.stringify(updated));
    }
    toast.success('Conversation deleted');
  };

  const handleUpdateSavedConversation = (updatedConvo: SavedConvo, isArchived: boolean) => {
    if (isArchived) {
      const updated = archivedConversations.map(c => c.id === updatedConvo.id ? updatedConvo : c);
      setArchivedConversations(updated);
      localStorage.setItem('archivedConversations', JSON.stringify(updated));
    } else {
      const updated = savedConversations.map(c => c.id === updatedConvo.id ? updatedConvo : c);
      setSavedConversations(updated);
      localStorage.setItem('savedConversations', JSON.stringify(updated));
    }
  };

  const handleImportConversations = (saved: SavedConvo[], archived: SavedConvo[]) => {
    setSavedConversations(saved);
    setArchivedConversations(archived);
    localStorage.setItem('savedConversations', JSON.stringify(saved));
    localStorage.setItem('archivedConversations', JSON.stringify(archived));
  };

  const openPresetsSettings = () => {
    setShowPresetsManagement(true);
  };

  const savePreset = (preset: CustomPreset) => {
    const updated = editingPreset
      ? customPresets.map(p => p.id === preset.id ? preset : p)
      : [...customPresets, preset];
    
    setCustomPresets(updated);
    localStorage.setItem('customPresets', JSON.stringify(updated));
    
    // If editing a Quick Preset, update it too
    if (editingQuickPresetId) {
      const updatedQuick = updateQuickPreset(quickPresets, editingQuickPresetId, {
        name: preset.name,
        models: preset.models
      });
      setQuickPresets(updatedQuick);
      saveQuickPresets(updatedQuick);
      setEditingQuickPresetId(null);
    }
    
    setShowPresetEditor(false);
    setEditingPreset(null);
  };

  // Quick Presets handlers
  const handleAddQuickPresets = (presets: Array<{ sourceId: string; sourceType: 'built-in' | 'custom'; name: string; models: string[] }>) => {
    const updated = addQuickPresets(quickPresets, presets);
    setQuickPresets(updated);
    saveQuickPresets(updated);
    toast.success(`Added ${presets.length} preset${presets.length > 1 ? 's' : ''} to Quick Presets`);
  };

  const handleEditQuickPreset = (id: string) => {
    const preset = quickPresets.find(p => p.id === id);
    if (!preset) return;
    
    // Open PresetEditorModal with the Quick Preset data
    setEditingQuickPresetId(id);
    setEditingPreset({
      id: preset.id,
      name: preset.name,
      description: '',
      models: preset.models,
      type: 'custom'
    });
    setShowPresetEditor(true);
  };

  const handleRemoveQuickPreset = (id: string) => {
    const updated = removeQuickPreset(quickPresets, id);
    setQuickPresets(updated);
    saveQuickPresets(updated);
    toast.success('Preset removed from Quick Presets');
  };

  // Window styles
  const windowStyle: React.CSSProperties = isMaximized
    ? {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        borderRadius: 0
      }
    : {
        top: position.y,
        left: position.x,
        width: 'min(400px, 90vw)',
        height: isMinimized ? 'auto' : 'min(500px, 70vh)'
      };

  if (isMinimized) {
    windowStyle.height = 'auto';
  } else if (!isMaximized) {
    windowStyle.height = 'min(500px, 70vh)';
  }

  return (
    <>
    <motion.div
      drag={!isPinned && !isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      className="fixed bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col z-[900]"
      style={windowStyle}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-3 py-2 border-b border-border bg-card shrink-0"
        onDoubleClick={(e) => {
          // Only maximize if not clicking on the title input or the title span
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && !target.closest('.no-drag')) {
            toggleMaximize();
          }
        }}
      >
        <div 
          className="drag-handle flex items-center gap-2 cursor-move flex-1 min-w-0 mr-4"
          onPointerDown={(e) => {
            if (!isPinned && !isMaximized) {
              dragControls.start(e);
            }
          }}
        >
          {/* Drag Handle - Explicit drag zone */}
          <div className="flex items-center justify-center text-muted-foreground/50 hover:text-foreground transition-colors">
            <GripHorizontal className="h-4 w-4" />
          </div>
          
          <MessageSquare className="h-4 w-4 text-primary shrink-0" />
          
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={() => {
                handleRename(editTitleValue);
                setIsEditingTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename(editTitleValue);
                  setIsEditingTitle(false);
                } else if (e.key === 'Escape') {
                  setIsEditingTitle(false);
                  setEditTitleValue(conversationTitle);
                }
              }}
              className="bg-background border border-primary/50 rounded px-1.5 py-0.5 text-sm w-full outline-none h-6 no-drag"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              onClick={(e) => {
                // Custom double-tap detection for mobile using ref
                const now = Date.now();
                if (lastTapRef.current && (now - lastTapRef.current < 300)) {
                  // Double tap detected
                  e.preventDefault();
                  e.stopPropagation();
                  renameChat();
                  lastTapRef.current = 0; // Reset
                } else {
                  lastTapRef.current = now;
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                renameChat();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              // Added no-drag class to prevent dragging from the title text
              // This ensures double-tap works reliably without initiating drag
              className="font-medium text-sm truncate cursor-text hover:text-primary transition-colors select-none no-drag"
              title="Double click to rename"
            >
              {conversationTitle}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePin}
            className="h-7 w-7"
            title={isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className={`h-3.5 w-3.5 ${isPinned ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className="h-7 w-7"
            title={isMinimized ? 'Restore' : 'Minimize'}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMaximize}
            className="h-7 w-7"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-destructive hover:text-destructive"
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content - Hidden when minimized */}
      {!isMinimized && (
        <>
          {/* Model Selector Panel */}
          {showModelSelector && (
            <ModelSelector
              selectedModels={selectedModels}
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              showPresets={showPresets}
              onToggleModel={toggleModel}
              onProviderChange={setSelectedProvider}
              onModelChange={setSelectedModel}
              onAddModel={addModelFromDropdown}
              onTogglePresets={() => setShowPresets(!showPresets)}
              onApplyPreset={applyPreset}
              onCreatePreset={() => {
                setEditingPreset(null);
                setShowPresetEditor(true);
              }}
              customPresets={customPresets}
              onEditPreset={(preset) => {
                setEditingPreset(preset);
                setShowPresetEditor(true);
              }}
              onDeletePreset={(id) => {
                const updated = customPresets.filter(p => p.id !== id);
                setCustomPresets(updated);
                localStorage.setItem('customPresets', JSON.stringify(updated));
                toast.success('Preset deleted');
              }}
            />
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Select models and start chatting</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.type === 'assistant' && msg.model && (
                      <div className="text-xs text-muted-foreground mb-1 font-medium">
                        {msg.model}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <ChatFooter
            selectedModels={selectedModels}
            showModelSelector={showModelSelector}
            showPresets={showPresets}
            showSettings={showSettings}
            onNewChat={clearChat}
            onRenameChat={renameChat}
            onSaveChat={saveConversation}
            onClearChat={clearChat}
            onDeleteChat={deleteChat}
            onShowAnalytics={showAnalyticsPanel}
            onExport={exportConversation}
            onSummarizer={handleSummarizer}
            onToggleModelSelector={() => {
              setShowPresets(false);
              setShowModelSelector(!showModelSelector);
            }}
            onTogglePresets={() => {
              setShowPresets(true);
              setShowModelSelector(true);
            }}
            onToggleSettings={() => setShowSettings(!showSettings)}
            onOpenPresetsSettings={openPresetsSettings}
            onCloseSettings={() => {
              setShowSettings(false);
              setShowModelSelector(false);
            }}
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSend={handleSend}
            onAttach={() => {}}
            isLoading={isLoading}
            attachments={attachments}
            onRemoveAttachment={removeAttachment}
            savedConversations={savedConversations}
            onLoadConversation={loadConversation}
            onViewAllSaved={viewAllSaved}
            archivedCount={archivedConversations.length}
          />
        </>
      )}
    </motion.div>
    
    {/* Preset Editor Modal */}
    <PresetEditorModal
      isOpen={showPresetEditor}
      onClose={() => {
        setShowPresetEditor(false);
        setEditingPreset(null);
      }}
      editingPreset={editingPreset}
      onSave={savePreset}
    />
    
    {/* Presets Management Modal */}
    {showPresetsManagement && (
      <PresetsManagementModal
        AI_PROVIDERS={AI_PROVIDERS}
        customPresets={customPresets}
        builtInPresets={MODEL_PRESETS}
        defaultModels={defaultModels}
        onSaveCustomPresets={(presets) => {
          setCustomPresets(presets);
          localStorage.setItem('customPresets', JSON.stringify(presets));
        }}
        onSaveDefaultModels={(models) => {
          setDefaultModels(models);
          localStorage.setItem('defaultModels', JSON.stringify(models));
        }}
        onClose={() => setShowPresetsManagement(false)}
      />
    )}
    
    {/* Rename Chat Dialog */}
    <RenameChatDialog
      isOpen={showRenameDialog}
      currentTitle={conversationTitle}
      onClose={() => setShowRenameDialog(false)}
      onRename={handleRename}
    />
    
    {/* Analytics Panel */}
    <AnalyticsPanel
      isOpen={showAnalytics}
      onClose={() => setShowAnalytics(false)}
      messages={messages}
      conversationTitle={conversationTitle}
    />

    {/* Preset Selection Dialog */}
    <PresetSelectionDialog
      open={showPresetSelection}
      onOpenChange={setShowPresetSelection}
      customPresets={customPresets}
      quickPresets={quickPresets}
      onAdd={handleAddQuickPresets}
    />

    {/* Saved Conversations Modal */}
    <SavedConversationsModal
      isOpen={showSavedConversationsModal}
      onClose={() => setShowSavedConversationsModal(false)}
      savedConversations={savedConversations}
      archivedConversations={archivedConversations}
      onLoadConversation={loadConversation}
      onDeleteConversation={handleDeleteSavedConversation}
      onUpdateConversation={handleUpdateSavedConversation}
      onImport={handleImportConversations}
    />

    {/* Keyboard Shortcuts Help */}
    <KeyboardShortcutsHelp
      isOpen={showKeyboardHelp}
      onClose={() => setShowKeyboardHelp(false)}
    />
    </>
  );
}
