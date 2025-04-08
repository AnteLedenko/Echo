from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class RegistrationTests(APITestCase):
    def test_register_user_successfully(self):
        data = {
            "email": "ledenko@example.com",
            "first_name": "Ante",
            "last_name": "Ledenko",
            "password1": "whatever123",
            "password2": "whatever123",
        }

        response = self.client.post("/api/users/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="ledenko@example.com").exists())

    def test_registration_duplicate_email_fails(self):
        User.objects.create_user(email="ledenko@example.com",password="whatever123",first_name="Ante",last_name="Ledenko")

        data = {
            "email": "ledenko@example.com",
            "first_name": "Ante",
            "last_name": "Ledenko",
            "password1": "whatever123",
            "password2": "whatever123",
        }

        response = self.client.post("/api/users/register/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", str(response.data).lower())

class LoginLogoutTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="ledenko@example.com",
            password="whatever123",
            first_name="Ante",
            last_name="Ledenko"
        )

    def test_login_successful(self):
        data = {
            "email": "ledenko@example.com",
            "password": "whatever123"
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_logout_successful(self):
        response = self.client.post("/api/users/login/", {
            "email": "ledenko@example.com",
            "password": "whatever123"
        })
        access_token = response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.post("/api/users/logout/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ProfileUpdateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="ledenko@example.com",
            password="whatever123",
            first_name="Ante",
            last_name="Ledenko"
        )

    def test_update_profile(self):
        response = self.client.post("/api/users/login/", {
            "email": "ledenko@example.com",
            "password": "whatever123"
        })
        token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        update_data = {
            "first_name": "Toni",
            "last_name": "Ledenko"
        }
        response = self.client.put("/api/users/profile/update/", update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Toni")
        self.assertEqual(self.user.last_name, "Ledenko")
