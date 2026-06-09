import React from 'react';

export interface TutorialConfig {
  slug: string;
  title: string;
  description: string;
  videoId?: string; // YouTube Video ID
  blogUrl?: string; // Deep link to the blog post
  component: React.ComponentType;
  tags: string[];
  fullscreen?: boolean; // Renders without TutorialLayout wrapper
}

// Lazy load feature components to keep initial bundle small
const ClaudeCodeDemo = React.lazy(() => import('../features/claude-code/ClaudeCodeDemo'));

export const tutorials: TutorialConfig[] = [
  {
    slug: 'claude-code',
    title: 'Introduction to Claude Code',
    description: 'An interactive tutorial on Anthropic\'s agentic coding tool — slash commands, memory files, subagents, and more.',
    blogUrl: 'https://www.engineerplaybook.io/blogs/introduction-to-claude-code/',
    component: ClaudeCodeDemo,
    tags: ['Claude Code', 'AI', 'Tooling', 'Terminal'],
    fullscreen: true
  }
];

export const getTutorialBySlug = (slug: string) => tutorials.find(t => t.slug === slug);
