import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface CourseModule {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  ambientFrom: string;
  ambientTo: string;
  content: ReactNode;
  tutorContext: string;
}

export interface Course {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  modules: CourseModule[];
}
