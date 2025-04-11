import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from .models import Chat, Message

User = get_user_model()


# Consumer for handling WebSocket connections for chat messaging
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.chat_id = self.scope['url_route']['kwargs']['chat_id']
            self.sender = self.scope["user"]
            
            # Only allow authenticated users to connect
            if not self.sender.is_authenticated:
                await self.close()
                return

            # Check if chat exists
            chat = await self.get_chat_by_id(self.chat_id)
            if not chat:
                await self.close()
                return

            self.chat = chat
            self.room_name = f"chat_{self.chat.id}"

            # Join WebSocket group specific to the chat room
            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )
            await self.accept()

        except Exception as e:
            await self.close()

    async def disconnect(self, close_code):
        # Leave the chat room group on disconnect
        try:
            if hasattr(self, "room_name"):
                await self.channel_layer.group_discard(
                    self.room_name,
                    self.channel_name
                )
        except Exception as e:
            await self.close()

    async def receive(self, text_data):
        try:
            # Handle incoming message from WebSocket
            data = json.loads(text_data)
            message_text = data.get("message")

            if message_text:
                message = await self.save_message(message_text)

                # Broadcast message to all group participants

                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "chat_message",
                        "message": message_text,
                        "sender_id": self.sender.id,
                        "sender_name": f"{self.sender.first_name} {self.sender.last_name}",
                        "timestamp": str(message.timestamp),
                    }
                )
        except Exception as e:
            await self.close()

    async def chat_message(self, event):
        # Send message data back to client
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_name": event["sender_name"],
            "timestamp": event["timestamp"]
        }))

    @staticmethod
    @sync_to_async
    def get_chat_by_id(chat_id):
        # Retrieve chat by ID, or return None if it doesn't exist
        try:
            return Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, message_text):
        # Save new message to database
        return Message.objects.create(
            chat=self.chat,
            sender=self.sender,
            content=message_text
        )


# Consumer for handling real-time notifications 
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_authenticated:
            self.group_name = f"notifications_{user.id}"

            # Join notifications group for current user
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notify_new_message(self, event):
         # Send notifications to client
        await self.send(text_data=json.dumps(event["data"]))
