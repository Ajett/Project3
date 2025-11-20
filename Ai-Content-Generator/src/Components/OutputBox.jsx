
import { useState, useRef, useEffect } from "react";

export default function OutputBox({ output }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const contentRef = useRef(null);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-content-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Content',
          text: output,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const hasOverflow = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setShowScrollHint(hasOverflow && !isExpanded);
    }
  }, [output, isExpanded]);


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-1">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
            <h2 className="font-bold text-2xl lg:text-3xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Content Ready!
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your AI-generated content is ready to use
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={shareContent}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[120px] justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          <button
            onClick={downloadAsFile}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[120px] justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </button>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[140px] justify-center relative overflow-hidden"
          >
            {copied && (
              <div className="absolute inset-0 bg-white/20 animate-ping"></div>
            )}
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Box */}
      <div className="relative group">
        <div
          ref={contentRef}
          className={`
            bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
            rounded-2xl p-6 lg:p-8 border-2 border-gray-200/60 dark:border-gray-600/60 
            shadow-lg hover:shadow-xl transition-all duration-500
            ${isExpanded ? 'max-h-none' : 'max-h-96 lg:max-h-[500px]'}
            overflow-hidden relative
          `}
        >
          {/* Scroll Fade Effect */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-800/90 pointer-events-none"></div>
          )}
          
          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-100 leading-relaxed text-base lg:text-lg break-words word-wrap">
              {output}
            </pre>
          </div>

          {/* Scroll Hint */}
          {showScrollHint && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <span className="text-sm font-medium mb-1">Scroll for more</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        {contentRef.current && contentRef.current.scrollHeight > 400 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 z-10"
          >
            {isExpanded ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show Less
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Show More
              </div>
            )}
          </button>
        )}
      </div>

    

    
    </div>
  );
}
