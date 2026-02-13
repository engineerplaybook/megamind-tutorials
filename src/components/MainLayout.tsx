import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Fallback navigation - matches design-system structure */}
      <nav className="navbar" id="fallback-nav">
        <div className="container">
          <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
            <img src="/logo.svg" alt="Engineer Playbook Logo" style={{ height: '32px', width: '32px' }} />
            Engineer Playbook
          </a>
          {/* Note: Mobile toggle functionality is handled by common-nav.js, but we add the button for layout consistency */}
          <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => {
            const nav = document.querySelector('.nav-links');
            nav?.classList.toggle('active');
          }}>
            <span style={{ fontSize: '1.5rem' }}>☰</span>
          </button>
          <div className="nav-links">
            <a href="/blogs" className="nav-link">Blogs</a>
            <a href="/tutorials" className="nav-link active">Tutorials</a>
            <a href="/profile" className="nav-link">Profile</a>
            <a href="/tutorials/playground" className="nav-link">Playground</a>
          </div>
        </div>
      </nav>

      {/* The navbar is loaded from common-nav microfrontend */}
      {/* @ts-ignore: Custom Element */}
      <engineering-playbook-nav></engineering-playbook-nav>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          customElements.whenDefined('engineering-playbook-nav').then(() => {
            const fallback = document.getElementById('fallback-nav');
            if (fallback) fallback.style.display = 'none';
          });
        `
      }} />
      
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
