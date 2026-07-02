from django.db import models


class SecurityNode(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('offline', 'Offline'),
    ]

    name = models.CharField(max_length=120)
    location = models.CharField(max_length=160)
    ip_address = models.GenericIPAddressField(protocol='both', unpack_ipv4=True)
    camera_stream_url = models.URLField(max_length=300)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='active')
    last_seen = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.location})'


class TelemetryLog(models.Model):
    pir_state = models.BooleanField()
    ultrasonic_distance_cm = models.PositiveIntegerField()
    radar_speed_m_s = models.DecimalField(max_digits=6, decimal_places=2)
    node = models.ForeignKey(SecurityNode, related_name='telemetry_logs', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [models.Index(fields=['node', 'timestamp'])]

    def __str__(self):
        return f'Telemetry {self.node.name} @ {self.timestamp.isoformat()}'


class SecurityAlert(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    node = models.ForeignKey(SecurityNode, related_name='alerts', on_delete=models.CASCADE)
    severity = models.CharField(max_length=8, choices=SEVERITY_CHOICES)
    video_clip_url = models.URLField(max_length=400, blank=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['node', 'severity', 'is_resolved'])]

    def __str__(self):
        return f'Alert {self.severity.upper()} for {self.node.name} @ {self.created_at.isoformat()}'
