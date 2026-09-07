import React, { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import { useNotifications } from '../context/NotificationContext';
import { NotificationType } from '../types';
import { styles } from '../styles';

interface ProfileSettings {
  displayName: string;
  vehicleName: string;
  vehicleDetails: string;
}

const defaultProfile: ProfileSettings = {
  displayName: 'Driver',
  vehicleName: 'My vehicle',
  vehicleDetails: '',
};

const PROFILE_STORAGE_KEY = 'auto-ai-profile';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileSettings>(defaultProfile);
  const [isSaved, setIsSaved] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
      } catch {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }
  }, []);

  const updateProfile = (field: keyof ProfileSettings, value: string) => {
    setIsSaved(false);
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setIsSaved(true);
    addNotification('Profile preferences saved on this device.', NotificationType.Success);
  };

  const initials = profile.displayName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'DR';

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Your account"
        title="Make Auto AI feel like yours."
        description="Keep your driver identity and vehicle context in one place so every tool starts with the right information."
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card className="overflow-hidden">
          <div className="sidebar-surface relative px-5 pb-8 pt-7 text-white sm:px-7">
            <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-[0_12px_30px_rgba(255,105,77,0.25)]">
                {initials}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Driver profile</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{profile.displayName || 'Driver'}</h2>
                <p className="mt-1 text-sm sidebar-muted">{profile.vehicleName || 'Add a vehicle name below'}</p>
              </div>
            </div>
          </div>
          <CardContent className="space-y-5">
            <div>
              <p className={styles.label}>Workspace status</p>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Personal workspace active</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Preferences are saved locally on this device.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-accent px-4 py-3 text-sm leading-6 text-muted-foreground">
              Add your vehicle details to get more useful diagnostics, maintenance schedules, and repair guidance.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile preferences</CardTitle>
            <CardDescription>These details personalize this browser’s Auto AI workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label htmlFor="display-name" className={styles.label}>Display name</label>
                <Input id="display-name" value={profile.displayName} onChange={(event) => updateProfile('displayName', event.target.value)} placeholder="How should Auto AI address you?" />
              </div>
              <div>
                <label htmlFor="vehicle-name" className={styles.label}>Vehicle name</label>
                <Input id="vehicle-name" value={profile.vehicleName} onChange={(event) => updateProfile('vehicleName', event.target.value)} placeholder="e.g. Daily driver" />
              </div>
              <div>
                <label htmlFor="vehicle-details" className={styles.label}>Vehicle details</label>
                <textarea
                  id="vehicle-details"
                  value={profile.vehicleDetails}
                  onChange={(event) => updateProfile('vehicleDetails', event.target.value)}
                  placeholder="e.g. 2020 Toyota Camry, 42,000 miles"
                  rows={4}
                  className={styles.field}
                />
              </div>
              <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">{isSaved ? 'Saved just now' : 'Your changes are not saved yet.'}</p>
                <Button type="submit" className="w-full sm:w-auto">Save preferences</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Profile;