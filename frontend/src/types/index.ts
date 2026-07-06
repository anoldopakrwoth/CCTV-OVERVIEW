export type CameraStatus = 'online' | 'offline';

export interface Camera {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
  streamUrl: string;
}

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface Alert {
  id: number;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolvedStatus: boolean;
  cameraName?: string;
  videoClipUrl?: string;
}

export interface SuspectCapture {
  id: number;
  imageUrl: string;
  timestamp: string;
  cameraName: string;
  tags: string[];
  details: string;
  confidenceScore?: number;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface DashboardMetrics {
  connectedCameras: number;
  totalCameras: number;
  alertsToday: number;
  unresolvedAlerts: number;
  onlinePercentage: number;
}
