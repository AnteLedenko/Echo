# WebSocket routing for chat and notification consumers.
# Each path is matched to its corresponding ASGI consumer class.

from django.urls import re_path
from .consumers import ChatConsumer, NotificationConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<chat_id>\d+)/$", ChatConsumer.as_asgi()),
    re_path(r"ws/notifications/$", NotificationConsumer.as_asgi()),
]
