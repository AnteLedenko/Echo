"""
ASGI config for echo project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

# ASGI config for Echo project.
# Handles both HTTP and WebSocket connections.
# WebSocket connections are routed through JWTAuthMiddleware
# for authentication and then passed to the chat app's URLRouter.

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'echo.settings')
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat.routing import websocket_urlpatterns
from chat.token_auth import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
