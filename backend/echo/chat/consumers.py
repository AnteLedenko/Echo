import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from .models import Chat, Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            print("webSocket connect called")
            print("scope query:", self.scope.get("query_string", b""))
            self.chat_id = self.scope['url_route']['kwargs']['chat_id']
            self.sender = self.scope["user"]
            print("sender in connect():", self.sender)

            if not self.sender.is_authenticated:
                print("unauthenticated user — closing")
                await self.close()
                return

            chat = await self.get_chat_by_id(self.chat_id)
            if not chat:
                print("chat not found, closing")
                await self.close()
                return

            self.chat = chat
            self.room_name = f"chat_{self.chat.id}"
            print("connected to room:", self.room_name)

            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )
            await self.accept()
        except Exception as e:
            print("error in connect():", e)
            await self.close()

    async def disconnect(self, close_code):
        print("disconnected:", close_code)
        try:
            if hasattr(self, "room_name"):
                await self.channel_layer.group_discard(
                    self.room_name,
                    self.channel_name
                )
        except Exception as e:
            print("error in disconnect():", e)

    async def receive(self, text_data):
        try:
            print("received:", text_data)
            data = json.loads(text_data)
            message_text = data.get("message")

            if message_text:
                message = await self.save_message(message_text)

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
            print("error in receive():", e)

    async def chat_message(self, event):
        print("sending message:", event)
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_name": event["sender_name"],
            "timestamp": event["timestamp"]
        }))

    @staticmethod
    @sync_to_async
    def get_chat_by_id(chat_id):
        try:
            return Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, message_text):
        return Message.objects.create(
            chat=self.chat,
            sender=self.sender,
            content=message_text
        )

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_authenticated:
            self.group_name = f"notifications_{user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notify_new_message(self, event):
        await self.send(text_data=json.dumps(event["data"]))
