import React from 'react';
import { Link } from 'react-router-dom';
import { tutorials } from '../data/tutorials';

const Catalog: React.FC = () => {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="hero-title">
                        Tutorials Library
                    </h1>
                    <p className="hero-subtitle">
                        Deep dives into React, Performance, and modern web architecture.
                        Select a topic to start learning.
                    </p>
                </div>

                <div className="post-grid">
                    {tutorials.map((tutorial) => (
                        <Link 
                            key={tutorial.slug} 
                            to={`/topic/${tutorial.slug}`}
                            className="card group"
                        >
                            <div className="card-img relative overflow-hidden">
                                {/* Placeholder for thumbnail */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                                    <i className="fas fa-play-circle text-5xl group-hover:text-primary transition-colors"></i>
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <div className="tags mb-3">
                                    {tutorial.tags.map(tag => (
                                        <span key={tag} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="card-title group-hover:text-primary transition-colors">
                                    {tutorial.title}
                                </h3>
                                <p className="card-text lines-3">
                                    {tutorial.description}
                                </p>
                                <div className="mt-auto flex items-center text-primary font-semibold text-sm">
                                    Start Tutorial <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
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
