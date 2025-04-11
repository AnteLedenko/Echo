from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from cloudinary.models import CloudinaryField


# Here we have a custom user manager to override the default behavior of creating users and superusers
class CustomUserManager(BaseUserManager):
    # Here we have a method for creating a regular user
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # Method for creating a superuser
    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, first_name, last_name, password, **extra_fields)


# Custom user model using email instead of username as the unique identifier
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = None
    profile_picture = CloudinaryField('image', blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email
