import React from 'react';

const COMMON_NAV_ASSET_ID = 'common-nav-assets';
const commonNavBaseUrl =
  import.meta.env.VITE_COMMON_NAV_URL || (import.meta.env.DEV ? 'http://localhost:5174' : '/nav');

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    if (document.getElementById(COMMON_NAV_ASSET_ID)) {
      return;
    }

    const marker = document.createElement('meta');
    marker.id = COMMON_NAV_ASSET_ID;

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = `${commonNavBaseUrl}/common-nav.css`;
    stylesheet.crossOrigin = 'anonymous';

    const script = document.createElement('script');
    script.type = 'module';
    script.src = `${commonNavBaseUrl}/common-nav.js`;
    script.crossOrigin = 'anonymous';

    document.head.append(marker, stylesheet);
    document.body.append(script);

    return () => {
      marker.remove();
      stylesheet.remove();
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-bgdefault">
      {/* @ts-ignore custom element provided by common-nav */}
      <engineering-playbook-nav></engineering-playbook-nav>

      <main className="flex-grow mt-16 transition-all duration-300">
        {children}
      </main>

      <footer className="bg-white border-t border-borderColor/60 py-8 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-textColor-secondary text-sm font-medium">
                © 2026 Anmol Thukral.
              </p>
              <p className="text-textColor-secondary/60 text-xs">
                Built with React, Vite & Tailwind CSS.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/anmolthukral" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full border border-borderColor/60 flex items-center justify-center text-textColor-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-light/30 transition-all duration-300 shadow-sm"
                aria-label="GitHub Profile"
              >
                <i className="fab fa-github text-lg"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/anmol-thukral/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full border border-borderColor/60 flex items-center justify-center text-textColor-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-light/30 transition-all duration-300 shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
              <a 
                href="/" 
                className="text-sm font-semibold text-textColor-secondary hover:text-primary transition-colors duration-200"
              >
                Catalog
              </a>
              <a 
                href="/playground" 
                className="text-sm font-semibold text-textColor-secondary hover:text-primary transition-colors duration-200"
              >
                Playground
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
