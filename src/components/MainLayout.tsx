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
    <div className="min-h-screen flex flex-col font-sans">
      {/* @ts-ignore custom element provided by common-nav */}
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
