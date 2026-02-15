import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeSnippet {
  id: number;
  language: string;
  title: string;
  code: string;
  description: string;
}

const codeTemplates: Record<string, CodeSnippet[]> = {
  'react': [
    {
      id: 1,
      language: 'tsx',
      title: 'Custom Hook: useLocalStorage',
      code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}`,
      description: 'A type-safe custom hook for persisting state to localStorage',
    },
    {
      id: 2,
      language: 'tsx',
      title: 'Debounced Search Component',
      code: `import { useState, useEffect, useCallback } from 'react';

function DebouncedSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((q: string) => onSearch(q), 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
      description: 'A search input component with built-in debouncing',
    },
  ],
  'python': [
    {
      id: 3,
      language: 'python',
      title: 'Async Data Fetcher',
      code: `import asyncio
import aiohttp
from typing import List, Dict, Any

async def fetch_all(urls: List[str]) -> List[Dict[str, Any]]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks)

async def fetch_one(session: aiohttp.ClientSession, url: str):
    async with session.get(url) as response:
        return await response.json()

# Usage: asyncio.run(fetch_all(['url1', 'url2']))`,
      description: 'Concurrent HTTP requests using asyncio and aiohttp',
    },
    {
      id: 4,
      language: 'python',
      title: 'Decorator: Retry with Backoff',
      code: `import functools
import time
from typing import Callable, TypeVar

T = TypeVar('T')

def retry(max_attempts: int = 3, backoff: float = 1.0):
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> T:
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(backoff * (2 ** attempt))
            raise RuntimeError("Unreachable")
        return wrapper
    return decorator`,
      description: 'A decorator for automatic retry with exponential backoff',
    },
  ],
  'api': [
    {
      id: 5,
      language: 'typescript',
      title: 'REST API Client Class',
      code: `class APIClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor(baseURL: string, apiKey?: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'Authorization': \`Bearer \${apiKey}\` }),
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      headers: this.headers,
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }
}`,
      description: 'A reusable typed API client for REST endpoints',
    },
    {
      id: 6,
      language: 'typescript',
      title: 'Rate Limiter Utility',
      code: `class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second

  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens < 1) {
      const waitTime = (1 / this.refillRate) * 1000;
      await new Promise(r => setTimeout(r, waitTime));
      return this.acquire();
    }
    this.tokens--;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens,
      this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}`,
      description: 'Token bucket rate limiter for API calls',
    },
  ],
};

const languageOptions = [
  { id: 'react', label: 'REACT/TS', icon: '<>' },
  { id: 'python', label: 'PYTHON', icon: '#!' },
  { id: 'api', label: 'API_UTILS', icon: '{}' },
];

