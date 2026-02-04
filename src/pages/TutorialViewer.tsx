import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getTutorialBySlug } from '../data/tutorials';
import TutorialLayout from '../layouts/TutorialLayout';

const TutorialViewer: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const tutorial = slug ? getTutorialBySlug(slug) : undefined;

    if (!tutorial) {
        return <Navigate to="/" replace />;
    }

    const FeatureComponent = tutorial.component;

    return (
        <TutorialLayout title={tutorial.title} videoId={tutorial.videoId}>
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
        </TutorialLayout>
    );
};

export default TutorialViewer;
