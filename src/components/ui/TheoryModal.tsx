import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  content: React.ReactNode;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-primary-light text-primary',
  content
}) => {
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[80vh] bg-white border border-slate-200 rounded-2xl shadow-premium flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-borderColor/60 flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen size={16} className="text-primary" />
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeColor}`}>
                    {badge || 'Theory Handbook'}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-extrabold text-textColor-primary leading-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-textColor-secondary mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-borderColor/40 hover:border-borderColor text-textColor-secondary hover:text-textColor-primary transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-grow space-y-4 text-xs text-textColor-secondary leading-relaxed custom-scrollbar">
              {content}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-borderColor/60 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-textColor-primary hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                Close Handbook
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
