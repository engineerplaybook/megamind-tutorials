import { useState, useReducer } from 'react';
import { Plus, Minus, Trash2, ShoppingCart as CartIcon, PlusCircle, Check } from 'lucide-react';

// --- useState Example: Simple Counter ---
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-borderColor/60 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-brand-blue" />
        <h3 className="text-base font-heading font-extrabold text-textColor-primary m-0">
          useState Lab: Micro Counter
        </h3>
      </div>
      
      <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-xl border border-borderColor/40 w-fit">
        <button 
          onClick={() => setCount(c => c - 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-borderColor text-textColor-secondary active:scale-95 transition-all"
          aria-label="Decrement"
        >
          <Minus size={16} />
        </button>
        <span className="text-3xl font-mono font-extrabold w-12 text-center text-textColor-primary">
          {count}
        </span>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-light text-primary hover:bg-primary/15 border border-primary/20 active:scale-95 transition-all"
          aria-label="Increment"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <p className="mt-4 text-xs text-textColor-secondary">
        <strong>Best for:</strong> Simple, isolated values that don't depend on other state updates.
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
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_ITEM':
      const itemToRemoveIndex = state.items.findIndex(item => item.id === action.payload);
      if (itemToRemoveIndex === -1) return state;
      const newItems = [...state.items];
      const removedItem = newItems.splice(itemToRemoveIndex, 1)[0];
      return {
        items: newItems,
        total: state.total - removedItem.price,
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

const ShoppingCart = () => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [addedItem, setAddedItem] = useState<number | null>(null);

  const products = [
    { id: 1, name: 'Advanced React Guide', price: 30 },
    { id: 2, name: 'Performance Masterclass', price: 50 },
    { id: 3, name: 'SaaS Design System Template', price: 80 },
  ];

  const handleAdd = (product: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 800);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-borderColor/60">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-brand-green" />
        <h3 className="text-base font-heading font-extrabold text-textColor-primary m-0">
          useReducer Lab: Transactional Cart
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Product List */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-textColor-secondary/70 mb-3">
            Available Course Modules
          </h4>
          <div className="space-y-3">
            {products.map(product => (
              <div 
                key={product.id} 
                className="flex justify-between items-center p-4 bg-white rounded-xl border border-borderColor/40 shadow-sm hover:border-primary/30 transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-sm text-textColor-primary">{product.name}</p>
                  <p className="text-xs text-primary font-bold mt-0.5">${product.price}</p>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    addedItem === product.id 
                      ? 'bg-brand-green text-white shadow-sm' 
                      : 'bg-textColor-primary text-white hover:bg-slate-800 active:scale-95'
                  }`}
                >
                  {addedItem === product.id ? (
                    <>
                      <Check size={14} /> Added
                    </>
                  ) : (
                    <>
                      <PlusCircle size={14} /> Buy
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-borderColor/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-borderColor/60">
              <h4 className="font-heading font-extrabold text-sm text-textColor-primary flex items-center gap-2">
                <CartIcon size={16} className="text-brand-blue" />
                Receipt ({state.items.length})
              </h4>
              {state.items.length > 0 && (
                <button 
                  onClick={() => dispatch({ type: 'CLEAR_CART' })}
                  className="text-brand-red hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                  aria-label="Clear Cart"
                  title="Clear Receipt"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {state.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex justify-between text-xs items-center py-1 border-b border-dashed border-borderColor/30 last:border-b-0">
                  <span className="text-textColor-secondary truncate max-w-[150px]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-textColor-primary">${item.price}</span>
                    <button 
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      className="text-brand-red hover:bg-red-50 text-[10px] px-1 py-0.5 rounded"
                      title="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {state.items.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-textColor-secondary/40 text-xs italic">Receipt is empty</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-borderColor/60 mt-4">
            <div className="flex justify-between font-extrabold text-sm text-textColor-primary">
              <span>Grand Total:</span>
              <span className="text-primary">${state.total}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-xs text-textColor-secondary">
        <strong>Best for:</strong> Complex state trees with multiple dependent sub-values or transaction-like transitions.
      </p>
    </div>
  );
};

const StateDemo = () => {
  return (
    <div className="space-y-4">
      <Counter />
      <ShoppingCart />
    </div>
  );
};

export default StateDemo;
