'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getCourseBySlug } from '@/src/data/courses';
import NotFound from '@/src/views/NotFound';

export default function TopicPage() {
  const params = useParams<{ slug: string }>();
  const course = getCourseBySlug(params.slug);

  if (!course) return <NotFound />;

  const CourseComponent = course.component;

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      }
    >
      <CourseComponent />
    </Suspense>
  );
}
