import { useState, useEffect } from 'react';

// --- Example 1: Data Fetching ---
const UserFetcher = () => {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    
    // Simulate API call
    const fetchData = async () => {
      // Intentionally waiting to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!ignore) {
        setData({ 
          id: userId, 
          name: userId === 1 ? 'Alice' : userId === 2 ? 'Bob' : 'Charlie',
          role: userId === 1 ? 'Admin' : 'User'
        });
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [userId]); // Re-run when userId changes

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-xl font-bold mb-4">Data Fetching & Dependencies</h3>
      <div className="flex gap-4 mb-4">
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              userId === id ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            User {id}
          </button>
        ))}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        ) : (
          <div className="text-left w-full">
            <p className="font-semibold">ID: <span className="font-normal">{data?.id}</span></p>
            <p className="font-semibold">Name: <span className="font-normal">{data?.name}</span></p>
            <p className="font-semibold">Role: <span className="font-normal">{data?.role}</span></p>
          </div>
        )}
      </div>
       <p className="mt-4 text-sm text-gray-500">
        Demo: Change user ID to trigger the effect. Note the dependency array `[userId]`.
      </p>
    </div>
  );
};

// --- Example 2: Event Listeners & Cleanup ---
const WindowTracker = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array = run once on mount

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4">Events & Cleanup</h3>
      <p className="text-4xl font-mono font-bold text-indigo-600 mb-2">
        {width}px
      </p>
      <p className="text-gray-600">Current Window Width</p>
      <p className="mt-4 text-sm text-gray-500">
        Demo: Resize your browser window. This effect adds an event listener on mount and removes it on unmount.
      </p>
    </div>
  );
};

const EffectDemo = () => {
  const [showTracker, setShowTracker] = useState(true);

  return (
    <div className="space-y-8">
      <UserFetcher />
      
      <div className="bg-gray-200 p-px rounded-xl">
        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-700">One important aspect of effects is cleanup. Toggle this component to see it mount/unmount (check logic in code).</span>
                <button 
                    onClick={() => setShowTracker(!showTracker)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                    {showTracker ? 'Unmount Tracker' : 'Mount Tracker'}
                </button>
            </div>
            {showTracker && <WindowTracker />}
        </div>
      </div>
    </div>
  );
};

export default EffectDemo;
