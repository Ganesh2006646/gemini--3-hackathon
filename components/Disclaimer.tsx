import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-t border-amber-200 p-4 text-amber-900 text-sm flex items-center justify-center gap-2 text-center">
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span className="font-medium">
        This system provides informational guidance only and does not replace lawyers or courts.
      </span>
    </div>
  );
};