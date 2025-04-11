# Views for handling chat functionality, including listing user chats,
# sending messages, retrieving message history, and marking messages as read

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from django.db.models import Prefetch

User = get_user_model()


# This view returns a list of all chats the authenticated user is part of
class ChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chats = Chat.objects.filter(participants=request.user) \
            .prefetch_related(
                Prefetch("messages", queryset=Message.objects.order_by("-timestamp"))
            ) \
            .order_by("-created_at")

        serializer = ChatSerializer(chats, many=True, context={"request": request})
        return Response(serializer.data)


# Returns chat details and message history for a specific chat
class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id):
        try:
            chat = Chat.objects.get(id=chat_id, participants=request.user)
        except Chat.DoesNotExist:
            return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

        chat_serializer = ChatSerializer(chat, context={"request": request})
        messages_serializer = MessageSerializer(chat.messages.order_by("timestamp"), many=True)

        return Response({
            "chat": chat_serializer.data,
            "messages": messages_serializer.data
        })


# This view allows an authenticated user to send a message to another user
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipient_id = request.data.get("recipient_id")
        content = request.data.get("content")
        listing_id = request.data.get("listing_id")

        print("incoming chat message")
        print("sender (request.user):", request.user)
        print("recipient_id:", recipient_id)
        print("content:", content)
        print("listing_id:", listing_id)

        if not recipient_id or not content or not listing_id:
            return Response({"detail": "Missing recipient, listing, or content."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({"detail": "Recipient not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            from listings.models import Listing
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({"detail": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

        chat, _ = Chat.get_or_create_between_users(request.user, recipient, listing=listing)

        message = Message.objects.create(
            chat=chat,
            sender=request.user,
            content=content
        )

        return Response({
            "chat_id": chat.id,
            "message": MessageSerializer(message).data
        }, status=status.HTTP_201_CREATED)


# Marks all previously unread messages in the chat as reed by authenticated user
class MessageSeenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, chat_id):
        try:
            chat = Chat.objects.get(id=chat_id, participants=request.user)
        except Chat.DoesNotExist:
            return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

        updated = Message.objects.filter(
            chat=chat,
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)

        return Response({"marked_as_read": updated}, status=status.HTTP_200_OK)