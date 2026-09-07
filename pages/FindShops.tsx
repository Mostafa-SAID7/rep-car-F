
import React, { useState, useCallback, useEffect } from 'react';
import { findShops } from '../features/ai/api/geminiService';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNotifications } from '../context/NotificationContext';
import { NotificationType, SearchSource } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { marked } from 'marked';
import PageHeader from '../components/PageHeader';
import { styles } from '../styles';

const FindShops: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ markdown: string; sources: SearchSource[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

   useEffect(() => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setLocationError(null);
                    setIsLoading(false);
                },
                (error) => {
                    const message = `Error getting location: ${error.message}`;
                    setLocationError(message);
                    addNotification(message, NotificationType.Error);
                    setIsLoading(false);
                }
            );
        } else {
            const message = "Geolocation is not supported by this browser.";
            setLocationError(message);
            addNotification(message, NotificationType.Error);
            setIsLoading(false);
        }
    }, [addNotification]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      addNotification('Please enter what you are looking for.', NotificationType.Error);
      return;
    }
    if (!location) {
        addNotification('Location is not available. Please enable location services.', NotificationType.Error);
        return;
    }

    setIsLoading(true);
    setResult(null);

    try {
       const response = await findShops(query, location);
       const markdownText = await marked.parse(response.markdown);
       setResult({ markdown: markdownText, sources: response.sources });
    } catch (error) {
      console.error('Find shops error:', error);
      addNotification('Failed to find shops. Please try again.', NotificationType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [query, location, addNotification]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Local network"
        title="Find a trusted shop nearby."
        description="Search for nearby repair shops, dealerships, and part stores. Location access is required."
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="e.g., Tire shop, BMW mechanic"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={isLoading || !location}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading || !location} className="w-full sm:w-auto">
              {isLoading ? <LoadingSpinner /> : 'Search Nearby'}
            </Button>
          </form>
            {locationError && <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{locationError}</p>}
            {!location && !locationError && <p className="mt-3 text-sm text-muted-foreground">Getting your location...</p>}
        </CardContent>
      </Card>

      {isLoading && !result && (
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
                    <h4 className="border-t border-border pt-5 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Places on Google Maps</h4>
                    <ul className="mt-3 space-y-2">
                        {result.sources.map((chunk, index) => (
                             chunk.type === 'maps' && (
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

export default FindShops;
