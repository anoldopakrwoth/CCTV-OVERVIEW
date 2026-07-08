from django.db import models
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status, views
from rest_framework.response import Response

from .models import SecurityNode, TelemetryLog, SecurityAlert
from .serializers import SecurityNodeSerializer, TelemetryLogSerializer, SecurityAlertSerializer


class RootInfoView(views.APIView):
    def get(self, request):
        return Response(
            {
                'service': 'Security Dashboard API',
                'status': 'ok',
                'routes': [
                    '/api/nodes/',
                    '/api/telemetry/',
                    '/api/alerts/',
                ],
            }
        )


class SecurityNodeListCreateView(generics.ListCreateAPIView):
    queryset = SecurityNode.objects.annotate(
        active_alerts_count=models.Count(
            'alerts',
            filter=models.Q(alerts__is_resolved=False)
        )
    )
    serializer_class = SecurityNodeSerializer


class SecurityNodeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SecurityNode.objects.all()
    serializer_class = SecurityNodeSerializer


class TelemetryLogListCreateView(generics.ListCreateAPIView):
    serializer_class = TelemetryLogSerializer

    def get_queryset(self):
        node_id = self.kwargs.get('node_id')
        queryset = TelemetryLog.objects.select_related('node').order_by('-timestamp')
        if node_id:
            queryset = queryset.filter(node_id=node_id)
        return queryset

    def perform_create(self, serializer):
        node_id = self.kwargs.get('node_id')
        if node_id:
            node = get_object_or_404(SecurityNode, pk=node_id)
            serializer.save(node=node)
        else:
            serializer.save()


class SecurityAlertDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SecurityAlert.objects.all()
    serializer_class = SecurityAlertSerializer


class SecurityAlertListCreateView(generics.ListCreateAPIView):
    serializer_class = SecurityAlertSerializer

    def get_queryset(self):
        node_id = self.kwargs.get('node_id')
        queryset = SecurityAlert.objects.select_related('node').order_by('-created_at')
        if node_id:
            queryset = queryset.filter(node_id=node_id)
        return queryset

    def create(self, request, *args, **kwargs):
        payload = request.data.copy()
        node_id = kwargs.get('node_id')
        if node_id:
            payload['node'] = node_id
        serializer = self.get_serializer(data=payload)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SecurityAlertResolveView(views.APIView):
    def patch(self, request, alert_id):
        alert = get_object_or_404(SecurityAlert, pk=alert_id)
        alert.is_resolved = request.data.get('is_resolved', True)
        if alert.is_resolved and alert.resolved_at is None:
            alert.resolved_at = timezone.now()
        alert.save(update_fields=['is_resolved', 'resolved_at'])
        return Response(SecurityAlertSerializer(alert).data)
