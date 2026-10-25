import { lazy, type ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Atom, Bot } from 'lucide-react';

export interface CourseSummary {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  moduleCount: number;
  icon: LucideIcon;
  component: ComponentType;
}

// Lazy so the catalog does not pull in every course's interactive modules.
const ClaudeCourse = lazy(() => import('../courses/claude-code/ClaudeCourse'));
const ReactCourse = lazy(() => import('../courses/react/ReactCourse'));

export const courses: CourseSummary[] = [
  {
    slug: 'claude-code',
    title: 'Introduction to Claude Code',
    description:
      "An interactive course on Anthropic's agentic coding tool — slash commands, memory files, subagents, and more.",
    tags: ['Claude Code', 'AI', 'Tooling', 'Terminal'],
    moduleCount: 9,
    icon: Bot,
    component: ClaudeCourse,
  },
  {
    slug: 'react',
    title: 'React, From First Principles',
    description:
      'Build the mental model behind React: components, state, effects, context, transitions, and performance.',
    tags: ['React', 'Frontend', 'Hooks', 'Performance'],
    moduleCount: 8,
    icon: Atom,
    component: ReactCourse,
  },
];

export const getCourseBySlug = (slug: string) => courses.find((course) => course.slug === slug);
