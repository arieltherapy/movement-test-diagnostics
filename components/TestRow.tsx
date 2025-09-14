
import React from 'react';
import type { MovementTest, TestState } from '../types';

interface TestRowProps {
  test: MovementTest;
  state: TestState;
  onStateChange: (id: number, newState: Partial<TestState>) => void;
}

const TestRow: React.FC<TestRowProps> = ({ test, state, onStateChange }) => {
  const handleCheckboxChange = (side: 'left' | 'right', checked: boolean) => {
    onStateChange(test.id, { [side]: checked });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStateChange(test.id, { notes: e.target.value });
  };

  return (
    <tr className="border-b border-slate-200 bg-white hover:bg-slate-50">
      <td className="p-3 align-top">
        <div className="font-semibold text-slate-800">{test.name}</div>
        <div className="text-sm text-slate-600">{test.description}</div>
        {test.rangeNote && <div className="text-xs text-slate-500 mt-1">{test.rangeNote}</div>}
      </td>
      <td className="p-3 align-top w-40">
        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
              checked={state.right}
              onChange={(e) => handleCheckboxChange('right', e.target.checked)}
            />
            <span className="text-slate-700">ימין</span>
          </label>
          <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
              checked={state.left}
              onChange={(e) => handleCheckboxChange('left', e.target.checked)}
            />
            <span className="text-slate-700">שמאל</span>
          </label>
        </div>
      </td>
      <td className="p-3 align-top">
        <textarea
          rows={2}
          className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          placeholder="הוסף מלל..."
          value={state.notes}
          onChange={handleNotesChange}
        ></textarea>
      </td>
    </tr>
  );
};

export default TestRow;
