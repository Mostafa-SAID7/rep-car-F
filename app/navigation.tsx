import React from 'react';
import { ICONS } from '../constants';

export interface NavigationItem {
  to: string;
  label: string;
  eyebrow: string;
  cardTitle?: string;
  cardDescription?: string;
  icon: React.ReactNode;
}

export const navigationItems: NavigationItem[] = [
  { to: '/', icon: ICONS.dashboard, label: 'Dashboard', eyebrow: 'Dashboard' },
  {
    to: '/diagnostics',
    icon: ICONS.diagnostics,
    label: 'Diagnostics',
    eyebrow: 'AI diagnostics',
    cardTitle: 'AI Diagnostics',
    cardDescription: 'Describe your car\'s issue, upload a photo, and get instant diagnostic help.',
  },
  {
    to: '/schedule',
    icon: ICONS.schedule,
    label: 'Maintenance',
    eyebrow: 'Stay ahead',
    cardTitle: 'Maintenance Schedules',
    cardDescription: 'Generate a personalized maintenance schedule for your vehicle.',
  },
  {
    to: '/guides',
    icon: ICONS.guides,
    label: 'DIY Guides',
    eyebrow: 'Learn by doing',
    cardTitle: 'DIY Repair Guides',
    cardDescription: 'Find step-by-step guides for common repairs and maintenance tasks.',
  },
  {
    to: '/parts',
    icon: ICONS.parts,
    label: 'Find Parts',
    eyebrow: 'Parts finder',
    cardTitle: 'Find Parts',
    cardDescription: 'Search for up-to-date car parts information and purchasing options online.',
  },
  {
    to: '/shops',
    icon: ICONS.shops,
    label: 'Find Shops',
    eyebrow: 'Local network',
    cardTitle: 'Find Local Shops',
    cardDescription: 'Locate nearby repair shops, dealerships, and part stores using your location.',
  },
];

export const profileNavigationItem: NavigationItem = {
  to: '/profile',
  label: 'Profile',
  eyebrow: 'Your account',
  icon: ICONS.car,
};

export const getNavigationItem = (pathname: string): NavigationItem | undefined =>
  pathname === profileNavigationItem.to
    ? profileNavigationItem
    : navigationItems.find((item) => item.to === pathname);