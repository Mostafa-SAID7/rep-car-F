
import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { ICONS } from '../constants';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { styles } from '../styles';
import { navigationItems } from '../app/navigation';

const features = navigationItems
  .filter((item) => item.to !== '/')
  .map((item) => ({
    title: item.cardTitle ?? item.label,
    description: item.cardDescription ?? '',
    link: item.to,
    icon: item.icon,
  }));

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="sidebar-surface relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-[0_18px_50px_rgba(23,23,23,0.14)] sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/75">
            <span className="h-2 w-2 rounded-full bg-primary" /> Your vehicle workspace
          </span>
          <h1 className="mt-6 max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">Keep every drive feeling like the first one.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/55 sm:text-base">
            Get intelligent, data-driven insights to keep your car running smoothly, from the next service to the unexpected warning light.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" className="w-full sm:w-auto" onClick={() => window.location.hash = '#/diagnostics'}>Start a diagnosis <span aria-hidden="true">↗</span></Button>
            <Button variant="secondary" className="w-full border-white/15 bg-white/10 text-white hover:bg-white/15 sm:w-auto">Add vehicle</Button>
          </div>
        </div>
        <div className="dot-grid absolute -right-10 -top-10 h-72 w-72 rounded-full opacity-40" />
        <div className="absolute -bottom-28 -right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:block">
          <div className="flex h-full items-end gap-1.5">
            <span className="h-1/3 w-2 rounded-full bg-primary/50" />
            <span className="h-2/3 w-2 rounded-full bg-primary/70" />
            <span className="h-full w-2 rounded-full bg-primary" />
            <span className="h-1/2 w-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      <div className="motion-stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
           ['Vehicle status', 'Ready for the road', 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'],
           ['Next service', '1,240 mi away', 'bg-orange-500/10 text-orange-700 dark:text-orange-300'],
           ['Saved guides', '12 resources', 'bg-violet-500/10 text-violet-700 dark:text-violet-300'],
        ].map(([label, value, badge]) => (
          <div key={label} className={`${styles.card} flex items-start justify-between gap-3 p-5 sm:items-center`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">{value}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${badge}`}>Active</span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={styles.pageEyebrow}>Explore tools</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">What do you need today?</h2>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">5 tools available</span>
      </div>

      <div className="motion-stagger grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
            <Link to={feature.link} key={feature.title} className="group">
                <Card className="h-full transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-[0_18px_40px_rgba(255,105,77,0.1)]">
                    <CardHeader className="flex-row items-start justify-between">
                         <div className={styles.iconBox}>{feature.icon}</div>
                         <span className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary">↗</span>
                    </CardHeader>
                    <CardContent>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                        <CardDescription className="mt-2">{feature.description}</CardDescription>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;