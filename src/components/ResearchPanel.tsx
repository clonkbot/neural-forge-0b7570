import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchResult {
  id: number;
  title: string;
  summary: string;
  source: string;
  relevance: number;
  category: string;
}

const mockResearchResults: ResearchResult[] = [
  {
    id: 1,
    title: 'Neural Networks and Creative Problem Solving',
    summary: 'Recent studies show that neural networks can assist in generating novel solutions by identifying patterns in large datasets that humans might overlook.',
    source: 'AI Research Journal',
    relevance: 95,
    category: 'AI/ML',
  },
  {
    id: 2,
    title: 'Market Trends in Sustainable Technology',
    summary: 'The sustainable tech market is projected to grow by 25% annually, with particular demand in energy storage and green computing solutions.',
    source: 'Tech Market Analysis',
    relevance: 87,
    category: 'MARKET',
  },
  {
    id: 3,
    title: 'User Experience in Idea Generation Tools',
    summary: 'Research indicates that tools with gamification elements increase user engagement and the quality of generated ideas by up to 40%.',
    source: 'UX Research Quarterly',
    relevance: 82,
    category: 'UX',
  },
  {
    id: 4,
    title: 'Collaborative Innovation Frameworks',
    summary: 'Open innovation frameworks that combine internal R&D with external idea sourcing show 3x higher success rates for breakthrough innovations.',
    source: 'Innovation Management',
    relevance: 79,
    category: 'STRATEGY',
  },
  {
    id: 5,
    title: 'Patent Landscape Analysis: AI-Generated Content',
    summary: 'The patent landscape for AI-generated content tools shows rapid growth, with 500+ patents filed in the last quarter alone.',
    source: 'Patent Analytics DB',
    relevance: 74,
    category: 'LEGAL',
  },
];

const apiEndpoints = [
  { id: 'semantic', name: 'SEMANTIC_SCHOLAR', status: 'online' },
  { id: 'arxiv', name: 'ARXIV_API', status: 'online' },
  { id: 'patents', name: 'PATENTS_DB', status: 'online' },
  { id: 'markets', name: 'MARKET_DATA', status: 'degraded' },
];

export default function ResearchPanel() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  const performSearch = () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);

    // Simulate API call with staggered results
    setTimeout(() => {
      const shuffled = [...mockResearchResults]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 + Math.floor(Math.random() * 3));

      setResults(shuffled);
      setIsSearching(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
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
        <div className="w-2 h-8 bg-[#ffb700]" />
        <h2 className="text-lg md:text-xl font-display tracking-wider">
          RESEARCH_API<span className="text-[#ffb700]">.connect</span>
        </h2>
      </motion.div>

      {/* API Status Panel */}
      <div className="terminal-card p-4 md:p-6 border-[#ffb700]/30">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-[#ffb700]/60 tracking-wider">
            API_ENDPOINTS:
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {apiEndpoints.map(endpoint => (
            <div
              key={endpoint.id}
              className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#ffb700]/20"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  endpoint.status === 'online'
                    ? 'bg-[#00ff41] shadow-[0_0_6px_#00ff41]'
                    : 'bg-[#ffb700] shadow-[0_0_6px_#ffb700] animate-pulse'
                }`}
              />
              <span className="text-[10px] md:text-xs text-[#ffb700]/70 truncate">
                {endpoint.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="terminal-card p-4 md:p-6 border-[#ffb700]/30 space-y-4">
        <label className="text-xs text-[#ffb700]/60 tracking-wider">
          QUERY_INPUT:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ffb700]">
              {'$'}
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter research topic or keyword..."
              className="w-full bg-[#0a0a0a] border border-[#ffb700]/30 px-8 py-3 text-sm
                placeholder-[#ffb700]/30 focus:outline-none focus:border-[#ffb700]
                focus:shadow-[0_0_20px_rgba(255,183,0,0.2)] transition-all text-[#ffb700]"
            />
          </div>
          <motion.button
            onClick={performSearch}
            disabled={isSearching || !query.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-6 py-3 text-sm font-bold tracking-wider transition-all duration-300 min-h-[48px]
              ${isSearching || !query.trim()
                ? 'bg-[#ffb700]/20 text-[#ffb700]/50 cursor-not-allowed'
                : 'bg-[#ffb700] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(255,183,0,0.5)]'
              }
            `}
          >
            {isSearching ? 'QUERYING...' : 'SEARCH'}
          </motion.button>
        </div>

        {/* Search Progress */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-xs text-[#ffb700]/60">
              <span className="animate-spin">{'/'}</span>
              <span>Querying research databases...</span>
            </div>
            <div className="h-1 bg-[#ffb700]/20 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-full w-1/3 bg-[#ffb700]"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs text-[#ffb700]/60 tracking-wider">
                RESULTS_FOUND: {results.length}
              </h3>
              <span className="text-xs text-[#ffb700]/40">
                Sorted by relevance
              </span>
            </div>

            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="terminal-card border-[#ffb700]/30 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedResult(
                        expandedResult === result.id ? null : result.id
                      )
                    }
                    className="w-full p-4 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] px-2 py-0.5 bg-[#ffb700]/10 text-[#ffb700]/70">
                            {result.category}
                          </span>
                          <span className="text-[10px] text-[#00ff41]">
                            {result.relevance}% match
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#ffb700] mb-1">
                          {result.title}
                        </h4>
                        <p className="text-xs text-[#ffb700]/40">
                          Source: {result.source}
                        </p>
                      </div>
                      <span className="text-[#ffb700]/40 text-lg sm:text-xl transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center">
                        {expandedResult === result.id ? '[-]' : '[+]'}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedResult === result.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#ffb700]/20"
                      >
                        <div className="p-4 bg-[#ffb700]/5">
                          <p className="text-sm text-[#ffb700]/80 leading-relaxed">
                            {result.summary}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button className="px-3 py-2 text-xs border border-[#ffb700]/30 hover:bg-[#ffb700]/10 transition-colors min-h-[44px]">
                              [CITE]
                            </button>
                            <button className="px-3 py-2 text-xs border border-[#ffb700]/30 hover:bg-[#ffb700]/10 transition-colors min-h-[44px]">
                              [EXPORT]
                            </button>
                            <button className="px-3 py-2 text-xs border border-[#ffb700]/30 hover:bg-[#ffb700]/10 transition-colors min-h-[44px]">
                              [RELATED]
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isSearching && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="terminal-card p-6 md:p-8 text-center border-[#ffb700]/30"
        >
          <p className="text-[#ffb700]/40 text-sm">
            {'$'} Enter a query to search research databases
            <span className="animate-blink">_</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
