from django.urls import path
from .views import (
    SecurityNodeListView,
    SecurityNodeDetailView,
    TelemetryLogListView,
    SecurityAlertListCreateView,
    SecurityAlertResolveView,
)

urlpatterns = [
    path('nodes/', SecurityNodeListView.as_view(), name='node-list'),
    path('nodes/<int:pk>/', SecurityNodeDetailView.as_view(), name='node-detail'),
    path('nodes/<int:node_id>/telemetry/', TelemetryLogListView.as_view(), name='node-telemetry-list'),
    path('telemetry/', TelemetryLogListView.as_view(), name='telemetry-list'),
    path('nodes/<int:node_id>/alerts/', SecurityAlertListCreateView.as_view(), name='node-alerts-list-create'),
    path('alerts/', SecurityAlertListCreateView.as_view(), name='alerts-list-create'),
    path('alerts/<int:alert_id>/resolve/', SecurityAlertResolveView.as_view(), name='alert-resolve'),
]
