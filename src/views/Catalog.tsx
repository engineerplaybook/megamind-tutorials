import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Play, Sparkles } from 'lucide-react';
import { courses } from '../data/courses';

const Catalog = () => {
  const [selectedTag, setSelectedTag] = useState('All');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    courses.forEach((course) => course.tags.forEach((tag) => tags.add(tag)));
    return ['All', ...Array.from(tags)];
  }, []);

  const filteredCourses = useMemo(
    () => (selectedTag === 'All' ? courses : courses.filter((course) => course.tags.includes(selectedTag))),
    [selectedTag]
  );

  return (
    <div className="min-h-screen bg-bgdefault px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-14 overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950 p-8 text-white shadow-2xl md:p-16">
          <div className="pointer-events-none absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-[300px] w-[300px] rounded-full bg-brand-green/10 blur-[80px]" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-light shadow-sm">
              <Sparkles size={12} className="text-brand-gold" />
              <span>Interactive courses</span>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text font-heading text-4xl font-extrabold leading-tight tracking-tight text-transparent md:text-6xl">
              Engineer Playbook <br />
              <span className="bg-gradient-to-r from-brand-blue via-indigo-300 to-brand-green bg-clip-text text-transparent">
                Course Library
              </span>
            </h1>

            <p className="mb-0 text-lg leading-relaxed text-slate-400 md:text-xl">
              Full-screen, hands-on courses with an AI tutor on every module. Pick a course and learn by
              doing.
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-2xl font-extrabold text-textColor-primary">
              <BookOpen size={22} className="text-brand-blue" />
              Courses
            </h2>
            <p className="text-sm text-textColor-secondary">Multi-module courses with interactive lessons.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-primary text-white shadow-md'
                    : 'border border-borderColor/60 bg-white text-textColor-secondary hover:bg-slate-50 hover:text-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const Icon = course.icon;
            return (
              <Link
                key={course.slug}
                href={`/topic/${course.slug}`}
                className="premium-card-gradient group flex flex-col overflow-hidden rounded-2xl border border-borderColor/60 bg-white shadow-premium transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium-hover"
              >
                <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-borderColor/40 bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-emerald-950/30 opacity-70 transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                  <Icon size={72} className="relative text-white/15 transition-transform duration-500 group-hover:scale-110" />

                  <span className="absolute left-4 top-4 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur-sm">
                    {course.moduleCount} modules
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-white text-primary shadow-lg transition-all duration-300 group-hover:scale-100">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-grow flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-primary-light px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="mb-2 font-heading text-lg font-extrabold leading-snug text-textColor-primary transition-colors duration-200 group-hover:text-primary">
                    {course.title}
                  </h3>

                  <p className="mb-6 flex-grow text-xs leading-relaxed text-textColor-secondary">
                    {course.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-borderColor/40 pt-4 text-xs font-bold text-primary">
                    <span>Start course</span>
                    <ArrowRight size={14} className="transform transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            );
          })}

          {filteredCourses.length === 0 && (
            <div className="col-span-full rounded-2xl border border-borderColor/50 bg-white py-16 text-center text-textColor-secondary">
              <p className="text-sm italic">No courses found matching the selected tag.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
