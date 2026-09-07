import React from 'react';
import { styles } from '../styles';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  private readonly children: React.ReactNode;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.children = props.children;
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.children;
    }

    return (
      <main className="app-shell flex min-h-screen items-center justify-center px-5 py-10">
        <section className={`${styles.card} w-full max-w-xl p-6 text-center sm:p-10`}>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-2xl text-destructive" aria-hidden="true">
            !
          </span>
          <p className={`${styles.pageEyebrow} mt-6`}>Something went wrong</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            Auto AI needs a fresh start.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            This screen could not finish loading. Reload the workspace or return to the dashboard and try again.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={this.handleReload} className={`${styles.button.base} ${styles.button.primary}`}>
              Reload workspace
            </button>
            <a href="#/" className={`${styles.button.base} ${styles.button.secondary}`}>
              Back to dashboard
            </a>
          </div>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;