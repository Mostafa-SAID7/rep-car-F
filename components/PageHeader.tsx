import React from 'react';
import { styles } from '../styles';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description }) => (
  <header className={styles.pageHeader}>
    <div className="relative z-10">
      <span className={styles.pageEyebrow}>{eyebrow}</span>
      <h1 className={`${styles.pageTitle} mt-2`}>{title}</h1>
      <p className={`${styles.pageDescription} mt-3`}>{description}</p>
    </div>
    <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
  </header>
);

export default PageHeader;