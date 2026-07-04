import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';

const initialCameras = [
  {
    id: 'N-01',
    name: 'North Gate Cam',
    location: 'North Perimeter',
    motionDetected: false,
    distance: 142,
    radarVelocity: 0.8,
    streamPreview: 'https://images.unsplash.com/photo-1511871893393-82e9c16b81e3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'N-02',
    name: 'East Corridor Cam',
    location: 'East Wing',
    motionDetected: true,
    distance: 96,
    radarVelocity: 1.6,
    streamPreview: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'N-03',
    name: 'South Dock Cam',
    location: 'South Dock',
    motionDetected: false,
    distance: 184,
    radarVelocity: 0.2,
    streamPreview: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'N-04',
    name: 'Rooftop Watch Cam',
    location: 'Roofline',
    motionDetected: true,
    distance: 118,
    radarVelocity: 2.1,
    streamPreview: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  },
];

const historicalLogs = [
  { timestamp: '06:42:18', nodeId: 'N-02', level: 'High', review: 'Review Footage' },
  { timestamp: '06:10:03', nodeId: 'N-04', level: 'Medium', review: 'Review Footage' },
  { timestamp: '05:58:21', nodeId: 'N-01', level: 'Low', review: 'Review Footage' },
  { timestamp: '05:21:55', nodeId: 'N-03', level: 'High', review: 'Review Footage' },
];

const getLevelClasses = (level) => {
  if (level === 'High') return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30';
  if (level === 'Medium') return 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30';
  return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30';
};

function App() {
  const [cameras, setCameras] = useState(initialCameras);
  const [alert, setAlert] = useState(null);
  const [logs, setLogs] = useState(historicalLogs);
  const [connectionStatus, setConnectionStatus] = useState('Connecting to live telemetry…');

  useEffect(() => {
    let socket;
    let fallbackTimer;

    try {
      socket = new WebSocket('wss://echo.websocket.events');

      socket.onopen = () => {
        setConnectionStatus('Live telemetry connected');
        socket.send(JSON.stringify({ type: 'subscribe', channel: 'security-feed' }));
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'security-update') {
            setCameras((prev) =>
              prev.map((camera) =>
                camera.id === payload.nodeId
                  ? {
                      ...camera,
                      motionDetected: payload.motionDetected,
                      distance: payload.distance,
                      radarVelocity: payload.radarVelocity,
                    }
                  : camera,
              ),
            );
          }

          if (payload.type === 'alert') {
            setAlert({
              nodeId: payload.nodeId,
              nodeLocation: payload.nodeLocation,
              time: payload.time,
              level: payload.level,
            });
          }
        } catch (error) {
          console.warn('Telemetry payload ignored', error);
        }
      };

      socket.onerror = () => {
        setConnectionStatus('Fallback telemetry active');
      };
    } catch (error) {
      console.warn('WebSocket not available in this browser context', error);
      setConnectionStatus('Fallback telemetry active');
    }

    fallbackTimer = setInterval(() => {
      setCameras((prev) =>
        prev.map((camera, index) => ({
          ...camera,
          distance: Math.max(70, Math.min(260, camera.distance + (index % 2 === 0 ? 4 : -5))),
          radarVelocity: Number((camera.radarVelocity + (index % 2 === 0 ? 0.15 : -0.12)).toFixed(1)),
          motionDetected: index === 1 ? !camera.motionDetected : camera.motionDetected,
        })),
      );
    }, 2400);

    return () => {
      if (socket) socket.close();
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
  }, []);

  const summary = useMemo(() => {
    const activeNodes = cameras.filter((camera) => camera.motionDetected).length;
    const avgDistance = Math.round(cameras.reduce((sum, camera) => sum + camera.distance, 0) / cameras.length);
    return { activeNodes, avgDistance };
  }, [cameras]);

  return (
    <Dashboard
      cameras={cameras}
      alert={alert}
      logs={logs}
      summary={summary}
      onAcknowledge={() => setAlert(null)}
      connectionStatus={connectionStatus}
      getLevelClasses={getLevelClasses}
    />
  );
}

export default App;
