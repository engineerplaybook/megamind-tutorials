import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div 
            key={index} 
            className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white ${
              isOpen 
                ? 'border-primary/50 shadow-md ring-2 ring-primary/5' 
                : 'border-borderColor/65 hover:border-primary/30 shadow-sm'
            }`}
          >
            {/* Header Trigger */}
            <button
              className="w-full px-5 py-4 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors duration-200"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span className={`font-heading font-extrabold text-sm md:text-base flex items-center gap-2.5 transition-colors ${
                isOpen ? 'text-primary' : 'text-textColor-primary'
              }`}>
                <HelpCircle size={18} className={isOpen ? 'text-primary' : 'text-textColor-secondary/60'} />
                {item.title}
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-textColor-secondary/60 transition-transform duration-350 ${
                  isOpen ? 'transform rotate-180 text-primary' : ''
                }`} 
              />
            </button>

            {/* Collapsible Content */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-textColor-secondary bg-white border-t border-dashed border-borderColor/40 leading-relaxed">
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
