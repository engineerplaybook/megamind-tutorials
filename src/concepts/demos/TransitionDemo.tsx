import React, { useState, useTransition } from 'react';

const TransitionDemo = () => {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);

  // Large list size to simulate heavy rendering
  const LIST_SIZE = 20000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value); // Update input immediately for responsiveness

    // Wrap state update that causes heavy render in startTransition
    startTransition(() => {
      const l = [];
      for (let i = 0; i < LIST_SIZE; i++) {
        l.push(`${value} Item ${i + 1}`);
      }
      setList(l);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
        <h3 className="text-xl font-bold mb-4">Input (Responsive)</h3>
        <p className="mb-4 text-gray-600">
          Type quickly below. Notice that the input remains responsive even though we are rendering {LIST_SIZE.toLocaleString()} items based on the input.
        </p>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="Type something..."
        />
        {isPending && (
          <div className="mt-2 text-sm text-indigo-600 font-medium animate-pulse">
            Rendering list...
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-200 max-h-[500px] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 sticky top-0 bg-gray-50 pb-2">Heavy List ({list.length})</h3>
        {list.length === 0 ? (
          <p className="text-gray-400">Start typing to see items...</p>
        ) : (
          <ul className="space-y-1">
            {list.map((item, index) => (
              <li key={index} className="text-sm text-gray-600 px-2 py-1 bg-white rounded shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransitionDemo;
