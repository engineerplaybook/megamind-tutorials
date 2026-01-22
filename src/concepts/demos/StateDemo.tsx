import { useState, useReducer } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

// --- useState Example: Simple Counter ---
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-xl font-bold mb-4">useState: Simple Counter</h3>
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setCount(c => c - 1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Minus size={20} />
        </button>
        <span className="text-3xl font-mono font-bold w-12 text-center">{count}</span>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Best for: Simple, independent values (numbers, booleans, strings).
      </p>
    </div>
  );
};

// --- useReducer Example: Shopping Cart ---

interface CartItem {
  id: number;
  name: string;
  price: number;
}

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number } // id
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        total: state.total - (itemToRemove ? itemToRemove.price : 0),
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

const ShoppingCart = () => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const products = [
    { id: 1, name: 'React Book', price: 30 },
    { id: 2, name: 'TypeScript Course', price: 50 },
    { id: 3, name: 'Design System UI kit', price: 80 },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4">useReducer: Shopping Cart</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product List */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">Products</h4>
          <div className="space-y-2">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>{product.name} (${product.price})</span>
                <button
                  onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                  className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart State */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700">Your Cart ({state.items.length})</h4>
            {state.items.length > 0 && (
              <button 
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                aria-label="Clear Cart"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
             {state.items.map((item, index) => (
                // Using index as key for simplicity in demo allowing duplicates, 
                // but better to use unique IDs in real apps
               <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                 <span>{item.name}</span>
                 <span>${item.price}</span>
               </div>
             ))}
             {state.items.length === 0 && <p className="text-gray-400 text-sm italic">Cart is empty</p>}
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex justify-between font-bold">
            <span>Total:</span>
            <span>${state.total}</span>
          </div>
        </div>
      </div>
       <p className="mt-4 text-sm text-gray-500">
        Best for: Complex state logic, multiple sub-values, or when the next state depends on the previous one in complex ways.
      </p>
    </div>
  );
};

const StateDemo = () => {
  return (
    <div className="space-y-8">
      <Counter />
      <ShoppingCart />
    </div>
  );
};

export default StateDemo;
