import React from 'react';
import { Link } from 'react-router-dom';
import { styles } from '../styles';

const NotFound: React.FC = () => (
  <div className={styles.page}>
    <section className={`${styles.pageHeader} min-h-[22rem] items-center justify-center text-center`}>
      <div className="relative z-10">
        <span className={styles.pageEyebrow}>404 · Page not found</span>
        <p className="mt-5 text-7xl font-semibold tracking-[-0.08em] text-foreground sm:text-8xl">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
          That route is not part of your workspace.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          The link may be outdated or the address may have been entered incorrectly. Return to the dashboard to continue.
        </p>
        <Link to="/" className={`${styles.button.base} ${styles.button.primary} mt-7`}>
          Go to dashboard
        </Link>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
    </section>
  </div>
);

export default NotFound;