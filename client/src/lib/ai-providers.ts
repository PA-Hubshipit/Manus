// Providers are companies that create model families
export const AI_PROVIDERS = {
  anthropic: {
    name: 'Anthropic',
    models: ['Claude 3 Haiku', 'Claude 3 Sonnet', 'Claude 3 Opus'],
    color: 'bg-orange-500',
    strengths: ['reasoning', 'ethics', 'long-form']
  },
  openai: {
    name: 'OpenAI',
    models: ['GPT-4', 'GPT-4 Turbo', 'GPT-3.5 Turbo'],
    color: 'bg-green-500',
    strengths: ['creative', 'code', 'general']
  },
  google: {
    name: 'Google',
    models: ['Gemini Nano', 'Gemini Pro', 'Gemini Ultra', 'Gemma', 'PaLM 2'],
    color: 'bg-blue-500',
    strengths: ['multimodal', 'search', 'analysis']
  },
  meta: {
    name: 'Meta',
    models: ['Llama 2', 'Llama 3', 'Code Llama', 'Llama Guard'],
    color: 'bg-blue-600',
    strengths: ['open-source', 'coding', 'general']
  },
  mistral: {
    name: 'Mistral AI',
    models: ['Mistral 7B', 'Mixtral 8x7B', 'Mixtral 8x22B', 'Codestral'],
    color: 'bg-orange-600',
    strengths: ['efficient', 'coding', 'multilingual']
  },
  microsoft: {
    name: 'Microsoft',
    models: ['Phi-2', 'Phi-3 Mini', 'Phi-3 Small', 'Phi-3 Medium'],
    color: 'bg-blue-400',
    strengths: ['efficient', 'reasoning', 'coding']
  },
  qwen: {
    name: 'Alibaba / Qwen',
    models: ['Qwen 1.8B', 'Qwen 7B', 'Qwen 14B', 'Qwen 72B', 'Qwen1.5', 'Qwen2', 'Code Qwen'],
    color: 'bg-red-500',
    strengths: ['multilingual', 'coding', 'general']
  },
  xai: {
    name: 'xAI',
    models: ['Grok', 'Grok-1.5'],
    color: 'bg-yellow-500',
    strengths: ['reasoning', 'general', 'real-time']
  },
  cohere: {
    name: 'Cohere',
    models: ['Command', 'Command-R', 'Command-R+', 'Embed', 'Rerank'],
    color: 'bg-teal-500',
    strengths: ['enterprise', 'embeddings', 'reranking']
  },
  butterfly: {
    name: 'Butterfly Effect Technology',
    models: ['Manus'],
    color: 'bg-pink-500',
    strengths: ['general', 'creative']
  },
  moonshot: {
    name: 'Moonshot AI',
    models: ['Kimi'],
    color: 'bg-cyan-500',
    strengths: ['conversation', 'general']
  },
  palantir: {
    name: 'Palantir',
    models: ['API', 'Gotham', 'Foundry', 'Apollo'],
    color: 'bg-slate-700',
    strengths: ['data-integration', 'analytics', 'enterprise']
  },
  perplexity: {
    name: 'Perplexity',
    models: ['Perplexity Pro', 'Perplexity Standard'],
    color: 'bg-indigo-500',
    strengths: ['research', 'citations', 'facts']
  },
  deepseek: {
    name: 'DeepSeek',
    models: ['DeepSeek V3', 'DeepSeek Coder', 'DeepSeek Chat'],
    color: 'bg-purple-500',
    strengths: ['technical', 'coding', 'math']
  }
};

export const MODEL_PRESETS = {
  'coding': {
    name: 'Coding Team',
    models: ['openai:GPT-4', 'deepseek:DeepSeek Coder', 'mistral:Codestral']
  },
  'creative': {
    name: 'Creative Writers',
    models: ['openai:GPT-4 Turbo', 'anthropic:Claude 3 Opus', 'butterfly:Manus']
  },
  'research': {
    name: 'Research Squad',
    models: ['perplexity:Perplexity Pro', 'google:Gemini Pro', 'anthropic:Claude 3 Sonnet']
  },
  'general': {
    name: 'General Purpose',
    models: ['openai:GPT-4', 'anthropic:Claude 3 Sonnet', 'google:Gemini Pro']
  },
  'fast': {
    name: 'Fast Responders',
    models: ['openai:GPT-3.5 Turbo', 'anthropic:Claude 3 Haiku', 'google:Gemini Nano']
  }
};

export type AIProvider = keyof typeof AI_PROVIDERS;
export type ModelPreset = keyof typeof MODEL_PRESETS;
