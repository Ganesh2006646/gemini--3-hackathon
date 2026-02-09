import React, { useEffect } from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface Props {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<Props> = ({ message, onDismiss, onRetry }) => {
  // Auto-dismiss after 10 seconds if no retry button
  useEffect(() => {
    if (!onRetry) {
      const timer = setTimeout(onDismiss, 10000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss, onRetry]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-4 animate-fade-in">
      <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-4 rounded-xl shadow-xl flex items-start gap-3 backdrop-blur-sm bg-opacity-95">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div className="flex-grow">
          <h4 className="font-semibold text-sm text-red-800">Something went wrong</h4>
          <p className="text-sm mt-1 text-red-700 leading-relaxed">{message}</p>
          
          {onRetry && (
            <button 
              onClick={onRetry}
              className="mt-3 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Try Again
            </button>
          )}
        </div>
        <button 
          onClick={onDismiss} 
          className="text-red-400 hover:text-red-700 p-1 hover:bg-red-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};