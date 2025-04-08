from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        token_param = parse_qs(query_string).get("token")

        if token_param:
            print("token param:", token_param)
            try:
                access_token = AccessToken(token_param[0])
                user = await self.get_user(access_token["user_id"])
                print("authenticated user:", user)
                scope["user"] = user
            except Exception as e:
                print("token error:", e)
                scope["user"] = AnonymousUser()
        else:
            print("no token in query")
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()
