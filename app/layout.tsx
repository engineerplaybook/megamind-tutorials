import type { Metadata } from 'next';
import Script from 'next/script';
import '@engineerplaybook/design-system/dist/style.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Engineer Playbook | Tutorials',
  description: 'Deep dives into React execution, performance profiling, and modern web tooling.',
  icons: { icon: '/logo.svg' },
};

const commonNavBase = process.env.NEXT_PUBLIC_COMMON_NAV_URL || '/nav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-19GSDP6BS8" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-19GSDP6BS8');
          `}
        </Script>
        <link rel="stylesheet" href={`${commonNavBase}/common-nav.css`} crossOrigin="anonymous" />
        <Script id="common-nav-webcomponent" strategy="afterInteractive" type="module" src={`${commonNavBase}/common-nav.js`} crossOrigin="anonymous" />
        {/* @ts-expect-error - custom element defined by the webcomponent script */}
        <engineering-playbook-nav></engineering-playbook-nav>
        <main className="flex-grow mt-16 transition-all duration-300 min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-borderColor/60 py-8 mt-16 shadow-inner">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start gap-1">
                <p className="text-textColor-secondary text-sm font-medium">&copy; 2026 Anmol Thukral.</p>
                <p className="text-textColor-secondary/60 text-xs">Built with Next.js, React & Tailwind CSS.</p>
              </div>
              <div className="flex items-center gap-6">
                <a href="https://github.com/anmolthukral" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-borderColor/60 flex items-center justify-center text-textColor-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-light/30 transition-all duration-300 shadow-sm" aria-label="GitHub Profile">
                  <i className="fab fa-github text-lg"></i>
                </a>
                <a href="https://www.linkedin.com/in/anmol-thukral/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-borderColor/60 flex items-center justify-center text-textColor-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-light/30 transition-all duration-300 shadow-sm" aria-label="LinkedIn Profile">
                  <i className="fab fa-linkedin-in text-lg"></i>
                </a>
                <a href="/tutorials/" className="text-sm font-semibold text-textColor-secondary hover:text-primary transition-colors duration-200">Catalog</a>
                <a href="/tutorials/playground" className="text-sm font-semibold text-textColor-secondary hover:text-primary transition-colors duration-200">Playground</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
