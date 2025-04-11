# Custom JWT authentication middleware for Django Channels.
# It extracts the JWT access token from the query string of the WebSocket connection,
# validates it using SimpleJWT, and attaches the corresponding user to the connection scope.
# This allows authenticated WebSocket communication using the same token-based auth as the REST API.

from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract and decode the raw query string from the WebSocket request
        query_string = scope.get("query_string", b"").decode()
        token_param = parse_qs(query_string).get("token")
        
        # If a token is found in the query string validate it and attach the user
        if token_param:
            try:
                access_token = AccessToken(token_param[0])
                user = await self.get_user(access_token["user_id"])
                scope["user"] = user
            except Exception as e:
                # Invalid token: fallback to anonymous user
                scope["user"] = AnonymousUser()
        else:
            # No token provided: treat as anonymous user
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()
