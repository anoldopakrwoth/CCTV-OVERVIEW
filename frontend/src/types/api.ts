export interface SecurityNodeApi {
  id: number;
  name: string;
  location: string;
  ip_address: string;
  camera_stream_url: string;
  status: 'active' | 'offline';
  last_seen: string | null;
  latest_telemetry: TelemetryLogApi | null;
  active_alerts_count: number;
}

export interface TelemetryLogApi {
  id: number;
  timestamp: string;
  node: number;
  node_name: string;
  pir_state: boolean;
  ultrasonic_distance_cm: number;
  radar_speed_m_s: string;
}

export interface SecurityAlertApi {
  id: number;
  created_at: string;
  node: number;
  node_name: string;
  severity: 'low' | 'medium' | 'high';
  video_clip_url: string;
  is_resolved: boolean;
  resolved_at: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
