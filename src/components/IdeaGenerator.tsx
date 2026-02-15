import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ideaCategories = [
  { id: 'tech', label: 'TECHNOLOGY', icon: '>' },
  { id: 'business', label: 'BUSINESS', icon: '$' },
  { id: 'creative', label: 'CREATIVE', icon: '*' },
  { id: 'science', label: 'SCIENCE', icon: '%' },
  { id: 'social', label: 'SOCIAL', icon: '@' },
];

const ideaTemplates: Record<string, string[]> = {
  tech: [
    'An AI-powered tool that automatically generates documentation from code comments',
    'A browser extension that summarizes any webpage into key bullet points',
    'A smart home system that learns your habits and optimizes energy usage',
    'A decentralized file storage network using blockchain technology',
    'An AR app that overlays repair instructions on broken appliances',
    'A machine learning model that predicts software bugs before deployment',
    'A voice-controlled coding assistant for hands-free development',
    'A quantum computing simulator for educational purposes',
  ],
  business: [
    'A subscription service for personalized vitamin packs based on DNA analysis',
    'An AI matchmaker for co-founders seeking business partners',
    'A platform connecting retired experts with startups needing mentorship',
    'A marketplace for renting out unused computing power',
    'A reverse auction platform where businesses bid for customer attention',
    'An automated bookkeeping service using receipt scanning and AI',
    'A B2B bartering platform for exchanging services without currency',
    'A fractional ownership platform for commercial real estate',
  ],
  creative: [
    'A collaborative music composition app where users build songs together',
    'An AI that generates unique fonts based on your handwriting',
    'A virtual reality museum where anyone can exhibit their art',
    'A procedural poetry generator that creates verses from daily news',
    'An app that transforms voice memos into illustrated storybooks',
    'A platform for commissioning custom soundtracks for your life events',
    'A tool that generates color palettes from any piece of music',
    'An AI filmmaker that creates short films from text descriptions',
  ],
  science: [
    'A citizen science app for cataloging local biodiversity through photos',
    'A simulation platform for testing theoretical physics experiments',
    'An AI assistant for analyzing astronomical data from amateur telescopes',
    'A molecular modeling tool for high school chemistry education',
    'A crowdsourced climate monitoring network using smartphone sensors',
    'A genetic ancestry visualization tool using 3D family trees',
    'An ocean exploration simulator based on real oceanographic data',
    'A neural network that predicts protein folding structures',
  ],
  social: [
    'A platform connecting neighbors to share tools and equipment',
    'An app that organizes local skill-sharing workshops',
    'A service matching volunteers with elderly residents needing assistance',
    'A community garden management platform with plot allocation',
    'A local event discovery app based on your interests and schedule',
    'A carpooling network specifically for parents doing school runs',
    'A platform for organizing neighborhood watch programs',
    'An app connecting pet owners for mutual pet-sitting arrangements',
  ],
};

interface GeneratedIdea {
  id: number;
  text: string;
  category: string;
  timestamp: Date;
  saved: boolean;
}

export default function IdeaGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('tech');
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generateIdea = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const categoryIdeas = ideaTemplates[selectedCategory];
      const randomIdea = categoryIdeas[Math.floor(Math.random() * categoryIdeas.length)];

      const newIdea: GeneratedIdea = {
        id: Date.now(),
        text: customPrompt
          ? `${randomIdea} — customized for: "${customPrompt}"`
          : randomIdea,
        category: selectedCategory,
        timestamp: new Date(),
        saved: false,
      };

      setIdeas(prev => [newIdea, ...prev]);
      setIsGenerating(false);
    }, 800 + Math.random() * 700);
  };

  const toggleSaved = (id: number) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, saved: !idea.saved } : idea
      )
    );
  };

  const deleteIdea = (id: number) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <div className="w-2 h-8 bg-[#00ff41]" />
        <h2 className="text-lg md:text-xl font-display tracking-wider">
          IDEA_GENERATOR<span className="text-[#ffb700]">.exe</span>
        </h2>
      </motion.div>

      {/* Controls Panel */}
      <div className="terminal-card p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-xs text-[#00ff41]/60 tracking-wider">
            SELECT_CATEGORY:
          </label>
          <div className="flex flex-wrap gap-2">
            {ideaCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3 md:px-4 py-2 text-xs tracking-wider transition-all duration-200
                  ${selectedCategory === cat.id
                    ? 'bg-[#00ff41] text-[#0a0a0a] glow-green'
                    : 'border border-[#00ff41]/30 hover:border-[#00ff41] hover:bg-[#00ff41]/10'
                  }
                `}
              >
                <span className="mr-1 md:mr-2">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.slice(0, 4)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="space-y-3">
          <label className="text-xs text-[#00ff41]/60 tracking-wider">
            CUSTOM_CONTEXT <span className="text-[#ffb700]">(optional)</span>:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ffb700]">
              {'>'}
            </span>
            <input
              type="text"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Add context to refine your idea..."
              className="w-full bg-[#0a0a0a] border border-[#00ff41]/30 px-8 py-3 text-sm
                placeholder-[#00ff41]/30 focus:outline-none focus:border-[#00ff41]
                focus:shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all"
            />
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={generateIdea}
          disabled={isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full py-4 text-sm md:text-base font-bold tracking-wider transition-all duration-300 relative overflow-hidden
            ${isGenerating
              ? 'bg-[#00ff41]/20 text-[#00ff41]/50 cursor-wait'
              : 'bg-[#00ff41] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)]'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">{'/'}</span>
              PROCESSING...
            </span>
          ) : (
            <span>{'>>>'} GENERATE_IDEA {'<<<'}</span>
          )}
        </motion.button>
      </div>

      {/* Generated Ideas List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs text-[#00ff41]/60 tracking-wider">
            OUTPUT_LOG [{ideas.length} entries]
          </h3>
          {ideas.length > 0 && (
            <button
              onClick={() => setIdeas([])}
              className="text-xs text-[#ff4141]/60 hover:text-[#ff4141] transition-colors"
            >
              [CLEAR_ALL]
            </button>
          )}
        </div>

        <AnimatePresence>
          {ideas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="terminal-card p-6 md:p-8 text-center"
            >
              <p className="text-[#00ff41]/40 text-sm">
                {'>'} Awaiting input...
                <span className="animate-blink">_</span>
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {ideas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    terminal-card p-4 group
                    ${idea.saved ? 'border-[#ffb700]/50' : ''}
                  `}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 bg-[#00ff41]/10 text-[#00ff41]/70">
                          {idea.category.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[#00ff41]/40">
                          {idea.timestamp.toLocaleTimeString()}
                        </span>
                        {idea.saved && (
                          <span className="text-[10px] text-[#ffb700]">
                            [SAVED]
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{idea.text}</p>
                    </div>
                    <div className="flex sm:flex-col gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleSaved(idea.id)}
                        className={`
                          p-2 text-xs transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center
                          ${idea.saved
                            ? 'text-[#ffb700] hover:text-[#ffb700]/70'
                            : 'text-[#00ff41]/40 hover:text-[#ffb700]'
                          }
                        `}
                        title={idea.saved ? 'Unsave' : 'Save'}
                      >
                        {idea.saved ? '[*]' : '[o]'}
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-2 text-xs text-[#00ff41]/40 hover:text-[#ff4141] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Delete"
                      >
                        [x]
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
