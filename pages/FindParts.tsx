
import React, { useState, useCallback } from 'react';
import { findCarParts } from '../features/ai/api/geminiService';
import Card, { CardContent, CardHeader, CardTitle } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNotifications } from '../context/NotificationContext';
import { NotificationType, SearchSource } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { marked } from 'marked';
import PageHeader from '../components/PageHeader';
import { styles } from '../styles';

const FindParts: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ markdown: string; sources: SearchSource[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      addNotification('Please enter a part to search for.', NotificationType.Error);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await findCarParts(query);
      const markdownText = await marked.parse(response.markdown);
      setResult({ markdown: markdownText, sources: response.sources });
    } catch (error) {
      console.error('Find parts error:', error);
      addNotification('Failed to find parts. Please try again.', NotificationType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [query, addNotification]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Parts finder"
        title="Find the right part with less guesswork."
        description="Describe the part you need and get current information and purchasing options from the web."
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="e.g., Brake pads for a 2021 Ford F-150"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <LoadingSpinner /> : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
            <CardContent className="space-y-4">
                <SkeletonLoader className="h-8 w-1/3" />
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-5/6" />
            </CardContent>
        </Card>
      )}

      {result && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results for: {query}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`${styles.prose} mb-6`}
              dangerouslySetInnerHTML={{ __html: result.markdown }}
            />
            {result.sources.length > 0 && (
                <div>
                    <h4 className="border-t border-border pt-5 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Sources</h4>
                    <ul className="mt-3 space-y-2">
                        {result.sources.map((chunk, index) => (
                            chunk.type === 'web' && (
                                <li key={index}>
                                    <a
                                         href={chunk.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                         {chunk.title}
                                    </a>
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FindParts;
