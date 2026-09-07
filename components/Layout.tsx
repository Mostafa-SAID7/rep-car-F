
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ScrollToTopButton from './ScrollToTopButton';
import Chatbot from './Chatbot';
import { styles } from '../styles';
import ThemeToggle from './ThemeToggle';
import { getNavigationItem } from '../app/navigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem('auto-ai-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((current) => !current), []);
  const currentSection = getNavigationItem(location.pathname)?.label ?? 'Page not found';

  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar mobileOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-border/70 bg-background/80 px-3 backdrop-blur-xl sm:min-h-20 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(255,105,77,0.2)] lg:hidden" aria-hidden="true">
              <span className="text-lg">✦</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{currentSection}</p>
              <p className="mt-1 hidden truncate text-sm font-medium text-foreground sm:block">Vehicle care, simplified</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:border-primary/50 hover:text-primary lg:hidden"
              aria-label="Open navigation"
              aria-expanded={isMobileNavOpen}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <div className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs text-muted-foreground md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              AI services ready
            </div>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="group flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-1.5 pr-3 transition hover:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              aria-label="Open profile"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">AR</span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-foreground">My profile</span>
                <span className="block text-[10px] text-muted-foreground">Driver</span>
              </span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className={`${styles.page} mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 sm:py-10 lg:px-10`}>
            <div key={location.pathname} className="motion-page">
              {children}
            </div>
          </div>
        </main>
      </div>
      <ScrollToTopButton />
      <Chatbot isNavigationOpen={isMobileNavOpen} />
    </div>
  );
};

export default Layout;