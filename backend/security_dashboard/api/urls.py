from django.urls import path
from .views import (
    RootInfoView,
    SecurityNodeListCreateView,
    SecurityNodeDetailView,
    TelemetryLogListCreateView,
    SecurityAlertListCreateView,
    SecurityAlertDetailView,
    SecurityAlertResolveView,
)

urlpatterns = [
    path('', RootInfoView.as_view(), name='api-root'),
    path('nodes/', SecurityNodeListCreateView.as_view(), name='node-list-create'),
    path('nodes/<int:pk>/', SecurityNodeDetailView.as_view(), name='node-detail'),
    path('nodes/<int:node_id>/telemetry/', TelemetryLogListCreateView.as_view(), name='node-telemetry-list-create'),
    path('telemetry/', TelemetryLogListCreateView.as_view(), name='telemetry-list-create'),
    path('nodes/<int:node_id>/alerts/', SecurityAlertListCreateView.as_view(), name='node-alerts-list-create'),
    path('alerts/', SecurityAlertListCreateView.as_view(), name='alerts-list-create'),
    path('alerts/<int:pk>/', SecurityAlertDetailView.as_view(), name='alert-detail'),
    path('alerts/<int:alert_id>/resolve/', SecurityAlertResolveView.as_view(), name='alert-resolve'),
]
