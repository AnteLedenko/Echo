from django.urls import path
from .views import ChatListView, ChatMessagesView, SendMessageView, MessageSeenView

urlpatterns = [
    path("", ChatListView.as_view(), name="chat-list"),
    path("<int:chat_id>/", ChatMessagesView.as_view(), name="chat-messages"),
    path("send/", SendMessageView.as_view(), name="send-message"),
    path("<int:chat_id>/seen/", MessageSeenView.as_view(), name="message-seen"),
]
