import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* 
          @ts-ignore: Web Component 
          The navbar is loaded from common-nav microfrontend
      */}
      <megamind-nav></megamind-nav>
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2026 Megamind Tutorials. Built with React & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
