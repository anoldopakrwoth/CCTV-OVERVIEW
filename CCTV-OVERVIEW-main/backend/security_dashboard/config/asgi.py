import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import security_dashboard.websocket.routing as websocket_routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'security_dashboard.config.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(websocket_routing.websocket_urlpatterns)
    ),
})
