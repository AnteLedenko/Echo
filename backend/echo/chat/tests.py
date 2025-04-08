from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from listings.models import Listing, Category
from chat.models import Chat, Message

User = get_user_model()

class ChatTests(APITestCase):
    def setUp(self):
        self.sender = User.objects.create_user(
            email="ledenko@example.com", password="whatever123",
            first_name="Ante", last_name="Ledenko"
        )
        self.recipient = User.objects.create_user(
            email="ledenko2@example.com", password="whatever321",
            first_name="Toni", last_name="Ledenko"
        )

        refresh = RefreshToken.for_user(self.sender)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")

        self.category = Category.objects.create(
            name="strin_instruments", slug="string-instruments"
        )
        self.listing = Listing.objects.create(
            user=self.recipient,
            title="Jackson V Guitar",
            description="New",
            price=1000,
            address="whatever 123",
            city="Dublin",
            county="Dublin",
            postal_code="12345",
            category=self.category
        )

    def test_send_message_creates_chat(self):
        data = {
            "recipient_id": self.recipient.id,
            "listing_id": self.listing.id,
            "content": "whats up"
        }
        response = self.client.post("/api/chat/send/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Chat.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 1)

    def test_list_user_chats(self):
        chat = Chat.objects.create(listing=self.listing)
        chat.participants.set([self.sender, self.recipient])
        Message.objects.create(chat=chat, sender=self.sender, content="whats up")

        response = self.client.get("/api/chat/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_chat_messages(self):
        chat = Chat.objects.create(listing=self.listing)
        chat.participants.set([self.sender, self.recipient])
        msg = Message.objects.create(chat=chat, sender=self.sender, content="whats up")

        response = self.client.get(f"/api/chat/{chat.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["messages"]), 1)
        self.assertEqual(response.data["messages"][0]["content"], "whats up")

    def test_mark_messages_as_seen(self):
        chat = Chat.objects.create(listing=self.listing)
        chat.participants.set([self.sender, self.recipient])
        Message.objects.create(chat=chat, sender=self.recipient, content="whats up")

        response = self.client.post(f"/api/chat/{chat.id}/seen/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["marked_as_read"], 1)

