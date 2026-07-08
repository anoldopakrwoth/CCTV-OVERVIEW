from django.contrib import admin
from .models import SecurityNode, TelemetryLog, SecurityAlert


@admin.register(SecurityNode)
class SecurityNodeAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'ip_address', 'status', 'last_seen')
    list_filter = ('status',)
    search_fields = ('name', 'location', 'ip_address')


@admin.register(TelemetryLog)
class TelemetryLogAdmin(admin.ModelAdmin):
    list_display = ('node', 'timestamp', 'pir_state', 'ultrasonic_distance_cm', 'radar_speed_m_s')
    list_filter = ('pir_state',)
    date_hierarchy = 'timestamp'
    search_fields = ('node__name',)


@admin.register(SecurityAlert)
class SecurityAlertAdmin(admin.ModelAdmin):
    list_display = ('node', 'severity', 'is_resolved', 'created_at', 'resolved_at')
    list_filter = ('severity', 'is_resolved')
    search_fields = ('node__name',)
