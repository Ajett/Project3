
export default function ModeSelector({ mode, setMode }) {
  const modes = [
    { 
      id: "Blog", 
      icon: "📝",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      id: "Instagram", 
      icon: "📱",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      id: "YouTube", 
      icon: "🎥",
      gradient: "from-red-500 to-orange-500"
    },
    { 
      id: "Summary", 
      icon: "📊",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Choose Content Type
        </h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              mode === m.id 
                ? `border-transparent bg-gradient-to-r ${m.gradient} shadow-lg` 
                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">{m.icon}</span>
              <span className={`font-medium text-sm ${
                mode === m.id ? "text-white" : "text-gray-800 dark:text-white"
              }`}>
                {m.id}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}