export default function CodingPanel() {
  const [selectedLanguage, setSelectedLanguage] = useState('react');
  const [generatedCode, setGeneratedCode] = useState<CodeSnippet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generateCode = () => {
    setIsGenerating(true);
    setGeneratedCode(null);

    setTimeout(() => {
      const templates = codeTemplates[selectedLanguage];
      const randomCode = templates[Math.floor(Math.random() * templates.length)];
      setGeneratedCode(randomCode);
      setIsGenerating(false);
    }, 1000 + Math.random() * 500);
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <div className="w-2 h-8 bg-[#00d4ff]" />
        <h2 className="text-lg md:text-xl font-display tracking-wider text-[#00d4ff]">
          CODE_API<span className="text-[#00d4ff]/60">.generate</span>
        </h2>
      </motion.div>

      {/* Language Selection */}
      <div className="terminal-card p-4 md:p-6 border-[#00d4ff]/30 space-y-4">
        <label className="text-xs text-[#00d4ff]/60 tracking-wider">
          SELECT_LANGUAGE:
        </label>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`
                px-4 py-3 text-xs tracking-wider transition-all duration-200 min-h-[48px]
                ${selectedLanguage === lang.id
                  ? 'bg-[#00d4ff] text-[#0a0a0a] glow-cyan'
                  : 'border border-[#00d4ff]/30 text-[#00d4ff]/70 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10'
                }
              `}
            >
              <span className="mr-2">{lang.icon}</span>
              {lang.label}
            </button>
          ))}
        </div>

        {/* Custom Context */}
        <div className="space-y-3 pt-2">
          <label className="text-xs text-[#00d4ff]/60 tracking-wider">
            CONTEXT <span className="text-[#ffb700]">(optional)</span>:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00d4ff]">
              {'#'}
            </span>
            <input
              type="text"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Describe what you want to build..."
              className="w-full bg-[#0a0a0a] border border-[#00d4ff]/30 px-8 py-3 text-sm
                placeholder-[#00d4ff]/30 focus:outline-none focus:border-[#00d4ff]
                focus:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all text-[#00d4ff]"
            />
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={generateCode}
          disabled={isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full py-4 text-sm md:text-base font-bold tracking-wider transition-all duration-300 min-h-[52px]
            ${isGenerating
              ? 'bg-[#00d4ff]/20 text-[#00d4ff]/50 cursor-wait'
              : 'bg-[#00d4ff] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">{'/'}</span>
              GENERATING...
            </span>
          ) : (
            <span>{'<'} GENERATE_CODE {'>'}</span>
          )}
        </motion.button>
      </div>

      {/* Code Output */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="terminal-card p-6 border-[#00d4ff]/30"
          >
            <div className="flex items-center gap-3 text-[#00d4ff]/60">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#00d4ff] animate-pulse" />
                <span className="w-2 h-2 bg-[#00d4ff] animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-[#00d4ff] animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-sm">Compiling code snippet...</span>
            </div>
          </motion.div>
        )}

        {!isGenerating && generatedCode && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="terminal-card border-[#00d4ff]/30 overflow-hidden"
          >
            {/* Code Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#00d4ff]/20 bg-[#00d4ff]/5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 bg-[#00d4ff]/20 text-[#00d4ff]">
                    {generatedCode.language.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#00d4ff]">
                  {generatedCode.title}
                </h4>
                <p className="text-xs text-[#00d4ff]/50 mt-1">
                  {generatedCode.description}
                </p>
              </div>
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 text-xs tracking-wider transition-all min-h-[44px] self-start sm:self-auto
                  ${copied
                    ? 'bg-[#00ff41] text-[#0a0a0a]'
                    : 'border border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10'
                  }
                `}
              >
                {copied ? '[COPIED!]' : '[COPY]'}
              </motion.button>
            </div>

            {/* Code Block */}
            <div className="p-4 overflow-x-auto">
              <pre className="text-xs md:text-sm leading-relaxed text-[#00d4ff]/90">
                <code>{generatedCode.code}</code>
              </pre>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 p-4 border-t border-[#00d4ff]/20 bg-[#00d4ff]/5">
              <button className="px-3 py-2 text-xs border border-[#00d4ff]/30 text-[#00d4ff]/70 hover:bg-[#00d4ff]/10 transition-colors min-h-[44px]">
                [EXPLAIN]
              </button>
              <button className="px-3 py-2 text-xs border border-[#00d4ff]/30 text-[#00d4ff]/70 hover:bg-[#00d4ff]/10 transition-colors min-h-[44px]">
                [MODIFY]
              </button>
              <button className="px-3 py-2 text-xs border border-[#00d4ff]/30 text-[#00d4ff]/70 hover:bg-[#00d4ff]/10 transition-colors min-h-[44px]">
                [TESTS]
              </button>
              <button
                onClick={generateCode}
                className="px-3 py-2 text-xs border border-[#00d4ff]/30 text-[#00d4ff]/70 hover:bg-[#00d4ff]/10 transition-colors min-h-[44px]"
              >
                [REGENERATE]
              </button>
            </div>
          </motion.div>
        )}

        {!isGenerating && !generatedCode && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="terminal-card p-6 md:p-8 text-center border-[#00d4ff]/30"
          >
            <p className="text-[#00d4ff]/40 text-sm">
              {'#'} Select a language and generate code
              <span className="animate-blink">_</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Reference */}
      <div className="terminal-card p-4 md:p-6 border-[#00d4ff]/30">
        <h4 className="text-xs text-[#00d4ff]/60 tracking-wider mb-4">
          AVAILABLE_TEMPLATES:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(codeTemplates).map(([lang, templates]) => (
            <div key={lang} className="space-y-2">
              <span className="text-[10px] text-[#00d4ff]/50 uppercase">
                {lang}:
              </span>
              {templates.map(t => (
                <div
                  key={t.id}
                  className="text-xs text-[#00d4ff]/70 pl-2 border-l border-[#00d4ff]/20"
                >
                  {t.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
