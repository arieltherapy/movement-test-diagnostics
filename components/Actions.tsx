
import React from 'react';

interface ActionsProps {
  onExecute: () => void;
  onReset: () => void;
  showSuccess: boolean;
}

const Actions: React.FC<ActionsProps> = ({ onExecute, onReset, showSuccess }) => {
  return (
    <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onExecute}
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
        >
          ביצוע והעתקה
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-slate-500 text-white font-semibold rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition duration-150"
        >
          איפוס
        </button>
      </div>
      {showSuccess && (
        <div className="text-green-600 font-semibold bg-green-100 px-4 py-2 rounded-md transition-opacity duration-300">
          הדוח הועתק בהצלחה!
        </div>
      )}
    </footer>
  );
};

export default Actions;
