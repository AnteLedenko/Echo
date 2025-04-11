# Serializers for the chat app: handle message serialization,
# chat summaries (with participants, last message, unread count),
# and simple listing references.

from rest_framework import serializers
from .models import Chat, Message
from users.serializers import ProfileSerializer
from listings.serializers import ListingTitleSerializer
from listings.models import Listing


# Serializer for individual message instances including sender info and chat reference
class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)  # Include sender profile
    chat = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "chat", "sender", "content", "timestamp", "is_read"]


# Minimal listing serializer used for chat context id and title only
class SimpleListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ["id", "title"]


# Serializer with chat metadata including participants, last message, unread count and listing
class ChatSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    listing = ListingTitleSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "participants", "listing", "last_message", "unread_count", "created_at"]

    # Returns the latest message in the chat, if available
    def get_last_message(self, obj):
        last_msg = obj.messages.order_by("-timestamp").first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

    # Calculates the number of unread messages for the current user
    def get_unread_count(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            unread = obj.messages.filter(is_read=False).exclude(sender=request.user).count()
            return unread
        return 0
