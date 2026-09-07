
import React, { useState, useCallback } from 'react';
import { getDiagnostics } from '../features/ai/api/geminiService';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import { useNotifications } from '../context/NotificationContext';
import { DiagnosticResult, NotificationType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { ICONS } from '../constants';
import PageHeader from '../components/PageHeader';
import { styles } from '../styles';

const Diagnostics: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) {
      addNotification('Please describe the problem.', NotificationType.Error);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await getDiagnostics(problem, image || undefined);
      setResult(response);
    } catch (error) {
      console.error('Diagnostics error:', error);
      addNotification('Failed to get diagnostics. Please try again.', NotificationType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [problem, image, addNotification]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="AI diagnostics"
        title="Understand what your car is telling you."
        description="Describe the issue you're experiencing with your vehicle. For better results, upload a photo of the affected area."
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tell us what happened</CardTitle>
            <CardDescription>Share the symptoms in your own words.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="problem" className={styles.label}>
                  What's happening?
                </label>
                <Textarea
                  id="problem"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g., I hear a rattling noise from the engine when I accelerate."
                  rows={5}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="image-upload" className={styles.label}>
                  Upload Image (Optional)
                </label>
                <div className="flex justify-center rounded-2xl border border-dashed border-border bg-background px-6 py-8 transition hover:border-primary/50 hover:bg-accent">
                    <div className="space-y-2 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground">{ICONS.upload}</div>
                        <div className="flex justify-center text-sm text-muted-foreground">
                            <label htmlFor="image-upload" className="relative cursor-pointer font-semibold text-primary hover:text-primary/80">
                                <span>Upload a file</span>
                                <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" disabled={isLoading} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
                {imagePreview && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover"/>
                    </div>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <LoadingSpinner /> : 'Diagnose Problem'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Report</CardTitle>
            <CardDescription>Results from our AI analysis will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <SkeletonLoader className="h-8 w-1/3" />
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-5/6" />
                <SkeletonLoader className="h-8 w-1/2 mt-4" />
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-3/4" />
              </div>
            )}
            {result && !isLoading && (
              <div className="space-y-6">
                <div>
                  <p className={styles.label}>Severity level</p>
                  <h4 className="flex items-center gap-2 text-lg font-semibold">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${result.severity_level === 'High' ? 'bg-red-100 text-red-800' : result.severity_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {result.severity_level}
                    </span>
                  </h4>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Possible causes</h4>
                  <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                    {result.possible_causes.map((cause, i) => <li key={i} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{cause}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Recommended actions</h4>
                  <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                    {result.recommended_actions.map((action, i) => <li key={i} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{action}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {!result && !isLoading && (
                <div className="dot-grid rounded-2xl py-16 text-center text-sm text-muted-foreground">
                    <p>Your report is waiting for a description.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Diagnostics;
