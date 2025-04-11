# Basic test for the home page API to ensure it returns a successful response

from rest_framework.test import APITestCase
from rest_framework import status

class HomePageTests(APITestCase):
    def test_home_api_returns_200(self):
        response = self.client.get("/api/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
