# Here we hve serializers for handling user registration, profile data, and password reset logic

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from .models import User


# Used to retrieve and update authenticated user profile data
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "profile_picture", "date_joined")
        read_only_fields = ("id", "email", "date_joined")


# Handles user registration with password confirmation and validation
class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "password1", "password2", "profile_picture")

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        return User.objects.create_user(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password1"],
            profile_picture=validated_data.get("profile_picture")
        )


# Sends password reset email with token and UID link
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user with this email")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f"{settings.FRONTEND_BASE_URL}/auth/reset-password/{uid}/{token}"

        send_mail(
            subject="Reset your Echo password",
            message=f"Click the link to reset your password: {reset_url}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )


# Handles validation and processing of password reset via uid and token
class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            user = User.objects.get(pk=uid)
        except Exception:
            raise serializers.ValidationError("Invalid UID")

        if not PasswordResetTokenGenerator().check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired token")

        validate_password(data["new_password"], user=user)

        self.user = user
        return data

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.save()


