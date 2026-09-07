
import React, { useState, useCallback } from 'react';
import { getDIYGuide } from '../features/ai/api/geminiService';
import Card, { CardContent, CardHeader, CardTitle } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNotifications } from '../context/NotificationContext';
import { NotificationType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { marked } from 'marked';
import PageHeader from '../components/PageHeader';
import { styles } from '../styles';

const DIYGuides: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [guide, setGuide] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      addNotification('Please enter a topic for the guide.', NotificationType.Error);
      return;
    }

    setIsLoading(true);
    setGuide('');

    try {
      const response = await getDIYGuide(topic);
      const markdownText = await marked.parse(response);
      setGuide(markdownText);
    } catch (error) {
      console.error('Guide generation error:', error);
      addNotification('Failed to generate guide. Please try again.', NotificationType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [topic, addNotification]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Learn by doing"
        title="DIY guides for the jobs you can own."
        description="Search for a step-by-step guide for your next project, with tools and safety notes included."
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="e.g., How to change the oil on a 2020 Honda Civic"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <LoadingSpinner /> : 'Get Guide'}
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
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-3/4" />
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-5/6" />
            </CardContent>
        </Card>
      )}

      {guide && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Guide: {topic}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: guide }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DIYGuides;
