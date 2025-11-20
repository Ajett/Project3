

export default function InputBox({ input, setInput, handleGenerate, isGenerating, onKeyPress }) {
  const charCount = input.length;
  const maxChars = 2000;
  const isNearLimit = charCount > maxChars * 0.8;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-lg font-semibold text-gray-800 dark:text-white">
          Your Prompt
        </label>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <kbd className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 font-medium shadow-sm">
            Ctrl + Enter
          </kbd>
          <span>to generate</span>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          className="w-full border border-gray-300/50 dark:border-gray-600/50 p-6 rounded-2xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white shadow-inner"
          rows="2"
          placeholder="Describe what you want to create... (e.g., Write a blog post about the future of artificial intelligence in healthcare)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyPress}
          disabled={isGenerating}
          maxLength={maxChars}
        />
        
        {/* Character counter */}
        <div className={`absolute bottom-4 right-4 text-sm font-medium ${
          isNearLimit ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {charCount}/{maxChars}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!input.trim() || isGenerating || charCount > maxChars}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md group"
      >
        {isGenerating ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse">Generating Magic...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Content
          </div>
        )}
      </button>
    </div>
  );
}