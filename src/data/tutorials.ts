import React from 'react';

export interface TutorialConfig {
  slug: string;
  title: string;
  description: string;
  videoId?: string; // YouTube Video ID
  blogUrl?: string; // Deep link to the blog post
  component: React.ComponentType;
  tags: string[];
}

// Lazy load feature components to keep initial bundle small
const PerformanceDemo = React.lazy(() => import('../features/performance/PerformanceDemo'));

export const tutorials: TutorialConfig[] = [
  {
    slug: 'performance',
    title: 'Frontend Performance Visualized',
    description: 'Why your app feels slow, the "React Render" myth, and how to debug Jank interactively.',
    videoId: 'dQw4w9WgXcQ', // Placeholder ID
    blogUrl: '/blogs/frontend-performance-is-not-react',
    component: PerformanceDemo,
    tags: ['Performance', 'React', 'Rendering']
  }
];

export const getTutorialBySlug = (slug: string) => tutorials.find(t => t.slug === slug);
