from rest_framework import serializers
from .models import Chat, Message
from users.serializers import ProfileSerializer
from listings.serializers import ListingTitleSerializer
from listings.models import Listing

class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)  # Include sender profile
    chat = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "chat", "sender", "content", "timestamp", "is_read"]

class SimpleListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ["id", "title"]

class ChatSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    listing = ListingTitleSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "participants", "listing", "last_message", "unread_count", "created_at"]

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by("-timestamp").first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            unread = obj.messages.filter(is_read=False).exclude(sender=request.user).count()
            print(f"🔍 Chat {obj.id} unread for {request.user.email}: {unread}")
            return unread
        return 0
