'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import type { Course } from '@/src/courses/types';
import { LiveTutorPanel } from '@/src/features/ai-tutor/components/LiveTutorPanel';

export function CoursePlayer({ course }: { course: Course }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [tutorCollapsed, setTutorCollapsed] = useState(false);
  const [tutorDrawerOpen, setTutorDrawerOpen] = useState(false);

  const activeModule = course.modules[activeIndex];
  const total = course.modules.length;
  const progress = ((activeIndex + 1) / total) * 100;

  const goTo = (index: number) => {
    if (index < 0 || index >= total || index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setLeftOpen(false);
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === 'ArrowRight') goTo(activeIndex + 1);
      if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${activeModule.ambientFrom} ${activeModule.ambientTo}`}
          />
        </AnimatePresence>
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {leftOpen && (
        <button
          aria-label="Close course contents"
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setLeftOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          leftOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-16' : 'lg:w-72'}`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activeModule.accent} text-white shadow-lg`}>
            <course.icon size={18} />
          </span>
          <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="truncate text-sm font-bold">{course.shortTitle}</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-gray-500">Course contents</p>
          </div>
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="hidden rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white lg:block"
            aria-label={collapsed ? 'Expand course contents' : 'Collapse course contents'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <button
            onClick={() => setLeftOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close course contents"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {course.modules.map((module, index) => {
            const Icon = module.icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={module.id}
                onClick={() => goTo(index)}
                className={`group flex w-full items-start gap-3 rounded-xl border px-2.5 py-2.5 text-left transition ${
                  isActive
                    ? 'border-white/10 bg-white/[0.07]'
                    : 'border-transparent hover:bg-white/[0.04]'
                }`}
                title={module.label}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold ${
                    isActive
                      ? `border-transparent bg-gradient-to-br ${module.accent} text-white`
                      : 'border-white/10 bg-white/[0.03] text-gray-500 group-hover:text-gray-300'
                  }`}
                >
                  <Icon size={13} />
                </span>
                <span className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
                  <span className={`block text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                    Module {index + 1}
                  </span>
                  <span className={`block text-xs font-medium leading-snug ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {module.label}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className={`border-t border-white/10 px-4 py-3 ${collapsed ? 'lg:hidden' : ''}`}>
          <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-500">
            <span>Progress</span>
            <span>
              {activeIndex + 1} / {total}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className={`h-full rounded-full bg-gradient-to-r ${activeModule.accent}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-white/10 bg-slate-950/40 px-3 py-2.5 backdrop-blur-md sm:px-5">
          <button
            onClick={() => setLeftOpen(true)}
            className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Open course contents"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] uppercase tracking-wider text-gray-500">
              {course.shortTitle} · Module {activeIndex + 1} of {total}
            </p>
            <p className="truncate text-sm font-semibold text-gray-200">{activeModule.label}</p>
          </div>

          <button
            onClick={() => {
              if (window.matchMedia('(min-width: 1024px)').matches) {
                setTutorCollapsed((value) => !value);
              } else {
                setTutorDrawerOpen((value) => !value);
              }
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
              tutorDrawerOpen
                ? 'border-purple-400/30 bg-purple-500/15 text-purple-200'
                : 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/10'
            } ${tutorCollapsed ? '' : 'lg:border-purple-400/30 lg:bg-purple-500/15 lg:text-purple-200'}`}
            aria-label="Toggle tutor panel"
          >
            <MessageSquare size={13} />
            <span className="hidden sm:inline">Tutor</span>
          </button>

          <Link
            href="/"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Exit course"
            title="Exit course"
          >
            <Home size={16} />
          </Link>
        </header>

        <div className="h-0.5 bg-white/5">
          <div className={`h-full bg-gradient-to-r ${activeModule.accent} transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>

        <main className="relative flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeModule.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 36 : -36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -36 : 36 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-auto w-full max-w-4xl px-4 py-7 sm:px-8 sm:py-10"
            >
              {activeModule.content}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-white/10 bg-slate-950/60 px-3 py-3 backdrop-blur-md sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <div className="hidden items-center gap-1.5 md:flex">
              {course.modules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => goTo(index)}
                  aria-label={`Go to module ${index + 1}: ${module.label}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {activeIndex === total - 1 ? (
              <Link
                href="/"
                className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-gray-200"
              >
                <BookOpen size={14} /> Finish
              </Link>
            ) : (
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-gray-200"
              >
                Next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </footer>
      </div>

      {tutorDrawerOpen && (
        <button
          aria-label="Close tutor"
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setTutorDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-30 w-[360px] max-w-[88vw] transform border-l border-white/10 bg-slate-950 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          tutorCollapsed ? 'lg:hidden' : ''
        } ${tutorDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <LiveTutorPanel
          courseSlug={course.slug}
          courseTitle={course.title}
          moduleLabel={activeModule.label}
          moduleContext={activeModule.tutorContext}
        />
      </aside>
    </div>
  );
}
