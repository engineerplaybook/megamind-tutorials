import React from 'react';

interface TutorialLayoutProps {
  title: string;
  videoId?: string;
  children: React.ReactNode;
}

const TutorialLayout: React.FC<TutorialLayoutProps> = ({ title, videoId, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Section: Video Player */}
      <div className="bg-gray-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">{title}</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Video Area */}
                <div className="lg:col-span-2">
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
                        {videoId ? (
                            <iframe 
                                src={`https://www.youtube.com/embed/${videoId}`} 
                                title={title}
                                className="w-full h-full absolute inset-0"
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                <span className="flex items-center gap-2">
                                    <i className="fas fa-video-slash"></i> Video Placeholder
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info / Quick Links */}
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">About this Tutorial</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Watch the lesson on the left, then use the <strong>Interactive Playground</strong> below to test the concepts yourself.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                             <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"><i className="fas fa-code"></i></span>
                             <span>Interactive Demo Below</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                             <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"><i className="fas fa-book-open"></i></span>
                             <span>Read the Blog Post</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Section: Interactive Playground (The Feature) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[500px]">
            <div className="mb-8 border-b pb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <i className="fas fa-laptop-code text-blue-600"></i> Interactive Playground
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Live Environment
                </span>
            </div>
            {children}
        </div>
      </main>
    </div>
  );
};

export default TutorialLayout;
