# Admin configuration for the Chat app.
# This registers Chat and Message models with custom display options
# to easily manage chats and messages via Django admin.


from django.contrib import admin

from django.contrib import admin
from .models import Chat, Message


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "created_at", "get_participants")
    list_filter = ("created_at",)
    search_fields = ("listing__title",)

    def get_participants(self, obj):
        return ", ".join([str(user.email) for user in obj.participants.all()])
    get_participants.short_description = "Participants"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "chat", "sender", "content", "timestamp", "is_read")
    list_filter = ("is_read", "timestamp")
    search_fields = ("content", "sender__email", "chat__id")

