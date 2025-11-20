

import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import ModeSelector from "./Components/ModeSelector";
import InputBox from "./Components/InputBox";
import OutputBox from "./Components/OutputBox";
import HistorySidebar from "./Components/HistorySidebar";
import { useAIModel } from "./Hooks/useAIModel";

function App() {
  const [mode, setMode] = useState("Blog");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('light');

  const { generate } = useAIModel();

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(h);
    
    // System theme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const fullPrompt = `${mode}: ${input}`;
      const result = await generate(fullPrompt);

      setOutput(result);
      
      // Save to history
      const newHistory = [
        { 
          prompt: input, 
          output: result, 
          mode, 
          timestamp: new Date().toISOString(),
          id: Date.now()
        }, 
        ...history.slice(0, 49)
      ];
      setHistory(newHistory);
      setInput("")
      localStorage.setItem("history", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Generation error:", error);
      setOutput("Error generating content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  const loadHistoryItem = (item) => {
    setOutput(item.output);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Navbar */}
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isGenerating={isGenerating}
        onThemeToggle={toggleTheme}
        currentTheme={theme}
      />

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-80 lg:w-72 xl:w-80
        `}>
          <HistorySidebar 
            history={history} 
            setHistory={setHistory} 
            onSelectItem={loadHistoryItem}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="space-y-6 md:space-y-8">
            {/* Mode Selector */}
            <ModeSelector mode={mode} setMode={setMode} />
            
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-4 md:p-6 transition-all duration-200">
              <InputBox 
                input={input} 
                setInput={setInput} 
                handleGenerate={handleGenerate}
                isGenerating={isGenerating}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* Output Section */}
            {output && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-4 md:p-6 transition-all duration-200">
                <OutputBox output={output} />
              </div>
            )}

            {/* Quick Tips */}
            {!output && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="font-semibold text-blue-800 dark:text-blue-300 mb-1">💡 Pro Tip</div>
                  <div className="text-blue-700 dark:text-blue-400">Use Ctrl+Enter for quick generation</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="font-semibold text-green-800 dark:text-green-300 mb-1">📝 Examples</div>
                  <div className="text-green-700 dark:text-green-400">Try different content modes</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                  <div className="font-semibold text-purple-800 dark:text-purple-300 mb-1">⏱️ History</div>
                  <div className="text-purple-700 dark:text-purple-400">Access your previous generations</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;