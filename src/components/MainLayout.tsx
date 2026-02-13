import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* The navbar is loaded from common-nav microfrontend */}
      {/* @ts-ignore: Custom Element */}
      <engineering-playbook-nav></engineering-playbook-nav>
      
      <main className="container section flex-grow mt-16">
        {children}
      </main>
      
      <footer className="footer">
        <div className="container text-center">
          <p className="text-secondary text-sm">
            © 2026 Anmol Thukral. Built with React & Oat UI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
