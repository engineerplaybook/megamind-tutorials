import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, GraduationCap } from 'lucide-react';

export const ease = [0.16, 1, 0.3, 1] as const;
export const slideIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease },
};

export function SlideHeader({
  icon: Icon,
  title,
  subtitle,
  slide,
  total,
  accent,
  onReadHandbook,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  slide: number;
  total: number;
  accent: string;
  onReadHandbook?: () => void;
}) {
  return (
    <motion.div className="mb-5 text-center" {...slideIn}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg`}>
          <GraduationCap size={12} />
          <span>
            {slide} / {total}
          </span>
        </div>
        {onReadHandbook && (
          <button
            onClick={onReadHandbook}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white shadow-md transition-all hover:border-white/25 hover:bg-white/20 active:scale-95"
          >
            <BookOpen size={11} className="animate-pulse text-purple-300" />
            <span>Read Handbook</span>
          </button>
        )}
      </div>
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md">
        <Icon size={22} className="text-white" />
      </div>
      <h2 className="mb-1 text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
      {subtitle && <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">{subtitle}</p>}
      <div className="mt-3 flex justify-center">
        <div className={`h-0.5 w-16 rounded-full bg-gradient-to-r ${accent} opacity-60`} />
      </div>
    </motion.div>
  );
}
