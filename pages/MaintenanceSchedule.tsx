
import React, { useState, useCallback } from 'react';
import { generateMaintenanceSchedule } from '../features/ai/api/geminiService';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNotifications } from '../context/NotificationContext';
import { MaintenanceScheduleResult, NotificationType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import PageHeader from '../components/PageHeader';
import { styles } from '../styles';

const MaintenanceSchedule: React.FC = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [schedule, setSchedule] = useState<MaintenanceScheduleResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !year || !mileage) {
      addNotification('Please fill out all fields.', NotificationType.Error);
      return;
    }

    setIsLoading(true);
    setSchedule(null);

    try {
      const response = await generateMaintenanceSchedule(make, model, parseInt(year), parseInt(mileage));
      setSchedule(response);
    } catch (error) {
      console.error('Schedule generation error:', error);
      addNotification('Failed to generate schedule. Please try again.', NotificationType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [make, model, year, mileage, addNotification]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Stay ahead"
        title="Build a maintenance rhythm for your car."
        description="Enter your vehicle's details to generate a recommended schedule tailored to its age and mileage."
      />
      <Card>
        <CardHeader>
          <CardTitle>Vehicle information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <Input placeholder="Make (e.g., Toyota)" value={make} onChange={e => setMake(e.target.value)} disabled={isLoading} />
            <Input placeholder="Model (e.g., Camry)" value={model} onChange={e => setModel(e.target.value)} disabled={isLoading} />
            <Input type="number" placeholder="Year (e.g., 2020)" value={year} onChange={e => setYear(e.target.value)} disabled={isLoading} />
            <Input type="number" placeholder="Current Mileage" value={mileage} onChange={e => setMileage(e.target.value)} disabled={isLoading} />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <LoadingSpinner /> : 'Generate'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="space-y-2">
            <SkeletonLoader className="h-12 w-full" />
            <SkeletonLoader className="h-12 w-full" />
            <SkeletonLoader className="h-12 w-full" />
        </div>
      )}

      {schedule && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Your Custom Schedule</CardTitle>
            <CardDescription>Based on a {year} {make} {model} with {mileage} miles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
                <table className="min-w-[700px] divide-y divide-border">
                    <thead className="bg-secondary/60">
                        <tr>
                            <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Task</th>
                            <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Interval</th>
                            <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                        {schedule.schedule.map((item, index) => (
                            <tr key={index}>
                                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-foreground">{item.task_name}</td>
                                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{item.interval_miles.toLocaleString()} mi</td>
                                <td className="whitespace-normal px-5 py-4 text-sm leading-6 text-muted-foreground">{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceSchedule;
