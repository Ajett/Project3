

export default function HistorySidebar({ history, setHistory, setOutput, onClose }) {
  const deleteOne = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem("history");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const models = {
    "deepseek-chat": "🤖",
    "deepseek-coder": "💻",
    "deepseek-math": "🔢", 
    "deepseek-creative": "🎨"
  };

  // Safe function to get model display name
  const getModelDisplayName = (model) => {
    if (!model) return "Chat"; // Default for old history items
    
    const modelName = model.replace('deepseek-', '');
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  };

  // Safe function to get model icon
  const getModelIcon = (model) => {
    return models[model] || "🤖"; // Default icon
  };

  // Group history by date
  const groupedHistory = history.reduce((groups, item) => {
    const date = new Date(item.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-700 h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Chat History
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            disabled={history.length === 0}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-center">No conversation history</p>
            <p className="text-sm text-center mt-2">Your chat history will appear here</p>
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date}>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 sticky top-0 bg-white dark:bg-gray-900 z-10">
                  {formatDate(items[0].timestamp)}
                </div>
                <div className="space-y-2">
                  {items.map((item, index) => {
                    // Find the actual index in the original history array
                    const actualIndex = history.findIndex(h => h.timestamp === item.timestamp);
                    
                    return (
                      <div
                        key={index}
                        className="group relative p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border dark:border-gray-700 transition-all duration-200"
                        onClick={() => setOutput(item.output)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getModelIcon(item.model)}</span>
                            <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              {getModelDisplayName(item.model)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {item.prompt}
                        </p>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {item.output}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOne(actualIndex);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-700 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}