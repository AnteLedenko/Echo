# Models for the chat app, including Chat and Message.
# Chats are linked to listings and support messages between participants.

from django.db import models
from django.conf import settings
from listings.models import Listing

User = settings.AUTH_USER_MODEL


# This mdel represents a chat between two users about a specific listing
class Chat(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="chats")
    participants = models.ManyToManyField(User, related_name="chats")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat for '{self.listing.title}'"

    # Retrieves an existing chat between two users or creates a new one
    @classmethod
    def get_or_create_between_users(cls, user1, user2, listing=None):
       
        qs = cls.objects.filter(participants=user1).filter(participants=user2)
        if listing:
            qs = qs.filter(listing=listing)

        chat = qs.first()
        if chat:
            return chat, False

        chat = cls.objects.create(listing=listing)
        chat.participants.set([user1, user2])
        return chat, True


# This model represents an individual message sent in a chat
class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} - {self.content[:30]}"
