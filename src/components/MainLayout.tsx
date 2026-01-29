import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* The navbar is loaded from common-nav microfrontend */}
      {/* @ts-ignore: Custom Element */}
      <engineering-playbook-nav></engineering-playbook-nav>
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        {children}
      </main>
      
      <footer className="border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary text-sm">
            © 2026 Anmol Thukral. Built with React & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
