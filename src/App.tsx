import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IdeaGenerator from './components/IdeaGenerator';
import ResearchPanel from './components/ResearchPanel';
import CodingPanel from './components/CodingPanel';
import './styles.css';

type TabType = 'ideas' | 'research' | 'coding';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('ideas');
  const [scanlineVisible, setScanlineVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanlineVisible(prev => !prev);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'ideas', label: 'IDEA_GEN', icon: '>' },
    { id: 'research', label: 'RESEARCH_API', icon: '$' },
    { id: 'coding', label: 'CODE_API', icon: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] overflow-hidden relative font-mono">
      {/* CRT Scanline Effect */}
      <div className="crt-overlay pointer-events-none fixed inset-0 z-50" />

      {/* Animated background grid */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#00ff41] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-[#00d4ff] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-[#00ff41]/30 px-4 md:px-8 py-4 md:py-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#00ff41] animate-pulse shadow-[0_0_10px_#00ff41]" />
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-wider">
                <span className="text-[#ffb700]">[</span>
                NEURAL
                <span className="text-[#00d4ff]">_</span>
                FORGE
                <span className="text-[#ffb700]">]</span>
              </h1>
            </div>
            <div className="text-xs md:text-sm text-[#00ff41]/60 font-mono">
              <span className="hidden md:inline">SYS.STATUS: </span>
              <span className="text-[#00ff41]">ONLINE</span>
              <span className="animate-blink ml-1">_</span>
            </div>
          </div>
        </motion.header>

        {/* Navigation Tabs */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-b border-[#00ff41]/20 px-4 md:px-8"
        >
          <div className="max-w-7xl mx-auto flex gap-1 md:gap-2 overflow-x-auto py-2 md:py-0 scrollbar-hide">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm tracking-wider transition-all duration-300
                  whitespace-nowrap min-w-fit
                  ${activeTab === tab.id
                    ? 'text-[#0a0a0a] bg-[#00ff41]'
                    : 'text-[#00ff41]/70 hover:text-[#00ff41] hover:bg-[#00ff41]/10'
                  }
                `}
              >
                <span className="font-bold mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#00ff41] -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'ideas' && (
                <motion.div
                  key="ideas"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <IdeaGenerator />
                </motion.div>
              )}
              {activeTab === 'research' && (
                <motion.div
                  key="research"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResearchPanel />
                </motion.div>
              )}
              {activeTab === 'coding' && (
                <motion.div
                  key="coding"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CodingPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#00ff41]/20 px-4 md:px-8 py-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[10px] md:text-xs text-[#00ff41]/40 tracking-wide">
              Requested by <span className="text-[#00ff41]/60">@stringer_kade</span> · Built by <span className="text-[#00ff41]/60">@clonkbot</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
