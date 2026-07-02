from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'security_dashboard.api'
    verbose_name = 'Security Dashboard API'
