
export enum NotificationType {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Info = 'INFO',
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

export interface DiagnosticResult {
  possible_causes: string[];
  recommended_actions: string[];
  severity_level: 'Low' | 'Medium' | 'High';
}

export interface MaintenanceTask {
  task_name: string;
  interval_miles: number;
  description: string;
}

export interface MaintenanceScheduleResult {
  schedule: MaintenanceTask[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export type SearchSourceType = 'web' | 'maps';

export interface SearchSource {
  title: string;
  uri: string;
  type: SearchSourceType;
}

export interface SearchResult {
  markdown: string;
  sources: SearchSource[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface ChatSession {
  sendMessageStream: (message: string) => AsyncIterable<string>;
}