import React from 'react';
import { Link } from 'react-router-dom';
import { tutorials } from '../data/tutorials';

const Catalog: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Tutorials Library
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Deep dives into React, Performance, and modern web architecture.
                        Select a topic to start learning.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tutorials.map((tutorial) => (
                        <Link 
                            key={tutorial.slug} 
                            to={`/topic/${tutorial.slug}`}
                            className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
                        >
                            <div className="aspect-w-16 aspect-h-9 bg-gray-900 relative">
                                {/* Placeholder for thumbnail */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                                    <i className="fas fa-play-circle text-5xl group-hover:text-blue-500 transition-colors"></i>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tutorial.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {tutorial.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-3">
                                    {tutorial.description}
                                </p>
                                <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                                    Start Tutorial <i className="fas fa-arrow-right ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
