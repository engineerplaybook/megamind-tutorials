import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setSelectedLabel(option.label);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`inline-flex justify-between items-center w-full min-w-[170px] rounded-xl border px-4 py-2.5 text-xs md:text-sm font-bold transition-all ${
          isOpen 
            ? 'border-primary bg-white text-primary ring-4 ring-primary/5 shadow-sm' 
            : 'border-borderColor bg-white text-textColor-secondary hover:bg-slate-50'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedLabel || label}</span>
        <ChevronDown className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute left-0 md:right-0 mt-2 w-full min-w-[170px] rounded-xl shadow-premium bg-white border border-borderColor/60 overflow-hidden focus:outline-none transition-all duration-200 origin-top-right z-50 ${
          isOpen 
            ? 'transform scale-100 opacity-100 visible' 
            : 'transform scale-95 opacity-0 invisible'
        }`}
      >
        <div className="py-1.5 divide-y divide-borderColor/20">
          {options.map((option) => {
            const isSelected = selectedLabel === option.label;
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`group flex items-center justify-between w-full px-4 py-2.5 text-xs md:text-sm text-left transition-colors ${
                  isSelected 
                    ? 'bg-primary-light text-primary font-bold' 
                    : 'text-textColor-secondary hover:bg-slate-50 hover:text-textColor-primary'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check size={14} className="text-primary shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
