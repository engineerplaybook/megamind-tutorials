import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getTutorialBySlug } from '../data/tutorials';
import TutorialLayout from '../layouts/TutorialLayout';

const TutorialViewer: React.FC = () => {
    const params = useParams();
    const slug = params.slug as string;
    const tutorial = slug ? getTutorialBySlug(slug) : undefined;

    if (!tutorial) {
        return null;
    }

    const FeatureComponent = tutorial.component;
    const content = (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p>Loading Interactive Demo...</p>
                </div>
            </div>
        }>
            <FeatureComponent />
        </Suspense>
    );

    if (tutorial.fullscreen) {
        return content;
    }

    return (
        <TutorialLayout title={tutorial.title} videoId={tutorial.videoId}>
            {content}
        </TutorialLayout>
    );
};

export default TutorialViewer;
