from django.urls import re_path
from .consumers import SecurityTelemetryConsumer

websocket_urlpatterns = [
    re_path(r'ws/telemetry/$', SecurityTelemetryConsumer.as_asgi()),
]
