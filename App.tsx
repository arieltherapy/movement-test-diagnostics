
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import TestRow from './components/TestRow';
import Actions from './components/Actions';
import { movementTests } from './constants/movementTests';
import { TestState } from './types';
import type { MovementTest } from './types';


const App: React.FC = () => {
  const getInitialState = (): TestState[] =>
    movementTests.map(test => ({
      id: test.id,
      left: false,
      right: false,
      notes: '',
    }));

  const [testStates, setTestStates] = useState<TestState[]>(getInitialState);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleStateChange = useCallback((id: number, newState: Partial<TestState>) => {
    setTestStates(prevStates =>
      prevStates.map(state =>
        state.id === id ? { ...state, ...newState } : state
      )
    );
  }, []);

  const handleExecute = useCallback(() => {
    const results: string[] = [];
    testStates.forEach(state => {
      if (state.left || state.right) {
        const testData = movementTests.find(t => t.id === state.id) as MovementTest;
        let sideText = '';
        if (state.right && state.left) {
          sideText = 'ימין ושמאל';
        } else if (state.right) {
          sideText = 'ימין';
        } else {
          sideText = 'שמאל';
        }

        let resultLine = `${testData.name} - ${testData.oppositeAction} - ${sideText}`;
        if (state.notes.trim()) {
          resultLine += ` - ${state.notes.trim()}`;
        }
        results.push(resultLine);
      }
    });

    if (results.length > 0) {
      const output = results.join('\n');
      navigator.clipboard.writeText(output).then(() => {
        setShowSuccess(true);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('ההעתקה נכשלה');
      });
    } else {
      alert('לא נבחרו בדיקות לביצוע.');
    }
  }, [testStates]);

  const handleReset = useCallback(() => {
    setTestStates(getInitialState());
    setShowSuccess(false);
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow overflow-y-auto">
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead className="sticky top-[76px] z-10">
              <tr className="bg-slate-200 text-slate-600 text-sm font-medium">
                <th className="p-3 text-right">בדיקה</th>
                <th className="p-3 text-right w-40">צד</th>
                <th className="p-3 text-right">מלל</th>
              </tr>
            </thead>
            <tbody>
              {movementTests.map((test, index) => (
                <TestRow
                  key={test.id}
                  test={test}
                  state={testStates[index]}
                  onStateChange={handleStateChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Actions onExecute={handleExecute} onReset={handleReset} showSuccess={showSuccess} />
    </div>
  );
};

export default App;
