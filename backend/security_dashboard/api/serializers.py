from rest_framework import serializers
from .models import SecurityNode, TelemetryLog, SecurityAlert


class TelemetryLogSerializer(serializers.ModelSerializer):
    node_name = serializers.CharField(source='node.name', read_only=True)

    class Meta:
        model = TelemetryLog
        fields = [
            'id',
            'timestamp',
            'node',
            'node_name',
            'pir_state',
            'ultrasonic_distance_cm',
            'radar_speed_m_s',
        ]
        read_only_fields = ['id', 'timestamp', 'node', 'node_name']


class SecurityAlertSerializer(serializers.ModelSerializer):
    node_name = serializers.CharField(source='node.name', read_only=True)

    class Meta:
        model = SecurityAlert
        fields = [
            'id',
            'created_at',
            'node',
            'node_name',
            'severity',
            'video_clip_url',
            'is_resolved',
            'resolved_at',
        ]
        read_only_fields = ['id', 'created_at', 'resolved_at', 'node_name']


class SecurityNodeSerializer(serializers.ModelSerializer):
    latest_telemetry = serializers.SerializerMethodField()
    active_alerts_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = SecurityNode
        fields = [
            'id',
            'name',
            'location',
            'ip_address',
            'camera_stream_url',
            'status',
            'last_seen',
            'latest_telemetry',
            'active_alerts_count',
        ]

    def get_latest_telemetry(self, obj):
        latest = obj.telemetry_logs.order_by('-timestamp').first()
        return TelemetryLogSerializer(latest).data if latest else None
