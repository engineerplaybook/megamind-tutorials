import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      if (openIndexes.includes(index)) {
        setOpenIndexes(openIndexes.filter((i) => i !== index));
      } else {
        setOpenIndexes([...openIndexes, index]);
      }
    } else {
      if (openIndexes.includes(index)) {
        setOpenIndexes([]);
      } else {
        setOpenIndexes([index]);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md bg-white"
          >
            <button
              className={`w-full px-6 py-4 text-left flex justify-between items-center transition-colors duration-200 ${
                isOpen ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => toggleItem(index)}
            >
              <span className="font-medium text-lg">{item.title}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-5 h-5 transition-transform duration-300" />
              )}
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 py-4 text-gray-600 bg-white border-t border-gray-100">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
