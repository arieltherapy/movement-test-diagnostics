
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import TestRow from './components/TestRow';
import Actions from './components/Actions';
import { movementTests } from './constants/movementTests';
import { muscleData } from './constants/muscleData';
import { oppositeActionMap } from './constants/oppositeActionMap';
import { TestState } from './types';
import type { MovementTest } from './types';

const orderedGroups = [
  { category: 'ראש', ids: [1, 2, 3, 4, 5, 6] },
  { category: 'שכמה וכתף', ids: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { category: 'עמוד שדרה', ids: [36, 37, 38] },
  { category: 'שורש כף היד', ids: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34] },
  { category: 'מרפק - אמה', ids: [19, 20, 21, 22] },
  { category: 'אגן', ids: [35] },
  { category: 'ירך', ids: [39, 40, 41, 42, 43, 44, 45] },
  { category: 'ברך', ids: [46, 47, 48] },
  { category: 'קרסול ובוהן', ids: [49, 50, 51, 52, 53, 54] },
];

const App: React.FC = () => {
  const getInitialState = (): TestState[] =>
    movementTests.map(test => ({
      id: test.id,
      left: false,
      right: false,
      notes: '',
    }));

  const [testStates, setTestStates] = useState<TestState[]>(getInitialState);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleStateChange = useCallback((id: number, newState: Partial<TestState>) => {
    setTestStates(prevStates =>
      prevStates.map(state =>
        state.id === id ? { ...state, ...newState } : state
      )
    );
  }, []);

  const handleExecute = useCallback(() => {
    const results: string[] = [];
    const selectedTestStates = testStates.filter(state => state.left || state.right);

    if (selectedTestStates.length === 0) {
      alert('לא נבחרו בדיקות לביצוע.');
      return;
    }

    selectedTestStates.forEach(state => {
      const testData = movementTests.find(t => t.id === state.id);
      if (!testData) return;

      let singleTestResult = '';

      // Part 1: The selected test info
      let sideText = '';
      if (state.right && state.left) sideText = 'ימין ושמאל';
      else if (state.right) sideText = 'ימין';
      else sideText = 'שמאל';

      singleTestResult += `הבדיקה היא - ${testData.name} ${testData.description}\n`;
      if (state.notes.trim()) {
        singleTestResult += `צד ${sideText}: ${state.notes.trim()}\n`;
      } else {
        singleTestResult += `צד: ${sideText}\n`;
      }
      singleTestResult += '\n';

      // Part 2: The opposite action info and muscles
      const oppositeTestNames = oppositeActionMap[testData.oppositeAction];
      if (oppositeTestNames && oppositeTestNames.length > 0) {
        const allOppositeMuscles = new Set<string>();
        const oppositeActionInfo: string[] = [];

        oppositeTestNames.forEach(testName => {
          const muscleEntries = muscleData.filter(
            (data) => data['שם הבדיקה בלועזית'] === testName
          );

          if (muscleEntries.length > 0) {
            const description = muscleEntries[0]['הפעולה בעיברית'] || '';
            oppositeActionInfo.push(`${testName} ${description}`);
            
            muscleEntries.forEach(entry => {
              if (entry['רשימת שרירים']) {
                entry['רשימת שרירים'].split('\n').forEach(muscle => {
                  const trimmedMuscle = muscle.trim();
                  if (trimmedMuscle) {
                    allOppositeMuscles.add(trimmedMuscle);
                  }
                });
              }
            });
          }
        });

        if (oppositeActionInfo.length > 0) {
            singleTestResult += `הפעולה ההופכית היא ${oppositeActionInfo.join(', ')}\n`;
        }

        if (allOppositeMuscles.size > 0) {
          const sortedMuscles = Array.from(allOppositeMuscles).sort((a, b) => a.localeCompare(b, 'he'));
          singleTestResult += sortedMuscles.join('\n');
        } else {
            singleTestResult += 'לא נמצאו שרירים לפעולה הנגדית.';
        }

      } else {
         singleTestResult += 'לא נמצאה פעולה נגדית מוגדרת.';
      }

      results.push(singleTestResult);
    });

    if (results.length > 0) {
      const output = results.join('\n---\n\n');
      navigator.clipboard.writeText(output).then(() => {
        setSuccessMessage('הדוח המפורט הועתק בהצלחה!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('ההעתקה נכשלה');
      });
    }
}, [testStates]);

  const handleOppositeAction = useCallback(() => {
    const selectedTests = testStates
      .map((state, index) => ({ state, test: movementTests[index] }))
      .filter(({ state }) => state.left || state.right);

    if (selectedTests.length === 0) {
      alert('לא נבחרו בדיקות לביצוע.');
      return;
    }

    const allMuscles = new Set<string>();

    selectedTests.forEach(({ test }) => {
      const oppositeTestNames = oppositeActionMap[test.oppositeAction];
      if (oppositeTestNames) {
        oppositeTestNames.forEach(testName => {
          const muscleEntries = muscleData.filter(
            (data) => data['שם הבדיקה בלועזית'] === testName
          );

          muscleEntries.forEach(entry => {
            if (entry['רשימת שרירים']) {
              const muscles = entry['רשימת שרירים'].split('\n');
              muscles.forEach(muscle => {
                const trimmedMuscle = muscle.trim();
                if (trimmedMuscle) {
                  allMuscles.add(trimmedMuscle);
                }
              });
            }
          });
        });
      }
    });

    if (allMuscles.size > 0) {
      const sortedMuscles = Array.from(allMuscles).sort((a, b) => a.localeCompare(b, 'he'));
      const output = sortedMuscles.join('\n');
      navigator.clipboard.writeText(output).then(() => {
        setSuccessMessage('רשימת השרירים הועתקה!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('ההעתקה נכשלה');
      });
    } else {
      alert('לא נמצאו שרירים לפעולות הנגדיות של הבדיקות שנבחרו.');
    }
  }, [testStates]);


  const handleReset = useCallback(() => {
    setTestStates(getInitialState());
    setSuccessMessage('');
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
              {orderedGroups.map((group) => (
                <React.Fragment key={group.category}>
                  <tr className="bg-slate-300">
                    <td colSpan={3} className="p-2 text-right font-bold text-slate-800 text-lg">
                      {group.category}
                    </td>
                  </tr>
                  {group.ids.map((id) => {
                    const test = movementTests.find(t => t.id === id);
                    if (!test) return null;
                    const index = movementTests.findIndex(t => t.id === id);
                    return (
                       <TestRow
                        key={test.id}
                        test={test}
                        state={testStates[index]}
                        onStateChange={handleStateChange}
                      />
                    )
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Actions 
        onExecute={handleExecute} 
        onOppositeAction={handleOppositeAction}
        onReset={handleReset} 
        successMessage={successMessage} 
      />
    </div>
  );
};

export default App;
