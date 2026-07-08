from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from security_dashboard.api.models import SecurityNode, TelemetryLog, SecurityAlert


class SecurityTelemetryConsumer(JsonWebsocketConsumer):
    group_name = 'security_telemetry'

    def connect(self):
        self.accept()
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.send_json({'type': 'connection.accepted', 'message': 'Connected to security telemetry feed.'})

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)

    def receive_json(self, content, **kwargs):
        node_id = content.get('node_id')
        pir_state = content.get('pir_state')
        ultrasonic_distance = content.get('ultrasonic_distance_cm')
        radar_speed = content.get('radar_speed_m_s')

        node = SecurityNode.objects.filter(pk=node_id).first()
        if not node:
            self.send_json({'type': 'error', 'message': 'Invalid node_id.'})
            return

        telemetry = TelemetryLog.objects.create(
            node=node,
            pir_state=bool(pir_state),
            ultrasonic_distance_cm=int(ultrasonic_distance),
            radar_speed_m_s=float(radar_speed),
        )

        node.last_seen = telemetry.timestamp
        node.status = 'active'
        node.save(update_fields=['last_seen', 'status'])

        severity = self._determine_alert_severity(pir_state, ultrasonic_distance, radar_speed)
        alert = None
        if severity in {'medium', 'high'}:
            alert = SecurityAlert.objects.create(
                node=node,
                severity=severity,
                video_clip_url=self._build_video_clip_url(node, telemetry),
            )

        payload = {
            'type': 'telemetry.update',
            'node_id': node.id,
            'timestamp': telemetry.timestamp.isoformat(),
            'pir_state': telemetry.pir_state,
            'ultrasonic_distance_cm': telemetry.ultrasonic_distance_cm,
            'radar_speed_m_s': float(telemetry.radar_speed_m_s),
            'alert': {
                'severity': severity,
                'id': alert.id if alert else None,
                'video_clip_url': alert.video_clip_url if alert else None,
                'is_resolved': alert.is_resolved if alert else None,
            },
        }

        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'broadcast_telemetry',
                'payload': payload,
            },
        )

    def broadcast_telemetry(self, event):
        self.send_json(event['payload'])

    def _determine_alert_severity(self, pir_state, ultrasonic_distance, radar_speed):
        if pir_state and ultrasonic_distance is not None and radar_speed is not None:
            if pir_state and ultrasonic_distance < 150 and radar_speed > 0:
                return 'high'
            if pir_state:
                return 'medium'
        return 'low'

    def _build_video_clip_url(self, node, telemetry):
        return f'/media/clips/{node.id}/{telemetry.id}.mp4'
